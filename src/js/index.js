App = {

  myKey: null,

  init: function() {
    //alert('App.init');
    const btncreateEmail = document.querySelector('#btncreateEmail');
    btncreateEmail.addEventListener('click', async function(event){
      App.initEncrypt();
    });

    return true;
  },

  initEncrypt: function() {

    App.initKey();

    volledigeNaam = document.getElementById("volledigeNaam").value;  
    emailAdres = document.getElementById("emailAdres").value;  

    var mail = "mailto:"
    mail += "?subject=Verzoek voor wachtwoord uitwisseling"

    body = "Hallo\n\n"
    body += "U ontvangt deze email voor het veilig uitwisselen van een wachtwoord.\n\n"
    body += "Klik op de link hieronder om het wachtwoord veilig te delen: "
    body += "http://localhost:3000/encrypt.html?volledigeNaam=" + encodeURIComponent(volledigeNaam) + "&emailAdres=" + encodeURIComponent(emailAdres) + "&publicKeyReciever=" + encodeURIComponent(nacl.util.encodeBase64(App.myKey.publicKey));
//    body += "http://veiligwachtwoordsturen.web.app/encrypt.html?volledigeNaam=" + encodeURIComponent(volledigeNaam) + "&emailAdres=" + encodeURIComponent(emailAdres) + "&publicKeyReciever=" + encodeURIComponent(nacl.util.encodeBase64(App.myKey.publicKey));

    mail += "&body=" + encodeURIComponent(body); 
    var mlink = document.createElement('a');
    mlink.setAttribute('href', mail);
    mlink.click();

    //alert(cipher);
    return true;
  },

  initKey: function() {

    // Ww tbv veilig opslaan in IndexedDB van de private key
    let myWachtwoord = window.prompt("Geef wachtwoord om key veilig op te slaan","defaultText");

    App.myKey = nacl.box.keyPair();

    let openRequest = indexedDB.open("infent")
    openRequest.onupgradeneeded = () => {
      console.log("DB update needed")
      openRequest.result.createObjectStore("keys")
    }
    openRequest.onsuccess = () => {
      console.log("DB opened")
      let store = openRequest.result.transaction("keys", "readwrite").objectStore("keys")

      // mySecretkeyCipher = nacl.secretbox(App.myKey.secretKey, myNonce, nacl.util.decodeUTF8(myWachtwoord));

      // console.log(myWachtwoord);
      // console.log(mySecretkeyCipher);
      //console.log(nacl.secretbox.open(mySecretkeyCipher, myNonce, myWachtwoord));
      cipher = CryptoJS.AES.encrypt(nacl.util.encodeBase64(App.myKey.secretKey), myWachtwoord).toString();
      plainBytes = CryptoJS.AES.decrypt(cipher, myWachtwoord)
      plain = plainBytes.toString(CryptoJS.enc.Utf8);

      console.log(nacl.util.encodeBase64(App.myKey.secretKey));
      console.log(cipher);
      console.log(plain);


//      store.put({secretkey: nacl.util.encodeBase64(App.myKey.secretKey)}, '0')
      store.put({secretkey: cipher}, '0') //  Aangepaste versie, nu met encryptie toegepast.

    }
  }
  // end App
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
