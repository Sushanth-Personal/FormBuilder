import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import ClipLoader from "react-spinners/ClipLoader";
import styles from "./form.module.css";

const GoogleStyleForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [queryParams, setQueryParams] = useState({});
  const [flowData, setFlowData] = useState([]);
  const [inputData, setInputData] = useState([]);
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get("userId") || "";
    const formName = params.get("formName") || "";
    const folderName = params.get("folderName") || "";
    setQueryParams({ userId, formName, folderName });
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      if (!queryParams.userId) return;

      const res = await api.get(`/form/${queryParams.userId}`, {
        params: queryParams,
      });

      const filtered = res.data.elements.filter(
        (data) => data.buttonType !== "Button"
      );
      const input = filtered.filter(data => data.buttonType !== "TextBubble");
      console.log(input);
      setInputData(input);
      setFlowData(filtered);
    };

    fetchData();
  }, [queryParams]);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const handleChange = (index, value) => {
    setResponses({ ...responses, [index]: value });
    setErrors({ ...errors, [index]: "" }); // clear error when typing
  };

  const validateForm = () => {
    const newErrors = {};

    console.log(responses);

    inputData.forEach((field) => {
      console.log(field, field.order);
      const value = responses[field.order - 1];



      if (field.buttonType === "TextInput") {

        if (!value) {
          newErrors[field.order - 1] = "This field is required";
          return;
        }

        const onlyLettersRegex = /^[a-zA-Z\s]*$/;

        if (!onlyLettersRegex.test(value)) {
          newErrors[field.order-1] = "Only letters are allowed";
        }
      }



      if (field.buttonType === "Email") {
        if (!value) {
          newErrors[field.order - 1] = "This field is required";
          return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.order - 1] = "Invalid email address";
        }
      }

      if (field.buttonType === "Number") {
        if (!value) {
          newErrors[field.order - 1] = "This field is required";
          return;
        }
        if (isNaN(value)) {
          newErrors[field.order - 1] = "Invalid number";
        }
      }

      if (field.buttonType === "Password") {
        if (!value) {
          newErrors[field.order - 1] = "This field is required";
          return;
        }
        if (value.length < 6) {
          newErrors[field.order-1] = "Password must be at least 6 characters";
        }
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

 const submitForm = async () => {
  if (!validateForm()) return;

  setIsLoading(true);
  const currentTimestamp = new Date().toISOString(); // Generate timestamp in ISO format
  await api.post(`/form/response/${queryParams.userId}`, {
    folderName: queryParams.folderName,
    formName: queryParams.formName,
    responses: flowData.map((f, idx) => ({
      order: f.order,
      question: f.content,
      buttonType: f.buttonType,
      response: responses[idx] || null,
      timestamp: currentTimestamp, // Add timestamp to each response
    })),
  });
  setIsLoading(false);
  navigate("/thankyou");
};

  return (
<div className={styles.container}>
  <h1 className={styles.title}>{queryParams.formName || "Form"}</h1>

  <div className={styles.formWrapper}>
    <form className={styles.formGrid} onSubmit={(e) => e.preventDefault()}>
      {flowData
        .sort((a, b) => a.order - b.order) // Ensure elements are sorted by order
        .map((field, idx) => {
          if (field.buttonType === "TextBubble") {
            return (
              <div
                key={`textBubble-${field.id || idx}`}
                className={`${styles.bubble} ${styles.textBubble}`}
              >
                <h2 className={styles.textBubbleHeading}>{field.content}</h2>
              </div>
            );
          } else {
            // Map flowData index to inputData index
            const inputIdx = flowData
              .filter((f, i) => i <= idx && f.buttonType !== "TextBubble")
              .length - 1;
            return (
              <div
                key={`formField-${field.id || idx}`}
                className={styles.bubble}
              >
                <label className={styles.label}>{field.content}</label>
                {field.buttonType === "Date" ? (
                  <input
                    type="date"
                    className={styles.input}
                    onChange={(e) => handleChange(field.order - 1, e.target.value)}
                  />
                ) : field.buttonType === "Rating" ? (
                  <select
                    className={styles.input}
                    onChange={(e) => handleChange(field.order - 1, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select rating
                    </option>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {r} Star
                      </option>
                    ))}
                  </select>
                ) : field.buttonType === "Number" ||
                  field.buttonType === "Email" ||
                  field.buttonType === "TextInput" ||
                  field.buttonType === "Password" ? (
                  <input
                    className={styles.input}
                    type={
                      field.buttonType === "Number"
                        ? "number"
                        : field.buttonType === "Email"
                          ? "email"
                          : field.buttonType === "Password"
                            ? "password"
                            : "text"
                    }
                    placeholder={field.placeholder || "Enter your answer"}
                    onChange={(e) => handleChange(field.order - 1, e.target.value)}
                  />
                ) : null}
                <div style={{ height: "20px" }}>
                  {errors[field.order - 1] && (
                    <div className={styles.error}>{errors[field.order - 1]}</div>
                  )}
                </div>
              </div>
            );
          }
        })}
    </form>
  </div>

  <div className={styles.submitContainer}>
    <button
      onClick={submitForm}
      className={styles.submitButton}
      disabled={isLoading}
    >
      {isLoading ? <ClipLoader color="#fff" size={20} /> : "Submit"}
    </button>
  </div>
</div>
  );
};

export default GoogleStyleForm;
