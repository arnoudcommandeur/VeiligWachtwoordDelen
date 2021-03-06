App = {

  profileStore: null,

  init: async function() {
    //alert('App.init');
    App.profileStore = initStore();

    await App.readProfile();

    const btnCreateMessage = document.querySelector('#btnCreateMessage');
    btnCreateMessage.addEventListener('click', async function(event){
      await App.requestPassword();
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

  requestPassword: async function() {

    profile = await getProfile(App.profileStore);

    name = document.getElementById("txtName").value;  
    emailAddress = document.getElementById("txtEmailAddress").value;  

    url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + "/encrypt.html?name=" + encodeURIComponent(name) + "&emailAddress=" + encodeURIComponent(emailAddress) + "&publicKeyReciever=" + encodeURIComponent(profile.publicKey) + "&t="+ (new Date().getTime());

    const shareData = {
      title: 'Aanvraag om wachtwoord te delen',
      text: 'Stuur mij via deze link veilig een wachtwoord',
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

        body = "Je ontvangt deze email voor het veilig delen van een wachtwoord. \n\n"
        body += "Klik op de link hieronder om op een veilige manier het wachtwoord te sturen: "
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
