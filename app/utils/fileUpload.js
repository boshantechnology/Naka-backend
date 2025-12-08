const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDFs are allowed"), false);
};

const imageFilter = (req, file, cb) => {
  if (!file) return cb(null, true);
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

const uploadProfileImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // max 2MB for profile images
});

const optionalUpload = (uploader) => {
    return (req, res, next) => {
        if (req.headers['content-type']?.startsWith('multipart/form-data')) {
            uploader(req, res, function (err) {
                if (err && err.code !== 'LIMIT_UNEXPECTED_FILE') {
                    return res.status(400).json({ error: err.message });
                }
                next();
            });
        } else {
            next();
        }
    };
};

module.exports = {
  upload,
  uploadProfileImage,
  optionalUpload
};
