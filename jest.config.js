/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  moduleFileExtensions: ["js", "ts"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  verbose: true,
  transformIgnorePatterns: [`node_modules`]
}
