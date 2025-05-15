// ��������� ������������ index.test.js
const originalModule = jest.requireActual('express');

// ������� �������-�������� � ������� jest.fn()
const mockApp = {
  use: jest.fn(),
  listen: jest.fn(() => {})
};

// ������� mock ��� express
jest.mock('express', () => {
  return jest.fn(() => mockApp);
});

jest.mock('cors', () => jest.fn());
jest.mock('dotenv', () => ({
  config: jest.fn()
}));
jest.mock('../routes/books', () => 'books-routes');
jest.mock('../db', () => ({}));

// ����������� index.js ����� ���� �����
require('../index');

describe('Server Setup', () => {
  test('Express ������ ���� ������', () => {
    const express = require('express');
    expect(express).toHaveBeenCalled();
  });
  
  test('app.use ������ ���� ������ � cors', () => {
    expect(mockApp.use).toHaveBeenCalled();
  });
  
  test('app.listen ������ ���� ������', () => {
    expect(mockApp.listen).toHaveBeenCalled();
  });
});