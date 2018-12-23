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
  
    //saving exercise
  exercise.save((err,savedExercise)=>{
    if(err) return next(err)
    //savedExercise=savedExercise.toObject()//to make sure it's {}
    delete savedExercise.__v//update info
    savedExercise._id=savedExercise.userId//transfer data per Users model
    delete savedExercise.userId//remove info transferred
    savedExercise.date=new Date(savedExercise.date).toUTCString()//update date format
    res.json(savedExercise)
  })
  })    
}); 

//3.getting logs
//3.1 getting full log of all users
router.get('/users',(req, res)=>{
  Users.find({},(err,data)=>
  res.json(data)) 
})

//3.2 gettinglogs per option
router.get('/log',(req,res,next)=>{
  const from = new Date(req.query.from);
  const to = new Date(req.query.to);
 //finding user  
  Users.findById(req.query.userId,(err,user)=>{
    if(err) return next(err)
    if(!user){return next({
      status:400,//400 error stands for bad request>>https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
      message: 'unknown _id'})       
    }//finding exercise data
    Exercises.find(
      {userId:req.query.userId,
      date:{
        $lt: to != 'Invalid Date' ? to.getTime() : Date.now() ,//lower than to, now by default
        $gt: from != 'Invalid Date' ? from.getTime() : 0//greater than from, now by default
      }},
      {__v: 0,
      _id: 0
      }
    )
    .sort('-date')//sorting by date descending
    .limit(parseInt(req.query.limit))//max number of docs//parsing is for browser entering
    .exec((err,exercises)=>{
      if(err) return next(err)
      //creating output variable
      const output = {
      _id: req.query.userId,
      username: user.username,
      from : from != 'Invalid Date' ? from.toDateString() : undefined,
      to : to != 'Invalid Date' ? to.toDateString(): undefined,
      count: exercises.length,
      log: exercises.map((e) => ({
            description : e.description,
            duration : e.duration,
            date: e.date.toUTCString()
          }))
      }
      res.json(output)
    })
  })
}) 
  
  

//1st step- to provide connection with server
module.exports = router