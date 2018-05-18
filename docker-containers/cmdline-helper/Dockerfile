# If running a docker-compose based stack, this can be a useful image to stand up next to
# that. Allows to you to exec in to run debugging etc. 

FROM node:8-alpine

# Reset npm logging to default level.
ENV NPM_CONFIG_LOGLEVEL warn

# Install the latest version by default.
ARG VERSION=latest


RUN apk update && apk upgrade && apk add --no-cache bash && apk add --no-cache bash-completion
RUN apk add --no-cache curl
RUN apk add --no-cache util-linux pciutils usbutils coreutils binutils findutils grep
RUN apk add --no-cache dumb-init 

# Need to install extra dependencies for native modules.
RUN deluser --remove-home node && \
    addgroup -g 1000 composer && \
    adduser -u 1000 -G composer -s /bin/bash -D composer && \
    apk add --no-cache make gcc g++ python git libc6-compat && \
    su -c "npm config set prefix '/home/composer/.npm-global'" - composer && \
    su -c "npm install --production -g composer-cli@${VERSION}" - composer && \
    su -c "npm install --production -g composer-client@${VERSION}" - composer && \
    su -c "npm install --production -g @ampretia/composer-wallet-ibmcos" - composer && \
    su -c "npm cache clean --force" - composer && \
    rm -rf /home/composer/.config /home/composer/.node-gyp /home/composer/.npm && \
    apk del make gcc g++ python git


# Add global composer modules to the path.
ENV PATH /home/composer/.npm-global/bin:$PATH

# Run in the composer users home directory.
WORKDIR /home/composer

USER composer


ENTRYPOINT ["/usr/bin/dumb-init"]
CMD ["/bin/bash"]