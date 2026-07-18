const {
  validateUsername,
  validatePassword,
  validateLoginForm
} = require('../src/validation');

describe('validateUsername', () => {
  test('rejects empty username', () => {
    expect(validateUsername('')).toMatch(/required/i);
    expect(validateUsername('   ')).toMatch(/required/i);
    expect(validateUsername(undefined)).toMatch(/required/i);
  });

  test('rejects username shorter than minimum length', () => {
    expect(validateUsername('ab')).toMatch(/at least/i);
  });

  test('rejects username longer than maximum length', () => {
    expect(validateUsername('a'.repeat(21))).toMatch(/at most/i);
  });

  test('rejects username with invalid characters', () => {
    expect(validateUsername('bad user!')).toMatch(/letters, numbers/i);
  });

  test('accepts a valid username', () => {
    expect(validateUsername('john_doe.1')).toBeNull();
  });
});

describe('validatePassword', () => {
  test('rejects empty password', () => {
    expect(validatePassword('')).toMatch(/required/i);
    expect(validatePassword(undefined)).toMatch(/required/i);
  });

  test('rejects password shorter than minimum length', () => {
    expect(validatePassword('ab1')).toMatch(/at least/i);
  });

  test('rejects password with no letters', () => {
    expect(validatePassword('12345678')).toMatch(/letter/i);
  });

  test('rejects password with no numbers', () => {
    expect(validatePassword('abcdefgh')).toMatch(/number/i);
  });

  test('accepts a valid password', () => {
    expect(validatePassword('abcd1234')).toBeNull();
  });
});

describe('validateLoginForm', () => {
  test('returns invalid with both field errors when fields are empty', () => {
    const result = validateLoginForm({ username: '', password: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.username).toBeTruthy();
    expect(result.errors.password).toBeTruthy();
  });

  test('returns valid with no errors for correct input', () => {
    const result = validateLoginForm({ username: 'john_doe', password: 'abcd1234' });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  test('handles missing fields object', () => {
    const result = validateLoginForm();
    expect(result.valid).toBe(false);
  });
});
