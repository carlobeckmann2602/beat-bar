-- Drop all tables
DROP TABLE IF EXISTS public."meyda_properties";
DROP TABLE IF EXISTS public."essentia_properties";
DROP TABLE IF EXISTS public."song";
DROP TABLE IF EXISTS public."album";
DROP TABLE IF EXISTS public."artist";


--create tables
CREATE TABLE IF NOT EXISTS public."artist"
(
    artist_id SERIAL NOT NULL UNIQUE,
    name CHARACTER VARYING
);
ALTER TABLE IF EXISTS public."artist"
    OWNER to postgres;


CREATE TABLE IF NOT EXISTS public."album"
(
    album_id SERIAL NOT NULL UNIQUE,
    name CHARACTER VARYING,
	year INT
);
ALTER TABLE IF EXISTS public."album"
    OWNER to postgres;
	

CREATE TABLE IF NOT EXISTS public."song"
(
    song_id SERIAL NOT NULL UNIQUE,
    title CHARACTER VARYING,
    artist_id INT,
	CONSTRAINT artist_id
		FOREIGN KEY(artist_id)
			REFERENCES artist(artist_id),
	album_id int,
	CONSTRAINT album_id
		FOREIGN KEY(album_id)
			REFERENCES album(album_id),
	year INT,
	duration INT
);
ALTER TABLE IF EXISTS public."song"
    OWNER to postgres;


CREATE TABLE IF NOT EXISTS public."meyda_properties"
(
    properties_id SERIAL NOT NULL UNIQUE,
    song_id INT,
	CONSTRAINT song_id
		FOREIGN KEY(song_id)
			REFERENCES song(song_id),
	mean NUMERIC,
	moe NUMERIC,
	rme NUMERIC,
	deviation NUMERIC,
	variance NUMERIC,
	sample NUMERIC[],
	cycle NUMERIC,
	elapsed NUMERIC,
	period NUMERIC,
	timeStamp NUMERIC,
	count NUMERIC,
	cycles NUMERIC,
	hz NUMERIC
);
ALTER TABLE IF EXISTS public."meyda_properties"
    OWNER to postgres;

CREATE TABLE IF NOT EXISTS public."essentia_properties"
(
    properties_id SERIAL NOT NULL UNIQUE,
    song_id INT,
	CONSTRAINT song_id
		FOREIGN KEY(song_id)
			REFERENCES song(song_id),
	mean NUMERIC,
	moe NUMERIC,
	rme NUMERIC,
	deviation NUMERIC,
	variance NUMERIC,
	sample NUMERIC[],
	cycle NUMERIC,
	elapsed NUMERIC,
	period NUMERIC,
	timeStamp NUMERIC,
	count NUMERIC,
	cycles NUMERIC,
	hz NUMERIC
);
ALTER TABLE IF EXISTS public."essentia_properties"
    OWNER to postgres;
