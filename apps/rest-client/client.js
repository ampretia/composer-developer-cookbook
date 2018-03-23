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

const axios = require('axios');
const winston = require('winston');
const config = require('config');
const prettyoutput = require('prettyoutput');


winston.loggers.add('rest-client', {
    console: {
        level: 'silly',
        colorize: true,
        label: 'RESTClient-App'
    }
});
const LOG = winston.loggers.get('rest-client');


const req = axios.create({
    baseURL: config.get('rest-client.service-endpoint')
});

/** Main function
 *
 */
async function main(){
    let people = await req.get('api/SampleParticipant',);
    LOG.info(prettyoutput(people.data));
}



main()
    .then( () =>{
        LOG.info('All done');
        process.exit(0);
    })
    .catch(
        (error)=>{
            LOG.error('Failure');
            LOG.error(error);
            process.exit(1);
        }
    );
