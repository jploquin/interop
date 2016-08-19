\c interop interop

insert into  static_stats (
        nb_products,
        nb_categories,
        nb_tests,
        nb_execute,
        nb_execute_failed,
        nb_execute_succeeded)

select 
        nb_products,
        nb_categories,
        nb_tests,
        nb_execute,
        nb_execute_failed,
        nb_execute_succeeded
from stats;

