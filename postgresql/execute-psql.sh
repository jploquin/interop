if test -z "$1"
then
  echo 'please enter a filename'
else
sudo docker run  --rm -v /home/cloud/interop/postgresql:/opt --link c_interop-postgres:c_interop-postgres postgres psql -h c_interop-postgres -U interop -f /opt/$1 
fi 
