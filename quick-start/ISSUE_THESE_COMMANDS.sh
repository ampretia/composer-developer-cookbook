#!/bin/bash

# ------------

# This will create a new npm project and install the Composer CLI, Playground and REST Server as local modules
# The commands can then be run with NPX. It helps in that all the tools and code are contained within this 
# single directory. It also makes running multiple levels of the composer code easier if you're a contributor
# or maybe testing a bug fix etc.
npm init -y

if [ -z "${HL_COMPOSER_VERSION}" ]; then
  HL_COMPOSER_VERSION=latest
fi

#npm install --save-dev composer-cli@${HL_COMPOSER_VERSION} composer-playground@${HL_COMPOSER_VERSION} composer-rest-server@${HL_COMPOSER_VERSION}

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
if [ -z "${BNA_FILE}" ]; then
  BNA_FILE=../networks/violet-blue-green-network.bna
fi

NETWORK_NAME=$(composer archive list -a ${BNA_FILE} | awk -F: '/Name/ { print $2 }')
NETWORK_VERSION=$(composer archive list -a ${BNA_FILE} | awk -F: '/Version/ { print $2 }')
npx composer network install --card PeerAdmin@hlfv1 --archiveFile ${BNA_FILE} 
npx composer network start  --card PeerAdmin@hlfv1  -A admin -S adminpw  --file ./cards/admin.card --networkName ${NETWORK_NAME} --networkVersion ${NETWORK_VERSION}
npx composer card import --file ./cards/admin.card --card admin@bsn-local

echo 'Remember to set this'
echo "export NODE_CONFIG='{  \"composer\": {\"wallet\": { \"type\": \"composer-wallet-filesystem\", \"options\": { \"storePath\": \"./composer-store\"   } } } }'"