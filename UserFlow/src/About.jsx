import Logo from '../src/img/Logo.svg';
import mainImg from '../src/img/blur-1853262.jpg'
import "./styles/About.css";
import { Link } from 'react-router-dom';


function About() {
  return (
    <div className="appContainer">
      {/* 네비게이션 */}
      <nav className="nav">
        <div className="logoRow">
          <img
            src={Logo}
            alt="UserFlow"
            className="logoImg"
          />
          <span className="projectName">UserFlow</span>
        </div>
        <div className="navLinks">
          <Link to="/bar"><div className="navLink" >고객재주문율 분석</div></Link>
          <Link to="/funnel">
            <div className="navLink">
              고객이탈률 분석
            </div>
          </Link>
          <Link to="/">
            <div className="navLink" style={{ color: "#01C2FD" }}>
              프로젝트 소개
            </div>
          </Link>
        </div>
      </nav>

      {/* 메인 이미지 */}
      <img
        src={mainImg}
        alt="chart"
        className="mainImg"
      />

      {/* 프로젝트 소개 */}
      <section className="section">
        <h2 className="sectionTitle">프로젝트 소개</h2>
        <p className="sectionDesc">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.
        </p>
        <Link to="/login">
         <button className="joinBtn">Join us</button>
        </Link>
      </section>
    </div>
  );
}

export default About;