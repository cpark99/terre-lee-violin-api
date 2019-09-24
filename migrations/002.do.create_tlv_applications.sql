CREATE TABLE tlv_applications (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT DEFAULT '',
  date_created TIMESTAMP NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION f_tlv_applications_id_seq(OUT nextfree bigint) AS
$func$
BEGIN
LOOP
   SELECT INTO nextfree  val
   FROM   nextval('tlv_applications_id_seq'::regclass) val  -- use actual name of sequence
   WHERE  NOT EXISTS (SELECT 1 FROM tlv_applications WHERE id = val);

   EXIT WHEN FOUND;
END LOOP; 
END
$func$  LANGUAGE plpgsql;

ALTER TABLE tlv_applications ALTER id SET DEFAULT f_tlv_applications_id_seq();
