"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidIssueConfigurationError extends Error {
    constructor() {
        super('Configurations for issue repository are invalid.');
    }
}
exports.InvalidIssueConfigurationError = InvalidIssueConfigurationError;
class IssuePushError extends Error {
    constructor() {
        super('Failed to push issue to repository.');
    }
}
exports.IssuePushError = IssuePushError;
