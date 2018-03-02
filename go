#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
export FABRIC_VERSION=hlfv11
#export NODE_CONFIG={"composer":{"wallet":{"type":"composer-wallet-filesystem","options":{"storePath":"./composer-store"}}}}


if [[ -z "${COMPOSER_CLI}" ]]; then
	COMPOSER_CLI=$(npm bin)/composer
fi

echo "Using   ${COMPOSER_CLI}"

${DIR}/scripts/fabric-tools/startFabric.sh 
${DIR}/scripts/fabric-tools/createPeerAdminCard.sh
${COMPOSER_CLI} card delete --name admin@bsn-local || echo 'not there'

read -n1 -rsp $'Please start the node container and press H to continue or Ctrl+C to exit...\n' 

${COMPOSER_CLI} runtime install --card PeerAdmin@hlfv1 -n basic-sample-network  
${COMPOSER_CLI} network start --card PeerAdmin@hlfv1 -a ${DIR}/networks/basic-sample-network.bna -A admin -S adminpw  --file ${DIR}/_tmp/admin.card
${COMPOSER_CLI} card import --file ${DIR}/_tmp/admin.card --name admin@bsn-local

