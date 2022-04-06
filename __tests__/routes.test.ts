import supertest from 'supertest';
import fs from 'fs/promises';

import app from '../src/app';

describe('Endpoints tests', () => {
  test('GET Request: All balances', () => {
    return supertest(app)
    .get('/balance')
    .expect(200)
    .expect('Content-Type', /json/)
  });
});
