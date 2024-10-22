import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisH,
  faChevronDown,
  faChevronUp
} from "@fortawesome/free-solid-svg-icons";

const CardContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 250px;
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TaskTitle = styled.h4`
  font-size: 18px;
  font-weight: 500;
  margin-top: 10px;
  margin-bottom: 0px;
  color: black;
`;

const Priority = styled.span`
  font-size: 8px;
  color: #707070;
  font-weight: 500;
  font-family: "Poppins";
`;

const ChecklistContainer = styled.div`
  margin: 15px 0;
`;

const ChecklistTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const ChecklistTitle = styled.p`
  font-size: 14px;
  margin-bottom: 5px;
  font-weight: 500;
  font-family: "Poppins";
`;

const ChecklistItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  border: 2px solid #e2e2e2;
  padding: 5px;
  border-radius: 12px;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const DueDate = styled.div`
  background-color: #ffe6e6;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  color: red;
  display: inline-block;
`;

const StatusContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const StatusButton = styled.button`
  background-color: ${(props) => props.color || "#ccc"};
  color: white;
  border: none;
  border-radius: 20px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
`;

const ChecklistText = styled.span`
  max-width: 250px; /* Adjust to control the width */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block; /* Ensure it respects the width */
`;

const TaskCard = ({ task }) => {
  const [checklist, setChecklist] = useState(task.checklist);
  const [isChecklistVisible, setIsChecklistVisible] = useState(true);

  const toggleCheckbox = (index) => {
    const updatedChecklist = checklist.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updatedChecklist);
  };

  const toggleChecklistVisibility = () => {
    setIsChecklistVisible((prev) => !prev);
  };

  const completedTasks = checklist.filter((item) => item.completed).length;
  const totalTasks = checklist.length;

  return (
    <CardContainer>
      <TaskHeader>
        <Priority>{task.priority.toUpperCase()} PRIORITY</Priority>
        <FontAwesomeIcon icon={faEllipsisH} />
      </TaskHeader>
      <TaskTitle>{task.title}</TaskTitle>

      {/* Checklist title with a toggle button */}
      <ChecklistTitleContainer onClick={toggleChecklistVisibility}>
        <ChecklistTitle>
          Checklist ({completedTasks}/{totalTasks})
        </ChecklistTitle>
        <FontAwesomeIcon
          icon={isChecklistVisible ? faChevronUp : faChevronDown}
        />
      </ChecklistTitleContainer>

      {isChecklistVisible && (
        <ChecklistContainer>
          {checklist.map((item, index) => (
            <ChecklistItem key={index}>
              <Checkbox
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleCheckbox(index)}
              />
              <ChecklistText title={item.text}>
                {item.text.length > 30 ? `${item.text.slice(0, 30)}...` : item.text}
              </ChecklistText>
            </ChecklistItem>
          ))}
        </ChecklistContainer>
      )}

      <DueDate>{task.dueDate}</DueDate>

      <StatusContainer>
        <StatusButton>PROGRESS</StatusButton>
        <StatusButton>TO-DO</StatusButton>
        <StatusButton>DONE</StatusButton>
      </StatusContainer>
    </CardContainer>
  );
};

export default TaskCard;
