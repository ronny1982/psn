import fetch, { Request } from 'node-fetch';
//const Request = fetch.Request;

const api = 'https://us-prof.np.community.playstation.net/userProfile/v1/';

function create(init) {
    const id = {};
    const keys = [ 'entitlementId', 'avatarId' ];
    const type = keys.find(key => Object.keys(init).includes(key));
    id[type] = isNaN(init[type]) ? init[type] : parseInt(init[type]);
    return {
        id: id,
        url: init.avatarUrls.pop().avatarUrl
    }
}

export async function getFreeAvatars() {
    const avatars = [{
        id: { avatarId: 0 },
        url: 'http://static-resource.np.community.playstation.net/avatar/default/DefaultAvatar.png'
    }];
    const uri = new URL('avatars/categories/0', api);
    uri.searchParams.set('avatarSizes', 'l');
    uri.searchParams.set('limit', 48);
    for(let offset = 0, run = true; run; offset += 48) {
        uri.searchParams.set('offset', offset);
        const request = new Request(uri.href, {});
        const response = await fetch(request);
        const data = await response.json();
        const items = data.avatars.map(avatar => create(avatar));
        run = items.length > 0;
        avatars.push(...items);
    }
    return avatars;
}

export async function getPremiumAvatars(token) {
    const avatars = [];
    const uri = new URL('avatars/categories/100', api);
    uri.searchParams.set('avatarSizes', 'l');
    uri.searchParams.set('limit', 48);
    for(let offset = 0, run = true; run; offset += 48) {
        uri.searchParams.set('offset', offset);
        const request = new Request(uri.href, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const response = await fetch(request);
        const data = await response.json();
        if(data.error) {
            throw new Error(data.error.message);
        }
        const items = data.avatars.map(avatar => create(avatar));
        run = items.length > 0;
        avatars.push(...items);
    }
    return avatars;
}

export async function setAvatar(token, avatar) {
    /*
    const response = await fetch(url + '/v1/users/me/avatar', {
        method: 'PUT',
        body: `{"avatarId":0}`,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + token
        }
    });
    if(response.ok && response.status === 204) {
        console.log('Successfully reset avatar.');
    } else {
        console.warn('Failed to reset avatar!', response);
    }
    */
}