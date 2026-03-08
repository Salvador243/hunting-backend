import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@Controller('admin/notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('isRead') isRead?: string,
  ) {
    const isReadBool =
      isRead === 'true' ? true : isRead === 'false' ? false : undefined;
    return this.notificationsService.findAll(pagination, isReadBool);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Obtener contador de notificaciones no leídas' })
  async getUnreadCount() {
    const count = await this.notificationsService.getUnreadCount();
    return { count };
  }

  @Get('count')
  @ApiOperation({ summary: 'Obtener contador de notificaciones no leídas (alias)' })
  async getCount() {
    const count = await this.notificationsService.getUnreadCount();
    return { count };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch('mark-all-read')
  async markAllAsRead() {
    await this.notificationsService.markAllAsRead();
    return { message: 'All notifications marked as read' };
  }
}
