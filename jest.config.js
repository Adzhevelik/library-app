module.exports = {
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/src/mocks/styleMock.js",
    "\\.(gif|ttf|eot|svg)$": "<rootDir>/src/mocks/fileMock.js"
  },
  testEnvironment: "jsdom"
};
