module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  transform: {}, // Отключаем трансформации для Node.js
  verbose: true, // Включаем подробный вывод
  bail: true // Останавливаемся после первой ошибки
};