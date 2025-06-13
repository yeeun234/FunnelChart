import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, Legend, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Logo from '../src/img/Logo.svg';
import "./styles/Funnel.css";

// 결제수단별 색상
const paymentColors = {
  credit_card: '#56b4e9',
  boleto: '#009e73',
  voucher: '#f0e442',
  debit_card: '#cc79a7',
};

const descriptions = {
  credit_card: "신용카드 결제는 승인까지 이탈이 거의 없으나, 배송 단계에서 이탈률이 급증합니다. 배송 지연, 결제 승인 후 번복, 신뢰 문제 등이 shipped 단계 이탈의 주요 원인일 수 있습니다.",
  boleto: "Boleto 결제는 결제 완료까지 고객 이탈이 적으나, 배송 단계에서 이탈률이 크게 오릅니다. 이는 boleto 특성상 결제 미완료, 결제 지연, 혹은 배송 전 결제 포기 사례가 많기 때문일 수 있습니다.",
  voucher: "Voucher 결제는 승인 이후부터 이탈률이 빠르게 증가하며, 배송 단계에서 최고치에 도달합니다. 프로모션 사용 후 구매 포기, 쿠폰 조건 미충족 등이 주요 원인일 수 있습니다.",
  debit_card: "직불카드는 승인까지 이탈이 적지만, 배송 단계에서 이탈률이 크게 오릅니다. 결제 실패, 잔고 부족, 배송 문제 등이 이 구간의 주요 이탈 요인으로 보입니다.",
};

const paymentNames = {
  credit_card: "신용카드",
  boleto: "계좌이체",
  voucher: "바우처",
  debit_card: "체크카드",
};

const apiEndpoints = {
  overall: "http://10.125.121.173:8080/api/public/funnel/overall",
  credit_card: "http://10.125.121.173:8080/api/public/funnel/credit_card",
  boleto: "http://10.125.121.173:8080/api/public/funnel/boleto",
  voucher: "http://10.125.121.173:8080/api/public/funnel/voucher",
  debit_card: "http://10.125.121.173:8080/api/public/funnel/debit_card",
};

export default function FunnelPage() {
  const [selectedPayment, setSelectedPayment] = useState('credit_card');
  const [activeTab, setActiveTab] = useState('table');
  const [overallData, setOverallData] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [funnelStages, setFunnelStages] = useState([]);
  const [allPaymentsData, setAllPaymentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 전체 데이터와 결제수단별 데이터 모두 미리 fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 전체 데이터
        const overallRes = await axios.get(apiEndpoints.overall);
        setOverallData(overallRes.data.data[0]);
        setFunnelStages(overallRes.data.funnel_stages);

        // 결제수단별 데이터
        const paymentsData = await Promise.all(
          Object.keys(paymentColors).map(type => axios.get(apiEndpoints[type]))
        );
        const allData = paymentsData.map(res => res.data.data[0]);
        setAllPaymentsData(allData);

        // 기본 선택 결제수단 데이터
        setSelectedData(allData.find(d => d.payment_type === selectedPayment));
        setLoading(false);
      } catch (err) {
        setOverallData(null);
        setAllPaymentsData([]);
        setSelectedData(null);
        setFunnelStages([]);
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  // 결제수단 선택 시 해당 데이터로 갱신
  useEffect(() => {
    if (allPaymentsData.length > 0) {
      setSelectedData(allPaymentsData.find(d => d.payment_type === selectedPayment));
    }
  }, [selectedPayment, allPaymentsData]);

  if (loading || !overallData || !selectedData || funnelStages.length === 0) return <div>Loading...</div>;

  // BarChart 데이터: 전체 + 선택 결제수단
  const barChartData = funnelStages.map((stage, idx) => ({
    stage,
    overall: overallData.count[idx],
    selected: selectedData.count[idx],
  }));

  // LineChart 데이터: 결제수단별 이탈률(%) 모두 겹치기
  const paymentTypes = Object.keys(paymentColors);
  const lineChartData = funnelStages.map((stage, idx) => {
    const obj = { stage };
    paymentTypes.forEach(type => {
      const paymentObj = allPaymentsData.find(d => d.payment_type === type);
      obj[type] = paymentObj ? Number(paymentObj.churn_rates[idx]) : null; // *100: % 변환
    });
    return obj;
  });

  // 1. 모든 결제수단의 모든 구간에서 최대값 찾기
  const allRates = [];
  lineChartData.forEach(row => {
    Object.keys(paymentColors).forEach(type => {
      if (typeof row[type] === "number") allRates.push(row[type]);
    });
  });
  const maxRate = Math.max(...allRates); // 예: 4.2

  // 2. 80% 높이에 오도록 Y축 최대값 계산
  const yAxisMax = Math.ceil(maxRate / 0.8);

  // 3. YAxis에 적용
  <YAxis domain={[0, yAxisMax]} tickFormatter={tick => `${tick}%`} />


  return (
    <div className='appContainer'>
      {/* Navigation */}
      <nav className="nav">
        <Link to="/" className="logoRow">
          <img src={Logo} alt="logo" className="logoImg" />
          <span className="projectName">UserFlow</span>
        </Link>
        <div className="navLinks">
          <Link to="/login"><div className="navLink">로그인</div></Link>
          <Link to="/bar"><div className="navLink">고객재주문율 분석</div></Link>
          <div className="navLink" style={{ color: "#01C2FD" }}>고객이탈률 분석</div>
          <Link to="/"><div className="navLink">프로젝트 소개</div></Link>
        </div>
      </nav>

      <div style={{ padding: "24px 0 0 0", color: "#444", fontSize: 22, fontWeight: "bold", display: "flex", alignItems: "left" }}>
        결제수단에 따라 프로세스 어느 지점에서 고객여정이 중단되는가?
      </div>

      {/* 결제수단 버튼 */}
      <div style={{ width: '100vw', display: "flex", alignItems: "center", gap: 16, margin: "32px 0 0 40px" }}>
        {paymentTypes.map(type => (
          <button
            key={type}
            onClick={() => setSelectedPayment(type)}
            style={{
              padding: "8px 18px",
              borderRadius: 20,
              border: type === selectedPayment ? `2px solid ${paymentColors[type]}` : "2px solid #ddd",
              background: type === selectedPayment ? paymentColors[type] : "#fff",
              color: type === selectedPayment ? "#fff" : "#222",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: 16,
              boxShadow: type === selectedPayment ? "0 2px 8px rgba(0,0,0,0.07)" : "none"
            }}
          >
            {paymentNames[type]}
          </button>
        ))}
      </div>

      {/* 차트 영역 */}
      <div style={{ display: "flex", gap: 32, justifyContent: "center", margin: "32px 0" }}>
        {/* BarChart */}
        <div style={{ width: "50vw", height: "50vh" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              layout="vertical"
              margin={{ top: 20, right: 20, left: 40, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="stage" type="category" />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="overall"
                name="전체"
                barSize={20}
                fill="#ccc"
                activeBar={<Rectangle fill="yellow" stroke="blue" />}
              />
              <Bar
                dataKey="selected"
                name={paymentNames[selectedPayment]}
                barSize={20}
                fill={paymentColors[selectedPayment]}
                activeBar={<Rectangle fill="pink" stroke="red" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* LineChart */}
        <div style={{ width: "50vw", height: "50vh" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={lineChartData}
              margin={{ top: 20, right: 20, left: 40, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis domain={[0, yAxisMax]} tickFormatter={tick => `${tick}%`} />
              <Tooltip formatter={v => `${v}%`} />
              <Legend formatter={(value) => paymentNames[value] || value}  />
              {paymentTypes.map(type => (
                <Line
                  key={type}
                  type="monotone"
                  dataKey={type}
                  stroke={paymentColors[type]}
                  strokeWidth={type === selectedPayment ? 4 : 2}
                  opacity={type === selectedPayment ? 1 : 0.3}
                  dot={type === selectedPayment}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table/Description Tabs */}
      <div style={{ background: "#fff", borderRadius: 12, margin: "0 auto", padding: 32 }}>
        <div className='logoRow'>
          <div
            style={{
              fontWeight: "bold",
              cursor: "pointer",
              color: activeTab === 'table' ? "#01C2FD" : "#444",
              borderBottom: activeTab === 'table' ? "2px solid #01C2FD" : "none",
              marginRight: 16
            }}
            onClick={() => setActiveTab('table')}
          >
            차트
          </div>
          <div
            style={{
              fontWeight: "bold",
              cursor: "pointer",
              color: activeTab === 'description' ? "#01C2FD" : "#444",
              borderBottom: activeTab === 'description' ? "2px solid #01C2FD" : "none"
            }}
            onClick={() => setActiveTab('description')}
          >
            설명
          </div>
        </div>
        {activeTab === 'table' ? (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15, tableLayout: "fixed" }}>
            <thead>
              <tr style={{ background: "#f6f7fa" }}>
                <th style={{ padding: "8px 4px", textAlign: "center" }}>결제수단</th>
                {funnelStages.map(stage => (
                  <th key={stage} style={{ padding: "8px 4px" }}>{stage}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "8px 4px", fontWeight: "bold" }}>{paymentNames[selectedPayment]}</td>
                {selectedData.count.map((cnt, idx) => (
                  <td key={idx} style={{ padding: "8px 4px" }}>{cnt}</td>
                ))}
              </tr>
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "24px 0 0 0", color: "#444", fontSize: 16, fontWeight: "bold" }}>
            {descriptions[selectedPayment]}
          </div>
        )}
      </div>
    </div>
  );
}
