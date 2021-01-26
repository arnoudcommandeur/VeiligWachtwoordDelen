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
    const btnSave = document.querySelector('#btnSave');
    btnSave.addEventListener('click', async function(event){
      await App.handleSave();
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
      template.find('.btn-edit').attr('data-name', val.name);
      template.find('.btn-edit').attr('data-emailaddress', val.emailAddress);
      template.find('.btn-edit').attr('data-publickey', val.publicKey);
      template.find('.btn-edit').attr('data-company', val.company);
      template.find('.btn-edit').attr('data-publickey', val.publickey);

      row.append(template.html()+'<BR>');
    }

    $(document).on('click', '.btn-edit', App.handleEdit);

  },

  handleEdit: function(event) {
    event.preventDefault();
    console.log(event.target);

    document.getElementById("divHeader").innerHTML = 'Voer de wijzigingen door en klik op Opslaan';

    document.getElementById("txtId").value = $(event.target).data('id');
    document.getElementById("txtName").value = $(event.target).data('name');
    document.getElementById("txtEmailAddress").value = $(event.target).data('emailaddress');
    document.getElementById("txtCompany").value = $(event.target).data('company');
    document.getElementById("txtPublicKey").value = $(event.target).data('publickey');

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
  },

  handleSave: async function() {

    _index = document.getElementById("txtId").value
    _publicKey = document.getElementById("txtPublicKey").value
    _name = document.getElementById("txtName").value
    _emailAddress = document.getElementById("txtEmailAddress").value
    _company = document.getElementById("txtCompany").value

    await addAddressbookItem(App.addressbookStore, _index, _publicKey, _name, _emailAddress, _company)

    window.location.reload(true);

    // const divAddressbookList = document.querySelector('#divAddressbookList')
    // const divAddressbookEdit = document.querySelector('#divAddressbookEdit')

    // divAddressbookList.style.display = ''
    // divAddressbookEdit.style.display = 'none';
  }



};

$(function() {
  $(window).load(async function() {
    await App.init();
  });
});
