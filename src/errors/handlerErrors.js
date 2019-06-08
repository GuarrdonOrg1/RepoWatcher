"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidRepoError extends Error {
    constructor() {
        super('GitHub repository cannot be null.');
    }
}
exports.InvalidRepoError = InvalidRepoError;
class InvalidHandleRepoActionArgumentsError extends Error {
    constructor(request) {
        super(`Arguments cannot be missing\n${JSON.stringify(request)}`);
    }
}
exports.InvalidHandleRepoActionArgumentsError = InvalidHandleRepoActionArgumentsError;
class InvalidAuditActionError extends Error {
    constructor(actions) {
        super(`Only ${actions.join('|')} are supported actions to audit.`);
    }
}
exports.InvalidAuditActionError = InvalidAuditActionError;
