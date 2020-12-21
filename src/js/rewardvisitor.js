App = {
  web3Provider: null,
  contracts: {},
  account: null,
  logresult: null,

  init: async function() {
    //alert('App.init');
    const btn = document.querySelector('#reward');
    const btnNewTokens = document.querySelector('#NewTokens');

    let address = window.location.search;
    address = address.substring(address.length-40);
    document.getElementById("MyAddress").innerHTML = '0x' + address;

    btn.addEventListener('click', async function(event){
      await App.rewardVisitor();
    });
    btnNewTokens.addEventListener('click', async function(event){
      await App.buyTokens();
    });

    return App.initWeb3();
  },

  initWeb3: async function() {
    //alert('App.initWeb3');

    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        //alert("Modern dapp browser web3 initiated")
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        alert("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
      //alert("Legacy dapp browser web3 initiated")
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      alert('No provider yet, eventlistener added!');
      window.addEventListener('ethereum#initialized', App.initWeb3, {
        once: true,
      });
      setTimeout(App.initWeb3, 3000); // 3 seconds
    //  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    //   alert("Genache web3 initiated")
    //   setTimeout(function(){ window.location.reload(); }, 1000);
    }

    if (App.web3Provider) {
      //alert('We have a provider :)');
      web3 = new Web3(App.web3Provider);
 
      await web3.eth.getAccounts().then(v => {App.account = v} );
      //alert('App.initWeb3.accountsLoaded');
      return App.initContract();
    }
    return 0;
},

  initContract: function() {
    //alert('App.initContract');

    $.getJSON('Collectables.json?version=1', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var CollectablesArtifact = data;
      App.contracts.Collectable = TruffleContract(CollectablesArtifact);

      // Set the provider for our contract
      App.contracts.Collectable.setProvider(App.web3Provider);
      App.contracts.Collectable.deployed().then(function(instance) { })

      return App.getEscapeRoomAdminDetails();
    });
  },

  getEscapeRoomAdminDetails: function() {

    if (App.web3Provider) {
      $.getJSON('Collectables.json?version=1', function(data) {
        // Get the necessary contract artifact file and instantiate it with @truffle/contract
        var CollectablesArtifact = data;
        App.contracts.Collectable = TruffleContract(CollectablesArtifact);

        // Set the provider for our contract
        App.contracts.Collectable.setProvider(App.web3Provider);

        App.contracts.Collectable.deployed().then(function(instance) {
            return instance.getEscapeRoomAdminDetails.call({from: App.account[0]}).then(function (res) {
              document.getElementById("MyEscapeRoomName").innerHTML = res[0];
              document.getElementById("MyTokenBalance").innerHTML = res[1].toNumber();

              console.log("Contract address:" + instance.address);
              console.log("Current address :" + App.account[0]);

              console.log(res);

              web3.eth.getBalance(App.account[0]).then(result => {
                document.getElementById("MyEtherBalance").innerHTML = web3.utils.fromWei(result, 'ether');
              });

            });
        })
      });
    } else {
      alert('Error: No App.web3Provider Yet!');
    }
    return 0;
  },

  rewardVisitor: function(res) {
    //alert('App.reward');

    if (App.web3Provider) {
      $.getJSON('Collectables.json?version=1', function(data) {
        // Get the necessary contract artifact file and instantiate it with @truffle/contract
        var CollectablesArtifact = data;
        App.contracts.Collectable = TruffleContract(CollectablesArtifact);

        // Set the provider for our contract
        App.contracts.Collectable.setProvider(App.web3Provider);

        console.log(data.toString());

        let address = window.location.search;
        address = address.substring(address.length-40);
        //alert(address);
        //alert('Valid address? ' + address + ' - ' + web3.utils.isAddress(address));

        if ( web3.utils.isAddress(address)) {
          //alert('YES Valid address');
          App.contracts.Collectable.deployed().then(function(instance) {
            instance.rewardVisitor(/*1, */ address, {from: App.account[0], gas: 1000000}).then( () => App.getEscapeRoomAdminDetails());
            
            console.log(address);
          })
        }
      });
    } else {
      alert('Error: No App.web3Provider Yet!');
    }
    return 0;
  },

  buyTokens: function(res) {
    console.log('App.buyTokens');

    if (App.web3Provider) {
      $.getJSON('Collectables.json?version=1', function(data) {
        // Get the necessary contract artifact file and instantiate it with @truffle/contract
        var CollectablesArtifact = data;
        App.contracts.Collectable = TruffleContract(CollectablesArtifact);

        // Set the provider for our contract
        App.contracts.Collectable.setProvider(App.web3Provider);

        App.contracts.Collectable.deployed().then(function(instance) {
          instance.mintTokens(1000, {from: App.account[0], gas: 1000000, value: web3.utils.toWei("1.0", "ether")}).then( () => App.getEscapeRoomAdminDetails());
        })
    })
    return 0;
  }},
// end App
};

$(function() {
  $(window).load(async function() {
    App.init();
  });
});
