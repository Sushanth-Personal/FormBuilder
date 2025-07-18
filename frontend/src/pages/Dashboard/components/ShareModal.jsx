import { useState } from "react";
import styles from "./sharemodal.module.css"; // Ensure to style your modal as needed.
import axios from "axios";
import { useUserContext } from "../../../Contexts/UserContext";
import {api} from "../../../api/api";
import {useEffect} from "react";
const ShareModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [action, setAction] = useState("view");
  const { userData, theme} = useUserContext();

    useEffect(() => {
      document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

  const handleShare = async () => {
    try {
      if (!email) {
        alert("Please enter a valid email.");
        return;
      }
 
      const response = await api.post(
        `/protected/access/workspaces/${userData._id}`,
        {
          email,
          permission:action,
        }
      );
      console.log("API Response:", response.data);
      alert("Invite sent successfully!");
      onClose(); // Close modal after successful API call.
    } catch (error) {
      console.error("Error sharing workspace:", error);
      alert("Failed to send invite. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className = {styles.emailHeading}>Invite by Email</h2>
        <div className={styles.formGroup}>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email id"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <select
            id="action"
            value={action}
            onChange={(e) => setAction(e.target.value)}
          >
            <option value="view">View</option>
            <option value="edit">Edit</option>
          </select>
        </div>
        <button className={styles.shareButton} onClick={handleShare}>
          Send Invite
        </button>
        <h2 className = {styles.copyLinkHeading}>Copy link</h2>
        <button className = {styles.shareButton}>Copy link</button>
      </div>
    </div>
  );
};

export default ShareModal;
