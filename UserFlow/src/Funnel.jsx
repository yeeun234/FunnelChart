import React, { useState } from 'react';
import { FunnelChart, Funnel, Tooltip, LabelList, ResponsiveContainer, Cell  } from 'recharts';
import { Link } from 'react-router-dom';
import mockData from './mockFunnelData';
import Logo from '../src/img/Logo.svg';
import "./styles/Funnel.css";

// 결제수단별 색상
const paymentColors = {
  credit_card: '#56b4e9',
  boleto: '#009e73',
  voucher: '#f0e442',
  debit_card: '#cc79a7',
};

//차트별 설명
const descriptions = {
  credit_card: "Credit card payments are processed instantly and offer high convenience for customers.",
  boleto: "Boleto is a popular payment method in Brazil, allowing customers to pay via bank slips.",
  voucher: "Voucher payments are prepaid and often used in promotional campaigns.",
  debit_card: "Debit card payments are deducted directly from the customer's bank account.",
};

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}
const stageOpacities = [1, 0.8, 0.6, 0.4, 0.25]; // Adjust as needed for your number of stages



export default function FunnelPage() {
  const [selectedPayment, setSelectedPayment] = useState('credit_card');
  const [activeTab, setActiveTab] = useState('table'); // 'table' or 'description'
  const data = mockData; 

  const selectedData = data.data.find(d => d.payment_type === selectedPayment);
  const chartData = selectedData
    ? data.funnel_stages.map((stage, idx) => ({
        stage,
        count: selectedData.counts[idx],
      }))
    : [];

  return (
    <div className='appContainer'>
      {/* Navigation and Payment Method Buttons (same as before) */}
      <nav className="nav">

       <Link to ="/" className="logoRow">
          <img
            src={Logo}
            alt="logo"
            className="logoImg"
          />
          <span className="projectName">UserFlow</span>
        </Link>
        <div className="navLinks">
          <Link to="/login">
            <div className="navLink">
              LOGIN
            </div>
          </Link>
          
          <div className="navLink" style={{ color: "#01C2FD" }}>
            WORK
          </div>
          <Link to="/">
            <div className="navLink">
              ABOUT
            </div>
          </Link>
          
        </div>
      </nav>

      <div style={{ width:'100vw' , display: "flex" ,alignItems:"center", gap: 16, margin: "32px 0 0 40px" } }>
        {data.data.map(payment => (
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

      {/* Funnel Chart */}
      <div style={{ display: "flex", justifyContent: "center", margin: "32px 0" }}>
        <ResponsiveContainer width={500} height={340}>
          <FunnelChart>
            <Tooltip />
            <Funnel
              data={chartData}
              dataKey="count"
              nameKey="stage"
              isAnimationActive
              animationDuration={500}
              stroke={paymentColors[selectedPayment]}
              // fill={paymentColors[selectedPayment]}
            >
              {chartData.map((entry, idx) => (
    <Cell key={`cell-${idx}`}
      fill={hexToRgba(paymentColors[selectedPayment], stageOpacities[idx % stageOpacities.length])} />
  ))}
              <LabelList dataKey="count" position="right" offset={10} />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>

      {/* Table Example */}
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
                {selectedData.counts.map((cnt, idx) => (
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
