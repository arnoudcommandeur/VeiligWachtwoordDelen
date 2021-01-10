App = {

  myKey: null,
  profileStore: null,

  init: async function() {

    App.profileStore = initStore();

    if ((await checkProfile(App.profileStore)) == false) {
      //alert('Vul je naam en emailadres in en klik op Opslaan op een nieuw profiel aan te maken.');
    } else {

      await App.showProfile();
      await App.showKeys();
    }

    const btnOpslaan = document.querySelector('#btnOpslaan');

    btnOpslaan.addEventListener('click', async function(event){

      await App.safeProfile(document.getElementById('txtName').value, document.getElementById('txtEmailAddress').value, document.getElementById('txtPassword1').value);
    });
    // btnInitProfile.addEventListener('click', async function(event){
    //   if (confirm('Weet u zeker dat u een nieuwe key wilt genereren?')) {
    //     App.initProfile();
    //   }
    // });
    return true;
  },

  showKeys: async function() { 

    profile = await getProfile(App.profileStore);
    cipher = profile.secretKey;
    publicKey = profile.publicKey;

    document.getElementById("divPublicKey").innerHTML = App.publicKey;

    url = "http://veiligwachtwoordsturen.web.app/encrypt.html?volledigeNaam=" + encodeURIComponent(profile.name) + "&emailAdres=" + encodeURIComponent(profile.emailAddress) + "&publicKeyReciever=" + encodeURIComponent(profile.publicKey);
    //url = encodeURIComponent(url); 
    console.log(url);

    jQuery('#qrcodeCanvas').qrcode({
        text: url
    })


    // return new Promise(function(resolve) {
    //   var r = window.indexedDB.open('VeiligWachtwoordSturen',1)
    //   r.onupgradeneeded = function() {
    //     console.log('db upgrade needed');
    //     var idb = r.result
    //     var store = idb.createObjectStore('Profile')
    //   }
    //   r.onsuccess = function() {
    //     var idb = r.result

    //     let tactn = idb.transaction('Profile', "readonly")
    //     let osc = tactn.objectStore('Profile').openCursor()
    //     osc.onsuccess = function(e) {
    //       let cursor = e.target.result
    //       if (cursor) {
    //         console.log('database aanwezig, en gevuld');
    //         App.publicKey = cursor.value["publicKey"];
    //         volledigeNaam = cursor.value["naam"];
    //         emailAdres = cursor.value["emailadres"];

    //         document.getElementById("divPublicKey").innerHTML = App.publicKey;

    //         url = "http://veiligwachtwoordsturen.web.app/encrypt.html?volledigeNaam=" + encodeURIComponent(volledigeNaam) + "&emailAdres=" + encodeURIComponent(emailAdres) + "&publicKeyReciever=" + encodeURIComponent(App.publicKey);
    //         //url = encodeURIComponent(url); 
    //         console.log(url);

    //         jQuery('#qrcodeCanvas').qrcode({
    //             text: url
    //         });	

    //         // const divShowKeys = document.querySelector('#divShowKeys')
    //         // const divMenu = document.querySelector('#divMenu')

    //         // divMenu.style.display = 'none'
    //         // divShowKeys.style.display = '';
    //       }
    //       else {
    //         console.log('database wel aanwezig, maar leeg');
    //         alert('Er is nog geen versleutel key aanwezig op deze computer. Navigeer naar Profile in het menu en genereer een volledig nieuw profiel.');
    //       }
    //     } 
    //     tactn.oncomplete = function() {
    //       idb.close();
    //     }

    //   }
    //   r.onerror = function (e) {
    //   alert("Enable to access IndexedDB, " + e.target.errorCode)
    //   }    
    // })
    // return true;
  },


  showProfile: async function() {
    profile = await getProfile(App.profileStore);
    cipher = profile.secretKey;
    publicKey = profile.publicKey;

    document.getElementById('txtName').value = profile.name;
    document.getElementById('txtEmailAddress').value = profile.emailAddress;
  },

  safeProfile: async function(_name, _emailAddress, _password) { 

    // Lees bestaande cipher, publickey uit
    if ((await checkProfile(App.profileStore)) == false) {
      //alert('Vul je naam en emailadres in en klik op Opslaan op een nieuw profiel aan te maken.');
      console.log('No profile yet');

      App.myKey = nacl.box.keyPair();
      cipher = CryptoJS.AES.encrypt(nacl.util.encodeBase64(App.myKey.secretKey), _password).toString();
      publicKey = nacl.util.encodeBase64(App.myKey.publicKey);

      console.log(cipher);

      await saveProfile(App.profileStore, 0, cipher, publicKey, _name, _emailAddress);
    } else {
      profile = await getProfile(App.profileStore);
      cipher = profile.secretKey;
      publicKey = profile.publicKey;

      await saveProfile(App.profileStore, 0, cipher, publicKey, _name, _emailAddress);
    }    

    // return new Promise(function(resolve) {
    //   var r = window.indexedDB.open('VeiligWachtwoordSturen',1)
    //   r.onupgradeneeded = function() {
    //     console.log('db upgrade needed');
    //     var idb = r.result
    //     var store = idb.createObjectStore('Profile')
    //   }
    //   r.onsuccess = function() {
    //     var idb = r.result

    //     let tactn = idb.transaction('Profile', "readonly")
    //     let osc = tactn.objectStore('Profile').openCursor()
    //     osc.onsuccess = function(e) {
    //       let cursor = e.target.result
    //       if (cursor) {

    //         cipher = cursor.value["secretkey"];
    //         publicKey = cursor.value["publicKey"];

    //         console.log('database aanwezig, en gevuld');

    //         txtNaam = document.getElementById("txtNaam").value
    //         txtEmailAdres = document.getElementById("txtEmailAdres").value
    //         App.updateProfile(cipher, publicKey, txtNaam, txtEmailAdres);

    //       }
    //       else {
    //         console.log('database wel aanwezig, maar leeg');
    //         App.createNewProfile();
    //       }
    //     } 
    //     tactn.oncomplete = function() {
    //       idb.close();
    //     }

    //   }
    //   r.onerror = function (e) {
    //   alert("Enable to access IndexedDB, " + e.target.errorCode)
    //   }    
    // })
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
      // plainBytes = CryptoJS.AES.decrypt(cipher, myWachtwoord)
      // plain = plainBytes.toString(CryptoJS.enc.Utf8);

      console.log(nacl.util.encodeBase64(App.myKey.secretKey));
      console.log(cipher);
      console.log(App.myKey.publicKey);
      App.publicKey = nacl.util.encodeBase64(App.myKey.publicKey);

      txtNaam = document.getElementById("txtNaam").value
      txtEmailAdres = document.getElementById("txtEmailAdres").value

      store.put({secretkey: cipher, publicKey: App.publicKey, naam: txtNaam, emailadres: txtEmailAdres}, 0) //  Aangepaste versie, nu met encryptie toegepast.
    }
  },

  updateProfile: function(cipher, publicKey, txtNaam, txtEmailAdres) {

    let openRequest = indexedDB.open("VeiligWachtwoordSturen")
    openRequest.onupgradeneeded = () => {
      console.log("DB update needed")
      openRequest.result.createObjectStore("Profile")
    }
    openRequest.onsuccess = () => {
      console.log("DB opened")
      let store = openRequest.result.transaction("Profile", "readwrite").objectStore("Profile")

      txtNaam = document.getElementById("txtNaam").value
      txtEmailAdres = document.getElementById("txtEmailAdres").value

      store.put({secretkey: cipher, publicKey: publicKey, naam: txtNaam, emailadres: txtEmailAdres}, 0) //  Aangepaste versie, nu met encryptie toegepast.
    }
  },

  initProfile: function() {

    let openRequest = indexedDB.open("VeiligWachtwoordSturen")
    openRequest.onupgradeneeded = () => {
      console.log("DB update needed")
      openRequest.result.createObjectStore("Profile")
    }
    openRequest.onsuccess = () => {
      console.log("DB opened")
      let store = openRequest.result.transaction("Profile", "readwrite").objectStore("Profile")

      // Ww tbv veilig opslaan in IndexedDB van de private key
      let myWachtwoord = window.prompt("Deze site heeft een nieuwe encryptiekey aangemaakt. Geef een wachtwoord op om de key veilig op te slaan op deze computer. Onthoud het wachtwoord goed! U heeft deze nodig om de naar u gestuurde retourberichten te ontcijferen.","");

      App.myKey = nacl.box.keyPair();

      cipher = CryptoJS.AES.encrypt(nacl.util.encodeBase64(App.myKey.secretKey), myWachtwoord).toString();
      // plainBytes = CryptoJS.AES.decrypt(cipher, myWachtwoord)
      // plain = plainBytes.toString(CryptoJS.enc.Utf8);

      console.log(nacl.util.encodeBase64(App.myKey.secretKey));
      console.log(cipher);
      console.log(App.myKey.publicKey);
      App.publicKey = nacl.util.encodeBase64(App.myKey.publicKey);

      txtNaam = document.getElementById("txtNaam").value
      txtEmailAdres = document.getElementById("txtEmailAdres").value

      store.put({secretkey: cipher, publicKey: App.publicKey, naam: txtNaam, emailadres: txtEmailAdres}, 0) //  Aangepaste versie, nu met encryptie toegepast.
      alert('Er is een nieuwe encryptiekey aangemaakt.');
    }
  },

  // showKeys: function() { 
  //   return new Promise(function(resolve) {
  //     var r = window.indexedDB.open('VeiligWachtwoordSturen',1)
  //     r.onupgradeneeded = function() {
  //       console.log('db upgrade needed');
  //       var idb = r.result
  //       var store = idb.createObjectStore('Profile')
  //     }
  //     r.onsuccess = function() {
  //       var idb = r.result

  //       let tactn = idb.transaction('Profile', "readonly")
  //       let osc = tactn.objectStore('Profile').openCursor()
  //       osc.onsuccess = function(e) {
  //         let cursor = e.target.result
  //         if (cursor) {
  //           console.log('database aanwezig, en gevuld');
  //           App.publicKey = cursor.value["publicKey"];
  //           volledigeNaam = cursor.value["naam"];
  //           emailAdres = cursor.value["emailadres"];

  //           document.getElementById("divPublicKey").innerHTML = App.publicKey;

  //           url = "http://veiligwachtwoordsturen.web.app/encrypt.html?volledigeNaam=" + encodeURIComponent(volledigeNaam) + "&emailAdres=" + encodeURIComponent(emailAdres) + "&publicKeyReciever=" + encodeURIComponent(App.publicKey);
  //           //url = encodeURIComponent(url); 
  //           console.log(url);

  //           jQuery('#qrcodeCanvas').qrcode({
  //               text: url
  //           });	

  //           // const divShowKeys = document.querySelector('#divShowKeys')
  //           // const divMenu = document.querySelector('#divMenu')

  //           // divMenu.style.display = 'none'
  //           // divShowKeys.style.display = '';
  //         }
  //         else {
  //           console.log('database wel aanwezig, maar leeg');
  //           alert('Er is nog geen versleutel key aanwezig op deze computer. Navigeer naar Profile in het menu en genereer een volledig nieuw profiel.');
  //         }
  //       } 
  //       tactn.oncomplete = function() {
  //         idb.close();
  //       }

  //     }
  //     r.onerror = function (e) {
  //     alert("Enable to access IndexedDB, " + e.target.errorCode)
  //     }    
  //   })
  //   return true;
  // },
  // end App
};

$(function() {
  $(window).load(async function() {
    await App.init();
  });
});
