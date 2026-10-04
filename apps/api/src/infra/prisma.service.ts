import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private isConnected = false;

  constructor() {
    super({
      log: ['error', 'warn'],
    });
  }

  async onModuleInit() {
    try {
      if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('mock')) {
        await this.$connect();
        this.isConnected = true;
        console.log('[PrismaService] Connected to database');
      }
    } catch (err: any) {
      console.warn('[PrismaService] Database offline or mock mode — proceeding gracefully');
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.$disconnect();
    }
  }
}
