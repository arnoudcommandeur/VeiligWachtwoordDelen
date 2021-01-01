App = {

  myKey: null,
  publicKey: null,

  init: function() {
    //alert('App.init');
    const btnShowKeys = document.querySelector('#btnShowKeys');
    const btnBack = document.querySelector('#btnBack');

    btnShowKeys.addEventListener('click', async function(event){
      showKeys();
    });
    btnBack.addEventListener('click', async function(event){
      back();
    });

    var url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/importkeys.html?encryptedSecretKey=123456';

    jQuery('#qrcodeCanvas').qrcode({
        text: url
    });	

    return true;
  },

  // end App
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});


function showKeys() {

  const divShowKeys = document.querySelector('#divShowKeys')
  const divMenu = document.querySelector('#divMenu')

  divMenu.style.display = 'none'
  divShowKeys.style.display = '';

  return true;
};

function back() {

  const divMenu = document.querySelector('#divMenu')
  const divShowKeys = document.querySelector('#divShowKeys')

  divMenu.style.display = ''
  divShowKeys.style.display = 'none';

  const qrcodeCanvas = document.querySelector('#qrcodeCanvas')

  return true;
};
