App = {

  profileStore: null,
  myKey: null,

  init: async function() {
    //alert('App.init');

    App.profileStore = initStore();
    await App.decrypt();

    return true;
  },

  decrypt: async function() {

    profile = await getProfile(App.profileStore);
    secretKeyCipher = profile.secretKey;

    myPassword = window.prompt("Geef het wachtwoord om de persoonlijke encryptiekey te openen","");
    plainBytes = CryptoJS.AES.decrypt(secretKeyCipher, myPassword)
    secretKey = plainBytes.toString(CryptoJS.enc.Utf8);
    App.myKey = nacl.box.keyPair.fromSecretKey(nacl.util.decodeBase64(secretKey))

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    description = decodeURIComponent(urlParams.get('description'));
    nonce = nacl.util.decodeBase64(decodeURIComponent(urlParams.get('nonce')));  
    publicKeySender = nacl.util.decodeBase64(decodeURIComponent(urlParams.get('publicKeySender')));  
    cipher = nacl.util.decodeBase64(decodeURIComponent(urlParams.get('cipher')));

    plaintext = nacl.box.open(cipher, nonce, publicKeySender, App.myKey.secretKey);

    document.getElementById("divDescription").innerHTML = description;
    document.getElementById("divSecret").innerHTML = nacl.util.encodeUTF8(plaintext);

  },

//   decrypt_old: function() {

//     console.log(App.myKey.secretKey);
//     const queryString = window.location.search;
//     const urlParams = new URLSearchParams(queryString);

//     omschrijving = decodeURIComponent(urlParams.get('omschrijving'));


//     nonce = nacl.util.decodeBase64(decodeURIComponent(urlParams.get('nonce')));  
//     publicKeySender = nacl.util.decodeBase64(decodeURIComponent(urlParams.get('publicKeySender')));  

//     cipher = nacl.util.decodeBase64(decodeURIComponent(urlParams.get('cipher')));

//     plaintext = nacl.box.open(cipher, nonce, publicKeySender, App.myKey.secretKey);
// //return;
//     document.getElementById("omschrijving").innerHTML = omschrijving;
//     document.getElementById("wachtwoord").innerHTML = nacl.util.encodeUTF8(plaintext);

//     return true;
//   },

//   initKey: function() { 
//     return new Promise(function(resolve) {
//       var r = window.indexedDB.open('VeiligWachtwoordSturen')
//       r.onupgradeneeded = function() {
//         var idb = r.result
//         var store = idb.createObjectStore('Profile', {keyPath: "key"})
//       }
//       r.onsuccess = function() {
//         var idb = r.result

//         let tactn = idb.transaction('Profile', "readonly")
//         let osc = tactn.objectStore('Profile').openCursor()
//         osc.onsuccess = function(e) {
//           let cursor = e.target.result
//           if (cursor) {

//             cipher = cursor.value["secretkey"];
//             console.log(cipher);
//             myWachtwoord = window.prompt("Geef het wachtwoord om de encryptiekey te openen","");
//             plainBytes = CryptoJS.AES.decrypt(cipher, myWachtwoord)
//             plain = plainBytes.toString(CryptoJS.enc.Utf8);
//             console.log(plain);

// //            App.myKey = nacl.box.keyPair.fromSecretKey(nacl.util.decodeBase64(cursor.value["secretkey"])) // Vervangen door nieuwe versie
//             App.myKey = nacl.box.keyPair.fromSecretKey(nacl.util.decodeBase64(plain))
//             //console.log(nacl.util.decodeBase64(cursor.value["secretkey"]))
//             console.log(App.myKey.secretKey)



//             //storage.innerHTML += "Naam " + cursor.value["volledigeNaam"] + " : voornaam: " +  + ", emailadres " + cursor.value["emailAdres"] + ", publicKey " + cursor.value["publicKey"] + "<br>"
//             cursor.continue()
//           }
//           App.decrypt()
//         } 
//         tactn.oncomplete = function() {
//           idb.close();
//         }

//       }
//       r.onerror = function (e) {
//       alert("Enable to access IndexedDB, " + e.target.errorCode)
//       }    
//     })
//   }
  // end App
};

$(function() {
  $(window).load(async function() {
    await App.init();
  });
});
