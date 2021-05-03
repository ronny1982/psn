import fs from 'fs-extra';
import { getFreeAvatars } from '../lib/avatar.js';

const avatarDB = './docs/avatars.json';
const categoryTitle = 'FREE';
const categoryID = 'free';

function ensureCategory(db) {
    let category = db.find(category => category.id === categoryID);
    if(!category) {
        category = {
            id: categoryID,
            title: categoryTitle,
            avatars: []
        };
        db.unshift(category);
    }
    return category;
}

(async function() {
    let avatars = await getFreeAvatars();
    const db = await fs.readJSON(avatarDB);
    const category = ensureCategory(db);
    // find only avatars that are not already in database?
    //avatars.filter(avatar => avatar);
    // download avatar locally?
    const promises = avatars.map(avatar => {
        //const file = avatar.url.split('/').pop();
        //const request = new Request(avatar.url);
        return Promise.resolve(avatar);
    });
    category.avatars = await Promise.all(promises);
    fs.writeJSON(avatarDB, db, { spaces: 2 });
})();