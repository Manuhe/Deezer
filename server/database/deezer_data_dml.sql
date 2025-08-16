-- ============================
-- SAMPLE DATA CORREGIDO
-- ============================

-- USERS (insertando ids explícitos)
INSERT INTO users (id, username, email, password_hash) VALUES (1, 'orson', 'orson@example.com', 'hash123');
INSERT INTO users (id, username, email, password_hash) VALUES (2, 'luna', 'luna@example.com', 'hash456');

-- ARTISTS
INSERT INTO artists (id, name, bio, country) VALUES (1, 'The Weekend', 'Artista canadiense...', 'Canada');
INSERT INTO artists (id, name, bio, country) VALUES (2, 'Dua Lipa', 'Pop star from UK...', 'UK');

-- ALBUMS
INSERT INTO albums (id, artist_id, title, release_date, cover_url) VALUES (1, 1, 'After Hours', DATE '2020-03-20', 'https://example.com/cover1.jpg');
INSERT INTO albums (id, artist_id, title, release_date, cover_url) VALUES (2, 2, 'Future Nostalgia', DATE '2020-03-27', 'https://example.com/cover2.jpg');

-- TRACKS
INSERT INTO tracks (id, album_id, title, duration, audio_url) VALUES (1, 1, 'Blinding Lights', 200, 'https://example.com/audio1.mp3');
INSERT INTO tracks (id, album_id, title, duration, audio_url) VALUES (2, 2, 'Levitating', 203, 'https://example.com/audio2.mp3');

-- GENRES
INSERT INTO genres (id, name) VALUES (1, 'Pop');
INSERT INTO genres (id, name) VALUES (2, 'R&B');

-- TRACK_GENRES
INSERT INTO track_genres (track_id, genre_id) VALUES (1, 2);
INSERT INTO track_genres (track_id, genre_id) VALUES (2, 1);

-- PLAYLISTS
INSERT INTO playlists (id, user_id, name) VALUES (1, 1, 'Orson Favorites');

-- PLAYLIST_TRACKS
INSERT INTO playlist_tracks (playlist_id, track_id, position) VALUES (1, 1, 1);
INSERT INTO playlist_tracks (playlist_id, track_id, position) VALUES (1, 2, 2);

-- USER_FOLLOWS_ARTIST
INSERT INTO user_follows_artist (user_id, artist_id) VALUES (1, 1);
INSERT INTO user_follows_artist (user_id, artist_id) VALUES (2, 2);

-- USER_LIKES_TRACK
INSERT INTO user_likes_track (user_id, track_id) VALUES (1, 1);
INSERT INTO user_likes_track (user_id, track_id) VALUES (2, 2);

-- SUBSCRIPTIONS
INSERT INTO subscriptions (user_id, plan_name, start_date, end_date) VALUES (1, 'Premium', DATE '2024-01-01', DATE '2025-01-01');
INSERT INTO subscriptions (user_id, plan_name, start_date, end_date) VALUES (2, 'Free', DATE '2024-06-01', NULL);
