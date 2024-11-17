const express=require('express');
const mongoose=require('mongoose');
const cors=require("cors");
const PORT=3000;
const app=express();
app.use(express.json());
app.use(cors());

const mongoURI='mongodb://localhost:27017/curddatabase';
mongoose.connect(mongoURI)
.then(()=>console.log('MongoDB connected successfully'))
.catch(error=>console.log('Error connecting to MongoDB:',error));


// create Employee Schema
const  employeeSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    remark:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    }

});
// create employee Model
const Employee=mongoose.model('Employee',employeeSchema);

// POST API -add a new client
app.post('/api/employee',async(req,res)=>{
    try{
        const{firstName,lastName,mobile,email,remark,address}=req.body;
        // Check for missing fields
        if(!firstName|| !lastName ||!mobile ||!email ||!address){
            return res.status(400).json({message:'All fields are required'});

        }
        const newEmployee=new Employee({firstName,lastName,mobile,email,remark,address});
        await newEmployee.save();
        res.status(201).json({message:'Employee saved successfully',employee:newEmployee});

    }
    catch(error){
        console.error('Error creating employee:',error);
        res.status(500).json({message:'Error creating employee'});

    }
});
// GET Api 
app.get('/api/employee/get',async(req,res)=>{
    try{
        const data=await Employee.find();
        res.status(200).json({message:'Employee retrieved successfully',employees:data});
    }
    catch(error){
        console.error('Error retrieving employee:',error);
        res.status(500).json({message:'Error retrieving employee'});
    }
});

// delete Api
app.delete('/api/employee/:id', async(req,res)=>{
    try{
        const{id}=req.params;
        // find employee by id
        const deletedemployee=await Employee.findByIdAndDelete(id);
        if(!deletedemployee){
            return res.status(400).json({message:'employee not find'});

        }
        res.status(200).json({message:'Employee deleted Successfully',employee:deletedemployee});

    }
    catch(error){
        console.error('error deleting employee', error);
        res.status(500).json({message:'Error Deleting employee'});
    }
});
// edit api
app.put('/api/employee/:id', async(req,res)=>{
    try{
        const{id}=req.params;
        const updatedata=req.body;
        // Find by id and update
        const updateEmployee=await Employee.findByIdAndUpdate(id,updatedata,{
            new:true,
            runValidators:true
        });
        if(!updateEmployee){
            return res.status(404).json({message:'Employee not found'});
        }
        res.status(200).json({message:'Employee Updated Successfully',employee:updateEmployee});

    }
    catch(error){
        console.error("error:",error);
        res.status(500).json({message:'Error during update'});
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });