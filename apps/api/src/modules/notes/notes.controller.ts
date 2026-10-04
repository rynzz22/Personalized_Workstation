import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../../common/guards/workspace.guard';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  title: string = '';

  @IsString()
  @IsOptional()
  body?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  color?: string;
}

@ApiTags('Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@Controller('api/v1/workspaces/:workspaceId/notes')
export class NotesController {
  @Get()
  @ApiOperation({ summary: 'List notes for workspace' })
  listNotes(@Param('workspaceId') workspaceId: string) {
    return [
      {
        id: 'n-1',
        workspaceId,
        title: 'Lab Safety Protocol Refresher',
        body: 'Ensure all students wear goggles before lighting the Bunsen burners.',
        category: 'Lab Safety',
        pinned: true,
        color: '#fef3c7',
        updatedAt: '2026-10-03',
      },
    ];
  }

  @Post()
  @ApiOperation({ summary: 'Create note' })
  createNote(@Param('workspaceId') workspaceId: string, @Body() dto: CreateNoteDto) {
    return {
      id: `n-${Date.now()}`,
      workspaceId,
      ...dto,
      pinned: false,
      createdAt: new Date().toISOString(),
    };
  }

  @Delete(':noteId')
  @ApiOperation({ summary: 'Delete note' })
  deleteNote(@Param('workspaceId') workspaceId: string, @Param('noteId') noteId: string) {
    return { success: true, message: `Note ${noteId} deleted` };
  }
}
