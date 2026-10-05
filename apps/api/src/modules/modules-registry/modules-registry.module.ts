import { Module } from '@nestjs/common';
import { ModulesRegistryController } from './modules-registry.controller';

@Module({
  controllers: [ModulesRegistryController],
})
export class ModulesRegistryModule {}
