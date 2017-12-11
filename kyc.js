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
let registries={};
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
        return businessNetworkConnection.getAllAssetRegistries();
    }).then((result) => {
        result.forEach((ar)=>{
            registries[ar.id]=ar;
        });
        return businessNetworkConnection.getAllParticipantRegistries();
    }).then((result) => {
            result.forEach((r)=>{
                registries[r.id]=r;
            });

    
        // create same data
        let v1 = factory.newResource('org.acme.model','Verifier','v001',{generate:true});
        let p1 = factory.newResource('org.acme.model','Person','p001',{generate:true});
        p1.firstname ='Fred';
        p1.surname='Bloggs';
        let creationPromises = [];
       
        creationPromises.push(registries['org.acme.model.Verifier'].add(v1));
        creationPromises.push(registries['org.acme.model.Person'].add(p1));

        console.log('Done all the adding promise creation');
        return Promise.all(creationPromises);

    }).then(()=>{
        let tx1 = factory.newTransaction('org.acme.model','IdentifyPerson');
        tx1.personIdentified = factory.newRelationship('org.acme.model','Person','p001');
        tx1.verifyingCompany = factory.newRelationship('org.acme.model','Verifier','v002');

        LOG.log('Submitting transaction to validate');
        return businessNetworkConnection.submitTransaction(tx1);
    }).then(()=>{
        return registries['org.acme.model.Person'].get('p001');
    })
    .then((result) => {
        let json = result;// businessNetworkDefinition.getSerializer().toJSON(result);
        console.log('Person has been updated to ',prettyoutput(json));
        LOG.log('disconnecting....');
        return businessNetworkConnection.disconnect();
    }).then(() => {
     
    }).then( ()=>{
     
    }).then(()=>{
  
    }).then(()=>{
        console.log('All done');
    })
    // and catch any exceptions that are triggered
    .catch( (error) => {
        
        console.log(error);
        console.log(error.stack);
        
        throw error;
    }).then(()=>{
        businessNetworkConnection.disconnect();
    });

