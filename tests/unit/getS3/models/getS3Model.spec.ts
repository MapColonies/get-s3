import jsLogger from '@map-colonies/js-logger';
import { GetS3Manager } from '../../../../src/getS3/models/getS3Manager';

let getS3Manager: GetS3Manager;

describe('GetS3Manager', () => {
  beforeEach(function () {
    getS3Manager = new GetS3Manager(jsLogger({ enabled: false }));
  });
  describe('#getList', () => {
    it('return the resource of id 1', function () {
      // action
      const resource = getS3Manager.getList({ description: 'meow', name: 'cat' });

      // expectation
      expect(resource.id).toBeLessThanOrEqual(100);
      expect(resource.id).toBeGreaterThanOrEqual(0);
      expect(resource).toHaveProperty('name', 'cat');
      expect(resource).toHaveProperty('description', 'meow');
    });
  });
});
