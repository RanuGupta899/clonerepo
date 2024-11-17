const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const app=express();
app.use(express.json());
app.use(cors());
const multer=require('multer');
const path=require('path')
const fs=require('fs');
const { error } = require('console');


const mongoURI='mongodb://localhost:27017/curddatabase';
mongoose.connect(mongoURI)
.then(()=>console.log('MongoDB connected successfully'))
.catch(error=>console.log('Error connecting to MongoDB:',error));




// create upload dr if it does not exist
const uploadDir=path.join(__dirname,'uploads');
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive:true});
}

// configure multer for image upload
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,Date.now()+'_'+file.originalname);

    }
});
app.use('/uploads',express.static('uploads'))
const upload=multer({storage:storage});

// Product schema
const ProductSchema=new mongoose.Schema({
    name:{
        type:String,require:true,
    },
    price:{
        type:String,require:true,
    },
    description:{
        type:String,require:true,
    },
    image:{
        type:String,
    },
});
// Model Ceration
const Product=mongoose.model('Product',ProductSchema);
// save product with image upload
app.post('/api/products',upload.single('image'),async(req,res)=>{
    try{
        const{name,price,description}=req.body;
        const imagepath=req.file?req.file.path:null;

        // create a new product instance
        const newProduct=new Product({
            name,
            price,
            description,
            image:imagepath,
        });
        // product save in database
        const savedProduct=await newProduct.save();
        res.status(201).json({mesasge:'Product saved successfully',product:savedProduct});

    }
    catch(error){
        console.error(error);
         res.status(500).json({message:'failed to save product'});

    }
})
// get data
app.get('/api/product/get',async(req,res)=>{
    try{
        const product=await Product.find();
         return res.status(200).json({message:'Product retrieved successfully',products:product});

    }
    catch(error){
        console.error('error retieving product',error);
        return res.status(500).json({message:'Error retrieving product'});
    }
});
// delete product
app.delete('api/product/:id',async(req,res)=>{
    try{
        const productId=req.params.id;
        if(!mongoose.Types.ObjectId.isValid(productId)){
            return res.status(400).json({message:'Invalid product Id'});

        }
        const deleteProduct=await Product.findByIdAndDelete(productId);
        if(!deleteProduct){
            return res.status(400).json({message:'Product not found'});

        }
        res.status(200).json({message:'Product deleted successfully'});
    }
    catch(errro){
        comsole.error('Error deleting product',error)
        res.status(500).json({message:'Errro during  delete'});
    }
})

// edit api
app.put('/api/product/:id',async(req,res)=>{
    try{
        const{id}=req.params;
        const updatedata=req.body;
        // find by id and update
        const updateProduct=await Product.findByIdAndUpdate(id,updatedata,{
            new:true,
            runValidators:true
        });
        if(!updateProduct){
            return res.status(400).json({message:'Product not found'});
        }
        res.status(200).json({message:'Product Updated sucessfully',product:updateProduct});

    }
    catch(errro){
        console.error("error:",error);
        res.status(500).json({messsage:'Error during update'});
    }
});
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})
