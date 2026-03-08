import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { VacanciesService } from './vacancies.service';
import {
  VacanciesController,
  AdminVacanciesController,
} from './vacancies.controller';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vacancy]), CompaniesModule],
  providers: [VacanciesService],
  controllers: [VacanciesController, AdminVacanciesController],
  exports: [VacanciesService],
})
export class VacanciesModule {}
