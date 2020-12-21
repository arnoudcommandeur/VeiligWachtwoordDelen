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

    return showAddress();
  },

  subscribeEvents: function() {
    $.getJSON('Collectables.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var CollectablesArtifact = data;
      App.contracts.Collectable = TruffleContract(CollectablesArtifact);

      // Set the provider for our contract
      App.contracts.Collectable.setProvider(App.web3Provider);


    App.contracts.Collectable.deployed().then(function(instance) {
    //collectableInstance = instance;

      const subscription = web3.eth.subscribe(
        'logs',
        {
          address: instance.address,
          from: 0,
          topics: [ web3.utils.sha3('visitorRewarded(address,uint256)') , '0x000000000000000000000000' + App.account[0].substring(2,).toLowerCase(), null  ]
        },
        (error, result) => {
          if (error) return;
          console.log(result);
          window.location.href = 'showcollectibles.html';    
        }
      );

    })
    });
  }
}

$(function() {
  $(window).load(function() {
    App.init();
  });
});

  function showAddress() {
    var d = new Date();
    var n = d.getTime();



    var url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/rewardvisitor.html?id=' + n + '&account=' + App.account[0];
    //var url = 'https://join.status.im/browse/escaperoomcollectables.web.app/rewardvisitor.html?id=' + n + '&account=' + App.account[0];

    jQuery('#qrcodeCanvas').qrcode({
        text: url
    });	

    document.getElementById("MyAddress").innerHTML = App.account[0];
    document.getElementById("RewardLink").href = url;
    console.log(url);
    return App.subscribeEvents();
  };

// jQuery(function() {
//   $(window).ready(function() {
//     deviceReady();
//   }) });

// window.addEventListener('load', async () => {
//     // Modern dapp browsers...
//     if (window.ethereum) {
//         window.web3 = new Web3(ethereum);
//         try {
//             // Request account access if needed
//             await ethereum.enable();
//             // Acccounts now exposed
//             App.showAddress();
//             App.subscribeEvents();
//             //web3.eth.sendTransaction({/* ... */});
//         } catch (error) {
//             // User denied account access...
//         }
//     }
//     // Legacy dapp browsers...
//     else if (window.web3) {
//         window.web3 = new Web3(web3.currentProvider);
//         // Acccounts always exposed
//         //web3.eth.sendTransaction({/* ... */});
//     }
//     // Non-dapp browsers...
//     else {
//         console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
//     }
// });