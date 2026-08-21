import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const MortgageCalculator = ({ propertyPrice }) => {
  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    return parseFloat(priceString.replace(/[^0-9.-]+/g, ''));
  };

  const initialPrice = parsePrice(propertyPrice);

  const [totalAmount, setTotalAmount] = useState(initialPrice);
  const [downPayment, setDownPayment] = useState(initialPrice * 0.2); // Default 20%
  const [interestRate, setInterestRate] = useState(5.5); // Default 5.5%
  const [loanTerm, setLoanTerm] = useState(30); // Default 30 years

  const downPaymentPercentage = useMemo(() => {
    return totalAmount > 0 ? (downPayment / totalAmount) * 100 : 0;
  }, [downPayment, totalAmount]);

  const handleDownPaymentChange = (e) => {
    setDownPayment(parseFloat(e.target.value) || 0);
  };

  const handleDownPaymentPercentChange = (e) => {
    const percentage = parseFloat(e.target.value);
    if (!isNaN(percentage)) {
      setDownPayment((totalAmount * percentage) / 100);
    }
  };

  const principalAndInterest = useMemo(() => {
    const principal = totalAmount - downPayment;
    if (principal <= 0 || interestRate <= 0 || loanTerm <= 0) {
      return 0;
    }
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    const numerator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
    const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;

    if (denominator === 0) return 0;

    const payment = principal * (numerator / denominator);
    return payment;
  }, [totalAmount, downPayment, interestRate, loanTerm]);

  const monthlyTax = useMemo(() => (totalAmount * 0.012) / 12, [totalAmount]);
  const monthlyInsurance = useMemo(() => (totalAmount * 0.005) / 12, [totalAmount]);

  const totalMonthlyPayment = principalAndInterest + monthlyTax + monthlyInsurance;

  const chartData = [
    { name: 'Principal & Interest', value: principalAndInterest },
    { name: 'Property Tax', value: monthlyTax },
    { name: 'Home Insurance', value: monthlyInsurance },
  ];

  const COLORS = ['#f43f5e', '#fb923c', '#facc15']; // Rose, Orange, Amber

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-700">{`${payload[0].name}`}</p>
          <p className="text-rose-600 font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payload[0].value)}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      {/* Inputs */}
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2 text-slate-600">Total Amount</label>
          <input type="number" value={totalAmount} onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)} className="form-input" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-600">Down Payment ($)</label>
            <input type="number" value={downPayment} onChange={handleDownPaymentChange} className="form-input" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-600">Down Payment (%)</label>
            <input type="number" value={downPaymentPercentage.toFixed(1)} onChange={handleDownPaymentPercentChange} className="form-input" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-600">Interest Rate (%)</label>
            <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)} className="form-input" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-600">Loan Term (Years)</label>
            <input type="number" value={loanTerm} onChange={(e) => setLoanTerm(parseFloat(e.target.value) || 0)} className="form-input" />
          </div>
        </div>
      </div>

      {/* Results */}
      <motion.div 
        key={totalMonthlyPayment}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-rose-50 to-rose-100 p-6 rounded-2xl text-center border border-rose-200"
      >
        <p className="text-lg font-semibold text-rose-800">Estimated Monthly Payment</p>
        <p className="text-5xl font-bold text-rose-600 my-3">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalMonthlyPayment)}
        </p>
        <div className="h-48 w-full mt-4">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-center gap-4 text-xs">
          {chartData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-slate-600">{entry.name}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-6">
          *This is an estimate for informational purposes only. Consult with a financial advisor for an exact quote.
        </p>
      </motion.div>
    </div>
  );
};

export default MortgageCalculator;