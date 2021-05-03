import fetch, { Request } from 'node-fetch';

export async function login(user, pass) {
    // token can be extracted manually by
    // 1. Navugate to https://id.sonyentertainmentnetwork.com/id/management_ca/
    // 2. Login with account that possesses premium avatars
    // 3. Open developer console network tab
    // 4. Profile > Avatar > Change > Premium-Avatars
    // 5. Search for authorization header in request /userProfile/v1/avatars/categories/100
    const token = '...';
    return token;
}