#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [[ -z "${SRC_ROOT}" ]]; then
	SRC_ROOT=~/github-logging/composer/packages
fi

npx boxen -padding=1 --margin=1 "Setting up Verdaccio..  Using ${SRC_ROOT} as the source of the code to publish"

touch ${HOME}/.npmrc &&  echo '//localhost:4873/:_authToken="foo"' > ${HOME}/.npmrc

pkill verdaccio | true
rm -rf verdaccio/*

npx verdaccio -l 0.0.0.0:4873 -c "${DIR}/config.yaml" 1>"${DIR}/verdaccio.log" 2>&1  & 



export NPM_MODULES="generator-hyperledger-composer composer-runtime composer-common composer-runtime-hlfv1 composer-connector-hlfv1 composer-admin composer-client loopback-connector-composer composer-rest-server composer-report composer-cli composer-wallet-inmemory composer-wallet-filesystem composer-playground composer-playground-api composer-connector-server composer-connector-proxy"
   
for j in ${NPM_MODULES}; do
    # check the next in the list
    npm publish --registry=http://localhost:4873  "${SRC_ROOT}/${j}"
done 

npx boxen --padding=1 --margin=1 "Individual modules can be installed via 'npm install --registry=localhost:4873' 
 Add  '-o npmrcFile= ${DIR}/npmrc'  to the 'composer network install' comand"