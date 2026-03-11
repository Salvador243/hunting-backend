import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentProfile } from './entities/student-profile.entity';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { UpdateStudentProfileDto } from './dto/update-student-profile.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(StudentProfile)
    private studentProfileRepository: Repository<StudentProfile>,
  ) {}

  async getProfile(userId: string): Promise<StudentProfile | null> {
    return this.studentProfileRepository.findOne({
      where: { userId },
    });
  }

  async getProfileById(id: string): Promise<StudentProfile> {
    const profile = await this.studentProfileRepository.findOne({
      where: { id },
    });
    if (!profile) {
      throw new NotFoundException('Student profile not found');
    }
    return profile;
  }

  async createOrUpdateProfile(
    userId: string,
    dto: CreateStudentProfileDto | UpdateStudentProfileDto,
  ): Promise<StudentProfile> {
    let profile = await this.studentProfileRepository.findOne({
      where: { userId },
    });

    if (profile) {
      Object.assign(profile, dto);
      profile.profileCompleted = this.isProfileComplete(profile);
    } else {
      profile = this.studentProfileRepository.create({
        ...dto,
        userId,
        profileCompleted: false,
      });
      profile.profileCompleted = this.isProfileComplete(profile);
    }

    return this.studentProfileRepository.save(profile);
  }

  private isProfileComplete(profile: StudentProfile): boolean {
    return !!(
      profile.firstName &&
      profile.lastName &&
      profile.state &&
      profile.city
    );
  }

  async updateCvUrl(userId: string, cvUrl: string): Promise<StudentProfile> {
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new NotFoundException('Student profile not found');
    }
    profile.cvUrl = cvUrl;
    return this.studentProfileRepository.save(profile);
  }

  async updatePhoto(userId: string, photoUrl: string): Promise<StudentProfile> {
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new NotFoundException('Student profile not found');
    }
    profile.photo = photoUrl;
    return this.studentProfileRepository.save(profile);
  }

  async uploadPortfolioFile(
    userId: string,
    file: Express.Multer.File,
    fileType: 'studyProof' | 'degree' | 'certifications',
  ): Promise<StudentProfile> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new NotFoundException('Student profile not found');
    }

    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    const documentsDir = path.join(uploadPath, 'documents');

    if (!fs.existsSync(documentsDir)) {
      fs.mkdirSync(documentsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const filename = `${fileType}-${userId}-${timestamp}${path.extname(file.originalname)}`;
    const filepath = path.join(documentsDir, filename);

    fs.writeFileSync(filepath, file.buffer);

    const fileUrl = `/uploads/documents/${filename}`;

    switch (fileType) {
      case 'studyProof':
        profile.studyProofUrl = fileUrl;
        break;
      case 'degree':
        profile.degreeUrl = fileUrl;
        break;
      case 'certifications':
        profile.certificationsUrl = fileUrl;
        break;
    }

    return this.studentProfileRepository.save(profile);
  }
}
