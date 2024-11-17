// signup
// Signschema Email password username

const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const cors = require("cors");
const multer=require('multer');

const path=require('path');
const fs=require('fs');
// cerate 'uploads' dr if it does not exist
const uploadDir=path.join(__dirname,'uploads');
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive:true});
}




const { ArrowDownCircleIcon } = require('@heroicons/react/16/solid');
const PORT=3000;
// const {error}=require('console');

const app=express();
app.use(bodyParser.json());
app.use(cors());
const mongoURI='mongodb://localhost:27017/curddatabase';
mongoose.connect(mongoURI)
.then(()=> console.log('MondoDB connected Successfully'))
.catch(error=>console.log(error));
//create user Schema
const signupSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,
       
    },
    password:{
        type:String,
        required:true,
       
    }
  
    
});


//create User Model
const Signup=mongoose.model('Signup',signupSchema);
//Post Api
app.post('/api/signup',async(req,res)=>{
    try{
    const {name,email,password}=req.body;
    //check for missing fields
    if(!name||!email||!password ){
        return res.status(400).json({message:'All field are required'});
    }
    //create a new user instance
    const newSignup=new Signup({
        name,
        email,
        password,
    });
    //save user to the database
    await newSignup.save();
    res.status(201).json({message:'Signup created successfully',signup:newSignup});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Error creating user'})
    }
});



//Login Api
app.post('/api/login',async(req,res)=>{
    try{
    const{email,password}=req.body;
    if(!email || !password){
    return res.status(400).json({message:'Email and Password is required'});
    }
    //find the signup email
    const exitinguser=await Signup.findOne({email});
    if(!exitinguser){
        return res.status(400).json({message:'Invalid Email '});
    }
    //Data match check
    if(exitinguser.password!=password){
        return res.status(400).json({message:'Invalid password'});
    }
    res.status(200).json({message:'Login Successfully',user:exitinguser});
        }
    catch(error){
console.error('Error during Login',error);
res.status(500).json({message:'Error during login'});
    }
}) 


// delete api
app.delete('/api/user/:id',async(res,req)=>{
    try{
        const userId=req.params.id;
        if(!mongoose.Types.ObjectId.isValid(userId)){
            return res.status(400).json({message:'Invalid User Id'});
        }
        const deleteuser=await UserActivation.findByIdAndDelete(userId);
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


// configure multer for image upload-------------------------------------------------------------------------
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');   //save images to upload directory(dr)
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'_'+file.originalname);
    }
});
const upload=multer({storage:storage});

// Product part is start
// product Schema
const ProductSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        require:true,
    },
    description:{
        type:String,
       
    },
    image:{
        type:String,

    },
});
// Model Creation
const product=mongoose.model('product',ProductSchema);
// Save product with image upload
app.post('/api/products',upload.single('image'),async(req,res)=>{
    try{
    const{name,price,description}=req.body;
    const imagepath=req.file?req.file.path:null;
    // create a new product instance
    const newProduct=new ProductSchema({
        name,
        price,
        description,
        image:imagepath,
    });

    // product save in database
    const SavedProduct=await newProduct.save();
    res.status(201).json({message:'Product saved successfully',Product:SavedProduct});
}
catch(error){
console.error(error);
res.status(500).json({message:'failed to save product'});
}
})

app.use('/uploads',express.static(uploadDir));

// get data
app.get('/api/product/get',async(req,res)=>{
    try{
 const data=await product.find();
 res.status(200).json({massage:'Product retrieved successfully',products:data});
    }
    catch(error){
        console.error('error retrieving product ',error);
        res.status(500).json({message:'Error retrieving product'});
    }
})



// delete api
app.delete('/api/product/:id',async(res,req)=>{
    try{
        const productId=req.params.id;
        if(!mongoose.Types.ObjectId.isValid(productId)){
            return res.status(400).json({message:'Invalid product Id'});
        }
        const deleteproduct=await product.findByIdAndDelete(productId);
        if(!deleteproduct){
            return res.status(400).json({message:'Product Not Found'});
        }
        res.status(200).json({message:'Product Deleted Successfully',product:deleteproduct});
    }
    catch(error){
        console.error(error)
        res.status(500).json({message:'Error during product delete'});
    }
})


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} `)

})