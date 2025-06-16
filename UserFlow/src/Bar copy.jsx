import React, { useState } from 'react';
import { FunnelChart, Funnel, Tooltip, LabelList, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { Link } from 'react-router-dom';
import mockData from './mockFunnelData';
import Logo from '../src/img/Logo.svg';
import "./styles/Funnel.css";
import NavBar from './NavBar';

// 결제수단별 색상
const paymentColors = {
  credit_card: '#56b4e9',
  boleto: '#009e73',
  voucher: '#f0e442',
  debit_card: '#cc79a7',
};

const descriptions = {
  credit_card: "Credit card payments are processed instantly and offer high convenience for customers.",
  boleto: "Boleto is a popular payment method in Brazil, allowing customers to pay via bank slips.",
  voucher: "Voucher payments are prepaid and often used in promotional campaigns.",
  debit_card: "Debit card payments are deducted directly from the customer's bank account.",
};

const subtitle = {
  a1 : "결제수단에 따라 프로세스 어느 지점에서 고객여정이 중단되는가?",
  a2 : "결제수단에 따라 충성 고객이 많은가, 이탈율이 높은가?"
}

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}
const stageOpacities = [1, 0.8, 0.6, 0.4, 0.25];

export default function Bar() {
  const [selectedPayment, setSelectedPayment] = useState('credit_card');
  const [activeTab, setActiveTab] = useState('table');
  const [activeAnalysisTab, setactiveAnalysisTab] = useState('a1');
  const data = mockData;

  // For demonstration, let's use the same payment type for both charts.
  // You can adapt this logic to compare different payment types if needed.
  const leftPayment = selectedPayment;
  const rightPayment = selectedPayment;

  // 전체 데이터와 결제수단별 데이터 추출
  const leftData = data.data.find(d => d.payment_type === leftPayment);
  const overallData = data.data.find(d => d.payment_type === "overall");
  const rightData = data.data.find(d => d.payment_type === rightPayment);

  const leftChartData = overallData
    ? data.funnel_stages.map((stage, idx) => ({
        stage,
        count: overallData.counts[idx],
      }))
    : [];

  const leftChartOverlapData = leftData
    ? data.funnel_stages.map((stage, idx) => ({
        stage,
        count: leftData.counts[idx]+300,
      }))
    : [];
    

  const rightChartData = rightData
    ? data.funnel_stages.map((stage, idx) => ({
        stage,
        count: rightData.counts[idx],
      }))
    : [];

  return (
    <div className='appContainer'>
     <NavBar></NavBar>

      
          <div style={{ padding: "24px 0 0 0", color: "#444", fontSize: 22, fontWeight:"bold", display:"flex" ,alignItems:"left"}}>
            결제수단에 따라 충성 고객이 많은가, 이탈율이 높은가?
          </div>
       

      <div style={{ width:'100vw', display: "flex", alignItems:"center", gap: 16, margin: "32px 0 0 40px" }}>
        {data.data
        .filter(payment => payment.payment_type !== "overall") 
        .map(payment => (
          <button
            key={payment.payment_type}
            onClick={() => setSelectedPayment(payment.payment_type)}
            style={{
              padding: "8px 18px",
              borderRadius: 20,
              border: payment.payment_type === selectedPayment ? `2px solid ${paymentColors[payment.payment_type]}` : "2px solid #ddd",
              background: payment.payment_type === selectedPayment ? paymentColors[payment.payment_type] : "#fff",
              color: payment.payment_type === selectedPayment ? "#fff" : "#222",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: 16,
              boxShadow: payment.payment_type === selectedPayment ? "0 2px 8px rgba(0,0,0,0.07)" : "none"
            }}
          >
            {payment.payment_type.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Side-by-side charts */}
      <div style={{ display: "flex", gap: 32, justifyContent: "center", margin: "32px 0" }}>
        {/* Left: Overlapped Funnel + Line */}
        <div style={{ position: 'relative', width: 400, height: 340 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip />
                <Funnel
                  data={leftChartOverlapData}
                  dataKey="count"
                  nameKey="stage"
                  isAnimationActive
                  animationDuration={500}
                  stroke={paymentColors[leftPayment]}
                >
                  {leftChartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`}
                      fill={hexToRgba(paymentColors[leftPayment]+10, stageOpacities[idx % stageOpacities.length])} />
                  ))}
                  <LabelList dataKey="count" position="inner" offset={10} />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip />
                <Funnel
                  data={leftChartData}
                  dataKey="count"
                  nameKey="stage"
                  isAnimationActive
                  animationDuration={500}
                  stroke={paymentColors[leftPayment]}
                >
                  {leftChartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`}
                      fill={hexToRgba(paymentColors[leftPayment], stageOpacities[idx % stageOpacities.length])} />
                  ))}
                  <LabelList dataKey="count" position="right" offset={10} />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Right: Pure Funnel */}
        <div style={{ width: 400, height: 340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip />
              <Funnel
                data={rightChartData}
                dataKey="count"
                nameKey="stage"
                isAnimationActive
                animationDuration={500}
                stroke={paymentColors[rightPayment]}
              >
                {rightChartData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`}
                    fill={hexToRgba(paymentColors[rightPayment], stageOpacities[idx % stageOpacities.length])} />
                ))}
                <LabelList dataKey="count" position="right" offset={10} />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <ResponsiveContainer width="100%" height="100%" >
          <LineChart data={rightChartData}>
                <Line type="monotone" dataKey="count" ></Line>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Table/Description Tabs (unchanged) */}
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
            table
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
            description
          </div>
        </div>
        {activeTab === 'table' ? (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15, tableLayout: "fixed" }}>
            <thead>
              <tr style={{ background: "#f6f7fa" }}>
                <th style={{ padding: "8px 4px", textAlign: "center" }}>결제수단</th>
                {data.funnel_stages.map(stage => (
                  <th key={stage} style={{ padding: "8px 4px" }}>{stage}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "8px 4px", fontWeight: "bold" }}>{selectedPayment.replace('_', ' ')}</td>
                {leftData.counts.map((cnt, idx) => (
                  <td key={idx} style={{ padding: "8px 4px" }}>{cnt}</td>
                ))}
              </tr>
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "24px 0 0 0", color: "#444", fontSize: 16, fontWeight:"bold"}}>
            {descriptions[selectedPayment]}
          </div>
        )}
      </div>
    </div>
  )
}
