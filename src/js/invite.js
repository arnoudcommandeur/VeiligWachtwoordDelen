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

    url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + "/profile.html?type=0";

    const shareData = {
      title: 'Veilig Wachtwoord Sturen',
      text: 'Klik op de link om veilig een wachtwoord op te vragen bij ' + name,
      url: url,
    }

    console.log(url);

    try {
      await navigator.share(shareData)
      console.log('Link shared successfully')
    } catch(err) {
      console.log(err);

      var mail = "mailto:"
      mail += "?subject=Aanvraag om wachtwoord te delen"

      body = "U ontvangt deze email omdat " + name + " aan u een beveiligd wachtwoord wilt sturen. \n\n"
      body += "Klik op de link om het proces van een veilige wachtwoord uitwisseling te starten: "
      body += url + '\n\n'
      body += "\n\nU wordt aangeraden dit bericht na gebruik direct permanent te verwijderen uit uw mailbox.";

      mail += "&body=" + encodeURIComponent(body); 

      var mlink = document.createElement('a');
      mlink.setAttribute('href', mail);
      mlink.click();

    }
    location.href = 'index.html';
  },
};

$(function() {
  $(window).load(async function() {
    await App.init();
  });
});
