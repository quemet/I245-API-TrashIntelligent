FROM mysql

ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_USER=admin
ENV MYSQL_PASSWORD=admin
ENV MYSQL_DATABASE=db_todolist

COPY ./script.sql /docker-entrypoint-initdb.d/script.sql

RUN chown -R mysql:mysql /docker-entrypoint-initdb.d/

CMD ["mysqld", "--character-set-server=utf8mb4", "--collation-server=utf8mb4_unicode_ci"]
