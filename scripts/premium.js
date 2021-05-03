import fs from 'fs-extra';
import yargs from 'yargs';
import { login } from '../lib/auth.js';
import { getPremiumAvatars } from '../lib/avatar.js';

const avatarDB = './docs/avatars.json';

const argv = yargs(process.argv)
    .option('u', {
        alias : 'user',
        describe: 'Username of the PSN account from which premium avatars are scanned and then added into the local database',
        type: 'string',
        nargs: 1,
        demand: true
    })
    .option('p', {
        alias : 'pass',
        describe: 'Password for the PSN account from which premium avatars are scanned and then added into the local database',
        type: 'string',
        nargs: 1,
        demand: true
    })
    .argv;

function getProductID(avatar) {
    // EP0082/CUSA18742
    return avatar.url.match(/CUSA\d+/)[0];
}

async function getProductTitle(productID) {
    // TODO: use service to get title from CUSA ...
    return productID === 'CUSA18742' ? 'NieR Replicant ver.1.22474487139' : productID;
}

async function ensureCategory(db, productID) {
    let category = db.find(category => category.id === productID);
    if(!category) {
        category = {
            id: productID,
            title: await getProductTitle(productID),
            avatars: []
        };
        db.push(category);
    }
    return category;
}

(async function() {
    const token = await login(argv.user, argv.pass);
    const avatars = await getPremiumAvatars(token);
    const db = await fs.readJSON(avatarDB);
    for(const avatar of avatars) {
        const category = await ensureCategory(db, getProductID(avatar));
        const avatarID = JSON.stringify(avatar.id);
        if(!category.avatars.some(a => JSON.stringify(a.id) === avatarID)) {
            // download avatar locally?
            category.avatars.push(avatar);
        }
        // sort by id?
    }
    fs.writeJSON(avatarDB, db, { spaces: 2 });
})();