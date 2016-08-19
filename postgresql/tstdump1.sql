--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.3
-- Dumped by pg_dump version 9.5.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public, pg_catalog;

ALTER TABLE ONLY public.test_user DROP CONSTRAINT test_user_pkey;
ALTER TABLE ONLY public.test_result DROP CONSTRAINT test_result_pkey;
ALTER TABLE ONLY public.test_header_case DROP CONSTRAINT test_header_case_pkey;
ALTER TABLE ONLY public.test_category DROP CONSTRAINT test_category_pkey;
ALTER TABLE ONLY public.test_case DROP CONSTRAINT test_case_pkey;
ALTER TABLE ONLY public.provider DROP CONSTRAINT provider_pkey;
ALTER TABLE ONLY public.product DROP CONSTRAINT product_pkey;
ALTER TABLE public.test_user ALTER COLUMN test_user_id DROP DEFAULT;
ALTER TABLE public.test_result ALTER COLUMN test_result_id DROP DEFAULT;
ALTER TABLE public.test_header_case ALTER COLUMN test_header_case_id DROP DEFAULT;
ALTER TABLE public.test_category ALTER COLUMN test_category_id DROP DEFAULT;
ALTER TABLE public.test_case ALTER COLUMN test_case_id DROP DEFAULT;
ALTER TABLE public.provider ALTER COLUMN provider_id DROP DEFAULT;
ALTER TABLE public.product ALTER COLUMN product_id DROP DEFAULT;
DROP SEQUENCE public.test_user_test_user_id_seq;
DROP TABLE public.test_user;
DROP SEQUENCE public.test_result_test_result_id_seq;
DROP SEQUENCE public.test_header_case_test_header_case_id_seq;
DROP SEQUENCE public.test_category_test_category_id_seq;
DROP SEQUENCE public.test_case_test_case_id_seq;
DROP TABLE public.test_case;
DROP VIEW public.stats;
DROP VIEW public.test_header_case_result;
DROP TABLE public.test_result;
DROP TABLE public.test_header_case;
DROP TABLE public.test_category;
DROP SEQUENCE public.provider_provider_id_seq;
DROP TABLE public.provider;
DROP SEQUENCE public.product_product_id_seq;
DROP TABLE public.product;
DROP EXTENSION plpgsql;
DROP SCHEMA public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: product; Type: TABLE; Schema: public; Owner: interop
--

CREATE TABLE product (
    product_id integer NOT NULL,
    provider_id integer,
    name character(32),
    description character varying(512),
    product_access character varying(1024),
    product_access_url character varying(256),
    etat smallint DEFAULT 3,
    cre_test_user_id integer,
    maj_test_user_id integer,
    usercre character(32),
    usermaj character(32),
    datecre date DEFAULT now(),
    datemaj date
);


ALTER TABLE product OWNER TO interop;

--
-- Name: product_product_id_seq; Type: SEQUENCE; Schema: public; Owner: interop
--

CREATE SEQUENCE product_product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE product_product_id_seq OWNER TO interop;

--
-- Name: product_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: interop
--

ALTER SEQUENCE product_product_id_seq OWNED BY product.product_id;


--
-- Name: provider; Type: TABLE; Schema: public; Owner: interop
--

CREATE TABLE provider (
    provider_id integer NOT NULL,
    name character(32),
    description character varying(512),
    etat smallint DEFAULT 3,
    cre_test_user_id integer,
    maj_test_user_id integer,
    usercre character(32),
    usermaj character(32),
    datecre date DEFAULT now(),
    datemaj date
);


ALTER TABLE provider OWNER TO interop;

--
-- Name: provider_provider_id_seq; Type: SEQUENCE; Schema: public; Owner: interop
--

CREATE SEQUENCE provider_provider_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE provider_provider_id_seq OWNER TO interop;

--
-- Name: provider_provider_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: interop
--

ALTER SEQUENCE provider_provider_id_seq OWNED BY provider.provider_id;


--
-- Name: test_category; Type: TABLE; Schema: public; Owner: interop
--

CREATE TABLE test_category (
    test_category_id integer NOT NULL,
    name character(32),
    description character varying(512),
    etat smallint DEFAULT 3,
    cre_test_user_id integer,
    maj_test_user_id integer,
    usercre character(32),
    usermaj character(32),
    datecre date DEFAULT now(),
    datemaj date
);


ALTER TABLE test_category OWNER TO interop;

--
-- Name: test_header_case; Type: TABLE; Schema: public; Owner: interop
--

CREATE TABLE test_header_case (
    test_header_case_id integer NOT NULL,
    test_category_id integer,
    name character(32),
    single_product_test smallint,
    etat smallint DEFAULT 3,
    cre_test_user_id integer,
    maj_test_user_id integer,
    usercre character(32),
    usermaj character(32),
    datecre date DEFAULT now(),
    datemaj date
);


ALTER TABLE test_header_case OWNER TO interop;

--
-- Name: test_result; Type: TABLE; Schema: public; Owner: interop
--

CREATE TABLE test_result (
    test_result_id integer NOT NULL,
    product_1_id integer,
    product_2_id integer,
    test_header_case_id integer,
    test_case_id integer,
    result smallint,
    description character varying(512),
    etat smallint DEFAULT 3,
    test_user_id integer,
    usercre character(32),
    usermaj character(32),
    datecre date DEFAULT now(),
    datemaj date
);


ALTER TABLE test_result OWNER TO interop;

--
-- Name: test_header_case_result; Type: VIEW; Schema: public; Owner: interop
--

CREATE VIEW test_header_case_result AS
 SELECT max(test_result.test_result_id) AS test_result_id,
    test_result.product_1_id,
    test_result.product_2_id
   FROM test_result
  WHERE (test_result.etat <> 99)
  GROUP BY test_result.product_1_id, test_result.product_2_id;


ALTER TABLE test_header_case_result OWNER TO interop;

--
-- Name: stats; Type: VIEW; Schema: public; Owner: interop
--

CREATE VIEW stats AS
 SELECT ( SELECT count(*) AS count
           FROM product
          WHERE (product.etat <> 99)) AS nb_products,
    ( SELECT count(*) AS count
           FROM test_category
          WHERE (test_category.etat <> 99)) AS nb_categories,
    ( SELECT count(*) AS count
           FROM test_header_case
          WHERE (test_header_case.etat <> 99)) AS nb_tests,
    ( SELECT count(*) AS count
           FROM test_result
          WHERE (test_result.etat <> 99)) AS nb_execute,
    ( SELECT count(*) AS count
           FROM test_result r,
            test_header_case_result h
          WHERE ((r.test_result_id = h.test_result_id) AND (r.etat <> 99) AND (r.result = 0))) AS nb_execute_failed,
    ( SELECT count(*) AS count
           FROM test_result r,
            test_header_case_result h
          WHERE ((r.test_result_id = h.test_result_id) AND (r.etat <> 99) AND (r.result = 1))) AS nb_execute_succeeded;


ALTER TABLE stats OWNER TO interop;

--
-- Name: test_case; Type: TABLE; Schema: public; Owner: interop
--

CREATE TABLE test_case (
    test_case_id integer NOT NULL,
    test_header_case_id integer,
    description character varying(512),
    expected_result character varying(512),
    version character(32),
    etat smallint DEFAULT 3,
    cre_test_user_id integer,
    maj_test_user_id integer,
    usercre character(32),
    usermaj character(32),
    datecre date DEFAULT now(),
    datemaj date
);


ALTER TABLE test_case OWNER TO interop;

--
-- Name: test_case_test_case_id_seq; Type: SEQUENCE; Schema: public; Owner: interop
--

CREATE SEQUENCE test_case_test_case_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE test_case_test_case_id_seq OWNER TO interop;

--
-- Name: test_case_test_case_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: interop
--

ALTER SEQUENCE test_case_test_case_id_seq OWNED BY test_case.test_case_id;


--
-- Name: test_category_test_category_id_seq; Type: SEQUENCE; Schema: public; Owner: interop
--

CREATE SEQUENCE test_category_test_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE test_category_test_category_id_seq OWNER TO interop;

--
-- Name: test_category_test_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: interop
--

ALTER SEQUENCE test_category_test_category_id_seq OWNED BY test_category.test_category_id;


--
-- Name: test_header_case_test_header_case_id_seq; Type: SEQUENCE; Schema: public; Owner: interop
--

CREATE SEQUENCE test_header_case_test_header_case_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE test_header_case_test_header_case_id_seq OWNER TO interop;

--
-- Name: test_header_case_test_header_case_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: interop
--

ALTER SEQUENCE test_header_case_test_header_case_id_seq OWNED BY test_header_case.test_header_case_id;


--
-- Name: test_result_test_result_id_seq; Type: SEQUENCE; Schema: public; Owner: interop
--

CREATE SEQUENCE test_result_test_result_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE test_result_test_result_id_seq OWNER TO interop;

--
-- Name: test_result_test_result_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: interop
--

ALTER SEQUENCE test_result_test_result_id_seq OWNED BY test_result.test_result_id;


--
-- Name: test_user; Type: TABLE; Schema: public; Owner: interop
--

CREATE TABLE test_user (
    test_user_id integer NOT NULL,
    name character(32),
    email character(128),
    password character varying(128),
    product_id integer,
    user_sso_id integer,
    etat smallint DEFAULT 3,
    usercre character(32),
    usermaj character(32),
    datecre date DEFAULT now(),
    datemaj date
);


ALTER TABLE test_user OWNER TO interop;

--
-- Name: test_user_test_user_id_seq; Type: SEQUENCE; Schema: public; Owner: interop
--

CREATE SEQUENCE test_user_test_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE test_user_test_user_id_seq OWNER TO interop;

--
-- Name: test_user_test_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: interop
--

ALTER SEQUENCE test_user_test_user_id_seq OWNED BY test_user.test_user_id;


--
-- Name: product_id; Type: DEFAULT; Schema: public; Owner: interop
--

ALTER TABLE ONLY product ALTER COLUMN product_id SET DEFAULT nextval('product_product_id_seq'::regclass);


--
-- Name: provider_id; Type: DEFAULT; Schema: public; Owner: interop
--

ALTER TABLE ONLY provider ALTER COLUMN provider_id SET DEFAULT nextval('provider_provider_id_seq'::regclass);


--
-- Name: test_case_id; Type: DEFAULT; Schema: public; Owner: interop
--

ALTER TABLE ONLY test_case ALTER COLUMN test_case_id SET DEFAULT nextval('test_case_test_case_id_seq'::regclass);


--
-- Name: test_category_id; Type: DEFAULT; Schema: public; Owner: interop
--

ALTER TABLE ONLY test_category ALTER COLUMN test_category_id SET DEFAULT nextval('test_category_test_category_id_seq'::regclass);


--
-- Name: test_header_case_id; Type: DEFAULT; Schema: public; Owner: interop
--

ALTER TABLE ONLY test_header_case ALTER COLUMN test_header_case_id SET DEFAULT nextval('test_header_case_test_header_case_id_seq'::regclass);


--
-- Name: test_result_id; Type: DEFAULT; Schema: public; Owner: interop
--

ALTER TABLE ONLY test_result ALTER COLUMN test_result_id SET DEFAULT nextval('test_result_test_result_id_seq'::regclass);


--
-- Name: test_user_id; Type: DEFAULT; Schema: public; Owner: interop
--

ALTER TABLE ONLY test_user ALTER COLUMN test_user_id SET DEFAULT nextval('test_user_test_user_id_seq'::regclass);


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: interop
--

INSERT INTO product VALUES (1, 1, 'Alinto                          ', NULL, 'DelphineDurand ddurand@amsp.alinto.net /Alinto2016 
PhilippeMartin pmartin@amsp.alinto.net /Alinto2016
EmilieDuclos educlos@amsp.alinto.net /Alinto2016
Pierre Grangier pgrangier@amsp.alinto.net /Alinto2016
Olivier Flandin oflandin@amsp.alinto.net /Alinto2016
Compte de ressource : marketing@amsp.alinto.net /Alinto2016

acces imap/smtp/pop
imap.amsp.alinto.net
pop.amsp.alinto.net
smtp.amsp.alinto.net', ' https://amsp.alinto.net/wmm/login.form', 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO product VALUES (2, 2, 'Microsoft Exchange              ', NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO product VALUES (3, 3, 'Bluemind                        ', NULL, 'victor@etalab.bluemind.net
hector@etalab.bluemind.net
edgar@etalab.bluemind.net
charles@etalab.bluemind.net
alexandre@etalab.bluemind.net
alexis@etalab.bluemind.net
clement@etalab.bluemind.net
david@etalab.bluemind.net                             
vincent@etalab.bluemind.net', 'https://etalab.bluemind.net', 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO product VALUES (4, 4, 'Exo platform                    ', NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO product VALUES (5, 8, 'OBM                             ', NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO product VALUES (6, 8, 'Open PaaS                       ', NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO product VALUES (7, 10, 'Office 365                      ', NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO product VALUES (8, 11, 'Yaziba                          ', NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO product VALUES (9, 11, 'Zimbra                          ', NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO product VALUES (10, 12, 'OxApp                           ', NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO product VALUES (11, 13, 'WL Business mail                ', NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO product VALUES (12, 13, 'GoLive!                         ', NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO product VALUES (13, 6, 'IBM Verse                       ', NULL, NULL, NULL, 3, NULL, 1, NULL, NULL, '2016-07-13', '2016-07-15');
INSERT INTO product VALUES (14, 1, 'Alinto                          ', NULL, 'DelphineDurand ddurand@amsp.alinto.net /Alinto2016 
PhilippeMartin pmartin@amsp.alinto.net /Alinto2016
EmilieDuclos educlos@amsp.alinto.net /Alinto2016
Pierre Grangier pgrangier@amsp.alinto.net /Alinto2016
Olivier Flandin oflandin@amsp.alinto.net /Alinto2016
Compte de ressource : marketing@amsp.alinto.net /Alinto2016

acces imap/smtp/pop
imap.amsp.alinto.net
pop.amsp.alinto.net
smtp.amsp.alinto.net', ' https://amsp.alinto.net/wmm/login.form', 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO product VALUES (15, 2, 'Microsoft Exchange              ', NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO product VALUES (16, 3, 'Bluemind                        ', NULL, 'victor@etalab.bluemind.net
hector@etalab.bluemind.net
edgar@etalab.bluemind.net
charles@etalab.bluemind.net
alexandre@etalab.bluemind.net
alexis@etalab.bluemind.net
clement@etalab.bluemind.net
david@etalab.bluemind.net                             
vincent@etalab.bluemind.net', 'https://etalab.bluemind.net', 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO product VALUES (17, 4, 'Exo platform                    ', NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO product VALUES (18, 8, 'OBM                             ', NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO product VALUES (19, 8, 'Open PaaS                       ', NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO product VALUES (20, 10, 'Office 365                      ', NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO product VALUES (21, 11, 'Yaziba                          ', NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO product VALUES (22, 11, 'Zimbra                          ', NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO product VALUES (23, 12, 'OxApp                           ', NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO product VALUES (24, 13, 'WL Business mail                ', NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO product VALUES (25, 13, 'GoLive!                         ', NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO product VALUES (26, 6, 'IBM Verse                       ', NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);


--
-- Name: product_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: interop
--

SELECT pg_catalog.setval('product_product_id_seq', 26, true);


--
-- Data for Name: provider; Type: TABLE DATA; Schema: public; Owner: interop
--

INSERT INTO provider VALUES (1, 'Alinto                          ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO provider VALUES (2, 'Aduneo                          ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO provider VALUES (3, 'Bluemind                        ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO provider VALUES (4, 'Exo                             ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO provider VALUES (5, 'BlackBerry                      ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO provider VALUES (6, 'IBM                             ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO provider VALUES (7, 'Kolab                           ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO provider VALUES (8, 'Linagora                        ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO provider VALUES (9, 'BlackBerry                      ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO provider VALUES (10, 'Microsoft                       ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO provider VALUES (11, 'Netixia                         ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO provider VALUES (12, 'Open xchange                    ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO provider VALUES (13, 'Wordline                        ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);


--
-- Name: provider_provider_id_seq; Type: SEQUENCE SET; Schema: public; Owner: interop
--

SELECT pg_catalog.setval('provider_provider_id_seq', 13, true);


--
-- Data for Name: test_case; Type: TABLE DATA; Schema: public; Owner: interop
--

INSERT INTO test_case VALUES (1, 1, 'The receiver has to accept and deny two differents events', NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_case VALUES (2, 2, ' The sender has to send a calendar sharing to the receiver.
  In general, the sender has to give an url for the calendar.', NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_case VALUES (3, 3, 'When receiver accept an invitation for an event, he has to put it with the
  private status ( only him can see what is this event).', NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_case VALUES (4, 4, 'This event must be recurrent.
  When sender invit the receiver, he has to put this option and with this, this
  two users will see the same events several time in their calendar.', NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_case VALUES (5, 5, 'The sender has to send 4 invitation of an evenement to a receiver.', NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_case VALUES (6, 6, 'The receiver has to answer "provisional" to an events invitation', NULL, NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);


--
-- Name: test_case_test_case_id_seq; Type: SEQUENCE SET; Schema: public; Owner: interop
--

SELECT pg_catalog.setval('test_case_test_case_id_seq', 6, true);


--
-- Data for Name: test_category; Type: TABLE DATA; Schema: public; Owner: interop
--

INSERT INTO test_category VALUES (1, 'Encrypted Emails                ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO test_category VALUES (2, 'Calendar                        ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO test_category VALUES (3, 'Simple Emails                   ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO test_category VALUES (4, 'Contacts                        ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO test_category VALUES (6, 'Folders                         ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO test_category VALUES (7, 'Instant messaging               ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO test_category VALUES (5, 'Accessibility                   ', NULL, 3, NULL, 1, NULL, NULL, '2016-07-13', '2016-07-15');
INSERT INTO test_category VALUES (8, 'Encrypted Emails                ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_category VALUES (9, 'Calendar                        ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_category VALUES (10, 'Simple Emails                   ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_category VALUES (11, 'Contacts                        ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_category VALUES (12, 'Accessibility                   ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_category VALUES (13, 'Folders                         ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_category VALUES (14, 'Instant messaging               ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);


--
-- Name: test_category_test_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: interop
--

SELECT pg_catalog.setval('test_category_test_category_id_seq', 14, true);


--
-- Data for Name: test_header_case; Type: TABLE DATA; Schema: public; Owner: interop
--

INSERT INTO test_header_case VALUES (1, 2, 'accept and deny                 ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO test_header_case VALUES (2, 2, 'calendar sharing external       ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO test_header_case VALUES (3, 2, 'private spread                  ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO test_header_case VALUES (4, 2, 'reccurent                       ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO test_header_case VALUES (5, 2, 'send and receive events         ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO test_header_case VALUES (6, 2, 'set provisionnal                ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-13', NULL);
INSERT INTO test_header_case VALUES (7, 5, 'aa                              ', NULL, 99, 1, 1, NULL, NULL, '2016-07-15', '2016-07-15');
INSERT INTO test_header_case VALUES (8, 5, 'aa                              ', NULL, 99, 1, 1, NULL, NULL, '2016-07-15', '2016-07-15');
INSERT INTO test_header_case VALUES (9, 5, 'AccTest                         ', NULL, 3, 1, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_header_case VALUES (10, 2, 'accept and deny                 ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_header_case VALUES (11, 2, 'calendar sharing external       ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_header_case VALUES (12, 2, 'private spread                  ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_header_case VALUES (13, 2, 'reccurent                       ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_header_case VALUES (14, 2, 'send and receive events         ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_header_case VALUES (15, 2, 'set provisionnal                ', NULL, 3, NULL, NULL, NULL, NULL, '2016-07-19', NULL);


--
-- Name: test_header_case_test_header_case_id_seq; Type: SEQUENCE SET; Schema: public; Owner: interop
--

SELECT pg_catalog.setval('test_header_case_test_header_case_id_seq', 15, true);


--
-- Data for Name: test_result; Type: TABLE DATA; Schema: public; Owner: interop
--

INSERT INTO test_result VALUES (1, 1, 2, 1, 1, 1, 'All is ok', 3, 1, NULL, NULL, '2016-04-22', NULL);
INSERT INTO test_result VALUES (2, 3, 2, 1, 1, 0, 'Dont work', 3, 1, NULL, NULL, '2016-04-22', NULL);
INSERT INTO test_result VALUES (4, 3, 8, 1, 1, 1, 'All is ok', 3, 1, NULL, NULL, '2016-04-22', NULL);
INSERT INTO test_result VALUES (5, 4, 9, 1, 1, 0, 'Dont work', 3, 1, NULL, NULL, '2016-04-22', NULL);
INSERT INTO test_result VALUES (6, 1, 2, 1, NULL, 1, 'ss', 3, 1, NULL, NULL, '2016-07-15', NULL);
INSERT INTO test_result VALUES (7, 3, 2, 1, NULL, 0, '', 99, 1, NULL, NULL, '2016-07-15', '2016-07-15');
INSERT INTO test_result VALUES (3, 3, 2, 1, 1, 1, 'All is ok', 99, 1, NULL, NULL, '2016-04-22', '2016-07-15');
INSERT INTO test_result VALUES (9, 1, 3, 8, NULL, 0, 'b', 99, 1, NULL, NULL, '2016-07-15', '2016-07-15');
INSERT INTO test_result VALUES (8, 1, 1, 8, NULL, 1, 'a', 99, 1, NULL, NULL, '2016-07-15', '2016-07-15');
INSERT INTO test_result VALUES (10, 1, 1, 9, NULL, 1, '', 3, 1, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_result VALUES (11, 1, 9, 9, NULL, 0, '', 3, 1, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_result VALUES (12, 4, 5, 9, NULL, 1, '', 3, 1, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_result VALUES (13, 4, 2, 9, NULL, 1, '', 3, 1, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_result VALUES (14, 4, 7, 9, NULL, 1, '', 3, 1, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_result VALUES (15, 4, 6, 9, NULL, 0, '', 99, 1, NULL, NULL, '2016-07-19', '2016-07-19');
INSERT INTO test_result VALUES (16, 4, 6, 9, NULL, 1, '', 3, 1, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_result VALUES (17, 1, 2, 1, 1, 1, 'All is ok', 3, 1, NULL, NULL, '2016-04-22', NULL);
INSERT INTO test_result VALUES (18, 3, 2, 1, 1, 0, 'Dont work', 3, 1, NULL, NULL, '2016-04-22', NULL);
INSERT INTO test_result VALUES (19, 3, 2, 1, 1, 1, 'All is ok', 3, 1, NULL, NULL, '2016-04-22', NULL);
INSERT INTO test_result VALUES (20, 3, 8, 1, 1, 1, 'All is ok', 3, 1, NULL, NULL, '2016-04-22', NULL);
INSERT INTO test_result VALUES (21, 4, 9, 1, 1, 0, 'Dont work', 3, 1, NULL, NULL, '2016-04-22', NULL);
INSERT INTO test_result VALUES (22, 4, 12, 9, NULL, 1, '', 3, 1, NULL, NULL, '2016-07-19', NULL);
INSERT INTO test_result VALUES (23, 4, 13, 9, NULL, 1, '', 3, 1, NULL, NULL, '2016-07-19', NULL);


--
-- Name: test_result_test_result_id_seq; Type: SEQUENCE SET; Schema: public; Owner: interop
--

SELECT pg_catalog.setval('test_result_test_result_id_seq', 23, true);


--
-- Data for Name: test_user; Type: TABLE DATA; Schema: public; Owner: interop
--

INSERT INTO test_user VALUES (1, 'Dinsic                          ', 'jerome.ploquin@modernisation.gouv.fr                                                                                            ', 'fanfaronfanfaron', NULL, 645, 3, NULL, NULL, '2016-07-19', NULL);


--
-- Name: test_user_test_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: interop
--

SELECT pg_catalog.setval('test_user_test_user_id_seq', 1, true);


--
-- Name: product_pkey; Type: CONSTRAINT; Schema: public; Owner: interop
--

ALTER TABLE ONLY product
    ADD CONSTRAINT product_pkey PRIMARY KEY (product_id);


--
-- Name: provider_pkey; Type: CONSTRAINT; Schema: public; Owner: interop
--

ALTER TABLE ONLY provider
    ADD CONSTRAINT provider_pkey PRIMARY KEY (provider_id);


--
-- Name: test_case_pkey; Type: CONSTRAINT; Schema: public; Owner: interop
--

ALTER TABLE ONLY test_case
    ADD CONSTRAINT test_case_pkey PRIMARY KEY (test_case_id);


--
-- Name: test_category_pkey; Type: CONSTRAINT; Schema: public; Owner: interop
--

ALTER TABLE ONLY test_category
    ADD CONSTRAINT test_category_pkey PRIMARY KEY (test_category_id);


--
-- Name: test_header_case_pkey; Type: CONSTRAINT; Schema: public; Owner: interop
--

ALTER TABLE ONLY test_header_case
    ADD CONSTRAINT test_header_case_pkey PRIMARY KEY (test_header_case_id);


--
-- Name: test_result_pkey; Type: CONSTRAINT; Schema: public; Owner: interop
--

ALTER TABLE ONLY test_result
    ADD CONSTRAINT test_result_pkey PRIMARY KEY (test_result_id);


--
-- Name: test_user_pkey; Type: CONSTRAINT; Schema: public; Owner: interop
--

ALTER TABLE ONLY test_user
    ADD CONSTRAINT test_user_pkey PRIMARY KEY (test_user_id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

