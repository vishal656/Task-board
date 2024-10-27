import React ,{useState}from "react";
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
  width: 500px;
  padding: 0rem 0rem;
  border-radius: 10px;
  height: 200px;
  padding:15px;

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
  background-color: #17a2b8;
  border: none;
  color: white;
  font-size: 16px;
  font-family: "Roboto";
  font-weight: 400;
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

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
`;

const AddPeople = ({onClose}) => {
  const navigate = useNavigate();
  const [email,setEmail] =useState("");

  return (
    <Wrapper>
      <WrapperInside>
      <p
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#000",
              fontFamily: "Noto Sans"
            }}
          >
            Add people to the board
          </p>
          <InputWrapper>
            <Input
              type="text"
              name="email"
              placeholder="Email"
              autoFocus
              onChange={(e)=>setEmail(e.target.value)}
              value={email}
            />
          </InputWrapper>
          <div style={{display:"flex",gap:"20px",paddingTop:"15px"}}>
          <CreateButton onClick={()=>onClose()} style={{backgroundColor:"white",border:"1px solid red",color:"red"}}>Cancel</CreateButton>
          <CreateButton>Add Email</CreateButton>
          </div>
      </WrapperInside>
    </Wrapper>
  );
};

export default AddPeople;
