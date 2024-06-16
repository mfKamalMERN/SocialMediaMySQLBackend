import multer from "multer";

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'Public/Images')
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

export const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") cb(null, true)
        else {
            cb(null, false)
            return cb(new Error("Only .png, .jpg and .jpef format allowed!"))
        }
    }
})