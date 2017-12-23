import RepoChangeManager from '../src/domain/repoChangeManager'
import * as UpdateActionRequests from '../src/domain/updateRepoActionRequest';
import * as Errors from '../src/errors/errors';


describe('Get Issues Url (Indepedent Tests)', () => {
    
    test('Invalid configuration - missing authentication token', async () => {
        const mgr = new RepoChangeManager();
        await expect(mgr.GetIssueUrl(null)).rejects.toThrowError(Errors.InvalidIssueConfigurationError);
    });
});

describe('Get Issues Url', () => {
    
    test('Invalid request - missing org repo url', async () => {
        require('dotenv').config();
        const changeRequest = new UpdateActionRequests.UpdateRepoActionRequest('created', 'ds', 'ds', new Date());
        const issueRequest = new UpdateActionRequests.PushIssueRequest(changeRequest, null);
        const mgr = new RepoChangeManager();
        await expect(mgr.GetIssueUrl(null)).rejects.toThrowError(Errors.InvalidHandleRepoActionArgumentsError);
    });

});