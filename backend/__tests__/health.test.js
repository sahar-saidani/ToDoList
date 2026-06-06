import { jest, describe, it, expect } from '@jest/globals';
import request from 'supertest';

jest.mock('../database/db.js', () => ({
  default: {
    authenticate: jest.fn().mockResolvedValue(true),
    define: jest.fn(),
  },
}));

jest.mock('../models/BlogModel.js', () => ({
  default: {
    sync: jest.fn().mockResolvedValue(true),
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({ id: 1, title: 'test', content: 'test' }),
    destroy: jest.fn().mockResolvedValue(1),
  },
}));

describe('GET /health', () => {
  it('returns 200 and status ok', async () => {
    const { app } = await import('../app.js');
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});