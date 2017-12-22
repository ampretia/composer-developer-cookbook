
- Ensure you have the latest fabric-dev-servers package and have set your fabric runtime to V1.1 `export FABRIC_VERSION=hlfv11`
- Start the fabric in development mode using the -d or --dev option. eg `./startFabric.sh -d`
- create and import your PeerAdmin card if you haven't done so before eg `./createPeerAdmin.sh` 
- Open a command window and change to the `packages/composer-runtime-hlfv1` directory
- Start the Composer chaincode with an appropriate business network name and version of the composer-runtime-hlfv1 (The version you need is the version defined in the package.json of the composer-runtime-hlfv1 package. In this example I have shown a version number of `0.17.0`) eg.
```
CORE_CHAINCODE_ID_NAME="mynetwork:0.17.0" node start.js --peer.address grpc://localhost:7052
```
- install a composer runtime package (note this doesn't get used but has to be present on the peer) Assuming you are still in the composer-runtime-hlfv1 directory eg.
```
node ../composer-cli/cli.js runtime install -n mynetwork -c PeerAdmin@hlfv1
```
- instantiate the chaincode, this will drive your running node process you started earlier.
```
node cli.js network start -a mynetwork.bna -c PeerAdmin@hlfv1 -A admin -S adminpw
```
You should now see output in the window running the chaincode showing it executing.


