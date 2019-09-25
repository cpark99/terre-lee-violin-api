BEGIN;

TRUNCATE
  tlv_users
  RESTART IDENTITY CASCADE;

INSERT INTO tlv_users (
  email,
  password,
  name,
  next_lesson,
  amount_due
) VALUES
  ('violin@demo.com',
  '$2a$12$C7YA3Eav2k44c5bmRhOZXesNmw8fYXAaBggk78GeVTyIU6XcgM26m',
  'Jane Doe',
  '10/1',
  '40'
  );

INSERT INTO tlv_applications (
  name,
  email,
  phone,
  message
) VALUES
  ('Jane Doe',
  'violin@demo.com',
  '8888888888',
  'I have always wanted to learn!'
  );

COMMIT;
