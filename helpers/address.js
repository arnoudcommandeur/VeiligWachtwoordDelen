Store = new idbKeyval.Store('VeiligWachtwoordSturen', 'Profile');
    
v2 = await idbKeyval.keys(Store).then((keys) => console.log(keys));

await idbKeyval.get(1, Store).then((val) => console.log(val));
console.log('eerste?')

