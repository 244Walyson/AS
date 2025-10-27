import { useState } from "react";
import Header from "../header/Header";
import Sidebar from "../sidebar/Sidebar";
import DashboardOverview from "./DashboardOverview";

const SentimentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 flex flex-col">
          <DashboardOverview />
          {/* <EmptyState /> */}
        </main>
      </div>
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
          tabIndex={0}
        ></button>
      )}
    </div>
  );
};

export default SentimentDashboard;
