	
	var game = function(gameID)
	{
		this.gameID = gameID;
		this.playerA = null;
		this.playerB = null;
		this.gameState = "0";
	};


game.prototype.getGameID = function()
{
	return this.gameID;
};

game.prototype.setGameID = function(gameID)
{
	this.gameID = gameID;
};

game.prototype.hasTwoConnectedPlayers = function()
{
	return (this.gameState == "2");
};


game.prototype.setGameState = function(gameState)
{
	this.gameState = gameState;
};

game.prototype.getGameState = function()
{
	return this.gameState;
};

game.prototype.setPlayerA = function(playerA)
{
	this.playerA = playerA;
};

game.prototype.setPlayerB = function(playerB)
{
	this.playerB = playerB;
};

module.exports = game;