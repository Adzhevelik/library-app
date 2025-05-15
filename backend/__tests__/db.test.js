const { Pool } = require('pg');

// �������� ������ 'pg' �� ��� �������
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
    on: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('Database Module', () => {
  let pool;
  let originalEnv;

  beforeEach(() => {
    // ��������� ������������ ���������� ���������
    originalEnv = process.env;
    
    // ������������� �������� ���������� ���������
    process.env = {
      ...originalEnv,
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_NAME: 'testdb',
      DB_USER: 'testuser',
      DB_PASSWORD: 'testpassword'
    };
    
    // ������� ��� ��� ������ db
    jest.resetModules();
    
    // ����������� ������ db (������� ����� ������������ ������������ Pool)
    pool = require('../db');
  });

  afterEach(() => {
    // ��������������� ������������ ���������� ���������
    process.env = originalEnv;
  });

  it('������ ��������� ��������� Pool � ����������� �����������', () => {
    expect(Pool).toHaveBeenCalledWith({
      host: 'localhost',
      port: '5432',
      database: 'testdb',
      user: 'testuser',
      password: 'testpassword'
    });
  });

  it('������ �������������� ��������� pool', () => {
    expect(pool).toBeDefined();
    expect(pool.query).toBeDefined();
  });
});