"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const Errors = require("../errors/errors");
const UpdateActionRequests = require("./updateRepoActionRequest");
const environmentInfo_1 = require("./environmentInfo");
class RepoChangeManager {
    constructor() { }
    /**
     * Async handler for changes to organization repository webhook notifications
     *
     * @param  {UpdateRepoActionRequest} request data parsed from incoming http request - action, repo name, change date, repo url
     * @return {string} success message for change processed
     * @public @async
     */
    HandleRepoAction(request) {
        return __awaiter(this, void 0, void 0, function* () {
            //invalid arguments
            if (!request || !request.action || !request.fullRepoName || !request.orgReposUrl || !request.changeDate)
                throw new Errors.InvalidHandleRepoActionArgumentsError(request);
            //only supported actions should continue
            if (environmentInfo_1.default.approvedActions.indexOf(request.action) <= -1)
                throw new Errors.InvalidAuditActionError(environmentInfo_1.default.approvedActions);
            //get api url for issue from org response
            let issueUrl = yield this.GetIssueUrl(request);
            console.log(issueUrl);
            //push change detail to audit repo
            let updateAuditResult = yield this.SendIssueToRepo(new UpdateActionRequests.PushIssueRequest(request, issueUrl));
            //return push issue results
            return updateAuditResult;
        });
    }
    /**
     * Async method to retrieve issue url for organization audit repository
     *
     * @param  {UpdateRepoActionRequest} request data parsed from incoming http request - action, repo name, change date, repo url
     * @return {string} url of issue repo for organization audit
     * @public @async
     */
    GetIssueUrl(request) {
        return __awaiter(this, void 0, void 0, function* () {
            //invalid configuration
            if (!environmentInfo_1.default.securityToken)
                throw new Errors.InvalidIssueConfigurationError();
            //invalid arguments
            if (!request || !request.orgReposUrl)
                throw new Errors.InvalidHandleRepoActionArgumentsError(request);
            //get all repos from org to test for one to use for audit
            const response = yield axios_1.default.get(request.orgReposUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `token ${environmentInfo_1.default.securityToken}`
                },
            });
            const data = response.data;
            console.log(data);
            if (response.status > 205)
                throw new Errors.IssuePushError(); //todo:fix this
            console.log(data.length);
            for (let i = 0; i < data.length; i++) {
                let repo = data[i];
                if (repo.full_name == environmentInfo_1.default.auditRepo)
                    return repo.issues_url.replace('{/number}', '');
            }
            //audit repo not available in this org
            throw new Errors.InvalidIssueConfigurationError();
        });
    }
    /**
     * Async method to push new issue to audit repository in organization
     *
     * @param  {PushIssueRequest} request data parsed from incoming http request - action, repo name, change date, repo url, issue repo url
     * @return {string} success message for push of issue
     * @public @async
     */
    SendIssueToRepo(request) {
        return __awaiter(this, void 0, void 0, function* () {
            //invalid configuration
            if (!environmentInfo_1.default.securityToken)
                throw new Errors.InvalidIssueConfigurationError();
            //invalid arguments
            if (!request || !request.action || !request.fullRepoName || !request.issueUrl || !request.changeDate)
                throw new Errors.InvalidHandleRepoActionArgumentsError(request);
            //build issue content
            const issueTitle = `Repository ${request.fullRepoName} was ${request.action}.`;
            const issueBody = `Repository **${request.fullRepoName}** has changed.\n  It was **_${request.action}_** at **${request.changeDate.toString()}**.\n ${environmentInfo_1.default.auditUser} might be interested.`;
            //post issue to repository
            const response = yield axios_1.default.post(request.issueUrl, { title: issueTitle, body: issueBody }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `token ${environmentInfo_1.default.securityToken}`
                },
            });
            const data = response.data;
            if (response.status > 205)
                throw new Errors.IssuePushError();
            return `Successfully processed repository ${request.fullRepoName} ${request.action} event.`;
        });
    }
}
exports.default = RepoChangeManager;
