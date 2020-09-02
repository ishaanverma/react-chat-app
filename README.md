# React Chat App using socket.io

### Database Setup:<br/>
`docker run --name postgres -e POSTGRES_PASSWORD=postgres POSTGRES_DB=postgresdb-chat -p 5432:5432 -d postgres` <br/>

### React Setup: <br/>
`cd frontend/` <br/>
`yarn install` or `npm install`

### Server Setup: <br/>
`cd server/` <br/>
`yarn install` or `npm install` <br/>
Make sure to uncomment `sequelize.sync()` in `server.js` when running for the first time.
