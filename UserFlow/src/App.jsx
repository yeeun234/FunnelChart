import { Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import About from './About';
import Login from './Login';
import JoinUs from "./JoinUs";
import Funnel from "./Funnel";
import CustomerBehavior from "./CustomerBehavior";
//import Bar from "./DeliveryAnalysis";
import DeliveryAnalysis from "./DeliveryAnalysis";
import StatisticsDashboard from "./StatisticsDashboard";
import AllRequestList from "./AllRequestList";
import Request from "./Request";
import MyRequestList from "./MyRequestList";
import RequestDetail from "./RequestDetail";
import Edit from "./EditMember.jsx"




function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<About />} />
      <Route path="/join" element={<JoinUs />} />
      <Route path="/funnel" element={<Funnel />} />
      <Route path="/delivery" element={<DeliveryAnalysis />} />
      <Route path="/customerBehavior" element={<CustomerBehavior />} />
      <Route path="/dashboard" element={<StatisticsDashboard />} />
      <Route path="/manager" element={<AllRequestList/>}/>
      <Route path="/request" element={<Request/>} />
      <Route path="/mypage" element={<MyRequestList/>} />
      <Route path="/manager/request" element={<AllRequestList/>} />
      <Route path="/request/:id" element={<RequestDetail/>} />
      <Route path="/mypage/edit" element={<Edit/>} />
      


      {/* <Route path="/bar" element={<Bar />} /> */}
      
    </Routes>
  );
}

export default App;