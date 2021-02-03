App = {

  profileStore: null,

  init: async function() {
    //alert('App.init');
    App.profileStore = initStore();
    await App.readProfile();

    const btnCreateMessage = document.querySelector('#btnCreateMessage');
    btnCreateMessage.addEventListener('click', async function(event){
      await App.sendInvite();
    });
    const btnAddressbook = document.querySelector('#btnAddressbook');
    btnAddressbook.addEventListener('click', async function(event){
      window.location.href = 'addressbook.html'
    });

    return true;
  },

  readProfile: async function() {

    profile = await getProfile(App.profileStore);
    document.getElementById("txtName").value = profile.name;  
    document.getElementById("txtEmailAddress").value = profile.emailAddress;  

    cipher = profile.secretKey;
    publicKey = profile.publicKey;

  },

  sendInvite: async function() {

    profile = await getProfile(App.profileStore);

    name = document.getElementById("txtName").value;  
    emailAddress = document.getElementById("txtEmailAddress").value;  

    url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + "/profile.html?type=0&t="+ (new Date().getTime());

    const shareData = {
      title: 'Veilig Wachtwoord Sturen',
      text: 'Ik wil jou op een veilige manier een wachtwoord sturen. Hiervoor heb ik jouw public key nodig. Klik op onderstaande link om deze terug te sturen: ',
      url: url,
    }

    console.log(url);

    try {
      await navigator.share(shareData)
      location.href = 'index.html?t='+ (new Date().getTime());
    } catch(err) {

      if (err.message == 'navigator.share is not a function') {
        var mail = "mailto:"
        mail += "?subject=Veilig wachtwoord uitwisselen"

        body = "Ik wil jou op een veilige manier een wachtwoord sturen. \n\n"
        body += "Hiervoor heb ik jouw Public key nodig. Klik op link om eerst een Public key aan te maken en mij daarna de Public key terug te sturen: "
        body += url
        body += "\n\nJe wordt aangeraden deze email na gebruik te verwijderen uit je mailbox.";

        mail += "&body=" + encodeURIComponent(body); 

        var mlink = document.createElement('a');
        mlink.setAttribute('href', mail);
        mlink.click();
        location.href = 'index.html?t='+ (new Date().getTime());
      }
    }
    closeLoading('btnCreateMessage');
  },
};

$(function() {
  $(window).load(async function() {
    await App.init();
  });
});
