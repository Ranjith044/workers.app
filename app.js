var exp = require('express');
var app = exp();

var bp = require("body-parser");
var path = require("path");
var data = require("./model/db");
var mongo = require('mongoose');
var multer = require('multer');

// ✅ Load environment variables first
require('dotenv').config();

// ✅ MongoDB connection (no quotes, options added)
mongo.connect(process.env.DB_URL, {
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Use fallback port if not set
var port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

// Static files
app.use('/public', exp.static('public'));
app.use('/my-uploads', exp.static('my-uploads'));

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './my-uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
    res.render("index", { title: "indexpage" });
});

app.get('/reg', (req, res) => {
    res.render("reg", { title: "Registration" });
});

app.get('/detail', (req, res) => {
    data.find().then((result) => {
        res.render("detail", {
            title: "all details",
            message: result
        });
    }).catch(err => console.error(err));
});

app.post("/insert", upload.single('img'), async (req, res) => {
    console.log(req.file);
    var d = new data({
        name: req.body.name,
        password: req.body.pass,
        email: req.body.email,
        userid: req.body.userid,
        image: req.file.filename
    });
    await d.save();
    res.redirect("/");
    console.log("Inserted successfully");
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
