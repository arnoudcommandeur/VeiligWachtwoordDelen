App = {

  profileStore: null,

  init: async function() {

    App.profileStore = initStore();

    const btnImportProfile = document.querySelector('#btnImportProfile');

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    document.getElementById('txtName').value = urlParams.get('name'); 
    document.getElementById('txtEmailAddress').value = urlParams.get('emailAddress');  
    document.getElementById('txtPublicKey').value = urlParams.get('publicKey');
    document.getElementById('txtSecretKey').value = urlParams.get('secretKey');

    btnImportProfile.addEventListener('click', async function(event){

      await App.safeProfile(document.getElementById('txtName').value, document.getElementById('txtEmailAddress').value, document.getElementById('txtPublicKey').value, document.getElementById('txtSecretKey').value);
      window.location.href = 'index.html?t='+ (new Date().getTime());
    });

    return true;
  },

  safeProfile: async function(_name, _emailAddress, _publicKey, _secretKey) { 

      await saveProfile(App.profileStore, 0, _secretKey, _publicKey, _name, _emailAddress);
  }
};

$(function() {
  $(window).load(async function() {
    await App.init();
  });
});
