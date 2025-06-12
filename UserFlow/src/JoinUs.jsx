import { useRef, useEffect ,useState  } from "react";
import { Link } from 'react-router-dom';
import Logo from '../src/img/Logo.svg';
import "./styles/Funnel.css";

function JoinUs() {
  
  const inputRef = useRef(null);
  console.log(inputRef.current)
  useEffect(() => {
    console.log(inputRef.current)
    inputRef.current && inputRef.current.focus();
  }, []);
  

  return (
    <div className="appContainer"  >
      
      <nav className="nav" style={{width:"1280px"}} >
        <Link to="/" className="logoRow">
          <img src={Logo} alt="UserFlow Logo" className="logoImg" />
          <span className="projectName">UserFlow</span>
        </Link>
        <div className="navLinks">
                    <Link to="/login">
                      <div className="navLink" style={{ color: "#01C2FD" }}>
                        LOGIN
                      </div>
                    </Link>
                    <Link to="/funnel">
                      <div className="navLink" >
                        WORK
                      </div>
                    </Link>
                    <Link to="/">
                      <div className="navLink">
                        ABOUT
                      </div>
                    </Link>
        </div>
      </nav>
      <div>
        <main>
          <section style={{  padding: "60px 0" }}>
            <form style={{ maxWidth: 600, margin: "0 auto" }}>
              <h2 style={{ textAlign: "center", fontWeight: "bold", marginBottom: 40 }}>회원가입</h2>
              <hr style={{ marginBottom: 40, border: "none", borderTop: "1px solid #bbb" }} />
              <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 20px" }}>
                <tbody style={{textAlign: "left"}}>
                  <tr>
                    <td style={{ width: 120, textAlign: "left", fontWeight: "bold" }}>이름</td>
                    <td>
                      <input ref={inputRef} type="text" style={{ width: "100%", padding: "10px", border: "1px solid #eee", borderRadius: 6 }} />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>아이디</td>
                    <td style={{ display: "flex", gap: 8 }}>
                      <input  type="text" style={{ flex: 1, padding: "10px", border: "1px solid #eee", borderRadius: 6 }}/>
                      <button type="button" style={{
                        padding: "10px 16px",
                        border: "1px solid #ccc",
                        borderRadius: 6,
                        background: "#fff",
                        fontWeight: "bold",
                        cursor: "pointer"
                      }}>중복확인</button>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: "bold" }}>비밀번호</td>
                    <td>
                      <input type="password" style={{ width: "100%", padding: "10px", border: "1px solid #eee", borderRadius: 6 }} />
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
                    <td style={{fontWeight: "bold" }}>비밀번호 확인</td>
                    <td>
                      <input type="password" style={{ width: "100%", padding: "10px", border: "1px solid #eee", borderRadius: 6 }} />
                    </td>
                  </tr>
                </tbody>
              </table>
              <hr style={{ margin: "40px 0 24px 0", border: "none", borderTop: "1px solid #bbb" }} />
              <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
                <Link to ="/login" style={{
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
    </div>
  );
}

export default JoinUs;
