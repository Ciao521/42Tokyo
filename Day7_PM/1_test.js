const LendableSBT  = artifacts.require("LendableSBT");

module.exports = function (deployer) { 
  deployer.deploy(LendableSBT,"Name","LEN",true);
};
