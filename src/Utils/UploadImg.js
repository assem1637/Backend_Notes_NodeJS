import multer from 'multer';






const upLoadImg = (name) => {

    const storage = multer.diskStorage({});

    function fileFilter (req, file, cb) {


        if(file.mimetype.startsWith("/image")) {

            // To accept the file pass `true`, like so:
            cb(null, true);

        } else {

            // To reject this file pass `false`, like so:
            cb(`Upload Image Only`, false);

        };
      
    };
      
    const upload = multer({ storage: storage, fileFilter });

    return upload.single(name);

};






export default upLoadImg;