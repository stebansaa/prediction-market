// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract PredictionMarket {
    enum Outcome { NotSet, OutcomeOne, OutcomeTwo }

    struct Market {
        uint256 totalShares;
        uint256 sharesSold;
        uint256 outcomeOneShares;
        uint256 outcomeTwoShares;
        bool closed;
        bool resolved;
        Outcome outcome;
    }  

    mapping(address => uint256) public balances;
    mapping(address => mapping(Outcome => uint256)) public shares;

    Market public market;

    event MarketCreated(uint256 totalShares);
    event MarketClosed();
    event MarketResolved(Outcome outcome);

    modifier onlyOracle() {
        require(msg.sender == 0x083239ab8f3C53f587B44060f112de60ebBfdc54, "Only the trusted oracle can call this function");
        _;
    }

    modifier marketOpen() {
        require(!market.closed, "Market is closed");
        require(!market.resolved, "Market is already resolved");
        _;
    }

    modifier marketClosed() {
        require(market.closed, "Market is not closed");
        _;
    }

    modifier marketResolved() {
        require(market.resolved, "Market is not resolved");
        _;
    }

    constructor(uint256 _totalShares) {
        market.totalShares = _totalShares;
        emit MarketCreated(_totalShares);
    }

    function buyShares(Outcome _outcome, uint256 _amount) public payable marketOpen {
        require(market.sharesSold + _amount <= market.totalShares, "Insufficient shares available");
        uint256 cost = (_amount * 1 ether);
        require(msg.value == cost, "Incorrect amount of Ether sent");

        balances[msg.sender] += msg.value;
        shares[msg.sender][_outcome] += _amount;

        if (_outcome == Outcome.OutcomeOne) {
            market.outcomeOneShares += _amount;
        } else if (_outcome == Outcome.OutcomeTwo) {
            market.outcomeTwoShares += _amount;
        }

        market.sharesSold += _amount;
    }

    function closeMarket() public marketOpen {
        require(market.sharesSold == market.totalShares, "Not all shares are sold");

        market.closed = true;
        emit MarketClosed();
    }

    function resolveMarket(Outcome _outcome) public onlyOracle marketClosed {
        require(_outcome == Outcome.OutcomeOne || _outcome == Outcome.OutcomeTwo, "Invalid outcome");

        market.outcome = _outcome;
        market.resolved = true;

        emit MarketResolved(_outcome);
    }

    function withdraw() public marketResolved {
        uint256 totalShares = market.outcomeOneShares + market.outcomeTwoShares;
        require(totalShares > 0, "No shares owned or invalid outcome");

        uint256 amount = (balances[msg.sender] * shares[msg.sender][market.outcome]) / totalShares;
        require(amount > 0, "No shares owned or invalid outcome");

        balances[msg.sender] -= amount;
        shares[msg.sender][market.outcome] = 0;

        payable(msg.sender).transfer(amount);
    }
}
