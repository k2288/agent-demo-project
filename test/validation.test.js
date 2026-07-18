const test = require("node:test");
const assert = require("node:assert/strict");
const { validateUsername, validatePassword, validateForm } = require("../js/validation.js");

test("validateUsername rejects empty username", () => {
  assert.match(validateUsername(""), /required/);
  assert.match(validateUsername("   "), /required/);
});

test("validateUsername rejects username shorter than 3 characters", () => {
  assert.match(validateUsername("ab"), /at least 3/);
});

test("validateUsername rejects username longer than 30 characters", () => {
  assert.match(validateUsername("a".repeat(31)), /at most 30/);
});

test("validateUsername rejects invalid characters", () => {
  assert.match(validateUsername("bad name!"), /may only contain/);
});

test("validateUsername accepts a valid username", () => {
  assert.equal(validateUsername("john_doe.1"), null);
});

test("validatePassword rejects empty password", () => {
  assert.match(validatePassword(""), /required/);
});

test("validatePassword rejects password shorter than 8 characters", () => {
  assert.match(validatePassword("ab1"), /at least 8/);
});

test("validatePassword rejects password without a number", () => {
  assert.match(validatePassword("longenoughpassword"), /letter and one number/);
});

test("validatePassword rejects password without a letter", () => {
  assert.match(validatePassword("12345678"), /letter and one number/);
});

test("validatePassword accepts a valid password", () => {
  assert.equal(validatePassword("password1"), null);
});

test("validateForm returns errors for both fields when both are invalid", () => {
  const errors = validateForm({ username: "", password: "" });
  assert.ok(errors.username);
  assert.ok(errors.password);
});

test("validateForm returns no errors for valid input", () => {
  const errors = validateForm({ username: "john_doe", password: "password1" });
  assert.equal(errors.username, null);
  assert.equal(errors.password, null);
});
