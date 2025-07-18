import { useState, useEffect } from "react"; // to handle input state
import styles from "./settings.module.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../../customHooks/useAuth";
import { useUserContext } from "../../Contexts/UserContext";
import { api } from "../../api/api";
import { fetchUserData } from "../../api/api";
import PropTypes from "prop-types"; // Import PropTypes for validation
import ClipLoader from "react-spinners/ClipLoader";
const Settings = ({ setIsSettingsOpen }) => {
  useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isFormUpdated, setIsFormUpdated] = useState(false);
  const [error, setError] = useState({
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });
  const { userData, setUserData, theme } = useUserContext();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const updatedUserData = JSON.parse(
      localStorage.getItem("userData")
    );
    console.log("updated", updatedUserData);
    if (updatedUserData) {
      setUserData(updatedUserData);
    }
  }, [isFormUpdated]);

  useEffect(() => {
    if (isFormUpdated) {
      alert("User details updated successfully");
      setIsFormUpdated(false);
    }
  }, [isFormUpdated]);

  useEffect(() => {
    console.log("userDataUpdated", userData);
    if (userData) {
      setFormData({
        username: userData.username,
        email: userData.email,
        oldPassword: "",
        newPassword: "",
      });
    }
  }, [userData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  // Handle form submission (Update action)
  const handleUpdate = async () => {
    setIsLoading(true);
    if (!formData.username || !formData.email) {
      setError({
        ...error,
        username: !formData.username ? "Username is required" : "",
        email: !formData.email ? "Email is required" : "",
      });

      return;
    }

    if (formData.newPassword && !formData.oldPassword) {
      setError({
        ...error,
        oldPassword: "Please enter your current password.",
        newPassword:
          formData.newPassword.length >= 8
            ? ""
            : "Password must be at least 8 characters long.",
      });
      return;
    }

    if (formData.oldPassword && !formData.newPassword) {
      setError({
        ...error,
        newPassword: "Please enter a new password.",
        oldPassword:
          formData.oldPassword.length >= 8
            ? ""
            : "Password must be at least 8 characters long.",
      });
      return;
    }

    if (formData.newPassword && formData.oldPassword) {
      if (
        formData.newPassword.length < 8 ||
        formData.oldPassword.length < 8
      ) {
        setError({
          ...error,
          newPassword:
            formData.newPassword.length >= 8
              ? ""
              : "Password must be at least 8 characters long.",
          oldPassword:
            formData.oldPassword.length >= 8
              ? ""
              : "Password must be at least 8 characters long.",
        });
        return;
      }
    }

    try {
      // Make the API call to update user information
      const response = await api.put(
        `/protected/user/${userData._id}`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.oldPassword, // Current password
          newPassword: formData.newPassword, // New password
        }
      );

      // Handle successful update
      if (response.status === 200) {
        setIsLoading(false);

        // Fetch updated user data
        const updatedUserData = await fetchUserData(userData._id);
        console.log("updatedUserData", updatedUserData);
        // Update state and session storage
        setIsFormUpdated(true);
        localStorage.setItem(
          "userData",
          JSON.stringify(updatedUserData)
        );

        // Optionally, update local state or UI to reflect changes
      } else {
        alert(
          `Update failed: ${response.data.error || "Unknown error"}`
        );
      }
    } catch (error) {
      localStorage.clear();
      sessionStorage.clear();
      // Handle errors gracefully
      console.error("Error updating user:", error);
    }
  };

  const handleViewOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleViewNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  return (
    <section className={styles.settings}>
      <div className={styles.header}>
        <img
          src={
            theme === "dark"
              ? "https://res.cloudinary.com/dtu64orvo/image/upload/v1734695297/arrow_back_wzcjzz.png"
              : "https://res.cloudinary.com/dtu64orvo/image/upload/v1735307971/icons8-left-arrow-50_cswfbm.png"
          }
          alt="back arrow"
          onClick={() => setIsSettingsOpen(false)}
        />
        <h1>Settings</h1>
      </div>
      <div className={styles.mainBody}>
        <div className={styles.content}>
          <div className={styles.form}>
            <div className={styles.inputWrapper}>
              <input
                className={error.username && styles.error}
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder={formData.username || "Name"}
              />
              <img
                className={styles.inputIcon}
                src="https://res.cloudinary.com/dtu64orvo/image/upload/v1735293922/Frame_1036_xbijry.svg" // Replace with actual icon
                alt="icon"
              />
              <p className={styles.error}>{error.username}</p>
            </div>

            <div className={styles.inputWrapper}>
              <input
                className={error.email && styles.error}
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={formData.email || "Update Email"}
              />
              <img
                className={styles.inputIcon}
                src="https://res.cloudinary.com/dtu64orvo/image/upload/v1735294021/icons8-email-50_1_cezeil.png" // Replace with actual icon
                alt="icon"
              />
              <p className={styles.error}>{error.email}</p>
            </div>

            <div className={styles.inputWrapper}>
              <input
                className={error.oldPassword && styles.error}
                type={showOldPassword ? "text" : "password"}
                id="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleInputChange}
                placeholder="Old Password"
              />
              <img
                className={styles.inputIcon}
                src="https://res.cloudinary.com/dtu64orvo/image/upload/v1735293909/lock_clvnla.svg"
                alt="password"
              />
              <img
                className={styles.showPassword}
                src="https://res.cloudinary.com/dtu64orvo/image/upload/v1735294066/Group_gpbrji.svg"
                alt="show password"
                role="button"
                onClick={handleViewOldPassword}
              />
              <p className={styles.error}>{error.oldPassword}</p>
            </div>

            <div className={styles.inputWrapper}>
              <input
                className={error.newPassword && styles.error}
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="New Password"
              />
              <img
                className={styles.inputIcon}
                src="https://res.cloudinary.com/dtu64orvo/image/upload/v1735293909/lock_clvnla.svg"
                alt="password"
              />
              <img
                className={styles.showPassword}
                src="https://res.cloudinary.com/dtu64orvo/image/upload/v1735294066/Group_gpbrji.svg"
                alt="show password"
                role="button"
                onClick={handleViewNewPassword}
              />
              <p className={styles.error}>{error.newPassword}</p>
            </div>
          </div>
          <button
            className={styles.updateButton}
            onClick={handleUpdate}
          >
            {isLoading ? (
              <ClipLoader color="white" size={25} />
            ) : (
              "Update"
            )}
          </button>
        </div>
      </div>
      <div className={styles.footer}>
        <img
          role="button"
          onClick={handleLogout}
          src="https://res.cloudinary.com/dtu64orvo/image/upload/v1735291248/Frame_6_phhknn.png"
          alt="logout"
        />
      </div>
    </section>
  );
};

// Add PropTypes validation
Settings.propTypes = {
  setIsSettingsOpen: PropTypes.func.isRequired, // Validates that setIsSettingsOpen is a required function
};

export default Settings;
