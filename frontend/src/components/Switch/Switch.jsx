import { useState, useEffect } from "react";
import { useUserContext } from "../../Contexts/UserContext";
import styles from "./Switch.module.css"; // Import the CSS module
import { api, fetchUserData } from "../../api/api";

const Switch = () => {
  const { theme, setTheme } = useUserContext();
  const userData = JSON.parse(localStorage.getItem("userData"));
  
  // Set initial state based on localStorage or default to 'dark'
  const [checked, setChecked] = useState(
    userData?.theme === "dark" ? true : false
  );

  useEffect(() => {
    const getTheme = async () => {
      const userId = JSON.parse(localStorage.getItem("userId"));
      if (userId) {
        try {
          const response = await fetchUserData(userId); // Fetch user data from API
          console.log("User data fetched:", response.data);
          
          // Set theme in context and update localStorage
          setTheme(response.data.user.theme);
          localStorage.setItem("theme", response.data.user.theme); // Save theme in localStorage
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    
    // Fetch and set the theme on initial load
    getTheme();
  }, []);

  useEffect(() => {
    // Update theme whenever it changes in context and sync with localStorage
    setChecked(theme === "dark");
    localStorage.setItem("theme", theme); // Save theme to localStorage
  }, [theme]);

  useEffect(() => {
    const updateTheme = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await api.put(`/user/${userId}`, {
            theme,
          }); // Update theme on backend
          console.log("Theme updated successfully", response.data);
          await fetchUserData(userData._id); // Re-fetch user data to stay updated
        } catch (error) {
          console.error("Error updating theme:", error);
        }
      }
    };
    updateTheme();
  }, [theme]);

  const handleSwitchToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme); // Update context with new theme
  };

  return (
    <div className={styles.switch}>
      <button
        id="basic-switch"
        className={`${styles.mdcSwitch} ${checked ? styles.mdcSwitchSelected : ""}`}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleSwitchToggle} // Toggle the switch on click
      >
        <div className={styles.mdcSwitchTrack}></div>
        <div className={styles.mdcSwitchHandleTrack}>
          <div className={styles.mdcSwitchHandle}>
            <div className={styles.mdcSwitchShadow}>
              <div className={styles.mdcElevationOverlay}></div>
            </div>
            <div className={styles.mdcSwitchRipple}></div>
            <div className={styles.mdcSwitchIcons}>
              <svg
                className={`${styles.mdcSwitchIcon} ${checked ? "" : styles.mdcSwitchIconHidden}`}
                viewBox="0 0 24 24"
              >
                <path d="M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z" />
              </svg>
              <svg
                className={`${styles.mdcSwitchIcon} ${!checked ? "" : styles.mdcSwitchIconHidden}`}
                viewBox="0 0 24 24"
              >
                <path d="M20 13H4v-2h16v2z" />
              </svg>
            </div>
          </div>
        </div>
        <span className={styles.mdcSwitchFocusRingWrapper}>
          <div className={styles.mdcSwitchFocusRing}></div>
        </span>
      </button>
    </div>
  );
};

export default Switch;
