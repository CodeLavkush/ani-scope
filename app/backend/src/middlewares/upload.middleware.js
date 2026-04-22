import multer from "multer";

// Use memory storage (for Supabase upload)
const storage = multer.memoryStorage();

// File filter (only images)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, PNG, WEBP, AVIF images are allowed"), false);
    }
};

export const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // ✅ 2MB limit
    },
    fileFilter,
});