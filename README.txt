Welcome! Hopefully everything will work well!
The code was modified after the HelloWorld template while following the tutorial
of the Apify SDK https://sdk.apify.com/docs/guides/getting-started

The main directory contains:
~ the root-folder of the project
~ this README.txt file
~ a Crawler.bat file to run the program

Below you have the instructions to run the crawler for https://www.emag.ro :

======================== INSTRUCTIONS ========================

1. Open up the Crawler.bat file.
	~ It will output some text regarding reading this file;

2. The console will output a prompt asking for the login token.
	~ Copy apify_api_RFvKA0i6G3ZPoW0pvUadu7a9grj2e20DQnUO and
	paste it (Right Click) in the console;

3. The crawler has a limit of 100 links to crawl inside the code, it can be found at:
	~ ...\EmagCrawler\main.js (line 16);
	~ the limit can have it's value changed or
	can be removed (it will keep finding links ! CTRL+C in console to stop the crawler);

4. After the crawler finished, all the data is stored in the local storage:
	~ ...\EmagCrawler\apify_storage\datasets\default\
	which will open at the end of the process.