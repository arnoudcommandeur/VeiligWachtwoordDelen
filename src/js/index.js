App = {
  web3Provider: null,
  contracts: {},
  account: null,
  logresult: null,

  init: function() {
    //alert('App.init');
    const btnStart = document.querySelector('#start');
    const btnStep1 = document.querySelector('#step1');
    const btnStep2 = document.querySelector('#step2');

    btnStart.addEventListener('click', async function(event){
      App.Start();
    });
    btnStep1.addEventListener('click', async function(event){
      App.encrypt();
    });
    btnStep2.addEventListener('click', async function(event){
      App.Start();
    });

    return true;
  },

  encrypt: function() {

    keyReciever = nacl.box.keyPair();
    keySender = nacl.box.keyPair();

    nonce = nacl.randomBytes(nacl.box.nonceLength);  
    cipher = nacl.box(nacl.util.decodeUTF8("test"), nonce, keyReciever.publicKey, keySender.secretKey);

    alert(cipher);
  }
  // end App
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
