
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
let bnDirectory = '../../_networks/basic-sample-network'

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

// -----------------------------------------------------------------------------
// main code starts here
(async () => {

  // Dynamically create two IdCards for the 
  let idCard_PeerAdmin = new IdCard({ userName: 'PeerAdmin' }, { type: "embedded", name: "profilename" });
  idCard_PeerAdmin.setCredentials({ certificate: 'cert', privateKey: 'key' })
  await adminConnection.importCard('deployer-card', idCard_PeerAdmin)

  // Load the Business network from disk
  businessNetworkDefinition = await BusinessNetworkDefinition.fromDirectory( path.resolve(bnDirectory) );

  // connect and deploy the business network
  LOG.info('> Installing the Composer Runtime');
  await adminConnection.connect(deployCardName);
  await adminConnection.install(businessNetworkDefinition.getName());

  // Start the business network on the installed runtime
  LOG.info("> Starting Business Network on the installed Composer runtime...");
  let cards = await adminConnection.start(businessNetworkDefinition, { networkAdmins: [ {userName : 'admin', enrollmentSecret:'adminpw'} ] });  
  let card = cards.get('admin') 
  await adminConnection.importCard(userCardName,card);

  // don't need the adminConnection now so disconnect
  await adminConnection.disconnect();

  LOG.info('> Deployed network - now Connecting business network connection');
  await businessNetworkConnection.connect(userCardName);


  // do code here............



  await businessNetworkConnection.disconnect();

})();