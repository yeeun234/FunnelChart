export const deliveryData = {
  deliverySpeedAnalysis: [
    { speed: 'Fast (≤7 days)', rate: 0.45, count: 2500 },
    { speed: 'Medium (8-15 days)', rate: 0.35, count: 3500 },
    { speed: 'Slow (16-30 days)', rate: 0.25, count: 2000 },
    { speed: 'Very Slow (>30 days)', rate: 0.15, count: 1000 }
  ],
  
  deliveryImpact: [
    { days: 1, probability: 0.48 },
    { days: 5, probability: 0.45 },
    { days: 10, probability: 0.40 },
    { days: 15, probability: 0.35 },
    { days: 20, probability: 0.30 },
    { days: 25, probability: 0.25 },
    { days: 30, probability: 0.20 }
  ],
  
  reviewScores: [
    { score: 1, rate: 0.15 },
    { score: 2, rate: 0.20 },
    { score: 3, rate: 0.25 },
    { score: 4, rate: 0.35 },
    { score: 5, rate: 0.45 }
  ],
  
  businessMetrics: {
    totalCustomers: 9000,
    avgDeliveryTime: 12.5,
    repurchaseRate1M: 0.25,
    repurchaseRate6M: 0.35,
    avgOrderValue: 150.75
  },
  
  improvementScenarios: [
    { improvement: '20%', rate: 0.28 },
    { improvement: '40%', rate: 0.32 },
    { improvement: '60%', rate: 0.38 },
    { improvement: '80%', rate: 0.42 }
  ]
}; 