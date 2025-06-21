import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Rectangle
} from 'recharts';
import NavBar from './NavBar';
import "./styles/CustomerBehavior.css";

const mockData = {
  purchaseFrequency: [
    { month: '1월', frequency: 1.2 },
    { month: '2월', frequency: 1.5 },
    { month: '3월', frequency: 1.8 },
    { month: '4월', frequency: 2.1 },
    { month: '5월', frequency: 2.3 },
    { month: '6월', frequency: 2.5 }
  ],
  customerSegments: [
    { segment: '신규 고객', count: 2500, value: 150000 },
    { segment: '재구매 고객', count: 1800, value: 280000 },
    { segment: 'VIP 고객', count: 500, value: 350000 },
    { segment: '이탈 고객', count: 1200, value: 80000 }
  ],
  timeOfDay: [
    { hour: '00-06', orders: 150 },
    { hour: '06-12', orders: 450 },
    { hour: '12-18', orders: 800 },
    { hour: '18-24', orders: 600 }
  ]
};

const COLORS = {
  frequency: '#56b4e9',
  segments: '#009e73',
  time: '#f0e442'
};

const descriptions = {
  frequency: "고객들의 월간 구매 빈도는 지속적으로 증가하는 추세를 보입니다. 특히 3개월 이상 지속된 고객들의 구매 빈도가 크게 증가하고 있습니다.",
  segments: "VIP 고객은 전체 고객의 10%에 불과하지만, 전체 매출의 40%를 차지합니다. 이는 고객 세그먼트별 차별화된 마케팅 전략의 필요성을 시사합니다.",
  time: "주문 시간대 분석 결과, 오후 12시부터 18시 사이에 가장 많은 주문이 발생합니다. 이는 점심 시간대와 퇴근 시간대의 구매 패턴을 반영합니다."
};

export default function CustomerBehavior() {
  const [selectedTab, setSelectedTab] = useState('frequency');
  const [activeTab, setActiveTab] = useState('chart');

  return (
    <div className='appContainer'>
      <NavBar />

      <div style={{ marginTop: "10px", padding: "14px 0 0 0", color: "#444", fontSize: 22, fontWeight: "bold", display: "flex", alignItems: "left" }}>
        고객 행동 패턴 분석
      </div>

      {/* 분석 유형 버튼 */}
      <div style={{ width: '100vw', display: "flex", alignItems: "center", gap: 16, margin: "32px 0 0 40px" }}>
        {Object.keys(descriptions).map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            style={{
              padding: "8px 18px",
              borderRadius: 20,
              border: tab === selectedTab ? `2px solid ${COLORS[tab]}` : "2px solid #ddd",
              background: tab === selectedTab ? COLORS[tab] : "#fff",
              color: tab === selectedTab ? "#fff" : "#222",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: 16,
              boxShadow: tab === selectedTab ? "0 2px 8px rgba(0,0,0,0.07)" : "none"
            }}
          >
            {tab === 'frequency' ? '구매 빈도' : 
             tab === 'segments' ? '고객 세그먼트' : '시간대별 주문'}
          </button>
        ))}
      </div>

      {/* 차트 영역 */}
      <div style={{ display: "flex", gap: 32, justifyContent: "center", margin: "32px 0" }}>
        {/* BarChart */}
        <div style={{ width: "50vw", height: "50vh" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={selectedTab === 'frequency' ? mockData.purchaseFrequency :
                    selectedTab === 'segments' ? mockData.customerSegments :
                    mockData.timeOfDay}
              margin={{ top: 20, right: 20, left: 40, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={selectedTab === 'frequency' ? 'month' :
                            selectedTab === 'segments' ? 'segment' : 'hour'} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey={selectedTab === 'frequency' ? 'frequency' :
                        selectedTab === 'segments' ? 'count' : 'orders'}
                name={selectedTab === 'frequency' ? '월간 구매 빈도' :
                      selectedTab === 'segments' ? '고객 수' : '주문 수'}
                barSize={20}
                fill={COLORS[selectedTab]}
                activeBar={<Rectangle fill="pink" stroke="red" />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LineChart */}
        <div style={{ width: "50vw", height: "50vh" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={selectedTab === 'frequency' ? mockData.purchaseFrequency :
                    selectedTab === 'segments' ? mockData.customerSegments :
                    mockData.timeOfDay}
              margin={{ top: 20, right: 20, left: 40, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={selectedTab === 'frequency' ? 'month' :
                            selectedTab === 'segments' ? 'segment' : 'hour'} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={selectedTab === 'frequency' ? 'frequency' :
                        selectedTab === 'segments' ? 'value' : 'orders'}
                name={selectedTab === 'frequency' ? '구매 빈도 추이' :
                      selectedTab === 'segments' ? '매출액' : '주문 추이'}
                stroke={COLORS[selectedTab]}
                strokeWidth={3}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
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
              color: activeTab === 'chart' ? "#01C2FD" : "#444",
              borderBottom: activeTab === 'chart' ? "2px solid #01C2FD" : "none",
              marginRight: 16
            }}
            onClick={() => setActiveTab('chart')}
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

        {activeTab === 'chart' ? (
          <div style={{ marginTop: 24 }}>
            <div className="metrics-summary">
              <div className="metric-card">
                <h3>총 고객 수</h3>
                <p>{mockData.customerSegments.reduce((acc, curr) => acc + curr.count, 0).toLocaleString()}</p>
              </div>
              <div className="metric-card">
                <h3>평균 구매 빈도</h3>
                <p>{(mockData.purchaseFrequency.reduce((acc, curr) => acc + curr.frequency, 0) / mockData.purchaseFrequency.length).toFixed(2)}</p>
              </div>
              <div className="metric-card">
                <h3>총 매출액</h3>
                <p>
                  R$ {mockData.customerSegments.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
                  <br />
                  (약 ₩{Math.round(mockData.customerSegments.reduce((acc, curr) => acc + curr.value, 0) * 249.5).toLocaleString()})
                </p>
              </div>
              <div className="metric-card">
                <h3>일일 평균 주문</h3>
                <p>{mockData.timeOfDay.reduce((acc, curr) => acc + curr.orders, 0) / 4}</p>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: "24px 0 0 0", color: "#444", fontSize: 16, fontWeight: "bold" }}>
            {descriptions[selectedTab]}
          </div>
        )}
      </div>
    </div>
  );
} 