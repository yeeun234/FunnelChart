
import mainImg from '../src/img/blur-1853262.jpg'
import "./styles/About.css";
import { Link } from 'react-router-dom';
import NavBar from './NavBar';

function About() {
  return (
    <div className="appContainer">
      <NavBar></NavBar>

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