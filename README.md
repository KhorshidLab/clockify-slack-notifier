 # Clockify Slack Notifier
 
A simple example of how to use the [Clockify Webhooks](https://clockify.me/webhooks)' for receive a message
and send notifications to a Slack channel.

This project manage the Clockify's webhooks:

* `/clockify/timer/start`: the webhook manage the "Timer started by anyone" event of Clockify
* `/clockify/timer/stop`: the webhook manage the "Timer started by anyone" event of Clockify
* `/clockify/projects/new`: the webhook manage the "Project created" event of Clockify
* `/clockify/clients/new`: the webhook manage the "Client created" event of Clockify

You should assign a different secret to every Clockify events. Then, configure the env vars:

* `CLOCKIFY_PROJECT_CREATED_SECRET`
* `CLOCKIFY_CLIENT_CREATED_SECRET`
* `CLOCKIFY_TIME_ANY_CREATED_SECRET`
* `CLOCKIFY_TIME_ANY_STOP_SECRET`

You must configure the Slack webhook for enable the message publishing and set the `SLACK_HOOK` env.

You should define the timezone and set the `TIMEZONE` env.


## Keep running with PM2 Process Management

The latest PM2 version is installable with NPM or Yarn:

```
$ npm install pm2@latest -g
# or
$ yarn global add pm2
```

And then start your application with:

```
$ pm2 start index.js
```

## Reverse Proxy with NGINX

```
server {

    location / {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://127.0.0.1:3000$request_uri;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }

}
```
