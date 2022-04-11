const { ModelManager } = require('@glazed/devtools');
const { CeramicClient } = require("@ceramicnetwork/http-client");
const { writeFile, mkdir, access } = require("fs").promises;
const path = require("path");
const { getCeramicNodeUrl, getAuthenticatedDid } = require('./utils');

//////////
//// MAIN
//////////
const main = async () => {
    // Create ceramic client and model manager
    console.log("[+] Setting up Ceramic client and Model Manager...")
    const did = await getAuthenticatedDid();
    const ceramic = new CeramicClient(getCeramicNodeUrl());
    ceramic.did = did;
    const manager = new ModelManager(ceramic);

    // Create schema for post
    console.log("[+] Creating Post schema...");
    const schemaId = await manager.createSchema("post", {
        $schema: "https://json-schema.org/draft/2020-12/schema",
        title: "Post",
        description: "This is a post made by a user using DID",
        type: "object",
        properties: {
            postTitle: {
                description: "Title of the post",
                type: "string"
            },
            postText: {
                description: "Body of the post",
                type: "string"
            }
        }
    });
    console.log(` > ${manager.getSchemaURL(schemaId)}`);

    // Deploy everything
    console.log("[+] Deploying...")
    const model = await manager.toPublished();

    // Output model
    const outputPath = path.join(__dirname, "dist");
    try {
        await access(outputPath);
    } catch {
        await mkdir(outputPath);
    } finally {
        await writeFile(path.join(outputPath, "model.json"), JSON.stringify(model));
        console.log("[+] Model saved in ./dist/model.json");
    }
}

////////////
// RUN MAIN
///////////
main()
    .then(() => { process.exit(0); })
    .catch((e) => { console.error(e); process.exit(1); })