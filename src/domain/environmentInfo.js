"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EnvironmentInfo {
    static get approvedActions() {
        if (process.env.ACTIONS)
            return process.env.ACTIONS.split('|');
        else
            return new Array();
    }
    static get auditRepo() {
        return process.env.AUDIT_REPO;
    }
    static get securityToken() {
        return process.env.SECURITY_TOKEN;
    }
    static get auditUser() {
        return process.env.AUDIT_USER;
    }
    constructor() {
    }
}
exports.default = EnvironmentInfo;
