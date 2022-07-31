--
-- user: all users have a hashed_password with value password

INSERT INTO "user" (id, username, type, email, password_hashed) VALUES
('11111111-1111-4111-b111-111111111111', 'player1', 'player', 'player1@test.com', '$2a$10$UvCLsWhhv8QUNfoXkKPwbu8rH8x9Rx857hIhdjVhMJyYMPAqeVFbi'),
('22222222-2222-4222-b222-222222222222', 'player2', 'player', 'player2@test.com', '$2a$10$UvCLsWhhv8QUNfoXkKPwbu8rH8x9Rx857hIhdjVhMJyYMPAqeVFbi'),
('33333333-3333-4333-b333-333333333333', 'player3', 'player', 'player3@test.com', '$2a$10$UvCLsWhhv8QUNfoXkKPwbu8rH8x9Rx857hIhdjVhMJyYMPAqeVFbi'),
('44444444-4444-4444-b444-444444444444', 'player4', 'player', 'player4@test.com', '$2a$10$UvCLsWhhv8QUNfoXkKPwbu8rH8x9Rx857hIhdjVhMJyYMPAqeVFbi'),
('11111111-1111-4111-b111-111111111115', 'admin1' , 'admin' , 'admin1@test.com' , '$2a$10$UvCLsWhhv8QUNfoXkKPwbu8rH8x9Rx857hIhdjVhMJyYMPAqeVFbi');

--
-- tournament

INSERT INTO "tournament" (id, name, start_at, end_at, processed) VALUES
('11111111-1111-4111-b111-111111111111', 'tournament1', '2022-01-01T00:00:00', '2022-03-31T00:00:00', true),
('22222222-2222-4222-b222-222222222222', 'tournament2', '2022-04-01T00:00:00', '2022-06-30T00:00:00', false),
('33333333-3333-4333-b333-333333333333', 'tournament3', '2022-07-01T00:00:00', '2222-12-31T00:00:00', false);

--
-- match

INSERT INTO "match" (id, date, start_at, end_at, result, user1_id, user2_id, tournament_id) VALUES
('11111111-1111-4111-b111-111111111111', '2022-01-01', '2022-01-01T00:00:00', '2022-01-01T01:00:00', 'USER1_WINS', '11111111-1111-4111-b111-111111111111', '22222222-2222-4222-b222-222222222222', '11111111-1111-4111-b111-111111111111'),
('11111111-1111-4111-b111-111111111112', '2022-03-01', '2022-03-01T00:00:00', '2022-03-01T01:00:00', 'USER1_WINS', '11111111-1111-4111-b111-111111111111', '22222222-2222-4222-b222-222222222222', '22222222-2222-4222-b222-222222222222'),
('11111111-1111-4111-b111-111111111113', '2022-03-02', '2022-03-02T00:00:00', '2022-03-02T01:00:00', 'USER1_WINS', '11111111-1111-4111-b111-111111111111', '33333333-3333-4333-b333-333333333333', '22222222-2222-4222-b222-222222222222'),
('11111111-1111-4111-b111-111111111114', '2022-03-03', '2022-03-03T00:00:00', '2022-03-03T01:00:00', 'USER1_WINS', '11111111-1111-4111-b111-111111111111', '44444444-4444-4444-b444-444444444444', '22222222-2222-4222-b222-222222222222'),
('11111111-1111-4111-b111-111111111115', '2022-03-04', '2022-03-04T00:00:00', '2022-03-04T01:00:00', 'USER2_WINS', '22222222-2222-4222-b222-222222222222', '33333333-3333-4333-b333-333333333333', '22222222-2222-4222-b222-222222222222'),
('11111111-1111-4111-b111-111111111116', '2022-03-05', '2022-03-05T00:00:00', '2022-03-05T01:00:00', 'TIE'       , '22222222-2222-4222-b222-222222222222', '44444444-4444-4444-b444-444444444444', '22222222-2222-4222-b222-222222222222'),
('11111111-1111-4111-b111-111111111117', '2022-03-06', '2022-03-06T00:00:00', '2022-03-06T01:00:00', 'USER1_WINS', '33333333-3333-4333-b333-333333333333', '44444444-4444-4444-b444-444444444444', '22222222-2222-4222-b222-222222222222');

--
-- rating_current

INSERT INTO "rating_current" (id, value, user_id, tournament_id) VALUES
('11111111-1111-4111-b111-111111111111', 1578.801716729907, '11111111-1111-4111-b111-111111111111', '11111111-1111-4111-b111-111111111111'),
('11111111-1111-4111-b111-111111111112', 1421.198283270093, '22222222-2222-4222-b222-222222222222', '11111111-1111-4111-b111-111111111111');

--
-- rating_historical

INSERT INTO "rating_historical" (id, value, user_id, tournament_id) VALUES
('11111111-1111-4111-b111-111111111111', 1578.801716729907, '11111111-1111-4111-b111-111111111111', '11111111-1111-4111-b111-111111111111'),
('11111111-1111-4111-b111-111111111112', 1421.198283270093, '22222222-2222-4222-b222-222222222222', '11111111-1111-4111-b111-111111111111');
