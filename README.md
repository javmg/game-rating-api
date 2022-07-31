# game-rating-api

## Introduction

This is a simple PoC application to simulate rankings using [glicko2js](https://github.com/mmai/glicko2js).

The application includes the following concepts:

* users (players or admins)
* tournaments (a container of matches)
* matches (a simple 1v1 game indicating players and outcome)
* rankings (current and historical information about the ranking of the players based on their outcomes in matches)

It has been implemented as a RESTful application with TypeScript, NodeJS and ExpressJS.

## Build

The software needs NodeJS and NPM.

The first step is to install the dependencies:

```
npm install
```

Then we can build the software as follows:

```
npm run build
```

This last will generate the routes and the [Open API](https://www.openapis.org/) documentation in the /gen folder.

## Execution

### Testing

To run the tests:

```
npm test
```

This will run some tournament tests using an in-memory DB.

### Database

The application needs a [PostgreSQL](https://www.postgresql.org/) database.

We can use the files in the [db folder](./db) in order to create the schema and introduce some sample data.

The Entity Relationship diagram can be [looked up here](./db/diagram.png).

### Run (standalone)

To get started create a <b>.env</b> file similar to the [example file](.example.env).

After that we can run the application with the following command:

```
npm run start
```

The Swagger UI should be available under:

http://localhost:8080/api

### Run (with docker)

We can build an image as follows:

```
docker build -t game-rating-api .
```

After that we can run a container using the image:

```
docker run --name game-rating-api -d --env-file your_env_file.env -p 8080:8080 game-rating-api    
```

The Swagger UI should be available under:

http://localhost:8000/api

We can also run the container as follows if the PostgreSQL instance is in our localhost:

```
 docker run --name game-rating-api -d --env-file .env --network=host game-rating-api 
 ```

### Limitations

The application is a PoC and some subjects haven't been addressed:

* the application is quite simplified and in a more professional setting the model would be more complex.
* some non-relevant endpoints are missing like for instance for management (creating, deletion, etc) of users or getting a single tournament, match, etc. rather than a list.
* no pagination has been introduced.
* some IoC aspects could be improved (like for instance for repositories)
* documentation has been generated (Open API format) however it could be extended with examples and other features. 
* we expose certain operations for admins for simplicity shake but in a normal app we'd have automatic processes governing that logic. For instance, matches would be automatically generated and scored while tournaments would also be processed automatically when finished rather than having an admin performing those operations. 
* testing has only been introduced for the tournament processing endpoint as it's there where the relevant rating calculations happen.
