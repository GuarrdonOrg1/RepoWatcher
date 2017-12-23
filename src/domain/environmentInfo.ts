export default class EnvironmentInfo {

    static get approvedActions(): string[] {
        if (process.env.ACTIONS)
            return process.env.ACTIONS.split('|');
        else
            return new Array<string>();
    }

    static get auditRepo(): string {
        return process.env.AUDIT_REPO;
    }

    static get securityToken(): string {
        return process.env.SECURITY_TOKEN;
    }

    static get auditUser(): string {
        return process.env.AUDIT_USER;
    }

    constructor() {

    }

}    