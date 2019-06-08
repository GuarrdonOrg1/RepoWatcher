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
const repoChangeManager_1 = require("../src/domain/repoChangeManager");
const UpdateActionRequests = require("../src/domain/updateRepoActionRequest");
const Errors = require("../src/errors/errors");
describe('Get Issues Url (Indepedent Tests)', () => {
    test('Invalid configuration - missing authentication token', () => __awaiter(this, void 0, void 0, function* () {
        const mgr = new repoChangeManager_1.default();
        yield expect(mgr.GetIssueUrl(null)).rejects.toThrowError(Errors.InvalidIssueConfigurationError);
    }));
});
describe('Get Issues Url', () => {
    test('Invalid request - missing org repo url', () => __awaiter(this, void 0, void 0, function* () {
        require('dotenv').config();
        const changeRequest = new UpdateActionRequests.UpdateRepoActionRequest('created', 'ds', 'ds', new Date());
        const issueRequest = new UpdateActionRequests.PushIssueRequest(changeRequest, null);
        const mgr = new repoChangeManager_1.default();
        yield expect(mgr.GetIssueUrl(null)).rejects.toThrowError(Errors.InvalidHandleRepoActionArgumentsError);
    }));
});
