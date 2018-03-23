#!/bin/bash

echo 'Development Start script'

if [[ -z ${DIR} ]]; then
	DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
fi

export FABRIC_VERSION=hlfv11
export NODE_CONFIG=$(cat ${DIR}/cardstore-cwd.json)

if [[ -z "${HL_COMPOSER_CLI}" ]]; then
#	HL_COMPOSER_CLI=$(npm bin)/composer
   HL_COMPOSER_CLI=~/github/composer/packages/composer-cli/cli.js
fi

echo "Using ${HL_COMPOSER_CLI}"
${HL_COMPOSER_CLI} --version
${DIR}/scripts/fabric-tools/startFabric.sh --dev
${DIR}/scripts/fabric-tools/createPeerAdminCard.sh
${HL_COMPOSER_CLI} card delete --name admin@bsn-local || echo 'not there'

read -n1 -rsp $'Please start the node container and press H to continue or Ctrl+C to exit...\n' 

${HL_COMPOSER_CLI} runtime install --card PeerAdmin@hlfv1 -n basic-sample-network
${HL_COMPOSER_CLI} network start --card PeerAdmin@hlfv1 -a ${DIR}/networks/basic-sample-network.bna -A admin -S adminpw  --file ${DIR}/_tmp/admin.card
${HL_COMPOSER_CLI} card import --file ${DIR}/_tmp/admin.card --name admin@bsn-local

echo "export NODE_CONFIG=$(cat ${DIR}/cardstore-cwd.json)"