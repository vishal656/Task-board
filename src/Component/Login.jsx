import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { handleError, handleSuccess } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash
} from "@fortawesome/free-solid-svg-icons";
import groupImage from "../assets/image/Group.png";
import "react-toastify/dist/ReactToastify.css"; // Ensure you import the CSS

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const ImageSide = styled.div`
  flex: 0.6;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #17a2b8;
  flex-direction: column;
`;

const StyledImage = styled.img`
  position: absolute;
  width: 260.86px;
  height: 301.82px;
`;

const CircleWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  background-color: #317f8b;
  border-radius: 50%;
  width: 300.58px;
  height: 245.58px;
  padding-top: 4.2rem;
  padding-right: 15px;
`;

const BlankSide = styled.div`
  flex: 0.4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
`;

const Icon = styled(FontAwesomeIcon)`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
`;

const TogglePasswordButton = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #888;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #17a2b8;
  color: white;
  border: none;
  border-radius: 55px;
  cursor: pointer;
`;

const WelcomeText = styled.p`
  color: white;
  font-size: 34px;
  font-weight: 400;
  padding-top: 3rem;
`;

const SubText = styled.p`
  color: white;
  font-size: 19px;
  margin-top: -30px;
`;

const Login = () => {
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

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
      const { success, message, jwtToken, name, email, error } = result;
      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else if (error) {
        const details = error.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
      <Container>
        <ImageSide>
          <CircleWrapper>
            <StyledImage src={groupImage} alt="Group" />
          </CircleWrapper>
          <WelcomeText>Welcome aboard my friend</WelcomeText>
          <SubText>just a couple of clicks and we start</SubText>
        </ImageSide>
        <BlankSide>
          <p
            style={{
              fontSize: "33px",
              fontWeight: "600px",
              color: "#343434",
              fontFamily: "sans-serif"
            }}
          >
            Login
          </p>
          <InputWrapper>
            <Icon icon={faEnvelope} />
            <Input
              type="text"
              name="email"
              placeholder="Email"
              autoFocus
              onChange={handleChange}
              value={loginInfo.email}
            />
          </InputWrapper>
          <InputWrapper>
            <Icon icon={faLock} />
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Password"
              autoFocus
              onChange={handleChange}
              value={loginInfo.password}
            />
            <TogglePasswordButton onClick={toggleShowPassword}>
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </TogglePasswordButton>
          </InputWrapper>

          <Button type="submit" onClick={handleSubmit}>
            Submit
          </Button>
          <p
            style={{
              fontWeight: "400",
              fontSize: "18px",
              color: "#828282",
              fontFamily: "serif"
            }}
          >
            Have an account ?
          </p>
          <Button
            style={{
              backgroundColor: "white",
              color: "#17A2B8",
              border: "1px solid #17A2B8"
            }}
            type="submit"
            onClick={() => navigate("/signup")}
          >
            Register
          </Button>
        </BlankSide>
      </Container>
      <ToastContainer /> {/* Ensure ToastContainer is included */}
    </>
  );
};

export default Login;
