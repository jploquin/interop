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
-- Name: toto; Type: VIEW; Schema: public; Owner: interop
--

CREATE VIEW toto AS
 SELECT ( SELECT count(*) AS count
           FROM product) AS n1,
    ( SELECT count(*) AS count
           FROM test_user) AS n2;


ALTER TABLE toto OWNER TO interop;

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

COPY product (product_id, provider_id, name, description, product_access, product_access_url, etat, cre_test_user_id, maj_test_user_id, usercre, usermaj, datecre, datemaj) FROM stdin;
1	1	Alinto                          	\N	DelphineDurand ddurand@amsp.alinto.net /Alinto2016 \nPhilippeMartin pmartin@amsp.alinto.net /Alinto2016\nEmilieDuclos educlos@amsp.alinto.net /Alinto2016\nPierre Grangier pgrangier@amsp.alinto.net /Alinto2016\nOlivier Flandin oflandin@amsp.alinto.net /Alinto2016\nCompte de ressource : marketing@amsp.alinto.net /Alinto2016\n\nacces imap/smtp/pop\nimap.amsp.alinto.net\npop.amsp.alinto.net\nsmtp.amsp.alinto.net	 https://amsp.alinto.net/wmm/login.form	3	\N	\N	\N	\N	2016-07-03	\N
2	2	Microsoft Exchange              	\N	\N	\N	3	\N	\N	\N	\N	2016-07-03	\N
3	3	Bluemind                        	\N	victor@etalab.bluemind.net\nhector@etalab.bluemind.net\nedgar@etalab.bluemind.net\ncharles@etalab.bluemind.net\nalexandre@etalab.bluemind.net\nalexis@etalab.bluemind.net\nclement@etalab.bluemind.net\ndavid@etalab.bluemind.net                             \nvincent@etalab.bluemind.net	https://etalab.bluemind.net	3	\N	\N	\N	\N	2016-07-03	\N
4	4	Exo platform                    	\N	\N	\N	3	\N	\N	\N	\N	2016-07-03	\N
5	8	OBM                             	\N	\N	\N	3	\N	\N	\N	\N	2016-07-03	\N
6	8	Open PaaS                       	\N	\N	\N	3	\N	\N	\N	\N	2016-07-03	\N
7	10	Office 365                      	\N	\N	\N	3	\N	\N	\N	\N	2016-07-03	\N
8	11	Yaziba                          	\N	\N	\N	3	\N	\N	\N	\N	2016-07-03	\N
9	11	Zimbra                          	\N	\N	\N	3	\N	\N	\N	\N	2016-07-03	\N
10	12	OxApp                           	\N	\N	\N	3	\N	\N	\N	\N	2016-07-03	\N
11	13	WL Business mail                	\N	\N	\N	3	\N	\N	\N	\N	2016-07-03	\N
12	13	GoLive!                         	\N	\N	\N	3	\N	\N	\N	\N	2016-07-03	\N
13	6	IBM Verse                       	\N	\N	\N	3	\N	\N	\N	\N	2016-07-03	\N
\.


--
-- Name: product_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: interop
--

SELECT pg_catalog.setval('product_product_id_seq', 13, true);


--
-- Data for Name: provider; Type: TABLE DATA; Schema: public; Owner: interop
--

COPY provider (provider_id, name, description, etat, cre_test_user_id, maj_test_user_id, usercre, usermaj, datecre, datemaj) FROM stdin;
1	Alinto                          	\N	3	\N	\N	\N	\N	2016-07-03	\N
2	Aduneo                          	\N	3	\N	\N	\N	\N	2016-07-03	\N
3	Bluemind                        	\N	3	\N	\N	\N	\N	2016-07-03	\N
4	Exo                             	\N	3	\N	\N	\N	\N	2016-07-03	\N
5	BlackBerry                      	\N	3	\N	\N	\N	\N	2016-07-03	\N
6	IBM                             	\N	3	\N	\N	\N	\N	2016-07-03	\N
7	Kolab                           	\N	3	\N	\N	\N	\N	2016-07-03	\N
8	Linagora                        	\N	3	\N	\N	\N	\N	2016-07-03	\N
9	BlackBerry                      	\N	3	\N	\N	\N	\N	2016-07-03	\N
10	Microsoft                       	\N	3	\N	\N	\N	\N	2016-07-03	\N
11	Netixia                         	\N	3	\N	\N	\N	\N	2016-07-03	\N
12	Open xchange                    	\N	3	\N	\N	\N	\N	2016-07-03	\N
13	Wordline                        	\N	3	\N	\N	\N	\N	2016-07-03	\N
\.


--
-- Name: provider_provider_id_seq; Type: SEQUENCE SET; Schema: public; Owner: interop
--

SELECT pg_catalog.setval('provider_provider_id_seq', 13, true);


--
-- Data for Name: test_case; Type: TABLE DATA; Schema: public; Owner: interop
--

COPY test_case (test_case_id, test_header_case_id, description, expected_result, version, etat, cre_test_user_id, maj_test_user_id, usercre, usermaj, datecre, datemaj) FROM stdin;
1	1	The receiver has to accept and deny two differents events	\N	\N	3	\N	\N	\N	\N	2016-07-03	\N
2	2	 The sender has to send a calendar sharing to the receiver.\n  In general, the sender has to give an url for the calendar.	\N	\N	3	\N	\N	\N	\N	2016-07-03	\N
3	3	When receiver accept an invitation for an event, he has to put it with the\n  private status ( only him can see what is this event).	\N	\N	3	\N	\N	\N	\N	2016-07-03	\N
4	4	This event must be recurrent.\n  When sender invit the receiver, he has to put this option and with this, this\n  two users will see the same events several time in their calendar.	\N	\N	3	\N	\N	\N	\N	2016-07-03	\N
5	5	The sender has to send 4 invitation of an evenement to a receiver.	\N	\N	3	\N	\N	\N	\N	2016-07-03	\N
6	6	The receiver has to answer "provisional" to an events invitation	\N	\N	3	\N	\N	\N	\N	2016-07-03	\N
7	7			\N	3	99	\N	\N	\N	2016-07-03	\N
\.


--
-- Name: test_case_test_case_id_seq; Type: SEQUENCE SET; Schema: public; Owner: interop
--

SELECT pg_catalog.setval('test_case_test_case_id_seq', 7, true);


--
-- Data for Name: test_category; Type: TABLE DATA; Schema: public; Owner: interop
--

COPY test_category (test_category_id, name, description, etat, cre_test_user_id, maj_test_user_id, usercre, usermaj, datecre, datemaj) FROM stdin;
1	Encrypted Emails                	\N	3	\N	\N	\N	\N	2016-07-03	\N
2	Calendar                        	\N	3	\N	\N	\N	\N	2016-07-03	\N
3	Simple Emails                   	\N	3	\N	\N	\N	\N	2016-07-03	\N
4	Contacts                        	\N	3	\N	\N	\N	\N	2016-07-03	\N
5	Accessibility                   	\N	3	\N	\N	\N	\N	2016-07-03	\N
6	Folders                         	\N	3	\N	\N	\N	\N	2016-07-03	\N
7	Instant messaging               	\N	3	\N	\N	\N	\N	2016-07-03	\N
\.


--
-- Name: test_category_test_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: interop
--

SELECT pg_catalog.setval('test_category_test_category_id_seq', 7, true);


--
-- Data for Name: test_header_case; Type: TABLE DATA; Schema: public; Owner: interop
--

COPY test_header_case (test_header_case_id, test_category_id, name, etat, cre_test_user_id, maj_test_user_id, usercre, usermaj, datecre, datemaj) FROM stdin;
1	2	accept and deny                 	3	\N	\N	\N	\N	2016-07-03	\N
2	2	calendar sharing external       	3	\N	\N	\N	\N	2016-07-03	\N
3	2	private spread                  	3	\N	\N	\N	\N	2016-07-03	\N
4	2	reccurent                       	3	\N	\N	\N	\N	2016-07-03	\N
5	2	send and receive events         	3	\N	\N	\N	\N	2016-07-03	\N
6	2	set provisionnal                	3	\N	\N	\N	\N	2016-07-03	\N
7	2	az                              	3	99	\N	\N	\N	2016-07-03	\N
\.


--
-- Name: test_header_case_test_header_case_id_seq; Type: SEQUENCE SET; Schema: public; Owner: interop
--

SELECT pg_catalog.setval('test_header_case_test_header_case_id_seq', 7, true);


--
-- Data for Name: test_result; Type: TABLE DATA; Schema: public; Owner: interop
--

COPY test_result (test_result_id, product_1_id, product_2_id, test_header_case_id, test_case_id, result, description, etat, test_user_id, usercre, usermaj, datecre, datemaj) FROM stdin;
1	1	2	1	1	1	All is ok	3	1	\N	\N	2016-04-22	\N
2	3	2	1	1	0	Dont work	3	1	\N	\N	2016-04-22	\N
3	3	2	1	1	1	All is ok	3	1	\N	\N	2016-04-22	\N
4	3	8	1	1	1	All is ok	3	1	\N	\N	2016-04-22	\N
5	4	9	1	1	0	Dont work	3	1	\N	\N	2016-04-22	\N
6	1	3	7	\N	1		3	99	\N	\N	2016-07-03	\N
7	3	12	7	\N	0		3	99	\N	\N	2016-07-03	\N
8	2	5	7	\N	1	ze	3	99	\N	\N	2016-07-03	\N
9	1	4	7	\N	1	qsdc	3	1	\N	\N	2016-07-03	\N
10	1	12	7	\N	1		3	1	\N	\N	2016-07-03	\N
11	1	13	7	\N	1	qw	3	1	\N	\N	2016-07-03	\N
12	1	2	7	\N	1	b	3	1	\N	\N	2016-07-03	\N
13	1	5	7	\N	1	s	3	\N	\N	\N	2016-07-03	\N
14	1	5	7	\N	1	sdcqd	3	2	\N	\N	2016-07-03	\N
15	1	1	1	\N	1		3	2	\N	\N	2016-07-06	\N
16	1	1	1	\N	0		3	2	\N	\N	2016-07-06	\N
17	1	1	1	\N	1	kjhgh	3	2	\N	\N	2016-07-06	\N
18	4	4	1	\N	1		3	2	\N	\N	2016-07-06	\N
19	3	3	1	\N	1		3	2	\N	\N	2016-07-06	\N
20	3	3	1	\N	0		3	2	\N	\N	2016-07-06	\N
\.


--
-- Name: test_result_test_result_id_seq; Type: SEQUENCE SET; Schema: public; Owner: interop
--

SELECT pg_catalog.setval('test_result_test_result_id_seq', 20, true);


--
-- Data for Name: test_user; Type: TABLE DATA; Schema: public; Owner: interop
--

COPY test_user (test_user_id, name, email, password, product_id, user_sso_id, etat, usercre, usermaj, datecre, datemaj) FROM stdin;
1	Dinsic                          	jerome.ploquin@modernisation.gouv.fr                                                                                            	fanfaronfanfaron	\N	\N	3	\N	\N	2016-07-03	\N
2	jploquin                        	jerome.ploquin@modernisation.gouv.fr                                                                                            	\N	\N	645	3	\N	\N	2016-07-03	\N
3	jploquin                        	jerome.ploquin@modernisation.gouv.fr                                                                                            	\N	\N	645	3	\N	\N	2016-07-03	\N
4	jploquin                        	jerome.ploquin@modernisation.gouv.fr                                                                                            	\N	\N	645	3	\N	\N	2016-07-03	\N
5	jploquin                        	jerome.ploquin@modernisation.gouv.fr                                                                                            	\N	\N	645	3	\N	\N	2016-07-03	\N
6	jploquin                        	jerome.ploquin@modernisation.gouv.fr                                                                                            	\N	\N	645	3	\N	\N	2016-07-03	\N
7	jploquin                        	jerome.ploquin@modernisation.gouv.fr                                                                                            	\N	\N	645	3	\N	\N	2016-07-03	\N
8	jploquin                        	jerome.ploquin@modernisation.gouv.fr                                                                                            	\N	\N	645	3	\N	\N	2016-07-03	\N
9	jploquin                        	jerome.ploquin@modernisation.gouv.fr                                                                                            	\N	\N	645	3	\N	\N	2016-07-03	\N
10	jploquin                        	jerome.ploquin@modernisation.gouv.fr                                                                                            	\N	\N	645	3	\N	\N	2016-07-03	\N
11	jploquin                        	jerome.ploquin@modernisation.gouv.fr                                                                                            	\N	\N	645	3	\N	\N	2016-07-03	\N
12	jploquin                        	jerome.ploquin@modernisation.gouv.fr                                                                                            	\N	\N	645	3	\N	\N	2016-07-03	\N
\.


--
-- Name: test_user_test_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: interop
--

SELECT pg_catalog.setval('test_user_test_user_id_seq', 12, true);


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

