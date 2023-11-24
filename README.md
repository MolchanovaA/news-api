# Northcoders News API

Welcome to API creator!

You can check this code locally on your machine or do it online.

Online check:

1. link to GitHub: https://github.com/MolchanovaA/news-api
2. Hosting: https://molchanova-nc-news.onrender.com

This project has been created with node.js, porstgreSQL, tested by jest + supertest.
General list of endpoints listed here: https://molchanova-nc-news.onrender.com/api or in "endpoints.json" file.

You can request for list of articles, users, delete comments, patch articles.

If you would like to run this API creator, please follow instructions:

1. Fork git repo from here https://molchanova-nc-news.onrender.com/ to your github; If you press 'fork" on right conner under green 'CODE' button it allows you to create you yourn repo from this project. That what we need.
2. Copy HTTPS link from your github project;
3. Open terminal on your VS code in empty folder, type "git clone <URL>" . Please paste link from p.2 (your forked project url) to this command (replace URL).
4. In order to connect to DB, please create 2 files '.env' in root folder:

a. name:.env.test
add content: PGDATABASE=nc_news_test

b. name:.env.development
add content: PGDATABASE=nc_news

5. In your terminal print :
   npm run dev
   This will install all modules for the application;
6. In your terminal print :
   npm run setup-dbs
   This will setup databases locally.

7. For running DB test environment you have to print
   npm run seed

   For running this in prod, please type:
   npm run seed-prod

8. To check test cases :
   npm run test

This runs with node v20.8.0 and postgreSQL 14.
