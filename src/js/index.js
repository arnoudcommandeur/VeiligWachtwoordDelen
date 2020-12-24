App = {

  keySender: null,

  init: function() {
    //alert('App.init');
    App.keySender = nacl.box.keyPair();
    console.log(App.keySender.publicKey);


    const btnStart = document.querySelector('#start');
    const btnStep1 = document.querySelector('#step1');
    const btnStep2 = document.querySelector('#step2');

    btnStart.addEventListener('click', async function(event){
      App.Start();
    });
    btnStep1.addEventListener('click', async function(event){
      App.initEncrypt();
    });
    btnStep2.addEventListener('click', async function(event){
      App.Start();
    });

    return true;
  },

  initEncrypt: function() {

    nonce = nacl.util.encodeBase64(nacl.randomBytes(nacl.box.nonceLength));
    ontvanger = document.getElementById("ontvanger").value;  
    afzender = document.getElementById("afzender").value;  
    email = document.getElementById("geadresserde").value;  
    omschrijving = document.getElementById("omschrijving").value

    //cipher = nacl.box(nacl.util.decodeUTF8(message), nonce, keySender.publicKey, keySender.secretKey);

    var mail = "mailto:" + email
    mail += "?subject=Public key retourbericht voor wachtwoord uitwisseling"

    body = "Hallo " + ontvanger + ", \n\n"
    body += "U ontvangt deze email voor het veilig uitwisselen van een wachtwoord tbv " + omschrijving + ". \n\n"
    body += "Klik op de link om het proces op te starten: "
    body += "http://localhost:3000/step2.html?nonce=" + encodeURIComponent(nonce) + "&publicKeySender=" + encodeURIComponent(nacl.util.encodeBase64(App.keySender.publicKey)) + "&afzender=" + encodeURIComponent(afzender) + "&omschrijving=" + encodeURIComponent(omschrijving);

    mail += "&body=" + encodeURIComponent(body); 

    console.log("Public Key=" + nacl.util.encodeBase64(App.keySender.publicKey));
    console.log("Nonce=" + nonce);
    var mlink = document.createElement('a');
    mlink.setAttribute('href', mail);
    mlink.click();

    //alert(cipher);
    return true;
  }
  // end App
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
