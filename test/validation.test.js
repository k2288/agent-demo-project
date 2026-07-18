import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateUsername, validatePassword, validateLoginForm } from '../src/validation.js';

test('validateUsername rejects empty username', () => {
  assert.equal(validateUsername(''), 'Username is required.');
  assert.equal(validateUsername('   '), 'Username is required.');
});

test('validateUsername rejects too short username', () => {
  assert.equal(validateUsername('ab'), 'Username must be at least 3 characters.');
});

test('validateUsername rejects too long username', () => {
  assert.equal(validateUsername('a'.repeat(21)), 'Username must be no more than 20 characters.');
});

test('validateUsername rejects invalid characters', () => {
  assert.equal(
    validateUsername('bad name!'),
    'Username may only contain letters, numbers, and underscores.'
  );
});

test('validateUsername accepts a valid username', () => {
  assert.equal(validateUsername('valid_user1'), null);
});

test('validatePassword rejects empty password', () => {
  assert.equal(validatePassword(''), 'Password is required.');
});

test('validatePassword rejects too short password', () => {
  assert.equal(validatePassword('abc123'), 'Password must be at least 8 characters.');
});

test('validatePassword rejects password missing a number', () => {
  assert.equal(
    validatePassword('longenoughpassword'),
    'Password must contain at least one letter and one number.'
  );
});

test('validatePassword rejects password missing a letter', () => {
  assert.equal(
    validatePassword('12345678'),
    'Password must contain at least one letter and one number.'
  );
});

test('validatePassword accepts a valid password', () => {
  assert.equal(validatePassword('goodpass1'), null);
});

test('validateLoginForm aggregates field errors', () => {
  const result = validateLoginForm({ username: '', password: '' });
  assert.equal(result.username, 'Username is required.');
  assert.equal(result.password, 'Password is required.');
});

test('validateLoginForm returns null errors for valid input', () => {
  const result = validateLoginForm({ username: 'valid_user1', password: 'goodpass1' });
  assert.equal(result.username, null);
  assert.equal(result.password, null);
});
