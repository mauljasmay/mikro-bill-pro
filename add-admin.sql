INSERT INTO users (id, username, name, email, password, role, status, balance, createdAt, updatedAt)
VALUES (
  'admin-' || lower(hex(randomblob(4))),
  'maulmlj',
  'Admin User',
  'admin@mikrobill.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjYQmHqU1G6', -- hashed password for '110519'
  'ADMIN',
  'ACTIVE',
  0,
  datetime('now'),
  datetime('now')
);
