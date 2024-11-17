const express=require('express');
const mongoose=require('mongoose');
const cors=require("cors");
const PORT=3000;
const app=express();
app.use(express.json());
app.use(cors());


const mongoURI='mongodb://localhost:27017/curddatabase';
mongoose.connect(mongoURI)
.then(()=>console.log('MongoDB connected Successfully'))
.catch(error=>console.log('Error connecting to mongodb:',error));


const ProductSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
    },
});
// Model creation
const Product=mongoose.model('Product',ProductSchema);
try{
    const{name,price,description}=req.body;
    
    // create a new product instance
    const newProduct =new Product({
        name,
        price,
        description,
    });
    // product save in database
    const savedProduct=await newProduct.save();
    res.status(500).json({message:'Product saved successfully',Product:savedProduct});
}
catch(error){
    console.error(error);
    res.status(500).json({message:'failed to save product'});
}