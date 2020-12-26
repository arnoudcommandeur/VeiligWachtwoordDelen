App = {

  myKey: null,

  init: function() {
    //alert('App.init');
    App.myKey = nacl.box.keyPair();

// Test keys
App.myKey = nacl.box.keyPair.fromSecretKey(nacl.util.decodeBase64("uFLncLOPoQ+zb+0wZAyOmjYHdp/naGv8byibgJL9fOc="))


    console.log(App.myKey.publicKey);
    console.log(App.myKey.secretKey);

    //console.log(App.myKey.publicKey);
    const btncreateEmail = document.querySelector('#createEmail');

    // btncreateEmail.addEventListener('click', async function(event){
    //   App.createEmail();
    // });
    App.decrypt();

    return true;
  },

  decrypt: function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    omschrijving = decodeURIComponent(urlParams.get('omschrijving'));


    nonce = nacl.util.decodeBase64(decodeURIComponent(urlParams.get('nonce')));  
    publicKeySender = nacl.util.decodeBase64(decodeURIComponent(urlParams.get('publicKeySender')));  

    cipher = nacl.util.decodeBase64(decodeURIComponent(urlParams.get('cipher')));

    plaintext = nacl.box.open(cipher, nonce, publicKeySender, App.myKey.secretKey);
//return;
    document.getElementById("omschrijving").innerHTML = omschrijving;
    document.getElementById("wachtwoord").innerHTML = nacl.util.encodeUTF8(plaintext);

    return true;
  }
  // end App
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
