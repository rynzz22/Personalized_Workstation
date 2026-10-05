import { Module } from '@nestjs/common';
import { TrackersController } from './trackers.controller';

@Module({
  controllers: [TrackersController],
})
export class TrackersModule {}
