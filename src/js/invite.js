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
      text: 'Klik op de link om veilig een wachtwoord op te vragen bij ' + name,
      url: url,
    }

    console.log(url);

    try {
      await navigator.share(shareData)
      location.href = 'index.html?t='+ (new Date().getTime());
    } catch(err) {

      if (err.message == 'navigator.share is not a function') {
        var mail = "mailto:"
        mail += "?subject=Aanvraag om public key te delen"

        body = "U ontvangt deze email van " + name + " omdat hij u een wachtwoord wilt sturen. \n\n"
        body += "Voordat hij het wachtwoord kan sturen, moet hij eerst de Public Key van u ontvangen. Klik op link om een profiel aan te maken en de Public Key terug te sturen: "
        body += url
        body += "\n\nU wordt aangeraden dit bericht na gebruik direct permanent te verwijderen uit uw mailbox.";
        body += "\n\nMet een vriendelijke groet,";
        body += "\n" + name;

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
