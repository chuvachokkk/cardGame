const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../../uploads/cards');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const cardStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/cards/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Можно загружать только изображения!'), false);
  }
};

const uploadCardImage = multer({
  storage: cardStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const getImagePath = (basePath, fileName) => {
  const formats = ['.jpg', '.png', '.webp'];
  for (const format of formats) {
    const filePath = path.join(basePath, fileName + format);
    if (fs.existsSync(filePath)) {
      return `/uploads/${fileName}${format}`;
    }
  }
  return null;
};

module.exports = {
  uploadCardImage,
  getImagePath,
};
