import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { StudentsModule } from '../students/students.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [StudentsModule, CompaniesModule],
  providers: [UploadsService],
  controllers: [UploadsController],
  exports: [UploadsService],
})
export class UploadsModule {}
