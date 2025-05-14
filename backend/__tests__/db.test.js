const { Pool } = require('pg');

// Мокируем модуль 'pg' до его импорта
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
    // Сохраняем оригинальные переменные окружения
    originalEnv = process.env;
    
    // Устанавливаем тестовые переменные окружения
    process.env = {
      ...originalEnv,
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_NAME: 'testdb',
      DB_USER: 'testuser',
      DB_PASSWORD: 'testpassword'
    };
    
    // Очищаем кэш для модуля db
    jest.resetModules();
    
    // Импортируем модуль db (который будет использовать мокированный Pool)
    pool = require('../db');
  });

  afterEach(() => {
    // Восстанавливаем оригинальные переменные окружения
    process.env = originalEnv;
  });

  it('должен создавать экземпляр Pool с правильными параметрами', () => {
    expect(Pool).toHaveBeenCalledWith({
      host: 'localhost',
      port: '5432',
      database: 'testdb',
      user: 'testuser',
      password: 'testpassword'
    });
  });

  it('должен экспортировать экземпляр pool', () => {
    expect(pool).toBeDefined();
    expect(pool.query).toBeDefined();
  });
});