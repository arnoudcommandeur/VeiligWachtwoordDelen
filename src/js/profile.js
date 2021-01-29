App = {

  myKey: null,
  profileStore: null,
  type: null, // 0 direct doorgaan naar encrypt.html
  url: null,
// encrypt.html?name=Arnoud%20Commandeur&emailAddress=arnoudcommandeur%40hotmail.com&publicKeyReciever=7CpDmZ%2FXABBFYwTpu86Q%2Bftw6k%2F0gZ7tY%2F%2FBzktK02Y%3D

  init: async function() {

    App.profileStore = initStore();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    App.type = decodeURIComponent(urlParams.get('type'));

    if ((await checkProfile(App.profileStore)) == false && App.type==1) {
      alert('Je kunt je profiel nog niet delen zolang je nog geen profiel aangemaakt hebt. Maak eerst je profiel aan en probeer dan opnieuw.');
      return false;
    }

    if ((await checkProfile(App.profileStore)) == false) {
      //alert('Vul je naam en emailadres in en klik op Opslaan op een nieuw profiel aan te maken.');
      document.getElementById("divPassword").style.display = '';
    } else {
      document.getElementById("divHeader").innerHTML = 'Wijzig op deze pagina je profiel. Via de optie Key management in het menu kun je je profiel naar een andere computer kopieren.';
      document.getElementById("divResetProfile").style.display = '';
      document.getElementById("divPublicKeyMain").style.display = '';

      await App.showProfile();

      // Ga verder naar Wachtwoord opvragen
      if (App.type==0) {
        window.location.href='request.html?t='+ (new Date().getTime());
      }
      //await App.showKeys();
    }
//console.log('jaja');

    const btnSave = document.querySelector('#btnSave');
    btnSave.addEventListener('click', async function(event){
      if (await App.validateForm()) {
        await App.safeProfile(document.getElementById('txtName').value, document.getElementById('txtEmailAddress').value, document.getElementById('txtPassword1').value, document.getElementById('txtCompany').value);
        if (App.type==0) {
          window.location.href='request.html?t='+ (new Date().getTime());
        } else {
          window.location.href = 'index.html?t='+ (new Date().getTime());
        }
      }
    });

    const btnResetProfile = document.querySelector('#btnResetProfile');
    btnResetProfile.addEventListener('click', async function(event){
      if (confirm('Weet je zeker dat je jouw profiel wilt wissen en opnieuw wilt instellen? Hiermee kun je oude berichten niet meer lezen. Contactpersonen die jouw huidige public key hebben moet je de nieuwe key sturen.')) {
        await App.resetProfile();
        window.location.reload();
      }
    });

    const btnShareProfile = document.querySelector('#btnShareProfile');
    btnShareProfile.addEventListener('click', async function(event){
      await App.handleShareProfile();
    });

    const btnKeyManagement = document.querySelector('#btnKeyManagement');
    btnKeyManagement.addEventListener('click', async function(event){
        window.location.href='keymanagement.html?t='+ (new Date().getTime());
    });

    // Share Profile
    if (App.type==1) {
      document.getElementById("divHeader").innerHTML = 'Toon onderstaande QR code of klik op de knop Profiel delen zodat de persoon jou een wachtwoord kan sturen.';

      // Set input buttons readonly
      document.getElementById('txtName').readOnly  = true;
      document.getElementById('txtCompany').readOnly  = true;
      document.getElementById('txtEmailAddress').readOnly  = true;

      // Remove Opslaan en Reset profile buttons
      const btnSave = document.querySelector('#btnSave');
      btnSave.style.display = 'none';
      const btnResetProfile = document.querySelector('#btnResetProfile');
      btnResetProfile.style.display = 'none';

      document.getElementById("divShowQRCode").style.display = '';

      // Show QRCode
      name = encodeURIComponent(document.getElementById('txtName').value);
      emailAddress = encodeURIComponent(document.getElementById('txtEmailAddress').value);
      company = encodeURIComponent(document.getElementById('txtCompany').value);
      publicKey = encodeURIComponent(document.getElementById('txtPublicKey').value);

      App.url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + "/addressbookmanagement.html?type=0&name=" + name + "&emailAddress=" + emailAddress + "&publicKey=" + publicKey + "&company=" + company + "&t="+ (new Date().getTime());
      console.log(App.url);
      jQuery('#qrcodeCanvas').qrcode({
          text: App.url
      })
    }

    return true;
  },

  handleShareProfile: async function() {

    const shareData = {
      title: 'Klik op de link om mijn publieke profiel te importeren',
      text: 'Nadat je mijn profiel geimporteerd hebt, kun jij aan mij veilig een wachtwoord sturen',
      url: App.url,
    }

    console.log(App.url);

    try {
      await navigator.share(shareData)
      console.log('Link shared successfully')
    } catch(err) {
      console.log(err);

      var mail = "mailto:"
      mail += "?subject=Aanvraag om publieke profiel te delen"

      body = "Hallo, je ontvangt deze email omdat iemand met jou een wachtwoord wilt uitwisselen. Hiervoor . \n\n"
      body += "Klik op de link om op een veilige manier het wachtwoord terugsturen: "
      body += App.url
      body += "\n\nU wordt aangeraden dit bericht na gebruik direct permanent te verwijderen uit uw mailbox.";
      body += "\n\nMet een vriendelijke groet,";
      body += "\n" + name;

      mail += "&body=" + encodeURIComponent(body); 

      var mlink = document.createElement('a');
      mlink.setAttribute('href', mail);
      mlink.click();

    }
    location.href = 'index.html?t='+ (new Date().getTime());
  },

  showProfile: async function() {
    profile = await getProfile(App.profileStore);
    cipher = profile.secretKey;
    publicKey = profile.publicKey;

    document.getElementById('txtName').value = profile.name;
    document.getElementById('txtCompany').value = profile.company;
    document.getElementById('txtEmailAddress').value = profile.emailAddress;
    document.getElementById('txtPublicKey').value = profile.publicKey;

  },

  safeProfile: async function(_name, _emailAddress, _password, _company) { 

    // Lees bestaande cipher, publickey uit
    if ((await checkProfile(App.profileStore)) == false) {
      //alert('Vul je naam en emailadres in en klik op Opslaan op een nieuw profiel aan te maken.');
      console.log('No profile yet');

      App.myKey = nacl.box.keyPair();
      cipher = CryptoJS.AES.encrypt(nacl.util.encodeBase64(App.myKey.secretKey), _password).toString();
      publicKey = nacl.util.encodeBase64(App.myKey.publicKey);

      console.log(cipher);

      await saveProfile(App.profileStore, 0, cipher, publicKey, _name, _emailAddress, _company);
    } else {
      profile = await getProfile(App.profileStore);
      cipher = profile.secretKey;
      publicKey = profile.publicKey;

      await saveProfile(App.profileStore, 0, cipher, publicKey, _name, _emailAddress, _company);
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
    if (document.getElementById('txtCompany').value.length == 0) {
      alert('Er is een fout opgetreden. Het veld Bedrijf is verplicht. Corrigeer de fout en probeer opnieuw.');
      return false;
    }

    if ((await checkProfile(App.profileStore)) == false) {
      if (document.getElementById('txtPassword1').value.length == 0 || document.getElementById('txtPassword2').value.length == 0) {
        alert('Er is een fout opgetreden. U heeft de wachtwoord velden niet juist ingevoerd. Corrigeer de fout en probeer opnieuw.')
        return false;
      }

      if (document.getElementById('txtPassword1').value != document.getElementById('txtPassword2').value) {
        alert('Er is een fout opgetreden. De ingevulde wachtwoorden zijn niet gelijk. Corrigeer de fout en probeer opnieuw.')
        return false;
      }

      if (document.getElementById('txtPassword1').value.length < 8) {
        alert('Er is een fout opgetreden. Het ingevulde wachtwoord moet uit minimaal 8 posities bestaan. Corrigeer de fout en probeer opnieuw.')
        return false;
      }

      if (!confirm('Heeft u een wachtwoord gekozen dat voldoet aan de reguliere wachtwoordeisen? Denk hierbij aan het gebruik van hoofdletters, kleine letters, cijfers en leestekens.')) {

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
