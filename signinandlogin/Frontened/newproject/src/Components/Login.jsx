import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
function Login(){
    const [formData,setFormData]=useState({       
        email:'',
        password:'',
    });
    const navigate = useNavigate();


    const handleChange=(e)=>{
        setFormData({
            ...formData,[e.target.name]:e.target.value,
        });
    };
 
    
  const handlesubmit = async (e) => {
    e.preventDefault();

    // Sending a POST request to the backend login API
    try {
        const response = await  axios.post('http://localhost:3000/api/login', formData, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // body: JSON.stringify(formData),
        });

        // const result = await response.json();

        if (response.status===200) {
            Swal.fire({
                title: "Login Successfully!",
                icon: "success"
            });
            navigate('/dashboard');
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: result.message || "Invalid login credentials",
            });
        }
    } catch (error) {
        console.error("Error during login:", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "An error occurred. Please try again later.",
        });
    }
};

    return(
<div>
<div className="login-container">
    <form className="login-form" onSubmit={handlesubmit}>
        <h2>Login Form</h2>
       
        <div className="form-group">
            <label htmlFor="name">Email</label>
            <input type="email " 
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email" required />
        </div>
        <div className="form-group">
            <label htmlFor="name">Password</label>
            <input type="password" 
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password" required />
        </div>
        <button type="submit" className="submit-btn">Login</button>
    </form>
   </div>
</div>
    )
}
export default Login;