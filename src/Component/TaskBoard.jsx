import React from "react";
import TaskColumn from "./Column";
import styled from "styled-components";

const Board = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

const TaskBoard = ({ tasks, filter ,fetchTasksCards,updateTaskStatus}) => {

  const parseDueDate = (dueDate) => {
    return new Date(dueDate); // Use the date directly as it's already in ISO format
  };

  const filterTasks = (tasks) => {
    const today = new Date();
    return tasks.filter((task) => {
      if (!task.dueDate) return true;

      const taskDate = parseDueDate(task.dueDate);

      if (filter === "today") {
        return taskDate.toDateString() === today.toDateString();
      } else if (filter === "this week") {
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        return taskDate >= startOfWeek && taskDate <= endOfWeek;
      } else if (filter === "this month") {
        return (
          taskDate.getMonth() === today.getMonth() &&
          taskDate.getFullYear() === today.getFullYear()
        );
      }
      return true;
    });
  };

  const filteredTasks = filterTasks(tasks);

  // Filter tasks based on their status
  const backlogTasks = filteredTasks.filter((task) => task.status === "Backlog");
  const todoTasks = filteredTasks.filter((task) => task.status === "To Do");
  const inProgressTasks = filteredTasks.filter((task) => task.status === "In Progress");
  const doneTasks = filteredTasks.filter((task) => task.status === "Done");

  return (
    <Board>
      <TaskColumn title="Backlog" tasks={backlogTasks} updateTaskStatus={updateTaskStatus}/>
      <TaskColumn title="To Do" tasks={todoTasks}  fetchTasksCards={fetchTasksCards} updateTaskStatus={updateTaskStatus}/>
      <TaskColumn title="In Progress" tasks={inProgressTasks} updateTaskStatus={updateTaskStatus} />
      <TaskColumn title="Done" tasks={doneTasks} updateTaskStatus={updateTaskStatus}/>
    </Board>
  );
};

export default TaskBoard;
