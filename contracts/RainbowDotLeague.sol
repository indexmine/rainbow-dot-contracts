pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Secondary.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Oracle.sol";
import {Season, Forecast} from "./Types.sol";

contract RainbowDotLeague is Secondary {
    using SafeMath for uint256;
    using Forecast for Forecast.Object;
    using Season for Season.Object;

    uint256 constant MINIMUM_PERIODS_OF_SEASON = 100;

    Oracle public oracle;
    address rainbowDot;
    function(address, uint256) external takeRDot;
    function(address[] memory, int256[] memory) external onResult;
    string[] seasonList;
    mapping(string => Season.Object) seasons;

    modifier onlyRainbowDot {
        require(msg.sender == rainbowDot);
        _;
    }

    constructor (address _oracle) public Secondary() {
        oracle = Oracle(_oracle);
    }

    function register(address _rainbowDot) public onlyPrimary {
        require(address(rainbowDot) == address(0));
        rainbowDot = _rainbowDot;
    }

    function accept(function(address, uint256) external _takeRDot, function(address[] memory, int256[] memory) external _onResult) onlyRainbowDot {
        takeRDot = _takeRDot;
        onResult = _onResult;
    }

    function newSeason(
        string _name,
        uint256 _code,
        uint256 _startTime,
        uint256 _finishTime,
        uint256 _secondsPerFrame,
        uint256 _framesPerPeriod
    ) public onlyPrimary {
        Season.Object storage season = seasons[_name];
        // Season list does not allow duplicates
        require(!season.isInitialized());

        // Creating a new season is only allowed for future forecasts.
        require(_startTime > now);
        require(_finishTime > _startTime);

        // Frame uint should not be zero
        require(_secondsPerFrame != 0);

        // Minimum period limit
        require(season.getMaximumFrame().div(_framesPerPeriod) >= MINIMUM_PERIODS_OF_SEASON);

        // Add the name of the season to the list
        seasonList.push(_name);

        // Set detail information of the season
        season.name = _name;
        season.code = _code;
        season.startTime = _startTime;
        season.finishTime = _finishTime;
        season.secondsPerFrame = _secondsPerFrame;
        season.framesPerPeriod = _framesPerPeriod;
    }

    function openForecast(string _season, uint256 _rDots, uint256 _periods, uint256 _targetPrice) external returns (bytes32 forecastId) {
        return _forecast(msg.sender, _season, _rDots, _periods, keccak256(abi.encodePacked(_targetPrice, uint256(0))), _targetPrice);
    }

    function sealedForecast(string _season, uint256 _rDots, uint256 _periods, bytes32 _targetPrice) external returns (bytes32 forecastId){
        return _forecast(msg.sender, _season, _rDots, _periods, _targetPrice, 0);
    }

    function _forecast(
        address _user,
        string _season,
        uint256 _rDots,
        uint256 _periods,
        bytes32 _hashedTargetPrice,
        uint256 _targetPrice
    ) private returns (bytes32 forecastId) {
        Season.Object storage season = seasons[_season];
        // Season should be initialized
        require(season.isInitialized());

        // Season should be on going
        require(season.isOnGoing());

        // Target timestamp can not be greater than the finish time of the season
        uint256 targetTimestamp = season.secondsPerFrame.mul(season.framesPerPeriod).mul(_periods).add(now);
        uint256 targetFrame = season.getFrame(targetTimestamp);
        require(targetFrame <= season.getMaximumFrame());

        // Spend RDot
        takeRDot(_user, _rDots);

        // Create forecast object and add it to the Season object
        Forecast.Object memory forecast;
        forecast.user = _user;
        forecast.code = season.code;
        forecast.rDots = _rDots;
        forecast.startFrame = season.getFrame(now);
        forecast.targetFrame = targetFrame;
        forecast.hashedTargetPrice = _hashedTargetPrice;
        forecast.targetPrice = _targetPrice;
        forecastId = season.addForecast(forecast);
    }

    function commitValue(string _season, bytes32 _forecastId, uint256 _value, uint _nonce) external {
        Season.Object storage season = seasons[_season];
        // Check initialization
        require(season.isInitialized());
        require(season.forecasts[_forecastId].isInitialized());
        // Commit value
        season.forecasts[_forecastId].commitValue(_value, _nonce);
    }

    function commitData(string _season, uint256 _timestamp, uint256 _code, uint256 _value, bytes _signature) public {
        Season.Object storage season = seasons[_season];
        // Check season data
        require(season.code == _code);
        require(season.startTime <= _timestamp);
        require(season.finishTime >= _timestamp);

        // Check signature
        require(oracle.isVerified(abi.encodePacked(_timestamp, _code, _value), _signature));

        // Check initialization
        require(season.isInitialized());

        // Check initialization
        season.addPriceData(season.getFrame(_timestamp), _value);
    }

    function close(string _season) public {
        Season.Object storage season = seasons[_season];
        // Check initialization
        require(season.isInitialized());

        address[] memory users;
        int256[] memory rScores;
        (users, rScores) = season.calculateResult();
        onResult(users, rScores);
    }
}
