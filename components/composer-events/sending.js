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
'use strict';

const fs = require('fs');
const path = require('path');
const winston = require('winston');


// Require the client API
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
let businessNetworkDefinition;

const config = require('config');
//...
let appconfig = config.get('sending');



let userCardName = appconfig.get('cardName');

winston.loggers.add('app', {
    console: {
        level: 'silly',
        colorize: true,
        label: 'ComposerEvents-sending'
    }
});

const LOG = winston.loggers.get('app');

const businessNetworkConnection = new BusinessNetworkConnection();
/**
 * Main Function
 */
async function main(){
    try {

        LOG.info('> Deployed network - now Connecting business network connection');
        businessNetworkDefinition = await businessNetworkConnection.connect(userCardName);

        // get the factory to create the transaction
        const factory = await businessNetworkDefinition.getFactory();
        let tx = factory.newTransaction('org.acme.sample','CoffeeEvent');
        tx.notes='CongaCoffee Single Source Brazilian';






        await businessNetworkConnection.disconnect();
    } catch (error) {
        LOG.error(error);
        throw error;
    }

}

main()
    .then(()=>{
        LOG.info('All done');
    })
    .catch((err)=>{
        LOG.error(err);
    });


