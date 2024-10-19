import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { handleError, handleSuccess } from "../utils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import groupImage from '../assets/image/Group.png';

import "react-toastify/dist/ReactToastify.css";

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
  background-color: #17A2B8;
  flex-direction: column;
`;

const StyledImage = styled.img`
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
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
  background-color: #17A2B8;
  color: white;
  border: none;
  border-radius: 55px;
  cursor: pointer;
`;

const WelcomeText = styled.p`
  color: white;
  font-size: 33px;
  font-weight: 400;
`;

const SubText = styled.p`
  color: white;
  font-size: 19px;
  margin-top: -30px;
`;

const Signup = () => {
  const navigate = useNavigate();
  const [signInfo, setSignInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const copyLoginInfo = { ...signInfo, [name]: value };
    setSignInfo(copyLoginInfo);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async () => {
    const { name, email, password, confirmPassword } = signInfo;
    if (!name || !email || !password || !confirmPassword) {
      return handleError("All fields are required");
    }
    if (password !== confirmPassword) {
      return handleError("Passwords do not match");
    }

    try {
      const url = `${import.meta.env.VITE_API_KEY}/auth/signup`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password, confirmPassword })
      });

      let result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
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

  return (
    <>
      <Container>
        <ImageSide>
          <StyledImage src={groupImage} alt="Group" />
          <WelcomeText>Welcome aboard my friend</WelcomeText>
  <SubText>just a couple of clicks and we start</SubText>
        </ImageSide>
        <BlankSide>
          <p style={{fontSize:"33px",fontWeight:"600px", color:"#343434",fontFamily:"sans-serif"}}>Register</p>

          <InputWrapper>
            <Icon icon={faUser} />
            <Input
              type="text"
              name="name"
              placeholder="Username"
              autoFocus
              onChange={handleChange}
              value={signInfo.name}
            />
          </InputWrapper>

          <InputWrapper>
            <Icon icon={faEnvelope} />
            <Input
              type="text"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={signInfo.email}
            />
          </InputWrapper>

          <InputWrapper>
            <Icon icon={faLock} />
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={signInfo.password}
            />
            <TogglePasswordButton onClick={toggleShowPassword}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </TogglePasswordButton>
          </InputWrapper>

          <InputWrapper>
            <Icon icon={faLock} />
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              value={signInfo.confirmPassword}
            />
            <TogglePasswordButton onClick={toggleShowConfirmPassword}>
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </TogglePasswordButton>
          </InputWrapper>

          <Button type="submit" onClick={handleSubmit}>
            Register
          </Button>
          <p>Have an account ?</p>
          <Button style={{backgroundColor:"white",color:"#17A2B8",border:"1px solid #17A2B8"}} type="submit" onClick={handleSubmit}>
            Log in
          </Button>
        </BlankSide>
      </Container>
      <ToastContainer />
    </>
  );
};

export default Signup;
