# Api service
Api service acts as backend using ExpressJS application

## Actor
- Api service handles authentication requests: login, register, and refresh session
- Also handles user data APIs

## Testing
It allows tests using Jest, tests are defined inside each bundle, and can be defined anywere inside ./src/** folder following the next structure: *.test.ts

## Ports
By default express is running at port 3000, but can be configured using envar PORT

As its a microservice architecture all requests that start with /api/** are redirected through api service by proxy. So, giving an example:
    - Request http://localhost/api/v1/auth/login, will be redirected to service api inside Docker network.

## Envars
JWT_SECRET --> secret key to encrypt JWT tokens
PORT --> port where runs the application
