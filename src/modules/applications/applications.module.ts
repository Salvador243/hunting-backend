import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { ApplicationsService } from './applications.service';
import {
  ApplicationsController,
  AdminApplicationsController,
} from './applications.controller';
import { StudentsModule } from '../students/students.module';
import { VacanciesModule } from '../vacancies/vacancies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    StudentsModule,
    VacanciesModule,
  ],
  providers: [ApplicationsService],
  controllers: [ApplicationsController, AdminApplicationsController],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
