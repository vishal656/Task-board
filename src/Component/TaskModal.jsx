import React, { useState } from 'react';
import styled from 'styled-components';
import { handleError, handleSuccess } from "../utils";
import DeleteIcon from "../assets/image/Delete.png"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
  gap: 16px;
`;

const PriorityButton = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  input {
    margin-right: 4px;
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
text-align:left;
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
  background-color: ${(props) => (props.primary ? '#00a8a8' : '#fff')};
  color: ${(props) => (props.primary ? '#fff' : 'red')};
  border: 1px solid ${(props) => (props.primary ? '#00a8a8' : 'red')};
  width:162.58px;
  font-size:16px;

  &:hover {
    background-color: ${(props) => (props.primary ? '#008080' : '#f5f5f5')};
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
  position: relative; /* Important for absolute positioning inside */
  display: inline-block; /* Ensure the button and calendar stay inline */
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

 const assigneeOptions = [
  { id: 1, email: "akashgupta@gmail.com", initials: "AK" },
  { id: 2, email: "johndoe@example.com", initials: "JD" },
  { id: 3, email: "janedoe@example.com", initials: "JD" },
  { id: 4, email: "alicesmith@example.com", initials: "AS" },
];

const TaskModal = ({ onClose, fetchTasksCards }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('MODERATE_PRIORITY');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [checklist, setChecklist] = useState([]);

  // Validation states
  const [errors, setErrors] = useState({
    title: '',
    checklist: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      title: '',
      priority: '',
      dueDate: '',
      checklist: ''
    };

  if (!title.trim()) {
    newErrors.title = 'Title is required';
    isValid = false;
  } else if (title.trim().length < 3) {
    newErrors.title = 'Title must be at least 3 characters long';
    isValid = false;
  }

  if (checklist.length === 0) {
    newErrors.checklist = 'At least one checklist item is required';
    isValid = false;
  } else {
    const hasEmptyTasks = checklist.some(item => !item.text.trim());
    if (hasEmptyTasks) {
      newErrors.checklist = 'All checklist items must have a description';
      isValid = false;
    }

    const hasCheckedItem = checklist.some(item => item.completed);
    if (!hasCheckedItem) {
      newErrors.checklist = 'At least one checklist item is required';
      isValid = false;
    }
  }

    setErrors(newErrors);
    return isValid;
  };

const getCheckedCount = () => checklist.filter(item => item.completed).length;

  const handleAddChecklistItem = () => {
    const newItem = {
      id: Date.now(),
      text: '',
      completed: false
    };
    setChecklist([...checklist, newItem]);
  };

  const handleRemoveChecklistItem = (id) => {
    setChecklist(checklist.filter(item => item.id !== id));
    setErrors(prev => ({ ...prev, checklist: '' }));
  };

  const handleChecklistItemChange = (id, completed) => {
    setChecklist(checklist.map(item =>
      item.id === id ? { ...item, completed } : item
    ));
  };

  const handleChecklistTextChange = (id, text) => {
    setChecklist(checklist.map(item =>
      item.id === id ? { ...item, text } : item
    ));
    setErrors(prev => ({ ...prev, checklist: '' }));
  };

  const handleSave = async () => {
    if (validateForm()) {
      const taskData = {
        title: title,
        status:"To Do",
        priority: priority,
        assignee: assignee,
        dueDate: dueDate,
        checklist: checklist.filter(item=>item.completed === true),
      };
      try {
        const url = `${import.meta.env.VITE_API_KEY}/auth/tasks`;
        // const url = `http://localhost:3000/auth/tasks`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify(taskData),
        });

        let result = await response.json();
        const { success, message, error } = result;
        if (success) {
          handleSuccess(message);
          fetchTasksCards();
         onClose();
        } else if (error) {
          handleError(error.details ? error.details[0].message : error.message);
        }
        else{
          handleError(message);
        }
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleDateChange = (date) => {
    setDueDate(date);
    setShowCalendar(false);
  };

  return (
    <ModalBackground>
    <ModalContainer>
      {/* Title Input */}
      <div>
        <Label>
          Title <span style={{ color: '#ff4d4f' }}>*</span>
        </Label>
        <Input
          placeholder="Enter Task Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setErrors(prev => ({ ...prev, title: '' }));
          }}
          error={!!errors.title}
        />
        {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
      </div>

      {/* Priority Selection */}
      <div style={{    display: "flex", alignItems: "center",justifyContent: "space-between"}}>
        <Label>
          Select Priority <span style={{ color: '#ff4d4f' }}>*</span>
        </Label>
        <PriorityGroup>
          <PriorityButton>
            <input
              type="radio"
              name="priority"
              value="HIGH_PRIORITY"
              checked={priority === 'HIGH_PRIORITY'}
              onChange={(e) => {
                setPriority(e.target.value);
                setErrors(prev => ({ ...prev, priority: '' }));
              }}
            />
            <span>HIGH PRIORITY</span>
          </PriorityButton>
          <PriorityButton>
            <input
              type="radio"
              name="priority"
              value="MODERATE_PRIORITY"
              checked={priority === 'MODERATE_PRIORITY'}
              onChange={(e) => {
                setPriority(e.target.value);
                setErrors(prev => ({ ...prev, priority: '' }));
              }}
            />
            <span>MODERATE PRIORITY</span>
          </PriorityButton>
          <PriorityButton>
            <input
              type="radio"
              name="priority"
              value="LOW_PRIORITY"
              checked={priority === 'LOW_PRIORITY'}
              onChange={(e) => {
                setPriority(e.target.value);
                setErrors(prev => ({ ...prev, priority: '' }));
              }}
            />
            <span>LOW PRIORITY</span>
          </PriorityButton>
        </PriorityGroup>
      </div>

      {/* Assignee Input */}
      <div style={{    display: "flex", alignItems: "baseline"}}>
        <Label style={{width:"120px"}}>Assign to</Label>
        <SelectDropdown
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          >
            <option value="" disabled>Select an assignee</option>
            {assigneeOptions.map((option) => (
              <option key={option.id} value={option.email}>
                {option.initials} - {option.email}
              </option>
            ))}
          </SelectDropdown>
      </div>

      {/* Checklist */}
      <div>
        <Label>
          Checklist ({getCheckedCount()}/{checklist.length}) <span style={{ color: '#ff4d4f' }}>*</span>
        </Label>
        <ChecklistContainer>
          {checklist.map((item) => (
            <ChecklistItem key={item.id}>
              <input
                type="checkbox"
                checked={item.completed}
                onChange={(e) => handleChecklistItemChange(item.id, e.target.checked)}
              />

              <ChecklistInput
                value={item.text}
                placeholder="Task to be done"
                onChange={(e) => handleChecklistTextChange(item.id, e.target.value)}
                error={!!errors.checklist}
              />
              <DeleteButton onClick={() => handleRemoveChecklistItem(item.id)}>
                <img src={DeleteIcon} alt=''/>
              </DeleteButton>
            </ChecklistItem>
          ))}
          <AddNewButton onClick={handleAddChecklistItem}>
            + Add New
          </AddNewButton>
          {errors.checklist && <ErrorMessage>{errors.checklist}</ErrorMessage>}
        </ChecklistContainer>
      </div>
<div style={{display:"flex",justifyContent:"space-between",paddingTop:"3rem"}}>
      {/* Due Date */}
      <DateWrapper>
      <DueDateButton onClick={() => setShowCalendar(true)}>
        {dueDate ? `${dueDate.toLocaleDateString()}` : 'Select Due Date'}
      </DueDateButton>

      {showCalendar && (
        <CalendarContainer>
        <DatePicker
          selected={dueDate}
          onChange={handleDateChange}
          inline // This renders the calendar without the input box
        />
        </CalendarContainer>
      )}
    </DateWrapper>

      {/* Footer Buttons */}
      <ModalFooter>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button primary onClick={handleSave}>
          Save
        </Button>
      </ModalFooter>
      </div>
    </ModalContainer>
  </ModalBackground>
  );
};

export default TaskModal;