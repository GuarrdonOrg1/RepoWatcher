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
describe('Handle Repo Action', () => {
    test('Invalid request', () => __awaiter(this, void 0, void 0, function* () {
        const mgr = new repoChangeManager_1.default();
        yield expect(mgr.HandleRepoAction(null)).rejects.toThrowError(Errors.InvalidHandleRepoActionArgumentsError);
    }));
    test('Invalid request - missing action', () => __awaiter(this, void 0, void 0, function* () {
        const request = new UpdateActionRequests.UpdateRepoActionRequest('', 'ds', 'ds', new Date());
        const mgr = new repoChangeManager_1.default();
        yield expect(mgr.HandleRepoAction(request)).rejects.toThrowError(Errors.InvalidHandleRepoActionArgumentsError);
    }));
    test('Invalid request - missing full repo name', () => __awaiter(this, void 0, void 0, function* () {
        const request = new UpdateActionRequests.UpdateRepoActionRequest('created', '', 'ds', new Date());
        const mgr = new repoChangeManager_1.default();
        yield expect(mgr.HandleRepoAction(request)).rejects.toThrowError(Errors.InvalidHandleRepoActionArgumentsError);
    }));
    test('Invalid request - missing orgs repo url', () => __awaiter(this, void 0, void 0, function* () {
        const request = new UpdateActionRequests.UpdateRepoActionRequest('created', 'ds', '', new Date());
        const mgr = new repoChangeManager_1.default();
        yield expect(mgr.HandleRepoAction(request)).rejects.toThrowError(Errors.InvalidHandleRepoActionArgumentsError);
    }));
    test('Invalid request - missing change date', () => __awaiter(this, void 0, void 0, function* () {
        const request = new UpdateActionRequests.UpdateRepoActionRequest('created', 'ds', 'ds', null);
        const mgr = new repoChangeManager_1.default();
        yield expect(mgr.HandleRepoAction(request)).rejects.toThrowError(Errors.InvalidHandleRepoActionArgumentsError);
    }));
    test('Invalid action', () => __awaiter(this, void 0, void 0, function* () {
        require('dotenv').config();
        const request = new UpdateActionRequests.UpdateRepoActionRequest('written', 'ds', 'ds', new Date());
        const mgr = new repoChangeManager_1.default();
        yield expect(mgr.HandleRepoAction(request)).rejects.toThrowError(Errors.InvalidAuditActionError);
    }));
});
