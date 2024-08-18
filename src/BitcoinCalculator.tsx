import React, { useState } from 'react';

const BitcoinCalculator: React.FC = () => {
  const [investment, setInvestment] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [targetProfit, setTargetProfit] = useState('');
  const [brokerCommission, setBrokerCommission] = useState('');
  const [calculationType, setCalculationType] = useState('current');
  const [result, setResult] = useState<string | null>(null);

  const calculateProfit = () => {
    const investmentAmount = parseFloat(investment);
    const buyPriceValue = parseFloat(buyPrice);
    const commissionRate = parseFloat(brokerCommission) / 100;

    if (isNaN(investmentAmount) || isNaN(buyPriceValue) || isNaN(commissionRate)) {
      setResult('Por favor, ingrese valores numéricos válidos para la inversión, precio de compra y comisión del broker.');
      return;
    }

    const buyCommission = investmentAmount * commissionRate;
    const effectiveInvestment = investmentAmount - buyCommission;
    const bitcoinAmount = effectiveInvestment / buyPriceValue;

    if (calculationType === 'current') {
      const currentPriceValue = parseFloat(currentPrice);
      if (isNaN(currentPriceValue)) {
        setResult('Por favor, ingrese un valor numérico válido para el precio actual.');
        return;
      }

      const currentValue = bitcoinAmount * currentPriceValue;
      const sellCommission = currentValue * commissionRate;
      const netValue = currentValue - sellCommission;
      const profit = netValue - investmentAmount;
      const profitPercentage = (profit / investmentAmount) * 100;

      setResult(`
        Cantidad de Bitcoin: ${bitcoinAmount.toFixed(8)} BTC
        Inversión efectiva: $${effectiveInvestment.toFixed(2)} USDT
        Comisión de compra: $${buyCommission.toFixed(2)} USDT
        Valor actual bruto: $${currentValue.toFixed(2)} USDT
        Comisión de venta: $${sellCommission.toFixed(2)} USDT
        Valor actual neto: $${netValue.toFixed(2)} USDT
        Ganancia/Pérdida neta: $${profit.toFixed(2)} USDT (${profitPercentage.toFixed(2)}%)
      `);
    } else {
      const targetProfitPercentage = parseFloat(targetProfit);
      if (isNaN(targetProfitPercentage)) {
        setResult('Por favor, ingrese un valor numérico válido para el porcentaje de ganancia objetivo.');
        return;
      }

      const requiredProfit = investmentAmount * (targetProfitPercentage / 100);
      const totalRequired = investmentAmount + requiredProfit + buyCommission;
      const grossRequired = totalRequired / (1 - commissionRate);
      const targetSellPrice = grossRequired / bitcoinAmount;
      const sellCommission = grossRequired * commissionRate;

      setResult(`
        Cantidad de Bitcoin: ${bitcoinAmount.toFixed(8)} BTC
        Inversión efectiva: $${effectiveInvestment.toFixed(2)} USDT
        Comisión de compra: $${buyCommission.toFixed(2)} USDT
        Precio de venta objetivo: $${targetSellPrice.toFixed(2)} USDT
        Valor bruto objetivo: $${grossRequired.toFixed(2)} USDT
        Comisión de venta estimada: $${sellCommission.toFixed(2)} USDT
        Valor neto objetivo: $${totalRequired.toFixed(2)} USDT
        Ganancia neta proyectada: $${requiredProfit.toFixed(2)} USDT (${targetProfitPercentage.toFixed(2)}%)
      `);
    }
  };
  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Calculadora Bitcoin-USDT con Comisión</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="investment">
          Inversión (USDT):
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="investment"
          type="number"
          value={investment}
          onChange={(e) => setInvestment(e.target.value)}
          placeholder="Ej. 1000"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="buyPrice">
          Precio de compra (USDT):
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="buyPrice"
          type="number"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          placeholder="Ej. 30000"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="brokerCommission">
          Comisión del broker (%):
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="brokerCommission"
          type="number"
          value={brokerCommission}
          onChange={(e) => setBrokerCommission(e.target.value)}
          placeholder="Ej. 0.1"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Tipo de cálculo:
        </label>
        <div>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              className="form-radio"
              name="calculationType"
              value="current"
              checked={calculationType === 'current'}
              onChange={() => setCalculationType('current')}
            />
            <span className="ml-2">Precio actual</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="calculationType"
              value="target"
              checked={calculationType === 'target'}
              onChange={() => setCalculationType('target')}
            />
            <span className="ml-2">Ganancia objetivo</span>
          </label>
        </div>
      </div>
      {calculationType === 'current' ? (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPrice">
            Precio actual (USDT):
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="currentPrice"
            type="number"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            placeholder="Ej. 35000"
          />
        </div>
      ) : (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="targetProfit">
            Ganancia objetivo (%):
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="targetProfit"
            type="number"
            value={targetProfit}
            onChange={(e) => setTargetProfit(e.target.value)}
            placeholder="Ej. 4"
          />
        </div>
      )}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={calculateProfit}
      >
        Calcular
      </button>
      {result && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
};

export default BitcoinCalculator;
