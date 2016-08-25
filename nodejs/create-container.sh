sudo docker run --restart="on-failure" --detach --name interop-nodejs -p 8080:8080 --link c_interop-postgres:interop-postgres interop-nodejs
