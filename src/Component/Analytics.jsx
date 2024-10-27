import { useEffect, useState } from "react";
import styled from "styled-components";

const AnalyticsContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
`;

const AnalyticsBox = styled.div`
  padding: 15px;
  background-color: #f7fafc;
  border-radius: 8px;
  width: 280px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h4`
  font-size: 1.2em;
  margin-bottom: 10px;
  color: #333;
`;

const Stat = styled.p`
  font-size: 1em;
  margin: 15px 0;
  font-size: 18px;
  color: #555;
  display: flex;
  justify-content: space-between;
`;

const Circle = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
  background-color: ${props => props.color || "gray"};
`;

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    statusCounts: {},
    priorityCounts: {},
    dueTasks: 0
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const url =`${import.meta.env.VITE_API_KEY}/auth/tasks/analytics`;
        // const url = `http://localhost:3000/auth/tasks/analytics`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          }
        });

        if (!response.ok) throw new Error("Failed to fetch analytics");

        const result = await response.json();
        if (result.success) setAnalytics(result);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAnalytics();
  }, []);

  const getStatusCount = (status) => {
    if (Array.isArray(analytics.statusCounts)) {
      const statusObj = analytics.statusCounts.find(item => item._id === status);
      return statusObj ? statusObj.count : 0;
    }
    return 0;
  };

  const getPriorityCount = (priority) => {
    if (Array.isArray(analytics.priorityCounts)) {
      const priorityObj = analytics.priorityCounts.find(item => item._id === priority);
      return priorityObj ? priorityObj.count : 0;
    }
    return 0;
  };
  return (
    <AnalyticsContainer>
     <AnalyticsBox>
      <Title>Task Status</Title>
      <Stat>
      <div>
      <Circle color="#90C4CC" />
        Backlog Tasks:</div> <span style={{fontSize:"20px",fontWeight:"600"}}>{getStatusCount("Backlog")}</span>
      </Stat>
      <Stat>
      <div>
      <Circle color="#90C4CC" />
        To-do Tasks: </div><span style={{fontSize:"20px",fontWeight:"600"}}>{getStatusCount("To Do")}</span>
      </Stat>
      <Stat>
      <div>
      <Circle color="#90C4CC" />
        In-Progress Tasks:</div> <span style={{fontSize:"20px",fontWeight:"600"}}>{getStatusCount("In Progress")}</span>
      </Stat>
      <Stat>
      <div>
      <Circle color="#90C4CC" />
        Completed Tasks:</div> <span style={{fontSize:"20px",fontWeight:"600"}}>{getStatusCount("Done")}</span>
      </Stat>
    </AnalyticsBox>

    <AnalyticsBox>
      <Title>Task Priority</Title>
      <Stat>
      <div>
      <Circle color="#90C4CC" />
        Low Priority:</div> <span style={{fontSize:"20px",fontWeight:"600"}}>{getPriorityCount("LOW_PRIORITY")}</span>
      </Stat>
      <Stat>
      <div>
      <Circle color="#90C4CC" />
        Moderate Priority:</div> <span style={{fontSize:"20px",fontWeight:"600"}}>{getPriorityCount("MODERATE_PRIORITY")}</span>
      </Stat>
      <Stat>
      <div>
      <Circle color="#90C4CC" />
        High Priority:</div> <span style={{fontSize:"20px",fontWeight:"600"}}>{getPriorityCount("HIGH_PRIORITY")}</span>
      </Stat>
      <Stat>
      <div>
      <Circle color="#90C4CC" />
        Due Date Tasks:</div> <span style={{fontSize:"20px",fontWeight:"600"}}>{analytics.dueTasks || 0}</span>
      </Stat>
    </AnalyticsBox>
    </AnalyticsContainer>
  );
};

export default Analytics;
