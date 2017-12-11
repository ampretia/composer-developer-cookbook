const util = require('util');
const Table = require('cli-table');
const path = require("path");
const chalk = require("chalk");
const fs = require("fs");


const config = require('config').get('fabric-admin');
// these are the credentials to use to connect to the Hyperledger Fabric
let connectionProfileFile = config.get('connectionProfile').file;
let peerAdminCert = config.get('peerAdmin.cert');
let peerAdminKey = config.get('peerAdmin.key');

// load the profile
let cp = JSON.parse(fs.readFileSync(path.resolve(connectionProfileFile)));
let cert = fs.readFileSync(peerAdminCert,'utf8');
let key = fs.readFileSync(peerAdminKey,'utf8');


// Require the client API
const BusinessNetworkConnection = require("composer-client").BusinessNetworkConnection;
const BusinessNetworkDefinition = require("composer-common").BusinessNetworkDefinition;
const AdminConnection = require("composer-admin").AdminConnection;
const IdCard = require('composer-common').IdCard;
const MemoryCardStore = require('composer-common').MemoryCardStore;


// the logical business newtork has an indentifier
let businessNetworkName;
let businessNetworkConnection;
let businessNetworkDefinition;
let bnDirectory = '../../_networks/basic-sample-network'
let installed = false;

// rather than use console.log use more like a debug fn call
const LOG = {
  info: (string) => {
    console.log(string);
  }
};

// Create the Admin and Business Network Connecton backed by the in memory Network Card Store
const deployCardName = 'deployer-card';
const userCardName = 'user-card';
let registries = {};

async function installAndStart(adminConnection){
    // create and import the id cards needed
    let metadata = { version:1 };
    metadata.userName = 'PeerAdmin';
    metadata.roles = 'PeerAdmin'
  
    let idCard_PeerAdmin = new IdCard(metadata, cp);
    idCard_PeerAdmin.setCredentials({ certificate: cert, privateKey: key })
    await adminConnection.importCard(deployCardName, idCard_PeerAdmin)
    
    // connect and deploy the business network
    LOG.info('> Deploying Business Network');
    await adminConnection.connect(deployCardName);
    businessNetworkDefinition = await BusinessNetworkDefinition.fromDirectory(path.resolve(bnDirectory));
    businessNetworkName = businessNetworkDefinition.getName();
    // install the Composer runtime
    LOG.info("> Install Composer runtime...");
    await adminConnection.install(businessNetworkName);
    

    // then start it
    LOG.info("> Starting Business Network on the installed Composer runtime...");
    let cards = await adminConnection.start(businessNetworkDefinition, { networkAdmins: [ {userName : 'admin', enrollmentSecret:'adminpw'} ] });  
    LOG.info('> Deployed network - now connecting business network connection' + businessNetworkDefinition.getIdentifier());
    
    await adminConnection.importCard(userCardName,   cards.get('admin') );    
  }

// start, do stuff, stop
async function listRegistries(adminConnection,businessNetworkConnection) {

  // can now be used for 'business operations'
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
 
  businessNetworkConnection.disconnect();
}

async function addNewParticipant(adminConnection,businessNetworkConnection){



  // can now be used for 'business operations'
  await businessNetworkConnection.connect(userCardName);
  await adminConnection.connect(userCardName);

  registries['org.acme.sample.SampleParticipant'] = await businessNetworkConnection.getParticipantRegistry('org.acme.sample.SampleParticipant');
  
  let bob = factory.newResource('org.acme.sample', 'SampleParticipant', 'bob');
  bob.firstName = 'bob';
  bob.lastName = 'bobbington';
  await registires['org.acme.sample.SampleParticipant'].add(bob);
 

  let identityDetails = await businessNetworkConnection.issueIdentity('org.acme.sample.SampleParticipant#bob', 'newUser1');
  let metadata= {
    userName : identityDetails.userID,
    version : 1,
    enrollmentSecret: identityDetails.userSecret,
    businessNetwork : businessNetworkName
  };

  let newUserCard = new IdCard(metadata,cp);
  await adminConnection.importCard('newUserCard',newUserCard);

  LOG.info('> AdminConnection disconnect');
  await adminConnection.disconnect();
  await businessNetworkConnection.disconnect();
}

async function addNewAsset(businessNetworkConnection){

  // swap to be being bob
  await businessNetworkConnection.connect('newUserCard');

  let newAsset = factory.newAsset('org.acme.sample','SampleAsset','1148');
  await regisitries['org.acme.sample'].add(newAsset);

  result = await regisitries['org.acme.sample'].getAll();
  LOG.info("> All assets");
  LOG.info(result);

 
  LOG.info('> BusinessNetworkConnection disconnect');
  await businessNetworkConnection.disconnect();

  LOG.info('> done');
} 


// -----------------------------------------------------------------------------

// main code starts here
(
  async () => {
    try {
      let store = new MemoryCardStore();

      LOG.info('> Creating AdminConnection');
      let adminConnection = new AdminConnection({ cardStore: store });
      let adminCard = await installAndStart(adminConnection);
      
      
      LOG.info('> Creating business network connection');
      let businessNetworkConnection = new BusinessNetworkConnection({ cardStore: store});    

      LOG.info('> Adding a new participant')
      await addNewParticipant(adminConnection,businessNetworkConnection);

      LOG.info('> Adding a new assest as that participant')
      await addNewAsset(businessNetworkConnection);

    } catch (error) {
      console.log('\n==================================')
      console.log(error);
      console.log('----------------------------------');
      process.exit(1);
    }

  }
)();