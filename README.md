# Plus/Minus Server

Server for running the API behind the plus/minus app

## Requirements
* docker
* docker-compose

## Docker Container
* From the mean-docker folder:
  * `docker-compose build --pull`
  * `docker-compose up`
* When changes are local, and not concerned about pulling:
  * `docker-compose up --build`
* If no changes to Docker, and also not concerned about pulling (fastest):
  * `docker-compose up`

## Access
* If running locally:
  * localhost:4200
* Remotely:
  * serveripaddress:4200
