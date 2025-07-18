import { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import Switch from "../../components/Switch/Switch";
import { useUserContext } from "../../Contexts/UserContext";
import useAuth from "../../customHooks/useAuth";
import {
  createFolder,
  deleteFolder,
  createForm,
  deleteForm,
} from "../../api/api";
import useFetchFolders from "../../customHooks/useFetchFolders";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "../../api/api";
import Settings from "../../components/Settings/Settings";
import ShareModal from "./components/ShareModal";
import useFetchAccessibleWorkpaces from "../../customHooks/useFetchAccessibleWorkspaces";
const Dashboard = () => {
  useAuth();

  const navigate = useNavigate();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false); // State for modal visibility
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(""); // Folder to delete
  const [folderName, setFolderName] = useState(""); // State for folder name input
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // Form modal visibility
  const [isFormDeleteModalOpen, setIsFormDeleteModalOpen] =
    useState(false); // Form delete modal
  const [formToDelete, setFormToDelete] = useState(""); // Form to delete
  const [formName, setFormName] = useState(""); // State for form name input
  const {
    folders,
    setFolders,
    setSelectedForm,
    selectedFolder,
    setSelectedFolder,
    workspaces,
    theme,
    permission,
    setPermission,
  } = useUserContext();

  const [forms, setForms] = useState([]); // State to manage forms
  const [error, setError] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [workspaceList, setWorkspaceList] = useState(
    workspaces || []
  );

  useFetchAccessibleWorkpaces(setSelectedWorkspace);
  useFetchFolders();
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    console.log(forms);
  }, [forms]);

  useEffect(() => {
    console.log(selectedWorkspace);
  }, [selectedWorkspace]);

  useEffect(() => {
    console.log("permission", permission);
  }, [permission]);

  useEffect(() => {
    console.log(selectedWorkspace);
  }, [selectedWorkspace]);
  /**
   * Toggles the visibility of the dropdown menu
   */

  const handleWorkspaceClick = async (workspaceId) => {
    try {
      const workspaceData = await fetchUserData(workspaceId);
      if (workspaceData) {
        console.log("workspaceData", workspaceData);
        setSelectedWorkspace(workspaceData);
        sessionStorage.setItem(
          "selectedWorkspace",
          JSON.stringify(workspaceData)
        );
        // Reorder the workspaces array
        const reorderedWorkspaces = workspaces.filter(
          (id) => id !== workspaceId
        );
        setWorkspaceList([workspaces, ...reorderedWorkspaces]);

        // Assuming folderForms needs to be fetched for the selected workspace
        const folderForms =
          JSON.parse(localStorage.getItem("folderForms")) || {};
        const folderNamesArray = Object.keys(folderForms);
        setFolders(folderNamesArray);
        setForms([]);
        setSelectedFolder("");

        const workspacesAvailable = workspaces;
        const matchingWorkspace = workspacesAvailable.find(
          (workspace) => workspace.userId === workspaceId
        );

        if (matchingWorkspace) {
          console.log("matchingWorkspace", matchingWorkspace);
          setPermission(matchingWorkspace.permission);
        }
      }
    } catch (error) {
      console.error("Error fetching workspace data:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  const handleCreateFolderClick = () => {
    setIsFolderModalOpen(true); // Open the modal
  };

  const handleFolderClick = (folderName) => {
    console.log("Selected folder:", folderName);
    if (selectedFolder === folderName) {
      setSelectedFolder("");
      sessionStorage.removeItem("selectedFolder");
      return;
    } else {
      setSelectedFolder(folderName);
      sessionStorage.setItem("selectedFolder", folderName);
    }

    const allForms =
      JSON.parse(localStorage.getItem("folderForms")) || [];
    if (allForms[folderName]) {
      setForms(allForms[folderName]);
    } else {
      setForms([]);
    }
  };

  const handleCloseModal = () => {
    setError("");
    setIsFolderModalOpen(false); // Close the modal
    setFolderName(""); // Reset folder name
  };

  const handleFolderDone = async () => {
    if (folderName.trim()) {
      try {
        console.log(folders, folderName);

        if (folders.some((folder) => folder === folderName)) {
          setError("Folder with this name already exists");
          return;
        }

        // Call the createFolder function and pass the folderName
        const currentFolderData = await createFolder(folderName);
        if (currentFolderData === "UserId not found") {
          navigate("/login");
          return;
        }
        fetchUserData();
        console.log(currentFolderData);
        // Update the folder list with the new folder data
        setFolders(currentFolderData);

        console.log(
          "Folder created successfully:",
          currentFolderData
        );

        // Close the modal after successful creation
        handleCloseModal();
      } catch (error) {
        // Handle any errors during the folder creation
        console.error("Error creating folder:", error);
        alert("Failed to create folder. Please try again.");
      }
    } else {
      alert("Please enter a folder name");
    }
  };

  const confirmDeleteFolder = (folderName) => {
    setFolderToDelete(folderName); // Set the folder to delete
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false); // Close the delete confirmation modal
    setFolderToDelete(""); // Reset folder to delete
  };

  const handleDeleteFolder = async () => {
    try {
      const currentFolderData = await deleteFolder(folderToDelete);
      if (currentFolderData === "UserId not found") {
        navigate("/login");
        return;
      }

      console.log(currentFolderData);
      setFolders(currentFolderData.folders);
      setIsDeleteModalOpen(false);
      setFolderToDelete("");
      fetchUserData();
    } catch (error) {
      console.error("Error deleting folder:", error);
      alert("Failed to delete folder. Please try again.");
    }
  };

  // Form modal handlers
  const handleCreateFormClick = () => {
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setFormName("");
    setError("");
  };

  const handleFormDone = async () => {
    if (selectedFolder.trim()) {
      try {
        const folderForms =
          JSON.parse(localStorage.getItem("folderForms")) || {};

        // Check if the selected folder contains the formName
        if (folderForms[selectedFolder]?.includes(formName)) {
          console.log(
            "Form with this name already exists in the selected folder"
          );
          setError(
            "Form with this name already exists in the selected folder"
          );
          return;
        }

        // Call the createFolder function and pass the folderName
        const currentFormData = await createForm(
          formName,
          selectedFolder
        );

        if (currentFormData === "UserId not found") {
          navigate("/login");
          return;
        }

        if (currentFormData === "Form already exists") {
          setError("Form already exists");
          return;
        }

        console.log(selectedFolder);
        // Update the folder list with the new folder data
        setForms(currentFormData[selectedFolder]);

        fetchUserData();
        console.log("Form created successfully:", currentFormData);

        // Close the modal after successful creation
        handleCloseFormModal();
      } catch (error) {
        // Handle any errors during the folder creation
        console.error("Error creating form:", error);
        alert("Failed to create form. Please try again.");
      }
    } else {
      alert("Please select a folder");
      handleCloseFormModal();
    }
  };

  const confirmDeleteForm = (formName) => {
    console.log(formName);
    setFormToDelete(formName);
    setIsFormDeleteModalOpen(true);
  };

  const handleCancelFormDelete = () => {
    setIsFormDeleteModalOpen(false);
    setFormToDelete("");
  };

  const handleDeleteForm = async () => {
    try {
      // Make an API call to delete the form, passing formName and folderName
      const currentFormData = await deleteForm(
        formToDelete,
        selectedFolder
      );
      console.log("currentFormData", currentFormData);
      // Check if the form deletion was successful
      if (currentFormData === "Form not found") {
        alert("Form not found. Please try again.");
        return;
      }

      if (Object.keys(currentFormData).length === 0) {
        console.log("currentFormData", currentFormData);
        setForms([]);
        setIsFormDeleteModalOpen(false);
        setFormToDelete(""); // Reset form name state
        fetchUserData();
        return;
      }

      console.log(currentFormData[selectedFolder]);
      // If the form is successfully deleted, update the form list
      setForms(currentFormData[selectedFolder]); // Assuming `setForms` updates the list of forms
      // Close the modal and reset the form state
      setIsFormDeleteModalOpen(false);
      setFormToDelete(""); // Reset form name state
      fetchUserData();
    } catch (error) {
      console.error("Error deleting form:", error);
      alert("Failed to delete form. Please try again.");
    }
  };

  const handleFormClick = (formName) => {
    setSelectedForm(formName);
    sessionStorage.setItem("selectedForm", formName);
    navigate("/editor");
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {isSettingsOpen ? (
        <Settings setIsSettingsOpen={setIsSettingsOpen} />
      ) : (
        <section className={styles.dashboard}>
          <ShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
          />
          <nav className={styles.navBar}>
            <div className={styles.leftContainer}>
              {!isDropdownVisible && (
                <div
                  role="button"
                  onClick={toggleDropdown}
                  className={styles.workspaceSelector}
                >
                  <h1>{`${selectedWorkspace.username}'s workspace`}</h1>
                  <img
                    className={styles.downArrow}
                    src={
                      theme === "light"
                        ? "https://res.cloudinary.com/dtu64orvo/image/upload/v1734862852/arrow-down-sign-to-navigate_pfxwn8.png"
                        : "https://res.cloudinary.com/dtu64orvo/image/upload/v1734852265/options_ffofkm.png"
                    }
                    alt="options"
                  />
                </div>
              )}
              {isDropdownVisible && (
                <div
                  role="button"
                  onClick={toggleDropdown}
                  className={styles.dropdown}
                >
                  <ul>
                    {console.log("workspaces", workspaces)}
                    {workspaces &&
                      workspaces.map((workspace) => (
                        <li
                          key={workspace.userId}
                          onClick={() =>
                            handleWorkspaceClick(workspace.userId)
                          }
                        >
                          <p>{`${workspace.username}'s workspace`}</p>
                        </li>
                      ))}
                    <li onClick={() => setIsSettingsOpen(true)}>
                      Settings
                    </li>
                    <li onClick={handleLogout}>Log Out</li>
                  </ul>
                </div>
              )}
            </div>
            <div className={styles.rightContainer}>
              <div className={styles.themeSelector}>
                <label htmlFor="basic-switch">Light</label>
                <Switch />
                <label htmlFor="basic-switch">Dark</label>
              </div>
              {permission === "edit" && (
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className={styles.share}
                >
                  Share
                </button>
              )}
            </div>
          </nav>
          <div className={styles.workspace}>
            <div className={styles.content}>
              <div className={styles.folderNav}>
                <ul>
                  {permission === "edit" && (
                    <li
                      role="button"
                      onClick={handleCreateFolderClick}
                    >
                      <img
                        className={styles.createFolder}
                        src={
                          theme === "light"
                            ? "https://res.cloudinary.com/dtu64orvo/image/upload/v1734924297/add-folder_w0os8e.png"
                            : "https://res.cloudinary.com/dtu64orvo/image/upload/v1734865182/SVG_3_fawuu1.png"
                        }
                        alt="create folder"
                      />
                      Create a folder
                    </li>
                  )}

                  {folders.map((folder, index) => (
                    <li
                      onClick={() => handleFolderClick(folder)}
                      className={
                        folder === selectedFolder ? styles.active : ""
                      }
                      key={index}
                    >
                      {folder}
                      {permission === "edit" && (<img
                        role="button"
                        onClick={() => confirmDeleteFolder(folder)}
                        className={styles.deleteFolder}
                        src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734865860/delete_obpnmw.png"
                        alt="delete folder"
                      />)}
                      
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.formArea}>
                <ul>
                  {permission === "edit" && (
                    <li
                      className={styles.create}
                      role="button"
                      onClick={handleCreateFormClick}
                    >
                      <img
                        src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734893036/SVG_4_zwan4q.png"
                        alt="add"
                      />
                      <h3>Create a form</h3>
                    </li>
                  )}

                  {selectedFolder &&
                    forms.map((form, index) => (
                      <li
                        onClick={() => handleFormClick(form)}
                        key={index}
                      >
                        {form}
                        {permission === "edit" && (
                          <img
                            role="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              confirmDeleteForm(form);
                            }}
                            className={styles.deleteButton}
                            src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734893849/delete_dvkcex.svg"
                            alt="delete"
                          />
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Folder Modal */}
          {isFolderModalOpen && (
            <div className={styles.Modal}>
              <div className={styles.modalContent}>
                <h3>Create New Folder</h3>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  className={styles.modalInput}
                />
                <p className={styles.error}>{error}</p>
                <div className={styles.modalActions}>
                  <div className={styles.leftSide}>
                    <button
                      onClick={handleFolderDone}
                      className={styles.doneButton}
                    >
                      Done
                    </button>
                  </div>
                  <div className={styles.rightSide}>
                    <button
                      onClick={handleCloseModal}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isDeleteModalOpen && (
            <div className={styles.deleteModal}>
              <div className={styles.modalContent}>
                <h3>Are you sure you want to delete this folder?</h3>
                <div className={styles.modalActions}>
                  <button
                    onClick={handleDeleteFolder}
                    className={styles.doneButton}
                  >
                    Yes
                  </button>
                  <button
                    onClick={handleCancelDelete}
                    className={styles.cancelButton}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Form Modal */}
          {isFormModalOpen && (
            <div className={styles.Modal}>
              <div className={styles.modalContent}>
                <h3>Create New Form</h3>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Enter form name"
                  className={styles.modalInput}
                />
                <p className={styles.error}>{error}</p>
                <div className={styles.modalActions}>
                  <div className={styles.leftSide}>
                    <button
                      onClick={handleFormDone}
                      className={styles.doneButton}
                    >
                      Done
                    </button>
                  </div>
                  <div className={styles.rightSide}>
                    <button
                      onClick={handleCloseFormModal}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Delete Confirmation Modal */}
          {isFormDeleteModalOpen && (
            <div className={styles.deleteModal}>
              <div className={styles.modalContent}>
                <h3>Are you sure you want to delete this form?</h3>
                <div className={styles.modalActions}>
                  <button
                    onClick={handleDeleteForm}
                    className={styles.doneButton}
                  >
                    Yes
                  </button>
                  <button
                    onClick={handleCancelFormDelete}
                    className={styles.cancelButton}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default Dashboard;
