"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "@/store/slices/projectSlice";
import Link from "next/link";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useToast } from "@/context/ToastContext";
import AddProjectModal from "./projects/components/AddProjectModal";

export default function Projects() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.projects);
  const [openModal, setOpenModal] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    dispatch(fetchProjects())
      .unwrap()
      .then(() => {
        // showToast("Projects loaded successfully!", "success");
      })
      .catch((err) => {
        const msg =
          err?.error ||
          err?.message ||
          "Failed to load projects. Please try again.";

        showToast(msg, "error");
      });
  }, [dispatch]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Projects</h1>

        <Button variant="contained" onClick={() => setOpenModal(true)}>
          + Add Project
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center my-10">
          <CircularProgress />
        </div>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((project) => (
            <Link
              href={`/dashboard/projects/${project.id}`}
              key={project.id}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer"
            >
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <p className="text-gray-600 text-sm mt-1">
                {project.description || "No description"}
              </p>
            </Link>
          ))}
        </div>
      )}

      <AddProjectModal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}
