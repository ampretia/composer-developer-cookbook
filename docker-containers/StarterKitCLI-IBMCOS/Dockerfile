# Extend the IBM Blockchain Composer-CLI
FROM ibmblockchain/composer-cli

USER root
RUN apt-get install jq --assume-yes

USER composer
COPY ./configs /home/composer/.configs
COPY *.sh /home/composer/
ENV NODE_CONFIG '{"composer": {"wallet": {"type": "@ampretia/composer-wallet-ibmcos","desc": "Uses the IBM Cloud Object Store","options": {"bucketName": "commercial-paper-demo",                "endpoint": "s3-api.us-geo.objectstorage.softlayer.net",                "apikey": "WmKck6Ta6JAaqM57mfkD_8kGDkldfJ4zfSTl-Id5oqhx",                "serviceInstanceId": "crn:v1:bluemix:public:cloud-object-storage:global:a/f312377c857f745dd4741a70d09a8e4c:fb474f32-8d51-4864-a2e7-459105254cfd::"            }        }    }}'

RUN npm install -g boxen-cli
ENTRYPOINT ["/bin/bash"]
CMD ["--init-file","run.sh"]