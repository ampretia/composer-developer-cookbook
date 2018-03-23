#!/bin/bash

echo 'Development Start script'

if [[ -z ${DIR} ]]; then
	DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
fi

export GITHUB=github-logging

export FABRIC_VERSION=hlfv11
export NODE_CONFIG=$(cat ${DIR}/cardstore-cwd.json)

if [[ -z "${HL_COMPOSER_CLI}" ]]; then
  HL_COMPOSER_CLI=~/${GITHUB}/composer/packages/composer-cli/cli.js
fi

echo "Using ${HL_COMPOSER_CLI}"
${HL_COMPOSER_CLI} --version
${DIR}/scripts/fabric-tools/startFabric.sh --dev
${DIR}/scripts/fabric-tools/createPeerAdminCard.sh
${HL_COMPOSER_CLI} card delete --card admin@bsn-local || echo 'not there'

read -n1 -rsp $'Please start the node container and press H to continue or Ctrl+C to exit...\n' 

${HL_COMPOSER_CLI} network install --card PeerAdmin@hlfv1 -a ${DIR}/networks/basic-sample-network.bna
${HL_COMPOSER_CLI} network start --card PeerAdmin@hlfv1 --networkName basic-sample-network  --networkVersion 0.1.5 -A admin -S adminpw  --file ${DIR}/_tmp/admin.card
${HL_COMPOSER_CLI} card import --file ${DIR}/_tmp/admin.card --card admin@bsn-local

echo "export NODE_CONFIG=$(cat ${DIR}/cardstore-cwd.json)"