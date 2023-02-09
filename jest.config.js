module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  // coverageThreshold: {
  //   global: {
  //     lines: 75,
  //   },
  // },
  globalSetup: '<rootDir>/jest.setup.ts',
  globalTeardown: '<rootDir>/jest.teardown.ts',
  verbose: false,
  watchAll: false,
}
