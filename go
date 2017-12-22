#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
export FABRIC_VERSION=hlfv11

${DIR}/scripts/fabric-tools/startFabric.sh
composer card delete --name admin@bsn-local 
composer runtime install --card PeerAdmin@hlfv1 -n basic-sample-network  
composer network start --card PeerAdmin@hlfv1 -a ${DIR}/networks/basic-sample-network.bna -A admin -S adminpw  --file ${DIR}/_tmp/admin.card
composer card import --file ${DIR}/_tmp/admin.card --name admin@bsn-local

