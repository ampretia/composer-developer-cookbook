'use strict';

// const Table = require('cli-table');
// const prettyoutput = require('prettyoutput');
// const config = require('config').get('composer-sample-app');
const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
// const uuidV1 = require('uuid/v1');
// const BrowserFS = require('browserfs/dist/node/index');
const AdminConnection = require('composer-admin').AdminConnection;
const path = require('path');
// const faker = require('faker');
const chalk = require('chalk');

// Require the client API
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

// these are the credentials to use to connect to the Hyperledger Fabric
let participantId = 'admin';
let participantPwd = 'adminpw';

// physial connection details (eg port numbers) are held in a profile
let connectionProfile = 'hlfv1';;//config.get('connectionProfile');

// the logical business newtork has an indentifier
let businessNetworkIdentifier = 'dpn-scenario';//config.get('businessNetworkIdentifier');

// ... that allows us to get a connection to this business network
let businessNetworkConnection = new BusinessNetworkConnection();

// the network definition will be used later to create assets
let businessNetworkDefinition;

// asset registry and asset factory
let assetRegistry;
let factory;


// businessNetworkConnection.on('event', (evt) => {
//     console.log('Got an event back');
//     console.log(prettyoutput(serializer.toJSON(evt)));
// });

// Create the connection
businessNetworkConnection = new BusinessNetworkConnection();
console.log("Connecting via "+chalk.blue.bold(connectionProfile)+" to "+chalk.blue.bold(businessNetworkIdentifier)+" as "+chalk.blue.bold(participantId));
console.log("Creating Land Registry");
// and establish that connection)
businessNetworkConnection.connect(connectionProfile, businessNetworkIdentifier, participantId, participantPwd)
    .then((result) => {
        businessNetworkDefinition = result;
        factory = businessNetworkDefinition.getFactory();
        console.log('Connected: BusinessNetworkDefinition obtained=' + businessNetworkDefinition.getIdentifier());
        return;
    }).then((result) => {
        return businessNetworkConnection.getAssetRegistry('net.biz.digitalproperty.core.Organization');
    }).then((result) => {
        assetRegistry = result;

        let landRegistry = factory.newResource('net.biz.digitalproperty.core','Organization','EnglandLandRegistry');
        landRegistry.name = 'England Land Registry';
        landRegistry.type = 'LAND_REGISTRY';

        return assetRegistry.add(landRegistry);
    }).then((result) => {
      let agent = factory.newResource('net.biz.digitalproperty.core','Organization','SellCheap');
      agent.name = 'Sell Cheap Estate Agents';
      agent.type = 'ESTATE_AGENT';

      return assetRegistry.add(agent);
    }).then((result) => {
      let agent = factory.newResource('net.biz.digitalproperty.core','Organization','QuickSale');
      agent.name = 'Quick Sale Estate Agents';
      agent.type = 'ESTATE_AGENT';

      return assetRegistry.add(agent);
    }).then((result) => {
      let dev = factory.newResource('net.biz.digitalproperty.core','Organization','BlockLink');
      dev.name = 'BlockLink Construction';
      dev.type = 'DEVELOPER';

      return assetRegistry.add(dev);
    }).then((result) => {
      let dev = factory.newResource('net.biz.digitalproperty.core','Organization','CongaBuild');
      dev.name = 'Conage Building';
      dev.type = 'DEVELOPER';

      return assetRegistry.add(dev);
    }).then((result) => {
        return businessNetworkConnection.disconnect();
    }).then(() => {
        console.log('All done');
        process.exit();
    })
    // and catch any exceptions that are triggered
    .catch(function (error) {
        console.log(error);
        console.log(error.stack);
        businessNetworkConnection.disconnect();
        throw error;
    });
