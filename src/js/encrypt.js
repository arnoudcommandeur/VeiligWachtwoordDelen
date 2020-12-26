App = {

  keySender: null,

  init: function() {
    //alert('App.init');
    App.keySender = nacl.box.keyPair();

  // Test keys!!!
  App.keySender = nacl.box.keyPair.fromSecretKey(nacl.util.decodeBase64("6uQevP9mtRUUz34MQb0bLgb7JEDMGyYVauhsy+zDGQ0="))

    //console.log(App.keySender.publicKey);
    const btncreateEmail = document.querySelector('#createEmail');

    btncreateEmail.addEventListener('click', async function(event){
      App.createEmail();
    });

    return true;
  },

  createEmail: function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    //nonce = nacl.util.encodeBase64(nacl.randomBytes(nacl.box.nonceLength));
    nonce = nacl.randomBytes(nacl.box.nonceLength);  
    //console.log(nonce);

    volledigeNaam = urlParams.get('volledigeNaam'); 
    emailAdres = urlParams.get('emailAdres');  
    publicKeyReciever = urlParams.get('publicKeyReciever');
    publicKeySender = App.keySender.publicKey;
    console.log(publicKeySender);
    omschrijving = document.getElementById("omschrijving").value
    message = document.getElementById("wachtwoord").value

    cipher = nacl.box(nacl.util.decodeUTF8(message), nonce, nacl.util.decodeUTF8(publicKeyReciever), App.keySender.secretKey);
    //console.log(cipher);

    var mail = "mailto:" + emailAdres
    mail += "?subject=Versleuteld bericht"

    body = "Hallo " + volledigeNaam + ", \n\n"
    body += "U ontvangt deze email voor het veilig uitwisselen van een wachtwoord tbv " + omschrijving + ". \n\n"
    body += "Klik op de link op een computer met de juiste sleutel om het wachtwoord te ontcijferen: "
    body += "http://localhost:3000/decrypt.html?nonce=" + encodeURIComponent(nacl.util.encodeBase64(nonce)) + "&omschrijving=" + encodeURIComponent(omschrijving) + "&cipher=" + encodeURIComponent(nacl.util.encodeBase64(cipher)) + "&publicKeySender=" + encodeURIComponent(nacl.util.encodeBase64(publicKeySender));
    body += "\n\nU wordt aangeraden dit bericht na gebruik direct permanent te verwijderen uit uw mailbox.";
    // "&publicKeySender=" + encodeURIComponent(nacl.util.encodeBase64(App.keySender.publicKey)) + 

    mail += "&body=" + encodeURIComponent(body); 


    console.log(mail);
//    console.log("Public Key=" + nacl.util.encodeBase64(App.keySender.publicKey));
//    console.log("Nonce=" + nonce);
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
