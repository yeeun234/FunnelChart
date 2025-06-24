import { useRef, useEffect, useState } from "react";
import axios from "axios";
import "./styles/Login.css"; 
import logoImg from "./img/Logo.svg"; 
import NaverLogo from "./img/NaverLogo.svg";
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const inputRef = useRef(null);
  const [id, setid] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const MIN_ID_LENGTH = 4;      // 예: 아이디 최소 4자
  const MIN_PW_LENGTH = 8;      // 예: 비밀번호 최소 8자

  

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!id || !pw) {
      setError("아이디와 비밀번호를 모두 입력하세요.");
      return;
    }
    if (id.length < MIN_ID_LENGTH) {
    setError(`아이디는 최소 ${MIN_ID_LENGTH}자 이상이어야 합니다.`);
    return;
    }
    if (pw.length < MIN_PW_LENGTH) {
      setError(`비밀번호는 최소 ${MIN_PW_LENGTH}자 이상이어야 합니다.`);
      return;
    }
    try {
    const res = await axios.post('http://10.125.121.173:8080/login', {
      id: id,
      password: pw
    });
    // console.log("서버 응답:", res.headers);
     const token = res.headers.authorization;
     const role = res.data.role;  // Role 가져옴
     const username = res.data.username;
     
    //  console.log("token:",token);
    //  console.log("role: ", role) 
    //  console.log("username: ", username)
    if (token) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("username", username);
      // 로그인 성공
      alert(`${username}님 환영합니다!`);
      if(role === 'ROLE_MEMBER'){
        navigate("/");   
      } else if (role === 'ROLE_MANAGER'){
        navigate("/")
      } else {
        setError("알 수 없는 사용자 권한입니다.")
      }
      // 예시: 메인 페이지로 이동
    } else {
      setError("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  } catch (err) {
    console.error("로그인 에러:", err, err.response);
    // 실무 보안: 아이디/비밀번호 오류는 항상 동일 메시지
    if (err.response && err.response.status === 401) {
      setError("아이디 또는 비밀번호가 일치하지 않습니다.");
    } else {
      setError("로그인 중 오류가 발생했습니다.");
    }
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
          <h3 className="login-title">Enter your account</h3>
          <div className="login-subtitle">Continue to "UserFlow"</div>
        </div>
        <input
          ref={inputRef}
          className="login-input"
          type="text"
          placeholder="Enter your ID"
          value={id}
          onChange={e => setid(e.target.value.trim())}
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
        {/* <div className="login-divider">OR</div>
        <button className="login-social-btn google" type="button" onClick={() => { window.location.href = "http://10.125.121.173:8080/oauth2/authorization/google"; }}>
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className="login-social-icon" />
          Google로 시작하기
        </button>
        <button className="login-social-btn naver" type="button" onClick={() => { window.location.href = "http://localhost:8080/oauth2/authorization/naver"; }}>
          <img src={NaverLogo} alt="Naver" className="login-social-icon" />
          Naver로 시작하기
        </button> */}
        <div className="login-links">
          <Link to="/join" className="login-link">회원가입</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
