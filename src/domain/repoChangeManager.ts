import axios from 'axios';
import * as Errors from '../errors/errors';
import * as UpdateActionRequests from './updateRepoActionRequest';
import EnvironmentInfo from './environmentInfo';

export default class RepoChangeManager {

    constructor() { }


    /**
     * Async handler for changes to organization repository webhook notifications
     *
     * @param  {UpdateRepoActionRequest} request data parsed from incoming http request - action, repo name, change date, repo url
     * @return {string} success message for change processed
     * @public @async
     */
    public async HandleRepoAction(request: UpdateActionRequests.UpdateRepoActionRequest): Promise<string> {

        //invalid arguments
        if (!request || !request.action || !request.fullRepoName || !request.orgReposUrl || !request.changeDate)
            throw new Errors.InvalidHandleRepoActionArgumentsError(request);

        //only supported actions should continue
        if (EnvironmentInfo.approvedActions.indexOf(request.action) <= -1)
            throw new Errors.InvalidAuditActionError(EnvironmentInfo.approvedActions);

        //get api url for issue from org response
        let issueUrl = await this.GetIssueUrl(request);
        console.log(issueUrl);
        //push change detail to audit repo
        let updateAuditResult = await this.SendIssueToRepo(new UpdateActionRequests.PushIssueRequest(request, issueUrl));
        //return push issue results
        return updateAuditResult;
    }

    /**
     * Async method to retrieve issue url for organization audit repository
     *
     * @param  {UpdateRepoActionRequest} request data parsed from incoming http request - action, repo name, change date, repo url
     * @return {string} url of issue repo for organization audit
     * @public @async
     */
    public async GetIssueUrl(request: UpdateActionRequests.UpdateRepoActionRequest): Promise<string> {

        //invalid configuration
        if (!EnvironmentInfo.securityToken)
            throw new Errors.InvalidIssueConfigurationError();
        //invalid arguments
        if (!request || !request.orgReposUrl)
            throw new Errors.InvalidHandleRepoActionArgumentsError(request);

        //get all repos from org to test for one to use for audit
        const response = await axios.get(request.orgReposUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `token ${EnvironmentInfo.securityToken}`
            },
        });
        const data = response.data;
        console.log(data);
        if (response.status > 205)
            throw new Errors.IssuePushError();  //todo:fix this

        console.log(data.length);
        for (let i: number = 0; i < data.length; i++) {
            let repo = data[i];
            if (repo.full_name == EnvironmentInfo.auditRepo)
                return repo.issues_url.replace('{/number}', '');
        }

        //audit repo not available in this org
        throw new Errors.InvalidIssueConfigurationError();
    }

    /**
     * Async method to push new issue to audit repository in organization
     *
     * @param  {PushIssueRequest} request data parsed from incoming http request - action, repo name, change date, repo url, issue repo url
     * @return {string} success message for push of issue
     * @public @async
     */
    public async SendIssueToRepo(request: UpdateActionRequests.PushIssueRequest): Promise<string> {

        //invalid configuration
        if (!EnvironmentInfo.securityToken)
            throw new Errors.InvalidIssueConfigurationError();
        //invalid arguments
        if (!request || !request.action || !request.fullRepoName || !request.issueUrl || !request.changeDate)
            throw new Errors.InvalidHandleRepoActionArgumentsError(request);

        //build issue content
        const issueTitle = `Repository ${request.fullRepoName} was ${request.action}.`;
        const issueBody = `Repository **${request.fullRepoName}** has changed.\n  It was **_${request.action}_** at **${request.changeDate.toString()}**.\n ${EnvironmentInfo.auditUser} might be interested.`;

        //post issue to repository
        const response = await axios.post(request.issueUrl, { title: issueTitle, body: issueBody }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `token ${EnvironmentInfo.securityToken}`
            },
        });
        const data = response.data;
        if (response.status > 205)
            throw new Errors.IssuePushError();

        return `Successfully processed repository ${request.fullRepoName} ${request.action} event.`
    }

}


