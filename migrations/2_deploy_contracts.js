const League = artifacts.require("League");
const Season = artifacts.require("Season");

module.exports = function(deployer) {
    deployer.deploy(League, 'Rainbow Dot Official League');
    deployer.deploy(Season);
};