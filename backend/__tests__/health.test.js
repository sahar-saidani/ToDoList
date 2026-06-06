import { jest } from '@jest/globals';

await jest.unstable_mockModule('../database/db.js', () => ({
  default: {
    authenticate: jest.fn().mockResolvedValue(true),
  },
}));

await jest.unstable_mockModule('../models/BlogModel.js', () => ({
  default: {
    sync: jest.fn().mockResolvedValue(true),
  },
}));

const request = (await import('supertest')).default;
const { app } = await import('../app.js');

describe('GET /health', () => {
  it('returns 200 and status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
