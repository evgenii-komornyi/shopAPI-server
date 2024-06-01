# Betta Fish Shop Server

Shop.sql file in the sql directory contains sample data for db. To install it, you need MYSQL server. My recommendation is Open Server (for free). In phpmyadmin import sql dump.

You have to have the .env file in root server project folder with:

-   Development environment variables: <code>
    DEV_DB_HOST=host
    DEV_DB_DATABASE=database
    DEV_DB_USERNAME=user
    DEV_DB_PASSWORD=password
    </code>
-   Production environment variables: <code>
    PROD_DB_HOST=host_path where database is located
    PROD_DB_DATABASE=database_name
    PROD_DB_USERNAME=username
    PROD_DB_PASSWORD=user_password
    </code>

### Important

In the /src/db/dbConnection.ts file on the 36th line you need to choose production or development property.

<code>connection = await createConnection(config.production.db);</code>

If you have an access to production db connection, you have to add your public ip to trust resources on the hosting into whitelist.

## Project installation:

### yarn:

-   <code>yarn install</code> to install all project dependencies;
-   <code>yarn start</code> to run the local server;

### npm:

-   <code>npm install</code> to install all project dependencies;
-   <code>npm run start</code> to run the local server;
