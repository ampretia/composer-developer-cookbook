

touch ${HOME}/.npmrc &&  echo '//localhost:4873/:_authToken="foo"' > ${HOME}/.npmrc
pkill verdaccio | true

rm -rf verdaccio/*

npx verdaccio -l 0.0.0.0:4873 -c ./config.yaml 1>/dev/null 2>&1   & 



ROOT=~/github/composer/packages

export NPM_MODULES="generator-hyperledger-composer composer-runtime composer-common composer-runtime-hlfv1 composer-connector-hlfv1 composer-admin composer-client loopback-connector-composer composer-rest-server composer-report composer-cli composer-wallet-inmemory composer-wallet-filesystem composer-playground composer-playground-api composer-connector-server composer-connector-proxy"
   
   
for j in ${NPM_MODULES}; do
    # check the next in the list
    npm publish --registry=http://localhost:4873  "${ROOT}/${j}"
done 

