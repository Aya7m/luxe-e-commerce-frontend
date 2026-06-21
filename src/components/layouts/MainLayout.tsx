import React from "react";
import Navbar from "../Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../Footer";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main className="px-6 py-8 mx-auto max-w-7xl">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
};

export default MainLayout;
