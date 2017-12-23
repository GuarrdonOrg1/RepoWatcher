import RepoChangeManager from '../src/domain/repoChangeManager'
import * as UpdateActionRequests from '../src/domain/updateRepoActionRequest';
import * as Errors from '../src/errors/errors';


describe('Handle Repo Action', () => {
    
    test('Invalid request', async () => {
        const mgr = new RepoChangeManager();
        await expect(mgr.HandleRepoAction(null)).rejects.toThrowError(Errors.InvalidHandleRepoActionArgumentsError);
    });

    test('Invalid request - missing action', async () => {
        const request = new UpdateActionRequests.UpdateRepoActionRequest('', 'ds', 'ds', new Date());
        const mgr = new RepoChangeManager();
        await expect(mgr.HandleRepoAction(request)).rejects.toThrowError(Errors.InvalidHandleRepoActionArgumentsError);
    });

    test('Invalid request - missing full repo name', async () => {
        const request = new UpdateActionRequests.UpdateRepoActionRequest('created', '', 'ds', new Date());
        const mgr = new RepoChangeManager();
        await expect(mgr.HandleRepoAction(request)).rejects.toThrowError(Errors.InvalidHandleRepoActionArgumentsError);
    });

    test('Invalid request - missing orgs repo url', async () => {
        const request = new UpdateActionRequests.UpdateRepoActionRequest('created', 'ds', '', new Date());
        const mgr = new RepoChangeManager();
        await expect(mgr.HandleRepoAction(request)).rejects.toThrowError(Errors.InvalidHandleRepoActionArgumentsError);
    });

    test('Invalid request - missing change date', async () => {
        const request = new UpdateActionRequests.UpdateRepoActionRequest('created', 'ds', 'ds', null);
        const mgr = new RepoChangeManager();
        await expect(mgr.HandleRepoAction(request)).rejects.toThrowError(Errors.InvalidHandleRepoActionArgumentsError);
    });

    test('Invalid action', async () => {
        require('dotenv').config();
        const request = new UpdateActionRequests.UpdateRepoActionRequest('written', 'ds', 'ds', new Date());
        const mgr = new RepoChangeManager();
        await expect(mgr.HandleRepoAction(request)).rejects.toThrowError(Errors.InvalidAuditActionError);
    });

});
