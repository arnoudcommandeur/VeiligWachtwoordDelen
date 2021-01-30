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

    if ((await checkProfile(App.profileStore)) == false) {
      alert('Er is nog geen profiel aanwezig, maak deze eerst aan via het menu Profiel');
      //document.getElementById("divPassword").style.display = '';
    } else {
      App.showAddressbook();
    }


    $('#txtSearch').on('input',function(e){
        App.searchAddressbook($('#txtSearch').val())
    });

    return true;
  },

  searchAddressbook: function(_searchText) {

    //console.log(_searchText);

    $(".addressbookItem").each(function( index ) {
      //console.log( index + ": " + $( this ).text() );
      // console.log(this.innerHTML.includes(_searchText))
      // console.log(index);
      //console.log($(this).attr('data-id'));


      if (!$(this).attr('data-id').toUpperCase().includes(_searchText.toUpperCase())) { 
        this.style.display = 'none'
       } 
      else 
        this.style.display = ''
    });

  },

  showAddressbook: async function() {

    addressbookKeys: null;
    await idbKeyval.keys(App.addressbookStore).then((keys) => addressbookKeys = keys);

    for (i=0; i<addressbookKeys.length; i++) {

      if (addressbookKeys[i] != 0) {
        var row = $('#addressbookRow');
        var template = $('#addressbookRowTemplate');

        val = await idbKeyval.get(addressbookKeys[i], App.addressbookStore).then((val) => { return val } )

        //template.attr('data-allData', val.name);
        template.find('.item').attr('data-id', val.name + val.company + val.emailAddress);
        template.find('.name').text(val.name);
        template.find('.company').text(val.company);
        template.find('.emailAddress').text(val.emailAddress);
        template.find('.publicKey').text(val.publicKey);
        template.find('.btn-send').attr('data-id', addressbookKeys[i]);
        template.find('.btn-send').attr('data-emailaddress', val.emailAddress);
        template.find('.btn-send').attr('data-publickey', val.publicKey);

        row.append(template.html()+'<BR>');
      }
    }

    $(document).on('click', '.btn-send', App.handleSend);

  },

  handleSend: function(event) {
    event.preventDefault();

    console.log(event.target);

    var id = $(event.target).data('id');
    var emailAddress = encodeURIComponent($(event.target).data('emailaddress'));
    var publicKey = encodeURIComponent($(event.target).data('publickey'));

    url = 'encrypt.html?name=' + name + '&emailAddress=' + emailAddress + '&publicKeyReciever=' + publicKey + '&t=1611668211185';
    console.log(url);

    window.location.href = url;
  }
};

$(function() {
  $(window).load(async function() {
    await App.init();
  });
});
