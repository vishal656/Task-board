import React, { useState, useEffect,useRef } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EditTaskCard from "./EditTaskCard";
import { useNavigate  } from "react-router-dom";
import {
  faEllipsisH,
  faChevronDown,
  faChevronUp
} from "@fortawesome/free-solid-svg-icons";
import DeleteTaskCard from "./DeleteTaskCard";

const CardContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 312px;
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

const PopupMenu = styled.div`
  position: absolute;
  top: 30px;
  right: 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 10;
  display: ${(props) => (props.visible ? "block" : "none")};
  width: 102px;
`;

const MenuItem = styled.div`
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  color: ${(props) => (props.danger ? "red" : "black")};

  &:hover {
    background-color: #f5f5f5;
  }
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

const Toast = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  background-color: #ddffe8;
  border: 1px solid #48C1B5
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.3s ease;
  z-index: 1000;
  width:180px;
  height:50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TaskCard = ({
  task,
  fetchTasksCards,
  updateTaskStatus,
  setRefresh,
  collapseAll,
  setTasks
}) => {
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState(task.checklist);
  const [isChecklistVisible, setIsChecklistVisible] = useState(true);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [modalData, setModalData] = useState();
  const [showToast, setShowToast] = useState(false);
  const toggleCheckbox = (index) => {
    const updatedChecklist = checklist.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updatedChecklist);
  };

  const toggleDropdown = () => {
    setIsPopupVisible((prev) => !prev);
  };

  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsPopupVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', closeDropdown);
    return () => {
      document.removeEventListener('mousedown', closeDropdown);
    };
  }, []);

  useEffect(() => {
    setIsChecklistVisible(!collapseAll);
  }, [collapseAll]);

  const toggleChecklistVisibility = () => {
    setIsChecklistVisible((prev) => !prev);
  };

  const completedTasks = checklist.filter((item) => item.completed).length;
  const totalTasks = checklist.length;

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

  const isOverdue =
    new Date(task.dueDate) < new Date() && task.status !== "Done";

  const handleStatusChange = (taskId, newStatus) => {
    updateTaskStatus(taskId, newStatus);
  };

  const handleShare = () => {
    const shareLink = `${window.location.origin}/share-page`;
    if (task) {
      setIsPopupVisible(false);
      localStorage.setItem("sharedTask", JSON.stringify({ task }));
          setShowToast(true);
      navigator.clipboard.writeText(shareLink).then(() => {
        setTimeout(() => {
                 setShowToast(false);
          }, 5000);
       // navigate("/share-page");
      });
    } else {
      console.error("No task to share.");
    }
  };

  return (
    <CardContainer>
      {isEditVisible ? (
        <EditTaskCard
          onClose={() => setIsEditVisible(false)}
          fetchTasksCards={fetchTasksCards}
          modalData={modalData}
          updateTaskStatus={updateTaskStatus}
          setRefresh={setRefresh}
          task={task}
          setTasks={setTasks}
        />
      ) : null}

      {isDeleteVisible ? (
        <DeleteTaskCard
          onClose={() => setIsDeleteVisible(false)}
          fetchTasksCards={fetchTasksCards}
          modalData={modalData}
        />
      ) : null}
      <TaskHeader>
        <>
          <div style={{ display: "flex", gap: "5px" }}>
            <ColorItem status={task?.priority}></ColorItem>
            <Priority>{task.priority.toUpperCase()}</Priority>
          </div>
          <FontAwesomeIcon
            icon={faEllipsisH}
            onClick={() => setIsPopupVisible((prev) => !prev)}
            style={{ cursor: "pointer" }}
          />
        </>
      </TaskHeader>

      <TaskTitle>{task.title}</TaskTitle>
      {showToast && <Toast visible={showToast}>Link copied</Toast>}
      <PopupMenu visible={isPopupVisible} ref={dropdownRef}>
        <MenuItem
          onClick={() => {
            setModalData(task);
            setIsPopupVisible(false);
            setIsEditVisible(true);
          }}
        >
          Edit
        </MenuItem>
        <MenuItem onClick={handleShare}>Share</MenuItem>
        <MenuItem
          onClick={() => {
            setModalData(task);
            setIsPopupVisible(false);
            setIsDeleteVisible(true);
          }}
          danger
        >
          Delete
        </MenuItem>
      </PopupMenu>

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
                {item.text.length > 30
                  ? `${item.text.slice(0, 30)}...`
                  : item.text}
              </ChecklistText>
            </ChecklistItem>
          ))}
        </ChecklistContainer>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end"
        }}
      >
        {task.dueDate && (
          <DueDate isOverdue={isOverdue} status={task.status}>
            {formatDate(task.dueDate)}
          </DueDate>
        )}

        <StatusContainer>
          {task.status !== "Backlog" && (
            <StatusButton
              onClick={() => handleStatusChange(task._id, "Backlog")}
            >
              Backlog
            </StatusButton>
          )}

          {task.status !== "To Do" && (
            <StatusButton onClick={() => handleStatusChange(task._id, "To Do")}>
              To Do
            </StatusButton>
          )}

          {task.status !== "In Progress" && (
            <StatusButton
              onClick={() => handleStatusChange(task._id, "In Progress")}
            >
              Progress
            </StatusButton>
          )}

          {task.status !== "Done" && (
            <StatusButton onClick={() => handleStatusChange(task._id, "Done")}>
              Done
            </StatusButton>
          )}
        </StatusContainer>
      </div>
    </CardContainer>
  );
};

export default TaskCard;
