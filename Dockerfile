FROM makeomatic/node:$NODE_VERSION

ENV NCONF_NAMESPACE=MS_CLI \
  NODE_ENV=$NODE_ENV

WORKDIR /src

# pnpm fetch does require only lockfile
COPY --chown=node:node package.json pnpm-lock.yaml LICENSE ./
RUN \
  apk --update upgrade \
  && apk add git ca-certificates openssl g++ make python3 linux-headers \
  && chown node:node /src \
  && su -l node -c "cd /src && pnpm install --prod --frozen-lockfile" \
  && apk del \
    g++ \
    make \
    git \
    wget \
    python3 \
    linux-headers \
  && rm -rf \
    /tmp/* \
    /root/.node-gyp \
    /root/.npm \
    /etc/apk/cache/* \
    /var/cache/apk/*

USER node
COPY --chown=node:node ./lib/ /src/lib/
COPY --chown=node:node ./bin/ /src/bin/
ENTRYPOINT [ "./bin/ms-cli.mjs" ]
