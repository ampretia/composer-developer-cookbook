#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
NETWORKS=${DIR}/../_networks

function l(){
    printf '%s\n' -------------------------------------------------------
    echo $1
    $1
}


rm -rf ${DIR}/fabric-tools
mkdir -p ${DIR}/fabric-tools && cd ${DIR}/fabric-tools
curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.zip
unzip -q fabric-dev-servers.zip
rm fabric-dev-servers.zip
cd ${DIR}

mkdir -p ${DIR}/_cards

# clean up the fixed directories
rm -rf ~/.composer-connection-profiles/hlfv1
rm -rf ~/.composer-credentials/*
rm -rf ~/.composer/*

rm -rf ${DIR}/_cards/*
rm -f ${DIR}/network.bna

${DIR}/fabric-tools/startFabric.sh
${DIR}/fabric-tools/createPeerAdminCard.sh

l "composer --version"
l "composer archive create -t dir -a ${DIR}/network.bna -n ${DIR}/basic-sample-network"
l "composer runtime install --card PeerAdmin@hlfv1 -n basic-sample-network"
l "composer network start --archiveFile ${DIR}/network.bna --card PeerAdmin@hlfv1 --networkAdmin.id admin --networkAdmin.secret adminpw "
l "composer card import --file ${DIR}/_cards/admin.card"
l "composer card list"
l "composer network ping --card adminB@basic-sample-network"
l "composer network list --card adminB@basic-sample-network -r org.acme.sample.SampleAsset"
l "composer participant add --card adminB@basic-sample-network -d {\"\$class\":\"org.acme.sample.SampleParticipant\",\"participantId\":\"bob\",\"firstName\":\"bob\",\"lastName\":\"bobbington\"}"
l "composer identity issue --card adminB@basic-sample-network -u newUser1 -a resource:org.acme.sample.SampleParticipant#bob"
l "composer card import --file newUser1@basic-sample-network.card"
l "composer card list --name newUser1@basic-sample-network"
l "composer identity list --card adminB@basic-sample-network"
l "composer network list --card newUser1@basic-sample-network"