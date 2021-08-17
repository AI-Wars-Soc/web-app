If you haven’t already, check out the [server repository](https://github.com/AI-Wars-Soc/server) to get started.

# Web App

This is the docker container that serves all static HTML and JS content to the user. We run Webpack at build time to transpile all of the typescript into es-6 Javascript.

We use React and React-Bootstrap as our main framework.

The static files are then served using Nginx on port 8080 when it is run.

