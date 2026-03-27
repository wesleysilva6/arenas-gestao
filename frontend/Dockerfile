FROM node:22.12.0-alpine3.21 AS build

WORKDIR /usr/src/app

COPY . .

RUN yarn install
RUN yarn build

FROM node:22.12.0-alpine3.21

RUN yarn global add serve --silent

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist .

EXPOSE 3000

USER node

CMD ["serve", "-p", "3000", "-s", "."]