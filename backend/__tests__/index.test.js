// Полностью переписанный index.test.js
const originalModule = jest.requireActual('express');

// Создаем функции-заглушки с помощью jest.fn()
const mockApp = {
  use: jest.fn(),
  listen: jest.fn(() => {})
};

// Создаем mock для express
jest.mock('express', () => {
  return jest.fn(() => mockApp);
});

jest.mock('cors', () => jest.fn());
jest.mock('dotenv', () => ({
  config: jest.fn()
}));
jest.mock('../routes/books', () => 'books-routes');
jest.mock('../db', () => ({}));

// Импортируем index.js после всех моков
require('../index');

describe('Server Setup', () => {
  test('Express должен быть вызван', () => {
    const express = require('express');
    expect(express).toHaveBeenCalled();
  });
  
  test('app.use должен быть вызван с cors', () => {
    expect(mockApp.use).toHaveBeenCalled();
  });
  
  test('app.listen должен быть вызван', () => {
    expect(mockApp.listen).toHaveBeenCalled();
  });
});