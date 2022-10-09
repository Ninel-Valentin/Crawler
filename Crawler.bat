@echo off
echo Welcome! Before proceeding please read the README.txt file while the program checks for Node.js and npm.
echo Opening the README.txt file...
start README.txt
@echo off
for /f %%i in ('node -v') do set VERSION=%%i 
echo Checking for the Node.js version...
if "%VERSION%" == "" (
	echo It seems like there's a problem with your node version. It is recommanded to install it from https://nodejs.org/en/download/.
	) else (
	echo Node.js found!)
for /f %%i in ('npm -v') do set VERSION=%%i 
echo Checking for the npm version...
if "%VERSION%" == "" (
	echo It seems like there's a problem with your npm version. It is recommanded to reinstall Node.js.
	) else (
	echo npm found!)
@pause
echo The crawler is prepared to start!
@pause
cd EmagCrawler
echo Starting the crawler...
cmd /c "apify run -p"
echo Finished! Displaying results...
start apify_storage\datasets\default
@pause
exit