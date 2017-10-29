%~d0
cd "%~dp0"
node.exe node_modules\typescript\lib\tsc.js -p .
copy src\AllDownload.js AllDownload.js
