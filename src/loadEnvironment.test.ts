import "./loadEnvironment.js";

describe("Given the loadEnvironment", () => {
  describe("When the dotenv.config() function is called", () => {
    test("Then it should load the environment variables", () => {
      const mongoExpectedEnvironmentVariable =
        process.env.MONGODB_URL_CONNECTION;

      expect(mongoExpectedEnvironmentVariable).toBeDefined();
    });
  });
});
