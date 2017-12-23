import EnvironmentInfo from '../src/domain/environmentInfo';

describe('Environment Setup', () => {
    test('Validate default environment variables', async () => {
        require('dotenv').config();
        expect(EnvironmentInfo.auditUser).toBe('@guarrdon');
    });
});

