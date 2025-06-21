import './styles/AllRequestList.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoIosArrowForward } from "react-icons/io";
import Prev from './Prev';

export default function AllRequestList() {
    const [list, setList] = useState([]);
    const [status, setStatus] = useState('전체');
    const navi = useNavigate();

    useEffect(()=>{
        const getAllList = async() =>{
            try{
                const res = await axios.get("http://10.125.121.173:8080/api/manager/inquiry",
                    {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        "Content-Type": "application/json"
                    }
                    }
                );
                setList(res.data);
            } catch(err){
                console.error("getAllList err: ", err, err.response)
            }
        }
        getAllList();
    },[])

    const handleRowClick = (id) => {
        navi(`/request/${id}`);
    }

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

    // status 필터링
    const filteredList = list.filter(item =>
        status === '전체' ? true : item.status === status
    );

    // status 옵션
    const statusOptions = [
        { value: '전체', label: '전체' },
        { value: 'APPROVED', label: '승인' },
        { value: 'UNCHECKED', label: '미확인' },
        { value: 'IN_PROGRESS', label: '진행중' },
        { value: 'COMPLETED', label: '완료' },
        { value: 'REJECTED', label: '거절' },
    ];

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("username");
        alert("로그아웃 되었습니다.");
        navi("/login");
    };

    return (
        <>
            <div className="inquiry-wrapper">
                <div className="inquiry-header">
                    <h2 className="inquiry-title">
                        요청받은 문의 <span className="inquiry-count">({filteredList.length})</span>
                    </h2>
                    <div className="inquiry-header-button">    
                    <select className="inquiry-status-dropdown" value={status} onChange={e=>setStatus(e.target.value)}>
                        {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <Prev />
                    </div>
                </div>
                <div className="inquiry-list">
                    {filteredList.map(item => (
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
                    {filteredList.length === 0 && <div className="inquiry-empty">조회 결과가 없습니다.</div>}
                </div>
            </div>
        </>
    )
}
