App = {

  myKey: null,

  init: function() {
    //alert('App.init');
//    App.myKey = nacl.box.keyPair();

// Test keys
//App.myKey = nacl.box.keyPair.fromSecretKey(nacl.util.decodeBase64("uFLncLOPoQ+zb+0wZAyOmjYHdp/naGv8byibgJL9fOc="))

    App.initKey();

    //console.log(App.myKey.publicKey);
    const btncreateEmail = document.querySelector('#createEmail');

    return true;
  },

  decrypt: function() {

    console.log(App.myKey.secretKey);
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
  },

  initKey: function() { 
    return new Promise(function(resolve) {
      var r = window.indexedDB.open('VeiligWachtwoordSturen')
      r.onupgradeneeded = function() {
        var idb = r.result
        var store = idb.createObjectStore('Profile', {keyPath: "key"})
      }
      r.onsuccess = function() {
        var idb = r.result

        let tactn = idb.transaction('Profile', "readonly")
        let osc = tactn.objectStore('Profile').openCursor()
        osc.onsuccess = function(e) {
          let cursor = e.target.result
          if (cursor) {

            cipher = cursor.value["secretkey"];
            console.log(cipher);
            myWachtwoord = window.prompt("Geef het wachtwoord om de encryptiekey te openen","");
            plainBytes = CryptoJS.AES.decrypt(cipher, myWachtwoord)
            plain = plainBytes.toString(CryptoJS.enc.Utf8);
            console.log(plain);

//            App.myKey = nacl.box.keyPair.fromSecretKey(nacl.util.decodeBase64(cursor.value["secretkey"])) // Vervangen door nieuwe versie
            App.myKey = nacl.box.keyPair.fromSecretKey(nacl.util.decodeBase64(plain))
            //console.log(nacl.util.decodeBase64(cursor.value["secretkey"]))
            console.log(App.myKey.secretKey)



            //storage.innerHTML += "Naam " + cursor.value["volledigeNaam"] + " : voornaam: " +  + ", emailadres " + cursor.value["emailAdres"] + ", publicKey " + cursor.value["publicKey"] + "<br>"
            cursor.continue()
          }
          App.decrypt()
        } 
        tactn.oncomplete = function() {
          idb.close();
        }

      }
      r.onerror = function (e) {
      alert("Enable to access IndexedDB, " + e.target.errorCode)
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
