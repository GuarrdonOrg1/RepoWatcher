export class InvalidIssueConfigurationError extends Error {
    constructor() {
        super('Configurations for issue repository are invalid.'); 
    }
}

export class IssuePushError extends Error {
    constructor() {
        super('Failed to push issue to repository.'); 
    }
}
