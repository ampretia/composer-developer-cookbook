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
const IdCard = require('composer-common').IdCard;

// Require the client API
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const AdminConnection = require("composer-admin").AdminConnection;
const BusinessNetworkDefinition = require("composer-common").BusinessNetworkDefinition;

let businessNetworkDefinition;

const config = require('config');
//...
var appconfig = config.get('loadAssets');

let serializer;
let deployCardName = 'deployer-card';
let userCardName = appconfig.get('cardName');
// rather than use console.log use more like a debug fn call
// const LOG = {
//     info: (string) => {
//         console.log('  '+string);
//     },
//     error: (string) => {
//         console.log('!!'+string);
//     }
// };
winston.loggers.add('app', {
    console: {
        level: 'silly',
        colorize: true,
        label: 'ResourceLoading-App'
    }
});

const LOG = winston.loggers.get('app');


let bnDirectory = '../../_networks/basic-sample-network'

const businessNetworkConnection = new BusinessNetworkConnection();

// -----------------------------------------------------------------------------
// main code starts here
(async () => {
    try {

        LOG.info('> Deployed network - now Connecting business network connection');
        businessNetworkDefinition = await businessNetworkConnection.connect(userCardName);

        let jsonData = JSON.parse(fs.readFileSync(path.resolve(__dirname,'data.json'),'utf-8'));
        serializer = businessNetworkDefinition.getSerializer();

        let namespace = jsonData.namespace;
        for (let reg of jsonData.registries){
            let fqn = namespace+'.'+reg;
            let registry = await businessNetworkConnection.getRegistry(fqn);

            let resourcesToAdd = [];
            LOG.info(`> Adding assets to ${fqn}`);
            for (let resource of jsonData[reg]) {
                resourcesToAdd.push(serializer.fromJSON(resource));
            }
            await registry.addAll(resourcesToAdd);
        }

        await businessNetworkConnection.disconnect();
        process.exit(0);
    } catch (error) {
        LOG.error(error);
        process.exit(1);
    }

})();