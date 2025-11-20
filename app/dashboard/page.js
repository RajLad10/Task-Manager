"use client";

import { useEffect, useState } from "react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    projectsCount: 0,
    tasksCount: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard/stats", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setStats({
            projectsCount: data.projectsCount,
            tasksCount: data.tasksCount,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Welcome to the Dashboard</h2>
      <p className="text-gray-600 mb-6">
        Use the sidebar to manage projects and tasks.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow border">
          <h3 className="text-lg font-medium">Total Projects</h3>
          <p className="text-3xl font-bold mt-2">{stats.projectsCount}</p>
        </div>

        <div className="p-6 bg-white rounded-lg shadow border">
          <h3 className="text-lg font-medium">Total Tasks</h3>
          <p className="text-3xl font-bold mt-2">{stats.tasksCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
