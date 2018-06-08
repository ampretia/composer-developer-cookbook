## Using Docker to help access Composer Cloud Wallets

This Docker image is built from the docker image of the ComposerCLI 

# Scenario

- You have a number of business network cards locally that you want to push into cloud storage.
- Assume that these are in the current working directory
- With the NODE_CONFIG that you need for the cloud store you want to push to defined in `CLOUD_NODE_CONFIG` run this command

```
$ docker run -it -v $(pwd):/home/composer/cards --env NODE_CONFIG=${CLOUD_NODE_CONFIG} calanais/composer-cloud-card-wallet

```


