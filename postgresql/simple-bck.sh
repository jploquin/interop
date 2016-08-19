sudo docker run -i --rm --link c_interop-postgres:c_interop-postgres postgres pg_dump -c --insert -h c_interop-postgres -U interop interop 
