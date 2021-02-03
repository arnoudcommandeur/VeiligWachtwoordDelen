App = {

  profileStore: null,
  myKey: null,

  init: async function() {

    App.profileStore = initStore();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const btnDecrypt = document.querySelector('#btnDecrypt');

    if (decodeURIComponent(urlParams.get('type')) == 0) {
      const divCipher = document.querySelector('#divCipher');
      divCipher.style.display = '';
    }

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

    queryString = window.location.search;
    urlParams = new URLSearchParams(queryString);

    profile = await getProfile(App.profileStore);
    secretKeyCipher = profile.secretKey;

    myPassword = window.prompt("Geef het wachtwoord om de persoonlijke encryptiekey te openen","");
    plainBytes = CryptoJS.AES.decrypt(secretKeyCipher, myPassword)
    secretKey = plainBytes.toString(CryptoJS.enc.Utf8);

    try {
      App.myKey = nacl.box.keyPair.fromSecretKey(nacl.util.decodeBase64(secretKey))
    } catch (error) {
      alert('Onjuist wachtwoord. Probeer opnieuw.');
      closeLoading('btnDecrypt');  
      return false;
    }

    if (decodeURIComponent(urlParams.get('type')) == 0) {
      App.insertUrlParam(document.getElementById('txtCipher').value)
    }

    queryString = window.location.search;
    urlParams = new URLSearchParams(queryString);

    console.log(urlParams.get('publicKeySender'));

    publicKeySender = nacl.util.decodeBase64(decodeURIComponent(urlParams.get('publicKeySender')));  

    nonceD = nacl.util.decodeBase64(decodeURIComponent(urlParams.get('nonceD')));  
    nonceP = nacl.util.decodeBase64(decodeURIComponent(urlParams.get('nonceP')));  
    cipherD = nacl.util.decodeBase64(decodeURIComponent(urlParams.get('cipherD')));
    cipherP = nacl.util.decodeBase64(decodeURIComponent(urlParams.get('cipherP')));

    try {
      description = nacl.box.open(cipherD, nonceD, publicKeySender, App.myKey.secretKey);
      secret = nacl.box.open(cipherP, nonceP, publicKeySender, App.myKey.secretKey);
    } catch(err) {
      alert('Er is een fout opgetreden tijdens het ontcijferen van het bericht. Probeer opnieuw.');
      closeLoading('btnDecrypt');  
      return false;
    }

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
  },

  insertUrlParam: function(queryString) {
    if (history.pushState) {

        // let searchParams = new URLSearchParams(window.location.search);
        // searchParams.set(key, value);
        let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + queryString //searchParams.toString();
        window.history.pushState({path: newurl}, '', newurl);
    }
}

  // end App
};

$(function() {
  $(window).load(async function() {
    await App.init();
  });
});
