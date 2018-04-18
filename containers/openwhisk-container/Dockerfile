# This produces a docker image that can be used to drive OpenWhisk Servless Actions
# Based on the OpenWhisk Node image

# This is published to docker hub https://hub.docker.com/r/calanais/composer-openwhisk-0.18.1/


FROM openwhisk/action-nodejs-v8

# Reset npm logging to default level.
ENV NPM_CONFIG_LOGLEVEL warn

# Install the latest version by default.
# 0.18.1 is required for working with IBP Starter Plan
ARG VERSION=0.18.1

RUN apt-get update && apt-get install -y 

# Need to install extra dependencies for native modules.
RUN deluser --remove-home node && \
    addgroup --gid 1000 composer && \
    adduser --uid 1000 --ingroup composer --home /home/composer --disabled-password --gecos "" composer && \
    su -c "npm config set prefix '/home/composer/.npm-global'" - composer && \
    su -c "npm install --production -g composer-client@${VERSION}" - composer && \
    su -c "npm install --production -g @ampretia/composer-wallet-ibmcos" - composer && \
    su -c "npm cache clean --force" - composer && \
    rm -rf /home/composer/.config /home/composer/.node-gyp /home/composer/.npm && \
    cp -r /home/composer/.npm-global/lib/node_modules/* /nodejsAction/node_modules


# Add global composer modules to the path.
ENV PATH /home/composer/.npm-global/bin:$PATH
ENV NODE_PATH /home/composer/.npm-global/lib/node_modules/

# Run in the composer users home directory.
WORKDIR /nodejsAction


