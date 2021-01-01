App = {

  init: function() {
    //alert('App.init');
    const btnWachtwoordSturen = document.querySelector('#btnWachtwoordSturen');
    const btnWachtwoordOpvragen = document.querySelector('#btnWachtwoordOpvragen');
    const btnKeyManagement = document.querySelector('#btnKeyManagement');

    btnWachtwoordSturen.addEventListener('click', async function(event){
      window.location.href = 'encrypt.html';
    });
    btnWachtwoordOpvragen.addEventListener('click', async function(event){
      window.location.href = 'request.html';
    });
    btnKeyManagement.addEventListener('click', async function(event){
      window.location.href = 'keymanagement.html';
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
