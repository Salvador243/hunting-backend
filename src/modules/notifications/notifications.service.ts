import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { Application } from '../applications/entities/application.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async createForApplication(application: Application): Promise<Notification> {
    const notification = this.notificationRepository.create({
      applicationId: application.id,
      title: 'Nueva postulación',
      message: `Nueva postulación recibida para la vacante`,
    });

    return this.notificationRepository.save(notification);
  }

  async findAll(
    pagination: PaginationDto,
    isRead?: boolean,
  ): Promise<PaginationResponseDto<Notification>> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.application', 'application')
      .leftJoinAndSelect('application.vacancy', 'vacancy')
      .leftJoinAndSelect('vacancy.company', 'company')
      .leftJoinAndSelect('application.student', 'student')
      .orderBy('notification.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (isRead !== undefined) {
      queryBuilder.where('notification.isRead = :isRead', { isRead });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: [
        'application',
        'application.vacancy',
        'application.vacancy.company',
        'application.student',
      ],
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.findOne(id);
    notification.isRead = true;
    notification.readAt = new Date();
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(): Promise<void> {
    await this.notificationRepository.update(
      { isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }

  async getUnreadCount(): Promise<number> {
    return this.notificationRepository.count({ where: { isRead: false } });
  }
}
