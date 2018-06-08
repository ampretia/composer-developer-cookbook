'use strict';
/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



const winston = require('winston');


const ns = 'org.composer.game';
// Require the client API
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
let businessNetworkDefinition;



winston.loggers.add('app', {
    console: {
        level: 'silly',
        colorize: true,
        label: 'ResourceLoading-App'
    }
});

const LOG = winston.loggers.get('app');


/**
 * Main Function
 * @param {String} cardName userCardName
 */
async function submitTx(userCardName){
    try {

        // let table = new Table();
        const businessNetworkConnection = new BusinessNetworkConnection();
        LOG.info('> Connecting business network connection',userCardName);
        businessNetworkDefinition = await businessNetworkConnection.connect(userCardName);
        let serializer = businessNetworkDefinition.getSerializer();

        businessNetworkConnection.on('event',(evt)=>{
            console.log(serializer.toJSON(evt));
        });

        let factory = businessNetworkDefinition.getFactory();

        let playerRegistry = await businessNetworkConnection.getRegistry(`${ns}.Player`);

        let playerOne = factory.newResource(ns,'Player','blue');
        playerOne.name='Blue';
        let playerTwo = factory.newResource(ns,'Player','green');
        playerTwo.name='Green';
        try {
            await playerRegistry.addAll([playerOne,playerTwo]);
        } catch (err){
            console.log('already added');
        }


        let tx = factory.newTransaction(ns,'GameResult');
        tx.playerOne = factory.newRelationship(ns,'Player','blue');
        tx.playerTwo = factory.newRelationship(ns,'Player','green');

        tx.result='PLAYER_ONE';

        console.log('Submitting transaction');
        await businessNetworkConnection.submitTransaction(tx);

        await businessNetworkConnection.disconnect();
    } catch (error) {
        LOG.error(error);
        throw error;
    }

}

submitTx('admin@violet-blue-green-network');