import { useRef, useEffect } from "react";
import "./styles/Login.css"; 
import logoImg from "../src/img/Logo.svg"; 
import NaverLogo from "../src/img/NaverLogo.svg"
import { Link } from 'react-router-dom';


function Login() {
  const inputRef = useRef(null);
    console.log(inputRef.current)
    useEffect(() => {
      console.log(inputRef.current)
      inputRef.current && inputRef.current.focus();
    }, []);
  
  return (
    <div className="login-bg">
      <Link to ="/" className="login-logo">
        <img src={logoImg} alt="Projectn Logo" className="login-logo-img" />
        <h2 className="login-logo-text">UserFlow</h2>
      </Link>
      <div className="login-card">
        <div className="login-title-box">
          <h3 className="login-title">Enter your email</h3>
          <div className="login-subtitle">Continue to "projectn"</div>
        </div>
        <input ref={inputRef} className="login-input" type="email" placeholder="Enter your email" />
        <input className="login-input" type="password" placeholder="Password" />
        <button className="login-btn">Sign in</button>
        <div className="login-divider">OR</div>
        <button className="login-social-btn google">
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className="login-social-icon" />
          Google로 시작하기
        </button>
        <button className="login-social-btn naver">
          <img src={NaverLogo} alt="Naver" className="login-social-icon" />
          Naver로 시작하기
        </button>
        <div className="login-links">
          {/* <a href="/join" target="_blank" className="login-link" >
          아이디 찾기
          </a>
          <span className="login-link-divider">|</span> */}
          <Link to = "/join" className="login-link" >
          회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
