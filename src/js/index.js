App = {

  myKey: null,
  publicKey: null,

  init: function() {
    //alert('App.init');
    const btncreateEmail = document.querySelector('#btncreateEmail');
    btncreateEmail.addEventListener('click', async function(event){
      alert('Er wordt nu een concept email gegenereerd. Vul het emailadres van de geadresseerde in en verstuur de email.');
      App.encrypt();
    });

    App.initKey();

    return true;
  },

  encrypt: function() {


    volledigeNaam = document.getElementById("volledigeNaam").value;  
    emailAdres = document.getElementById("emailAdres").value;  

    var mail = "mailto:"
    mail += "?subject=Verzoek voor wachtwoord uitwisseling"

    body = "Hallo\n\n"
    body += "U ontvangt deze email voor het veilig uitwisselen van een wachtwoord.\n\n"
    body += "Klik op de link hieronder om het wachtwoord veilig te delen: "
//    body += "http://localhost:3000/encrypt.html?volledigeNaam=" + encodeURIComponent(volledigeNaam) + "&emailAdres=" + encodeURIComponent(emailAdres) + "&publicKeyReciever=" + encodeURIComponent(nacl.util.encodeBase64(App.myKey.publicKey));
    body += "http://veiligwachtwoordsturen.web.app/encrypt.html?volledigeNaam=" + encodeURIComponent(volledigeNaam) + "&emailAdres=" + encodeURIComponent(emailAdres) + "&publicKeyReciever=" + encodeURIComponent(App.publicKey);

    mail += "&body=" + encodeURIComponent(body); 
    var mlink = document.createElement('a');
    mlink.setAttribute('href', mail);
    mlink.click();

    //alert(cipher);
    return true;
  },

  createNewKey: function() {

    // Ww tbv veilig opslaan in IndexedDB van de private key
    let myWachtwoord = window.prompt("Deze site heeft een nieuwe encryptiekey aangemaakt. Geef een wachtwoord op om de key veilig op te slaan op deze computer. Onthoud het wachtwoord goed! U heeft deze nodig om de naar u gestuurde retourberichten te ontcijferen.","");

    App.myKey = nacl.box.keyPair();

    let openRequest = indexedDB.open("infent")
    openRequest.onupgradeneeded = () => {
      console.log("DB update needed")
      openRequest.result.createObjectStore("keys")
    }
    openRequest.onsuccess = () => {
      console.log("DB opened")
      let store = openRequest.result.transaction("keys", "readwrite").objectStore("keys")

      cipher = CryptoJS.AES.encrypt(nacl.util.encodeBase64(App.myKey.secretKey), myWachtwoord).toString();
      plainBytes = CryptoJS.AES.decrypt(cipher, myWachtwoord)
      plain = plainBytes.toString(CryptoJS.enc.Utf8);

      console.log(nacl.util.encodeBase64(App.myKey.secretKey));
      console.log(cipher);
      console.log(plain);
      App.publicKey = nacl.util.encodeBase64(App.myKey.publicKey);

      store.put({secretkey: cipher, publicKey: App.publicKey}, '0') //  Aangepaste versie, nu met encryptie toegepast.
    }
  },

  initKey: function() { 
    return new Promise(function(resolve) {
      var r = window.indexedDB.open('infent')
      r.onupgradeneeded = function() {
        var idb = r.result
        var store = idb.createObjectStore('keys')
      }
      r.onsuccess = function() {
        var idb = r.result

        let tactn = idb.transaction('keys', "readonly")
        let osc = tactn.objectStore('keys').openCursor()
        osc.onsuccess = function(e) {
          let cursor = e.target.result
          if (cursor) {
            App.publicKey = cursor.value["publicKey"];
            if (App.publicKey == '')
            {
              alert('Er is een technische fout opgetreden tijdens het inlezen van de keys.')
            }
            console.log(App.publicKey);
          } else {
            console.log('createNewKey starten');
            App.createNewKey()
          }
        } 
        tactn.oncomplete = function() {
          idb.close();
        }

      }
      r.onerror = function (e) {
      alert("ERROR Enable to access IndexedDB, " + e.target.errorCode)
      }    
    })
  }
  // end App
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
