import DashboardHeader from "./components/DashboardHeader";
import DashboardSidebar from "./components/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">

      <div className="hidden md:block fixed left-0 top-0 h-full">
        <DashboardSidebar />
      </div>

      <div className="flex-1 md:ml-64">
        <DashboardHeader />

        <main className="p-6">
            {children}
        </main>
      </div>

    </div>
  );
}
