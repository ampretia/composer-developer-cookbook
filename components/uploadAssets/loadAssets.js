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

let serializer;

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
 * @param {String} fullPathJson fullpathname of the data file
 */
async function loadData(fullPathJson){
    try {

        let jsonData = JSON.parse(fs.readFileSync(path.resolve(fullPathJson),'utf-8'));

        let userCardName = jsonData.card;
        let walletSpec = jsonData.composer;

        const businessNetworkConnection = new BusinessNetworkConnection(walletSpec);
        LOG.info('> Deployed network - now Connecting business network connection');
        businessNetworkDefinition = await businessNetworkConnection.connect(userCardName);

        serializer = businessNetworkDefinition.getSerializer();

        // do the resources
        let registires = Object.keys(jsonData.resources);

        for (let reg of registires){

            let registry = await businessNetworkConnection.getRegistry(reg);
            let resourcesToAdd = [];

            let allResourcesToAdd = jsonData.resources[reg];
            LOG.info(`> Adding assets to ${reg}`);
            for (let resource of allResourcesToAdd) {
                resourcesToAdd.push(serializer.fromJSON(resource));
            }
            await registry.addAll(resourcesToAdd);
        }

        await businessNetworkConnection.disconnect();
    } catch (error) {
        LOG.error(error);
        throw error;
    }

}

module.exports = loadData;