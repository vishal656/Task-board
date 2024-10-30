import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RefreshHandler = ({ setIsAuthenticated }) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsAuthenticated(true);
            if (location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup") {
                navigate("/home", { replace: true });
            }
        } else {
            setIsAuthenticated(false);
            if (location.pathname !== "/login" && location.pathname !== "/signup") {
                navigate("/login", { replace: true });
            }
        }
    }, [location, setIsAuthenticated, navigate]);

    return null;
};

export default RefreshHandler;
