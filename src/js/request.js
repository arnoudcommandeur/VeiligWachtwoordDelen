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

    url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + "/encrypt.html?name=" + encodeURIComponent(name) + "&emailAddress=" + encodeURIComponent(emailAddress) + "&publicKeyReciever=" + encodeURIComponent(profile.publicKey);

    const shareData = {
      title: 'Veilig Wachtwoord Sturen',
      text: 'Klik op de link om veilig een wachtwoord te sturen',
      url: url,
    }

    console.log(url);

    try {
      await navigator.share(shareData)
      console.log('Link shared successfully')
    } catch(err) {
      console.log(err);
    }
  },
};

$(function() {
  $(window).load(async function() {
    await App.init();
  });
});
