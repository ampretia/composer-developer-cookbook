#!/bin/bash

echo "Really suggest that you execute these commands by hand to get to know how things work"
echo ".. or edit this file and remove the next line that says  exit 0"
#exit 0

# ------------

# This will create a new npm project and install the Composer CLI, Playground and REST Server as local modules
# The commands can then be run with NPX. It helps in that all the tools and code are contained within this 
# single directory. It also makes running multiple levels of the composer code easier if you're a contributor
# or maybe testing a bug fix etc.
npm init -y
npm install --save-dev composer-cli@next-unstable composer-playground@next-unstable composer-rest-server@next-unstable

# For simple cases these 'fabric-dev-servers' scripts create the simplest possible Hyperleder Fabric setup
mkdir fabric-tools
curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.zip
unzip -q fabric-dev-servers.zip -d fabric-tools 
export HL_FABRIC_VERSION=hlfv11 
export HL_COMPOSER_CLI=$(npm bin)/composer

# Setup the Composer Network Card wallet to use a local directory
export NODE_CONFIG='{  "composer": {"wallet": { "type": "composer-wallet-filesystem", "options": { "storePath": "./composer-store"   } } } }'

# These two scrtips firstly start the Fabric, and create a Peer Admin network card
./fabric-tools/startFabric.sh
./fabric-tools/createPeerAdminCard.sh

# now create a directory for Composer nework cards
mkdir -p ./cards

# Install the composer runtime, start the network and import the card
npx composer runtime install --card PeerAdmin@hlfv1 -n basic-sample-network
npx composer network start  --card PeerAdmin@hlfv1 -a ../networks/basic-sample-network.bna -A admin -S adminpw  --file ./cards/admin.card
npx composer card import --file ./cards/admin.card --name admin@bsn-local

echo 'Remember to set this'
echo "export NODE_CONFIG='{  "composer": {"wallet": { "type": "composer-wallet-filesystem", "options": { "storePath": "./composer-store"   } } } }'"