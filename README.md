docker system prune -a
docker build --no-cache -t aisnk .

docker save -o aisnk.tar aisnk
docker load -i aisnk.tar
