// src/utils/utils.module.ts
import { Module } from '@nestjs/common';
import { IndexesSyncService } from './indexes-sync.service';

@Module({
  providers: [IndexesSyncService],
  exports: [IndexesSyncService], // if you need to use it elsewhere
})
export class UtilsModule {}
