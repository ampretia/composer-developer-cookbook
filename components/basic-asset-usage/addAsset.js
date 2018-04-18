'use strict';

const getArguments = require('./_util/cli.js')


const prettyoutput = require('prettyoutput');
const path = require('path');
const faker = require('faker');
const chalk = require('chalk');

// Require the client API
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
const AdminConnection = require('composer-admin').AdminConnection;

let args = getArguments();

// these are the credentials to use to connect to the Hyperledger Fabric
let participantId = args.i;
let participantPwd = args.s;

// physial connection details (eg port numbers) are held in a profile
let connectionProfile = args.p;

// the logical business newtork has an indentifier
let businessNetworkIdentifier = args.n;

// ... that allows us to get a connection to this business network
let businessNetworkConnection = new BusinessNetworkConnection();

// the network definition will be used later to create assets
let businessNetworkDefinition;

// asset registry and asset factory
let assetRegistry;
let factory;

// rather than use console.log use more like a debug fn call
function _info(string) {
    console.log(string);
}
let LOG = { info: _info, log: _info };

// Create the connection
businessNetworkConnection = new BusinessNetworkConnection();
LOG.log("Connecting via " + chalk.blue.bold(connectionProfile) + " to " + chalk.blue.bold(businessNetworkIdentifier) + " as " + chalk.blue.bold(participantId));

// and establish that connection)
businessNetworkConnection.connect(connectionProfile, businessNetworkIdentifier, participantId, participantPwd)
    .then((result) => {
        businessNetworkDefinition = result;
        factory = businessNetworkDefinition.getFactory();
        LOG.log('Connected: BusinessNetworkDefinition obtained=' + businessNetworkDefinition.getIdentifier());
        return;
    }).then((result) => {
        return businessNetworkConnection.getAssetRegistry('org.acme.sample.SampleAsset');
    }).then((result) => {
        assetRegistry = result;

        let people = ['Alice', 'Bob', 'Charlie'];
        let assets = [];

        people.forEach((name) => {
            for (let i = 1; i < 2; i++) {
                let id = name + ':' + faker.random.number(100000);
                let asset = factory.newResource('org.acme.sample', 'SampleAsset', id);
                asset.value = i + ' Conga Coin';
                assets.push(asset);
            }
        });

        return assetRegistry.addAll(assets);
    })

    .then((result) => {
        LOG.log('disconnecting....');
        return businessNetworkConnection.disconnect();
    }).then(() => {
        LOG.log('connecting again...');
        return businessNetworkConnection.connect(connectionProfile, businessNetworkIdentifier, participantId, participantPwd);
    }).then( ()=>{
        LOG.log('getting asset registry');
        return businessNetworkConnection.getAssetRegistry('org.acme.sample.SampleAsset');
    }).then(()=>{
        console.log('All done');
        process.exit();
    })
    // and catch any exceptions that are triggered
    .catch(function (error) {
        console.log(error);
        console.log(error.stack);
        return error;
    });

