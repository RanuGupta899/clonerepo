import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import "./User.css";
import {jsPDF} from "jspdf";
import "jspdf-autotable";
function Users() {
    const [ShowModle, setShowModle] = useState(false);
    const[filterusers,setfilterusers]=useState([]);
    const[searchItem,setsearchItem]=useState("");
    const [userData, setUserData]= useState([])
    const [formdata, setformdata] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        email: "",
        remark: "",
        address: ""
    })
    const[isEditMode,setIsEditMode]=useState(false);
    const[currentuserid,setCurrentUserId]=useState(null);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setformdata({ ...formdata, [name]: value });
    }

// deleted Part
const handleDelete=async(userId)=>{
    console.log(userId);
    // const apiKey= `http://localhost:3001/user/${userId}`
    // show confirmation error
    const result=await Swal.fire({
        title:"Are You Sure?",
        text:"Once deleted ,You will not be able to recover this user!",
        icon:"warning",
        showCancelButton:true,
        cancelButtonColor:"#d33",
        confirmButtonText:"Yes, Delete"
    });
    if(result.isConfirmed){
        try{
             const response=await axios.delete(`http://localhost:3000/api/user/${userId}`);
                Swal.fire("Deleted","User has been deleted","success");
             fetchUserData();
            }
            catch(error){
                Swal.fire("Failed","Failed to delete data","error");
                console.log(error)
            }
        }
    
    else{
        Swal.fire("Canceled","Your data is safe","info");
    }
}



// Export PDF
const exportToPDF=()=>{
    const doc=new jsPDF();
    doc.text("User Data",20,10);
    // define columns and table
    const columns=["First Name","Last Name","Date of Birth","Email","Remark","Address"];
    const rows=filterusers.map(user=>[
        user.firstName,
        user.lastName,
        user.dob,
        user.email,
        user.remark,
        user.address,
    ]);
    // generate th etable in pdf
    doc.autoTable({
        startY:20,
        head:[columns],
        body:rows,
    });
    // save the pdf
    doc.save("userData.pdf");

}
// Edited Part
const handleEdit=(user)=>{
    console.log(user)
   setformdata({
    firstName:user.firstName,
    lastName:user.lastName,
    dob:user.dob,
    email:user.email,
    remark:user.remark,
    address:user.address,

   });
   setCurrentUserId(user._id);
   setIsEditMode(true);
   setShowModle(true);
}

    const handleAddUsers = async () => {
        const Api=isEditMode?`http://localhost:3000/api/user/${currentuserid}`
        :'http://localhost:3000/api/user';
        const apiMethod=isEditMode?'put':'post';

        try {
            //send a post request to API
            const response = await axios[apiMethod](Api, formdata);
            // console.log('User created sucessfully', response.data);
            fetchUserData();
            setShowModle(false);

            Swal.fire({
                title: "You have successfully! save",
                icon: "success",
                confirmButtonText: 'ok'
            }).then(() => {
                fetchUserData();
                setformdata({
                    firstName:"",
                    lastName:"",
                    dob:"",
                    email:"",
                    remark:"",
                    address:"",
                });
                setIsEditMode(false)
                setCurrentUserId(null);

            });

        }
        catch (error) {
            if (error.response) {
                console.error('User  failed', error.response.data);
            }
            else if (error.request) {
                console.error('Error from Server', error.request);

            }
            else {
                console.error('error during signup', error.message);
            }
        }

        //Add your signin logic here e.g dending data to api
        // console.log('User details:', {
        //     firstName,
        //     lastName,
        //     dob,
        //     email,
        //     remark,
        //     address,
        // });
        // setShowModle(false);
    }
useEffect(()=>{
    fetchUserData();
},[])
    async function fetchUserData(){
        try {
            const response = await axios.get('http://localhost:3000/api/user/getdata');
            if(response){
                setUserData(response.data.users);
                setfilterusers(response.data.users);
            }
        } catch (error) {
            console.error(error);
        }
    };
    // search item
    const handleSearch=(e)=>{
        const term=e.target.value.toLowerCase();
        setsearchItem(term);
        const filterdList=userData.filter(user=>
            user.firstName.toLowerCase().includes(term)
            ||user.lastName.toLowerCase().includes(term)
        );
        setfilterusers(filterdList);
    }


    return (
        <div className="users-container">
            <div className="top-bar">
                <input 
                value={searchItem}
                onChange={handleSearch}
                className="search-box" type="text" placeholder="Search..." />
                <button className="export-btn border-0 rounded bg-primary px-2 text-light" onClick={exportToPDF}>Export To PDF</button>
                <button className="add-use-btn" onClick={() => {
                    setformdata({
                        firstName:"",
                        lastName:"",
                        dob:"",
                        email:"",
                        remark:"",
                        address:"",
                    })
                    setIsEditMode(false);
                    setShowModle(true);
                    }}>Add User</button>

            </div>
            {/* table show */}
            <table className="user-table">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Date of Birth</th>
                        <th>Email</th>
                        <th>Remark</th>
                        <th>Address</th>
                        <th colSpan={2}>Action</th>
                    </tr>
                </thead>
                {/* dynamic data here */}
                <tbody>
                {
                    filterusers.map((item, index)=>(
                        <tr key={index}>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.dob}</td>
                    <td>{item.email}</td>
                    <td>{item.remark}</td>
                    <td>{item.address}</td>
                    <td><button className="border-0 rounded bg-primary px-2 text-light" onClick={()=>handleEdit(item)}>Edit</button></td>
                   <td><button  className="border-0 rounded bg-danger px-2 text-light" onClick={()=>handleDelete(item._id)}>
                    Delete</button></td>
                </tr>
                    ))
                }
            </tbody>
            </table>
            {/* open showmodle */}
            {ShowModle && (
                <div className="modle-overlay py-5">
                    <div className="modle">
                        <h3>{isEditMode?"Edit User":"Add New User"}</h3>
                        <form className="user-form" onSubmit={(e) => { e.preventDefault(); handleAddUsers }}>
                            <label>First Name</label>
                            <input type="text" name="firstName" value={formdata.firstName} onChange={handleInputChange} />
                            <label>Last Name</label>
                            <input type="text" name="lastName" value={formdata.lastName} onChange={handleInputChange} />
                            <label>DOB</label>
                            <input type="date" name="dob" value={formdata.dob} onChange={handleInputChange} />
                            <label>Email</label>
                            <input type="email" name="email" value={formdata.email} onChange={handleInputChange} />
                            <label>Remark</label>
                            <input type="text" name="remark" value={formdata.remark} onChange={handleInputChange} />
                            <label>Address</label>
                            <input type="text" name="address" value={formdata.address} onChange={handleInputChange} />

                            <div className="modal-buttons">
                                <button type="button" className="save-btn" onClick={handleAddUsers}>
                                    {isEditMode?"Update":"Save"}</button>
                                <button type="button" className="cancel-btn" onClick={() => setShowModle(false)}>Cancel</button>
                            </div>

                        </form>

                    </div>
                </div>
            )};
        </div>
    );
};
export default Users;


