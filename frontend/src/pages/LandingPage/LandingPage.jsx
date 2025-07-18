import styles from "./landingpage.module.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../../customHooks/useAuth";
import { useUserContext } from "../../Contexts/UserContext";
import { useEffect } from "react";
const LandingPage = () => {
  useAuth();
  const navigate = useNavigate();
  const { isLoggedIn, userData, setIsLoggedIn } = useUserContext();
  const handleLogin = () => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  };

  useEffect(() => {
    console.log(userData);
  }, [userData]);

const handleSignOut = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userData");
  navigate("/"); 
  setIsLoggedIn(false);
};

  return (
    <section className={styles.landingPage}>
      <nav className={styles.navBar}>
        <div className={styles.logoContainer}>
          <img
            src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695019/logo_cgdotu.png"
            alt=""
          />
          <h1>FormBuilder</h1>
        </div>
        {isLoggedIn && (
           <p className={styles.userName}>
           Hi! {userData.username}
         </p>
        )}
        <div className={styles.rightContainer}>
          {!isLoggedIn ? (
            <button onClick={handleLogin} className={styles.signIn}>
              Sign in
            </button>
          ) : (
            <>
              <button onClick={handleSignOut} className={styles.signIn}>
                Sign out
              </button>
            </>
          )}

          <button
            className={styles.createBot}
            disabled={!isLoggedIn}
            onClick={() => navigate("/dashboard")}
          >
            Create
          </button>
        </div>
      </nav>
      <body className={styles.body}>
        <div className={styles.description}>
          <img
            className={styles.svgLeft}
            src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734715029/SVG_1_dv7sqp.png"
            alt="left svg"
          />
          <div className={styles.content}>
            <h1>Build advanced Forms visually</h1>
            <p>
              Form Builder gives you an powerful interface to build vast variety of forms
            </p>
            <button
              disabled={!isLoggedIn}
              onClick={() => navigate("/dashboard")}
              className={styles.createBotButton}
            >
              Create a FormBuilder for free
            </button>
          </div>
          <img
            className={styles.svgRight}
            src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695025/svgRight_yzszlu.png"
            alt="right svg"
          />
        </div>
        <div className={styles.imageContainer}>
          <img
            className={styles.landingpageBanner}
            src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734694634/landingpageBanner_a1elhi.png"
            alt=""
          />
        </div>
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.col1}>
              <h1>
                <img
                  src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695019/logo_cgdotu.png"
                  alt="logo"
                />
                FormBuilder
              </h1>
              <ul>
                
              </ul>
            </div>
            <div className={styles.col2}>
              <ul>
                <h1>Product</h1>
                <li>
                  Status{" "}
                  <img
                    className={styles.link}
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695014/link_vj5pon.png"
                    alt="link"
                  />
                </li>
                <li>
                  Documentation{" "}
                  <img
                    className={styles.link}
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695014/link_vj5pon.png"
                    alt="link"
                  />
                </li>
                <li>
                  Roadmap
                  <img
                    className={styles.link}
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695014/link_vj5pon.png"
                    alt="link"
                  />
                </li>
                <li>
                  Pricing
                  <img
                    className={styles.link}
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695014/link_vj5pon.png"
                    alt="link"
                  />
                </li>
              </ul>
            </div>
            <div className={styles.col3}>
              <h1>Community</h1>
              <ul>
                <li>
                  Discord{" "}
                  <img
                    className={styles.link}
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695014/link_vj5pon.png"
                    alt="link"
                  />
                </li>
                <li>
                  GitHub repository{" "}
                  <img
                    className={styles.link}
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695014/link_vj5pon.png"
                    alt="link"
                  />
                </li>
                <li>
                  Twitter{" "}
                  <img
                    className={styles.link}
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695014/link_vj5pon.png"
                    alt="link"
                  />
                </li>
                <li>
                  LinkedIn{" "}
                  <img
                    className={styles.link}
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695014/link_vj5pon.png"
                    alt="link"
                  />
                </li>
                <li>
                  OSS Friends{" "}
                  <img
                    className={styles.link}
                    src="https://res.cloudinary.com/dtu64orvo/image/upload/v1734695014/link_vj5pon.png"
                    alt="link"
                  />
                </li>
              </ul>
            </div>
            <div className={styles.col4}>
              <h1>Company</h1>
              <ul>
                <li>About</li>
                <li>Contact</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
        </footer>
      </body>
    </section>
  );
};

export default LandingPage;
