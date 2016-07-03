# create data container using the postgres image, give it a name so you can access it
sudo docker run --name pgdata interop-postgres -e POSTGRES_PASSWORD=figaront echo "data only"
# it is now important to never run `docker rm pgdata` (not that it looks like a command you should run)
