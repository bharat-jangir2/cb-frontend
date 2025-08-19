import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  const location = useLocation();

  // Debug logging
  console.log("Layout rendered, current path:", location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded text-sm">
            Current route: {location.pathname}
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
