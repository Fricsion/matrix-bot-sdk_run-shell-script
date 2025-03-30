import {
    MatrixAuth,
    MatrixClient,
    SimpleFsStorageProvider,
    AutojoinRoomsMixin,
    RustSdkCryptoStorageProvider,
} from "matrix-bot-sdk";
const { spawn } = require('node:child_process');
const fs = require('fs');

const homeserverUrl = process.env.HOMESERVER_URL;
const accessTokenFile = 'storage/access_token.txt';

async function initRegistration() {
    const auth = new MatrixAuth(homeserverUrl);

    try {
        const client = await auth.passwordRegister(process.env.BOT_USERNAME, process.env.BOT_PASSWORD);
        console.log("new user registered!: ", client.accessToken);
        return client.accessToken;
    } catch(err) {
        console.error("i think the account registration failed or account already exists", err);
    }
}

async function initAccessToken() {

	const auth = new MatrixAuth(homeserverUrl);
	try {
        const client = await auth.passwordLogin(process.env.BOT_USERNAME, process.env.BOT_PASSWORD);
        return client.accessToken;
	} catch(err) {
        console.error("login seems to have failed: ", err);
        return await initRegistration();
	}
}

(async () => {
    let accessToken;
    // まずはログインを試す
    try {
        accessToken = await initAccessToken();
        if (!accessToken) return;
        console.log(`logged in with: ${accessToken}`);
    } catch(err) {
        console.error("error retrieving accesstoken: ", err);
    }
    
    const storage = new SimpleFsStorageProvider("storage/bot01-storage.json");
    const cryptoProvider = new RustSdkCryptoStorageProvider("storage/bot01-crypto-storage");

    const client = new MatrixClient(homeserverUrl, accessToken, storage, cryptoProvider);
    AutojoinRoomsMixin.setupOnClient(client);

    // Auto join
    client.on("room.invite", (roomId: string, inviteEvent: any) => {
        console.log('inviteEvent', inviteEvent);
        client.joinRoom(roomId);
    });

    // Before we start the bot, register our command handler
    client.on("room.message", handleCommand);

    client.on("room.encrypted_event", handleCommand);

    client.on("room.decrypted_event", handleCommand);

    client.on("room.failed_decryption", (roomId: string, event: any, err: Error) => {
        console.error("decryption failed", err);
    });

    // Now that everything is set up, start the bot. This will start the sync loop and run until killed.
    client.start().then(() => console.log("Bot started!"));

    async function handleCommand(roomId: string, event: any) {
        // Don't handle unhelpful events (ones that aren't text messages, are redacted, or sent by us)
        if (event['content']?.['msgtype'] !== 'm.text') return;
        if (event['sender'] === await client.getUserId()) return;

        const body = event['content']['body'];

        if (!body?.startsWith("!hello")) return;


        const yourscript_output = spawn('./yourscript.sh');
        const log = spawn('echo', [`${yourscript_output}`, ' >> /srv/logs']);
        await client.replyNotice(roomId, event, `downloading: ${yourscript_output}`);
    }
})();
