# https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker

FROM node:18-alpine
RUN npm install -g pnpm

RUN mkdir -p /app
WORKDIR /app

COPY ["package.json","pnpm-*.yaml","tsconfig.json", "./"]

# install dependance
RUN mkdir -p packages/server
COPY packages/server/package.json packages/server/package.json
RUN pnpm i --frozen-lockfile

ARG version
ENV Version=$version

COPY --chown=node:node packages/server packages/server

RUN pnpm serve build
EXPOSE 3500

CMD [ "node", "packages/server/dist/index.js" ]