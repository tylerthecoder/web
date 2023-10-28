copy-envs:
	scp apps/web/.env plato:/root/apps/web-mono/apps/web/.env
	scp pm2-ecosystem.config.js plato:/root/apps/web-mono

deploy:
	ssh plato "cd /root/apps/web-mono && git pull"
	ssh plato "bash /root/apps/web-mono/scripts/prod-deploy.sh"
