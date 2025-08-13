const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
require('dotenv').config();

// Import model
const Data = require('./model/db');

// MongoDB connection
mongoose.connect(process.env.DB_URL)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Port
const port = process.env.PORT || 3000;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folders
app.use('/public', express.static('public'));
app.use('/my-uploads', express.static('my-uploads'));

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './my-uploads'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Routes
app.get('/', (req, res) => res.render('index', { title: 'indexpage' }));

app.get('/reg', (req, res) => res.render('reg', { title: 'Registration' }));

app.get('/detail', async (req, res) => {
    try {
        const results = await Data.find();
        res.render('detail', { title: 'all details', message: results });
    } catch (err) {
        console.error(err);
    }
});

app.post('/insert', upload.single('img'), async (req, res) => {
    try {
        const d = new Data({
            name: req.body.name,
            password: req.body.pass,
            email: req.body.email,
            userid: req.body.userid,
            image: req.file.filename
        });
        await d.save();
        console.log('✅ Inserted successfully');
        res.redirect('/');
    } catch (err) {
        console.error('❌ Insert error:', err);
    }
});

// Start server
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
