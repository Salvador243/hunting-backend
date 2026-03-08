import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { CompanyProfile } from '../../companies/entities/company-profile.entity';
import { VacancyStatus, DurationType, Modality } from '../../../common/enums';

@Entity('vacancies')
export class Vacancy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @ManyToOne(() => CompanyProfile)
  @JoinColumn({ name: 'companyId' })
  company: CompanyProfile;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  requirements: string;

  @Column({ type: 'text', nullable: true })
  benefits: string;

  @Column({ default: false })
  hasSalary: boolean;

  @Column({ nullable: true })
  salaryRange: string;

  @Column({ type: 'enum', enum: Modality, default: Modality.PRESENCIAL })
  modality: Modality;

  @Column({ nullable: true })
  schedule: string;

  @Column({ type: 'enum', enum: DurationType, default: DurationType.INDEFINIDO })
  durationType: DurationType;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'enum', enum: VacancyStatus, default: VacancyStatus.OPEN })
  status: VacancyStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
