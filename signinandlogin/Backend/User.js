const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors");

const PORT = 3000;
const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/curddatabase';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(error => console.error('MongoDB connection error:', error));

// Create user Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: String, required: true },
  email: { type: String, required: true, },
  remark: { type: String, required: true },
  address: { type: String, required: true },
}, { timestamps: true });

// Create User Model
const User = mongoose.model('User', userSchema);

// POST API to create a new user
app.post('/api/user', async (req, res) => {
  try {
    const { firstName, lastName, dob, email, remark, address } = req.body;

    // Check for missing fields
    if (!firstName || !lastName || !dob || !email || !remark || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new user instance
    const newUser = new User({ firstName, lastName, dob, email, remark, address });

    // Save user to the database
    await newUser.save();
    return res.status(201).json({ message: 'User saved successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Error creating user' });
  }
});

// GET API to fetch all users
app.get('/api/user/getdata', async (req, res) => {
  try {
    const data = await User.find();
    if(!data){
      return res.status(404).json({
        message:"data not found",
        success:false
      })
    }
    return res.status(200).json({ message: "Data fetched successfully", users: data });
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ message: 'Error fetching data' });
  }
});

// delete api
app.delete('/api/user/:id',async(req,res)=>{
  try{
      const userId=req.params.id;
      if(!mongoose.Types.ObjectId.isValid(userId)){
          return res.status(400).json({message:'Invalid User Id'});
      }
      const deleteuser=await User.findByIdAndDelete(userId);
      if(!deleteuser){
          return res.status(400).json({message:'User Not Found'});
      }
      res.status(200).json({message:'User Deleted Successfully',user:deleteuser});
  }
  catch(error){
      console.error(error)
      res.status(500).json({message:'Error during user delete'});
  }
})

// Edit API
app.put('/api/user/:id',async(req,res)=>{
  try{
    const{id}=req.params;
    const{firstName,lastName,dob, email, remark, address }=req.body;
    if(!id){
      return res.status(400).json({message:'User Id is Required'});
    }
    // find user by id and update
    const updateuser=await User.findByIdAndUpdate(id,
      {firstName,lastName,dob,email,remark,address},
      {new:true,runValidators:true}
    );
    if(!updateuser){
      return res.status(400).json({message:'User not Found'});
    }
    res.status(200).json({message:'User update successfully',user:updateuser});
  }
  catch(error){
    console.error(error);
    res.status(500).json({message:'Error updating User'});
  }
});

// Server listener
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
