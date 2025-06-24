import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import './styles/CustomerBehavior.css';
import './styles/StatisticsDashboard.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

const mainColor = '#01C1FE';
const secondaryColor = '#f6f7fa';
const pieColors = [mainColor, '#12D8FA', '#A6F6FF', '#E0F7FA'];

// Mock data for charts that don't have an API endpoint yet
// These are still here because the backend does not yet provide this data.
const rocData = [
  { fpr: 0, lr: 0, rf: 0, gb: 0 },
  { fpr: 0.1, lr: 0.5, rf: 0.6, gb: 0.65 },
  { fpr: 0.2, lr: 0.6, rf: 0.7, gb: 0.75 },
  { fpr: 0.4, lr: 0.7, rf: 0.8, gb: 0.85 },
  { fpr: 0.6, lr: 0.8, rf: 0.85, gb: 0.9 },
  { fpr: 0.8, lr: 0.9, rf: 0.95, gb: 0.97 },
  { fpr: 1, lr: 1, rf: 1, gb: 1 }
];
const confusionMatrix = [
  { label: 'No Repurchase', predNo: 18593, predYes: 14 },
  { label: 'Repurchase', predNo: 447, predYes: 229 }
];
const reviewScore = [
  { score: 1, rate: 0.034 },
  { score: 2, rate: 0.041 },
  { score: 3, rate: 0.037 },
  { score: 4, rate: 0.034 },
  { score: 5, rate: 0.033 }
];
const repurchaseStatus = [
  { name: '재구매 안함', value: 84.4 },
  { name: '6개월 내에 재구매함', value: 12.1 },
  { name: '1개월 내에 재구매함', value: 3.5 }
];

const businessRecommendations = [
  '상관관계 약함: 배송 기간은 재구매에 큰 영향을 미치지 않음',
  '추천: 제품 품질, 고객 서비스 등 다른 요인에 집중',
  '배송 기간 50% 개선 시 예상 매출 영향: 재구매율 약 1.9%p 증가 예상',
  '10,000명 기준: 약 193건 추가 재구매 예상',
];

// Summary statistics data
const summaryStats = [
  { label: '분석 고객 수', value: '96,413' },
  { label: '전체 1개월 재구매율', value: '3.51%' },
  { label: '전체 6개월 재구매율', value: '3.51%' },
  { label: '평균 첫 주문 배송 기간', value: '12.0일' },
  { label: '첫 주문 배송 기간(중앙값)', value: '10.0일' },
];

const deliverySpeedRates = [
  { speed: '빠름', rate: '3.18%', count: '1,072/33,698' },
  { speed: '보통', rate: '3.68%', count: '1,457/39,568' },
  { speed: '느림', rate: '3.69%', count: '704/19,092' },
  { speed: '매우 느림', rate: '3.67%', count: '149/4,055' },
];

const binLabelMap = {
  "Fast (≤7 days)": "빠름 (≤7일)",
  "Medium (8-15 days)": "보통 (8-15일)",
  "Slow (16-30 days)": "느림 (16-30일)",
  "Very Slow (>30 days)": "매우 느림 (>30일)"
};
const binOrder = ["빠름 (≤7일)", "보통 (8-15일)", "느림 (16-30일)", "매우 느림 (>30일)"];

const DatasetInfoModal = ({ onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2 style={{ color: mainColor }}>Olist E-commerce 데이터셋 정보</h2>
      <p>본 대시보드는 브라질 이커머스 플랫폼 Olist의 공개 데이터셋을 기반으로 합니다. 데이터셋은 여러 개의 파일로 구성되어 있으며, 각 파일의 주요 정보는 다음과 같습니다.</p>
      <ul>
        <li><b>olist_customers_dataset.csv</b>: 고객 정보 (고유 ID, 위치 등)</li>
        <li><b>olist_orders_dataset.csv</b>: 주문 정보 (주문 ID, 고객 ID, 주문 상태, 시간 등)</li>
        <li><b>olist_order_items_dataset.csv</b>: 주문 내 상품 정보 (상품 ID, 가격, 배송비 등)</li>
        <li><b>olist_order_payments_dataset.csv</b>: 주문 결제 정보 (결제 수단, 할부 횟수 등)</li>
        <li><b>olist_order_reviews_dataset.csv</b>: 주문 리뷰 정보 (리뷰 점수, 코멘트 등)</li>
        <li><b>olist_products_dataset.csv</b>: 상품 정보 (카테고리, 크기 등)</li>
        <li><b>olist_sellers_dataset.csv</b>: 판매자 정보 (고유 ID, 위치 등)</li>
        <li><b>olist_geolocation_dataset.csv</b>: 지리 정보 (우편번호, 위도, 경도 등)</li>
        <li><b>product_category_name_translation.csv</b>: 상품 카테고리 영문 번역</li>
      </ul>
      <a href="/db/archive.zip" download="olist_ecommerce_dataset.zip" style={{ textAlign: 'left', color: '#01C1FE', fontWeight:'500', textDecoration: 'underline' }}>
        원본 데이터 다운로드
       </a>
      <button onClick={onClose} className="modal-close-btn">닫기</button>
    </div>
  </div>
);

// 성능 지표 계산
const calculatePerformanceMetrics = () => {
  const TP = 229; // True Positive
  const TN = 18593; // True Negative
  const FP = 14; // False Positive
  const FN = 447; // False Negative
  
  const accuracy = ((TP + TN) / (TP + TN + FP + FN) * 100).toFixed(1);
  const precision = (TP / (TP + FP) * 100).toFixed(1);
  const recall = (TP / (TP + FN) * 100).toFixed(1);
  const f1Score = (2 * (precision * recall) / (parseFloat(precision) + parseFloat(recall))).toFixed(1);
  
  return { accuracy, precision, recall, f1Score };
};

const performanceMetrics = calculatePerformanceMetrics();

export default function StatisticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPerformanceMetrics, setShowPerformanceMetrics] = useState(false);

  // States for API data - ALL data is now held in state
  const [summaryStats, setSummaryStats] = useState([]);
  const [deliverySpeedRates, setDeliverySpeedRates] = useState([]);
  const [deliveryTimeImpact, setDeliveryTimeImpact] = useState([]);
  const [repurchaseBins, setRepurchaseBins] = useState([]);
  const [deliveryDist, setDeliveryDist] = useState([]);
  const [deliveryImprovement, setDeliveryImprovement] = useState([]);

  useEffect(() => {
    setIsModalOpen(true); // Show modal on component mount
    const fetchData = async () => {
      try {
        setLoading(true);
        const API_BASE_URL = 'http://10.125.121.173:8080/api/delivery-analysis';

        // Fetch all data concurrently
        const [
          totalCustomersRes,
          repurchase1mRes,
          repurchase6mRes,
          avgDeliveryTimeRes,
          deliverySpeedRes,
          deliveryImpactRes,
          improvementScenariosRes
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/analytics/total-customers`),
          axios.get(`${API_BASE_URL}/analytics/repurchase-rate-1m`),
          axios.get(`${API_BASE_URL}/analytics/repurchase-rate-6m`),
          axios.get(`${API_BASE_URL}/analytics/average-delivery-time`),
          axios.get(`${API_BASE_URL}/delivery-speed`),
          axios.get(`${API_BASE_URL}/delivery-impact`),
          axios.get(`${API_BASE_URL}/improvement-scenarios`)
        ]);

        setSummaryStats([
          { label: '분석 고객 수', value: totalCustomersRes.data.toLocaleString() },
          { label: '전체 1개월 재구매율', value: `${(repurchase1mRes.data * 100).toFixed(2)}%` },
          { label: '전체 6개월 재구매율', value: `${(repurchase6mRes.data * 100).toFixed(2)}%` },
          { label: '평균 첫 주문 배송 기간', value: `${avgDeliveryTimeRes.data.toFixed(1)}일` },
          { label: '첫 주문 배송 기간(중앙값)', value: '10.0일' },
        ]);

        setDeliverySpeedRates(deliverySpeedRes.data.map(d => ({
          speed: d.category,
          rate: `${(d.value1 * 100).toFixed(2)}%`,
          count: d.value2
        })));

        setDeliveryTimeImpact(deliveryImpactRes.data.map(d => ({
          day: parseInt(d.category, 10),
          probability: d.value1
        })).sort((a, b) => a.day - b.day));

        // Repurchase bins chart: use deliverySpeedRes, category/value1
        setRepurchaseBins(
          deliverySpeedRes.data
            .map(d => ({
              bin: binLabelMap[d.category] || d.category,
              rate: d.value1
            }))
            .sort((a, b) => binOrder.indexOf(a.bin) - binOrder.indexOf(b.bin))
        );

        // Delivery time distribution chart: use deliverySpeedRes, category/value2
        setDeliveryDist(
          deliverySpeedRes.data
            .map(d => {
              // value2가 "1,072/33,698" 형태이므로 분모 부분만 추출
              const totalCount = d.value2 ? parseInt(d.value2.split('/')[1].replace(/,/g, '')) : 0;
              return {
                bin: binLabelMap[d.category] || d.category,
                count: totalCount
              };
            })
            .sort((a, b) => binOrder.indexOf(a.bin) - binOrder.indexOf(b.bin))
        );

        setDeliveryImprovement(improvementScenariosRes.data.map(d => ({
          improvement: d.category,
          rate: d.value1
        })));

      } catch (err) {
        setError(err);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
        <div className="appContainer dashboard-container">
            <NavBar />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', fontSize: '2rem' }}>
                Loading...
            </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="appContainer dashboard-container">
        <NavBar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', fontSize: '1.5rem', color: 'red' }}>
          Error fetching data. Please ensure the backend server is running and accessible.
        </div>
      </div>
    );
  }

  return (
    <div className="appContainer dashboard-container">
      {isModalOpen && <DatasetInfoModal onClose={() => setIsModalOpen(false)} />}
      <NavBar />
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 0' }}>
        <h1 className="dashboard-title">분석 대시보드</h1>
        <p style={{ textAlign: 'right', fontSize: '13px', color: '#888', marginTop: '-10px', marginBottom: '24px' }}>
          * 본 분석은 Olist E-commerce 데이터셋을 기반으로 합니다. 
          <a href="https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce" target="_blank" rel="noopener noreferrer" style={{ marginLeft: '8px', color: '#01C1FE', textDecoration: 'underline', fontWeight:'600' }}>
            원본 데이터 보기
          </a>
        </p>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
          {summaryStats.map((stat, index) => (
            <div key={index} style={{
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(1,193,254,0.07)',
              border: '1px solid #f0f4f8',
              padding: '18px 28px',
              minWidth: 220,
              flex: '1 1 220px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{ color: '#888', fontSize: 15 }}>{stat.label}</div>
              <div style={{ color: mainColor, fontWeight: 700, fontSize: 22, marginTop: 4 }}>{stat.value}</div>
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(1,193,254,0.07)', border: '1px solid #f0f4f8', padding: 24, marginBottom: 32 }}>
          <div style={{ fontWeight: 600, fontSize: 18, color: '#222', marginBottom: 12 }}>배송 속도별 재구매율</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
            <thead>
              <tr style={{ background: secondaryColor }}>
                <th style={{ padding: '8px 4px', textAlign: 'center' }}>배송 속도</th>
                <th style={{ padding: '8px 4px', textAlign: 'center' }}>재구매율</th>
                <th style={{ padding: '8px 4px', textAlign: 'center' }}>건수</th>
              </tr>
            </thead>
            <tbody>
              {deliverySpeedRates.map((row, index) => (
                <tr key={index}>
                  <td style={{ padding: '8px 4px', textAlign: 'center' }}>{row.speed}</td>
                  <td style={{ padding: '8px 4px', textAlign: 'center', color: mainColor, fontWeight: 600 }}>{row.rate}</td>
                  <td style={{ padding: '8px 4px', textAlign: 'center' }}>{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(1,193,254,0.07)', border: '1px solid #f0f4f8', padding: 24, marginBottom: 32 }}>
          <div style={{ fontWeight: 600, fontSize: 18, color: '#222', marginBottom: 12 }}>비즈니스 추천</div>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#444', fontSize: 15 }}>
            {businessRecommendations.map((rec, idx) => (
              <div key={idx} style={{ marginBottom: 6 }}>{rec}</div>
            ))}
          </ul>
        </div>
        <div className="dashboard-grid">
          <div className="metric-card">
            <h3>배송 기간이 6개월 재구매 확률에 미치는 영향</h3>
            <p style={{ fontSize: 14, color: '#666', marginTop: 4, marginBottom: 12 }}>
              배송이 하루씩 늦어질수록 고객의 재구매 확률이 어떻게 변하는지를 보여줍니다. 
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={deliveryTimeImpact}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" label={{ value: 'Delivery Days' , fontSize: 12, position: 'insideBottom', offset: -5 }} />
                <YAxis domain={[0.014, 0.02]} tickFormatter={v => v.toFixed(3)} />
                <Tooltip />
                <Line type="monotone" dataKey="probability" stroke={mainColor} strokeWidth={3} dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="metric-card">
            <h3>배송 기간 구간별 실제 재구매율</h3>
            <p style={{ fontSize: 14, color: '#666', marginTop: 4, marginBottom: 12 }}>
              배송 기간을 여러 구간으로 나누어, 각 구간에 해당하는 고객들의 실제 재구매율을 비교합니다.
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={repurchaseBins}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bin"
                  interval={0}
                  fontSize={14}
                  dy={20}
                  height={50}/>
                <YAxis domain={[0, 0.7]} tickFormatter={v => (v*100).toFixed(1) + '%'} />
                <Tooltip formatter={v => (v*100).toFixed(2) + '%'} />
                <Bar dataKey="rate" fill={mainColor} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="metric-card">
            <h3>배송 기간 분포</h3>
            <p style={{ fontSize: 14, color: '#666', marginTop: 4, marginBottom: 12 }}>
              주문된 상품들이 실제로 며칠 만에 배송되는지에 대한 분포를 보여줍니다. 막대가 높을수록 해당 기간에 배송된 주문이 많다는 의미입니다.
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deliveryDist}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bin"
                  interval={0}
                  fontSize={14}
                  dy={20}
                  height={50}/>
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={mainColor} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="metric-card">
            <h3>배송 개선의 잠재적 영향</h3>
            <p style={{ fontSize: 14, color: '#666', marginTop: 4, marginBottom: 12 }}>
              배송 시간을 일정 비율로 단축했을 때, 재구매율이 얼마나 증가할지를 예측한 결과입니다.
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deliveryImprovement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="improvement" />
                <YAxis domain={[0, 0.035]} tickFormatter={v => (v*100).toFixed(2) + '%'} />
                <Tooltip formatter={v => (v*100).toFixed(2) + '%'} />
                <Bar dataKey="rate" fill={mainColor} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="metric-card" style={{ gridColumn: '1/2' }}>
            <h3>ROC 곡선 - 6개월 재구매 예측</h3>
            <p style={{ fontSize: 14, color: '#666', marginTop: 4, marginBottom: 12 }}>
              재구매 고객을 예측하는 여러 모델의 성능을 비교한 성적표입니다. 선이 좌측 상단에 가까울수록 더 정확한 모델입니다.
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={rocData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fpr" type="number" domain={[0,1]} />
                <YAxis type="number" domain={[0,1]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="lr" stroke="#FF69B4" name="로지스틱 회귀 (AUC = 0.736)" />
                <Line type="monotone" dataKey="rf" stroke="#FFA500" name="랜덤 포레스트 (AUC = 0.760)" />
                <Line type="monotone" dataKey="gb" stroke="#32CD32" name="그래디언트 부스팅 (AUC = 0.792)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="metric-card" style={{ gridColumn: '2/3' }}>
            <h3>오차 행렬 - 그래디언트 부스팅</h3>
            <p style={{ fontSize: 14, color: '#666', marginTop: 4, marginBottom: 12 }}>
              가장 성능이 좋은 모델이 내놓은 예측(재구매 여부)이 실제 결과와 얼마나 일치하는지를 보여주는 표입니다.
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
              <thead>
                <tr style={{ background: secondaryColor }}>
                  <th></th>
                  <th>예측: 미재구매</th>
                  <th>예측: 재구매</th>
                </tr>
              </thead>
              <tbody>
                {confusionMatrix.map((row, idx) => (
                  <tr key={row.label} style={{ background: idx % 2 === 0 ? '#fff' : secondaryColor }}>
                    <td style={{ fontWeight: 600 }}>{row.label === 'No Repurchase' ? '미재구매' : '재구매'}</td>
                    <td style={{ textAlign: 'center' }}>
                      {row.predNo}
                      <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                        {row.label === 'No Repurchase' ? '(TN)' : '(FN)'}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {row.predYes}
                      <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                        {row.label === 'No Repurchase' ? '(FP)' : '(TP)'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* 오차 행렬 설명 */}
            <div style={{ 
              background: '#E3F2FD', 
              border: '1px solid #90CAF9', 
              borderRadius: 8, 
              padding: 12, 
              marginTop: 16,
              fontSize: 13,
              color: '#1E3A8A'
            }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>📊 오차 행렬 해석:</div>
              <div style={{ lineHeight: 1.4 }}>
                <div>• <strong>TP (True Positive):</strong> 229건 - 재구매 예측 성공 ✅</div>
                <div>• <strong>TN (True Negative):</strong> 18,593건 - 미재구매 예측 성공 ✅</div>
                <div>• <strong>FP (False Positive):</strong> 14건 - 재구매로 잘못 예측 ❌</div>
                <div>• <strong>FN (False Negative):</strong> 447건 - 재구매를 놓침 ❌</div>
              </div>
            </div>
          </div>
          <div className="metric-card" style={{ gridColumn: '1/2' }}>
            <h3>리뷰 점수별 재구매율</h3>
             <p style={{ fontSize: 14, color: '#666', marginTop: 4, marginBottom: 12 }}>
               고객이 남긴 리뷰 점수가 재구매에 어떤 영향을 미치는지 보여줍니다.
             </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={reviewScore}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="score" />
                <YAxis domain={[0, 0.05]} tickFormatter={v => (v*100).toFixed(1) + '%'} />
                <Tooltip formatter={v => (v*100).toFixed(2) + '%'} />
                <Bar dataKey="rate" fill={mainColor} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="metric-card" style={{ gridColumn: '2/3' }}>
            <h3>재구매 현황</h3>
             <p style={{ fontSize: 14, color: '#666', marginTop: 4, marginBottom: 12 }}>
               전체 고객 중 재구매 고객의 비율을 보여줍니다.
             </p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={repurchaseStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill={mainColor} label>
                  {repurchaseStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#01C1FE', '#12D8FA', '#A6F6FF'][index % 3]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* 머신러닝 모델 성능 지표 섹션 */}
        <div style={{ 
          background: '#fff', 
          borderRadius: 12, 
          boxShadow: '0 2px 8px rgba(1,193,254,0.07)', 
          border: '1px solid #f0f4f8', 
          padding: 24, 
          marginTop: 32,
          marginBottom: 32,
          gridColumn: '1 / -1'
        }}>
          <div style={{ fontWeight: 600, fontSize: 18, color: '#222', marginBottom: 12 }}>머신러닝 모델 성능 지표</div>
          
          {/* 성능 지표 표 */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, marginBottom: 16 }}>
            <thead>
              <tr style={{ background: secondaryColor }}>
                <th style={{ padding: '8px 4px', textAlign: 'center' }}>지표</th>
                <th style={{ padding: '8px 4px', textAlign: 'center' }}>값</th>
                <th style={{ padding: '8px 4px', textAlign: 'center' }}>의미</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 600 }}>정확도 (Accuracy)</td>
                <td style={{ padding: '8px 4px', textAlign: 'center', color: mainColor, fontWeight: 600 }}>{performanceMetrics.accuracy}%</td>
                <td style={{ padding: '8px 4px', textAlign: 'center', fontSize: 13 }}>전체 예측 중 정확한 비율</td>
              </tr>
              <tr style={{ background: '#f9f9f9' }}>
                <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 600 }}>정밀도 (Precision)</td>
                <td style={{ padding: '8px 4px', textAlign: 'center', color: mainColor, fontWeight: 600 }}>{performanceMetrics.precision}%</td>
                <td style={{ padding: '8px 4px', textAlign: 'center', fontSize: 13 }}>재구매 예측 중 실제 재구매 비율</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 600 }}>재현율 (Recall)</td>
                <td style={{ padding: '8px 4px', textAlign: 'center', color: mainColor, fontWeight: 600 }}>{performanceMetrics.recall}%</td>
                <td style={{ padding: '8px 4px', textAlign: 'center', fontSize: 13 }}>실제 재구매 중 정확히 예측한 비율</td>
              </tr>
              <tr style={{ background: '#f9f9f9' }}>
                <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 600 }}>F1-Score</td>
                <td style={{ padding: '8px 4px', textAlign: 'center', color: mainColor, fontWeight: 600 }}>{performanceMetrics.f1Score}%</td>
                <td style={{ padding: '8px 4px', textAlign: 'center', fontSize: 13 }}>정밀도와 재현율의 조화평균</td>
              </tr>
            </tbody>
          </table>

          {/* 재현율 토글바 */}
          <div style={{ 
            background: '#E3F2FD', 
            border: '1px solid #90CAF9', 
            borderRadius: 8, 
            padding: 16, 
            marginTop: 16 
          }}>
            <button 
              onClick={() => setShowPerformanceMetrics(!showPerformanceMetrics)}
              style={{
                background: 'none',
                border: 'none',
                color: '#1E3A8A',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              재현율 계산 방법 {showPerformanceMetrics ? '▼' : '▶'}
            </button>
            
            {showPerformanceMetrics && (
              <div style={{ marginTop: 12, color: '#1E3A8A', fontSize: 13, lineHeight: 1.5 }}>
                <p><strong>재현율 (Recall) = TP / (TP + FN) × 100</strong></p>
                <p>• TP (True Positive): 재구매 예측 성공 = 229건</p>
                <p>• FN (False Negative): 재구매를 놓침 = 447건</p>
                <p>• 재현율 = 229 / (229 + 447) × 100 = {performanceMetrics.recall}%</p>
                <p style={{ marginTop: 8, fontStyle: 'italic' }}>
                  <strong>비즈니스 의미:</strong> 실제 재구매 고객 중 {performanceMetrics.recall}%를 정확히 찾아냄
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 