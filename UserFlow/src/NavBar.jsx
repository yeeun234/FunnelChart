import React, { useState, useEffect } from 'react';
import { NavLink ,Link, useNavigate } from 'react-router-dom';
import Logo from '../src/img/Logo.svg';
import "./styles/Funnel.css";
import "./styles/Nav.css"



function NavBar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardDropdownOpen, setDashboardDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // 컴포넌트가 마운트될 때 localStorage에서 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
    setUserRole(localStorage.getItem("userRole"));
  }, []);

  // 로그아웃 함수: 토큰 삭제, 상태 변경, 로그인 페이지 이동
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  return (
    <nav className="nav">
      <div className="navContainer">
        <Link to="/" className="logoRow">
          <img src={Logo} alt="UserFlow Logo" className="logoImg" />
          <span className="projectName">UserFlow</span>
        </Link>
        <div className="navLinks">
          {isLoggedIn ? (
            <>
              <div className="navLink" onClick={handleLogout} style={{ cursor: "pointer" }}>
                로그아웃
              </div>
              {userRole === 'ROLE_MANAGER' ? (
                <NavLink to="/manager" className="navLink">문의확인</NavLink>
              ) : (
                <>
                  <NavLink to="/request" className="navLink">문의하기</NavLink>
                  <NavLink to="/mypage" className="navLink">마이페이지</NavLink>
                </>
              )}
            </>
          ) : (
            <NavLink to="/login" className="navLink">로그인</NavLink>
          )}
          <div
            className="navLink navDropdown"
            onMouseEnter={() => setDashboardDropdownOpen(true)}
            onMouseLeave={() => setDashboardDropdownOpen(false)}
            onClick={() => setDashboardDropdownOpen((open) => !open)}
            style={{ position: 'relative' }}
          >
            <NavLink to="/dashboard" className="navLink">분석 사례</NavLink>
            {dashboardDropdownOpen && (
              <div className="dropdownMenu">
                <NavLink to="/dashboard" className="dropdownItem" onClick={() => setDashboardDropdownOpen(false)}>
                  분석 전체보기
                </NavLink>
                <NavLink to="/delivery" className="dropdownItem" onClick={() => setDashboardDropdownOpen(false)}>
                  배송기간 분석
                </NavLink>
                <NavLink to="/customerBehavior" className="dropdownItem" onClick={() => setDashboardDropdownOpen(false)}>
                  고객재주문율 분석
                </NavLink>
                <NavLink to="/funnel" className="dropdownItem" onClick={() => setDashboardDropdownOpen(false)}>
                  고객이탈률 분석
                </NavLink>
              </div>
            )}
          </div>
          <NavLink
            to="/"
            end
            className={({ isActive }) => "navLink" + (isActive ? " active" : "")}
          >
            프로젝트 소개
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
