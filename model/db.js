var mongo=require('mongoose')

var sch=new mongo.Schema(
    {
        name:{type:String,require:true},
        password:{type:String,require:true},
        email:{type:String,require:true},
        userid:{type:String,require:true},
       image:{type:String ,require:true}
       
    }
)
 var m=mongo.model("details",sch)
 module.exports=m;