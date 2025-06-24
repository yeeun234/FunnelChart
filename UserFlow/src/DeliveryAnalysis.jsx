import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell, Rectangle
} from 'recharts';
import { deliveryData } from './mockDeliveryData';
import NavBar from './NavBar';
import './styles/DeliveryAnalysis.css';

const COLORS = {
  fast: '#56b4e9',
  medium: '#009e73',
  slow: '#f0e442',
  very_slow: '#cc79a7',
  improvement: '#01C2FD'
};

// Add Korean translations for speed labels
const speedLabels = {
  fast: '빠름',
  medium: '보통',
  slow: '느림',
  very_slow: '매우 느림',
  improvement: '개선점'
};

const descriptions = {
  fast: "빠른 배송(7일 이내)은 재구매율이 45%로 가장 높습니다. 이는 고객 만족도와 신뢰도가 높은 배송 속도가 재구매에 긍정적인 영향을 미친다는 것을 보여줍니다.",
  medium: "중간 배송(8-15일)은 재구매율이 35%로 적절한 수준을 보입니다. 이는 대부분의 고객이 수용할 수 있는 배송 기간임을 나타냅니다.",
  slow: "느린 배송(16-30일)은 재구매율이 25%로 크게 감소합니다. 이는 배송 지연이 고객 이탈의 주요 원인임을 시사합니다.",
  very_slow: "매우 느린 배송(30일 초과)은 재구매율이 15%로 가장 낮습니다. 이는 장기 배송이 고객 경험에 심각한 부정적 영향을 미친다는 것을 보여줍니다.",
  improvement: "배송 시간 개선 시나리오에 따른 예상 재구매율 변화입니다. 배송 프로세스를 최적화하여 평균 배송 시간을 단축할 경우, 고객의 재구매율이 유의미하게 상승할 것으로 기대됩니다."
};

export default function DeliveryAnalysis() {
  const [selectedSpeed, setSelectedSpeed] = useState('fast');
  const [activeTab, setActiveTab] = useState('chart');
  const [isNoteOpen, setIsNoteOpen] = useState(true);

  const formatPercent = (value) => `${(value * 100).toFixed(1)}%`;
  const formatCurrency = (value) => `R$ ${value.toFixed(2)}`;

  const deliverySpeedTranslations = {
    'Fast (≤7 days)': '빠름 (≤7일)',
    'Medium (8-15 days)': '보통 (8-15일)',
    'Slow (16-30 days)': '느림 (16-30일)',
    'Very Slow (>30 days)': '매우 느림 (>30일)'
  };

  // BarChart 데이터: 배송 속도별 재구매율
  const barChartData = deliveryData.deliverySpeedAnalysis.map(item => ({
    speed: deliverySpeedTranslations[item.speed] || item.speed,
    rate: item.rate,
    count: item.count
  }));

  const improvementChartData = deliveryData.improvementScenarios;

  // LineChart 데이터: 배송 기간에 따른 재구매 확률
  const lineChartData = deliveryData.deliveryImpact;

  return (
    <div className='appContainer'>
      <NavBar />

      <div style={{
          background: '#E3F2FD', 
          border: '1px solid #90CAF9', 
          borderRadius: 8, 
          padding: '16px 24px', 
          margin: '10px 0px 0', 
          color: '#1E3A8A',
          fontSize: 15,
        }}>
        <div 
          onClick={() => setIsNoteOpen(!isNoteOpen)} 
          style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}
        >
          <span style={{color: '#1976D2'}}>참고</span>
          <span>{isNoteOpen ? '접기 ▲' : '펴기 ▼'}</span>
        </div>
        
        {isNoteOpen && (
          <div style={{ marginTop: '12px', lineHeight: 1.6 }}>
            이 페이지는 배송 속도가 재구매율에 큰 영향을 미치는 <strong>가상 시나리오</strong>를 보여줍니다. 하지만 <strong style={{color: '#1976D2'}}>'분석 한눈에 보기'</strong> 대시보드의 실제 데이터 분석에 따르면, 배송 기간의 영향은 예상보다 미미한 것으로 나타났습니다. 이 페이지는 배송 속도 개선의 '잠재적 최대 효과'를 보여주는 참고 자료로 활용해 주세요.
          </div>
        )}
      </div>

      <div style={{marginTop: "10px",  padding: "14px 0 0 0", color: "#444", fontSize: 22, fontWeight: "bold", display: "flex", alignItems: "left" }}>
        배송 기간이 고객 재구매에 미치는 영향 분석 (가상 시나리오)
      </div>
      <p style={{ textAlign: 'right', fontSize: '13px', color: '#888', marginTop: '10px', marginBottom: '24px' }}>
          * 본 분석은 Olist E-commerce 데이터셋을 기반으로 합니다. 
          <a href="/db/archive.zip" download="olist_ecommerce_dataset.zip" style={{ marginLeft: '8px', color: '#01C1FE', textDecoration: 'underline', fontWeight:'600' }}>
            원본 데이터 다운로드
          </a>
        </p>
      

      {/* 배송 속도 버튼 */}
      <div style={{ width: '100vw', display: "flex", alignItems: "center", gap: 16, margin: "32px 0 0 40px" }}>
        {Object.keys(COLORS).map(speed => (
          <button
            key={speed}
            onClick={() => setSelectedSpeed(speed)}
            style={{
              padding: "8px 18px",
              borderRadius: 20,
              border: speed === selectedSpeed ? `2px solid ${COLORS[speed]}` : "2px solid #ddd",
              background: speed === selectedSpeed ? COLORS[speed] : "#fff",
              color: speed === selectedSpeed ? "#fff" : "#222",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: 16,
              boxShadow: speed === selectedSpeed ? "0 2px 8px rgba(0,0,0,0.07)" : "none"
            }}
          >
            {speedLabels[speed]}
          </button>
        ))}
      </div>

      {/* 차트 영역 */}
      <div style={{ display: "flex", gap: 32, justifyContent: "center", margin: "32px 0" }}>
        {selectedSpeed === 'improvement' ? (
          <div style={{ width: "50vw", height: "50vh" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={improvementChartData}
                margin={{ top: 20, right: 20, left: 40, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="improvement" label={{ value: '배송 시간 개선율', position: 'insideBottom', offset: -5 }}/>
                <YAxis tickFormatter={formatPercent} />
                <Tooltip formatter={formatPercent} />
                <Legend wrapperStyle={{ paddingTop: "20px" }}/>
                <Bar
                  dataKey="rate"
                  name="예상 재구매율"
                  barSize={40}
                  fill={COLORS.improvement}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <>
            {/* BarChart */}
            <div style={{ width: "50vw", height: "50vh" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 20, right: 20, left: 40, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="speed" interval={0} fontSize={12} />
                  <YAxis tickFormatter={formatPercent} />
                  <Tooltip formatter={formatPercent} />
                  <Legend />
                  <Bar
                    dataKey="rate"
                    name="재구매율"
                    barSize={20}
                    fill={COLORS[selectedSpeed]}
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
                  <XAxis dataKey="days" label={{ value: '배송 기간 (일)', position: 'insideBottom', offset: -5 }} />
                  <YAxis tickFormatter={formatPercent} label={{ value: '재구매 확률', angle: -90, position: 'insideLeft', dx: -10 }} />
                  <Tooltip formatter={formatPercent} />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Line
                    type="monotone"
                    dataKey="probability"
                    name="재구매 확률"
                    stroke={COLORS[selectedSpeed]}
                    strokeWidth={3}
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
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
            {selectedSpeed === 'improvement' ? (
              <div className="metrics-summary">
                {deliveryData.improvementScenarios.map((scenario, index) => (
                  <div className="metric-card" key={index}>
                    <h3>개선율 {scenario.improvement}</h3>
                    <p>예상 재구매율: {formatPercent(scenario.rate)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="metrics-summary">
                <div className="metric-card">
                  <h3>총 고객 수</h3>
                  <p>{deliveryData.businessMetrics.totalCustomers.toLocaleString()}명</p>
                </div>
                <div className="metric-card">
                  <h3>평균 배송 기간</h3>
                  <p>{deliveryData.businessMetrics.avgDeliveryTime} 일</p>
                </div>
                <div className="metric-card">
                  <h3>6개월 재구매율</h3>
                  <p>{formatPercent(deliveryData.businessMetrics.repurchaseRate6M)}</p>
                </div>
                <div className="metric-card">
                  <h3>평균 주문 금액</h3>
                  <p>{formatCurrency(deliveryData.businessMetrics.avgOrderValue)}</p>
                  <p>
                    (약 ₩{Math.round(deliveryData.businessMetrics.avgOrderValue * 249.5).toLocaleString()})
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: "24px 0 0 0", color: "#444", fontSize: 16, fontWeight: "bold" }}>
            {descriptions[selectedSpeed]}
          </div>
        )}
      </div>
    </div>
  );
} 