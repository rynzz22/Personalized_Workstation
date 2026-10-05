// Isolated browser-test harness. Never imported by the production application.
const { Test } = require('@nestjs/testing');
const { ValidationPipe } = require('@nestjs/common');
const { CoreModule } = require('../dist/modules/core/core.module');
const { InfraModule } = require('../dist/infra/infra.module');
const { PrismaService } = require('../dist/infra/prisma.service');
const { SupabaseService } = require('../dist/infra/supabase.service');
const { ResponseInterceptor } = require('../dist/common/interceptors/response.interceptor');
const { randomUUID } = require('node:crypto');
async function main() {
 if(process.env.NODE_ENV!=='test'||!new URL(process.env.DATABASE_URL).pathname.endsWith('_test')) throw Error('Browser harness requires NODE_ENV=test and a dedicated *_test database');
 const id=randomUUID();
 const token='browser-fixture-'+randomUUID();
 const user={id,email:'browser@example.test',aud:'authenticated',role:'authenticated',app_metadata:{},user_metadata:{},created_at:new Date().toISOString()};
 const module=await Test.createTestingModule({imports:[InfraModule,CoreModule]}).overrideProvider(SupabaseService).useValue({verifyToken:async t=>t===token?user:null}).compile();
 const app=module.createNestApplication();app.enableCors({origin:['http://127.0.0.1:5173','http://localhost:5173'],credentials:true});
 app.useGlobalPipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,transform:true}));app.useGlobalInterceptors(new ResponseInterceptor());
 const express=app.getHttpAdapter().getInstance();
 express.post('/auth/v1/token',(_req,res)=>res.json({access_token:token,token_type:'bearer',expires_in:3600,refresh_token:token,user}));
 express.get('/auth/v1/user',(_req,res)=>res.json(user));
 express.post('/auth/v1/logout',(_req,res)=>res.status(204).end());
 express.get('/fixture/ready',(_req,res)=>res.json({ready:true}));
 await app.listen(55433,'127.0.0.1');
 const shutdown=async()=>{await app.get(PrismaService).profile.deleteMany({where:{id}});await app.close();process.exit(0);};
 process.on('SIGTERM',shutdown);process.on('SIGINT',shutdown);
}
main().catch(error=>{console.error(error.message);process.exit(1);});
