import styled from "styled-components";
import { Link, useNavigate} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { handleError, handleSuccess } from "../utils";
import "react-toastify/dist/ReactToastify.css"; // Ensure you import the CSS

const Container = styled.div`
  width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: left;
`;
const Input = styled.input`
  text-align: left;
  margin-bottom: 10px;
  width: 100%;
`;

const Button = styled.button`
  width: 103%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const copyLoginInfo = { ...loginInfo, [name]: value };
    setLoginInfo(copyLoginInfo);
  };

  const handleSubmit = async () => {
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("Name, email and password are required");
    }
    try {
      const url = `${import.meta.env.VITE_API_KEY}/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginInfo)
      });
      let result = await response.json();
      const { success, message,jwtToken,name,error } = result;
      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("name", name);
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      }
      else if(error) {
      const details = error.details[0].message;
      handleError(details);
      }
      else if(!success)
      {
        handleError(message);
      }
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <>
      <Container>
        <h3>Login</h3>
        <label htmlFor="email">email:</label>
        <Input
          type="text"
          id="email"
          name="email"
          autoFocus
          onChange={handleChange}
          value={loginInfo.email}
        />
        <label htmlFor="password">Password:</label>
        <Input
          type="text"
          id="password"
          name="password"
          autoFocus
          onChange={handleChange}
          value={loginInfo.password}
        />
        <Button type="submit" onClick={handleSubmit}>
          Submit
        </Button>
        <p>Dont have an Account? <Link to="/signup">Signup</Link></p>
      </Container>
      <ToastContainer /> {/* Ensure ToastContainer is included */}
    </>
  );
};

export default Login;
