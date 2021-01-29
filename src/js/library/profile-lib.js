function initStore() {
    value = new idbKeyval.Store('VeiligWachtwoordSturen', 'Profile');
    return value;
}

function initAddressbook() {
//    value = new idbKeyval.Store('VeiligWachtwoordSturenAddressbook', 'Addressbook');
    value = new idbKeyval.Store('VeiligWachtwoordSturen', 'Profile');
    return value;
}

async function checkProfile (_profileStore) {

    value = await idbKeyval.get(0, _profileStore);

    if (value === undefined) {
        return false;
    }
    else {
        return true;
    }
};

async function getProfile(_profileStore) {

    if (checkProfile(_profileStore)) {
        value = await idbKeyval.get(0, _profileStore);

        if (value === undefined) {
            return false;
        }
        else {
            return value;
        }
    } else {
        return null;
    }
};

async function saveProfile(_profileStore, _index, _secretKey, _publicKey, _name, _emailAddress, _company) {

    value = await idbKeyval.set(0, {secretKey: _secretKey, publicKey: _publicKey, name: _name, emailAddress: _emailAddress, company: _company}, _profileStore);

    if (value === undefined) {
        return false;
    }
    else {
        return value;
    }
};

async function resetProfile(_profileStore) {

    await idbKeyval.clear(_profileStore);

};

async function addAddressbookItem(_addressbookStore, _index, _publicKey, _name, _emailAddress, _company) {

    value = await idbKeyval.set(_index, {publicKey: _publicKey, name: _name, emailAddress: _emailAddress, company: _company}, _addressbookStore);

    if (value === undefined) {
        return false;
    }
    else {
        return value;
    }
};

async function deleteAddressbookItem(_addressbookStore, _index) {

    value = await idbKeyval.del(_index, _addressbookStore);

    if (value === undefined) {
        return false;
    }
    else {
        return value;
    }
};
