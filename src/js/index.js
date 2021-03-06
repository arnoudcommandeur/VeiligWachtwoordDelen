App = {

  profileStore: null,

  init: function() {
    //alert('App.init');

    App.profileStore = initStore();

    const btnWachtwoordSturen = document.querySelector('#btnWachtwoordSturen');
    const btnWachtwoordOpvragen = document.querySelector('#btnWachtwoordOpvragen');
    const btnShareProfile = document.querySelector('#btnShareProfile');

    btnWachtwoordSturen.addEventListener('click', async function(event){
      if (await checkProfile(App.profileStore)) {
        window.location.href = 'invite.html?t='+ (new Date().getTime());
      } else {
        alert('Er is nog geen profiel aanwezig. Ga eerst in het menu naar Mijn profiel om een profiel aan te maken. Ook kun je een bestaand profiel via een QR scanner toevoegen.');
      }
    });
    btnWachtwoordOpvragen.addEventListener('click', async function(event){
      if (await checkProfile(App.profileStore)) {
        window.location.href = 'request.html?t='+ (new Date().getTime());
      } else {
        alert('Er is nog geen profiel aanwezig. Ga eerst in het menu naar Mijn profiel om een profiel aan te maken. Ook kun je een bestaand profiel via een QR scanner toevoegen.');
      }
    });
    btnShareProfile.addEventListener('click', async function(event){
      if (await checkProfile(App.profileStore)) {
        window.location.href = 'profile.html?type=1&t='+ (new Date().getTime());
      } else {
        alert('Er is nog geen profiel aanwezig. Ga eerst in het menu naar Mijn profiel om een profiel aan te maken. Ook kun je een bestaand profiel via een QR scanner toevoegen.');
      }
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
