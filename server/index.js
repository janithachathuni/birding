const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const RegisterModel = require('./models/Register');

const app = express();

app.use(cors());

//when we are passing data to frontend we are passing them in json format
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/kurullo')

// api for register
app.post('/register', (req, res) =>{
    const {username, email, password} = req.body;
    RegisterModel.findOne({email:email})
    .then(user=>{
        if(user){
            res.json("Already have an account")
        }else{
            RegisterModel.create({username: username, email: email, password: password})
            .then(result => res.json("Account created"))
            .catch(err => res.json(err))
        }
    })
})

//api for login
app.post('/login', async (req, res) =>{
  const {email, password} = req.body;
  
  try {
    const user = await RegisterModel.findOne({email: email});
    
    if(!user) {
      return res.status(404).json("User not registered");
    }

    const isMatch = await user.comparePassword(password);
    if(isMatch){
      // Return user data including role
      res.json({
        message: "Success",
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role
        }
      });
    } else {
      res.status(401).json("Password didn't match");
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.listen(3001, () => {
    console.log("Server started on port 3001");
})