const realEstateTransaction = artifacts.require("realEstateTransaction");

module.exports = function (deployer) {
  deployer.deploy(realEstateTransaction);
};
