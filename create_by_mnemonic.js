var bip39 = require('bip39')
var hdkey = require('ethereumjs-wallet/hdkey')
var util = require('ethereumjs-util')

// var mnemonic = bip39.generateMnemonic()
// console.log(mnemonic)

// 生成助记词
var mnemonic = "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat"; // bip39.generateMnemonic()
console.log("助记词："+ mnemonic );

// var seed = bip39.mnemonicToSeed(mnemonic)
var seed = bip39.mnemonicToSeed(mnemonic);
var hdWallet = hdkey.fromMasterSeed(seed);

var key1 = hdWallet.derivePath("m/44'/60'/0'/0/1");
console.log("私钥："+util.bufferToHex(key1._hdkey._privateKey));

var address1 = util.pubToAddress(key1._hdkey._publicKey, true);
console.log("地址："+util.bufferToHex(address1));



console.log("校验和地址："+ util.toChecksumAddress(address1.toString('hex')));
