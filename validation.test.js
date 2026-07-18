const { validateUsername, validatePassword, validateLoginForm } = require("./validation");

describe("validateUsername", () => {
  test("rejects empty username", () => {
    expect(validateUsername("")).toMatch(/required/i);
  });

  test("rejects whitespace-only username", () => {
    expect(validateUsername("   ")).toMatch(/required/i);
  });

  test("rejects username shorter than 3 characters", () => {
    expect(validateUsername("ab")).toMatch(/at least 3/i);
  });

  test("accepts a valid username", () => {
    expect(validateUsername("alice")).toBeNull();
  });
});

describe("validatePassword", () => {
  test("rejects empty password", () => {
    expect(validatePassword("")).toMatch(/required/i);
  });

  test("rejects password shorter than 8 characters", () => {
    expect(validatePassword("short1")).toMatch(/at least 8/i);
  });

  test("accepts a valid password", () => {
    expect(validatePassword("longenoughpassword")).toBeNull();
  });
});

describe("validateLoginForm", () => {
  test("returns errors for both fields when both are invalid", () => {
    const result = validateLoginForm({ username: "", password: "" });
    expect(result.username).not.toBeNull();
    expect(result.password).not.toBeNull();
  });

  test("returns no errors when both fields are valid", () => {
    const result = validateLoginForm({ username: "alice", password: "longenoughpassword" });
    expect(result.username).toBeNull();
    expect(result.password).toBeNull();
  });
});
