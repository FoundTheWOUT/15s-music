# https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker

FROM node:18-alpine
RUN npm install -g pnpm
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY ["package.json","pnpm-*.yaml", "./"]
COPY --chown=node:node packages/server packages/server

RUN pnpm i

RUN pnpm --filter @15s-music/server build
EXPOSE 3500

CMD [ "node", "packages/server/dist/index.js" ]