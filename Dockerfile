   


# Build Stage 1
# This build created a staging docker image
#
FROM node:16-slim AS appbuild
ARG SOURCE_FOLDER="./"
WORKDIR /usr/src/api
COPY ${SOURCE_FOLDER} .
RUN npm ci
COPY ./src ./src
RUN npm run build

# Build Stage 2
# This build takes the production build from staging build
#
FROM node:16-slim
WORKDIR /usr/src/api
ENV PORT 3000
ENV PREFIX ""
ENV STAGE "dev"
COPY --from=appbuild /usr/src/api/dist ./dist
COPY --from=appbuild /usr/src/api/.env.stage.${STAGE} ./.env.stage.${STAGE}
COPY --from=appbuild /usr/src/api/node_modules ./node_modules

CMD node ./dist/main.js


