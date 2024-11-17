const express = require('express');
const mongoose = require('mongoose');

const cors = require("cors");
const PORT = 3000;

const app = express();
app.use(express.json());
// app.use(express.urlencoded({extended: true}));
app.use(cors());

const mongoURI = 'mongodb://localhost:27017/curddatabase';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(error => console.log('Error connecting to MongoDB:', error));

// Create Client Schema
const clientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobile: { type: Number, required: true }, 
  email: { type: String, required: true },
  remark: { type: String, required: true },
  address: { type: String, required: true }
});

// Create Client Model
const Client = mongoose.model('Client', clientSchema);

// POST API - Add a new client
app.post('/api/client', async (req, res) => {
  try {
    const { firstName, lastName, mobile, email, remark, address } = req.body;

    // Check for missing fields
    if (!firstName || !lastName || !mobile || !email || !address) {
      return res.status(400 ).json({ message: 'All fields are required' });
    }

    const newClient = new Client({ firstName, lastName, mobile, email, remark, address });
    await newClient.save();
    res.status(201).json({ message: 'Client saved successfully', client: newClient });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ message: 'Error creating client' });
  }
});

// GET API - Retrieve all clients
app.get('/api/client/get', async (req, res) => {
  try {
    const data = await Client.find();
    res.status(200).json({ message: 'Clients retrieved successfully', clients: data });
  } catch (err) {
    console.error('Error retrieving clients:', err);
    res.status(500).json({ message: 'Error retrieving clients' });
  }
});


//delete Api
app.delete('/api/client/:id',async(req,res)=>{
  try{
      const{id}=req.params;
      //find client by id
      const deletedclient=await Client.findByIdAndDelete(id);
      if(!deletedclient){
          return res.status(400).json({message:'client Not find'});
      }
      res.status(200).json({message:'Client deleted Successfully',client:deletedclient});
  }
  catch(error){
      console.error('error deleting client',error);
      res.status(500).json({messge:'Error Deleting client'});
  }
});


//edit Api
app.put('/api/client/:id', async (req,res)=>{
  try{
      const{id}=req.params;
      const updatedata=req.body;
      //FInd by id and update
      const updateClient= await Client.findByIdAndUpdate(id,updatedata,{
          new:true,
          runValidators:true
      });
      if(!updateClient){
          return res.status(404).json({messge:'Client not found'});
      }
      res.status(200).json({message:'Client Updated Successfully', client:updateClient});
  }
  catch(error){
      console.error("error:",error);
      res.status(500).json({message:'Error during update'});
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Server Running")
});
