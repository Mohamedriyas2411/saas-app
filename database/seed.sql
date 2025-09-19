-- Seed data for testing
-- Insert test users (passwords are hashed for "password123")
INSERT INTO users (id, email, password, "firstName", "lastName", "emailVerified", "createdAt") VALUES
    (gen_random_uuid(), 'admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj.BXz0BbEiK', 'Admin', 'User', true, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'user@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj.BXz0BbEiK', 'John', 'Doe', true, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'test@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj.BXz0BbEiK', 'Jane', 'Smith', false, CURRENT_TIMESTAMP);

-- Note: In a production environment, you should not seed with default passwords
-- The password for all test users is "password123"
