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
/**
 * Write the unit tests for your transction processor functions here
 */

const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');
const path = require('path');

const chai = require('chai');
chai.should();
chai.use(require('chai-as-promised'));
const os = require('os');
const fs = require('fs');
// const path = require('path');
const winston = require('winston');
winston.loggers.add('app', {
    console: {
        level: 'silly',
        colorize: true,
        label: 'card-admin.js'
    }
});
const LOG = winston.loggers.get('app');
const namespace = 'org.hyperledger.composer.userprofile';
const bnID='userprofile';

describe('#' + namespace, () => {
    let tmpDir;
    let dirToClean;

    before(async () => {
        // The parent directory for the new temporary directory
        tmpDir = os.tmpdir();
    });

    after(()=>{
        console.log(`temp card store at ${dirToClean}`);
    });



    it('aa', async () => {
        let client = new BusinessNetworkConnection(); // create use the default cstore
        let adminCardName = 'admin@userprofile';
        await client.connect(adminCardName);

        const factory = client.getBusinessNetwork().getFactory();
        let participant = factory.newResource(namespace, 'SampleParticipant', 'bob@uk.ibm.com');
        participant.firstName = 'Bob';
        participant.lastName = 'Bobbington';
        const participantRegistry = await client.getParticipantRegistry(`${namespace}.SampleParticipant`);
        await participantRegistry.add(participant);

        // issue an identity for this person
        LOG.info('Issuing the identity');
        let result = await client.issueIdentity(`${namespace}.SampleParticipant#bob@uk.ibm.com`, 'bob-id-b', {});

        let metadata =  {
            userName : result.userID,
            version : 1,
            enrollmentSecret: result.userSecret,
            businessNetwork : bnID
        };
        let ac = new AdminConnection();
        let adminCard = await ac.exportCard(adminCardName);
        ac.disconnect;

        let idCard = new IdCard(metadata, adminCard.getConnectionProfile());

        // this card may be used to connect to the network.
        //
        let options = {
            wallet:{
                type: 'composer-wallet-filesystem',
                options: {
                    storePath: fs.mkdtempSync(`${tmpDir}${path.sep}`)
                }
            }
        };
        dirToClean = options.wallet.options.storePath;
        // creating new connections with different card store
        let bnc = new BusinessNetworkConnection(options);
        ac = new AdminConnection(options);


        // let's import the card via the Admin Connection
        await ac.importCard('bobscard',idCard);
        await bnc.connect('bobscard');

        // as well as importing the admin card here as well
        await ac.importCard('admin',adminCard);

        // for test let's get bob to update his own record
        // we don't want to make bob mess around with the registries so he can all a transaction to update
        // his own profile

        let updatetx = factory.newTransaction(namespace,'UpdateProfile');
        updatetx.update = 'Never know what to say here';

        await bnc.submitTransaction(updatetx);

        // let's use the admin card to get back bob's details and validate the transaction has woked

        let admin_nc = new BusinessNetworkConnection(options);
        await admin_nc.connect('admin');
        let pr = await admin_nc.getParticipantRegistry(`${namespace}.systest.cardadmin.SampleParticipant`);
        let bobsDetails = await pr.get('bob@uk.ibm.com');

        bobsDetails.userProfile.should.equal('Never know what to say here');
        bnc.disconnect();

        await ac.deleteCard('bobscard');
        await ac.deleteCard('admin');
        ac.disconnect();

    });


});
