import React from 'react'
import styled from "styled-components";
import { handleSuccess } from "../utils";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WrapperInside = styled.div`
  background-color: white;
  width: 330px;
  padding: 0rem 0rem;
  border-radius: 10px;
  height: 200px;

  @media (max-width: 768px) {
    width: 90%;
    padding: 15px;
  }

  @media (max-width: 480px) {
    width: 95%;
    padding: 10px;
  }
`;

const CreateButton = styled.button`
  width: 300px;
  height: 45px;
  border-radius: 12px;
  background-color: #17A2B8;
  border: none;
  color: white;
  font-size: 16px;
  font-family: "Roboto";
  font-weight: 400;
  margin: 0 16px 15px 15px;
  text-align: center;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 18px;
    width: 130px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
    width: 120px;
  }
`;

const LogoutModal = ({loggedInUser,onClose}) => {
    const navigate = useNavigate();
  const handleLogout = ()=>{
        localStorage.removeItem("token");
    localStorage.removeItem("name");
    handleSuccess("Logged out successfully");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }
  return (
    <Wrapper>
      <WrapperInside>
      <p style={{fontWeight:"600",fontSize:"16px",fontFamily:"Noto Sans",textAlign:"center",padding:"20px 0 0 0"}}>Are you sure you want to Logout?</p>
      <CreateButton onClick={handleLogout}>Yes,  Logout</CreateButton>
      <CreateButton onClick={()=>onClose()} style={{backgroundColor:"white",border:"1px solid red",color:"red"}}>Cancel</CreateButton>
          </WrapperInside>
    </Wrapper>
  )
}

export default LogoutModal