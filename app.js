const express = require("express");
const path = require("path");
const multer = require("multer");
const ejs = require("ejs");

//init app
const app = express();
const port = process.env.PORT || 2000;

//EJS
app.set("view engine", "ejs");
app.set(path.join(__dirname, "views"));

//static folder
app.use(express.static(path.join(__dirname, "static")));

//set storage engine
const storage = multer.diskStorage({
    destination: "./static/uploads/",
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

//Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: function (req, file, cb) {
        checkfileType(file, cb);
    },
}).single("myImg");

//cheeck file type
function checkfileType(file, cb) {
    //allowed extension
    const fileTypes = /jpeg|jpg|png|gif/;
    //check ext
    const fileExtension = fileTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    //check mime type
    const mimetype = fileTypes.test(file.mimetype);
    console.log(fileExtension);
    console.log(file.mimetype);
    console.log(mimetype);

    if (mimetype && fileExtension) {
        return cb(null, true);
    } else {
        cb("Error: Images only");
    }
}

//end points
app.get("/", (req, res) => {
    res.render("index", { body: "This is an image uploading tutorial" });
});

app.post("/upload", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render("index", { msg: err });
        } else {
            if(req.file==undefined){
                res.render("index", { msg: 'Error : No file selected ' });
            }
            else{
                res.render('index',{
                    msg:'File uploaded succesfully',
                    file:`uploads/${req.file.filename}`
                })
            }
        }
    });
});

app.listen(port, () => console.log(`Server running at ${port}`));
