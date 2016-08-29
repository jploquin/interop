insert into static_stats 
(       nb_products,
        nb_components,
        nb_categories,
        nb_tests,
        nb_execute,
        nb_execute_failed,
        nb_execute_succeeded,
	datecre)
 
select 
	nb_products,
        nb_components,
        nb_categories,
        nb_tests,
        nb_execute,
        nb_execute_failed,
        nb_execute_succeeded,
	current_timestamp

 from stats;
