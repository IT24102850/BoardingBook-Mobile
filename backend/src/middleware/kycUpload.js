const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/kyc/'),
  filename: (req, file, cb) => {
    const safe = file.fieldname + '-' + req.user._id + '-' + Date.now() + path.extname(file.originalname);
    cb(null, safe);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|pdf/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) cb(null, true);
  else cb(new Error('Only JPG, PNG, and PDF files are allowed'));
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
}).fields([
  { name: 'nicFront', maxCount: 1 },
  { name: 'nicBack',  maxCount: 1 },
  { name: 'selfie',   maxCount: 1 },
]);
