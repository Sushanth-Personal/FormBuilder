import styles from "./loginpage.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useScreenSize from "../../customHooks/useScreenSize";
import {useUserContext} from "../../Contexts/UserContext";
import { loginUser, registerUser} from "../../api/api";
import ClipLoader from "react-spinners/ClipLoader";
import {
  validateEmail,
  validatePassword,
} from "../../errorHandler/inputError";
const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const isMobile = useScreenSize(768);
  const { setIsLoggedIn, setUserData} = useUserContext();
  const [isJustRegistered, setIsJustRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserDataState] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDataState({
      ...userData,
      [name]: value,
    });
  };

  const handleRegisterLink = () => {
    setIsLogin(!isLogin);
    setIsJustRegistered(false);
    setErrors({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setUserDataState({
      username: "",
      email: "",
      password: "",
    });
    setConfirmPassword("");
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { username, email, password} = userData;
    console.log(username, email, password);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = password !== confirmPassword ? "Passwords do not match" : "";

    setErrors({
      username: !username ? "Username is required" : "",
      email: emailError?.error || "",
      password: passwordError?.error || "",
      confirmPassword: confirmPasswordError,
    });

    console.log(username);
    console.log(errors);

    if (!username || emailError?.error || passwordError?.error || confirmPasswordError) {
      setIsLoading(false);
      return;
    }

console.log(username, email, password);
    try {
      const response = await registerUser(username, email, password);
      setIsLoading(false);

      if (response === "Success") {
        setIsJustRegistered(true);
        setIsLogin(true);
      } 
      else if(response === "Username already exists") {
        setErrors({
          ...errors,
          username: "Username already exists",
        })
      } else if(response === "Email already exists") {
        setErrors({
          ...errors,
          username:"",
          email: "Email already exists",
        })
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred while registering. Please try again later.");
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(userData);
    const { email, password } = userData;
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    setErrors({
      email: emailError?.error || "",
      password: passwordError?.error || "",
    });

    if (emailError.error || passwordError.error) {
      setIsLoading(false);
      return;
    }

    try {
      console.log(email, password);
      const response = await loginUser(email, password);
      setIsLoading(false);
      if (response.message === "Success") {
        
        const completeUserData = { ...response.user, userId: response.user._id };
        setIsLoggedIn(true);
        setUserData(completeUserData);
        localStorage.setItem("userId", response.user._id);
        localStorage.setItem("userData", JSON.stringify(completeUserData));
        navigate("/");
      } else {
        if(response==="Invalid email"){
          setErrors({
            ...errors,
            email: "Invalid email",
            password: "",
          })
        } else if(response==="Invalid password"){
          setErrors({
            ...errors,
            email: "",
            password: "Invalid password",
          })
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred while logging in. Please try again later.");
    }
  };


  return (
    <section className={styles.loginPage}>
      <nav>
        <div
          className={styles.arrowBox}
        >
          <img
          role="button"
          onClick={() => window.history.back() || navigate("/")}
          src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695297/arrow_back_wzcjzz.png" alt="Back Arrow" />
        </div>
        {isJustRegistered && (
          <p className={styles.justRegistered}>
           Successfully Registered !!
          </p>
        )}
      </nav>
      <div className={styles.behindContainer}>
        {!isMobile && (
          <img
            className={styles.leftImage}
            src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695323/Group_2_xyq7d6.png"
            alt="left image"
          />
        )}

        {isMobile && isLogin && (
          <img
            className={styles.leftImage}
            src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695323/Group_2_xyq7d6.png"
            alt="left image"
          />
        )}

        <img
          className={styles.rightImage}
          src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695312/Ellipse_2_2_dqzsgo.png"
          alt="right image"
        />
        <img
          className={styles.bottomImage}
          src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695305/Ellipse_1_fqeayv.png"
          alt="bottom image"
        />
      </div>
      <div className={styles.loginContainer}>
        <div className={styles.loginForm}>
          <>
            {!isLogin && (
              <div className={`${styles.userNameForm} ${errors.username ? styles.errorField : ""}`}>
                <label htmlFor="">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter a username"
                  onChange={handleChange}
                />
                <div className={styles.error}>{errors.username}</div>
              </div>
            )}

            <div className={`${styles.emailForm} ${errors.email ? styles.errorField : ""}`}>
              <label htmlFor="">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              <div className={styles.error}>{errors.email}</div>
            </div>
            <div className={styles.passwordForm}>
              <label htmlFor="">Password</label>
              <input
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                placeholder="xxxxxxxxx"
              />
              <div className={styles.error}>{errors.password}</div>
            </div>

            {!isLogin && (
              <div className={`${styles.passwordForm} ${errors.confirmPassword ? styles.errorField : ""}`}>
                <label htmlFor="">Confirm Password</label>
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  type="password"
                  name="password"
                  placeholder="xxxxxxxxx"
                />
                 <div className={styles.error}>{errors.confirmPassword}</div>
              </div>
            )}
{isLogin ?(  <button
              onClick={handleLogin}
              className={styles.loginButton}
            >
              {isLoading? <ClipLoader color="white" size={25} />:"Log In"}
             
            </button>):(
                  <button
                  onClick={handleRegister}
                  className={styles.loginButton}
                >
                  {isLoading? <ClipLoader color="white" size={25} />:"Sign Up"}
                </button>
            )}
          
            <h3 className={styles.orText}>OR</h3>
            <button className={styles.loginButton}>
              <div>
                <img
                  src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695317/Google_Icon_gcxyt5.png"
                  alt="google icon"
                />
              </div>
              Sign In with Google
            </button>
            {!isLogin ? (
              <div className={styles.signUpText}>
                <p>Already have an account ? </p>
                <a
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRegisterLink();
                  }}
                  href=""
                >
                  Login
                </a>
              </div>
            ) : (
              <div className={styles.signUpText}>
                <p>Don’t have an account?</p>
                <a
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRegisterLink();
                  }}
                  href=""
                >
                  Register now
                </a>
              </div>
            )}
          </>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
