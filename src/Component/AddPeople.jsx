import { useState, useEffect } from "react";
import styled from "styled-components";
import { handleSuccess, handleError } from "../utils";
import { useNavigate } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

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
  padding: 15px;

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

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
`;

const AssignInputContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  width: 100%;
  cursor: pointer;
  position: relative;
`;

const Label = styled.label`
  font-weight: 500;
  margin-top: 15px;
  display: block;
  font-size: 14px;
  font-family: "Inter";
  padding-bottom: 10px;
`;

const InputField = styled.input`
  border: none;
  outline: none;
  width: 100%;
  padding-right: 24px;
`;
const DropdownIcon = styled(FaAngleDown)`
  position: absolute;
  right: 10px;
  color: #888;
`;
const OptionsContainer = styled.div`
  position: absolute;
  top: 79%;
  right: 0%;
  width: 79.8%;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  z-index: 10;
  max-height: 150px;
  overflow-y: auto;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
`;
const UserOption = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ButtonLogo = styled.button`
  background-color: #ffebeb;
  color: #000;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
`;

const AssigneeText = styled.p`
  margin: 0 10px;
  flex-grow: 1;
`;

const AssignButton = styled.button`
  background-color: #e2e2e2;
  color: #000;
  border: none;
  border-radius: 8px;
  padding: 4px 8px;
  cursor: pointer;
  width: 154px;
  height: 31px;
`;

const SuccessMessage = styled.div`
  margin-top: 15px;
  color: black;
  font-weight: 600;
  text-align: center;
  font-size: 20px;
  font-family: 'Noto Sans';
`;
const AddPeople = ({ onClose, setRefresh }) => {
  const [selectedEmail, setSelectedEmail] = useState("");
  const [isShown, setisShown] = useState(false);
  const [users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const toggleDropdown = () => {
    setisShown((prev) => !prev);
  };

  const handleUserSelect = (email) => {
    setSelectedEmail(email);
    setisShown(false);
  };

  let UserNameCapitalized = (name) => {
    let trimmedName = name.trim();
    let username = trimmedName.split(/\s+/);
    if (username.length > 1) {
      return (
        username[0].slice(0, 1).toUpperCase() +
        username[1].slice(0, 1).toUpperCase()
      );
    } else {
      return username[0].slice(0, 1).toUpperCase();
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_API_KEY}/auth/getAllUsers`;
      // const url = `http://localhost:3000/auth/getAllUsers`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const { success, users, message, error } = result;

      if (success) {
        setUsers(users);
      } else if (error) {
        handleError(error.details ? error.details[0].message : error.message);
      } else {
        handleError(message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const assignDashboardTasks = async (assigneeEmail) => {
    try {
      const url = `${import.meta.env.VITE_API_KEY}/auth/assign-tasks`;
      // const url = `http://localhost:3000/auth/assign-tasks`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
        },
        body: JSON.stringify({ assigneeEmail })
      });

      const result = await response.json();
      if (result.success) {
        //  handleSuccess(result.message);
        setRefresh(uuidv4());
        setSuccessMessage(result.message);
        // fetchTasksCards();
      } else {
        handleError(result.message || "Failed to assign tasks");
      }
    } catch (error) {
      handleError("Error assigning tasks:", error);
    }
  };

  return (
    <Wrapper>
      <WrapperInside>
        {successMessage ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "4rem",
              gap:"20px"
            }}
          >
            <SuccessMessage>{successMessage}</SuccessMessage>
            <CreateButton onClick={() => onClose()}>Okay got it!</CreateButton>
          </div>
        ) : (
          <>
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
            <Container>
              <Label style={{ width: "120px" }}>Assign to</Label>
              <AssignInputContainer onClick={toggleDropdown}>
                <InputField
                  type="text"
                  name="assign"
                  value={selectedEmail}
                  readOnly
                />
                <DropdownIcon />
              </AssignInputContainer>

              {isShown && (
                <OptionsContainer>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <UserOption
                        key={user._id}
                        onClick={() => handleUserSelect(user.email)}
                      >
                        <ButtonLogo>
                          {UserNameCapitalized(user.name)}
                        </ButtonLogo>
                        <AssigneeText>{user.email}</AssigneeText>
                        <AssignButton>Assign</AssignButton>
                      </UserOption>
                    ))
                  ) : (
                    <div>No users available</div>
                  )}
                </OptionsContainer>
              )}
            </Container>
            <div style={{ display: "flex", gap: "20px", paddingTop: "25px" }}>
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
              <CreateButton onClick={() => assignDashboardTasks(selectedEmail)}>
                Add Email
              </CreateButton>
            </div>
          </>
        )}
      </WrapperInside>
    </Wrapper>
  );
};

export default AddPeople;
