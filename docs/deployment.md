# Production deployment

Production runs as a Docker Compose project named `designops` with three
containers, described in `compose.yaml`:

```text
web    Nginx serving the built frontend under /survey/   127.0.0.1:3103
api    Node.js survey API                                127.0.0.1:3102
mongo  MongoDB 8.0, data in the volume designops_mongo-data (not published)
```

The VPS's own Nginx remains the only public entry point. It terminates TLS for
all domains and proxies `/survey/` to `web` and `/api/v1` to `api`. Published
container ports bind to loopback only, because Docker-published ports bypass
ufw.

```text
/srv/apps/designops/source/        # deployment checkout and build context
/etc/designops/compose.env         # server-only secrets (see .env.example)
/var/lib/designops/compose-release # Git SHA of the running release
/var/backups/designops/            # database dumps
```

## Releases

Every pull request runs the frontend and API tests. Every push to `main` runs
them again and then deploys: the workflow connects to the VPS, fetches the exact
pushed commit into `source`, and runs `ops/deploy-vps.sh`. The script builds
the images tagged with the commit SHA, recreates only the containers that
changed, and verifies the API and the public frontend.

A failed build changes nothing. If startup or verification fails, the script
starts the previous release's images again. The MongoDB container and its
volume are not touched by ordinary releases. Images of the current and the
previous release are kept; older ones are removed.

Never add production secrets to this repository or to a frontend environment
variable.

## Useful checks on the VPS

```bash
cd /srv/apps/designops/source
alias dc='docker compose --env-file /etc/designops/compose.env'
cat /var/lib/designops/compose-release
RELEASE=$(cat /var/lib/designops/compose-release) dc ps
RELEASE=$(cat /var/lib/designops/compose-release) dc logs --tail 100 api
curl --fail http://127.0.0.1:3102/api/v1/health
nginx -t
```

## Database backup and restore

```bash
# Dump
docker exec designops-mongo-1 sh -c 'mongodump -u "$MONGO_INITDB_ROOT_USERNAME" \
  -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin \
  --db survey --archive --gzip' > /var/backups/designops/survey-$(date -u +%Y%m%dT%H%M%SZ).archive.gz

# Restore (replaces the collections contained in the archive)
docker exec -i designops-mongo-1 sh -c 'mongorestore -u "$MONGO_INITDB_ROOT_USERNAME" \
  -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin \
  --archive --gzip --drop' < /var/backups/designops/<archive>
```

Moving to another server means: install Docker, copy `compose.env`, restore a
dump into the new `mongo` container, and point DNS and TLS at the new host.

## Local run

```bash
cp .env.example .env   # fill in values
docker compose up --build
```

The frontend is then at <http://127.0.0.1:3103/survey/>. Its API address is
compiled in (`src/lib/storage.ts`), so a locally built frontend still talks to
the production API unless started with `npm run dev`.
