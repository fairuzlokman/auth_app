import { normalizeEmail, validateEmail, validateName, validatePassword } from './validation';

describe('validateName', () => {
  it('rejects empty or whitespace-only input', () => {
    expect(validateName('')).toBe('Name is required.');
    expect(validateName('   ')).toBe('Name is required.');
  });

  it('rejects a single character', () => {
    expect(validateName('F')).toBe('Name must be at least 2 characters.');
  });

  it('accepts a real name', () => {
    expect(validateName('Fairuz')).toBeNull();
  });
});

describe('validateEmail', () => {
  it('requires a value', () => {
    expect(validateEmail('')).toBe('Email is required.');
  });

  it.each(['not-an-email', 'missing@domain', 'no-at-sign.com', 'two @spaces.com'])(
    'rejects %s',
    (input) => {
      expect(validateEmail(input)).toBe('Enter a valid email address.');
    }
  );

  it('accepts a well-formed address, ignoring surrounding whitespace', () => {
    expect(validateEmail('fairuz@example.com')).toBeNull();
    expect(validateEmail('  fairuz@example.com  ')).toBeNull();
  });
});

describe('validatePassword', () => {
  it('requires a value', () => {
    expect(validatePassword('')).toBe('Password is required.');
  });

  it('enforces the 6 character minimum', () => {
    expect(validatePassword('12345')).toBe('Password must be at least 6 characters.');
    expect(validatePassword('123456')).toBeNull();
  });

  it('does not trim — spaces are legitimate password characters', () => {
    expect(validatePassword('   a  ')).toBeNull();
  });
});

describe('normalizeEmail', () => {
  it('trims and lowercases so lookups match regardless of how it was typed', () => {
    expect(normalizeEmail('  Fairuz@Example.COM ')).toBe('fairuz@example.com');
  });
});
