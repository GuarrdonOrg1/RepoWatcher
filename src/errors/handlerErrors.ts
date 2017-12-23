import * as UpdateActionRequests from "../domain/updateRepoActionRequest";

export class InvalidRepoError extends Error {
    constructor() {
        super('GitHub repository cannot be null.'); 
    }
}
export class InvalidHandleRepoActionArgumentsError extends Error {
    constructor(request:UpdateActionRequests.UpdateRepoActionRequest) {
        super(`Arguments cannot be missing\n${JSON.stringify(request)}`); 
    }
}

export class InvalidAuditActionError extends Error {
    constructor(actions: string[]) {
        super(`Only ${actions.join('|')} are supported actions to audit.`); 
    }
}
