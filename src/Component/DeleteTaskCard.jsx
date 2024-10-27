import React from "react";
import styled from "styled-components";
import { handleSuccess,handleError } from "../utils";
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
  background-color: #17a2b8;
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

const DeleteTaskCard = ({ onClose, fetchTasksCards, modalData }) => {

  const handleDelete = async () => {
    try {
      const url = `${import.meta.env.VITE_API_KEY}/auth/tasks/${modalData._id}`;
      // const url = `http://localhost:3000/auth/tasks/${modalData._id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
        }
      });

      const result = await response.json();
      if (result.success) {
        handleSuccess("Task deleted successfully");
        fetchTasksCards();
        onClose();
      } else {
        console.error(result.error);
      }
    } catch (error) {
      handleError("Failed to delete task:", error);
    }
  };

  return (
    <Wrapper>
      <WrapperInside>
        <p
          style={{
            fontWeight: "600",
            fontSize: "16px",
            fontFamily: "Noto Sans",
            textAlign: "center",
            padding: "20px 0 0 0"
          }}
        >
          Are you sure you want to Delete?
        </p>
        <CreateButton onClick={handleDelete}>Yes, Delete</CreateButton>
        <CreateButton
          onClick={() => onClose()}
          style={{
            backgroundColor: "white",
            border: "1px solid red",
            color: "red"
          }}
        >
          Cancel
        </CreateButton>
      </WrapperInside>
    </Wrapper>
  );
};

export default DeleteTaskCard;
