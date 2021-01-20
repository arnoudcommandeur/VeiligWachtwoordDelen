App = {

  profileStore: null,
  myKey: null,

  init: async function() {
    //alert('App.init');

    App.profileStore = initStore();
    const btnDecrypt = document.querySelector('#btnDecrypt');

    btnDecrypt.addEventListener('click', async function(event){
      if (await checkProfile(App.profileStore)) {
        await App.decrypt();
      } else {
        alert('Er is nog geen profiel aanwezig. Ga eerst in het menu naar Mijn profiel om een profiel aan te maken. Ook kun je een bestaand profiel via een QR scanner toevoegen.');
      }
    });

    const btnClose = document.querySelector('#btnClose');
    btnClose.addEventListener('click', async function(event){
      document.getElementById("divDescription").innerHTML = '';
      document.getElementById("divSecret").innerHTML = '';
      window.location.href = 'index.html'
    });

    return true;
  },

  decrypt: async function() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    profile = await getProfile(App.profileStore);
    secretKeyCipher = profile.secretKey;

    myPassword = window.prompt("Geef het wachtwoord om de persoonlijke encryptiekey te openen","");
    plainBytes = CryptoJS.AES.decrypt(secretKeyCipher, myPassword)
    secretKey = plainBytes.toString(CryptoJS.enc.Utf8);

    try {
      App.myKey = nacl.box.keyPair.fromSecretKey(nacl.util.decodeBase64(secretKey))
    } catch (error) {
      alert('Onjuist wachtwoord. Probeer opnieuw.');
      return false;
    }
    publicKeySender = nacl.util.decodeBase64(decodeURIComponent(urlParams.get('publicKeySender')));  

    nonceD = nacl.util.decodeBase64(decodeURIComponent(urlParams.get('nonceD')));  
    nonceP = nacl.util.decodeBase64(decodeURIComponent(urlParams.get('nonceP')));  
    cipherD = nacl.util.decodeBase64(decodeURIComponent(urlParams.get('cipherD')));
    cipherP = nacl.util.decodeBase64(decodeURIComponent(urlParams.get('cipherP')));

    description = nacl.box.open(cipherD, nonceD, publicKeySender, App.myKey.secretKey);
    secret = nacl.box.open(cipherP, nonceP, publicKeySender, App.myKey.secretKey);

    document.getElementById("divDescription").innerHTML = nacl.util.encodeUTF8(description);
    document.getElementById("divSecret").innerHTML = nacl.util.encodeUTF8(secret);

    const divStep1 = document.querySelector('#divStep1')
    const divStep2 = document.querySelector('#divStep2')

    divStep1.style.display = 'none'
    divStep2.style.display = '';

    divDescription.addEventListener('click', function(event){
      App.copyToClipboard('#divDescription');
    });
    divSecret.addEventListener('click', function(event){
      App.copyToClipboard('#divSecret');
    });


  },

  copyToClipboard: function (element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
  }

  // end App
};

$(function() {
  $(window).load(async function() {
    await App.init();
  });
});
