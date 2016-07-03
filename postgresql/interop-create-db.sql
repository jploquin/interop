\c interop interop
drop table if exists product; 
drop table if exists provider; 
drop table if exists test_category; 
drop table if exists test_header_case; 
drop table if exists test_case; 
drop table if exists test_result; 
drop table if exists test_user; 


create table product 
(
	product_id serial  primary key,
	provider_id integer,
	name char(32),
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
	description varchar(512),
	expected_result varchar(512),
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
insert into test_category (name) values ('Folders'); 
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
    

insert into test_user (name,email,password,etat) values ('Dinsic','jerome.ploquin@modernisation.gouv.fr','fanfaronfanfaron',3);
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















/*
insert into product(name) values ('');
insert into product(name) values ('');
insert into product(name) values ('');
insert into product(name) values ('');












insert into  () values ();
insert into  () values ();
insert into  () values ();
insert into  () values ();
insert into  () values ();
*/


