#!/bin/bash

# Initial setup for using the HSM 
# Taken from https://github.com/hyperledger/composer/wiki/HSM-Support

set -ev
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/." && pwd )"



sudo apt-get -y install libssl-dev
# install softhsm
mkdir "${DIR}"/softhsm
cd "${DIR}"/softhsm
curl -O https://dist.opendnssec.org/source/softhsm-2.0.0.tar.gz
tar -xvf softhsm-2.0.0.tar.gz
cd softhsm-2.0.0
./configure --disable-non-paged-memory --disable-gost
make
sudo make install

# now configure slot 0 with pin
sudo mkdir -p /var/lib/softhsm/tokens
sudo chmod 777 /var/lib/softhsm/tokens
softhsm2-util --init-token --slot 0 --label "ForComposer" --so-pin 1234 --pin 98765432

cd -