App = {

  myKey: null,
  publicKey: null,

  init: function() {
    //alert('App.init');
    const btnCreateKeys = document.querySelector('#btnCreateKeys');
    btnCreateKeys.addEventListener('click', async function(event){
      if (confirm('Weet u zeker dat u een nieuwe key wilt genereren?')) {
        App.createNewKey();
      }
    });

    return true;
  },

  
  createNewKey: function() {

    App.myKey = nacl.box.keyPair();

    let deleteRequest = indexedDB.deleteDatabase('infent');

    let openRequest = indexedDB.open("infent")
    openRequest.onupgradeneeded = () => {
      console.log("DB update needed")
      openRequest.result.createObjectStore("keys")
    }
    openRequest.onsuccess = () => {
      console.log("DB opened")
      let store = openRequest.result.transaction("keys", "readwrite").objectStore("keys")

      // Ww tbv veilig opslaan in IndexedDB van de private key
      let myWachtwoord = window.prompt("Deze site heeft een nieuwe encryptiekey aangemaakt. Geef een wachtwoord op om de key veilig op te slaan op deze computer. Onthoud het wachtwoord goed! U heeft deze nodig om de naar u gestuurde retourberichten te ontcijferen.","");

      cipher = CryptoJS.AES.encrypt(nacl.util.encodeBase64(App.myKey.secretKey), myWachtwoord).toString();
      plainBytes = CryptoJS.AES.decrypt(cipher, myWachtwoord)
      plain = plainBytes.toString(CryptoJS.enc.Utf8);

      console.log(nacl.util.encodeBase64(App.myKey.secretKey));
      console.log(cipher);
      console.log(plain);
      App.publicKey = nacl.util.encodeBase64(App.myKey.publicKey);

      store.put({secretkey: cipher, publicKey: App.publicKey}, '0')
      alert('Er is een nieuwe encryptiekey aangemaakt.');
    }
  },

  // end App
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
