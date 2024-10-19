import './App.css'
import {BrowserRouter,Routes,Route, Navigate} from "react-router-dom";
import Signup from "./Component/Signup";
import Login from "./Component/Login";
import {useState}  from "react";
import Home from "./Component/Home";
import RefreshHandler from './Component/RefreshHandler';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const PrivateRoute = ({element})=>{
    return isAuthenticated? element : <Navigate to="/login" />
  }


  return (
    <BrowserRouter>
    <RefreshHandler setIsAuthenticated={setIsAuthenticated}/>
    <Routes>
    <Route path="/" element={<Navigate to="/login" />}/>
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login />} />
    <Route path="/home" element={<PrivateRoute element={<Home />}/>} />
    <Route path="*" element={<div>Not Found</div>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
