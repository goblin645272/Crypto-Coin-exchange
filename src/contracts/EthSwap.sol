pragma solidity ^0.5.16;

import "./Token.sol";

contract EthSwap {
    string public name = "Taksha's Exchange";
    Token public token;
    uint public rate = 100;
    constructor (Token _token)public{
        token = _token;
    }
    event TokenPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );
    event TokenSold(
        address account,
        address token,
        uint amount,
        uint rate
    );
    function buyTokens() public payable{
        uint tokenAmount = msg.value * rate;
        require(token.balanceOf(address(this)) >= tokenAmount);
        token.transfer(msg.sender, tokenAmount);
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint _amount) public{
        uint etherAmount = _amount / rate;
        require(address(this).balance >= etherAmount);
        token.transferFrom(msg.sender,address(this), _amount);
        msg.sender.transfer(etherAmount);
        emit TokenSold(msg.sender, address(token), _amount, rate);
    }
}