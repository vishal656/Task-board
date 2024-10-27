import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { handleError, handleSuccess } from "../utils";
import DeleteIcon from "../assets/image/Delete.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from "uuid";
import { FaAngleDown } from "react-icons/fa";

// Styled Components
const ModalBackground = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background-color: white;
  width: 666px;
  padding: 20px;
  border-radius: 22px;
  max-height: 400px;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 90%;
    padding: 15px;
  }

  @media (max-width: 480px) {
    width: 95%;
    padding: 10px;
  }
`;

const Label = styled.label`
  font-weight: 500;
  margin-top: 15px;
  display: block;
  font-size: 14px;
  font-family: "Inter";
  padding-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  box-sizing: border-box;
`;

const PriorityGroup = styled.div`
  display: flex;
  gap: 15px;
`;

const PriorityButton = styled.label`
  display: flex;
  align-items: center;
  padding: 10px 8px 8px 8px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  gap: 5px;
  &:hover {
    background-color: #eeecec;
    transform: translateY(-2px);
  }
  input[type="radio"] {
    accent-color: ${({ status }) =>
      status === "HIGH_PRIORITY"
        ? "#FF2473"
        : status === "MODERATE_PRIORITY"
        ? "#18B0FF"
        : "#63C05B"};
  }

  input {
    margin-right: 4px;
  }
  span {
    font-size: 14px;
    color: #767575;
    font-weight: 500;
  }
`;

const ChecklistContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ChecklistItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChecklistInput = styled.input`
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ff4d4f;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;

  &:hover {
    background-color: #fff1f0;
    border-radius: 4px;
  }
`;

const AddNewButton = styled.button`
  margin-top: 10px;
  color: #767575;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 500;
  text-align: left;
  &:hover {
    color: #008080;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  background-color: ${(props) => (props.primary ? "#00a8a8" : "#fff")};
  color: ${(props) => (props.primary ? "#fff" : "red")};
  border: 1px solid ${(props) => (props.primary ? "#00a8a8" : "red")};
  width: 162.58px;
  font-size: 16px;

  &:hover {
    background-color: ${(props) => (props.primary ? "#008080" : "#f5f5f5")};
  }
`;

const ErrorMessage = styled.span`
  color: #ff4d4f;
  font-size: 12px;
  margin-bottom: 10px;
  display: block;
`;

const DueDateButton = styled.button`
  padding: 10px 20px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const DateWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const CalendarContainer = styled.div`
  position: absolute;
  top: -238px;
  left: 100px;
  z-index: 1000;
`;

const SelectDropdown = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  background-color: white;
  cursor: pointer;
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
  width: 83.5%;
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

const EditTaskCard = ({
  onClose,
  fetchTasksCards,
  modalData,
  setRefresh,
  setTasks
}) => {
  const [title, setTitle] = useState(modalData.title || "");
  const [priority, setPriority] = useState(
    modalData.priority || "MODERATE_PRIORITY"
  );
  const [assignee, setAssignee] = useState(modalData.assignee || "");
  const [dueDate, setDueDate] = useState(
    modalData.dueDate ? new Date(modalData.dueDate) : null
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(modalData.assignee || "");
  const [isShown, setisShown] = useState(false);
  const [checklist, setChecklist] = useState(
    (modalData.checklist || []).map((item) => ({
      ...item,
      id: item._id
    }))
  );

  const [users, setUsers] = useState([]);

  const [errors, setErrors] = useState({
    title: "",
    checklist: ""
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      title: "",
      priority: "",
      dueDate: "",
      checklist: ""
    };

    if (!title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
      isValid = false;
    }

    if (checklist.length === 0) {
      newErrors.checklist = "At least one checklist item is required";
      isValid = false;
    } else {
      const hasEmptyTasks = checklist.some((item) => !item.text.trim());
      if (hasEmptyTasks) {
        newErrors.checklist = "All checklist items must have a description";
        isValid = false;
      }

      const hasCheckedItem = checklist.some((item) => item.completed);
      if (!hasCheckedItem) {
        newErrors.checklist = "At least one checklist item is required";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const getCheckedCount = () =>
    checklist.filter((item) => item.completed).length;

  const handleAddChecklistItem = () => {
    const newItem = {
      id: Date.now(),
      text: "",
      completed: false
    };
    setChecklist([...checklist, newItem]);
  };

  const handleRemoveChecklistItem = (id) => {
    setChecklist(checklist.filter((item) => item.id !== id));
    setErrors((prev) => ({ ...prev, checklist: "" }));
  };

  const handleChecklistItemChange = (id, completed) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, completed } : item))
    );
  };

  const handleChecklistTextChange = (id, text) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, text } : item))
    );
    setErrors((prev) => ({ ...prev, checklist: "" }));
  };

  const handleSave = async () => {
    if (validateForm()) {
      const taskData = {
        title: title,
        status: modalData.status,
        priority: priority,
        assignee: selectedEmail,
        dueDate: dueDate ? dueDate : null,
        checklist: checklist.filter((item) => item.completed === true)
      };
      try {
        const url = `${import.meta.env.VITE_API_KEY}/auth/tasks/${
          modalData._id
        }`;
        // const url = `http://localhost:3000/auth/tasks/${modalData._id}`;
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token")
          },
          body: JSON.stringify(taskData)
        });

        let result = await response.json();
        const { success, message, error } = result;
        if (success) {
          handleSuccess(message);
          // fetchTasksCards();
          setTasks((prevTasks) => {
            const updatedTasks = prevTasks.map((task) =>
              task._id === modalData._id ? { ...task, ...taskData } : task
            );
            return [...updatedTasks];
          });
          //setRefresh(uuidv4());
          onClose();
        } else if (error) {
          handleError(error.details ? error.details[0].message : error.message);
        } else {
          handleError(message);
        }
      } catch (error) {
        handleError(error);
      }
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

  const handleDateChange = (date) => {
    setDueDate(date);
    setShowCalendar(false);
  };

  const handleUserSelect = (email) => {
    setSelectedEmail(email);
    setisShown(false);
  };

  const toggleDropdown = () => {
    setisShown((prev) => !prev);
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

  return (
    <ModalBackground>
      <ModalContainer>
        {/* Title Input */}
        <div>
          <Label>
            Title <span style={{ color: "#ff4d4f" }}>*</span>
          </Label>
          <Input
            placeholder="Enter Task Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prev) => ({ ...prev, title: "" }));
            }}
            error={!!errors.title}
          />
          {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            justifyContent: "space-between",
            paddingBottom: "10px"
          }}
        >
          <Label>
            Select Priority <span style={{ color: "#ff4d4f" }}>*</span>
          </Label>
          <PriorityGroup>
            <PriorityButton status="HIGH_PRIORITY">
              <input
                type="radio"
                name="priority"
                value="HIGH_PRIORITY"
                checked={priority === "HIGH_PRIORITY"}
                onChange={(e) => {
                  setPriority(e.target.value);
                  setErrors((prev) => ({ ...prev, priority: "" }));
                }}
              />
              <span>HIGH PRIORITY</span>
            </PriorityButton>
            <PriorityButton status="MODERATE_PRIORITY">
              <input
                type="radio"
                name="priority"
                value="MODERATE_PRIORITY"
                checked={priority === "MODERATE_PRIORITY"}
                onChange={(e) => {
                  setPriority(e.target.value);
                  setErrors((prev) => ({ ...prev, priority: "" }));
                }}
              />
              <span>MODERATE PRIORITY</span>
            </PriorityButton>
            <PriorityButton status="LOW_PRIORITY">
              <input
                type="radio"
                name="priority"
                value="LOW_PRIORITY"
                checked={priority === "LOW_PRIORITY"}
                onChange={(e) => {
                  setPriority(e.target.value);
                  setErrors((prev) => ({ ...prev, priority: "" }));
                }}
              />
              <span>LOW PRIORITY</span>
            </PriorityButton>
          </PriorityGroup>
        </div>

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
                    <ButtonLogo>{UserNameCapitalized(user.name)}</ButtonLogo>
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

        {/* Checklist */}
        <div>
          <Label>
            Checklist ({getCheckedCount()}/{checklist.length}){" "}
            <span style={{ color: "#ff4d4f" }}>*</span>
          </Label>
          <ChecklistContainer>
            {checklist.map((item) => (
              <ChecklistItem key={item.id}>
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={(e) =>
                    handleChecklistItemChange(item.id, e.target.checked)
                  }
                />

                <ChecklistInput
                  value={item.text}
                  placeholder="Task to be done"
                  onChange={(e) =>
                    handleChecklistTextChange(item.id, e.target.value)
                  }
                  error={!!errors.checklist}
                />
                <DeleteButton
                  onClick={() => {
                    handleRemoveChecklistItem(item.id);
                  }}
                >
                  <img src={DeleteIcon} alt="" />
                </DeleteButton>
              </ChecklistItem>
            ))}
            <AddNewButton onClick={handleAddChecklistItem}>
              + Add New
            </AddNewButton>
            {errors.checklist && (
              <ErrorMessage>{errors.checklist}</ErrorMessage>
            )}
          </ChecklistContainer>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: "3rem"
          }}
        >
          {/* Due Date */}
          <DateWrapper>
            <DueDateButton onClick={() => setShowCalendar(true)}>
              {dueDate ? `${dueDate.toLocaleDateString()}` : "Select Due Date"}
            </DueDateButton>

            {showCalendar && (
              <CalendarContainer>
                <DatePicker
                  selected={dueDate}
                  onChange={handleDateChange}
                  onClickOutside={() => setShowCalendar(false)}
                  inline
                />
              </CalendarContainer>
            )}
          </DateWrapper>

          {/* Footer Buttons */}
          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button primary onClick={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </div>
      </ModalContainer>
    </ModalBackground>
  );
};

export default EditTaskCard;
