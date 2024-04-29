# Betta Fish Shop Server

Shop.sql file in the sql directory contains sample data for db. To install it, you need MYSQL server. My recommendation is Open Server (for free). In phpmyadmin import sql dump.

In src/db directory you need to create config.js file with sql connection information:

export const config = {

db: {

    host: 'SQL host', // ex. localhost

    user: 'SQL user', // ex. db_login_user

    password: 'SQL password', // ex. db_password

    database: 'SQL database', // ex. Shop

    connectTimeout: 60000,

},

};

## Project installation:

### yarn:

-   <code>yarn install</code> to install all project dependencies;
-   <code>yarn start</code> to run the local server;

### npm:

-   <code>npm install</code> to install all project dependencies;
-   <code>npm run start</code> to run the local server;
