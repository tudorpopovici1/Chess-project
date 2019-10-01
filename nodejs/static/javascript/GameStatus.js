
	var selfObj;

	function GameStatus(GameBoard, gameStatus)
	{
		this.gameBoard = GameBoard;
		this.gameStatus = "0";

		selfObj = this;
	}

	socket = new WebSocket("ws://localhost:8080");

	var stats = document.getElementById("stats-me");

	var stats_op = document.getElementById("stats-op");

	var selfObj2 = selfObj;


	GameStatus.prototype = Object.create(GameBoard.prototype);
	GameStatus.prototype.constructor = GameStatus;


	Object.defineProperty(GameBoard.prototype, "madeMove", {

			set: function(val){
				this._madeMove = val;
				if(this._madeMove == true)
				{
					selfObj.sendMatrix(socket);
				}
			},
			get: function(){
				return this._madeMove;
			}
		});

	Object.defineProperty(GameBoard.prototype, "piecesTaken", {

		set: function(val)
		{
			this._piecesTaken = val;
			stats.innerHTML = "Current number of pieces taken by you: " +val;


			if(this._piecesTaken !=0)
			{
				selfObj.sendPieces(socket);
			}

		},

		get: function()
		{
			return this._piecesTaken;
		}

	});


	GameStatus.prototype.sendPieces = function(socket)
	{
		var msgOutgoing = new Object();

		if(this.gameStatus == "2")
		{
			msgOutgoing.gameID = this.getGameID();
			msgOutgoing.type = "infoPieces";
			msgOutgoing.playerType = this.getPlayerType();
			msgOutgoing.pieces = this.getGameBoard().piecesTaken;

			socket.send(JSON.stringify(msgOutgoing));
		}
	};



	GameStatus.prototype.setGameID = function(gameID)
	{
		this.gameBoard.gameID = gameID;
	};

	GameStatus.prototype.getGameID = function()
	{
		return this.gameBoard.gameID;
	};

	GameStatus.prototype.setGameStatus = function(gameStatus)
	{
		this.gameStatus = gameStatus;
	};

	GameStatus.prototype.getGameStatus = function()
	{
		return this.gameStatus;
	};

	GameStatus.prototype.addPlayer = function(playerType)
	{
		this.gameBoard.playerType = playerType;
	};

	GameStatus.prototype.getPlayerType = function()
	{
		return this.gameBoard.playerType;
	};

	GameStatus.prototype.getMatrix = function()
	{
		return this.gameBoard.chessBoard;
	};

	GameStatus.prototype.setMatrix = function(chessBoard)
	{
		this.gameBoard.chessBoard = chessBoard;
	};

	GameStatus.prototype.getGameBoard = function()
	{
		return this.gameBoard;
	};

	GameStatus.prototype.setGameBoardGameStatus = function(gameStatus)
	{
		this.gameBoard.gameStatus = gameStatus;
	};

	GameStatus.prototype.getPlayerTurn = function()
	{
		return this.gameBoard.playerTurn;
	};

	GameStatus.prototype.setPlayerTurn = function(turn)
	{
		this.gameBoard.playerTurn = turn;
	};
	
	
	GameStatus.prototype.sendMatrix = function(socket)
	{
		var msgOutgoing = new Object();


		if(this.gameStatus == "2")
		{
			msgOutgoing.gameID = this.getGameID();
			msgOutgoing.type = "playerMatrix";
			msgOutgoing.playerType = this.getPlayerType();
			msgOutgoing.matrix = this.getMatrix();

			msgOutgoing.playerTurn = this.getPlayerTurn();

			socket.send(JSON.stringify(msgOutgoing));
		}
	};

	GameStatus.prototype.setPlayerTurn = function(turn)
	{
		this.gameBoard.playerTurn = turn;
	};

	GameStatus.prototype.getPlayerTurn = function()
	{
		return this.gameBoard.playerTurn;
	};


	var output = document.getElementById("output");

( function setup(){


	

	var board = new GameBoard();

	var gameStatus = new GameStatus(board, 0);

	gameStatus.gameBoard.populateBoard();
	gameStatus.gameBoard.enableDrop();
	gameStatus.gameBoard.disableDrag();


	socket.onopen = function(event)
	{

	}

	socket.onmessage = function(event)
	{
		var msgIncoming = JSON.parse(event.data);

		if(msgIncoming.type == "infoPieces")
		{
			stats_op.innerHTML = "Current number of pieces taken by opponent: " + msgIncoming.pieces;
		}


		if(msgIncoming.type == "initGame")
		{
			gameStatus.setGameBoardGameStatus(msgIncoming.gameStatus);
			gameStatus.setGameID(msgIncoming.gameID);
			gameStatus.addPlayer(msgIncoming.playerType);
			gameStatus.setGameStatus(msgIncoming.gameStatus);

			if(msgIncoming.gameStatus == "2")
			{
				var message = "GAME STARTING...</br>";
				output.innerHTML+=message;

				gameStatus.gameBoard.disableOwnPieces();
			}
			
		}

		if(msgIncoming.type == "checkA" || msgIncoming.type == "checkB")
		{
			gameStatus.gameBoard.disableOwnPieces();
		}

		if(msgIncoming.type == "responseMatrix")
		{

			matrix = msgIncoming.matrix;
			console.log(matrix);
			gameStatus.setMatrix(matrix);
			gameStatus.gameBoard.populateBoard();

			var winGame = gameStatus.gameBoard.checkTest();

			if(winGame != null)
			{
				
				if(winGame == "CheckA")
				{
					output.innerHTML += "CHECK!!</br>You need to make a move!</br>";

					var msgOutgoing = new Object();
					msgOutgoing.type == "checkA";

					socket.send(JSON.stringify(msgOutgoing));
				}
				else if(winGame == "CheckB")
				{
					output.innerHTML += "CHECK!!</br>You need to make a move!</br>";

					var msgOutgoing = new Object();
					msgOutgoing.type == "checkB";

					socket.send(JSON.stringify(msgOutgoing));
				}
				
				else if(winGame == "CheckMate")
				{
					output.innerHTML += "CHECKMATE!!</br>GAME OVER...</br>";
				}
			}

			var msgOutgoing = new Object();

			msgOutgoing.type = "wonGame";
			msgOutgoing.playerType = gameStatus.getPlayerType();
			msgOutgoing.message = winGame;
			msgOutgoing.gameID = gameStatus.getGameID();

			socket.send(JSON.stringify(msgOutgoing));

			// implement so the other player knows he won the game.

		}

		if(msgIncoming.type == "CheckMate")
		{
			output.innerHTML += "CHECKMATE!!</br>YOU WON THE GAME!!";
		}


		
		if(msgIncoming.type == "gameState")
		{
			var message = "GAME STARTING...</br>You are the first to start.</br>Please make a move...</br>";
			output.innerHTML+=message;
			gameStatus.setGameStatus(msgIncoming.data);
			gameStatus.setGameBoardGameStatus(msgIncoming.data);

			gameStatus.gameBoard.enableDrag();
		}

		if(msgIncoming.type == "playerTurn")
		{

			var playerType = gameStatus.getPlayerType();

			if(msgIncoming.playerTurn == true)
			{
				if(gameStatus.getGameStatus() == "2")
				{
					if(!gameStatus.gameBoard.checkTest())
						output.innerHTML += "Opponent made a move...</br>It is now your turn.</br>";
				}
				if(gameStatus.getGameStatus() == "1")
				{
					output.innerHTML+="Waiting for the other player to connect to the room...</br>";
				}
				gameStatus.setPlayerTurn(msgIncoming.playerTurn);
				gameStatus.gameBoard.enableDrag();
			}
			else if(msgIncoming.playerTurn == false)
			{
				output.innerHTML += "Waiting for opponent to make a move...</br>";
				gameStatus.setPlayerTurn(msgIncoming.playerTurn);
				gameStatus.gameBoard.disableOwnPieces();
			}
		}
		
		if(msgIncoming.type == "ABORTED")
		{
			output.innerHTML += "The other player disconnected.</br>You won the GAME!!</br>";
		}

		
		

	}

	socket.onclose = function(event)
	{
		//msgOutgoing.playerType = gameStatus.getPlayerType();
		//msgOutgoing.gameStatus = gameStatus.getGameStatus();

		//socket.send(JSON.stringify(msgOutgoing))
	}

})();