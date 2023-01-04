import { useEffect, useState } from "react";
import { FirebaseSignup, FirebaseSignin, FirebaseDB } from "../Utils/firebase";
import Cropper from "./Cropper";

export default function Signup({userDataHandler}) {
  const [img, setImage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [stage, setStage] = useState(0);

  const emailHandler = (e) => {
    setEmail(e.target.value);
    console.log(email);
  };

  const passwordHandler = (e) => {
    setPassword(e.target.value);
    console.log(password);
  };

  const fullNameHandler = (e) => {
    setFullname(e.target.value);
    console.log(fullname);
  };

  const submitHandler = () => {
    setStage(3)
    FirebaseSignup(email, password).then(() => {
      FirebaseDB("users", { full_name: fullname }).then(() => {
        setStage(0);
        clearFields();
      });
    });
  };

  const loginHandler = () => {
    FirebaseSignin(email, password).then((result) => {
      console.log(result)
      if(result != undefined){
        userDataHandler(result)
      }
        clearFields();
    });
  };

  const clearFields = () => {
    setEmail("");
    setPassword("");
    setFullname("");
  }


  return (
     <div className="content_container">
          <div className="form_container">
          <div className="form_header_container">
            <h2 className="form_header">
            
            <img className="logo" width ="100px" src="sideworld_logo.png" />

            </h2>
          </div>

          <div className="form_content_container">
          {stage == 0 && <div className="form_content_inner_container">
            
              <input
                type="email"
                className="email"
                placeholder="Email"
                value={email}
                onChange={emailHandler}
              />
              <input
                type="password"
                className="password"
                placeholder="New Password"
                onChange={passwordHandler}
                value={password}
              />

              <div className="button_container_one">
                <button id="login" onClick={loginHandler}>
                  Login
                </button>
              </div>

              <div className="button_container_google">
                <img className="google_logo" src="g-logo.png" alt="Google Logo"/>
                <button id="glogin">Sign in with Google</button>
              </div>

              <div className="signup_button_container">
                  <div className="signup_button">
                      Don't have an account? <p className="signupText" onClick={(() => setStage(1)) }>Sign Up</p>
                  </div>
              </div>
            </div>}

            {stage == 1 && <div className="form_content_inner_container">
            <input
                type="email"
                className="email"
                placeholder="Email"
                value={email}
                onChange={emailHandler}
              />
              <input
                type="password"
                className="password"
                placeholder="Password"
                onChange={passwordHandler}
                value={password}
              />

              <div className="button_container_one">
                <button id="register" disabled={!(password.length > 4 && email.length > 8)} onClick={(() => {setStage(2)})}>
                  Continue
                </button>
              </div>
            </div>}

            {stage == 2 && <div className="form_content_inner_container">
              <img width="75rem" src={img}></img>

              {/* <div className="cropperContainer">
                <Cropper />
              </div> */}

              <input
                type="text"
                className="full_name"
                placeholder="Nickname"
                value={fullname}
                onChange={fullNameHandler}
              />

              <div className="button_container_one">
                <button id="register" onClick={submitHandler}>
                  Complete
                </button>
              </div>
            </div>}
          </div>

        </div>
      </div>
  );
}
