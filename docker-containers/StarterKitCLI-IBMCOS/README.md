Here's my 'cunning plan'

- Log on to the artifactory repo as per James' notes above
```
docker login -u <intranetid> -p <password> https://ip-composer-docker-local.artifactory.swg-devops.com
```
- Pull down the CLIimage
```
docker pull ip-composer-docker-local.artifactory.swg-devops.com/ibmblockchain/composer-cli 
```
- You will need the contents of this directory
```
https://github.com/ampretia/composer-developer-cookbook/tree/master/docker-containers/StarterKitCLI
```
- This now needs to be built
```
docker build -t ibp-sk-cli .
```
- Now you can run it... currently this is set to use a local FS card wallet (plans to extend this to include redis etc)
```
mkdir -p $(pwd)/composer-store
docker run -it -v $(pwd)/composer-store:/home/composer/.fswallet ibp-sk-cli 
```

Now you are in a BASH shell where the composer is all ready set to rock and roll.  Using the IBM Docker Image, local FS card store. 