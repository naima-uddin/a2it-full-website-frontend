// components/PayrollFoodCostSelector.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PayrollFoodCostSelector = ({ month, year, onFoodCostSelect }) => {
  const [foodCostBills, setFoodCostBills] = useState([]);
  const [selectedBills, setSelectedBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  const fetchFoodCostBills = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/payroll/food-cost/bills', {
        params: { month, year }
      });
      
      setFoodCostBills(response.data.data.foodCosts);
      setSummary(response.data.data.summary);
    } catch (error) {
      console.error('Error fetching food cost bills:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (month && year) {
      fetchFoodCostBills();
    }
  }, [month, year]);

  const handleBillSelect = (billId) => {
    const newSelected = selectedBills.includes(billId)
      ? selectedBills.filter(id => id !== billId)
      : [...selectedBills, billId];
    
    setSelectedBills(newSelected);
    
    // Calculate total cost of selected bills
    const totalSelectedCost = foodCostBills
      .filter(bill => newSelected.includes(bill.id))
      .reduce((sum, bill) => sum + bill.cost, 0);
    
    // Send to parent component
    onFoodCostSelect({
      includeFoodCost: newSelected.length > 0,
      foodCostBillIds: newSelected,
      totalFoodCost: totalSelectedCost,
      perEmployeeDeduction: summary ? Math.round(totalSelectedCost / summary.totalMealEmployees) : 0
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5>Food Cost Bill Selection</h5>
      </div>
      <div className="card-body">
        {loading ? (
          <div>Loading food cost bills...</div>
        ) : (
          <>
            <div className="alert alert-info">
              <strong>Month:</strong> {summary?.monthName} | 
              <strong>Total Food Cost:</strong> {summary?.totalCost.toLocaleString()} BDT | 
              <strong>Meal Approved Employees:</strong> {summary?.totalMealEmployees}
            </div>
            
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Date</th>
                    <th>Cost</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {foodCostBills.map(bill => (
                    <tr key={bill.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedBills.includes(bill.id)}
                          onChange={() => handleBillSelect(bill.id)}
                        />
                      </td>
                      <td>{new Date(bill.date).toLocaleDateString()}</td>
                      <td>{bill.cost.toLocaleString()} BDT</td>
                      <td>{bill.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {selectedBills.length > 0 && summary && (
              <div className="alert alert-success mt-3">
                <h6>Food Cost Deduction Summary:</h6>
                <ul>
                  <li>Selected Bills: {selectedBills.length}</li>
                  <li>Total Selected Cost: {
                    foodCostBills
                      .filter(bill => selectedBills.includes(bill.id))
                      .reduce((sum, bill) => sum + bill.cost, 0)
                    .toLocaleString()} BDT
                  </li>
                  <li>Deduction per Employee: {
                    Math.round(
                      foodCostBills
                        .filter(bill => selectedBills.includes(bill.id))
                        .reduce((sum, bill) => sum + bill.cost, 0) / summary.totalMealEmployees
                    ).toLocaleString()} BDT
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PayrollFoodCostSelector;