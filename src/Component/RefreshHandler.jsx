import { useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
const RefreshHandler = ({setIsAuthenticated}) => {
    let location = useLocation();
    let navigate = useNavigate();

    useEffect(()=>{
       if(localStorage.getItem("token")){
        setIsAuthenticated(true);
        if(location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup"  ){
        navigate("/home",{replace: true  });
        }
       }
    },[location,setIsAuthenticated,navigate])
  return (
    null
  )
}

export default RefreshHandler