import './styles/MyRequestList.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoIosArrowForward } from "react-icons/io";
// import Prev from './Prev';
import NavBar from './NavBar';

export default function MyRequestList() {
    const [list, setList] = useState([]);
    const navi = useNavigate();
    const [name, setName] = useState(localStorage.getItem("username") || ""); // 초기값 설정
    
    useEffect(()=>{
        const getMyList = async() => {
            try{
                const res = await axios.get("http://10.125.121.173:8080/api/member/inquiry", 
                    {
                    headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // 이게 중요
                    "Content-Type": "application/json"
                    }
                    }
                );
                setList(Array.isArray(res.data) ? res.data : []);
            } catch(err){
                console.error("getMyList err: ",err, err.response)
            }
        }

        getMyList();
    },[]);

    useEffect(() => {
        const handleStorageChange = () => {
            setName(localStorage.getItem("username") || "");
        };
    
        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("usernameChanged", handleStorageChange);
    
        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("usernameChanged", handleStorageChange);
        };
    }, []);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}.${mm}.${dd}`;
    }

    const formatStatus = (status) =>{
        switch(status){
            case "UNCHECKED": return "미확인";
            case "APPROVED": return "승인";
            case "IN_PROGRESS": return "진행중";
            case "COMPLETED": return "완료";
            case "REJECTED": return "거절";
            default: return status;
        }
    }

    // 페이지 이동
    const handleRowClick = (id) => {
        navi(`/request/${id}`);
    }

    return (

        
        <div className="mypage-container">
            <NavBar/>

            <div className="profile-section" style={{marginTop: '100px'}}>
                <button className="profile-name" onClick={()=>{navi("/mypage/edit")}}>
                    <span style={{color: '#01C2FD'}}>{name}</span> 님<IoIosArrowForward/>
                </button>
                {/* <Prev/> */}
            </div>

            <section className="inquiry-section">
                <h2 className="inquiry-title" style={{fontSize: '17px', fontWeight:'600', marginBottom:'13px'}}>문의목록</h2>

            <div className="inquiry-list">
                            {list.map(item => (
                                <div className="inquiry-card" key={item.inquiryId} onClick={()=>handleRowClick(item.inquiryId)}>
                                    <div className="inquiry-row">
                                        <div className={`inquiry-badge ${item.status.toLowerCase()}`}>{formatStatus(item.status)}</div>
                                        <div className="inquiry-title">{item.title}</div>
                                        <div className="inquiry-meta">
                                            <span>{item.organization}</span>
                                            <span>{formatDate(item.inquiryDate)}</span>
                                        </div>
                                    </div>
                                    <span className="inquiry-arrow"><IoIosArrowForward /></span>
                                </div>
                            ))}
                            {list.length === 0 && <div className="inquiry-empty">조회 결과가 없습니다.</div>}
                        </div>
            </section>
           
           
        </div>
    
    )
}
