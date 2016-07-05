if test -z "$1"
then
  echo 'please enter a password as parameter'
else

  # create data container using the postgres image, give it a name so you can access it
  sudo docker run --name pgdata interop-postgres -e POSTGRES_PASSWORD=$1 echo "data only"
  # it is now important to never run `docker rm pgdata` (not that it looks like a command you should run)
fi
