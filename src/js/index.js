App = {

  profileStore: null,

  init: function() {
    //alert('App.init');

    App.profileStore = initStore();

    const btnWachtwoordSturen = document.querySelector('#btnWachtwoordSturen');
    const btnWachtwoordOpvragen = document.querySelector('#btnWachtwoordOpvragen');
    const btnKeyManagement = document.querySelector('#btnKeyManagement');

    // btnWachtwoordSturen.addEventListener('click', async function(event){
    //   if (await checkProfile(App.profileStore)) {
    //     //window.location.href = 'encrypt.html';
    //   } else {
    //     alert('Er is nog geen profiel aanwezig. Ga eerst in het menu naar Mijn profiel om een profiel aan te maken.');
    //   }
    // });
    btnWachtwoordOpvragen.addEventListener('click', async function(event){
      if (await checkProfile(App.profileStore)) {
        window.location.href = 'request.html';
      } else {
        alert('Er is nog geen profiel aanwezig. Ga eerst in het menu naar Mijn profiel om een profiel aan te maken. Ook kunt u een bestaand profiel via een QR scanner toevoegen.');
      }
    });
    btnKeyManagement.addEventListener('click', async function(event){
      if (await checkProfile(App.profileStore)) {
        window.location.href = 'keymanagement.html';
      } else {
        alert('Er is nog geen profiel aanwezig. Ga eerst in het menu naar Mijn profiel om een profiel aan te maken. Ook kunt u een bestaand profiel via een QR scanner toevoegen.');
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
