App = {

  myKey: null,
  profileStore: null,
  type: null, // 0 direct doorgaan naar encrypt.html
// encrypt.html?name=Arnoud%20Commandeur&emailAddress=arnoudcommandeur%40hotmail.com&publicKeyReciever=7CpDmZ%2FXABBFYwTpu86Q%2Bftw6k%2F0gZ7tY%2F%2FBzktK02Y%3D

  init: async function() {

    App.profileStore = initStore();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    App.type = decodeURIComponent(urlParams.get('type'));

    if ((await checkProfile(App.profileStore)) == false) {
      //alert('Vul je naam en emailadres in en klik op Opslaan op een nieuw profiel aan te maken.');
      document.getElementById("divPassword").style.display = '';
    } else {
      document.getElementById("divHeader").innerHTML = 'Wijzig op deze pagina je profiel';
      document.getElementById("divResetProfile").style.display = '';
      document.getElementById("divPublicKeyMain").style.display = '';

      await App.showProfile();

      if (App.type==0) {
        window.location.href='request.html?t='+ (new Date().getTime());
      }
      //await App.showKeys();
    }
//console.log('jaja');

    const btnSave = document.querySelector('#btnSave');
    btnSave.addEventListener('click', async function(event){
      if (await App.validateForm()) {
        await App.safeProfile(document.getElementById('txtName').value, document.getElementById('txtEmailAddress').value, document.getElementById('txtPassword1').value);
        if (App.type==0) {
          window.location.href='request.html?t='+ (new Date().getTime());
        } else {
          window.location.href = 'index.html?t='+ (new Date().getTime());
        }
      }
    });

    const btnResetProfile = document.querySelector('#btnResetProfile');
    btnResetProfile.addEventListener('click', async function(event){
      if (confirm('Weet u zeker dat u uw profiel wilt wissen en opnieuw wilt instellen?')) {
        await App.resetProfile();
        window.location.reload();
      }
    });

    return true;
  },

  showProfile: async function() {
    profile = await getProfile(App.profileStore);
    cipher = profile.secretKey;
    publicKey = profile.publicKey;

    document.getElementById('txtName').value = profile.name;
    document.getElementById('txtEmailAddress').value = profile.emailAddress;
    document.getElementById('txtPublicKey').value = 'Huidige Public key: ' + profile.publicKey;

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

  resetProfile: async function() {
    await idbKeyval.clear(App.profileStore);
    location.reload(true);
  },

  validateForm: async function() {
    if (document.getElementById('txtName').value.length == 0) {
      alert('Er is een fout opgetreden. Het veld Voor- en achternaam is verplicht. Corrigeer de fout en probeer opnieuw.');
      return false;
    }
    if (App.validateEmail(document.getElementById('txtEmailAddress').value) == false) {
      alert('Er is een fout opgetreden. Het veld Emailadres is onjuist. Corrigeer de fout en probeer opnieuw.');
      return false;
    }

    if ((await checkProfile(App.profileStore)) == false) {
      if (document.getElementById('txtPassword1').value.length == 0 || document.getElementById('txtPassword2').value.length == 0) {
        alert('Er is een fout opgetreden. U heeft geen wachtwoord ingevoerd. Corrigeer de fout en probeer opnieuw.')
        return false;
      }

      if (document.getElementById('txtPassword1').value != document.getElementById('txtPassword2').value) {
        alert('Er is een fout opgetreden. De ingevulde wachtwoorden zijn niet gelijk. Corrigeer de fout en probeer opnieuw.')
        return false;
      }
    }
    return true;
  },

  validateEmail: function(value) {
    var input = document.createElement('input');

    input.type = 'email';
    input.required = true;
    input.value = value;

    return typeof input.checkValidity === 'function' ? input.checkValidity() : /\S+@\S+\.\S+/.test(value);
  }

};

$(function() {
  $(window).load(async function() {
    await App.init();
  });
});
