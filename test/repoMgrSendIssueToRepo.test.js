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
describe('Send Issue To Repo (Indepedent Tests)', () => {
    test('Invalid configuration - missing authentication token', () => __awaiter(this, void 0, void 0, function* () {
        const mgr = new repoChangeManager_1.default();
        yield expect(mgr.SendIssueToRepo(null)).rejects.toThrowError(Errors.InvalidIssueConfigurationError);
    }));
});
describe('Send Issue To Repo', () => {
    test('Invalid request', () => __awaiter(this, void 0, void 0, function* () {
        require('dotenv').config();
        const mgr = new repoChangeManager_1.default();
        yield expect(mgr.SendIssueToRepo(null)).rejects.toThrowError(Errors.InvalidHandleRepoActionArgumentsError);
    }));
    test('Invalid request - missing action', () => __awaiter(this, void 0, void 0, function* () {
        require('dotenv').config();
        const changeRequest = new UpdateActionRequests.UpdateRepoActionRequest('', 'ds', 'ds', new Date());
        const issueRequest = new UpdateActionRequests.PushIssueRequest(changeRequest, 'ds');
        const mgr = new repoChangeManager_1.default();
        yield expect(mgr.SendIssueToRepo(issueRequest)).rejects.toThrowError(Errors.InvalidHandleRepoActionArgumentsError);
    }));
    test('Invalid request - missing full repo name', () => __awaiter(this, void 0, void 0, function* () {
        require('dotenv').config();
        const changeRequest = new UpdateActionRequests.UpdateRepoActionRequest('created', '', 'ds', new Date());
        const issueRequest = new UpdateActionRequests.PushIssueRequest(changeRequest, 'ds');
        const mgr = new repoChangeManager_1.default();
        yield expect(mgr.SendIssueToRepo(issueRequest)).rejects.toThrowError(Errors.InvalidHandleRepoActionArgumentsError);
    }));
    test('Invalid request - missing issue url', () => __awaiter(this, void 0, void 0, function* () {
        require('dotenv').config();
        const changeRequest = new UpdateActionRequests.UpdateRepoActionRequest('created', 'ds', 'ds', new Date());
        const issueRequest = new UpdateActionRequests.PushIssueRequest(changeRequest, null);
        const mgr = new repoChangeManager_1.default();
        yield expect(mgr.SendIssueToRepo(issueRequest)).rejects.toThrowError(Errors.InvalidHandleRepoActionArgumentsError);
    }));
    test('Invalid request - missing change date', () => __awaiter(this, void 0, void 0, function* () {
        require('dotenv').config();
        const changeRequest = new UpdateActionRequests.UpdateRepoActionRequest('created', 'ds', 'ds', null);
        const issueRequest = new UpdateActionRequests.PushIssueRequest(changeRequest, 'ds');
        const mgr = new repoChangeManager_1.default();
        yield expect(mgr.SendIssueToRepo(issueRequest)).rejects.toThrowError(Errors.InvalidHandleRepoActionArgumentsError);
    }));
});
