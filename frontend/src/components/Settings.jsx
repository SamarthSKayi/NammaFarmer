import React, { useState } from "react";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function Settings() {
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [locationAccess, setLocationAccess] = useState(true);
  const [isProfilePrivate, setIsProfilePrivate] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [email, setEmail] = useState("user@nammafarmer.com");
  const [password, setPassword] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const handleNotificationChange = () => {
    setNotificationEnabled(!notificationEnabled);
  };

  const handleEmailNotificationChange = () => {
    setEmailNotifications(!emailNotifications);
  };

  const handleLocationAccessChange = () => {
    setLocationAccess(!locationAccess);
  };

  const handleProfilePrivacyChange = () => {
    setIsProfilePrivate(!isProfilePrivate);
  };

  const handleTwoFactorChange = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSaveSettings = () => {
    // Here, you can add the actual logic to save settings (e.g., API call)
    setAlertMessage("Settings Saved Successfully!");
    setAlertType("success");
    setShowAlert(true);

    // Hide the alert after 3 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-50" style={{width:"80vw"}}>
      {/* Settings container */}
      <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg" style={{width:"80vw"}}>
        <h2 className="text-3xl font-semibold text-center mb-6">Settings</h2>

        <div className="space-y-6">
          {/* Notifications Section */}
          <div className="flex items-center justify-between">
            <label htmlFor="notifications" className="text-lg font-medium">
              Enable Push Notifications
            </label>
            <input
              id="notifications"
              type="checkbox"
              checked={notificationEnabled}
              onChange={handleNotificationChange}
              className="h-6 w-6"
            />
          </div>

          {/* Email Notifications Section */}
          <div className="flex items-center justify-between">
            <label htmlFor="emailNotifications" className="text-lg font-medium">
              Enable Email Notifications
            </label>
            <input
              id="emailNotifications"
              type="checkbox"
              checked={emailNotifications}
              onChange={handleEmailNotificationChange}
              className="h-6 w-6"
            />
          </div>

          {/* Location Access Section */}
          <div className="flex items-center justify-between">
            <label htmlFor="location" className="text-lg font-medium">
              Enable Location Access
            </label>
            <input
              id="location"
              type="checkbox"
              checked={locationAccess}
              onChange={handleLocationAccessChange}
              className="h-6 w-6"
            />
          </div>

          {/* Privacy Settings Section */}
          <div className="flex items-center justify-between">
            <label htmlFor="privacy" className="text-lg font-medium">
              Profile Privacy
            </label>
            <input
              id="privacy"
              type="checkbox"
              checked={isProfilePrivate}
              onChange={handleProfilePrivacyChange}
              className="h-6 w-6"
            />
          </div>

          {/* Account Settings Section */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Account Settings</h3>

            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center justify-between">
                <label htmlFor="email" className="text-lg font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="border p-2 rounded-md"
                />
              </div>

              {/* Password */}
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-lg font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="border p-2 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <button
              className="bg-green-600 text-white px-6 py-2 rounded-lg mt-4 hover:bg-green-700 transition"
              onClick={handleSaveSettings}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>

      {/* Alert Notification */}
      {showAlert && (
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg flex items-center space-x-3 shadow-xl transition-all duration-300 ${
            alertType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
          style={{
            top: "10%",
            zIndex: 9999,
            width: "80%",
            maxWidth: "300px",
          }}
        >
          <div
            className={`rounded-full p-2 ${
              alertType === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {alertType === "success" ? (
              <FiCheckCircle size={20} className="text-white" />
            ) : (
              <FiAlertCircle size={20} className="text-white" />
            )}
          </div>
          <span className="text-white font-medium text-sm">{alertMessage}</span>
        </div>
      )}
    </div>
  );
}
