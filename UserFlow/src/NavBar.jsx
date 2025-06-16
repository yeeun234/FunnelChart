import React, { useState, useEffect } from 'react';
import { NavLink ,Link, useNavigate } from 'react-router-dom';
import Logo from '../src/img/Logo.svg';
import "./styles/Funnel.css";
import "./styles/Nav.css"



function NavBar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 컴포넌트가 마운트될 때 localStorage에서 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  // 로그아웃 함수: 토큰 삭제, 상태 변경, 로그인 페이지 이동
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  return (
    <nav className="nav"  >
      <Link to="/" className="logoRow">
        <img src={Logo} alt="UserFlow Logo" className="logoImg" />
        <span className="projectName">UserFlow</span>
      </Link>
      <div className="navLinks">
        {isLoggedIn ? (
          <div className="navLink" onClick={handleLogout} style={{ cursor: "pointer" }}>
            로그아웃
          </div>
        ) : (
          <NavLink to="/login" className="navLink">로그인</NavLink>
        )}
  <NavLink
    to="/bar"
    end
    className={({ isActive }) => "navLink" + (isActive ? " active" : "")}
  >
    고객재주문율 분석
  </NavLink>
  <NavLink
    to="/funnel"
    end
    className={({ isActive }) => "navLink" + (isActive ? " active" : "")}
  >
    고객이탈률 분석
  </NavLink>
  <NavLink
    to="/"
    end
    className={({ isActive }) => "navLink" + (isActive ? " active" : "")}
  >
    프로젝트 소개
  </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
