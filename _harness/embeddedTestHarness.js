"use strict";


const BusinessNetworkDefinition = require("composer-common")
  .BusinessNetworkDefinition;

const BrowserFS = require("browserfs/dist/node/index");
const bfs_fs = BrowserFS.BFSRequire("fs");
const AdminConnection = require("composer-admin").AdminConnection;
const path = require("path");
const chalk = require("chalk");
const uuidv4 = require('uuid/v4');
// Require the client API
const BusinessNetworkConnection = require("composer-client")
  .BusinessNetworkConnection;

// these are the credentials to use to connect to the Hyperledger Fabric
let participantId = "admin";
let participantPwd = "adminpw";

// physial connection details (eg port numbers) are held in a profile
let connectionProfile = "hlfv1"; //config.get('connectionProfile');

// the logical business newtork has an indentifier
let businessNetworkIdentifier = "block-game"; //config.get('businessNetworkIdentifier');

// ... which allows us to get a connection to this business network
let businessNetworkConnection = new BusinessNetworkConnection();

// the network definition will be used later to create assets
let businessNetworkDefinition;

// asset registry and asset factory
let assetRegistry;
let factory;
let serializer;

// rather than use console.log use more like a debug fn call
function _info(string){
    console.log(string);
}
let LOG = {info :_info };

BrowserFS.initialize(new BrowserFS.FileSystem.InMemory());
const adminConnection = new AdminConnection({ fs: bfs_fs });


// Hold a simple map of the regsitry objects
let registries = {};
let eventsFired = [];

class EmbeddedWrapper {

  constructor(bnDirectory,bnName){
    this.bnDirectory=bnDirectory;
    this.bnName=bnName;
  }

  setup(){
    // create a new profile - to use embedded connector
    adminConnection
    .createProfile("profile", {
      type: "embedded"
    })
    .then(() => {
      return adminConnection.connect("profile", "admin", "Xurw3yU9zI0l");
    })
    .then(() => {
      return BusinessNetworkDefinition.fromDirectory(
        path.resolve(this.bnDirectory)
      );
    })
    .then(result => {
      businessNetworkDefinition = result;
      return adminConnection.deploy(businessNetworkDefinition);
    })
    .then(() => {
      LOG.info('> Deployed network - creating bnc');
      businessNetworkConnection = new BusinessNetworkConnection({ fs: bfs_fs });
      factory = businessNetworkDefinition.getFactory();
      // create the connection
      return businessNetworkConnection.connect(
        "profile",
        this.bnName,
        "admin",
        "Xurw3yU9zI0l"
      );
    })
    .then(result => {      
          businessNetworkDefinition = result;
          LOG.info(
            "> Connected: BusinessNetworkDefinition obtained=" +
              businessNetworkDefinition.getIdentifier()
          );
          return businessNetworkConnection.getAllAssetRegistries(true);
        })
        .then(result => {
          LOG.info("> List of asset registries (including system)");
      
          let table = new Table({
            head: ["Registry Type", "ID", "Name"]
          });
          for (let i = 0; i < result.length; i++) {
            let tableLine = [];
      
            tableLine.push(result[i].registryType);
            tableLine.push(result[i].id);
            tableLine.push(result[i].name);
            table.push(tableLine);
          }
      
          LOG.info(table.toString());
          return;
        })

        .then( ()=>{
          return businessNetworkConnection.getAllParticipantRegistries(true);
        })
        .then(result => {
          LOG.info("> List of participant registries (including system)");
        
          let table = new Table({
            head: ["Registry Type", "ID", "Name"]
          });
          for (let i = 0; i < result.length; i++) {
            let tableLine = [];
        
            tableLine.push(result[i].registryType);
            tableLine.push(result[i].id);
            tableLine.push(result[i].name);
            table.push(tableLine);
          }
        
          LOG.info(table.toString());
          re


  }

}





module.exports = Engine;