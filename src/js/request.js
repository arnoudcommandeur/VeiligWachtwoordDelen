App = {

  profileStore: null,

  init: async function() {
    //alert('App.init');
    App.profileStore = initStore();

    await App.readProfile();

    const btnCreateMessage = document.querySelector('#btnCreateMessage');
    btnCreateMessage.addEventListener('click', async function(event){
      App.encryptShareAPI();
    });

    //App.openDB();

    return true;
  },

  readProfile: async function() {

    profile = await getProfile(App.profileStore);
    document.getElementById("txtName").value = profile.name;  
    document.getElementById("txtEmailAddress").value = profile.emailAddress;  

    cipher = profile.secretKey;
    publicKey = profile.publicKey;

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

  encryptShareAPI: async function() {


    Name = document.getElementById("txtName").value;  
    EmailAddress = document.getElementById("txtEmailAddress").value;  

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
    //mlink.click();

myUrl = "http://veiligwachtwoordsturen.web.app/encrypt.html?volledigeNaam=" + encodeURIComponent(volledigeNaam) + "&emailAdres=" + encodeURIComponent(emailAdres) + "&publicKeyReciever=" + encodeURIComponent(App.publicKey);

const shareData = {
  title: 'Veilig Wachtwoord Sturen',
  text: 'Klik op de link om veilig een wachtwoord te sturen',
  url: myUrl,
}

  try {
    await navigator.share(shareData)
    console.log('Link shared successfully')
  } catch(err) {
    console.log(err);
    // resultPara.innerHTML = 'Error: ' + err
  }

    //alert(cipher);
    return true;
  },

  openDB: function() { 
    return new Promise(function(resolve) {
      var r = window.indexedDB.open('VeiligWachtwoordSturen',1)
      r.onupgradeneeded = function() {
        console.log('db upgrade needed');
        var idb = r.result
        var store = idb.createObjectStore('Profile')
      }
      r.onsuccess = function() {
        var idb = r.result

        let tactn = idb.transaction('Profile', "readonly")
        let osc = tactn.objectStore('Profile').openCursor()
        osc.onsuccess = function(e) {
          let cursor = e.target.result
          if (cursor) {
            console.log('database aanwezig, en gevuld');
            App.publicKey = cursor.value["publicKey"];

            document.getElementById("volledigeNaam").value = cursor.value["naam"];
            document.getElementById("emailAdres").value = cursor.value["emailadres"];

          }
          else {
            console.log('database wel aanwezig, maar leeg');
          }
        } 
        tactn.oncomplete = function() {
          idb.close();
        }

      }
      r.onerror = function (e) {
      alert("Enable to access IndexedDB, " + e.target.errorCode)
      }    
    })
  },

  createNewProfile: function() {

    // Ww tbv veilig opslaan in IndexedDB van de private key
    let myWachtwoord = window.prompt("Deze site heeft een nieuwe encryptiekey aangemaakt. Geef een wachtwoord op om de key veilig op te slaan op deze computer. Onthoud het wachtwoord goed! U heeft deze nodig om de naar u gestuurde retourberichten te ontcijferen.","");

    App.myKey = nacl.box.keyPair();

    let openRequest = indexedDB.open("VeiligWachtwoordSturen")
    openRequest.onupgradeneeded = () => {
      console.log("DB update needed")
      openRequest.result.createObjectStore("Profile")
    }
    openRequest.onsuccess = () => {
      console.log("DB opened")
      let store = openRequest.result.transaction("Profile", "readwrite").objectStore("Profile")

      cipher = CryptoJS.AES.encrypt(nacl.util.encodeBase64(App.myKey.secretKey), myWachtwoord).toString();
      plainBytes = CryptoJS.AES.decrypt(cipher, myWachtwoord)
      plain = plainBytes.toString(CryptoJS.enc.Utf8);

      console.log(nacl.util.encodeBase64(App.myKey.secretKey));
      console.log(cipher);
      console.log(plain);
      App.publicKey = nacl.util.encodeBase64(App.myKey.publicKey);

      txtNaam = document.getElementById("txtNaam").value
      txtEmailAdres = document.getElementById("txtEmailAdres").value

      store.put({secretkey: cipher, publicKey: App.publicKey, naam: txtNaam, emailadres: txtEmailAdres}, 0) //  Aangepaste versie, nu met encryptie toegepast.
    }
  },

  // createNewKey: function() {

  //   // Ww tbv veilig opslaan in IndexedDB van de private key
  //   let myWachtwoord = window.prompt("Deze site heeft een nieuwe encryptiekey aangemaakt. Geef een wachtwoord op om de key veilig op te slaan op deze computer. Onthoud het wachtwoord goed! U heeft deze nodig om de naar u gestuurde retourberichten te ontcijferen.","");

  //   App.myKey = nacl.box.keyPair();

  //   let openRequest = indexedDB.open("infent")
  //   openRequest.onupgradeneeded = () => {
  //     console.log("DB update needed")
  //     openRequest.result.createObjectStore("keys")
  //   }
  //   openRequest.onsuccess = () => {
  //     console.log("DB opened")
  //     let store = openRequest.result.transaction("keys", "readwrite").objectStore("keys")

  //     cipher = CryptoJS.AES.encrypt(nacl.util.encodeBase64(App.myKey.secretKey), myWachtwoord).toString();
  //     plainBytes = CryptoJS.AES.decrypt(cipher, myWachtwoord)
  //     plain = plainBytes.toString(CryptoJS.enc.Utf8);

  //     console.log(nacl.util.encodeBase64(App.myKey.secretKey));
  //     console.log(cipher);
  //     console.log(plain);
  //     App.publicKey = nacl.util.encodeBase64(App.myKey.publicKey);

  //     store.put({secretkey: cipher, publicKey: App.publicKey}, '0') //  Aangepaste versie, nu met encryptie toegepast.
  //   }
  // },

  // initKey: function() { 
  //   return new Promise(function(resolve) {
  //     var r = window.indexedDB.open('infent')
  //     r.onupgradeneeded = function() {
  //       var idb = r.result
  //       var store = idb.createObjectStore('keys')
  //     }
  //     r.onsuccess = function() {
  //       var idb = r.result

  //       let tactn = idb.transaction('keys', "readonly")
  //       let osc = tactn.objectStore('keys').openCursor()
  //       osc.onsuccess = function(e) {
  //         let cursor = e.target.result
  //         if (cursor) {
  //           App.publicKey = cursor.value["publicKey"];
  //           if (App.publicKey == '')
  //           {
  //             alert('Er is een technische fout opgetreden tijdens het inlezen van de keys.')
  //           }
  //           console.log(App.publicKey);
  //         } else {
  //           console.log('createNewKey starten');
  //           App.createNewKey()
  //         }
  //       } 
  //       tactn.oncomplete = function() {
  //         idb.close();
  //       }

  //     }
  //     r.onerror = function (e) {
  //     alert("ERROR Enable to access IndexedDB, " + e.target.errorCode)
  //     }    
  //   })
  // }
  // end App
};

$(function() {
  $(window).load(async function() {
    await App.init();
  });
});


// const shareData = {
//   title: 'MDN',
//   text: 'Learn web development on MDN!',
//   url: 'https://developer.mozilla.org',
// }

// const btn = document.getElementById('share');
// const resultPara = document.getElementById('result');

// // Must be triggered some kind of "user activation"
// btn.addEventListener('click', async () => {
//   try {
//     await navigator.share(shareData)
//     console.log('MDN shared successfully')
//   } catch(err) {
//     console.log(err);
//     // resultPara.innerHTML = 'Error: ' + err
//   }
// });