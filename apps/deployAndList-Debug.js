"use strict";



const Table = require("cli-table");
const prettyoutput = require("prettyoutput");

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

// utility function for displaying assets
function c(colour) {
  if (colour === "YELLOW") {
    return chalk.yellow("Yellow");
  } else if (colour === "RED") {
    return chalk.red("Red");
  } else if (colour === "GREEN") {
    return chalk.green("Green");
  } else if (colour === "BLUE") {
    return chalk.blue("Blue");
  } else {
    return chalk.bgMagenta("errr");
  }
}

function submitTx() {
  let tx = factory.newTransaction("org.example.game.core", "createNewSet");
  tx.tiles = [];
  tx.moveId = uuidv4();

  people.forEach(name => {
    for (let i = 1; i < 4; i++) {
      let id = name + ":" + i;
      tx.tiles.push(
        factory.newRelationship("org.example.game.core", "Tile", id)
      );
    }
  });

  return businessNetworkConnection.submitTransaction(tx);
}


// rather than use console.log use more like a debug fn call
function _info(string){
    console.log(string);
}
let LOG = {info :_info };

let people = ["RED", "BLUE", "YELLOW", "GREEN"];

BrowserFS.initialize(new BrowserFS.FileSystem.InMemory());
const adminConnection = new AdminConnection({ fs: bfs_fs });

// Hold a simple map of the regsitry objects
let registries = {};
let eventsFired = [];

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
      path.resolve(__dirname, "..", "block-game-network")
    );
  })
  .then(result => {
    businessNetworkDefinition = result;
    return adminConnection.deploy(businessNetworkDefinition);
  })
  .then(result => {
    return adminConnection.update(businessNetworkDefinition);
  })
  .then(() => {
    LOG.info('> Deployed network - creating bnc');
    businessNetworkConnection = new BusinessNetworkConnection({ fs: bfs_fs });
    factory = businessNetworkDefinition.getFactory();
    // create the connection
    return businessNetworkConnection.connect(
      "profile",
      "block-game",
      "admin",
      "Xurw3yU9zI0l"
    );
  })
  .then(result => {

    // setup event handling
    businessNetworkConnection.on('event', (evt) => {
      eventsFired.push(evt);
      console.log('==>Got an event back');
      console.log(prettyoutput(businessNetworkDefinition.getSerializer().toJSON(evt)));
      });


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
  return;
})


  .then(result => {
    return businessNetworkConnection.getParticipantRegistry(
      "org.example.game.core.Player"
    );
  })
  .then(result => {
    registries["org.example.game.core.Player"] = result;
    let resource = factory.newResource(
      "org.example.game.core",
      "Player",
      "Chloe"
    );
    LOG.info("Created org.example.game.core.Player#Chloe - which needs to be stored in the Participant:org.example.game.core.Player registry");
    resource.displayName='chl0e';
    return registries["org.example.game.core.Player"].add(resource);
  })
  .then(() => {
    return registries["org.example.game.core.Player"].getAll();
  })
  .then(result => {
    LOG.info(">--------------All players--------------------");
    LOG.info(result);
    LOG.info(">---------------------------------------------");
    return businessNetworkConnection.getAssetRegistry(
      "org.example.game.core.Tile"
    );
  })
  .then(result => {
    registries["org.example.game.core.Tile"] = result;

    let tiles = [];

    people.forEach(name => {
      for (let i = 1; i < 14; i++) {
        let id = name + ":" + i;
        let tile = factory.newResource("org.example.game.core", "Tile", id);
        tile.colour = name;
        tile.value = i;
        tiles.push(tile);
       
      }
    });

    return registries["org.example.game.core.Tile"].addAll(tiles);
  })

  //-----------------------------
  .then(() => {
        // submit lots of transactions here
        let txs = [];
        for (let i=0; i<10;i++){
          txs.push(submitTx());
        }
        return Promise.all(txs);
      })
  //-----------------------------
  .then(result => {
    return businessNetworkConnection.getTransactionRegistry("org.example.game.core.createNewSet");
  })
  .then(result => {
    registries["org.example.game.core.createNewSet"] = result;

    return result.getAll();
  })
  .then(result => {
    console.log("List of tiles");

    let table = new Table({
      head: ["txid", "type"]
    });
    for (let i = 0; i < result.length; i++) {
      // console.log(result[i]);
      let tableLine = [];

      tableLine.push(result[i].getIdentifier());
      tableLine.push(result[i].getFullyQualifiedType());
      // tableLine.push(result[i].value);
      table.push(tableLine);
    }

    console.log(table.toString());
  })




  .then(result => {
    return businessNetworkConnection.getAssetRegistry(
      "org.example.game.core.TileSet"
    );
  })
  .then(result => {
    registries["org.example.game.core.TileSet"] = result;
    return result.getAll();
  })
  .then(result => {
    console.log("List of tilesets" + result[0]);
    let tiles = result[0].tiles;
    let table = new Table({
      head: ["tiles"]
    });

    for (let i = 0; i < tiles.length; i++) {
      let tableLine = [];
      tableLine.push(tiles[i].getIdentifier());
      table.push(tableLine);
    }

    console.log(table.toString());
  })
  .then(result => {
    return businessNetworkConnection.getHistorian();
  })
  .then(result => {
    registries["org.hyperledger.composer.system.HistorianRegistry"] = result;
    return result.getAll();
  })
  .then(result => {
    let records = result;

    let table = new Table({
      head: ["TxID","type", "Timestamp"],
      colWidths: [40, 50,50]
    });

    for (let i = 0; i < records.length; i++) {
      let tableLine = [];
      tableLine.push(records[i].transactionId);
      tableLine.push(records[i].transactionType);
      tableLine.push(records[i].transactionTimestamp);
      table.push(tableLine);
    }
    console.log('-----------------------------------------------\nHistorian')
    console.log(table.toString());

  })
  .then(result => {
    return businessNetworkConnection.disconnect();
  })
  .then(() => {
    console.log("All done");
    process.exit();
  })
  // and catch any exceptions that are triggered
  .catch(err => {

    console.log(err);
    console.log(err.stack);

    throw err;
  });
