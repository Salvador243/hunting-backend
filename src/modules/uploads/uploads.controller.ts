import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums';
import { User } from '../users/entities/user.entity';
import { UploadsService } from './uploads.service';
import { StudentsService } from '../students/students.service';
import { CompaniesService } from '../companies/companies.service';

const imageFileFilter = (req: any, file: any, cb: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return cb(new BadRequestException('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const pdfFileFilter = (req: any, file: any, cb: any) => {
  if (!file.originalname.match(/\.pdf$/i)) {
    return cb(new BadRequestException('Only PDF files are allowed!'), false);
  }
  cb(null, true);
};

@ApiTags('Uploads')
@ApiBearerAuth('JWT-auth')
@Controller('uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadsController {
  constructor(
    private uploadsService: UploadsService,
    private studentsService: StudentsService,
    private companiesService: CompaniesService,
  ) {}

  @Post('cv')
  @Roles(Role.STUDENT)
  @UseInterceptors(
    FileInterceptor('cv', {
      storage: diskStorage({
        destination: './uploads/cv',
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: pdfFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadCv(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('CV file is required');
    }
    const url = this.uploadsService.getPublicUrl(file.filename, 'cv');
    await this.studentsService.updateCvUrl(user.id, url);
    return { url, filename: file.filename };
  }

  @Post('photo')
  @Roles(Role.STUDENT)
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/photos',
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadPhoto(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Photo file is required');
    }
    const url = this.uploadsService.getPublicUrl(file.filename, 'photo');
    await this.studentsService.updatePhoto(user.id, url);
    return { url, filename: file.filename };
  }

  @Post('logo')
  @Roles(Role.COMPANY)
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './uploads/logos',
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadLogo(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Logo file is required');
    }
    const url = this.uploadsService.getPublicUrl(file.filename, 'logo');
    await this.companiesService.createOrUpdateProfile(user.id, { logo: url });
    return { url, filename: file.filename };
  }
}
