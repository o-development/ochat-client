# Liqid Chat Client

A chat client for Solid.

## Setup

```bash=
 git clone git@github.com:o-development/ochat-client.git
 npm ci
```

Create a .env file in the root folder and configure it for your setup.
e.g.

```bash=
# The URL that the API is hosted at
API_URL=http://localhost:8080

# The URL that the API websockets are on
API_WS_URL=wss://localhost:8080

# The vapid push server public key (for web push notifications)
PUSH_SERVER_PUBLIC_KEY=example-key
```

To run on mobile:

```bash=
 npm start
```

To run on web:

```bash=
 npm run web
```
