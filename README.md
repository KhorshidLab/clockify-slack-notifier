 # Clockify Slack Notifier
 
A simple example of how to use the [Clockify Webhooks](https://clockify.me/webhooks)' for receive a message
and send notifications to a Slack channel.

This project manage the Clockify's webhooks:

* `/clockify/projects/new`: the webhook manage the "Project created" event of Clockify
* `/clockify/clients/new`: the webhook manage the "Client created" event of Clockify

You should assign a different secret to every Clockify events. Then, configure the env vars:

* `CLOCKIFY_PROJECT_CREATED_SECRET`
* `CLOCKIFY_CLIENT_CREATED_SECRET`

You must configure the Slack webhook for enable the message publishing and set the `SLACK_HOOK` env.

You could install forever using npm:

```
sudo npm install -g forever
```

And then start your application with:

```
forever server.js
```

Or as a service:

```
forever start server.js
```

Forever restarts your app when it crashes or stops for some reason.

To list all running processes:

```
forever list
```

Note the integer in the brackets and use it as following to stop a process:

```
forever stop 0
```

Restarting a running process goes:

```
forever restart 0
```
