import { useNavigate } from 'react-router-dom';
import './styles/Prev.css';

export default function Prev() {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1); // Navigates to the previous page in history
    };

    return (
        <button className="prev-button" onClick={goBack}>
            이전
        </button>
    );
} 