import { filterAndSortProducts } from '../logic';
import axios from 'axios';
jest.mock('axios');

import { fetchLongPosts } from '../work-with-api';

import mongoose from 'mongoose';
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    Schema: actualMongoose.Schema,
    model: jest.fn().mockReturnValue({
      create: jest.fn(),
      aggregate: jest.fn().mockResolvedValue([{ email: 'duplicate@example.com' }]),
    }),
    connect: jest.fn(),
    disconnect: jest.fn(),
  };
});

import { manageUsers } from '../work-with-mongodb';
import request from 'supertest';
import app from '../users-api';

import { fetchAll } from '../asynchonus-development';

jest.mock('redis', () => {
  const redisMock = require('redis-mock');
  return {
    createClient: () => {
      const client = redisMock.createClient();
      client.connect = jest.fn();
      client.disconnect = jest.fn();
      return client;
    },
  };
});

import { manageRedis } from '../work-with-redis';

let server;

beforeAll(() => {
  server = app.listen(4000);
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (server) {
    server.close();
  }
});

test('filterAndSortProducts should return unique products sorted by price', () => {
  const products = [
    { name: 'A', price: 30 },
    { name: 'B', price: 20 },
    { name: 'A', price: 30 },
    { name: 'C', price: 10 },
  ];

  const result = filterAndSortProducts(products);

  const expected = [
    { name: 'C', price: 10 },
    { name: 'B', price: 20 },
    { name: 'A', price: 30 },
  ];

  expect(result).toEqual(expected);
});

test('fetchLongPosts should return posts longer than 100 characters', async () => {
  const longBody = 'A long body that truly exceeds one hundred characters. Lorem ipsum dolor sit amet, consectetur adipiscing elit!!!';
  axios.get.mockResolvedValue({
    data: [
      { id: 1, userId: 1, title: 'Post 1', body: 'Short body' },
      { id: 2, userId: 1, title: 'Post 2', body: longBody },
    ],
  });

  const result = await fetchLongPosts();
  expect(result).toEqual([
    { id: 2, userId: 1, title: 'Post 2', body: longBody },
  ]);
});

test('manageUsers should find users with duplicate emails', async () => {
  const result = await manageUsers();
  expect(result).toEqual([{ email: 'duplicate@example.com' }]);
});

test('POST /user and GET /users should work correctly', async () => {
  await request(server).post('/user').send({ name: 'John' }).expect(201);

  const result = await request(server).get('/users').expect(200);
  expect(result.body).toEqual([{ name: 'John' }]);
});

test('fetchAll should fetch data from multiple URLs in parallel', async () => {
  axios.get.mockResolvedValueOnce({ data: 'Result 1', status: 200 });
  axios.get.mockResolvedValueOnce({ data: 'Result 2', status: 200 });

  const urls = ['url1', 'url2'];
  const result = await fetchAll(urls);

  expect(result).toEqual([
    { data: 'Result 1', status: 200 },
    { data: 'Result 2', status: 200 },
  ]);
});

test('manageRedis should save and retrieve keys', async () => {
  await manageRedis();
});
