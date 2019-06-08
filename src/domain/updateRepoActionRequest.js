"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UpdateRepoActionRequest {
    constructor(action, fullRepoName, orgReposUrl, changeDate) {
        this.action = action;
        this.fullRepoName = fullRepoName;
        this.orgReposUrl = orgReposUrl;
        this.changeDate = changeDate;
    }
}
exports.UpdateRepoActionRequest = UpdateRepoActionRequest;
class PushIssueRequest extends UpdateRepoActionRequest {
    constructor(baseRequest, issueUrl) {
        super(baseRequest.action, baseRequest.fullRepoName, baseRequest.orgReposUrl, baseRequest.changeDate);
        this.issueUrl = issueUrl;
    }
}
exports.PushIssueRequest = PushIssueRequest;
