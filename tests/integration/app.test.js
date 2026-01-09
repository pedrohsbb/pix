const request = require('supertest');
const { createApp } = require('../../src/app');

test('returns 200 for valid participant', async () => {
  const http = { get: jest.fn().mockResolvedValue({ data: [{ ispb: 123 }] }) };
  const app = createApp({ bcbUrl: 'http://example', httpClient: http });
  const res = await request(app).get('/pix/participants/00000123');
  expect(res.status).toBe(200);
});