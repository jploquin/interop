\c interop interop
/* change name of category encrypted mails */
update test_category set name='Security' where test_category_id=1;
update test_category set name='Collaborative' where test_category_id=6;
delete from test_category where test_category_id=7;
insert into test_category (name) values ('Tasks');
