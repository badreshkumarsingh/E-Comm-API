import multer from 'multer';

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        // const fileName = new Date.now() + "-" + file.originalname;
        // const fileName = new Date().toISOString() + file.originalname;
        cb(null, new Date().toISOString().replace(/:/g, '_') + file.originalname);
    }
});

// const uploadFile = multer({storage: storageConfig});
export const upload = multer({storage: storageConfig});