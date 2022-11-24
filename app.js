const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const dbConnection = async () => {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
};
dbConnection();
app.get("/players/", async (request, response) => {
  try {
    const getQuery = `
        select player_id as playerId, player_name as playerName,
        jersey_number as jerseyNumber, role from cricket_team;`;
    const res = await db.all(getQuery);
    response.send(res);
  } catch (e) {
    console.log(e.message);
  }
});
app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const postQuery = `
     insert into cricket_team(player_name, jersey_number, role)
      values("${playerName}", ${jerseyNumber}, "${role}");`;
  const res = await db.run(postQuery);
  response.send("Player Added to Team");
});
app.get("/players/:playerId/", async (request, response) => {
  try {
    const { playerId } = request.params;
    console.log(playerId);
    const getQuery = `
        select player_id as playerId, player_name as playerName,
        jersey_number as jerseyNumber, role from cricket_team
        where playerId = ${playerId}; `;
    const res = await db.get(getQuery);
    response.send(res);
  } catch (e) {
    console.log(e.message);
  }
});
app.put("/players/:playerId/", async (request, response) => {
  try {
    const { playerId } = request.params;
    const { playerName, jerseyNumber, role } = request.body;
    const putQuery = `
            update cricket_team
            set 
                player_name = "${playerName}",
                jersey_number = ${jerseyNumber},
                role = "${role}"
            where player_id = ${playerId};`;
    await db.run(putQuery);
    response.send("Player Details Updated");
  } catch (e) {
    console.log(e.message);
  }
});
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `
        delete from cricket_team
        where player_id = ${playerId};`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});
app.listen(3000);
module.exports = app;
