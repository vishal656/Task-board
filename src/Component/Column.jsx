import React, { useState } from 'react';
import styled from 'styled-components';
import TaskCard from './TaskCard'; // Assuming you have a TaskCard component
import Plus from "../assets/image/Plus.png"
import CollapseImage from "../assets/image/codicon_collapse-all.png"
import TaskModal from './TaskModal';
const ColumnContainer = styled.div`
  flex: 1;
  margin: 0 10px;
  background-color: #eef2f5;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Enable vertical scroll inside the column */
  height: calc(80vh - 20px); /* Full height of the viewport minus some padding */
  box-sizing: border-box; /* Ensure padding and border are included in the height */
  min-inline-size: fit-content;
  position: relative;
`;

const ColumnTitle = styled.h4`
  text-align: left;
  flex-shrink: 0; /* Prevent the title from shrinking when content overflows */
`;

const AddImage = styled.img`
    position: absolute;
    right: 55px;
    top: 30px;
    cursor: pointer;
`;
const Column = ({ title, tasks, fetchTasksCards }) => {
  const [addPopup,setAddPopup] = useState(false);
  return (
    <ColumnContainer>
      <ColumnTitle>{title}</ColumnTitle>
      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        tasks.map((task, index) => (
          <TaskCard key={index} task={task} />
        ))
      )}
      {title === 'To Do' && (
        <>
          <AddImage onClick={()=>setAddPopup(true)} src={Plus} alt=""/>
        </>
      )}
      <AddImage src={CollapseImage} alt="" style={{right:"10px"}}/>
          {
            addPopup ? <TaskModal onClose={()=>setAddPopup(false)} fetchTasksCards={fetchTasksCards}/> : null
          }
    </ColumnContainer>
  );
};

export default Column;
