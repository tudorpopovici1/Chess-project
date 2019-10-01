var express = require("express");
var http = require("http");
var websocket = require("ws");
var Game = require("./game");
var gameStats = require("./gameStatus");
var url = require("url");
var app = express();

app.set("view engine", "ejs");

app.use(express.static(__dirname + '/static'));

var server = http.createServer(app);

const wss = new websocket.Server({ server });	

app.get('/', function(req, res){

	res.render("splash.ejs", {

		gamesInitialized: gameStats.gamesInitialized,
		playersOnline: gameStats.playersOnline,
		gamesCompleted: gameStats.gamesCompleted,
		playersOpponent: gameStats.opponent

	});

});



app.get('/game', function(req, res){

	res.sendFile(__dirname + "/static/game.html");

	
});

websockets = [];

var currentGame = new Game(gameStats.gamesInitialized);

var connectionID = 0;

currentGame.setGameID(gameStats.gamesInitialized);

var state = null;

wss.on("connection", function(ws) {

	let con = ws;

	var msg = new Object();

	console.log("SECOND");

	con.id = connectionID++;

	gameStats.playersOnline++;

	if(currentGame.gameState == "0")
	{
		gameStats.opponent++;

		msg.type = "initGame";
		msg.gameStatus = "1";
		msg.playerType = "B"; 
		msg.gameID = currentGame.getGameID();
		con.send(JSON.stringify(msg));

		var msgTurn = new Object();
		msgTurn.type = "playerTurn";
		msgTurn.playerTurn = true;

		con.send(JSON.stringify(msgTurn));

		currentGame.setPlayerB(con);
		currentGame.setGameState("1");
		state = "1";
	}
	else if(currentGame.gameState == "1")
	{
		gameStats.opponent--;

		msg.type = "initGame";
		msg.gameStatus = "2";
		msg.playerType = "A";
		msg.gameID = currentGame.getGameID();
		con.send(JSON.stringify(msg));

		currentGame.setPlayerA(con);
		currentGame.setGameState("2");
		
		websockets.push(currentGame);

		var message = new Object();
		message.type = "gameState";
		message.data = "2";

		websockets[currentGame.getGameID()].playerB.send(JSON.stringify(message));

		var msgTurn = new Object();
		msgTurn.type = "playerTurn";
		msgTurn.playerTurn = false;

		con.send(JSON.stringify(msgTurn));

		currentGame = new Game(gameStats.gamesInitialized++);
		currentGame.setGameID(gameStats.gamesInitialized);

		state = null;
	}

	

  	ws.on("message", function(message){
  		
  		var msgIncoming = JSON.parse(message);

  		if(msgIncoming.type == "infoPieces")
  		{
  			var pieces = msgIncoming.pieces;
  			var playerType = msgIncoming.playerType;
  			var gameID = msgIncoming.gameID;

  			var newMsg = new Object();
  			newMsg.type = "infoPieces";
  			newMsg.pieces = pieces;

  			if(playerType == "A")
  			{
  				websockets[gameID].playerB.send(JSON.stringify(newMsg));
  			}
  			else if(playerType == "B")
  			{
  				websockets[gameID].playerA.send(JSON.stringify(newMsg));
  			}
  		}
  			
  		


  		if(msgIncoming.type == "wonGame")
  		{
  			var playerType = msgIncoming.playerType;
  			var message = msgIncoming.message;
  			var gameID = msgIncoming.gameID;

  			var msg = new Object();

  			if(playerType == "A")
  			{
  				if(message == "CheckMate")
  				{
  					msg.type = "CheckMate";
  					gameStats.gamesInitialized--;
  				}
  				else
  				{
  					msg.type = "Check";
  				}

  				websockets[gameID].playerB.send(JSON.stringify(msg));
  			}
  			else if(playerType == "B")
  			{
  				if(message == "CheckMate")
  				{
  					msg.type = "CheckMate";
  					gameStats.gamesInitialized--;
  				}
  				else
  				{
  					msg.type = "Check";
  				}

  				websockets[gameID].playerA.send(JSON.stringify(msg));
  			}
  		}


  		if(msgIncoming.type == "playerMatrix")
  		{
  			var newMessage = new Object();
  			var matrix = msgIncoming.matrix;
  			var gameID = msgIncoming.gameID;
  			var playerType = msgIncoming.playerType;

  			var playerTurn = msgIncoming.playerTurn;

  			var turnToSend;

  			if(playerTurn == false)
  			{
  				turnToSend = true;
  			}
  			else
  				turnToSend = false;

  			var mseg = new Object();
  			mseg.type = "playerTurn";
  			mseg.playerTurn = turnToSend;

  			ws.send(JSON.stringify(mseg));

  			var con;

  			if(playerType == "A")
  			{
  				con = websockets[gameID].playerB;	
  			}
  			else if(playerType == "B")
  			{
  				con = websockets[gameID].playerA;
  			}

  			newMessage.matrix = matrix;
  			newMessage.type = "responseMatrix";

  			con.send(JSON.stringify(newMessage));


  			var mseg = new Object();
  			mseg.type = "playerTurn";
  			mseg.playerTurn = turnToSend+1;
  			con.send(JSON.stringify(mseg));
  		}

  		if(msgIncoming.type == "checkB")
  		{
  			var msgOutgoing = new Object();

  			msgOutgoing.type = "checkB";
  			var gameID = msgIncoming.gameID;

  			websockets[gameID].playerA.send(JSON.stringify(msgOutgoing));
  		}

  		if(msgIncoming.type == "checkA")
  		{
  			var msgOutgoing = new Object();

  			msgOutgoing.type = "checkA";
  			var gameID = msgIncoming.gameID;

  			websockets[gameID].playerB.send(JSON.stringify(msgOutgoing));
  		}

  	});

  	ws.on("close", function(errCode){

  		gameStats.playersOnline--;


  		if(errCode == "1001")
  		{
  			var infoCon = getWebSocket(con.id);

  			if(infoCon != null)
  			{

  				var messageOutgoing = new Object();
  				messageOutgoing.type = "ABORTED";

	  			var placeCon = infoCon.place;
	  			var typeCon = infoCon.type;

	  			// playerB won, aborted, playerA aborted.
	  			if(typeCon == "A")
	  			{
	  				gameStats.gamesInitialized--;
	  				websockets[placeCon].playerB.send(JSON.stringify(messageOutgoing));
	  				websockets[placeCon].playerB.close();
	  			}
	  			else		//playerA won, aborted by playerB.
	  			{
	  				gameStats.gamesInitialized--;
	  				websockets[placeCon].playerA.send(JSON.stringify(messageOutgoing));
	  				websockets[placeCon].playerA.close();
	  			}

	  			gameStats.gamesCompleted++;

	  			ws.close();

	  		}
	  		else
	  			return;
  		}
  	});
});



function getWebSocket(id)
{
	for(let i = 0; i < websockets.length; i++)
	{
		if(websockets[i].playerA.id == id)
		{
			return{
				place: i,
				type: "A"
			};
		}
		else if(websockets[i].playerB.id == id)
		{
			return{
				place: i,
				type: "B"
			};
		}
	}

	return null;
}

server.listen(8080);