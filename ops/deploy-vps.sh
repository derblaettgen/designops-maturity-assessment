#!/usr/bin/env bash
set -euo pipefail

deploy_sha=${1:-}
app_root=/srv/apps/designops
source_dir="$app_root/source"
env_file=/etc/designops/compose.env
release_file=/var/lib/designops/compose-release

case "$deploy_sha" in
  ''|*[!0-9a-f]*) echo "Invalid deployment SHA" >&2; exit 10 ;;
esac
if [[ ${#deploy_sha} -ne 40 ]]; then
  echo "Deployment SHA must contain 40 hexadecimal characters" >&2
  exit 11
fi
if [[ $(git -C "$source_dir" rev-parse HEAD) != "$deploy_sha" ]]; then
  echo "The deployment checkout does not match $deploy_sha" >&2
  exit 12
fi
if [[ ! -f "$env_file" ]]; then
  echo "Missing server-managed Compose environment file" >&2
  exit 13
fi

compose() {
  local release=$1
  shift
  RELEASE="$release" docker compose \
    --project-directory "$source_dir" --env-file "$env_file" "$@"
}

published_port() {
  compose "$deploy_sha" port "$1" "$2" | sed 's/.*://'
}

verify() {
  local api_port
  api_port=$(published_port api 3101)
  curl --fail --silent --show-error \
    "http://127.0.0.1:$api_port/api/v1/health" >/dev/null &&
  curl --fail --silent --show-error \
    "http://127.0.0.1:$api_port/api/v1/survey/stats" >/dev/null &&
  curl --fail --silent --show-error \
    --resolve designops-maturity.de:443:127.0.0.1 \
    https://designops-maturity.de/survey/ >/dev/null &&
  curl --fail --silent --show-error \
    --resolve designops-maturity.de:443:127.0.0.1 \
    https://designops-maturity.de/api/v1/health >/dev/null
}

previous=$(cat "$release_file" 2>/dev/null || true)

# Build before touching the running containers: a failed build changes nothing.
compose "$deploy_sha" build

rollback() {
  echo "Deployment verification failed" >&2
  if [[ -n "$previous" && "$previous" != "$deploy_sha" ]]; then
    echo "Restoring release $previous" >&2
    compose "$previous" up --detach --wait --no-build || true
  fi
}

# Only containers whose image or configuration changed are recreated; the
# MongoDB container and its volume are left alone by ordinary releases.
if ! compose "$deploy_sha" up --detach --wait --no-build --remove-orphans; then
  rollback
  exit 20
fi
if ! verify; then
  rollback
  exit 21
fi

printf '%s\n' "$deploy_sha" > "$release_file"

# Keep the current and the previous release images; drop older ones.
for repository in designops-web designops-api; do
  docker image ls --format '{{.Tag}}' "$repository" | while read -r tag; do
    if [[ "$tag" != "$deploy_sha" && "$tag" != "$previous" ]]; then
      docker image rm "$repository:$tag" >/dev/null 2>&1 || true
    fi
  done
done
docker builder prune --force --filter until=168h >/dev/null 2>&1 || true

echo "Deployed $deploy_sha"
