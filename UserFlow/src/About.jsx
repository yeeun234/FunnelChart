import mainImg from '../src/img/blur-1853262.jpg';
import "./styles/About.css";
import { Link, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import React, { useRef, useEffect, useState } from 'react';
import mainVideo from './img/preview.mp4';

function About() {
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const heroRef = useRef(null);
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const [inView1, setInView1] = useState(false);
  const [inView2, setInView2] = useState(false);
  const [heroInView, setHeroInView] = useState(false);
  const [sectionInView, setSectionInView] = useState(false);
  const [imageInView, setImageInView] = useState(false);
  const isLoggedIn = !!localStorage.getItem('accessToken');
  const isManager = !!localStorage.getItem('userRole') === 'ROLE_MANAGER';


  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = 500; // px after which gradient is fully gone
      const scrollY = window.scrollY;
      let opacity = 1 - Math.min(scrollY / maxScroll, 1);
      document.body.style.transition = 'background 0.5s';
      document.body.style.background = `linear-gradient(90deg, rgba(230,249,254,${opacity}) 0%, rgba(210,240,255,${opacity}) 100%)`;
    };
    // Set on mount
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    // Clean up on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.style.background = '';
      document.body.style.transition = '';
    };
  }, []);

  // Hero Section Observer
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => { if (heroRef.current) observer.unobserve(heroRef.current); };
  }, []);

  // Hero Title Animation (sequential)
  useEffect(() => {
    if (heroInView) {
      setInView1(true);
      const timer = setTimeout(() => setInView2(true), 100);
      return () => clearTimeout(timer);
    } else {
      setInView1(false);
      setInView2(false);
    }
  }, [heroInView]);

  // Section Observer
  useEffect(() => {
    const observer2 = new window.IntersectionObserver(
      ([entry]) => setSectionInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer2.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer2.unobserve(sectionRef.current); };
  }, []);

  // Image Observer
  useEffect(() => {
    const observer3 = new window.IntersectionObserver(
      ([entry]) => setImageInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (imageRef.current) observer3.observe(imageRef.current);
    return () => { if (imageRef.current) observer3.unobserve(imageRef.current); };
  }, []);

  return (
    <div className="aboutAppContainer" >
      <NavBar />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className={`heroSection fade-section${heroInView ? ' fade-in' : ''}`}
      >
        <div className="heroContent">
          <div
            ref={line1Ref}
            className={`heroTitle${inView1 ? ' animate-pop' : ''}`}
            style={{ minHeight: 56 }}
          >
            분석부터 액션까지
          </div>
          <div
            ref={line2Ref}
            className={`heroTitle${inView2 ? ' animate-pop delay' : ''}`}
            style={{ minHeight: 56 }}
          >
            이렇게나 쉬운 데이터 분석
          </div>
          <p className="heroSubtitle">
            지금 바로 데이터 기반 인사이트를 경험해보세요!
          </p>
          <Link to={isLoggedIn ? (isManager ? "/manager/request" : "/request") : "/login"}>
            <button className="heroBtn">무료로 시작하기</button>
          </Link>
        </div>
      </section>

      {/* Main Image - fade in/out on scroll */}
      <div
        ref={imageRef}
        className={`mainImgContainer fade-section${imageInView ? ' fade-in' : ''}`}
      >
        <Link to="/dashboard">
          <video
            src={mainVideo}
            className="mainImg"
            autoPlay
            loop
            muted
            playsInline
            style={{ objectFit: 'cover', width: '100%', borderRadius: '24px' }}
          />
        </Link>
      </div>

      {/* 프로젝트 소개 */}
      <section
        className={`section fade-section${sectionInView ? ' fade-in' : ''}`}
        ref={sectionRef}
      >
        <h2 className="sectionTitle">프로젝트 소개</h2>
        <p className="sectionDesc">
          UserFlow는 누구나 쉽게 데이터 분석을 의뢰하고,<br/> 데이터로 더 나은 인사이트를 얻고 싶은 모든 분들을 위해 신뢰할 수 있는 분석 환경을 제공하는 맞춤형 데이터 분석 의뢰 플랫폼입니다.<br />
          고객은 간편하게 분석을 요청하고 진행 상황을 확인할 수 있으며,<br/> 매니저는 문의된 분석 요청을 효율적으로 관리할 수 있습니다.<br />
        </p>

      </section>
    </div>
  );
}

export default About;