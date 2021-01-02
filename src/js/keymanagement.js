App = {

  myKey: null,
  publicKey: null,

  init: function() {
    //alert('App.init');
    const btnShowKeys = document.querySelector('#btnShowKeys');
    const btnBack = document.querySelector('#btnBack');

    // btnShowKeys.addEventListener('click', async function(event){
    //   App.showKeys();
    // });
    btnBack.addEventListener('click', async function(event){
      App.back();
    });

//    var url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/importkeys.html?encryptedSecretKey=123456';

    return true;
  },

  showKeys: function() { 
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
            volledigeNaam = cursor.value["naam"];
            emailAdres = cursor.value["emailadres"];

            document.getElementById("divPublicKey").innerHTML = App.publicKey;

            url = "http://veiligwachtwoordsturen.web.app/encrypt.html?volledigeNaam=" + encodeURIComponent(volledigeNaam) + "&emailAdres=" + encodeURIComponent(emailAdres) + "&publicKeyReciever=" + encodeURIComponent(App.publicKey);
            //url = encodeURIComponent(url); 
            console.log(url);

            jQuery('#qrcodeCanvas').qrcode({
                text: url
            });	

            const divShowKeys = document.querySelector('#divShowKeys')
            const divMenu = document.querySelector('#divMenu')

            divMenu.style.display = 'none'
            divShowKeys.style.display = '';
          }
          else {
            console.log('database wel aanwezig, maar leeg');
            alert('Er is nog geen versleutel key aanwezig op deze computer. Navigeer naar Profile in het menu en genereer een volledig nieuw profiel.');
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
    return true;
  },

  back: function() {

    const divMenu = document.querySelector('#divMenu')
    const divShowKeys = document.querySelector('#divShowKeys')

    divMenu.style.display = ''
    divShowKeys.style.display = 'none';

    //const qrcodeCanvas = document.querySelector('#qrcodeCanvas')

    return true;
  }
  // end App
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});


