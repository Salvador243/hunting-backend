import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import {
  StudyPlan,
  AcademicStatus,
  StudySchedule,
  InsuranceType,
} from '../../../common/enums';

@Entity('student_profiles')
export class StudentProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  municipality: string;

  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ nullable: true })
  cvUrl: string;

  @Column({ nullable: true })
  university: string;

  @Column({ nullable: true })
  career: string;

  @Column({ type: 'enum', enum: StudyPlan, nullable: true })
  studyPlan: StudyPlan;

  @Column({ type: 'enum', enum: AcademicStatus, nullable: true })
  academicStatus: AcademicStatus;

  @Column({ type: 'enum', enum: StudySchedule, nullable: true })
  studySchedule: StudySchedule;

  @Column({ nullable: true })
  linkedinUrl: string;

  @Column({ default: false })
  hasMedicalInsurance: boolean;

  @Column({ type: 'enum', enum: InsuranceType, nullable: true })
  insuranceType: InsuranceType;

  @Column({ nullable: true })
  studyProofUrl: string;

  @Column({ nullable: true })
  degreeUrl: string;

  @Column({ nullable: true })
  certificationsUrl: string;

  @Column({ default: false })
  profileCompleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
