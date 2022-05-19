# Task Management API
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## Docker Compose

```bash
# start
docker-compose up
# terminate
docker-compose down
```
## Kubernetes with Skaffold



```bash
  minikube start --vm-driver=virtualbox
  minikube addons enable ingress
  skaffold config set --global local-cluster true
  skaffold dev
```
