import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      let uploadPath = process.env.UPLOAD_PATH || './uploads';
      
      if (file.fieldname === 'cv') {
        uploadPath += '/cv';
      } else if (file.fieldname === 'photo') {
        uploadPath += '/photos';
      } else if (file.fieldname === 'logo') {
        uploadPath += '/logos';
      }
      
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
};

export const imageFileFilter = (req: any, file: any, cb: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

export const pdfFileFilter = (req: any, file: any, cb: any) => {
  if (!file.originalname.match(/\.pdf$/i)) {
    return cb(new Error('Only PDF files are allowed!'), false);
  }
  cb(null, true);
};

export const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10);
