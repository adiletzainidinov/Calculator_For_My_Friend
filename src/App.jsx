import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const StyledTable = styled.table`
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 18px;
  text-align: left;
  width: 100%;

  @media (max-width: 550px) {
    border: 0;
  }
`;

const Th = styled.th`
  padding: 12px 15px;
  background-color: #009879;
  color: #ffffff;

  @media (max-width: 550px) {
    padding: 10px 5px;
    display: block;
    text-align: right;
    font-size: 16px;
    border-bottom: 1px solid #dddddd;
  }
`;

const Td = styled.td`
  padding: 12px 15px;

  @media (max-width: 550px) {
    padding: 10px 5px;
    display: block;
    text-align: right;
    font-size: 16px;
    border-bottom: 1px solid #dddddd;
    &:before {
      content: attr(data-label);
      float: left;
      font-weight: bold;
      text-transform: uppercase;
    }
  }
`;

const Thead = styled.thead`
  background-color: #009879;
  color: #ffffff;
  text-align: left;

  @media (max-width: 550px) {
    display: none;
  }
`;

const Tbody = styled.tbody`
  tr {
    border-bottom: 1px solid #dddddd;

    &:nth-of-type(even) {
      background-color: #f3f3f3;
    }

    &:last-of-type {
      border-bottom: 2px solid #009879;
    }

    &.active-row {
      font-weight: bold;
      color: #009879;
    }

    @media (max-width: 550px) {
      display: block;
      margin-bottom: 0.625em;
    }
  }
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #009879;
  color: #fff;
  border: none;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 20px;
  margin-left: 10px;

  &:hover {
    background-color: #007f67;
  }
`;

function App() {
  const [amounts, setAmounts] = useState([]);
  const [currentAmount, setCurrentAmount] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const savedAmounts = localStorage.getItem('amounts');
    if (savedAmounts) {
      setAmounts(JSON.parse(savedAmounts));
    }

    const savedResults = localStorage.getItem('results');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  const calculatePercentage = (sum) => {
    if (sum > 6500) return 40;
    if (sum > 4900 && sum <= 6500) return 40;
    if (sum > 3700 && sum <= 4900) return 35;
    if (sum > 2700 && sum <= 3700) return 30;
    if (sum > 2200 && sum <= 2200) return 25;
    if (sum <= 2200) return 20;

    return 0;
  };

  const calculateDailyReduction = (sum) => {
    const percentage = calculatePercentage(sum);
    const percentageAmount = sum * (percentage / 100);
    const reducedAmount = sum - percentageAmount;
    let days = 1;
    const dailyReductions = [];

    let remainingAmount = 1000;
    dailyReductions.push(remainingAmount);

    const totalDailyReductions = dailyReductions.reduce(
      (acc, val) => acc + val,
      0
    );
    const finalProfit = reducedAmount - totalDailyReductions;

    return {
      percentage,
      reducedAmount,
      days,
      percentageAmount,
      dailyReductions,
      finalProfit,
    };
  };

  const handleInputClick = () => {
    if (currentAmount) {
      const result = calculateDailyReduction(parseFloat(currentAmount));
      setResults([...results, result]);
      setAmounts([...amounts, currentAmount]);
      setCurrentAmount('');
      localStorage.setItem('results', JSON.stringify([...results, result]));
      localStorage.setItem(
        'amounts',
        JSON.stringify([...amounts, currentAmount])
      );
    }
  };

  const handleInputChange = (e) => {
    setCurrentAmount(e.target.value);
  };

  const handleDeleteRow = (index) => {
    const newAmounts = [...amounts];
    const newResults = [...results];
    newAmounts.splice(index, 1);
    newResults.splice(index, 1);
    setAmounts(newAmounts);
    setResults(newResults);
    localStorage.setItem('amounts', JSON.stringify(newAmounts));
    localStorage.setItem('results', JSON.stringify(newResults));
  };

  return (
    <>
      <Input
        type="number"
        value={currentAmount}
        onChange={handleInputChange}
        placeholder="Напишите сумму"
      />
      <Button onClick={handleInputClick}>Добавить</Button>
      {results.length > 0 && (
        <StyledTable>
          <Thead>
            <tr>
              <Th>Сумма грязная</Th>
              <Th>Процент</Th>
              <Th>Заработок водителя</Th>
              <Th>Бензин</Th>
              <Th>Период</Th>
              <Th>Итоговая прибыль</Th>
              <Th>Удаление</Th>
            </tr>
          </Thead>
          <Tbody>
            {results.map((result, index) => (
              <tr key={index} className="active-row">
                <Td data-label="Сумма грязная">{amounts[index]}</Td>
                <Td data-label="Процент">{result.percentage}%</Td>
                <Td data-label="Заработок водителя">
                  {result.percentageAmount.toFixed(2)}
                </Td>
                <Td data-label="Бензин">
                  {result.dailyReductions.join(', ')}
                </Td>
                <Td data-label="Период">{result.days} день</Td>
                <Td
                  data-label="Итоговая прибыль"
                >
                  {result.finalProfit.toFixed(2)}
                </Td>
                <Td data-label="Удаление">
                  <Button onClick={() => handleDeleteRow(index)}>Удалить</Button>
                </Td>
              </tr>
            ))}
          </Tbody>
        </StyledTable>
      )}
    </>
  );
}

export default App;
