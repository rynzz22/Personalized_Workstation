import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { WorkspaceGuard } from '../../common/guards/workspace.guard';

@ApiTags('Business & Commerce')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@Controller('api/v1/workspaces/:workspaceId/business')
export class BusinessController {
  @Get('products')
  @ApiOperation({ summary: 'List inventory products and stock status' })
  listProducts(@Param('workspaceId') workspaceId: string) {
    return [
      { id: 'bp-1', workspaceId, name: 'Bohol Handwoven Rattan Basket', sku: 'RATT-M-01', stock: 4, minStock: 10, price: 550 },
      { id: 'bp-2', workspaceId, name: 'Artisan Coconut Shell Candle', sku: 'CNDL-COC-02', stock: 2, minStock: 8, price: 220 },
      { id: 'bp-3', workspaceId, name: 'Handcrafted Abaca Tote Bag', sku: 'BAG-ABA-03', stock: 24, minStock: 12, price: 680 },
    ];
  }

  @Put('products/:productId/stock')
  @ApiOperation({ summary: 'Adjust product stock count' })
  adjustStock(
    @Param('workspaceId') workspaceId: string,
    @Param('productId') productId: string,
    @Body() body: { amount: number }
  ) {
    return {
      productId,
      adjustedBy: body.amount,
      updatedAt: new Date().toISOString(),
    };
  }

  @Get('sales')
  @ApiOperation({ summary: 'List retail store sales and revenue' })
  listSales(@Param('workspaceId') workspaceId: string) {
    return [
      { id: 'bs-1', workspaceId, customerName: 'Elena Gomez', totalAmount: 1120, profit: 610, date: 'Today' },
      { id: 'bs-2', workspaceId, customerName: 'Dr. Raymond Lim', totalAmount: 960, profit: 480, date: 'Today' },
    ];
  }

  @Get('finance')
  @ApiOperation({ summary: 'Get monthly cashflow, income, expenses, and savings rate' })
  getFinanceSummary(@Param('workspaceId') workspaceId: string) {
    return {
      monthlyIncome: 84500,
      monthlyExpenses: 46200,
      savingsRate: 45.3,
      recentTransactions: [
        { id: 'ft-1', description: 'Store POS Sales Batch', amount: 4850, type: 'income', date: '2026-10-04' },
      ],
    };
  }
}
