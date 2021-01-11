App = {

  keySender: null,

  init: async function() {
    //alert('App.init');
    App.keySender = nacl.box.keyPair();

    //console.log(App.keySender.publicKey);
    const btnSendMessage = document.querySelector('#btnSendMessage');

    btnSendMessage.addEventListener('click', async function(event){
      await App.sendMessage();
    });

    return true;
  },

  sendMessage: async function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    nonce = nacl.randomBytes(nacl.box.nonceLength);  

    name = urlParams.get('name'); 
    emailAddress = urlParams.get('emailAddress');  
    publicKeyReciever = urlParams.get('publicKeyReciever');
    publicKeySender = App.keySender.publicKey;
    //console.log(publicKeySender);
    description = document.getElementById("txtDescription").value
    secret = document.getElementById("txtSecret").value

    if (publicKeyReciever == null) {
        alert('Er is een fout opgetreden. Public key van de ontvanger is onbekend. Scan QR code van de ontvanger of gebruik een link van de geadresseerde en probeer opnieuw.');
        return;
    }

    cipher = nacl.box(nacl.util.decodeUTF8(secret), nonce, nacl.util.decodeBase64(decodeURIComponent(publicKeyReciever)), App.keySender.secretKey);

    var mail = "mailto:" + emailAddress
    mail += "?subject=Versleuteld bericht"

    body = "Hallo " + name + ", \n\n"
    body += "U ontvangt deze email voor het veilig uitwisselen van een wachtwoord tbv " + description + ". \n\n"
    body += "Klik op de link op een computer met de juiste sleutel om het wachtwoord te ontcijferen: "
    //body += "http://veiligwachtwoordsturen.web.app/decrypt.html?nonce=" + encodeURIComponent(nacl.util.encodeBase64(nonce)) + "&description=" + encodeURIComponent(description) + "&cipher=" + encodeURIComponent(nacl.util.encodeBase64(cipher)) + "&publicKeySender=" + encodeURIComponent(nacl.util.encodeBase64(publicKeySender));
    body += window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + "/decrypt.html?nonce=" + encodeURIComponent(nacl.util.encodeBase64(nonce)) + "&description=" + encodeURIComponent(description) + "&cipher=" + encodeURIComponent(nacl.util.encodeBase64(cipher)) + "&publicKeySender=" + encodeURIComponent(nacl.util.encodeBase64(publicKeySender));
    body += "\n\nU wordt aangeraden dit bericht na gebruik direct permanent te verwijderen uit uw mailbox.";

    mail += "&body=" + encodeURIComponent(body); 

    console.log(mail);

    var mlink = document.createElement('a');
    mlink.setAttribute('href', mail);
    mlink.click();

    location.href = 'index.html'
    return true;
  }
  // end App
};

$(function() {
  $(window).load(async function() {
    await App.init();
  });
});
