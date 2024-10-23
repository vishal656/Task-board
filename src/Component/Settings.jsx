import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import { handleError, handleSuccess } from "../utils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import "react-toastify/dist/ReactToastify.css";

const Container = styled.div`
`;

const FormWrapper = styled.div`
  width: 493px;
  display: flex;
  flex-direction: column;
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

const Settings = ({loggedInUser,loggedInEmail}) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: ""
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    setUserInfo({
      name: loggedInUser,
      email: loggedInEmail,
      oldPassword: "",
      newPassword: ""
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const toggleShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleUpdate = async () => {
    const { name, email, oldPassword, newPassword } = userInfo;
    if (!name || !email || (newPassword && !oldPassword)) {
      return handleError("All fields are required");
    }

    try {
      // const url = `${import.meta.env.VITE_API_KEY}/auth/update`;
      const url = `http://localhost:3000/auth/update`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify({ name, email, oldPassword, newPassword }),
      });

      let result = await response.json();
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        localStorage.removeItem("token");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error) {
        handleError(error.details ? error.details[0].message : error.message);
      }
      else{
        handleError(message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Container>
        <FormWrapper>
          <h2 style={{fontSizee:"22px",fontFamily:"sans-serif",fontWeight:"600"}}>Settings</h2>

          <InputWrapper>
            <Icon icon={faUser} />
            <Input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              value={userInfo.name}
            />
          </InputWrapper>

          <InputWrapper>
            <Icon icon={faEnvelope} />
            <Input
              type="text"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={userInfo.email}
            />
          </InputWrapper>

          <InputWrapper>
            <Icon icon={faLock} />
            <Input
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              placeholder="Old Password"
              onChange={handleChange}
              value={userInfo.oldPassword}
            />
            <TogglePasswordButton onClick={toggleShowOldPassword}>
              <FontAwesomeIcon icon={showOldPassword ? faEye : faEyeSlash} />
            </TogglePasswordButton>
          </InputWrapper>

          <InputWrapper>
            <Icon icon={faLock} />
            <Input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              placeholder="New Password"
              onChange={handleChange}
              value={userInfo.newPassword}
            />
            <TogglePasswordButton onClick={toggleShowNewPassword}>
              <FontAwesomeIcon icon={showNewPassword ? faEye : faEyeSlash} />
            </TogglePasswordButton>
          </InputWrapper>

          <Button onClick={handleUpdate}>
            Update
          </Button>
        </FormWrapper>
      </Container>
      <ToastContainer />
    </>
  );
};

export default Settings;
