## RisingStack API test

### Requirements

Write a [JSON HTTP API](http://jsonapi.org/) that has the following endpoints:

* **POST** `/registration`
  * name: String
  * email: String (bonus: validation)
* **GET** `/users`
  * token: String

The `/registration` endpoint creates a new user in a database with a token, and sends an email to the user. The email contains
a link with the token to the `/users` endpoint, where it lists all the registered users. The `/users` endpoint is only accessible with the token.

### Techs to be used

Node.js - apart from this, it is your call. Just be sure that you can answer the *Why?* question.

### Test cases

Unit/integration, you name it - the more, the merrier.

## Implementation

### Run

First launch a local MongoDB instance.
```shell
# mongod
```

Install dependencies and start the server.
```shell
$ npm install
$ npm start
```

### Run in a docker container
```shell

```

### Test
