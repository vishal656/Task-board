import React from "react";
import TaskColumn from "./Column";
import styled from "styled-components";

const Board = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

const TaskBoard = ({ tasks, filter }) => {

  const parseDueDate = (dueDate) => {
    const dateParts = dueDate.split(" ");
    const month = dateParts[0];
    const day = parseInt(dateParts[1]);
    const currentYear = new Date().getFullYear();
    const formattedDate = new Date(`${month} ${day}, ${currentYear}`);
    return formattedDate;
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

  const backlogTasks = filteredTasks.filter((task) => task.status === "backlog");
  const todoTasks = filteredTasks.filter((task) => task.status === "to-do");
  const inProgressTasks = filteredTasks.filter((task) => task.status === "in-progress");
  const doneTasks = filteredTasks.filter((task) => task.status === "done");

  return (
    <Board>
      <TaskColumn title="Backlog" tasks={backlogTasks} />
      <TaskColumn title="To Do" tasks={todoTasks} />
      <TaskColumn title="In Progress" tasks={inProgressTasks} />
      <TaskColumn title="Done" tasks={doneTasks} />
    </Board>
  );
};

export default TaskBoard;
