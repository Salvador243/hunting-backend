import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { VacancyStatus } from '../../common/enums';
import { CompaniesService } from '../companies/companies.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private vacancyRepository: Repository<Vacancy>,
    private companiesService: CompaniesService,
  ) {}

  async create(userId: string, dto: CreateVacancyDto): Promise<Vacancy> {
    const companyProfile = await this.companiesService.getProfile(userId);
    if (!companyProfile) {
      throw new ForbiddenException('Company profile must be completed first');
    }
    if (!companyProfile.profileCompleted) {
      throw new ForbiddenException('Company profile must be completed first');
    }

    // Limpiar strings vacíos para fechas
    const cleanedDto = {
      ...dto,
      startDate: dto.startDate && dto.startDate.trim() !== '' ? dto.startDate : undefined,
      endDate: dto.endDate && dto.endDate.trim() !== '' ? dto.endDate : undefined,
    };

    const vacancy = this.vacancyRepository.create({
      ...cleanedDto,
      companyId: companyProfile.id,
    });

    return this.vacancyRepository.save(vacancy);
  }

  async findAllOpen(
    pagination: PaginationDto,
  ): Promise<PaginationResponseDto<Vacancy>> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [data, total] = await this.vacancyRepository.findAndCount({
      where: { status: VacancyStatus.OPEN },
      relations: ['company'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

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

  async findMyVacancies(userId: string): Promise<Vacancy[]> {
    const companyProfile = await this.companiesService.getProfile(userId);
    if (!companyProfile) {
      return [];
    }

    return this.vacancyRepository.find({
      where: { companyId: companyProfile.id },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Vacancy> {
    const vacancy = await this.vacancyRepository.findOne({
      where: { id },
      relations: ['company'],
    });
    if (!vacancy) {
      throw new NotFoundException('Vacancy not found');
    }
    return vacancy;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateVacancyDto,
  ): Promise<Vacancy> {
    const vacancy = await this.findOne(id);
    const companyProfile = await this.companiesService.getProfile(userId);

    if (!companyProfile || vacancy.companyId !== companyProfile.id) {
      throw new ForbiddenException('You can only update your own vacancies');
    }

    // Limpiar strings vacíos para fechas
    const cleanedDto = {
      ...dto,
      startDate: dto.startDate && dto.startDate.trim() !== '' ? dto.startDate : undefined,
      endDate: dto.endDate && dto.endDate.trim() !== '' ? dto.endDate : undefined,
    };

    Object.assign(vacancy, cleanedDto);
    return this.vacancyRepository.save(vacancy);
  }

  async close(userId: string, id: string): Promise<Vacancy> {
    const vacancy = await this.findOne(id);
    const companyProfile = await this.companiesService.getProfile(userId);

    if (!companyProfile || vacancy.companyId !== companyProfile.id) {
      throw new ForbiddenException('You can only close your own vacancies');
    }

    vacancy.status = VacancyStatus.CLOSED;
    return this.vacancyRepository.save(vacancy);
  }

  async softDelete(userId: string, id: string): Promise<void> {
    const vacancy = await this.findOne(id);
    const companyProfile = await this.companiesService.getProfile(userId);

    if (!companyProfile || vacancy.companyId !== companyProfile.id) {
      throw new ForbiddenException('You can only delete your own vacancies');
    }

    vacancy.status = VacancyStatus.DELETED;
    await this.vacancyRepository.save(vacancy);
  }

  // Admin methods
  async findAllAdmin(
    pagination: PaginationDto,
  ): Promise<PaginationResponseDto<Vacancy>> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [data, total] = await this.vacancyRepository.findAndCount({
      relations: ['company'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

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

  async adminUpdate(id: string, dto: UpdateVacancyDto): Promise<Vacancy> {
    const vacancy = await this.findOne(id);
    
    // Limpiar strings vacíos para fechas
    const cleanedDto = {
      ...dto,
      startDate: dto.startDate && dto.startDate.trim() !== '' ? dto.startDate : undefined,
      endDate: dto.endDate && dto.endDate.trim() !== '' ? dto.endDate : undefined,
    };
    
    Object.assign(vacancy, cleanedDto);
    return this.vacancyRepository.save(vacancy);
  }

  async adminDelete(id: string): Promise<void> {
    const vacancy = await this.findOne(id);
    vacancy.status = VacancyStatus.DELETED;
    await this.vacancyRepository.save(vacancy);
  }
}
