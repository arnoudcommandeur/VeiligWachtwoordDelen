App = {

  myKey: null,

  init: function() {
    //alert('App.init');
    const btncreateEmail = document.querySelector('#btncreateEmail');
    btncreateEmail.addEventListener('click', async function(event){
      App.initEncrypt();
    });

    return true;
  },

  initEncrypt: function() {

    App.initKey();

    volledigeNaam = document.getElementById("volledigeNaam").value;  
    emailAdres = document.getElementById("emailAdres").value;  
    wachtwoord = document.getElementById("wachtwoord").value

    var mail = "mailto:"
    mail += "?subject=Verzoek voor wachtwoord uitwisseling"

    body = "Hallo\n\n"
    body += "U ontvangt deze email voor het veilig uitwisselen van een wachtwoord.\n\n"
    body += "Klik op de link hieronder om het wachtwoord veilig te delen: "
    body += "http://veiligwachtwoordsturen.web.app/encrypt.html?volledigeNaam=" + encodeURIComponent(volledigeNaam) + "&emailAdres=" + encodeURIComponent(emailAdres) + "&publicKeyReciever=" + encodeURIComponent(nacl.util.encodeBase64(App.myKey.publicKey));

    mail += "&body=" + encodeURIComponent(body); 
    var mlink = document.createElement('a');
    mlink.setAttribute('href', mail);
    mlink.click();

    //alert(cipher);
    return true;
  },

  initKey: function() {

    App.myKey = nacl.box.keyPair();

    let openRequest = indexedDB.open("infent")
    openRequest.onupgradeneeded = () => {
      console.log("DB update needed")
      openRequest.result.createObjectStore("keys")
    }
    openRequest.onsuccess = () => {
      console.log("DB opened")
      let store = openRequest.result.transaction("keys", "readwrite").objectStore("keys")

      // store.put({id: 'AC', data: {name: {first: "John", last: "Doe"}, age: 42}}); -- Maybe better than store.add?
      store.put({secretkey: nacl.util.encodeBase64(App.myKey.secretKey)}, '0')
    }
  }
  // end App
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
