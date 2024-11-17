import React, { useState,useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./User.css";
function Employee(){
    const [ShowModle,setShowModle]=useState(false);
    const[employeeData, setEmployeeData]=useState([]);
    const[filteremployees,setfilteremployees]=useState([]);
    const[searchItem,setsearchItem]=useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentemployeeid, setCurrentEmployeeId] = useState(null);
    const [formdata,setformdata]=useState({
        firstName:"",
        lastName:"",
        mobile:"",
        email:"",
        remark:"",
        address:""
    })
    const handleInputChange=(e)=>{
        const {name,value}=e.target;
        setformdata({...formdata,[name]:value});
    }

// deleted part
const handleDelete=async(id)=>{
    console.log(id);

    const result=await Swal.fire({
        title:"Are you Sure?",
        text:"Once deleted,you will not be  able to recover this client!",
        icon:"warning",
        showCancelButton:true,
        cancelButtonColor:"#d33",
        confirmButtonText:"Yes,Delete"
    });
    if(result.isConfirmed){
        try{
            const response=await axios.delete(`http://localhost:3000/api/employee/${id}`);
            Swal.fire("Deleted","User has been deleted ","success");
            fetchEmployeeData();
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

// Edited Part
const handleEdit = (client) => {
    setEditMode(true);
    setCurrentEmployeeId(client._id);
    setformdata({
        firstName: client.firstName,
        lastName: client.lastName,
        mobile: client.mobile,
        email: client.email,
        remark: client.remark,
        address: client.address,
    });
    setShowModle(true);
};


    const handleAddEmployees= async()=>{
        const Api=editMode?`http://localhost:3000/api/employee/${currentemployeeid}`
        :'http://localhost:3000/api/employee';
        const apiMethod=editMode?'put':'post';
        try{
            //send a post request to api
            const response=await axios [apiMethod](Api,formdata);
            console.log('Employee created sucessfully',response.data);
            fetchEmployeeData();
            setShowModle(false);
            Swal.fire({
                title:"You have successfully edited",
                icon:"success",
                confirmButtonText:'ok'
            }).then(()=>{
                setShowModle(false);
            })
        }
        
        
        catch(error){
            if(error.response){
                Swal.fire("Failed","Failed to delete data","error");
                console.error('User failed',error.response.data);
            }
            else if(error.request){
                console.error('Error from Server',error.request);
            }
            else{

                console.error('error during signup',error.message);
            }
        }
        
        console.log('Employee details:',{
            firstName,lastName,mobile,email,remark,address,
        });
       
    }
    useEffect(()=>{
        fetchEmployeeData();
    },[]) 
    async function fetchEmployeeData(){
        try{
            const response=await axios.get('http://localhost:3000/api/employee/get')
            if(response){
                setEmployeeData(response.data.employees);
                setfilteremployees(response.data.employees);
            }
            console.log(employeeData);
        }
        catch(error){
            console.error(error);
        }
    };
    // search item
    const handleSearch=(e)=>{
        const term=e.target.value.toLowerCase();
        setsearchItem(term);
        const filterdList=employeeData.filter(employee=>
            employee.firstName.toLowerCase().includes(term)
            ||employee.lastName.toLowerCase().includes(term)
        );
        setfilteremployees(filterdList);
    }
    return(
        <div className="users-container">
            <div className="top-bar">
                <input
                value={searchItem}
                onChange={handleSearch}
                className="search-box" type="text" placeholder="Search..."/>
                <button className="add-use-btn" onClick={()=>
                    {
                        setformdata({
                            firstName: "",
                            lastName: "",
                            mobile: "",
                            email: "",
                            remark: "",
                            address: "",
                        })
                    setEditMode(false);
                    
                    setShowModle(true);
                }}
                    >Add Employee</button>
                    
            </div>
            {/* table show */}
            <table className="user-table">
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Remark</th>
                    <th>Address</th>
                    <th colSpan={2}>Action</th>
                </tr>
            </thead>
            {/* dynamic data here */}
            <tbody>
                {
                    filteremployees.map((item,index)=>(
                        <tr key={index}>
                        <td>{item.firstName}</td>
                        <td>{item.lastName}</td>
                        <td>{item.mobile}</td>
                        <td>{item.email}</td>
                        <td>{item.remark}</td>
                        <td>{item.address}</td>
                        <td><button className="rounded bg-primary px-2 text-light border-0" onClick={()=>handleEdit(item)}>Edit</button></td>
                   <td><button className="rounded bg-danger text-light px-2 border-0" onClick={()=>handleDelete(item._id)}>
                    Delete</button></td>
                    </tr>
                    ))
                }
               
            </tbody>
            </table>
            {/* open showmodle */}
            {ShowModle &&(
                <div className="modle-overlay">
                    <div className="modle">
                        <h3>{editMode?"Edit Employee":"Add New Employee"}</h3>
                        <form className="user-form" onSubmit={(e)=>{e.preventDefault();handleAddEmployees}}>
                            <label>First Name</label>
                            <input type="text" name="firstName" value={formdata.firstName} onChange={handleInputChange}/>
                            <label>Last Name</label>
                            <input type="text" name="lastName" value={formdata.lastName} onChange={handleInputChange}/>
                            <label>Mobile</label>
                            <input type="text" name="mobile" value={formdata.mobile} onChange={handleInputChange}/>
                            <label>Email</label>
                            <input type="email" name="email" value={formdata.email} onChange={handleInputChange}/>
                            <label>Remark</label>
                            <input type="text" name="remark" value={formdata.remark} onChange={handleInputChange}/>
                            <label>Address</label>
                            <input type="text" name="address" value={formdata.address} onChange={handleInputChange}/>

                            <div className="modal-buttons">
                                <button type="button" className="save-btn" onClick={handleAddEmployees}>Save</button>
                                <button type="button" className="cancel-btn" onClick={()=>setShowModle(false)}>Cancel</button>
                            </div>

                        </form>

                    </div>
                </div>
            )};
        </div>
    );
};
export default Employee;
