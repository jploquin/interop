\c interop interop
/* add kollab solution */
insert into product(name,provider_id) select 'Kolab', 
		provider_id from provider where name='Kolab';


