#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [[ -z "${SRC_ROOT}" ]]; then
	SRC_ROOT=~/github/composer/packages
fi

npx boxen -padding=1 --margin=1 "Setting up Verdaccio..  Using ${SRC_ROOT} as the source of the code to publish"

touch ${HOME}/.npmrc &&  echo 'registry=http://0.0.0.0:4873/:_authToken="foo"' > ${HOME}/.npmrc
export GATEWAY="$(docker inspect composer_default | grep Gateway | cut -d \" -f4)"
#touch /tmp/npmrc && echo "registry=http://${GATEWAY}:4873/:_authToken=\"foo\"" > /tmp/npmrc
touch /tmp/npmrc && echo "registry=http://${GATEWAY}:4873/" > /tmp/npmrc


pkill verdaccio | true
rm -rf "${DIR}"/verdaccio/*

npx verdaccio -l 0.0.0.0:4873 -c "${DIR}/config.yaml"  1>verdaccio.log 2>&1 & 


#export NPM_MODULES="composer-runtime composer-common composer-runtime-hlfv1"

export NPM_MODULES="generator-hyperledger-composer composer-runtime-pouchdb composer-runtime-embedded composer-connector-embedded composer-runtime composer-common composer-runtime-hlfv1 composer-connector-hlfv1 composer-admin composer-client loopback-connector-composer composer-rest-server composer-report composer-cli composer-wallet-inmemory composer-wallet-filesystem composer-playground composer-playground-api composer-connector-server composer-connector-proxy composer-documentation"
   
for j in ${NPM_MODULES}; do
    # check the next in the list
    npm publish --registry=http://localhost:4873  "${SRC_ROOT}/${j}"
done 

rm -f ${HOME}/.npmrc

npx boxen --padding=1 --margin=1 "Individual modules can be installed via 'npm install --registry=http://localhost:4873' 
 Add  '-o npmrcFile=/tmp/npmrc'  to the 'composer network install' comand"

