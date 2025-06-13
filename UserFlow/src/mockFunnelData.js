export default {
  funnel_stages: ["ordered", "paid", "shipped", "delivered"],
  data: [
    {
      payment_type: "overall",
      counts: [45932, 24547, 20215, 12539],
      conversion_rates: [1.0, 0.54, 0.837, 0.619],
      churn_rates: [0.0, 0.46, 0.163, 0.381]
    },
    {
      payment_type: "credit_card",
      counts: [21932, 11847, 9915, 6139],
      conversion_rates: [1.0, 0.54, 0.837, 0.619],
      churn_rates: [0.0, 0.46, 0.163, 0.381]
    },
    {
      payment_type: "boleto",
      counts: [10000, 5400, 4200, 2600],
      conversion_rates: [1.0, 0.54, 0.778, 0.619],
      churn_rates: [0.0, 0.46, 0.222, 0.381]
    },
    {
      payment_type: "voucher",
      counts: [8000, 4100, 3400, 2100],
      conversion_rates: [1.0, 0.512, 0.829, 0.617],
      churn_rates: [0.0, 0.488, 0.171, 0.383]
    },
    {
      payment_type: "debit_card",
      counts: [6000, 3200, 2700, 1700],
      conversion_rates: [1.0, 0.533, 0.844, 0.630],
      churn_rates: [0.0, 0.467, 0.156, 0.370]
    }
  ]
};