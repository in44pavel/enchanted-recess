//1st step-to provide connection with server
const router = require('express').Router()

//creating models
const Users = require('./models/users')
const Exercises = require('./models/exercises')

//1.posting new user
router.post("/new-user",(req,res,next)=>{
  const user= new Users(req.body);//entered user name
  user.save((err,savedUser)=>{
    if (err) {
      if(err.code==11000) //err.code==11000 duplicate key error index
      { return next({
        status:400,//400 error stands for bad request>>https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
        message: 'username already taken'}) } 
      else {return next(err)}
    } 
    res.json({
      username:savedUser.username,
      _id: savedUser._id
    })
  }) 
});

//2.posting exercises

router.post("/add",(req,res,next)=>{
  Users.findById(req.body.userId,(err,user)=>{
    if(err) return next(err)
    if(!user){return next({
      status:400,//400 error stands for bad request>>https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
      message: 'unknown _id'})
  }
  const exercise = new Exercises(req.body)//entering exercise per model
  
  exercise.username= user.username //interconnecting data out of two models
  
    //console.log(exercise)
    //saving exercise
  exercise.save((err,savedExercise)=>{
    if(err) return next(err)
    //savedExercise=savedExercise.toObject()//to make sure it's {}
    delete savedExercise.__v//update info
    savedExercise._id=savedExercise.userId//transfer data per Users model
    delete savedExercise.userId//remove info transferred
    savedExercise.date=new Date(savedExercise.date).toDateString()//update date format
    console.log(savedExercise)
    res.json(savedExercise)
  })
  })   
});  
//3.getting logs



//1st step- to provide connection with server
module.exports = router