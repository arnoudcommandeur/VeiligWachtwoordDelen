App = {

  //myKey: null,
  //publicKey: null,

  init: function() {
    //alert('App.init');
    App.profileStore = initStore();

    const btnSyncKey = document.querySelector('#btnSyncKey');
    const btnBack = document.querySelector('#btnBack');

    btnSyncKey.addEventListener('click', async function(event) {
      document.getElementById("divHeader").style.display = 'none';
      await App.syncKey();
    });
    btnBack.addEventListener('click', async function(event){
      App.back();
    });

    return true;
  },

  syncKey: async function() { 

    profile = await getProfile(App.profileStore);

    if (await checkProfile(App.profileStore)) {
      //window.location.href = 'request.html';
    } else {
      alert('Er is nog geen profiel aanwezig. Ga eerst in het menu naar Mijn profiel om een profiel aan te maken. Ook kunt u een bestaand profiel via een QR scanner toevoegen.');
      return false;
    }

    const divShowKey = document.querySelector('#divShowKey')
    const divMenu = document.querySelector('#divMenu')

    divMenu.style.display = 'none'
    divShowKey.style.display = '';

//    var url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/importkeys.html?encryptedSecretKey=123456';
    url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + "/syncKey.html?name=" + encodeURIComponent(profile.name) + "&emailAddress=" + encodeURIComponent(profile.emailAddress) + "&publicKey=" + encodeURIComponent(profile.publicKey)  + "&secretKey=" + encodeURIComponent(profile.secretKey);
    console.log(url);

    jQuery('#qrcodeCanvas').qrcode({
        text: url
    })
    document.querySelector('#divPublicKey').innerHTML = profile.publicKey;

    return true;
  },

  back: function() {

    // const divMenu = document.querySelector('#divMenu')
    // const divShowKeys = document.querySelector('#divShowKey')

    // divMenu.style.display = ''
    // divShowKeys.style.display = 'none';

    location.href = 'index.html?t='+ (new Date().getTime());
    return true;
  }
  // end App
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});


