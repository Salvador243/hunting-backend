import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { ApplicationStatus, VacancyStatus } from '../../common/enums';
import { StudentsService } from '../students/students.service';
import { VacanciesService } from '../vacancies/vacancies.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    private studentsService: StudentsService,
    private vacanciesService: VacanciesService,
  ) {}

  async apply(userId: string, vacancyId: string): Promise<Application> {
    const studentProfile = await this.studentsService.getProfile(userId);
    if (!studentProfile) {
      throw new ForbiddenException('Student profile must be completed first');
    }
    if (!studentProfile.profileCompleted) {
      throw new ForbiddenException('Student profile must be completed first');
    }

    const vacancy = await this.vacanciesService.findOne(vacancyId);
    if (vacancy.status !== VacancyStatus.OPEN) {
      throw new ForbiddenException('Vacancy is not open for applications');
    }

    const existingApplication = await this.applicationRepository.findOne({
      where: { studentId: studentProfile.id, vacancyId },
    });
    if (existingApplication) {
      throw new ConflictException('You have already applied to this vacancy');
    }

    const application = this.applicationRepository.create({
      studentId: studentProfile.id,
      vacancyId,
    });

    return this.applicationRepository.save(application);
  }

  async getMyApplications(userId: string): Promise<Application[]> {
    const studentProfile = await this.studentsService.getProfile(userId);
    if (!studentProfile) {
      return [];
    }

    return this.applicationRepository.find({
      where: { studentId: studentProfile.id },
      relations: ['vacancy', 'vacancy.company'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['vacancy', 'vacancy.company', 'student'],
    });
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    return application;
  }

  // Admin methods
  async findAllAdmin(
    pagination: PaginationDto,
    status?: ApplicationStatus,
  ): Promise<PaginationResponseDto<Application>> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const queryBuilder = this.applicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.vacancy', 'vacancy')
      .leftJoinAndSelect('vacancy.company', 'company')
      .leftJoinAndSelect('application.student', 'student')
      .orderBy('application.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (status) {
      queryBuilder.where('application.status = :status', { status });
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

  async getVacanciesWithApplications(): Promise<any[]> {
    const result = await this.applicationRepository
      .createQueryBuilder('application')
      .select('application.vacancyId', 'vacancyId')
      .addSelect('COUNT(application.id)', 'applicationCount')
      .addSelect('vacancy.title', 'vacancyTitle')
      .addSelect('company.name', 'companyName')
      .leftJoin('application.vacancy', 'vacancy')
      .leftJoin('vacancy.company', 'company')
      .groupBy('application.vacancyId')
      .addGroupBy('vacancy.title')
      .addGroupBy('company.name')
      .orderBy('applicationCount', 'DESC')
      .getRawMany();

    return result;
  }

  async updateStatus(
    id: string,
    dto: UpdateApplicationStatusDto,
  ): Promise<Application> {
    const application = await this.findOne(id);
    application.status = dto.status;
    if (dto.adminNotes) {
      application.adminNotes = dto.adminNotes;
    }
    application.reviewedAt = new Date();
    return this.applicationRepository.save(application);
  }

  async updateNotes(id: string, adminNotes: string): Promise<Application> {
    const application = await this.findOne(id);
    application.adminNotes = adminNotes;
    return this.applicationRepository.save(application);
  }

  async getApplicationsByVacancy(vacancyId: string): Promise<Application[]> {
    return this.applicationRepository.find({
      where: { vacancyId },
      relations: ['student', 'student.user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getCompanyApplications(userId: string): Promise<Application[]> {
    const applications = await this.applicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.vacancy', 'vacancy')
      .leftJoinAndSelect('application.student', 'student')
      .leftJoinAndSelect('student.user', 'user')
      .leftJoinAndSelect('vacancy.company', 'company')
      .where('company.userId = :userId', { userId })
      .orderBy('application.createdAt', 'DESC')
      .getMany();

    return applications;
  }
}
