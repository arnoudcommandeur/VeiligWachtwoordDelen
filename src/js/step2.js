App = {

  keySender: null,
  keyReciever: null,

  init: function() {
    //alert('App.init');
    App.keyReciever = nacl.box.keyPair();
    console.log(App.keyReciever.publicKey);

    const btnStart = document.querySelector('#start');
    const btnStep1 = document.querySelector('#step1');
    const btnStep2 = document.querySelector('#step2');

    btnStep2.addEventListener('click', async function(event){
      App.sendPublicKey();
    });

    return true;
  },

  sendPublicKey: function() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const nonce = urlParams.get('nonce');
    const publicKeySender = urlParams.get('publicKeySender');
    const afzender = urlParams.get('afzender');
    const omschrijving = urlParams.get('omschrijving');
    console.log(nonce);
    console.log(publicKeySender);

    ontvanger = afzender;

    email = document.getElementById("ontvanger").value;  
    omschrijving = document.getElementById("omschrijving").value

    // //cipher = nacl.box(nacl.util.decodeUTF8(message), nonce, keySender.publicKey, keySender.secretKey);

    // var mail = "mailto:" + email
    // mail += "?subject=Aanvraag voor wachtwoord uitwisseling"

    // body = "Hallo " + ontvanger + ", \n\n"
    // body += "U ontvangt deze email voor het veilig uitwisselen van een wachtwoord tbv " + omschrijving + ". \n\n"
    // body += "Klik op de link om het proces op te starten: "
    // body += "http://localhost:3000/step2.html?nonce=" + nonce + "&publicKeySender=" + nacl.util.encodeBase64(App.keySender.publicKey);

    // mail += "&body=" + encodeURIComponent(body);

    // console.log("Public Key=" + nacl.util.encodeBase64(App.keySender.publicKey));
    // console.log("Nonce=" + nonce);
    // var mlink = document.createElement('a');
    // mlink.setAttribute('href', mail);
    // mlink.click();

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
