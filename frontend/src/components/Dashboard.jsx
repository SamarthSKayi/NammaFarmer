import React from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import Profile from "./Profile";
import Analytics from "./Analytics";
import Settings from "./Settings";
import Status from "./Status";
import MarketInsight from "./MarketInsight";
import SellProduce from "./SellProduce";
import Otracking from "./Otracking";
import SupportResources from "./SupportResources";
import Chat from "./Chat";
import Notifications from "./Notifications";
import {
  FaUser,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaShoppingCart,
  FaTruck,
  FaHandshake,
  FaMapMarkerAlt,
  FaChartPie,
  FaComments,
} from "react-icons/fa";

export default function Dashboard({ onLogout }) {
  const location = useLocation();
  const chatRoomId = "room123"; // Replace with actual chat room ID
  const userId = "user123";

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-300 text-gray-900 font-sans">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col justify-between overflow-y-auto">
        {/* Sidebar Header */}
        <div className="p-10">
          
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2 px-4">
            <SidebarLink
              to="/dashboard/profile"
              icon={<FaUser />}
              label="Profile"
              isActive={location.pathname === "/dashboard/profile"}
            />
            {/* <SidebarLink
              to="/dashboard/status"
              icon={<FaChartPie />}
              label="Dashboard"
              isActive={location.pathname === "/dashboard/status"}
            /> */}
            <SidebarLink
              to="/dashboard/sell-produce"
              icon={<FaShoppingCart />}
              label="Sell Produce"
              isActive={location.pathname === "/dashboard/sell-produce"}
            />
            <SidebarLink
              to="/dashboard/order-tracking"
              icon={<FaTruck />}
              label="Order Tracking"
              isActive={location.pathname === "/dashboard/order-tracking"}
            />
            <SidebarLink
              to="/dashboard/support-resources"
              icon={<FaHandshake />}
              label="Support & Resources"
              isActive={location.pathname === "/dashboard/support-resources"}
            />
            <SidebarLink
              to="/dashboard/chats"
              icon={<FaComments/>}
              label="Chats"
              isActive={location.pathname === "/dashboard/chats"}
            />
            <SidebarLink
              to="/dashboard/notifications"
              icon={<FaBell />}
              label="Notifications"
              isActive={location.pathname === "/dashboard/notifications"}
            />
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-6">
          <nav>
            <ul>
              <SidebarLink
                to="/dashboard/settings"
                icon={<FaCog />}
                label="Settings"
                isActive={location.pathname === "/dashboard/settings"}
              />
            </ul>
          </nav>
          <button
            onClick={onLogout}
            className="w-full mt-4 py-2 px-4 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-6 overflow-y-auto">
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 min-h-full">
          <Routes>
            <Route path="/profile" element={<Profile />} />
            {/* <Route path="/analytics" element={<Analytics />} /> */}
            <Route path="/settings" element={<Settings />} />
            <Route path="/status" element={<Status />} />
            <Route path="/sell-produce" element={<SellProduce />} />
            <Route path="/order-tracking" element={<Otracking />} />
            <Route path="/support-resources" element={<SupportResources />} />
            <Route path="/chats" element={<Chat chatRoomId={chatRoomId} userId={userId} />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route
              path="*"
              element={<Navigate to="/dashboard/profile" replace />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ to, icon, label, isActive }) {
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center space-x-3 px-4 py-2 rounded text-sm font-medium ${
          isActive
            ? "bg-gray-100 text-gray-800 font-semibold"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
        }`}
      >
        <div className="text-lg">{icon}</div>
        <span>{label}</span>
      </Link>
    </li>
  );
}
