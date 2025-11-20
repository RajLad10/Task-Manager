"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { updateTaskStatus, deleteTask } from "@/store/slices/taskSlice";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

export default function TaskCard({ task }) {
  const dispatch = useDispatch();

  const handleStatusChange = (e) => {
    dispatch(
      updateTaskStatus({
        taskId: task.id,
        status: e.target.value,
      })
    );
  };

  const remove = () => {
    dispatch(deleteTask({ taskId: task.id }));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition border">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold">{task.title}</h3>

        <button
          onClick={remove}
          className="text-red-500 hover:text-red-700"
        >
          <DeleteIcon fontSize="small" />
        </button>
      </div>

      <p className="text-gray-600 text-sm mt-1">
        Due: {task.dueDate || "No due date"}
      </p>

      <TextField
        select
        label="Status"
        size="small"
        className="mt-3"
        value={task.status}
        onChange={handleStatusChange}
        fullWidth
      >
        <MenuItem value="Todo">Todo</MenuItem>
        <MenuItem value="In Progress">In Progress</MenuItem>
        <MenuItem value="Done">Done</MenuItem>
      </TextField>
    </div>
  );
}
