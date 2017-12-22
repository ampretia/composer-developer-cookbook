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

/* Application is to create assets in a business network, and time how long they take
 * Assumes a pre created network
 * 
 * They are created using the random data function.
 * Name of the asset should be specified in the config file
 * A card with sufficient privilege to connect and create assets is needed
 */

const fs = require('fs');
const path = require('path');
const winston = require('winston');
const IdCard = require('composer-common').IdCard;

const stats = require("simple-statistics");

const {
    performance,
    PerformanceObserver
  } = require('perf_hooks');
  
  const uuidv1 = require('uuid/v1');
// Require the client API
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const AdminConnection = require("composer-admin").AdminConnection;
const BusinessNetworkDefinition = require("composer-common").BusinessNetworkDefinition;

let businessNetworkDefinition;

const config = require('config');
//...
let appconfig = config.get('createAssets');

let factory;

let userCardName = appconfig.get('cardName');

winston.loggers.add('app', {
    console: {
        level: 'silly',
        colorize: true,
        label: 'CreateAssets-mb'
    }
});

const LOG = winston.loggers.get('app');


const businessNetworkConnection = new BusinessNetworkConnection();
// -----------------------------------------------------------------------------
// main code starts here
(async () => {

   try {

        LOG.info('> Creating business network connection');
        businessNetworkDefinition = await businessNetworkConnection.connect(userCardName);

        // what assets needs to be created
        let assetFQN = appconfig.get('asset-fqn');
        let i= assetFQN.lastIndexOf('.');
        let ns = assetFQN.substring(0,i);
        let assetName = assetFQN.substring(i+1);


        let batchSize = appconfig.get('batch-size');
        let batchCount = appconfig.get('batch-count');
        let factory = businessNetworkDefinition.getFactory();

        // create a datastructure to hold these
        let data = { overallmean:0,
                     overallstddev:0,
                     batches :
                        [

                        ] }
        let assetid;
        for (let bc = 0; bc<batchCount; bc++){
            let newBatch = {
                times:[],
                assets:[],
                size:batchSize,
                bulkAdd:true
            }
            
            for (let bs = 0; bs<batchSize; bs++){
                // assetid = `${assetName}-${bc}-${bs}`;
                assetid = uuidv1();
                let newAsset = factory.newResource(ns,assetName,assetid,{generate:'sample'});
                newBatch.assets.push(newAsset);
            }

            data.batches.push(newBatch);
        }
        let registry = await businessNetworkConnection.getRegistry(assetFQN);

        // got the data now to push that to the network
        for (let batch of data.batches){
            
             LOG.info(`> Adding batch to ${assetFQN}`);
             let s = performance.now();
             await registry.addAll(batch.assets);
             let duration=performance.now()-s;
             LOG.info(` Duration is ${duration}`);
             batch.times.push(duration);
        }

        let all=[];
        //output the data now
        for (let batch of data.batches){
            batch.mean = stats.mean(batch.times);
            batch.stddev = stats.standardDeviation(batch.times);
            all = all.concat(batch.times);
            LOG.info(`Batch  mean=${batch.mean} stddev=${batch.stddev}`);
        }
        let allmean = stats.mean(all);
        let allstddev = stats.standardDeviation(all);
       
        LOG.info(`Batch  mean=${allmean} stddev=${allstddev}`);

        
    } catch (error) {
        LOG.error(error);
        process.exit(1);
    } finally {
        await businessNetworkConnection.disconnect();
    }

})();