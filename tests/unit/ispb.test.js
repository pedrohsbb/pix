const { normalizeIspb } = require('../../src/ispb');

test('normalize pads correctly', () => {
  expect(normalizeIspb(123)).toBe('00000123');
});