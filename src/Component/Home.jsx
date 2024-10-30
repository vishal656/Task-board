import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import codeSandbox from "../assets/image/codesandbox.png";
import Database from "../assets/image/database.png";
import Settings from "../assets/image/settings.png";
import AddPeople from "../assets/image/AddPeople.png";
import AddBoard from "./AddPeople";
import Logout from "../assets/image/Logout.png";
import Board from "../assets/image/layout.png";
import Analytics from "./Analytics";
import SettingComponent from "./Settings"
import TaskBoard from "./TaskBoard";
import LogoutModal from "./LogoutModal";
import { handleError, handleSuccess } from "../utils";

// Styled components
const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  min-width: 250px;
  max-width: 250px;
  background-color: #ffffff;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SidebarItems = styled.div`
  flex-grow: 1;
`;

const SidebarItem = styled.div`
  padding: 10px;
  cursor: pointer;
  margin-bottom: 10px;
  background-color: ${(props) =>
    props.selected ? "#4391ED1A" : "transparent"};
  color: black;
  font-weight: 500;
  font-size: 16px;
  font-family: "Poppins";
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  justify-content: center;
  gap: 14px;

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
`;

const LogoutItem = styled(SidebarItem)`
  margin-top: auto;
  background-color: transparent;
  color: red;
  &:hover {
    background-color: #4391ed1a;
  }
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
`;

const Header = styled.div`
  width: 98%;
  height: 5%;
  display: flex;
  font-size: 20px;
  font-weight: 600;
  font-family: "Poppins";
  color: #333;
  padding: 25px 0px 25px 10px;
  justify-content: space-between;
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SideBarContent = styled.p`
  text-align: center;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  font-family: sans-serif;
  display: flex;
  justify-content: center;
  gap: 15px;
`;

// Home component
const Home = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const [selectedPage, setSelectedPage] = useState("Board"); // Default to Board
  const [refresh,setRefresh] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("this week");
  const [logoutPopup, setLogoutPopup] = useState(false);
  const [addPeoplePopup, setPeoplePopup] = useState(false);
  useEffect(() => {
    setLoggedInUser(localStorage.getItem("name"));
    setLoggedInEmail(localStorage.getItem("email"));
  }, []);

  const fetchTasksCards  = async () => {
    try {
      const url = `${import.meta.env.VITE_API_KEY}/auth/tasks`;
      // const url = `http://localhost:3000/auth/tasks`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });

      let result = await response.json();
      const { success, message, error } = result;
      if (success) {
       setTasks(result.tasks);
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

  useEffect(()=>{
    fetchTasksCards();
  },[refresh])

  const handleLogout = () => {
    setLogoutPopup(true);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  function getFormattedDate() {
    const date = new Date();

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    const daySuffix = (day) => {
      if (day > 3 && day < 21) return "th"; // catch 11th, 12th, 13th
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${daySuffix(day)} ${month}, ${year}`;
  }

  const updateTaskStatusInBackend = async (taskId, newStatus) => {
    try {
      const url = `${import.meta.env.VITE_API_KEY}/auth/tasks/${taskId}/status`;
      // const url = `http://localhost:3000/auth/tasks/${taskId}/status`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();
      if (result.success) {
        return result.task;
      } else {
        handleError(result.message);
        return null;
      }
    } catch (error) {
      handleError(error);
      return null;
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const updatedTask = await updateTaskStatusInBackend(taskId, newStatus);
    if (updatedTask) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    }
  };

  const renderContent = () => {
    if (selectedPage === "Board") {
      return (
        <>
        {
          addPeoplePopup ?<AddBoard onClose={()=>setPeoplePopup(false)} setRefresh={setRefresh}/> : null
        }
          <Header>
            <div>Welcome! {loggedInUser}</div>
            <div>
              <p style={{ color: "#707070", fontSize: "20px" }}>
                {getFormattedDate()}
              </p>
            </div>
          </Header>
          <Header style={{ padding: "0px 10px 20px" }}>
          <div style={{display:"flex",gap:"40px"}}>
            <div>Board</div>{" "}
            <img src={AddPeople} alt="" style={{cursor:"pointer"}} onClick={()=>setPeoplePopup(true)}/>
            </div>
            <div>
              <p>
                {" "}
                <select onChange={handleFilterChange} style={{border:"none",outline:"none"}}>
                  <option value="today">Today</option>
                  <option value="this week">This Week</option>
                  <option value="this month">This Month</option>
                </select>
              </p>
            </div>
          </Header>
          <Content>
            <TaskBoard setTasks={setTasks} tasks={tasks} filter={filter} fetchTasksCards={fetchTasksCards} updateTaskStatus={handleStatusChange} setRefresh={setRefresh}/>
          </Content>
        </>
      );
    } else if (selectedPage === "Analytics") {
      return <Analytics/>
    } else if (selectedPage === "Setting") {
      return <SettingComponent loggedInUser={loggedInUser} loggedInEmail={loggedInEmail}/>
    }
  };

  return (
    <Container>
      <Sidebar>
        <SideBarContent>
          <span>
            <img src={codeSandbox} alt="" />
          </span>
          Pro Manage
        </SideBarContent>
        <SidebarItems>
          {logoutPopup ? (
            <LogoutModal
              loggedInUser={loggedInUser}
              onClose={() => setLogoutPopup(false)}
            />
          ) : null}
          <SidebarItem
            selected={selectedPage === "Board"}
            onClick={() => setSelectedPage("Board")}
            style={{ marginLeft: "-10px" }}
          >
            <span>
              {" "}
              <img src={Board} alt="" />
            </span>{" "}
            Task Board
          </SidebarItem>
          <SidebarItem
            selected={selectedPage === "Analytics"}
            onClick={() => setSelectedPage("Analytics")}
            style={{ marginLeft: "-15px" }}
          >
            <span>
              {" "}
              <img src={Database} alt="" />
            </span>{" "}
            Analytics
          </SidebarItem>
          <SidebarItem
            selected={selectedPage === "Setting"}
            onClick={() => setSelectedPage("Setting")}
            style={{ marginLeft: "-20px" }}
          >
            <span>
              {" "}
              <img src={Settings} alt="" />
            </span>{" "}
            Settings
          </SidebarItem>
        </SidebarItems>

        <LogoutItem onClick={handleLogout} style={{ marginLeft: "-20px" }}>
          <span>
            {" "}
            <img src={Logout} alt="" />
          </span>{" "}
          Logout
        </LogoutItem>
      </Sidebar>
      <ContentContainer>{renderContent()}</ContentContainer>
      <ToastContainer />
    </Container>
  );
};

export default Home;
