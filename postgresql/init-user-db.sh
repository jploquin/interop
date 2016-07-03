#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE USER interop PASSWORD 'fanfaron';
    CREATE DATABASE interop;
    GRANT ALL PRIVILEGES ON DATABASE interop TO interop;
EOSQL
