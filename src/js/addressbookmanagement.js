App = {

  myKey: null,
  profileStore: null,
  addressbookStore: null,

  type: null, // 0 direct doorgaan naar encrypt.html
// encrypt.html?name=Arnoud%20Commandeur&emailAddress=arnoudcommandeur%40hotmail.com&publicKeyReciever=7CpDmZ%2FXABBFYwTpu86Q%2Bftw6k%2F0gZ7tY%2F%2FBzktK02Y%3D

  init: async function() {

    App.profileStore = initStore();
    App.addressbookStore = initAddressbook();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    App.type = decodeURIComponent(urlParams.get('type'));

    const btnBack = document.querySelector('#btnBack');
    btnBack.addEventListener('click', async function(event){
      await App.handleBack();
    });

    if ((await checkProfile(App.profileStore)) == false) {
      alert('Er is nog geen profiel aanwezig, maak deze eerst aan via het menu Profiel');
      //document.getElementById("divPassword").style.display = '';
    } else {
      App.showAddressbook();
    }

    return true;
  },

  showAddressbook: async function() {

    addressbookKeys: null;
    await idbKeyval.keys(App.addressbookStore).then((keys) => addressbookKeys = keys);

    for (i=0; i<addressbookKeys.length; i++) {
      var row = $('#addressbookRow');
      var template = $('#addressbookRowTemplate');

      val = await idbKeyval.get(addressbookKeys[i], App.addressbookStore).then((val) => { return val } )

      template.find('.name').text(val.name);
      template.find('.emailAddress').text(val.emailAddress);
      template.find('.company').text(val.company);
      template.find('.publicKey').text(val.publicKey);
      template.find('.btn-edit').attr('data-id', addressbookKeys[i]);
      template.find('.btn-edit').attr('data-emailaddress', val.emailAddress);
      template.find('.btn-edit').attr('data-publickey', val.publicKey);
      template.find('.btn-edit').attr('data-company', val.company);

      row.append(template.html()+'<BR>');
    }

    $(document).on('click', '.btn-edit', App.handleSend);

  },

  handleSend: function(event) {
    event.preventDefault();
    console.log(event.target);

    document.getElementById("divHeader").innerHTML = 'Voer de wijzigingen door en klik op Opslaan';

    var id = $(event.target).data('id');
    var emailAddress = $(event.target).data('emailaddress');
    var publicKey = $(event.target).data('publickey');

    const divAddressbookList = document.querySelector('#divAddressbookList')
    const divAddressbookEdit = document.querySelector('#divAddressbookEdit')

    divAddressbookList.style.display = 'none'
    divAddressbookEdit.style.display = '';
  },

  handleBack: function() {

    const divAddressbookList = document.querySelector('#divAddressbookList')
    const divAddressbookEdit = document.querySelector('#divAddressbookEdit')

    divAddressbookList.style.display = ''
    divAddressbookEdit.style.display = 'none';
  }


};

$(function() {
  $(window).load(async function() {
    await App.init();
  });
});
