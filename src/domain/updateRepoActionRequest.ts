export class UpdateRepoActionRequest {

    action: string;
    fullRepoName: string;
    orgReposUrl: string;
    changeDate:Date;

    constructor(action: string, fullRepoName: string, orgReposUrl: string, changeDate:Date) {
        this.action = action;
        this.fullRepoName = fullRepoName;
        this.orgReposUrl = orgReposUrl;
        this.changeDate = changeDate;
    }

}   

export class PushIssueRequest extends UpdateRepoActionRequest {

    issueUrl:string;

    constructor(baseRequest: UpdateRepoActionRequest, issueUrl:string) {
        super(baseRequest.action, baseRequest.fullRepoName, baseRequest.orgReposUrl, baseRequest.changeDate);
        this.issueUrl = issueUrl;
    }
}