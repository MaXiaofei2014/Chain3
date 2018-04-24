/*
 * Generate a transaction for mc transfer
 * in the MOAC test network
 * for testing MOAC wallet server
 * Test conditions:
 * 1. a pair of address/private key for testing, address need to have some balances.
 *    need to update the transaction nonce after each TX.
 * 2. an address to send to.
 * 
*/
//library used to compare two results.
var chai = require('chai');
var assert = chai.assert;

//libraries to generate the Tx
//MOAC chain3 lib
var Chain3 = require('../index.js');
var chain3 = new Chain3();


//test accounts
//Need to add the addr and private key
var taccts = [{
  "addr": "0x7312F4B8A4457a36827f185325Fd6B66a3f8BB8B", 
  "key": "c75a5f85ef779dcf95c651612efb3c3b9a6dfafb1bb5375905454d9fc8be8a6b"
},{
  "addr": "0xD814F2ac2c4cA49b33066582E4e97EBae02F2aB9", 
  "key": "4d2a8285624bd04c2b4ceaef3a3c122f133f09923f27217bb77de87e54075a16"
}];

/*
 * value - default is in MC, 
 * in Sha, 1 mc = 1e+18 Sha
*/
function sendTx(src, des, chainid, value){

var txcount = chain3.mc.getTransactionCount(src["addr"]);
console.log("Tx count", txcount);

    var rawTx = {
      from: src.addr,
      nonce: chain3.intToHex(txcount),
      // 1 gwei
      gasPrice: chain3.intToHex(40000000000),//chain3.intToHex(chain3.mc.gasPrice),//chain3.intToHex(400000000),
      gasLimit: chain3.intToHex(22000),
      to: des.addr, 
      value: chain3.intToHex(chain3.toSha(value, 'mc')), 
      data: '0x00',
      chainId: chainid
    }

    var cmd1 = chain3.signTransaction(rawTx, src["key"]);

    chain3.mc.sendRawTransaction(cmd1, function(err, hash) {
        if (!err){
            console.log("Succeed!: ", hash);
            return hash;
        }else{
            console.log("Chain3 error:", err.message);
            return err.message;
        }
    
    console.log("Get response from MOAC node in the feedback function!")
        // res.send(response);
    });

}

/*
 * display the balance value - default is in MC, 
 * in Sha, 1 mc = 1e+18 Sha
*/
function checkBal(inadd){
  var outval = chain3.mc.getBalance(inadd);
  //check input address
  return chain3.fromSha(outval.toString(),'mc');
}


//Set up the server to the MOAC node
chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));

for (i = 0; i < taccts.length; i ++)
  console.log("Acct[",i,"]:",taccts[i].addr, chain3.mc.getTransactionCount(taccts[i].addr), checkBal(taccts[i].addr));

//Call the function, note the input value is in 'mc'
var src = taccts[0];
var des = taccts[1];

var d2 ={
  "addr": "0x34F2E17437921304b64365A23262016589f506FC", 
  "key": ""
};//["addr"] = "0x34F2E17437921304b64365A23262016589f506FC";
// console.log(chain3.mc.gasPrice);
// return;
//Send the vaue in mc
//1 mc = 1e+18 Sha

//The sign of the transaction requires the correct network id

var networkid= 101
// sendTx(src, des, networkid, 100);
sendTx(src, d2, networkid, 100);


return;



