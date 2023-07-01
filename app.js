// Import the necessary libraries
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import PredictionMarketContract from 'path/to/PredictionMarket.json';

function App() {
  // State variables
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [market, setMarket] = useState(null);
  const [outcome, setOutcome] = useState(0);
  const [amount, setAmount] = useState(0);

  // Initialize web3 and the contract
  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        try {
          await window.ethereum.enable();
          const web3 = new Web3(window.ethereum);
          const networkId = await web3.eth.net.getId();
          const contractData = PredictionMarketContract.networks[networkId];
          const contract = new web3.eth.Contract(
            PredictionMarketContract.abi,
            contractData.address
          );
          const accounts = await web3.eth.getAccounts();

          setWeb3(web3);
          setContract(contract);
          setAccount(accounts[0]);
        } catch (error) {
          console.error(error);
        }
      }
    }

    init();
  }, []);

  // Fetch market information
  useEffect(() => {
    async function fetchMarket() {
      if (contract) {
        try {
          const totalShares = await contract.methods.totalShares().call();
          const sharesSold = await contract.methods.sharesSold().call();
          const outcomeOneShares = await contract.methods.outcomeOneShares().call();
          const outcomeTwoShares = await contract.methods.outcomeTwoShares().call();
          const closed = await contract.methods.market.closed().call();
          const resolved = await contract.methods.market.resolved().call();
          const outcome = await contract.methods.market.outcome().call();

          setMarket({
            totalShares,
            sharesSold,
            outcomeOneShares,
            outcomeTwoShares,
            closed,
            resolved,
            outcome,
          });
        } catch (error) {
          console.error(error);
        }
      }
    }

    fetchMarket();
  }, [contract]);

  // Event handlers
  const handleOutcomeChange = (event) => {
    setOutcome(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleBuyShares = async () => {
    if (contract && account && amount > 0) {
      try {
        const outcomeEnum = parseInt(outcome);
        await contract.methods.buyShares(outcomeEnum, amount).send({
          from: account,
          value: web3.utils.toWei(amount.toString(), 'ether'),
        });
        // Refresh market information
        setOutcome(0);
        setAmount(0);
        await fetchMarket();
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Render the frontend
  return (
    <div>
      <h1>Prediction Market</h1>
      {market && (
        <div>
          <h2>Market Information</h2>
          <p>Total Shares: {market.totalShares}</p>
          <p>Shares Sold: {market.sharesSold}</p>
          <p>Outcome One Shares: {market.outcomeOneShares}</p>
          <p>Outcome Two Shares: {market.outcomeTwoShares}</p>
          <p>Market Closed: {market.closed.toString()}</p>
          <p>Market Resolved: {market.resolved.toString()}</p>
          <p>Current Outcome: {market.outcome}</p>
        </div>
      )}
      {account && (
        <div>
          <h2>Buy Shares</h2>
          <label>
            Outcome:
            <select value={outcome} onChange={handleOutcomeChange}>
              <option value="0">Not Set</option>
              <option value="1">Outcome One</option>
              <option value="2">Outcome Two</option>
            </select>
          </label>
          <br />
          <label>
            Amount:
            <input type="number" value={amount} onChange={handleAmountChange} />
          </label>
          <br />
          <button onClick={handleBuyShares}>Buy Shares</button>
        </div>
      )}
    </div>
  );
}

export default App;
