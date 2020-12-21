App = {
  web3Provider: null,
  contracts: {},
  account: null,
  logresult: null,

  init: async function() {
    await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
        console.log("Modern dapp browser web3 initiated")
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
      console.log("Legacy dapp browser web3 initiated")
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      console.log("Genache web3 initiated")
    }
    web3 = new Web3(App.web3Provider);

    await web3.eth.getAccounts().then(v => {App.account = v} );

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Collectables.json?version=5', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var CollectablesArtifact = data;
      App.contracts.Collectable = TruffleContract(CollectablesArtifact);

      // Set the provider for our contract
      App.contracts.Collectable.setProvider(App.web3Provider);


    App.contracts.Collectable.deployed().then(function(instance) {
    //collectableInstance = instance;
      console.log('Contract address:' + instance.address);

      const subscription = web3.eth.subscribe(
        'logs',
        {
          address: instance.address, // '0xE3BA9a866795c9bc416A31c0893518fDFA616A97'
          from: 0,
          // topics: [ [web3.utils.sha3('visitorRewarded(address,uint256)') ] ]      
          topics: [ web3.utils.sha3('visitorRewarded(address,uint256)') , '0x000000000000000000000000' + App.account[0].substring(2,).toLowerCase(), null  ]
        },
        (error, result) => {
          if (error) return;
          // do something with the data
          console.log(result);
App.logresult = result;
          window.location.reload();    
        }
      );

    })


      // Use our contract to retrieve and mark the adopted pets
      return App.showCollectablesMain();
    });

    //return App.bindEvents();
  },

  showCollectablesMain: function() {
    //var collectableInstance;

    App.contracts.Collectable.deployed().then(function(instance) {
    //collectableInstance = instance;

      return instance.EscapeRoomCounter.call();
    }).then(function(EscapeRoomCounter) {
      console.log("Number of Escape Rooms: " + EscapeRoomCounter.toNumber());

      for (var i = 0; i < EscapeRoomCounter; i++) {
        App.showCollectable(i+1); // Counter starts with 1
      }


    }).catch(function(err) {
      console.error(err.message);
    });
  },

  showCollectable: async function(EscapeRoomCounter) {
    var collectableRow = $('#collectableRow');
    var collectableTemplate = $('#collectableTemplate');


    App.contracts.Collectable.deployed().then(function(instance) {

      return instance.balanceOf.call(App.account[0],EscapeRoomCounter);
    }).then(function(tokens) {
      console.log("Number of Tokens for Escape Room: " + EscapeRoomCounter + " for account: " + App.account + ": " + tokens.toNumber());

        if (tokens.toNumber() > 0) {
          console.log(tokens.toNumber());
          collectableTemplate.find('.numberCircle').text('Escaperoom reward Token ID: ' + EscapeRoomCounter);
          // collectableTemplate.find('.pet-age').text(data[i].age);
          // collectableTemplate.find('.pet-location').text(data[i].location);
          // collectableTemplate.find('.btn-adopt').attr('data-id', data[i].id);
          collectableRow.append(collectableTemplate.html()+'<BR>');
        }
    }).catch(function(err) {
      console.error(err.message);
    });
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
