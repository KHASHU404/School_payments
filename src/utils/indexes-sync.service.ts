// src/utils/indexes-sync.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class IndexesSyncService implements OnModuleInit {
  private readonly logger = new Logger(IndexesSyncService.name);
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    try {
      this.logger.log('Syncing mongoose indexes...');
      // This ensures mongoose will sync indexes defined in schemas
      if (!this.connection.db) {
  this.logger.error('Database connection is not ready');
  return;
}
await this.connection.db.admin().ping();

      const models = Object.values(this.connection.models);
      for (const m of models) {
        this.logger.log(`SyncIndexes for model ${m.modelName}`);
        await m.syncIndexes();
      }
      this.logger.log('Indexes synced');
    } catch (err) {
      this.logger.error('Error syncing indexes', err as any);
    }
  }
}
