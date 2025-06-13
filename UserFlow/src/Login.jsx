import { useRef, useEffect, useState } from "react";
import axios from "axios";
import "./styles/Login.css"; 
import logoImg from "../src/img/Logo.svg"; 
import NaverLogo from "../src/img/NaverLogo.svg";
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const inputRef = useRef(null);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !pw) {
      setError("이메일과 비밀번호를 모두 입력하세요.");
      return;
    }
    try {
    const res = await axios.post('http://10.125.121.173:8080/login', {
      id: email,
      password: pw
    });
     console.log("서버 응답:", res.headers);
     const token = res.headers.authorization;
      console.log("token:",token);
    if (token) {
      localStorage.setItem("accessToken", token);
      // 로그인 성공
      alert(`${email}님 환영합니다!`);
      // 예시: 메인 페이지로 이동
      navigate("/");
    } else {
      setError("이메일 또는 비밀번호가 일치하지 않습니다.");
    }
  } catch (err) {
    console.error("로그인 에러:", err, err.response);
    setError("로그인 중 오류가 발생했습니다.");
  }
};

  return (
    <div className="login-bg">
      <Link to="/" className="login-logo">
        <img src={logoImg} alt="UserFlow Logo" className="login-logo-img" />
        <h2 className="login-logo-text">UserFlow</h2>
      </Link>
      <form className="login-card" onSubmit={handleLogin}>
        <div className="login-title-box">
          <h3 className="login-title">Enter your email</h3>
          <div className="login-subtitle">Continue to "UserFlow"</div>
        </div>
        <input
          ref={inputRef}
          className="login-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value.trim())}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={pw}
          onChange={e => setPw(e.target.value)}
        />
        <button className="login-btn" type="submit">Sign in</button>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        <div className="login-divider">OR</div>
        <button className="login-social-btn google" type="button" onClick={() => { window.location.href = "http://10.125.121.173.nip.io:8080/oauth2/authorization/google"; }}
>
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className="login-social-icon" />
          Google로 시작하기
        </button>
        <button className="login-social-btn naver" type="button">
          <img src={NaverLogo} alt="Naver" className="login-social-icon" />
          Naver로 시작하기
        </button>
        <div className="login-links">
          <Link to="/join" className="login-link">회원가입</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
