import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
  getFileUrl(filename: string, type: 'cv' | 'photo' | 'logo'): string {
    const basePath = process.env.UPLOAD_PATH || './uploads';
    const subPath = type === 'cv' ? 'cv' : type === 'photo' ? 'photos' : 'logos';
    return `${basePath}/${subPath}/${filename}`;
  }

  getPublicUrl(filename: string, type: 'cv' | 'photo' | 'logo'): string {
    const subPath = type === 'cv' ? 'cv' : type === 'photo' ? 'photos' : 'logos';
    return `/uploads/${subPath}/${filename}`;
  }
}
