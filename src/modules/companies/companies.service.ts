import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyProfile } from './entities/company-profile.entity';
import { CompanyContact } from './entities/company-contact.entity';
import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { CreateCompanyContactDto } from './dto/create-company-contact.dto';
import { UpdateCompanyContactDto } from './dto/update-company-contact.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CompanyProfile)
    private companyProfileRepository: Repository<CompanyProfile>,
    @InjectRepository(CompanyContact)
    private companyContactRepository: Repository<CompanyContact>,
  ) {}

  async getProfile(userId: string): Promise<CompanyProfile | null> {
    return this.companyProfileRepository.findOne({
      where: { userId },
      relations: ['contacts'],
    });
  }

  async getProfileById(id: string): Promise<CompanyProfile> {
    const profile = await this.companyProfileRepository.findOne({
      where: { id },
      relations: ['contacts'],
    });
    if (!profile) {
      throw new NotFoundException('Company profile not found');
    }
    return profile;
  }

  async createOrUpdateProfile(
    userId: string,
    dto: CreateCompanyProfileDto | UpdateCompanyProfileDto,
  ): Promise<CompanyProfile> {
    let profile = await this.companyProfileRepository.findOne({
      where: { userId },
    });

    if (profile) {
      Object.assign(profile, dto);
      profile.profileCompleted = this.isProfileComplete(profile);
    } else {
      profile = this.companyProfileRepository.create({
        ...dto,
        userId,
        profileCompleted: false,
      });
      profile.profileCompleted = this.isProfileComplete(profile);
    }

    return this.companyProfileRepository.save(profile);
  }

  private isProfileComplete(profile: CompanyProfile): boolean {
    return !!(
      profile.name &&
      profile.industry &&
      profile.state &&
      profile.city
    );
  }

  async addContact(
    userId: string,
    dto: CreateCompanyContactDto,
  ): Promise<CompanyContact> {
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new NotFoundException('Company profile not found');
    }

    const contact = this.companyContactRepository.create({
      ...dto,
      companyId: profile.id,
    });

    return this.companyContactRepository.save(contact);
  }

  async updateContact(
    userId: string,
    contactId: string,
    dto: UpdateCompanyContactDto,
  ): Promise<CompanyContact> {
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new NotFoundException('Company profile not found');
    }

    const contact = await this.companyContactRepository.findOne({
      where: { id: contactId },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    if (contact.companyId !== profile.id) {
      throw new ForbiddenException('You can only update your own contacts');
    }

    Object.assign(contact, dto);
    return this.companyContactRepository.save(contact);
  }

  async getContacts(userId: string): Promise<CompanyContact[]> {
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new NotFoundException('Company profile not found');
    }

    return this.companyContactRepository.find({
      where: { companyId: profile.id },
    });
  }

  async deleteContact(userId: string, contactId: string): Promise<void> {
    const profile = await this.getProfile(userId);
    if (!profile) {
      throw new NotFoundException('Company profile not found');
    }

    const contact = await this.companyContactRepository.findOne({
      where: { id: contactId },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    if (contact.companyId !== profile.id) {
      throw new ForbiddenException('You can only delete your own contacts');
    }

    await this.companyContactRepository.remove(contact);
  }
}
