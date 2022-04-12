require("dotenv").config({ path: "./.env" });
const { DID } = require('dids');
const { Ed25519Provider } = require('key-did-provider-ed25519');
const { getResolver } = require('key-did-resolver');
const { fromString } = require('uint8arrays');

const getCeramicNodeUrl = () => (process.env.NODE_ENV === "development" ? "https://ceramic-clay.3boxlabs.com" : "https://gateway.ceramic.network");

const getAuthenticatedDid = async () => {
    // DID_KEY is created with `glaze did:create`.
    const key = fromString(process.env.DID_KEY, 'base16');
    // Create and authenticate the DID
    const did = new DID({
        provider: new Ed25519Provider(key),
        resolver: getResolver(),
    });
    await did.authenticate();
    return did;
}

module.exports = {
    getCeramicNodeUrl,
    getAuthenticatedDid
}