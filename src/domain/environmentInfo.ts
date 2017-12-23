export default class EnvironmentInfo {

    static get approvedActions():string[] {
        return process.env.ACTIONS.split('|');
    }

    static get auditRepo():string {
        return process.env.AUDIT_REPO;
    }

    static get securityToken():string {
        return process.env.SECURITY_TOKEN;
    }

    static get auditUser():string {
        return process.env.AUDIT_USER;
    }

    constructor() {
       
    }

}    