import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/RequestDetail.css'
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
export default function RequestDetail() {
    const {id} = useParams(); 
    const role = localStorage.getItem("userRole");
    const [detail, setDetail] = useState({});
    const [status, setStatus] = useState([]);
    const[selected, setSelected] = useState("");
    const [showComment, setShowComment] = useState(false);
    const [comment, setComment] = useState("");
    const [showHistory, setShowHistory] = useState(false);
    const [completed, setCompleted] = useState(false); // 데이터 재요청시 완료버튼xx
    const navi = useNavigate();
    const selectRef = useRef();
    const commentRef = useRef();

    // 권한별 상세목록 받기 __ 멤버는 유저아이디도 체크해서 다름, 상태리스트
    const getDetail = async() => {
            try{
                if(role === 'ROLE_MEMBER'){
                    const res = await axios.get(`http://10.125.121.173:8080/api/member/inquiry/${id}`,
                        {
                        headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        "Content-Type": "application/json"
                        }
                        })
                    setDetail(res.data)
                } else if(role === 'ROLE_MANAGER'){
                    const res = await axios.get(`http://10.125.121.173:8080/api/manager/inquiry/${id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("accessToken")}`, 
                                "Content-Type": "application/json"
                            }
                        })
                    const list = await axios.get('http://10.125.121.173:8080/api/inquiry/status-list')  // 드롭다운 상태리스트
                    setDetail(res.data);
                    setStatus(list.data);
                    setSelected(res.data.status);
                    console.log("상태확인: ", res.data.status)
                }
            } catch(err){
                console.error("getDetail err", err, err.response);
            }
        }
   
    
    useEffect(()=>{
        getDetail();
        if(role === 'ROLE_MEMBER'){
            setCompleted(true);
        }
    }, [])


    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}.${mm}.${dd}`;
    }

     const formatStatus = (status) =>{
        switch(status){
            case "UNCHECKED": 
                return "미확인";
            case "APPROVED": 
                return "승인";
            case "IN_PROGRESS": 
                return "진행중";
            case "COMPLETED":
                return "완료";
            case "REJECTED":
                return "거절";
            default:
                return status;
        }
    }

    // 마운트되면 select 포커스
    useEffect(()=>{
        if(selectRef.current){
            selectRef.current.focus();
        }
    },[])

    // 드롭다운 상태 선택시
    const handleStatusChange = (e) => {
        console.log(e.target.value)
        setSelected(e.target.value);
        setShowComment(true);
    }

    // 빈화면 누르면 comment박스 사라짐
    useEffect(()=>{
        function handleClickOutside(e){
            if(commentRef.current && !commentRef.current.contains(e.target) && comment.trim() === ""){  // commnetRef영역 안인가, 박스 위부를 눌렀는가, 코멘트 비어있는가
                setShowComment(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {  // 컴포넌트 사라질 때 직접 제거 필요
            document.removeEventListener("mousedown", handleClickOutside);
        };
    },[comment])

    
    const updateDetail = async()=>{
        try{
            console.log("보내는 status 값:", selected);
            try{
                await axios.post(`http://10.125.121.173:8080/api/manager/inquiry/${id}/status`,
                            {
                                status: selected,
                                comment: comment.trim()
                            },
                            {
                            headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                            "Content-Type": "application/json"
                            }
                            });
                alert('상태가 수정되었습니다.');

                // 상태 갱신
                await getDetail();
                setShowComment(false);
                setCompleted(true); // 완료 후에는 '완료'버튼 안뜨게
            } catch (err){
                console.error("updateDetail err: ", err)
            }
        } catch(err){
            console.error("updateDetail err: ", err, err.response);
        }
        
        // navi(-1);
    }
    

  return (
    <div className="request-detail-bg" >
      <div className="request-detail-nocard">
        <div className="request-detail-header">
          <div className="request-detail-title">문의 상세보기</div>
        </div>
        <div className="form-grid">
            <div className='info-section'>
                <span className='info'>이름</span>
                <input disabled value={detail.name} className="form-input" placeholder="성함" />
            </div>
            <div className='info-section'>
                <span className='info'>기관명</span>
                <input disabled value={detail.organization} className="form-input" placeholder="기관/회사명" />
            </div>
            <div className='info-section'>
                <span className='info'>연락처</span>
                <input disabled value={detail.phone} className="form-input" placeholder="연락처" />
            </div>
            <div className='info-section'>
                <span className='info'>이메일</span>
                <input disabled value={detail.email} className="form-input" placeholder="이메일" />
            </div>
          </div>
          <div className="form-divider"></div>
          <div>
            {role === 'ROLE_MANAGER' ? 
                <div className='input-section'>
                <select className='status-dropdown' ref={selectRef} value={selected} onChange={(e) => handleStatusChange(e)}>
                    {status.map((status) => (
                        <option key={status} value={status}>
                            {formatStatus(status)}
                        </option>
                    ))}
                </select>
                {showComment && (
                    <div className="comment-section" ref={commentRef}>
                        <textarea
                                id='comment-box'
                            placeholder="상담 코멘트를 작성하세요"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="comment-box"
                        />
                    </div>
                )}
                </div>
            :
            //   optional Changing 
                <div className={`inquiry-label ${detail.status?.toLowerCase()}`}>{formatStatus(detail.status)}</div> } 
            <div>
                <span className="form-title-input"> {detail.title}</span>
                <span className="form-date"> {formatDate(detail.inquiryDate)}</span>
            </div>
        </div>
        <textarea disabled value={detail.content} className="form-textarea" placeholder="문의 내용" />
        {detail.history != null && (
        <div className="history-section">
            <div className="history-header" onClick={() => setShowHistory(!showHistory)}>
            상담 기록
            <span className="toggle-arrow">{showHistory ? <IoIosArrowUp/> : <IoIosArrowDown/>}</span>
            </div>

            {showHistory && (
            <table className="history-table">
                <thead>
                <tr>
                    <th>상태</th>
                    <th>상담 내용</th>
                    <th>날짜</th>
                </tr>
                </thead>
                <tbody>
                {detail.history.map((h, idx) => (
                    <tr key={idx}>
                    <td>{h.status}</td>
                    <td>{h.comment}</td>
                    <td>{formatDate(h.modifiedAt)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            )}
        </div>
        )}
        <div className="button-group">
          <button className="cancel-btn" onClick={()=>navi(-1)}>이전</button>
          {!completed && (
              <button className="confirm-btn" onClick={()=>updateDetail()}>완료</button>
          )}
        </div>
      </div>
    </div>
  )
}
