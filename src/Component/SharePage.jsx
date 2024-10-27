import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5; /* Optional background color */
`;

const CardContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 656px;
  height:350px;
  position: relative;
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
  max-height: ${(props) => (props.isScrollable ? "200px" : "auto")};
  overflow-y: ${(props) => (props.isScrollable ? "auto" : "visible")};
  padding-right: ${(props) => (props.isScrollable ? "5px" : "0")};
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
  background-color: ${(props) =>
    props.status === "Done"
      ? "#63C05B"
      : props.isOverdue
      ? "#CF3636"
      : "#DBDBDB"};
  padding: 5px 15px;
  border-radius: 8px;
  font-size: 8px;
  color: ${(props) => (props.isOverdue ? "#FFFFFF" : "#5A5A5A")};
  display: inline-block;
  width: 31px;
  height: 12px;
  text-align: center;
`;

const StatusContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  gap: 15px;
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
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
`;

const ColorItem = styled.div`
  width: 9px;
  height: 9px;
  background-color: ${(props) =>
    props.status === "HIGH_PRIORITY"
      ? "#FF2473"
      : props.status === "MODERATE_PRIORITY"
      ? "#18B0FF"
      : "#63C05B"};
  border-radius: 50%;
`;

const SharePage = () => {
  const [task, setTask] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const [isChecklistVisible, setIsChecklistVisible] = useState(true);

  useEffect(() => {
    const storedTask = JSON.parse(localStorage.getItem("sharedTask"));
    if (storedTask && storedTask.task) {
      setTask(storedTask.task);
      setChecklist(storedTask.task.checklist || []);
    } else {
      console.log("No task data available.");
    }
  }, []);

  const completedTasks = checklist.filter((item) => item.completed).length;
  const totalTasks = checklist.length;
  const isOverdue = task && new Date(task.dueDate) < new Date() && task.status !== "Done";

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = { month: "short", day: "numeric" };
    const formattedDate = date.toLocaleString("en-US", options);

    const day = date.getDate();
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";

    return `${formattedDate}${suffix}`;
  };

  const toggleChecklistVisibility = () => {
    setIsChecklistVisible((prev) => !prev);
  };

  if (!task) {
    return <div>No task data available.</div>;
  }

  const toggleCheckbox = (index) => {
    const updatedChecklist = checklist.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updatedChecklist);
  };

  return (
    <Wrapper>
      <CardContainer>
        <TaskHeader>
          <div style={{ display: "flex", gap: "5px" }}>
            <ColorItem status={task.priority}></ColorItem>
            <Priority>{task.priority.toUpperCase()}</Priority>
          </div>
        </TaskHeader>

        <TaskTitle>{task.title}</TaskTitle>

        <ChecklistTitleContainer onClick={toggleChecklistVisibility}>
          <ChecklistTitle>
            Checklist ({completedTasks}/{totalTasks})
          </ChecklistTitle>
          <FontAwesomeIcon
            icon={isChecklistVisible ? faChevronUp : faChevronDown}
          />
        </ChecklistTitleContainer>

        {isChecklistVisible && (
          <ChecklistContainer isScrollable={checklist.length > 3}>
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          {task.dueDate && (
            <DueDate isOverdue={isOverdue} status={task.status}>
              {formatDate(task.dueDate)}
            </DueDate>
          )}
        </div>
      </CardContainer>
    </Wrapper>
  );
};

export default SharePage;
