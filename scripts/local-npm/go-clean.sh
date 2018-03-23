

touch ${HOME}/.npmrc &&  echo '//localhost:4873/:_authToken="foo"' > ${HOME}/.npmrc
pkill verdaccio | true

rm -rf verdaccio/*

#npx verdaccio -l 0.0.0.0:4873 -c ./config.yaml 1>/dev/null 2>&1   & 


echo ' npm publish --registry=http://localhost:4873  ...'
echo ' npm install --registry=http://localhost:4873  ...'
echo 'npx verdaccio -l 0.0.0.0:4873 -c ./config.yaml '

