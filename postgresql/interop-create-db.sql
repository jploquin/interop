\c interop interop
/* drop view if exists test_header_case_result;
drop view if exists stats;
*/
drop table if exists param;
drop table if exists product cascade; 
drop table if exists provider cascade; 
drop table if exists test_category cascade; 
drop table if exists test_header_case cascade; 
drop table if exists test_case cascade; 
drop table if exists test_result cascade; 
drop table if exists test_user cascade; 
drop table if exists authorized_vertical_test;


create table param
(
	param_id serial  primary key,
	reference char(32),
	value integer,
	name char(32),
	etat smallint default 3,
	cre_test_user_id integer,
	maj_test_user_id integer,
	usercre char(32),
	usermaj char(32),
	datecre Date default current_timestamp,
	datemaj Date);

insert into param (reference, value, name) values ('component_type',0,'Backend');
insert into param (reference, value, name) values ('component_type',1,'Desktop app');
insert into param (reference, value, name) values ('component_type',2,'Webmail');
insert into param (reference, value, name) values ('component_type',3,'Mobile app');
insert into param (reference, value, name) values ('component_type',4,'Accessibility app');

create table authorized_vertical_test 
(
	authorized_vertical_test_id serial  primary key,
	from_value smallint,
	to_value smallint,
	etat smallint default 3,
	cre_test_user_id integer,
	maj_test_user_id integer,
	usercre char(32),
	usermaj char(32),
	datecre Date default current_timestamp,
	datemaj Date);

insert into authorized_vertical_test (from_value, to_value) values (4,3);
insert into authorized_vertical_test (from_value, to_value) values (4,2);
insert into authorized_vertical_test (from_value, to_value) values (4,1);
insert into authorized_vertical_test (from_value, to_value) values (3,0);
insert into authorized_vertical_test (from_value, to_value) values (2,0);
insert into authorized_vertical_test (from_value, to_value) values (1,0);







create table product 
(
	product_id serial  primary key,
	provider_id integer,
	name char(32),
	product_type smallint default 0,/* 0=Poduct, 1=Component */
	component_type smallint default 0, 
	description varchar(512),
	product_access varchar(1024),
	product_access_url varchar(256),
	etat smallint default 3,
	cre_test_user_id integer,
	maj_test_user_id integer,
	usercre char(32),
	usermaj char(32),
	datecre Date default current_timestamp,
	datemaj Date);

create table provider 
(
	provider_id serial  primary key,
	name char(32),
	description varchar(512),
	etat smallint default 3,
	cre_test_user_id integer,
	maj_test_user_id integer,
	usercre char(32),
	usermaj char(32),
	datecre Date default current_timestamp,
	datemaj Date);


create table test_category
(
	test_category_id serial  primary key,
	name char(32),
	description varchar(512),
	etat smallint default 3,
	cre_test_user_id integer,
	maj_test_user_id integer,
	usercre char(32),
	usermaj char(32),
	datecre Date default current_timestamp,
	datemaj Date);


create table test_header_case  
(
	test_header_case_id serial  primary key,
	test_category_id integer,
	name char(32),
  single_product_test smallint, /* obsolete */
	test_type smallint default 0, /* 0=horizontal, 1= vertical */
	vertical_from_test_type smallint default 4, 
	vertical_to_test_type smallint default 1,
	etat smallint default 3,
	cre_test_user_id integer,
	maj_test_user_id integer,
	usercre char(32),
	usermaj char(32),
	datecre Date default current_timestamp,
	datemaj Date);


create table  test_case
(
	test_case_id serial  primary key,
	test_header_case_id integer,
	description varchar(8224),
	expected_result varchar(8224),
	version char(32),
	etat smallint default 3,
	cre_test_user_id integer,
	maj_test_user_id integer,
	usercre char(32),
	usermaj char(32),
	datecre Date default current_timestamp,
	datemaj Date);


create table test_result 
(
	test_result_id serial  primary key,
	product_1_id integer,
	product_2_id integer,
	test_header_case_id integer,
	test_case_id integer,
	result smallint,
	description varchar(512),
	etat smallint default 3,
	test_user_id integer,
	usercre char(32),
	usermaj char(32),
	datecre Date default current_timestamp,
	datemaj Date);
create table  test_user
(
	test_user_id serial  primary key,
	name char(32),
	email char(128),
	password varchar(128),
	product_id integer,
  user_sso_id integer,
	etat smallint default 3,
	usercre char(32),
	usermaj char(32),
	datecre Date default current_timestamp,
	datemaj Date);


create or replace view test_header_case_result (test_result_id,test_header_case_id,product_1_id,product_2_id)                                                                                               as select max(test_result_id),test_header_case_id,product_1_id,product_2_id from test_result where etat <>99 group by test_header_case_id,product_1_id, product_2_id;

/*create or replace view test_header_case_result (test_result_id,product_1_id,product_2_id)
as select max(test_result_id),product_1_id,product_2_id from test_result where etat <>99 group by product_1_id, product_2_id;
*/

create or replace view stats (nb_products,nb_components,nb_categories,nb_tests,nb_execute,nb_execute_failed,nb_execute_succeeded)
as select
(select count(*) from product where product_type=0 and etat <>99),
(select count(*) from product where product_type=1 and etat <>99),
(select count(*) from test_category where etat<>99),
(select count(*) from test_header_case where etat<>99),
(select count(*) from test_result where etat<>99),
(select count(*) from test_result r, test_header_case_result h where r.test_result_id=h.test_result_id and r.etat<>99 and r.result=0),
(select count(*) from test_result r, test_header_case_result h where r.test_result_id=h.test_result_id and r.etat<>99 and r.result=1);

insert into provider(name) values ('Alinto');

create table static_stats (
        statics_stat_id serial  primary key,
	nb_products integer,
	nb_components integer,
	nb_categories integer,
	nb_tests integer,
	nb_execute integer,
	nb_execute_failed integer,
	nb_execute_succeeded integer,
        etat smallint default 3,
        usercre char(32),
        usermaj char(32),
        datecre Date default current_timestamp,
        datemaj Date);


insert into provider(name) values ('Alinto');
insert into provider(name) values ('Aduneo');
insert into provider(name) values ('Bluemind');
insert into provider(name) values ('Exo');
insert into provider(name) values ('BlackBerry');
insert into provider(name) values ('IBM');
insert into provider(name) values ('Kolab');
insert into provider(name) values ('Linagora');
insert into provider(name) values ('BlackBerry');
insert into provider(name) values ('Microsoft');
insert into provider(name) values ('Netixia');
insert into provider(name) values ('Open xchange');
insert into provider(name) values ('Wordline');




insert into product(name,provider_id, product_access_url, product_access) select 'Alinto', provider_id,
' https://amsp.alinto.net/wmm/login.form',
'DelphineDurand ddurand@amsp.alinto.net /Alinto2016 
PhilippeMartin pmartin@amsp.alinto.net /Alinto2016
EmilieDuclos educlos@amsp.alinto.net /Alinto2016
Pierre Grangier pgrangier@amsp.alinto.net /Alinto2016
Olivier Flandin oflandin@amsp.alinto.net /Alinto2016
Compte de ressource : marketing@amsp.alinto.net /Alinto2016

acces imap/smtp/pop
imap.amsp.alinto.net
pop.amsp.alinto.net
smtp.amsp.alinto.net'
 from provider where name='Alinto';
insert into product(name,provider_id) select 'Microsoft Exchange', 
		provider_id from provider where name='Aduneo';
   
   
insert into product(name,provider_id, product_access_url, product_access) select 'Bluemind', provider_id,
'https://etalab.bluemind.net',
'victor@etalab.bluemind.net
hector@etalab.bluemind.net
edgar@etalab.bluemind.net
charles@etalab.bluemind.net
alexandre@etalab.bluemind.net
alexis@etalab.bluemind.net
clement@etalab.bluemind.net
david@etalab.bluemind.net                             
vincent@etalab.bluemind.net' 
 from provider where name='Bluemind';
insert into product(name,provider_id) select 'Exo platform', 
		provider_id from provider where name='Exo';
insert into product(name,provider_id) select 'Good works', 
		provider_id from provider where name='Blackberry';
insert into product(name,provider_id) select 'OBM', 
		provider_id from provider where name='Linagora';
insert into product(name,provider_id) select 'Open PaaS', 
		provider_id from provider where name='Linagora';
insert into product(name,provider_id) select 'Office 365', 
		provider_id from provider where name='Microsoft';
insert into product(name,provider_id) select 'Yaziba', 
		provider_id from provider where name='Netixia';
insert into product(name,provider_id) select 'Zimbra', 
		provider_id from provider where name='Netixia';
insert into product(name,provider_id) select 'OxApp', 
		provider_id from provider where name='Open xchange';
insert into product(name,provider_id) select 'WL Business mail', 
		provider_id from provider where name='Wordline';
insert into product(name,provider_id) select 'GoLive!', 
		provider_id from provider where name='Wordline';
insert into product(name,provider_id) select 'IBM Verse', 
		provider_id from provider where name='IBM';


insert into test_category (name) values ('Encrypted Emails'); 
insert into test_category (name) values ('Calendar'); 
insert into test_category (name) values ('Simple Emails'); 
insert into test_category (name) values ('Contacts'); 
insert into test_category (name) values ('Accessibility'); 
insert into test_category (name) values ('Shared folders'); 
insert into test_category (name) values ('Instant messaging'); 

insert into test_header_case (test_category_id,name) values (2,'accept and deny');
insert into test_case (test_header_case_id,description)
	values (1,'The receiver has to accept and deny two differents events');
insert into test_header_case (test_category_id,name) values (2,'calendar sharing external');
insert into test_case (test_header_case_id,description)
	values (2,' The sender has to send a calendar sharing to the receiver.
  In general, the sender has to give an url for the calendar.');
insert into test_header_case (test_category_id,name) values (2,'private spread');
insert into test_case (test_header_case_id,description)
	values (3,'When receiver accept an invitation for an event, he has to put it with the
  private status ( only him can see what is this event).');
insert into test_header_case (test_category_id,name) values (2,'reccurent');
insert into test_case (test_header_case_id,description)
	values (4,'This event must be recurrent.
  When sender invit the receiver, he has to put this option and with this, this
  two users will see the same events several time in their calendar.');
insert into test_header_case (test_category_id,name) values (2,'send and receive events');
insert into test_case (test_header_case_id,description)
	values (5,'The sender has to send 4 invitation of an evenement to a receiver.');
insert into test_header_case (test_category_id,name) values (2,'set provisionnal');
insert into test_case (test_header_case_id,description)
	values (6,'The receiver has to answer "provisional" to an events invitation');
    

insert into test_user (name,email,password,user_sso_id,etat) values ('Dinsic','jerome.ploquin@modernisation.gouv.fr','fanfaronfanfaron',645,3);
/*
insert into test_result (product_1_id, product_2_id,test_header_case_id, test_case_id, result, description, test_user_id, datecre) 
values (1,2,1,1,1,'All is ok',1, '20160422'); 

insert into test_result (product_1_id, product_2_id,test_header_case_id, test_case_id, result, description, test_user_id, datecre) 
values (3,2,1,1,0,'Dont work',1, '20160422');  

insert into test_result (product_1_id, product_2_id,test_header_case_id, test_case_id, result, description, test_user_id, datecre) 
values (3,2,1,1,1,'All is ok',1, '20160422');  


insert into test_result (product_1_id, product_2_id,test_header_case_id, test_case_id, result, description, test_user_id, datecre) 
values (3,8,1,1,1,'All is ok',1, '20160422');  

insert into test_result (product_1_id, product_2_id,test_header_case_id, test_case_id, result, description, test_user_id, datecre) 
values (4,9,1,1,0,'Dont work',1, '20160422');  
*/














/*
insert into product(name) values ('');
insert into product(name) values ('');
insert into product(name) values ('');
insert into product(name) values ('');



