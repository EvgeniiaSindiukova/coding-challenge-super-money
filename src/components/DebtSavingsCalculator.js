import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  Box,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { styled } from "@mui/system";
import { Loan } from "loanjs";

// MUI styles

const BlurryBackground = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backdropFilter: "blur(10px)",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const CardContent = styled(Box)({
  backgroundColor: "#fff",
  padding: "20px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  maxWidth: "800px",
  maxHeight: "90%",
  overflowY: "auto",
  width: "100%",
});

const DebtSavingsCalculator = () => {
  const [debts, setDebts] = useState([
    { name: "", amount: "", apr: "", payment: "" },
  ]);
  const [months, setMonts] = useState(60); // default months (5 years)
  const [apr, setApr] = useState(10);
  const [averageAPR, setAverageAPR] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [calculated, setCalculated] = useState(false);
  const [overallRepayment, setOverallRepayment] = useState(0);
  const [totalRepaymentCurrent, setTotalRepaymentCurrent] = useState(0);
  const [minMonthlyPaymentCurrent, setMinMonthlyPaymentCurrent] = useState(0);
  const [minMonthlyPaymentConsolidated, setMinMonthlyPaymentConsolidated] =
    useState(0);

  const handleAddDebt = () => {
    setDebts([...debts, { name: "", amount: "", apr: "", payment: "" }]);
  };

  const handleDebtChange = (index, field, value) => {
    setDebts(
      debts.map((debt, i) => (i === index ? { ...debt, [field]: value } : debt))
    );
  };

  const calculateAverageAPR = () => {
    let total = 0;
    let sum = 0;

    for (const debt of debts) {
      const amount = Number(debt.amount) || 0;
      const apr = Number(debt.apr) || 0;

      total += amount;
      sum += amount * apr;
    }

    return total > 0 ? sum / total : 0;
  };

  const handleCalculateSavings = () => {
    for (const debt of debts) {
      if (!debt.name || Number(debt.amount) <= 0 || Number(debt.apr) <= 0) {
        alert("Please enter valid debt details.");
        return;
      }
    }

    if (months <= 0 || apr <= 0) {
      alert(
        "Please enter valid positive numbers for the consolidated loan."
      );
      return;
    }

    let total = 0;
    let totalRepaymentCurrent = 0;
    let minMonthlyPaymentCurrent = 0;

    for (const debt of debts) {
      const amount = Number(debt.amount) || 0;
      const debtAPR = Number(debt.apr) || 0;

      total += amount;

      const loan = new Loan(amount, months, debtAPR, "annuity");
      const individualMonthlyPayment = loan.installments[0].installment;

      totalRepaymentCurrent += individualMonthlyPayment * months;
      minMonthlyPaymentCurrent += individualMonthlyPayment;
    }

    const consolidatedAPR = Number(apr) || 0;
    if (total === 0 || consolidatedAPR <= 0) {
      alert("Please enter valid positive numbers for the consolidated APR.");
      return;
    }

    const avgAPR = calculateAverageAPR();
    setAverageAPR(avgAPR);

    const consolidatedLoan = new Loan(total, months, consolidatedAPR, "annuity");
    const newMonthlyPayment = consolidatedLoan.installments[0].installment;
    const totalRepaymentNew = newMonthlyPayment * months;
    const overallSavings = totalRepaymentCurrent - totalRepaymentNew;

    setTotalAmount(total);
    setMonthlySavings(overallSavings);
    setOverallRepayment(totalRepaymentNew);
    setTotalRepaymentCurrent(totalRepaymentCurrent);
    setMinMonthlyPaymentCurrent(minMonthlyPaymentCurrent);
    setMinMonthlyPaymentConsolidated(newMonthlyPayment);
    setCalculated(true);
  };

  return (
    <BlurryBackground>
      <CardContent>
        <Typography variant="h5" align="center" gutterBottom>
          Debt Consolidation Savings Calculator
        </Typography>
        <Typography variant="body1" gutterBottom>
          Enter the details of your current unsecured debt and see how much you
          may be able to save after consolidating the debts into a single loan.
          Only include credit card debt, medical debt, personal loan debt, and
          other types of unsecured debt.
        </Typography>
        <Typography variant="h6" gutterBottom>
          Enter Your Current Debts
        </Typography>
        {debts.map((debt, index) => (
          <Grid container spacing={2} key={index} sx={{ mb: "16px" }}>
            <Grid item xs={12}>
              <TextField
                label="Debt Name"
                fullWidth
                value={debt.name}
                onChange={(e) =>
                  handleDebtChange(index, "name", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Remaining Debt Amount"
                fullWidth
                value={debt.amount}
                onChange={(e) =>
                  handleDebtChange(index, "amount", e.target.value)
                }
                InputProps={{ startAdornment: "$" }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Current APR"
                fullWidth
                value={debt.apr}
                onChange={(e) => handleDebtChange(index, "apr", e.target.value)}
                InputProps={{ endAdornment: "%" }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Current Monthly Payment"
                fullWidth
                value={debt.payment}
                onChange={(e) =>
                  handleDebtChange(index, "payment", e.target.value)
                }
                InputProps={{ startAdornment: "$" }}
              />
            </Grid>
          </Grid>
        ))}
        <IconButton onClick={handleAddDebt} color="primary">
          <AddCircleOutlineIcon />
          <Typography variant="body2" color="primary" style={{ marginLeft: 8 }}>
            Add Another Debt
          </Typography>
        </IconButton>

        <Typography variant="h6" gutterBottom style={{ marginTop: 16 }}>
          Consolidated Loan Details
        </Typography>
        <Grid container spacing={2} sx={{ mb: "16px" }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Months"
              fullWidth
              value={months}
              onChange={(e) => setMonts(Number(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="APR (%)"
              fullWidth
              value={Math.round(apr * 100) / 100}
              onChange={(e) => setApr(Number(e.target.value) || 0)}
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: 16 }}
          onClick={handleCalculateSavings}
        >
          Calculate Savings
        </Button>
        {calculated && (
          <Box>
            <Typography variant="h6" align="left" style={{ marginTop: 16 }}>
              The amount of the new loan will be $
              {Math.round(totalAmount * 100) / 100}
            </Typography>
            <Typography variant="h6" align="left" style={{ marginTop: 8 }}>
              The average APR of your current debts is{" "}
              {Math.round(averageAPR * 100) / 100}%
            </Typography>
            <Typography variant="h6" align="left" style={{ marginTop: 8 }}>
              Total Repayment for Current Debts: $
              {Math.round(totalRepaymentCurrent * 100) / 100}
            </Typography>
            <Typography variant="h6" align="left" style={{ marginTop: 8 }}>
              Total Repayment for Consolidated Loan: $
              {Math.round(overallRepayment * 100) / 100}
            </Typography>
            <Typography variant="h6" align="left" style={{ marginTop: 8 }}>
              Your estimated overall savings with Consolidated Loan will be $
              {Math.round(monthlySavings * 100) / 100}
            </Typography>
            <Typography variant="h6" align="left" style={{ marginTop: 8 }}>
              Minimum Monthly Payment for Current Debts: $
              {Math.round(minMonthlyPaymentCurrent * 100) / 100}
            </Typography>
            <Typography variant="h6" align="left" style={{ marginTop: 8 }}>
              Minimum Monthly Payment for Consolidated Loan: $
              {Math.round(minMonthlyPaymentConsolidated * 100) / 100}
            </Typography>
          </Box>
        )}
      </CardContent>
    </BlurryBackground>
  );
};

export default DebtSavingsCalculator;
