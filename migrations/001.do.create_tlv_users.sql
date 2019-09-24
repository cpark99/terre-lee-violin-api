CREATE TABLE tlv_users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  next_lesson TEXT DEFAULT '',
  amount_due INTEGER DEFAULT 0,
  date_created TIMESTAMP NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION f_tlv_users_id_seq(OUT nextfree bigint) AS
$func$
BEGIN
LOOP
   SELECT INTO nextfree  val
   FROM   nextval('tlv_users_id_seq'::regclass) val  -- use actual name of sequence
   WHERE  NOT EXISTS (SELECT 1 FROM tlv_users WHERE id = val);

   EXIT WHEN FOUND;
END LOOP; 
END
$func$  LANGUAGE plpgsql;

ALTER TABLE tlv_users ALTER id SET DEFAULT f_tlv_users_id_seq();
