import { describe, it, expect } from '@jest/globals';
import { getHasData } from './utils';

describe('utils', () => {
  describe('getHasData', () => {
    it('`[]` should return false', () => {
      expect(getHasData([])).toEqual(false);
    });

    it('`{}` should return false', () => {
      expect(getHasData({})).toEqual(false);
    });

    it('`undefined` should return false', () => {
      expect(getHasData(undefined)).toEqual(false);
    });

    it('`null` should return false', () => {
      expect(getHasData(null)).toEqual(false);
    });
  });
});
