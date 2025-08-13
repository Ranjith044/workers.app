var exp=require('express')
var app=new exp();

var bp=require("body-parser")
var path=require("path");
var data=require("./model/db");
var mongo=require('mongoose')
mongo.connect("process.env.DB_URL")

require('dotenv').config();
var port=process.env.PORT;
const { title } = require("process");

const multer  = require('multer')



app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")

app.use(bp.urlencoded({extended:false}));
app.use(bp.json());
app.use('/public', exp.static('public'));

app.use('/my-uploads', exp.static('my-uploads'));



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './my-uploads')
    
  },
  filename: function (req, file, cb) 
  {
    cb(null, file.fieldname + '-' +file.originalname)
  }
})

const upload = multer({ storage: storage })




app.get('/',(req,res)=>
{
    res.render("index",{
            title:"indexpage"
        });
})
app.get('/reg',(req,res)=>
{
    res.render("reg",{
            title:"Registration"
        });
})

app.get('/detail',(req,res)=>
{
    data.find().then((data,err)=>
    {
        if (err) throw err;
            // console.log(data);
            res.render("detail",{
                title:"all details",
                message:data
            })
    })
     
    // res.render("detail",{
    //     title:"Details"
    // })
})

app.post("/insert",upload.single('img'),async(req,res)=>

{
    console.log(req.file);
    var n=req.body.name;
    var pa=req.body.pass;
    var e=req.body.email;
    var u=req.body.userid;
    let i=req.file.filename;
    var d=new data({
        name:n,password:pa,email:e,userid:u,image:i
    })
    await d.save();
    res.redirect("/")
    console.log("inserted succedd")
})

app.listen(port);
console.log("Server running");

