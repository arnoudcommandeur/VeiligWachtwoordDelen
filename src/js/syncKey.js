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
    document.getElementById('txtCompany').value = urlParams.get('company');

    btnImportProfile.addEventListener('click', async function(event){
      await App.safeProfile(document.getElementById('txtName').value, document.getElementById('txtEmailAddress').value, document.getElementById('txtPublicKey').value, document.getElementById('txtSecretKey').value, document.getElementById('txtCompany').value);
      window.location.href = 'index.html?t='+ (new Date().getTime());
    });

    return true;
  },

  safeProfile: async function(_name, _emailAddress, _publicKey, _secretKey, _company) { 

      await saveProfile(App.profileStore, 0, _secretKey, _publicKey, _name, _emailAddress, _company);
  }
};

$(function() {
  $(window).load(async function() {
    await App.init();
  });
});
