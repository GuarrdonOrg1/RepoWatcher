import * as express from 'express';
import RepoChangeManager from '../domain/repoChangeManager'
import * as UpdateActionRequests from '../domain/updateRepoActionRequest';
import * as Errors from '../errors/errors';

export default class ApiRouter {

    public static configure(app: express.Application) {

        /**
         * @api {post} /api/github/changeRepoHandler Handler for Github Repo Change Notifications
         * @apiName GitHubRepoChangeHandler
         *
         * @apiParam {string} req Payload from GitHub notification webhook
         * 
         * @apiSuccess 200 Successful process and issue push.
         * @apiSuccess 202 Ping accepted but does not process.
         * @apiSuccess 202 Actions not suported.
         *
         * @apiError InvalidRepo 400 GitHub repository cannot be null.
         * @apiError InvalidHandleRepoActionArgumentsError 400 invalid arguments.
         * @apiError InvalidIssueConfigurationError 500 Configuration invalid.
         * @apiError IssuePushError 500 Failed to push issue.
         */
        app.post('/api/github/changeRepoHandler', async function (req, res) {
            try {
                const eventHead = req.get('X-GitHub-Event');

                //handle ping events
                if (eventHead == 'ping') {
                    res.status(202).send(`Ping received and accepted, but no further action will be taken.`);
                }
                //handle potential valid process
                else if (eventHead == 'repository') {

                    const payload = req.body;
                    //ensure valid payload
                    if (!payload)
                        res.status(400).send('Empty payload in request.');
                    else {

                        //build valid request for domain handler
                        const request = new UpdateActionRequests.UpdateRepoActionRequest(
                            payload.action,
                            payload.repository.full_name,
                            payload.organization.repos_url,
                            payload.repository.updated_at);

                        //process change in domain handler
                        const mgr = new RepoChangeManager();
                        const result = await mgr.HandleRepoAction(request);

                        //if no issues, return successful result
                        console.log(`Success - ${result}`);
                        res.status(200).send(result);
                    }
                }
                //Handle erronant requests with incorrect header event type
                else {
                    res.status(501).send(`Header event '${eventHead}' is not accepted at this time.`);
                }

            } catch (error) {
                console.log(error.message);
                if (error instanceof Errors.InvalidAuditActionError)
                    res.status(202).send(`Received notification, but further processing was not allowd.\n${error.message}`)
                else if (error instanceof Errors.InvalidHandleRepoActionArgumentsError || error instanceof Errors.InvalidRepoError)
                    res.status(400).send({ error: error.message });
                else if (error instanceof Errors.InvalidIssueConfigurationError || error instanceof Errors.IssuePushError)
                    res.status(500).send({ error: error.message });
                else
                    res.status(500).send({ error: 'Unknown server error.' });
            }
        });


        app.get('/api/getDate', function (req, res) {
            const nowString = 'date is ' + (new Date().toString());
            console.log(nowString);
            res.send(nowString);
        });

    }
}




