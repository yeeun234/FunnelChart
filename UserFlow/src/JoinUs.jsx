import { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./styles/Funnel.css";

function JoinUs() {

  const inputRef = useRef(null);
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const navigate = useNavigate();
  const MIN_ID_LENGTH = 4;      // 예: 아이디 최소 4자
  const MIN_PW_LENGTH = 8;      // 예: 비밀번호 최소 8자
  const MIN_NAME_LENGTH = 2;    // 이름 최소 2자
  const isLoggedIn = !!localStorage.getItem("accessToken");


  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);

  function isValidPassword(pw) {
  // 8자 이상, 대문자, 소문자, 숫자, 특수문자 각각 하나 이상 포함
  const lengthCheck = pw.length >= 8;
  const upperCheck = /[A-Z]/.test(pw);
  const lowerCheck = /[a-z]/.test(pw);
  const numberCheck = /[0-9]/.test(pw);
  const specialCheck = /[!@#$%^&*(),.?":{}|<>_\-\\[\]\/~`+=;]/.test(pw);
  return lengthCheck && upperCheck && lowerCheck && numberCheck && specialCheck;
}

  function isValidId(id) {
    // 영어와 숫자만 허용하고 최소 4자 이상
    const englishAndNumberOnly = /^[a-zA-Z0-9]+$/.test(id);
    const lengthCheck = id.length >= MIN_ID_LENGTH;
    return englishAndNumberOnly && lengthCheck;
  }

  function isValidName(name) {
    // 이름은 최소 2자 이상
    return name.length >= MIN_NAME_LENGTH;
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!isValidName(username)) {
      alert(`이름은 최소 ${MIN_NAME_LENGTH}자 이상이어야 합니다.`);
      return;
    }
    
    if (!isValidId(id)) {
      alert(`아이디는 영어와 숫자만 사용 가능하며, 최소 ${MIN_ID_LENGTH}자 이상이어야 합니다.`);
      return;
    }
    
    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (password.length < MIN_PW_LENGTH) {
      alert(`비밀번호는 최소 ${MIN_PW_LENGTH}자 이상이어야 합니다.`);
      return;
    }
    if (!isValidPassword(password)) {
      alert("비밀번호는 8자 이상, 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다.");
      return;
    }
    try {
      // 1. 회원가입 요청
      await axios.post('http://10.125.121.173:8080/auth/signup', {
        username: username,
        id: id,
        password: password,
      });
      
      alert('회원가입이 완료되었습니다! 자동으로 로그인합니다.');

      // 2. 바로 로그인 처리
      const loginRes = await axios.post('http://10.125.121.173:8080/login', {
        id: id,
        password: password
      });

      const token = loginRes.headers.authorization;
      const role = loginRes.data.role;
      const resUsername = loginRes.data.username;

      if (token) {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userRole", role);
        localStorage.setItem("username", resUsername);
        
        // 3. 메인 페이지로 이동
        navigate("/"); 
      } else {
        // 혹시 모를 예외 처리
        alert("로그인에 실패했습니다. 로그인 페이지로 이동합니다.");
        navigate("/login");
      }

    } catch (error) {
      // 에러 처리
      console.error("회원가입 또는 자동 로그인 실패:", error);
      if (error.response && error.response.status === 409) { // 예: ID 중복 에러
        alert("이미 사용 중인 아이디입니다.");
      } else {
        alert('회원가입 중 오류가 발생했습니다.');
      }
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  const DuplicationCheck = async (e) => {
    e.preventDefault();
    if (!id) {
      alert("아이디를 입력하세요.");
      return;
    }
    if (!isValidId(id)) {
      alert(`아이디는 영어와 숫자만 사용 가능하며, 최소 ${MIN_ID_LENGTH}자 이상이어야 합니다.`);
      return;
    }
    try {
      //id를 백엔드로 전달
      const response = await axios.post('http://10.125.121.173:8080/idcheck?id=' + id, {
        id: id
      });
      // 응답값 분기
      if (response.data.available) {
        alert(response.data.message);
      } else {
        alert(response.data.message);
      }


    } catch (error) {
      // 에러 처리
      alert('중복확인 중 오류가 발생했습니다.');
    }
  };


  return (
    <div >
      <main>
        <section>
          
          <form style={{ maxWidth: 600, margin: "0 auto" }} onSubmit={handleSignup}>
            <h2 style={{ textAlign: "center", fontWeight: "bold", marginBottom: 40 }}>회원가입</h2>
            <hr style={{ marginBottom: 40, border: "none", borderTop: "1px solid #bbb" }} />
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 20px" }}>
              <tbody style={{ textAlign: "left" }}>
                <tr>
                  <td style={{ width: 120, textAlign: "left", fontWeight: "bold" }}>이름</td>
                  <td>
                    <input
                      ref={inputRef}
                      type="text"
                      style={{ width: "100%", padding: "10px", border: "1px solid #eee", borderRadius: 6 }}
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>아이디</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      style={{ flex: 1, padding: "10px", border: "1px solid #eee", borderRadius: 6 }}
                      value={id}
                      onChange={e => setId(e.target.value)}
                    />
                    <button type="button" style={{
                      padding: "10px 16px",
                      border: "1px solid #ccc",
                      borderRadius: 6,
                      background: "#fff",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }} onClick={DuplicationCheck} >중복확인</button>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>비밀번호</td>
                  <td>
                    <input
                      type="password"
                      style={{ width: "100%", padding: "10px", border: "1px solid #eee", borderRadius: 6 }}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <div style={{
                      fontSize: "0.85rem",
                      color: "#bbb",
                      marginTop: 4,
                      letterSpacing: "1px"
                    }}>
                      비밀번호 조건: 8자 이상, 대/소문자, 숫자, 특수문자 포함
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: "bold" }}>비밀번호 확인</td>
                  <td>
                    <input
                      type="password"
                      style={{ width: "100%", padding: "10px", border: "1px solid #eee", borderRadius: 6 }}
                      value={passwordConfirm}
                      onChange={e => setPasswordConfirm(e.target.value)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <hr style={{ margin: "40px 0 24px 0", border: "none", borderTop: "1px solid #bbb" }} />
            <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
              <Link to="/login" style={{
                background: "#fff",
                color: "#222",
                border: "1px solid #bbb",
                borderRadius: 8,
                padding: "12px 40px",
                fontSize: 18,
                fontWeight: "bold",
                cursor: "pointer"
              }}>취소</Link>
              <button type="submit" className="joinBtn" style={{
                background: "#01C2FD",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px 40px",
                fontSize: 18,
                fontWeight: "bold",
                cursor: "pointer"
              }}>가입</button>
            </div>
          </form>
          
        </section>
      </main>
    </div>

  );
}

export default JoinUs;
