import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { randomUUID } from 'node:crypto';
import { CoreModule } from '../src/modules/core/core.module';
import { InfraModule } from '../src/infra/infra.module';
import { PrismaService } from '../src/infra/prisma.service';
import { SupabaseService } from '../src/infra/supabase.service';
describe('workspace isolation over HTTP with real Postgres', () => {
  let app: any;
  let db: PrismaService;
  const userA = randomUUID(),
    userB = randomUUID(),
    viewer = randomUUID();
  let a: string, b: string, taskId: string;
  beforeAll(async () => {
    if (!process.env.DATABASE_URL) throw Error('DATABASE_URL is required for e2e tests');
    const module = await Test.createTestingModule({ imports: [InfraModule, CoreModule] })
      .overrideProvider(SupabaseService)
      .useValue({
        verifyToken: async (token: string) =>
          ([userA, userB, viewer] as string[]).includes(token) ? { id: token } : null,
      })
      .compile();
    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
    db = app.get(PrismaService);
    await db.profile.createMany({
      data: [userA, userB, viewer].map((id) => ({ id, fullName: 'Isolation test' })),
    });
    const ws = await db.workspace.create({
      data: {
        name: 'A',
        ownerId: userA,
        members: {
          create: [
            { userId: userA, role: 'owner' },
            { userId: viewer, role: 'viewer' },
          ],
        },
      },
    });
    a = ws.id;
    b = (
      await db.workspace.create({
        data: { name: 'B', ownerId: userB, members: { create: { userId: userB, role: 'owner' } } },
      })
    ).id;
    taskId = (await db.task.create({ data: { workspaceId: b, title: 'Private B task' } })).id;
  }, 30000);
  afterAll(async () => {
    if (db) await db.profile.deleteMany({ where: { id: { in: [userA, userB, viewer] } } });
    if (app) await app.close();
  });
  test('missing token returns 401', () =>
    request(app.getHttpServer()).get('/api/v1/workspaces').expect(401));
  test('foreign workspace returns 404', () =>
    request(app.getHttpServer())
      .get('/api/v1/workspaces/' + b + '/tasks')
      .auth(userA, { type: 'bearer' })
      .expect(404));
  test('foreign task cannot be read through an owned workspace', () =>
    request(app.getHttpServer())
      .get('/api/v1/workspaces/' + a + '/tasks/' + taskId)
      .auth(userA, { type: 'bearer' })
      .expect(404));
  test('foreign task cannot be changed', () =>
    request(app.getHttpServer())
      .patch('/api/v1/workspaces/' + a + '/tasks/' + taskId)
      .auth(userA, { type: 'bearer' })
      .send({ title: 'stolen' })
      .expect(404));
  test('viewer cannot write', () =>
    request(app.getHttpServer())
      .post('/api/v1/workspaces/' + a + '/tasks')
      .auth(viewer, { type: 'bearer' })
      .send({ title: 'blocked' })
      .expect(403));
  test('create, complete and retrieve persists data', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/v1/workspaces/' + a + '/tasks')
      .auth(userA, { type: 'bearer' })
      .send({ title: 'Persistent task' })
      .expect(201);
    await request(app.getHttpServer())
      .post('/api/v1/workspaces/' + a + '/tasks/' + created.body.id + '/complete')
      .auth(userA, { type: 'bearer' })
      .send({ completed: true })
      .expect(201);
    const result = await request(app.getHttpServer())
      .get('/api/v1/workspaces/' + a + '/tasks/' + created.body.id)
      .auth(userA, { type: 'bearer' })
      .expect(200);
    expect(result.body.status).toBe('done');
    expect(result.body.completedAt).toBeTruthy();
  });
  test('bulk reorder rolls back when any task is foreign', async () => {
    const own = await db.task.create({ data: { workspaceId: a, title: 'Own', position: 9 } });
    await request(app.getHttpServer())
      .post('/api/v1/workspaces/' + a + '/tasks/reorder')
      .auth(userA, { type: 'bearer' })
      .send({ ids: [own.id, taskId] })
      .expect(404);
    expect((await db.task.findUnique({ where: { id: own.id } }))?.position).toBe(9);
  });
});
