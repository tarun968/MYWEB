const express = require('express');
const path = require('path');
const app= express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const req = require('express/lib/request');
const { response } = require('express');
const staticPath = path.join(__dirname,"/views")
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
mongoose.connect("mongodb+srv://taRun_968:TarunTHELT%4023@cluster0.qlzfq.mongodb.net/Feedback", { useNewUrlParser: true });
//mongodb://localhost:27017
var global_stud;
var global_fac;


const student_schema = mongoose.Schema({
      Name:String,
      Id:String,
      Phno:String,
      Sports:String,
   })

const teacher_schema = mongoose.Schema({
      Name:String,
      Id:String,
      Phno:String,
      Abouther:String,
      Subject:String,
      Feedbacks:[String],
      Roomno:String,
})
const room_schema = mongoose.Schema({
   rooms:{
      Room_no:String,
      Room_occ:String,
      Room_emp:Boolean,
   }
})
const student_rec = mongoose.model("studrec",student_schema);
const teacher_rec = mongoose.model("teachrec",teacher_schema);
const room_rec = mongoose.model("roomrec",room_schema);
app.use(express.static(staticPath));


room_rec.insertMany
app.get("/",function(req,res){
  res.render("login")
});

app.post("/",function(req,res){
   student_rec.findOne({Id:req.body.Email},function(err,found){
      if(found){
         res.redirect("/");
      }
      else{
   const stud_data = new student_rec({
      Id:req.body.Email,
      Name:req.body.Name,
      Phno:req.body.Phno,
      Sports:"",
   })
   stud_data.save();
   res.redirect("/")
      }
   })
})

app.post("/teacher",function(req,res){
   teacher_rec.findOne({Id:req.body.Email},function(err,found){
      if(found){
         res.redirect("/");
      }
      else{
   const teach_data = new teacher_rec({
      Id:req.body.Email,
      Name:req.body.Name,
      Phno:req.body.Phno,
      Subject:req.body.Sub,
      Abouther:req.body.Desc,
   })
   teach_data.save();
   res.redirect("/")
      }
   })
})

app.post("/teacher_rec",function(request,response){
   response.render("teacher_rec");
  })
  
app.post("/student",function(request,response){
 response.render("student");
})


app.post("/hostel",function(res,rep){
   rep.render("hostel_roomreg",{
      GS:global_stud
   });
})

app.post("/faculty",function(req,res){
   res.render("login_faculty");
})

app.post("/faculty_access",function(req,res){
   teacher_rec.findOne({Name:req.body.FName,Id:req.body.FEmail},function(err,found_fac){
      if(found_fac){
         global_fac = req.body.FEmail;
         res.render("faculty",{
            GF:global_fac
         })
      }
   })
})

app.post("/fac_fbk",function(req,res){
   teacher_rec.findOne({Id:global_fac},function(err,found_fac){
      if(found_fac){
         console.log([found_fac]);
         res.render("faculty_fbks",{         
            fbks:[found_fac]
         })
      }
   })
})

app.post("/fac_subjects",function(req,res){
   teacher_rec.findOne({Id:global_fac},function(err,found_fac){
      if(found_fac){
         res.render("faculty_sbs",{
            fbks:[found_fac]
         })
      }
   })
})

app.post("/room_save",function(request_1,response_1){
   room_rec.findOneAndUpdate(
   {
  //  rooms:{Room_no:request_1.body.rooms,Room_emp:false}
   //   ,{$set:{rooms:{Room_emp:false}}}
   });
});

app.post("/student_login",function(reqst,resp){
      resp.render("stud_login");
})

app.post("/stud_access",function(reqst,resp){
   student_rec.findOne({
      Id:reqst.body.Email,
      Name:reqst.body.Name,
      Phno:reqst.body.Phno
   },function(err,found_rec){
      if(found_rec){
         global_stud = reqst.body.Email; 
          resp.render("student",{
             GS:global_stud,
          })
      }
      else{
          resp.redirect("/")
      }
   })
})

app.post("/faculty",function(request,response){
  response.render("faculty");
});

app.post("/admin",function(request,response){
  response.render("admin");
});

app.post("/facultyfb",function(request,response){
   teacher_rec.find({},function(err,records){
      if(err){
         console.log(err)
      }
      else{  
      response.render("faculty_list",{
       record:records
            })
      }
   });
});

app.post("/stud_rec",function(request,response){
  response.render("stud_rec");
});

app.post("/feedback",function(request,response){
   response.render("feedback");
 });

app.post("/fbksub",function(request,response){
  teacher_rec.updateOne({Id:request.body.faculty_id},{
      $push:{Feedbacks:request.body.faculty_fb}},function(err,doc){
         if(err){
            console.log(err)
         }
         else{
            response.redirect("login")
         }
      })
  });
app.get("/login",function(reqs,rep){
   console.log(global_stud)
   rep.render("student",{
      GS:global_stud,
   })
})
 
app.post("/feedback_to_faculty",function(reqs,rep){
   teacher_rec.find({},function(err,found_t){
      if(err){
         console.log(err)
      }
      else{
         rep.render("feedback_to_faculty",{
            record:found_t
         })
      }
   })
})

app.post("/sports_reg",function(req,res){
   res.render("sports_reg",{
      GS:global_stud
   })
})
app.post("/sports_save",function(req,res){
   student_rec.updateOne({Id:global_stud},{Sports:req.body.sports},function(err,doc){
      if(err){
         console.log(err)
      }
      else{
         res.render("student",{
            GS:global_stud
         })
      }
   })
})

app.post("/sports_list",function(reqt,reso){
   student_rec.find({},function(err,all_rec){
      if(err){
      console.log(err)
      }
      else{
         reso.render("sports_list",{
            allrecord:all_rec
         })
      }
   })
})

app.listen(3000, function(){
console.log("server started at 3000")
})

//Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum