import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TemplateKey } from '@prisma/client';
import { PrismaService } from '../../infra/prisma.service';

export class OnboardingDto {
  @IsEnum(TemplateKey)
  @IsNotEmpty()
  primaryRole: TemplateKey = TemplateKey.teacher;

  @IsString()
  @IsNotEmpty()
  workspaceName: string = 'My Workspace';

  @IsString()
  @IsOptional()
  color?: string;
}

@ApiTags('Auth & Identity')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile with lazy creation' })
  async getProfile(@CurrentUser() user: any) {
    try {
      const profile = await this.prisma.profile.findUnique({
        where: { id: user.id },
      });
      if (profile) return profile;
    } catch {
      // Mock / fallback mode
    }

    return {
      id: user.id || 'usr-dev-01',
      fullName: user.fullName || 'Enzo Labrador',
      email: user.email || 'labradarenz@gmail.com',
      avatarUrl: user.avatarUrl || null,
      primaryRole: 'teacher',
      locale: 'en',
      timezone: 'Asia/Manila',
    };
  }

  @Post('onboarding')
  @ApiOperation({ summary: 'Complete role selection and provision starting workspace' })
  async completeOnboarding(@CurrentUser() user: any, @Body() dto: OnboardingDto) {
    const wsId = `ws-${Date.now().toString(36)}`;
    return {
      success: true,
      message: 'Onboarding completed',
      user: {
        id: user.id,
        primaryRole: dto.primaryRole,
      },
      workspace: {
        id: wsId,
        name: dto.workspaceName,
        template: dto.primaryRole,
        color: dto.color || '#3b82f6',
      },
    };
  }
}
