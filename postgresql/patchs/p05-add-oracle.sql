\c interop interop
/* add kollab solution */
insert into provider (name) values ('Oracle');
insert into product(name,provider_id) select 'UCS', 
		provider_id from provider where name='Oracle';


