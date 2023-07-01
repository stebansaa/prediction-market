# Prediction Market Contract

This Solidity contract represents a prediction market where participants can buy shares for different outcomes and potentially earn profits based on the resolved outcome.

## Contract Details

- Contract Name: `PredictionMarket`
- SPDX License Identifier: `MIT`
- Solidity Version: `0.8.0`

## Contract Structure

The contract consists of the following components:

### Enum

- `Outcome`: An enumeration representing the possible outcomes of the prediction market. It includes the following values:
  - `NotSet`: Default value indicating that the outcome is not set.
  - `OutcomeOne`: The first outcome.
  - `OutcomeTwo`: The second outcome.

### Struct

- `Market`: A structure containing the information about the prediction market. It includes the following fields:
  - `totalShares`: The total number of shares available in the market.
  - `sharesSold`: The total number of shares sold in the market.
  - `outcomeOneShares`: The number of shares bought for outcome one.
  - `outcomeTwoShares`: The number of shares bought for outcome two.
  - `closed`: A flag indicating if the market is closed for trading.
  - `resolved`: A flag indicating if the market outcome is resolved.
  - `outcome`: The resolved outcome of the market, represented using the `Outcome` enum.

### Storage Variables

- `balances`: A mapping that stores the balances of participants. It maps an address to the corresponding balance.
- `shares`: A nested mapping that stores the shares bought by participants. It maps an address to a mapping of `Outcome` to the number of shares bought.
- `market`: A public variable representing the current state of the market, including the totalShares and other market details.

### Events

The contract emits the following events:

- `MarketCreated`: Triggered when the market is created, and it includes the `totalShares` value as an argument.
- `MarketClosed`: Triggered when the market is closed for trading.
- `MarketResolved`: Triggered when the market outcome is resolved, and it includes the `outcome` value as an argument.

### Modifiers

The contract includes the following modifiers:

- `onlyOracle`: Ensures that only the trusted oracle can call the function using this modifier.
- `marketOpen`: Checks that the market is open for trading and not yet resolved.
- `marketClosed`: Checks that the market is closed for trading.
- `marketResolved`: Checks that the market outcome is resolved.

### Constructor

- `constructor(uint256 _totalShares)`: Initializes the contract by setting the `totalShares` value provided as an argument and emits the `MarketCreated` event.

### Functions

The contract includes the following functions:

- `buyShares(Outcome _outcome, uint256 _amount)`: Allows participants to buy shares for a specific outcome. It takes the outcome and the amount of shares to buy as arguments. Participants must send the correct amount of Ether as payment.
- `closeMarket()`: Closes the market for trading if all shares are sold.
- `resolveMarket(Outcome _outcome)`: Resolves the market outcome by the trusted oracle. Only the oracle can call this function and provide the resolved outcome as an argument.
- `withdraw()`: Allows participants to withdraw their earnings after the market outcome is resolved.

## Usage

To use the contract, follow these steps:

1. Deploy the contract to a compatible Ethereum blockchain network using a suitable development environment or a blockchain platform.
2. Pass the desired `totalShares` value to the constructor during deployment to set the total number of shares available in the market.
3. Use the appropriate account or contract to interact with the contract functions:
   - Call the `buyShares` function to buy shares for a specific outcome by providing the outcome (`Outcome.OutcomeOne` or `Outcome.OutcomeTwo`) and the amount of shares to buy. Make sure to include the correct Ether value matching the cost of the shares.
   - If necessary, call the `closeMarket` function to close the market for trading.
   - Use the trusted oracle account to call the `resolveMarket` function and provide the resolved outcome as an argument.
   - After the market outcome is resolved, participants can call the `withdraw` function to withdraw their earnings based on the outcome.

## License

This contract is released under the MIT License.

