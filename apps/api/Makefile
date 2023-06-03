
deploy:
# Move to root directory
	cd "$(dirname "$0")"
# Copy all project files to pi
	rsync -av . \
	--exclude ".vscode" \
	--exclude "node_modules" \
	--exclude "dist" \
	 pi:~/dev/tgtapi/
# Run Deploy Command
	ssh pi "sudo -u pi ~/owl/home-pi/start-eco.sh"