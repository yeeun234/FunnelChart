import React, { useState, useEffect, useRef } from 'react'
import './styles/EditMember.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EditMember() {
    const [info, setInfo] = useState([]);
    const [showPasswordChange, setShowPasswordChange] = useState(false)
    
    const [name, setName] = useState('')
    const [memberId, setMemberId] = useState('') 
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [pwdValid, setPwdValid] = useState(false);    // 비밀번호 변경 유효성검사
    
    
    const MIN_PW_LENGTH = 8;
    const navi = useNavigate();
    const btnRef = useRef();
    
    // 회원정보 가져오기
    useEffect(() => {
        const getInfo = async () => {
            try{
                    const res = await axios.get("http://10.125.121.173:8080/api/member/info",
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                                "Content-Type": "application/json"
                            }
                        }
                    );
            
            console.log("response data: ", res.data);
            setInfo(res.data);
            setName(res.data.username); // info.username xx
            setMemberId(res.data.id);
                
            } catch(err){
                console.error("getInfo err: ", err, err.response);
            }
        }
        getInfo();
    }, [])

    // 회원정보 수정 api
    const updateInfo = async()=>{
        try{
            const res = await axios.post("http://10.125.121.173:8080/api/member/update",
                {
                    username: name,
                    currentpwd: currentPassword,
                    newpwd: pwdValid ?  newPassword : undefined
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        "Content-Type": "application/json"
                    }
                }
            )
            // 성공시 응답 메시지
            alert(res.data); //회원정보가 수정되었습니다.
            localStorage.setItem("username", name); // 토큰 갱신
            window.dispatchEvent(new Event("usernameChanged")); // 커스텀 이벤트 발생
        } catch(err){
            if(err.response){
                alert(err.response.data)    // 비밀번호가 맞지 않습니다...+
            } else {
                alert("서버와 통신에 실패했습니다.")
            }
        }
    }

    function isValidPassword(pw) {
        // 8자 이상, 대문자, 소문자, 숫자, 특수문자 각각 하나 이상 포함
        const lengthCheck = pw.length >= MIN_PW_LENGTH;
        const upperCheck = /[A-Z]/.test(pw);
        const lowerCheck = /[a-z]/.test(pw);
        const numberCheck = /[0-9]/.test(pw);
        const specialCheck = /[!@#$%^&*(),.?":{}|<>_\-\\[\]\/~`+=;]/.test(pw);
        return lengthCheck && upperCheck && lowerCheck && numberCheck && specialCheck;
    }

    // 비밀번호 형식, 확인
    const handlePasswordChangeSubmit= (e) =>{
        e.preventDefault();

        // 같은 비번 변경x
        if(currentPassword == newPassword){
            alert('현재 비밀번호와 같은 비밀번호입니다.')
            return;
        }

        // 비밀번호 형식
        if (newPassword.length < MIN_PW_LENGTH) {
            alert(`비밀번호는 최소 ${MIN_PW_LENGTH}자 이상이어야 합니다.`);
            return;
        }
        if (!isValidPassword(newPassword)) {
            alert("비밀번호는 8자 이상, 대/소문자, 숫자, 특수문자를 모두 포함해야 합니다.");
            return;
        }

        // 비밀번호 확인
        if (newPassword !== confirmPassword) {
            alert('새 비밀번호가 일치하지 않습니다.')
            return;
        }

        setPwdValid(true);
        alert('변경가능한 비밀번호입니다.')
    }


    // 회원정보 수정
    const handleFormSubmit = (e) => {
        e.preventDefault()

        if(currentPassword && !pwdValid){   // !:  빈 문자열이거나 undefined, null
            alert("비밀번호 확인을 먼저 진행해주세요.");
            btnRef.current.focus(); // ?.(옵셔널 체이닝): 앞에 요소가 있을때 뒤를 실행
            return;
        }

        console.log('회원정보 수정:', { name })
        console.log('비밀번호 수정: ', `${ currentPassword} -> ${newPassword}`)
        
        updateInfo();
        navi(-1);
    }

    // 회원 탈퇴하기
    const handleWithdraw = async (e)=>{
        const confirmed = window.confirm("정말 탈퇴하시겠습니까?");
        if (!confirmed) return; // 취소 누르면 아무것도 안함

        try{
            const res = await axios.post("http://10.125.121.173:8080/api/member/delete",{},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            alert("회원 탈퇴가 완료되었습니다.");
            // 토큰 삭제 및 로그인 페이지로 이동 등
            localStorage.removeItem("accessToken");
            navi("/login");
        } catch(err){
            console.error("handleWithdraw err: ", err, err.response)
            alert("탈퇴 요청 중 오류가 발생했습니다.");
        }
    }


    return (
        <div className='member-edit-container'>
            <form onSubmit={handleFormSubmit} className='edit-form'>
                <div className='member-edit-header'>
                    <h2 className='member-edit-title'>회원정보 수정</h2>
                </div>

                <div className='member-edit-body'>
                    <div className='form-group'>
                        <label htmlFor='name' className='form-label'>이름</label>
                        <div className='input-wrapper'>
                            <input
                                type='text'
                                id='name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className='form-input'
                            />
                        </div>
                    </div>

                    <div className='form-group'>
                        <label className='form-label'>아이디</label>
                        <div className='input-wrapper'>
                            <div className='static-info'>{memberId}</div>
                        </div>
                    </div>

                    <div className='form-group'>
                        <label className='form-label'>비밀번호</label>
                        <div className='input-wrapper'>
                            {!showPasswordChange ? (
                                <div className='password-placeholder'>
                                    <input type="password" placeholder='●●●●●●●●' disabled className='form-input' />
                                    <button type="button" onClick={() => setShowPasswordChange(true)} className='toggle-pw-btn'>
                                        비밀번호 변경
                                    </button>
                                </div>
                            ) : (
                                <div className='password-change-section' >
                                    <div className='password-current'>
                                        <input
                                            type="password"
                                            placeholder="현재 비밀번호"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className='form-input'
                                        />
                                        <button type="button" onClick={() => setShowPasswordChange(false)} className='toggle-pw-btn cancel'>
                                            변경 취소
                                        </button>
                                    </div>
                                    <div className='password-new'>
                                        <input
                                            type="password"
                                            placeholder="새로운 비밀번호"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className='form-input'
                                        />
                                        <p className="password-hint">비밀번호는 8자 이상, 대/소문자, 숫자, 특수문자를 모두 포함</p>
                                    </div>
                                    <div className='password-confirm'>
                                        <input
                                            type="password"
                                            placeholder="새로운 비밀번호 확인"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className='form-input'
                                        />
                                    </div>
                                    <button type="button" onClick={handlePasswordChangeSubmit} className='submit-pw-btn' ref={btnRef}>
                                        비밀번호 확인
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-footer">
                    <a className="withdraw-link" onClick={()=> handleWithdraw()}>회원 탈퇴하기</a>
                </div>

                <div className='form-actions'>
                    <button type="button" className='cancle-btn' onClick={()=>{navi(-1)}}>취소</button>
                    <button type="submit" className='confirm-btn'>확인</button>
                </div>
            </form>
        </div>
    )
}
