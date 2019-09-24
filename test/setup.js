process.env.TZ = 'UTC';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_EXPIRY = '24h';

require('dotenv').config();

process.env.TEST_DB_URL =
  process.env.TEST_DB_URL || 'postgresql://terre-lee-violin:tlvs@localhost/terre-lee-violin-test';

const { expect } = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;
