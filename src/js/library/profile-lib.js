function initStore() {
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

async function saveProfile(_profileStore, _index, _secretKey, _publicKey, _name, _emailAddress) {

    value = await idbKeyval.set(0, {secretKey: _secretKey, publicKey: _publicKey, name: _name, emailAddress: _emailAddress}, _profileStore);

    if (value === undefined) {
        return false;
    }
    else {
        return value;
    }
};
