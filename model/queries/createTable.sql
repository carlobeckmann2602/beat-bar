DROP TABLE IF EXISTS public."Test";

CREATE TABLE IF NOT EXISTS public."Test"
(
    id serial NOT NULL,
    name character varying COLLATE pg_catalog."default",
    lastname character varying COLLATE pg_catalog."default",
    CONSTRAINT "Test_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Test"
    OWNER to postgres;