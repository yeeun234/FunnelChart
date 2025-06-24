import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Request.css'

export default function Request() {
  const inputRef = useRef(null);
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // 이전페이지로 이동

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 11)
      return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    else if (digits.length === 10)
      return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    return value;
  };

  const isValidEmail = (email) => {
    // Basic email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
      return false;
    }
    
    // Additional checks for reasonable email format
    const [localPart, domain] = email.split('@');
    
    // Check local part (before @)
    if (localPart.length < 2 || localPart.length > 64) {
      return false;
    }
    
    // Check domain (after @)
    if (domain.length < 4 || domain.length > 253) {
      return false;
    }
    
    // Check if domain has at least one dot and reasonable TLD
    const domainParts = domain.split('.');
    if (domainParts.length < 2) {
      return false;
    }
    
    // Check TLD (top-level domain) length
    const tld = domainParts[domainParts.length - 1];
    if (tld.length < 2 || tld.length > 6) {
      return false;
    }
    
    // Check if TLD contains only letters
    if (!/^[a-zA-Z]+$/.test(tld)) {
      return false;
    }
    
    return true;
  };

  const saveInquiry = async (e) => {
    e.preventDefault();
    
    // Email validation
    if (!isValidEmail(email)) {
      alert('올바른 이메일 형식을 입력해주세요.');
      return;
    }
    
    try{
      await axios.post("http://10.125.121.173:8080/api/member/inquiry", {
        name: name,
        organization: organization,
        phone: formatPhoneNumber(phone),
        email: email,
        title: title.trim(),
        content: content.trim()
      },
     {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // 이게 중요
        "Content-Type": "application/json"
        }
      });
      alert('분석문의가 제출되었습니다.')
      navigate(-1);
    } catch(err){
      console.error("saveInquiry err", err, err.response);
      setError("요청제출 중 오류가 발생했습니다. ")
    }
  }

  return (
    <div className="request-bg">
      <div className="request-card">
        <div className="request-header">
          <div className="request-label">Analysis inquiry</div>
          <div className="request-title">분석 문의하기</div>
          <div className="request-desc">문의할 내용을 입력해주세요.</div>
        </div>
        <form id="inquiryForm" className="form-body" onSubmit={saveInquiry}>
          <div className="form-row">
            <input type="text" value={name} onChange={e=> setName(e.target.value.trim())}
                name="name" placeholder="성함" className="input-box" />
            <input type="text" value={organization}  onChange={e=> setOrganization(e.target.value.trim())}
                  name="company" placeholder="기관/회사명" className="input-box" />
          </div>
          <div className="form-row">
            <input type="number" value={phone}  onChange={e=> setPhone(e.target.value.trim())}
                  name="contact" placeholder="연락처(숫자만 입력)" className="input-box" />
            <input  type="email"  value={email}  onChange={e=> setEmail(e.target.value.trim())} 
                  name="email" placeholder="이메일" className="input-box" />
          </div>
          <div className="form-column">
            <input type="text"  value={title}  onChange={e=> setTitle(e.target.value)} 
                  name="subject" placeholder="제목" className="input-box full-width" />
            <textarea value={content}  onChange={e=> setContent(e.target.value)} 
                    name="content" placeholder="문의 내용" className="textarea-box"></textarea>
          </div>
          <div className="form-actions">
            <button type="button" className="btn cancel" onClick={()=>navigate(-1)}>취소</button> 
            <button type="submit" className="btn submit">제출</button>
            {/* <button type="submit" className="btn submit" onClick={()=>navigate(-1)}>제출</button> */}
          </div>
          {error && <div className="form-error">{error}</div>}
        </form>
      </div>
    </div>
  )
}
