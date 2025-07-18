import styles from "./responsedisplay.module.css";
import { useUserContext } from "../../Contexts/UserContext";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { PieChart } from "react-minimal-pie-chart";
const ResponseDisplay = () => {
  const { flowData, userData, selectedFolder, selectedForm } =
    useUserContext(); // This contains the flow data
  const [responses, setResponses] = useState([]); // To store responses fetched from the backend
  const [analytics, setAnalytics] = useState({
    views: 0,
    starts: 0,
    completions: 0,
  });
  const label = {
    TextInput: "Input Text",
    Number: "Input Number",
    Email: "Input Email",
    Phone: "Input Phone",
    Date: "Input Date",
    Rating: "Input Rating",
    TextBubble: "Text",
    Image: "Image",
    Video: "Video",
    Gif: "GIF",
    Time: "Input Time",
    Button: "Button",
  };

  const getAnalytics = async () => {
    try {
      let userId;
      if(sessionStorage.getItem("selectedWorkspace")){
        userId = JSON.parse(sessionStorage.getItem("selectedWorkspace"))._id;
      }else{
        userId=userData._id;
      }
      const response = await api.get(`/analytics/${userId}`, {
        params: {
          folderName: selectedFolder, // Set folderName
          formName: selectedForm, // Set formName
        },
      });
      setAnalytics(response.data); // Set analytics data in state
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };

  // Function to fetch form responses from the backend
  const getFormResponses = async () => {
    try {
      let userId;
      if(sessionStorage.getItem("selectedWorkspace")){
        userId = JSON.parse(sessionStorage.getItem("selectedWorkspace"))._id;
      }else{
        userId=userData._id;
      }
      const response = await api.get(
        `/form/response/${userId}`,
        {
          params: {
            folderName: selectedFolder, // Set folderName
            formName: selectedForm, // Set formName
          },
        }
      );
      console.log(response.data);
      setResponses(response.data.responses); // Set responses in the state
    } catch (error) {
      setResponses([]);
      console.error("Error fetching form responses:", error);
    }
  };

  useEffect(() => {
    getFormResponses(); // Fetch form responses when the component mounts
    getAnalytics(); // Fetch analytics data when the component mounts
  }, [flowData]);

  // Function to match responses based on buttonType and order
  const getResponseForButton = (user, buttonType, order) => {
    console.log(user, buttonType, order);
    const response = responses.find(
      (res) =>
        res.user === user &&
        res.buttonType === buttonType &&
        res.order === order
    );
    if (response) {
      if (response.response) {
        return response.response;
      } else if (response.content) {
        return response.content;
      } else {
        return "Finish";
      }
    }
  };

  return (
    <section className={styles.responseDisplay}>
      {responses.length === 0 && <div className = {styles.noResponseWindow}>
        <h1 className = {styles.noResponse}>No Responses Yet</h1>
      </div>}
      {responses.length > 0 && (
        
    <>
  <div className={styles.viewContainer}>
    <div className={styles.views}>
      <h1>Views</h1>
      <p>{analytics.view}</p>
    </div>
    <div className={styles.views}>
      <h1>Start</h1>
      <p>{analytics.start}</p>
    </div>
  </div>
  <div className={styles.tableContainer}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Timestamp</th>{" "}
          {/* Empty header for the first column (TimeStamp) */}
          {flowData.map((item, index) => (
            <th key={index}>{label[item.buttonType]}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* Map over the user responses and display the data */}
        {responses
          .filter(
            (res, index, self) =>
              // Ensure only one row per user (based on userId)
              self.findIndex((t) => t.user === res.user) === index
          )
          .map((response, rowIndex) => (
            <tr key={rowIndex}>
              <td>
                {new Date(response.timestamp).toLocaleString()}
              </td>{" "}
              {/* Display Timestamp */}
              {flowData.map((item, colIndex) => (
                <td key={colIndex}>
                  {/* Display the matching response or fallback */}
                  {getResponseForButton(
                    rowIndex + 1,
                    item.buttonType,
                    item.order
                  )}
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  </div>
  <div className={styles.analyticsContainer}>
    <div className = {styles.pieChart}>
      <PieChart
        data={[
          { title: "", value: analytics.start-analytics.completed, color: `#909090` },
          {
            title: "Completed",
            value: analytics.completed,
            color: ` #3B82F6`,
          },
        ]}
        lineWidth={15} // Adjust the thickness of the ring
        startAngle={0} // Starting angle of the chart
        animate // Adds animation on load
      />
      <h1>Completed</h1>
      <p>{analytics.completed}</p>
    </div>
    <div className = {styles.completionRate}>
    <h1>Completion Rate</h1>
    <p>{Math.round((analytics.completed /( analytics.start)) * 100)}%</p>
  </div>
  </div>
</>
)}
      

   
    </section>
  );
};

export default ResponseDisplay;
