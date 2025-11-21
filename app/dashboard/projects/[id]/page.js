"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "@/store/slices/taskSlice";
import { useParams } from "next/navigation";
import AddTaskModal from "@/components/AddTaskModal";
import TaskCard from "@/components/TaskCard";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useToast } from "@/context/ToastContext";

export default function ProjectDetailsPage() {
  const { id: projectId } = useParams();
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.tasks);
  const [openModal, setOpenModal] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    dispatch(fetchTasks({ projectId }))
      .unwrap()
      .then(() => {
        // showToast("Tasks loaded successfully", "success");
      })
      .catch((err) => {
        const msg =
          err?.error ||
          err?.message ||
          "Failed to load tasks. Please try again.";

        showToast(msg, "error");
      });
  }, [dispatch, projectId]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Project Tasks</h1>

        <Button variant="contained" onClick={() => setOpenModal(true)}>
          + Add Task
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center my-10">
          <CircularProgress />
        </div>
      ) : items.length === 0 ? (
        <p className="text-gray-500">No tasks yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      <AddTaskModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        projectId={projectId}
      />
    </div>
  );
}
