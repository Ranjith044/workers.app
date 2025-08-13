const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Import model
const Data = require('./model/db');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'my-uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// MongoDB connection
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
});

// Port
const port = process.env.PORT || 3000;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folders
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/my-uploads', express.static(uploadDir));

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/[^\w.-]/g, '_'); // avoid unsafe chars
        cb(null, `${Date.now()}-${safeName}`);
    }
});
const upload = multer({ storage });

// Routes
app.get('/', (req, res) => res.render('index', { title: 'indexpage' }));

app.get('/reg', (req, res) => res.render('reg', { title: 'Registration' }));

app.get('/detail', async (req, res, next) => {
    try {
        const results = await Data.find();
        res.render('detail', { title: 'all details', message: results });
    } catch (err) {
        next(err);
    }
});

app.post('/insert', upload.single('img'), async (req, res, next) => {
    try {
        const newData = new Data({
            name: req.body.name,
            password: req.body.pass,
            email: req.body.email,
            userid: req.body.userid,
            image: req.file ? req.file.filename : null // handle no file
        });
        await newData.save();
        console.log('✅ Inserted successfully');
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(500).send('Internal Server Error');
});

// Start server
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
