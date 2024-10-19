import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleSuccess } from '../utils';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure you import the CSS
//https://task-management-backend-e5of.onrender.com
const Home = () => {
  const [loggedInUser, setLoggedInUser] = React.useState("");
  const [products, setProducts] = React.useState([]);
const navigate=useNavigate();
  useEffect(() => {
    setLoggedInUser(localStorage.getItem("name"));
  },[]);
  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("name");
  handleSuccess("Logged out successfully");
  setTimeout(()=>{
    navigate("/login");
  },2000)
  }

  const fetchProducts = async () => {
  try{
    const url = `${import.meta.env.VITE_API_KEY}/products`;
    const headers={
      headers: {
      "Authorization": `${localStorage.getItem("token")}`
      }
    }
    const response = await fetch(url,headers);
    const result = await response.json();
    setProducts(result);
  }
  catch(err){
    console.error(err);
  }
  }


  useEffect(() => {
    fetchProducts()
  }, []);
  return (
    <div>
    <h3>welcome {loggedInUser}</h3>
    <div>
    {
      products.map((product) => {
        return(
          <>
          <h3>{product.name}</h3>
          <h3>{product.price}</h3>
          </>
        )
      })
    }
    </div>
    <button onClick={handleLogout}>Logout</button>
    <ToastContainer /> {/* Ensure ToastContainer is included */}
    </div>
  )
}

export default Home