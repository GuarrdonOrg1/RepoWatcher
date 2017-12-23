import RepoChangeManager from '../src/domain/repoChangeManager'
import * as UpdateActionRequests from '../src/domain/updateRepoActionRequest';
import * as Errors from '../src/errors/errors';


describe('Send Issue To Repo (Indepedent Tests)', () => {

    test('Invalid configuration - missing authentication token', async () => {
        const mgr = new RepoChangeManager();
        await expect(mgr.SendIssueToRepo(null)).rejects.toThrowError(Errors.InvalidIssueConfigurationError);
    });
});

describe('Send Issue To Repo', () => {
     
    test('Invalid request', async () => {
        require('dotenv').config();
        const mgr = new RepoChangeManager();
        await expect(mgr.SendIssueToRepo(null)).rejects.toThrowError(Errors.InvalidHandleRepoActionArgumentsError);
    });

    test('Invalid request - missing action', async () => {
        require('dotenv').config();
        const changeRequest = new UpdateActionRequests.UpdateRepoActionRequest('', 'ds', 'ds', new Date());
        const issueRequest = new UpdateActionRequests.PushIssueRequest(changeRequest, 'ds');
        const mgr = new RepoChangeManager();
        await expect(mgr.SendIssueToRepo(issueRequest)).rejects.toThrowError(Errors.InvalidHandleRepoActionArgumentsError);
    });

    test('Invalid request - missing full repo name', async () => {
        require('dotenv').config();
        const changeRequest = new UpdateActionRequests.UpdateRepoActionRequest('created', '', 'ds', new Date());
        const issueRequest = new UpdateActionRequests.PushIssueRequest(changeRequest, 'ds');
        const mgr = new RepoChangeManager();
        await expect(mgr.SendIssueToRepo(issueRequest)).rejects.toThrowError(Errors.InvalidHandleRepoActionArgumentsError);
    });

    test('Invalid request - missing issue url', async () => {
        require('dotenv').config();
        const changeRequest = new UpdateActionRequests.UpdateRepoActionRequest('created', 'ds', 'ds', new Date());
        const issueRequest = new UpdateActionRequests.PushIssueRequest(changeRequest, null);
        const mgr = new RepoChangeManager();
        await expect(mgr.SendIssueToRepo(issueRequest)).rejects.toThrowError(Errors.InvalidHandleRepoActionArgumentsError);
    });

    test('Invalid request - missing change date', async () => {
        require('dotenv').config();
        const changeRequest = new UpdateActionRequests.UpdateRepoActionRequest('created', 'ds', 'ds', null);
        const issueRequest = new UpdateActionRequests.PushIssueRequest(changeRequest, 'ds');
        const mgr = new RepoChangeManager();
        await expect(mgr.SendIssueToRepo(issueRequest)).rejects.toThrowError(Errors.InvalidHandleRepoActionArgumentsError);
    });

});