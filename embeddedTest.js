
const Table = require('cli-table');
const path = require("path");
const chalk = require("chalk");

// Require the client API
const BusinessNetworkConnection = require("composer-client").BusinessNetworkConnection;
const BusinessNetworkDefinition = require("composer-common").BusinessNetworkDefinition;
const AdminConnection = require("composer-admin").AdminConnection;
const IdCard = require('composer-common').IdCard;
const MemoryCardStore = require('composer-common').MemoryCardStore;
const store = new MemoryCardStore();

// the logical business newtork has an indentifier
let businessNetworkIdentifier = "recursive-asset";
let businessNetworkConnection;
let businessNetworkDefinition;
let bnDirectory = './_networks/recursive-asset'

// rather than use console.log use more like a debug fn call
const LOG = {
  info: (string) => {
    console.log(string);
  }
};

// Create the Admin and Business Network Connecton backed by the in memory Network Card Store
const adminConnection = new AdminConnection({ cardStore: store });
businessNetworkConnection = new BusinessNetworkConnection({ cardStore: store });

let deployCardName = 'deployer-card';
let userCardName = 'user-card';

async function createImportCards() {
  // Dynamically create two IdCards for the 
  let idCard_PeerAdmin = new IdCard({ userName: 'PeerAdmin' }, { type: "embedded", name: "profilename" });
  idCard_PeerAdmin.setCredentials({ certificate: 'cert', privateKey: 'key' })

  let idCard_Admin = new IdCard({ userName: 'Admin', businessNetwork: businessNetworkIdentifier }, { type: "embedded", name: "profilename" });
  idCard_Admin.setCredentials({ certificate: 'cert', privateKey: 'key' })

  await adminConnection.importCard('deployer-card', idCard_PeerAdmin)
  await adminConnection.importCard('user-card', idCard_Admin)

}

// -----------------------------------------------------------------------------
// main code starts here
(async () => {

  // create and import the id cards needed
  await createImportCards();

  // connect and deploy the business network
  LOG.info('> Deploying Business Network');
  await adminConnection.connect(deployCardName);
  businessNetworkDefinition = await BusinessNetworkDefinition.fromDirectory( path.resolve(bnDirectory) );
  await adminConnection.deploy(businessNetworkDefinition);
  

  LOG.info('> Deployed network - now connecting business network connection'  + businessNetworkDefinition.getIdentifier());
  await businessNetworkConnection.connect(userCardName);
  LOG.info("> Connected: BusinessNetworkDefinition obtained=" + businessNetworkDefinition.getIdentifier());

  result = await businessNetworkConnection.getAllAssetRegistries(true);
  LOG.info("> List of asset registries (including system)");
  let tableAssets = new Table({
    head: ["Registry Type", "ID", "Name"]
  });
  for (let i = 0; i < result.length; i++) {
    let tableLine = [];

    tableLine.push(result[i].registryType);
    tableLine.push(result[i].id);
    tableLine.push(result[i].name);
    tableAssets.push(tableLine);
  }

  LOG.info(tableAssets.toString());

  result = await businessNetworkConnection.getAllParticipantRegistries(true);
  LOG.info("> List of participant registries (including system)");
  let tableParticipants = new Table({
    head: ["Registry Type", "ID", "Name"]
  });
  
  for (let i = 0; i < result.length; i++) {
    let tableLine = [];

    tableLine.push(result[i].registryType);
    tableLine.push(result[i].id);
    tableLine.push(result[i].name);
    tableParticipants.push(tableLine);
  }
  LOG.info(tableParticipants.toString());

  await businessNetworkConnection.disconnect();

})();