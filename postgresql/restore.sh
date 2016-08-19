if test -z "$1"
then
  echo 'please enter a file name'
else
cat $1 | sudo docker run -i --rm --link c_interop-postgres:c_interop-postgres postgres psql -h c_interop-postgres -U interop 
fi
