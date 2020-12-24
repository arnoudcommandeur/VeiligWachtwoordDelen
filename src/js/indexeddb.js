function initDB() {
  let openRequest = indexedDB.open("infent")
  openRequest.onupgradeneeded = () => {
    console.log("DB update needed")
    openRequest.result.createObjectStore("keys")
  }
  openRequest.onsuccess = () => {
    console.log("DB opened")
    let store = openRequest.result.transaction("keys", "readwrite").objectStore("keys")

   // store.put({id: 'AC', data: {name: {first: "John", last: "Doe"}, age: 42}}); -- Maybe better than store.add?
    store.add({naam: 'Arnoud Commandeur', voornaam: 'Arnoud', email: 'a.commandeur@infent.nl', publickey: '1234567890'}, 'AC')
    store.add({naam: 'Bert de Grote', voornaam: 'Bert', email: 'b.degrote@infent.nl', publickey: '3456453323'}, 'BdG')
    store.add({naam: 'Karel de Kleine', voornaam: 'Karel', email: 'k.dekleine@infent.nl', publickey: '3244556677'}, 'KdK')

  }
}

async function loadJSON(fname) {
  var response = await fetch(fname)
  var str = await response.text()
  var data = JSON.parse(str)
  var idb = await importIDB("infent", "keys", data["medewerkers"])
  await displayIDB(idb, "keys", "medewerkers")
}

function importIDB(dname /* 'infent' */, sname /* 'keys' */, arr /* data["medewerkers"] */) {
  return new Promise(function(resolve) {
    var r = window.indexedDB.open(dname)
    r.onupgradeneeded = function() {
      var idb = r.result
      var store = idb.createObjectStore(sname, {keyPath: "key"})
    }
    r.onsuccess = function() {
      var idb = r.result
        let tactn = idb.transaction(sname, "readwrite")
    	  var store = tactn.objectStore(sname)
        for(var obj of arr) {
          store.put(obj)
        }
        resolve(idb)
    }
    r.onerror = function (e) {
     alert("Enable to access IndexedDB, " + e.target.errorCode)
    }    
  })
}

function displayIDB(idb, sname, id) {
  let storage = document.getElementById(id)
  let tactn = idb.transaction(sname, "readonly")
  let osc = tactn.objectStore(sname).openCursor()
  osc.onsuccess = function(e) {
    let cursor = e.target.result
    if (cursor) {
      storage.innerHTML += "Naam " + cursor.value["volledigeNaam"] + " : voornaam: " + cursor.value["voornaam"] + ", emailadres " + cursor.value["emailAdres"] + ", publicKey " + cursor.value["publicKey"] + "<br>"
      cursor.continue()
    }
  } 
  tactn.oncomplete = function() {
    idb.close();
  }
}

// async function getIDB(dname, sname, key) {
//   return new Promise(function(resolve) {
//     var r = indexedDB.open(dname)
//       r.onsuccess = function(e) {
//         var idb = r.result
//         let tactn = idb.transaction(sname, "readonly")
//         let store = tactn.objectStore(sname)
//         let data = store.get(key)
//         data.onsuccess = function() {
//           resolve(data.result)
//         }
//         tactn.oncomplete = function() {
//           idb.close()
//         }
//      }
//   })
// }

// async function search() {
//   var key = document.getElementById("searchval").value
//   var infos = await getIDB("fruits", "fstore", key)
//   document.getElementById("storage").innerHTML = JSON.stringify(infos, null, ' ')
// }



//function checkUid() {
//   let openRequest = indexedDB.open("example")
//   openRequest.onupgradeneeded = () => {
//     console.log("update needed")
//     openRequest.result.createObjectStore("users")
//   }
//   openRequest.onsuccess = () => {
//     console.log("opened database")
//     let store = openRequest.result.transaction("users", "readwrite").objectStore("users")
//     let uid = "x123"
//     let getRequest = store.get(uid)
//     getRequest.onsuccess = () => {
//       let result = getRequest.result
//       if (result) {
//         console.log("found:", result)
//       } else {
//         console.log("not found")
//         store.add("aaaaa", uid)
//       }
//     }
//   }
// }