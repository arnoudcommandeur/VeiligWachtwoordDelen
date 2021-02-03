App = {

  keySender: null,

  init: async function() {

    App.keySender = nacl.box.keyPair();
    const btnSendMessage = document.querySelector('#btnSendMessage');

    btnSendMessage.addEventListener('click', async function(event){
      await App.sendMessage();
    });

    return true;
  },

  sendMessage: async function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    nonceD = nacl.randomBytes(nacl.box.nonceLength);  
    nonceP = nacl.randomBytes(nacl.box.nonceLength);  

    name = urlParams.get('name'); 
    emailAddress = urlParams.get('emailAddress');  
    publicKeyReciever = urlParams.get('publicKeyReciever');
    publicKeySender = App.keySender.publicKey;

    description = document.getElementById("txtDescription").value
    secret = document.getElementById("txtSecret").value

    if (publicKeyReciever == null) {
        alert('Er is een fout opgetreden. Public key van de ontvanger is onbekend. Scan QR code van de ontvanger of gebruik een link van de geadresseerde en probeer opnieuw.');
        closeLoading('btnSendMessage');
        return;
    }

    if (description == '') {
        alert('Er is een fout opgetreden. Vul de Korte omschrijving in en probeer opnieuw.');
        closeLoading('btnSendMessage');
        return;
    }
    if (secret == '') {
        alert('Er is een fout opgetreden. Vul de Gebruikersnaam / wachtwoord / server in en probeer opnieuw.');
        closeLoading('btnSendMessage');
        return;
    }

    cipherD = nacl.box(nacl.util.decodeUTF8(description), nonceD, nacl.util.decodeBase64(decodeURIComponent(publicKeyReciever)), App.keySender.secretKey);
    cipherP = nacl.box(nacl.util.decodeUTF8(secret), nonceP, nacl.util.decodeBase64(decodeURIComponent(publicKeyReciever)), App.keySender.secretKey);

    var server = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port 
    var page = "/decrypt.html?"
    var message = "nonceD=" + encodeURIComponent(nacl.util.encodeBase64(nonceD)) 
    message += "&nonceP=" +  encodeURIComponent(nacl.util.encodeBase64(nonceP)) 
    message += "&cipherD=" + encodeURIComponent(nacl.util.encodeBase64(cipherD)) 
    message += "&cipherP=" + encodeURIComponent(nacl.util.encodeBase64(cipherP)) 
    message += "&publicKeySender=" + encodeURIComponent(nacl.util.encodeBase64(publicKeySender)) 

    url = server + page + message

    var mail = "mailto:" + emailAddress
    mail += "?subject=Versleuteld bericht"

    body = "Deze email bevat een versleuteld wachtwoord.\n\n"
    body += "Klik op de link op de computer met de juiste key om het wachtwoord te bekijken: "
    body += url + "\n\n"
    body += "Wil je nog meer zekerheid door de gegevens niet naar een centrale server te sturen? Klik dan op onderstaande link en vul het bericht handmatig in en klik op de knop Bericht ontcijferen\n"
    body += server + page + "type=0\n\n"
    body += "Vul het volgende bericht in: \n\n" + message
    body += "\n\n\nJe wordt aangeraden deze email na gebruik te verwijderen uit je mailbox.";

    mail += "&body=" + encodeURIComponent(body); 

    console.log(mail);

    var mlink = document.createElement('a');
    mlink.setAttribute('href', mail);
    mlink.click();

    location.href = 'index.html?t='+ (new Date().getTime());
    return true;
  }
  // end App
};

$(function() {
  $(window).load(async function() {
    await App.init();
  });
});
