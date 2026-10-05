import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { IdentityController, WorkspaceController, CatalogController, ProductivityController } from './core.controller';
@Module({ controllers: [IdentityController, WorkspaceController, CatalogController, ProductivityController], providers: [CoreService] })
export class CoreModule {}
