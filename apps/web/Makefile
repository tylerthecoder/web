deploy:
# Move to root directory
	cd "$(dirname "$0")"
# Copy all project files to pi
	rsync -av . \
	--exclude ".vscode" \
	--exclude ".next" \
	--exclude ".vercel" \
	--exclude "node_modules" \
	 pi:~/dev/website/
# Run Deploy Command
	ssh pi "sudo -u pi ~/owl/home-pi/start-eco.sh"
