App = {

  myKey: null,
  profileStore: null,

  init: async function() {

    App.profileStore = initStore();

    if ((await checkProfile(App.profileStore)) == false) {
      //alert('Vul je naam en emailadres in en klik op Opslaan op een nieuw profiel aan te maken.');
      document.getElementById("divPassword").style.display = '';
    } else {
      document.getElementById("divHeader").innerHTML = 'Wijzig op deze pagina je profiel';
      await App.showProfile();
      //await App.showKeys();
    }

    const btnOpslaan = document.querySelector('#btnOpslaan');

    btnOpslaan.addEventListener('click', async function(event){

      await App.safeProfile(document.getElementById('txtName').value, document.getElementById('txtEmailAddress').value, document.getElementById('txtPassword1').value);
      window.location.reload();
    });

    return true;
  },

  showKeys: async function() { 

    profile = await getProfile(App.profileStore);
    cipher = profile.secretKey;
    publicKey = profile.publicKey;

    document.getElementById("divPublicKey").innerHTML = App.publicKey;

    url = "http://veiligwachtwoordsturen.web.app/encrypt.html?volledigeNaam=" + encodeURIComponent(profile.name) + "&emailAdres=" + encodeURIComponent(profile.emailAddress) + "&publicKeyReciever=" + encodeURIComponent(profile.publicKey);
    console.log(url);

    jQuery('#qrcodeCanvas').qrcode({
        text: url
    })

    document.getElementById("divPublicKey").innerHTML = publicKey;

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
  },

  // createNewProfile: function() {

  //   // Ww tbv veilig opslaan in IndexedDB van de private key
  //   let myWachtwoord = window.prompt("Deze site heeft een nieuwe encryptiekey aangemaakt. Geef een wachtwoord op om de key veilig op te slaan op deze computer. Onthoud het wachtwoord goed! U heeft deze nodig om de naar u gestuurde retourberichten te ontcijferen.","");

  //   App.myKey = nacl.box.keyPair();

  //   let openRequest = indexedDB.open("VeiligWachtwoordSturen")
  //   openRequest.onupgradeneeded = () => {
  //     console.log("DB update needed")
  //     openRequest.result.createObjectStore("Profile")
  //   }
  //   openRequest.onsuccess = () => {
  //     console.log("DB opened")
  //     let store = openRequest.result.transaction("Profile", "readwrite").objectStore("Profile")

  //     cipher = CryptoJS.AES.encrypt(nacl.util.encodeBase64(App.myKey.secretKey), myWachtwoord).toString();
  //     // plainBytes = CryptoJS.AES.decrypt(cipher, myWachtwoord)
  //     // plain = plainBytes.toString(CryptoJS.enc.Utf8);

  //     console.log(nacl.util.encodeBase64(App.myKey.secretKey));
  //     console.log(cipher);
  //     console.log(App.myKey.publicKey);
  //     App.publicKey = nacl.util.encodeBase64(App.myKey.publicKey);

  //     txtNaam = document.getElementById("txtNaam").value
  //     txtEmailAdres = document.getElementById("txtEmailAdres").value

  //     store.put({secretkey: cipher, publicKey: App.publicKey, naam: txtNaam, emailadres: txtEmailAdres}, 0) //  Aangepaste versie, nu met encryptie toegepast.
  //   }
  // },

};

$(function() {
  $(window).load(async function() {
    await App.init();
  });
});
