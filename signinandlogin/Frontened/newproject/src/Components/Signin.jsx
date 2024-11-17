import { useState } from "react";
import React from "react";
import Swal from 'sweetalert2'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
// import './Signup.css';
function Signup(){
const[name,setName]=useState('');
const[email,setEmail]=useState('');
const[password,setPassword]=useState('');
const navigate = useNavigate();


const handlesubmit=async (e)=>{
    e.preventDefault();
    //define the api endpoint
    // const Api='http://localhost:300/api/signin';
    const Api='http://localhost:3000/api/signup';

    //prepare the signin data
    const signindata={
        name,
        email,
        password
    };
    try{
        //send a post request to API
        const response= await axios.post(Api, signindata);
        console.log('Signup sucessfully', response.data);
        Swal.fire({
            title: "Registered successfully!",
            icon: "success"
          });
        navigate('login/')

    }
    catch(error){
if(error.response){
    console.error('Signup failed',error.response.data);
}
else if(error.request){
    console.error('Error from Server',error.request);

}
else{
    console.error('error during signup',error.message);
}
    }

    //Add your signin logic here e.g dending data to api
    console.log('Signin details:',{name,email,password});
}
 
    return(
<div>
   <div className="signup-container">
    <form className="signup-form" onSubmit={handlesubmit}>
        <h2>Signup Form</h2>
        <div className="form-group">
            <label htmlFor="name">Name</label>
            <input required type="text " 
            
           value={name}
            onChange={(e)=>setName(e.target.value)}
            placeholder="Enter your name"  />
        </div>
        <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="text " 
            id="email"
            name="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="Enter your email" required />
        </div>
        <div className="form-group">
            <label htmlFor="name">Password</label>
            <input type="text" 
            id="password"
            name="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="Enter your password" required />
        </div>
        <button type="submit" className="submit-btn" >Sign Up</button>
    </form>
   </div>
</div>
    )
}
export default Signup;