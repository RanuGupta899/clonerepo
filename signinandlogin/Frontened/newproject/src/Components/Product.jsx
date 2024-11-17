import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./User.css";

function Product() {
    const [ShowModle, setShowModle] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const[filteredproducts,setfilteredproducts]=useState([]);

    const [currentproductId, setCurrentproductId] = useState(null);
    const [productData, setproductData] = useState([]);
    const [searchItem, setSearchItem] = useState("");
    const [formdata, setformdata] = useState({
        name: "",
        price: "",
        description: "",
        image: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setformdata((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setformdata((prevData) => ({
            ...prevData,
            image: file
        }));
    };


    // delete product
const handleDelete=async(id)=>{
    console.log(id);

    const result=await Swal.fire({
        title:"Are you Sure?",
        text:"Once deleted,you will not be  able to recover this product!",
        icon:"warning",
        showCancelButton:true,
        cancelButtonColor:"#d33",
        confirmButtonText:"Yes,Delete"
    });
    if(result.isConfirmed){
        try{
            const response=await axios.delete(`http://localhost:3000/api/product/${id}`);
            Swal.fire("Deleted","User has been deleted ","success");
            fetchproductData();
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
const handleEdit = (product) => {
    setEditMode(true);
    setCurrentproductId(product._id);
    setformdata({
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
       
    });
    setShowModle(true);
    
};



    // Add Product Function
    const handleAddProducts = async () => {
        // console.log(formdata);
        const Api=editMode?`http://localhost:3000/api/products/${currentproductId}`
        :'http://localhost:3000/api/products';
        const apiMethod=editMode?'put':'post';

        const data = new FormData();
        data.append("name", formdata.name);
        data.append("price", formdata.price);
        data.append("description", formdata.description);
        data.append("image", formdata.image);

        try {
            const response = await axios.post("http://localhost:3000/api/products", data, {
                headers:{
                    "Content-Type":"multipart/form-data",
                },
            });
            setproductData(response.data);
                
            Swal.fire("Success", "Product added successfully", "success");

            setShowModle(false);
            setformdata({ name: "", price: "", description: "", image: null });
            fetchproductData();

        } catch (error) {
            console.error("Error:", error);
            Swal.fire("Error", "Something went wrong", "error");
        }
    };
    // console.log(productData)

    useEffect(()=>{
        fetchproductData();
    },[]) 
    // Fetch products Data (Assuming you have this implemented)
    const fetchproductData = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/product/get");
            if(response){
            setproductData(response.data.products);
            // console.log(productData)
            setfilteredproducts(response.data.products);
            }
            // console.log(productData)
        } catch (error) {
            console.error("Failed to fetch product data:", error);
        }
    };

    // Handle Search
   // search item
   const handleSearch=(e)=>{
    const term=e.target.value.toLowerCase();
    setSearchItem(term);
    const filterdList=productData.filter(product=>
        product.name.toLowerCase().includes(term)
        // ||product.price.toLowerCase().includes(term)

    );
    setfilteredproducts(filterdList);
}
    return (
        <div className="users-container">
            <div className="top-bar">
                <input
                    value={searchItem}
                    onChange={handleSearch}
                    className="search-box"
                    type="text"
                    placeholder="Search..."
                />
                <button
                    className="add-use-btn"
                    onClick={() => {
                        setformdata({ name: "", price: "", description: "", image: null });
                        setEditMode(false);
                        setShowModle(true);
                    }}
                >
                    Add Product
                </button>
            </div>

            {/* Table showing products */}
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Image</th>
                        <th colSpan={2}>Action</th>
                    </tr>
                </thead>
                 <tbody>
                    { filteredproducts.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td>{item.description}</td>
                            <td>
                                {item.image ? <img src={`http://localhost:3000/${item.image}`} alt={item.image} width="50" /> : "No Image"}
                            </td>
                          
                            <td>
                                <button
                                    className="rounded bg-primary px-2 text-light border-0"
                                    onClick={() => handleEdit(item)}
                                >
                                    Edit
                                 {/* console.log("response : ",response.data.products); */}
        </button>
                            </td>
                            <td>
                                <button
                                    className="rounded bg-danger text-light px-2 border-0"
                                    onClick={() => handleDelete(item._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody> 
            </table>

            {/* Modal for Adding/Editing Products */}
            {ShowModle && (
                <div className="modle-overlay">
                    <div className="modle">
                        <h3>{editMode ? "Edit Product" : "Add New Product"}</h3>
                        <form
                            className="user-form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddProducts();
                            }}
                        >
                            <label>Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formdata.name}
                                onChange={handleInputChange}
                            />
                            <label>Product Price</label>
                            <input
                                type="text"
                                name="price"
                                value={formdata.price}
                                onChange={handleInputChange}
                            />
                            <label>Description</label>
                            <input
                                type="text"
                                name="description"
                                value={formdata.description}
                                onChange={handleInputChange}
                            />
                            <label>Upload Image</label>
                            <input type="file" onChange={handleImageUpload} />

                            <div className="modal-buttons">
                                <button type="submit" className="save-btn">
                                    {editMode ? "Update" : "Save"}
                                </button>
                                <button type="button" className="cancel-btn" onClick={() => setShowModle(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Product;
