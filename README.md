# RepoWatcher

GitHub organization repository watcher.

The goal of this web service is to support a notification to an GitHub organization administrator when an GitHub organization repository is deleted.  When the required activity takes place, an issue is logged in another configurable repository, containing the activity detail.

While the focus is to capture and report delete events, the service is configurable to support additional events such as created and archived.  For the full list of supported events, see [Repository Event API](https://developer.github.com/v3/activity/events/types/#repositoryevent).

## Getting Started

The next few sections provide details on creating a valid GitHub environment, enabling webhook notification and api access, and hosting the RepoWatcher web service.

### Technical Stack

GitHub
  * GitHub organizations and repositories
  * GitHub Webhooks - push notification
  * GitHub REST API v3 - programmatic interface into GitHub 
Web Service
  * [Node.js](https://nodejs.org/en/) - runtime environment (tested v8.1.3, however versions as early as v6.12.2  should function)
  * [Express](https://github.com/expressjs/express) - http web server
  * [Axios](https://github.com/axios/axios) - http web client 
  * Development environment only
    * [Typescript](https://github.com/Microsoft/TypeScript) - typed JavaScript provider
    * [Grunt](https://github.com/gruntjs/grunt) - task based development processes
    * [Jest](https://github.com/facebook/jest) - unit testing
  * [Docker](https://www.docker.com) - easy to use deployment container for web service

### Prerequisites

In order to utilize this web service application, the following perquisites must be available.
  * A GitHub organization
  * An administrative user supporting the GitHub organization
  * A GitHub repository within the required organization to accept the pushed issues.
  * A Docker hosting platform capable of accepting incoming http requests to support the web service
  * A single http port will be required for the http request.  This may require additional firewall configurations.  See your cloud provider (cloud hosted) or network administrator (on premise) for help configuring.

### Installing

Organization
  * Utilize an existing organization or create a new one
    * --steps
  * Designate a repository to hold the pushed change issues (note the full organization and repository name like org/repo).
  * Reference
    * [Create Organization](https://help.github.com/articles/creating-a-new-organization-from-scratch/)
    * [Create Repository](https://help.github.com/articles/creating-a-new-repository/)

API Access
  * In order to communicate with the GitHub REST API, setup and obtain an API access token which will be utilized in the web service.  This allows GitHub to know it is communicating with an authorized user.
    * --steps 
  * Reference
    * [Access Tokens](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)

WebHook
  * In order to receive push notifications from GitHub, a webhook must be enabled within the organization.  This webhook contains the HTTP REST entry point for the web service to support the notification.  During configuration, you will be able to select which events will trigger the webhook integration.  For this web service, the Repository events are required.
    * --steps
  * Reference
    * Review the [Creating Webhook Help Page](https://developer.github.com/webhooks/creating/#setting-up-a-webhook) for additional information. 

Web Service
  * The web service is a node application hosted by a Docker container.  By default, the web service listens on HTTP port _3005_.  However, you can expose any port you would like and route it through the container configuration.
  * In addition to the port configuration, environment variables should be set to properly configure the service.
    * **ACTIONS** -Used to authorize which GitHub notification actions should be handled by the web service.  Pipe delimit (no spaces) the actions.  Available actions can be found at [Repository Events](https://developer.github.com/v3/activity/events/types/#repositoryevent)
	ACTIONS = deleted|created 
    * **AUDIT_REPO** - The full repository name to the GitHub organization repository that will be store the notification issues.  This found in the Configuration-->Organization steps above.
	AUDIT_REPO = GuarrdonOrg1/DeleteHistory 
    * **SECURITY_TOKEN** - Environment variable used to store the api key obtained from Configuration-->API Access steps above
	SECURITY_TOKEN = aaa1bbb2ccc3ddd4eee5fff6ggg7
    * **AUDIT_USER**  - Any users to mention in the body of the issue 
	AUDIT_USER=@Guarrdon
  * Docker
    * There are a few cloud providers and management tools to choose to support your Docker instance (AWS EC2, Kubernetes, Portainer, …).  Please review documentation specific to those platforms to execute the web service container.
    * The Docker image is currently published to the public Docker Hub at **guarrdon/githubchangehandler**.
    * When using a separate manage tool, the required environment variable are typically set from the user interface or in a .yaml configuration file.
    * To run your container directly from the Docker console, run the following command.  Note, the environment variables - denoted with -e - will need to be configured with the organization specific information.  Additionally, this example supports both the deleted and created actions.
```{r, engine='bash', docker_run}
docker run --name githubchangehandler -d -e ACTIONS="deleted|created" -e AUDIT_REPO="GuarrdonOrg1/DeleteHistory" -e SECURITY_TOKEN="aaa1bbb2ccc3ddd4eee5fff6ggg7" -e AUDIT_USER="@Guarrdon" -p 3005:3005 guarrdon/githubchangehandler 
```

### Execution

The web service exposes two methods:
  * **POST  /api/github/changeRepoHandler**
    * Used by the GitHub webhook to 
    * Incoming parameters - Request payload from GitHub notification webhook
    * Success
      * _HTTP 200_ Successful process and issue push.
      * _HTTP 202_ Ping accepted but does not process.
      * _HTTP 202_ Actions not suported.
    * Errors
      * _HTTP 400_ GitHub repository cannot be null.
      * _HTTP 400_ invalid arguments.
      * _HTTP 500_ Configuration invalid.
      * _HTTP 500_ Failed to push issue.
  
  * **GET  /api/getDate**
    * Used for testing to ensure the service is up and running
    * There are no parameters required and will return the current date and time
    * Once the service is running, any webserver can access this test method

## End to End Tests

Once GitHub webhook is created, a ping request is sent to the notification URL.  If The service is configured properly, the ping will respond with an _HTTP 202_ response.  You can view these ping operations, as well as the last few action notifications that were delivered in the webhook settings --> recent deliveries area.  In the event you would like to replay the notification request, press the Redeliver button and the request will attempt to process again.  The result will post in the response tab.  A response other than that of _HTTP 200_ for a correctly configured action and _HTTP 202_ for a ping are exceptions and require additional troubleshooting.

## Authors

* **Matt Lyons aka Guarrdon**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
