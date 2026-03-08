import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Vacancy } from '../../vacancies/entities/vacancy.entity';
import { StudentProfile } from '../../students/entities/student-profile.entity';
import { ApplicationStatus } from '../../../common/enums';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vacancyId: string;

  @ManyToOne(() => Vacancy)
  @JoinColumn({ name: 'vacancyId' })
  vacancy: Vacancy;

  @Column()
  studentId: string;

  @ManyToOne(() => StudentProfile)
  @JoinColumn({ name: 'studentId' })
  student: StudentProfile;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column({ type: 'text', nullable: true })
  adminNotes: string;

  @Column({ nullable: true })
  reviewedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
