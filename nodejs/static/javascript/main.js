
	function GameBoard()
	{
		this.gameID = null;
		this.playerType = null;
		this.chessBoard = [
			['Tower', 'Horse', 'Crazy', 'Queen', 'King', 'Crazy', 'Horse', 'Tower'],
			['Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn'],
			['0', '0', '0', '0', '0', '0', '0', '0'],
			['0', '0', '0', '0', '0', '0', '0', '0'],
			['0', '0', '0', '0', '0', '0', '0', '0'],
			['0', '0', '0', '0', '0', '0', '0', '0'],
			['Pawn1', 'Pawn1', 'Pawn1', 'Pawn1', 'Pawn1', 'Pawn1', 'Pawn1', 'Pawn1'],
			['Tower1', 'Horse1', 'Crazy1', 'Queen1', 'King1', 'Crazy1', 'Horse1', 'Tower1']
			];
		this.madeMove = false;
		this.gameStatus = "0";
		this.playerTurn = null;
		this.piecesTaken = 0;
	}

		

	var boxes = document.getElementsByClassName('piece');

	GameBoard.prototype.disableOwnPieces = function()
	{
		if(this.playerTurn === false)
		{
			if(this.playerType == "A")
			{
				for(let i = 0 ; i < boxes.length; i++)
				{
					var place = this.findPlaceInMatrix(i);
					var ind = place.i;
					var jnd = place.j;

					if(this.chessBoard[ind][jnd].indexOf("1") == -1)
					{
						if(boxes[i].firstChild)
						{
							boxes[i].firstChild.setAttribute("draggable", false);
						}
					}
				}
			}
			else if(this.playerType == "B")
			{
				for(let i = 0 ; i < boxes.length; i++)
				{
					var place = this.findPlaceInMatrix(i);
					var ind = place.i;
					var jnd = place.j;

					if(this.chessBoard[ind][jnd].indexOf("1") != -1)
					{
						if(boxes[i].firstChild)
						{
							boxes[i].firstChild.setAttribute("draggable", false);
						}
					}
				}
			}
		}
	};


	GameBoard.prototype.checkPlayer = function(index)
	{
		if(this.gameStatus == "2")
		{
			
			var place = this.findPlaceInMatrix(index);

			var i = place.i;
			var j = place.j;

			if(this.playerType == "A")
			{
				if(this.chessBoard[i][j].indexOf("1") == -1)
				{
					return true;
				}
			}

			if(this.playerType == "B")
			{
				if(this.chessBoard[i][j].indexOf("1") != -1)
				{
					return true;
				}
			}
		}

		return false;
	};

	GameBoard.prototype.enableDrag = function()
	{
		for(let i = 0 ; i < boxes.length; i++)
		{
			if(this.checkPlayer(i))
			{
				if(boxes[i].firstChild)
					boxes[i].firstChild.setAttribute("draggable", true);
			}
		}
	};

	GameBoard.prototype.disableDrag = function()
	{
		for(let i  = 0 ; i < boxes.length; i++)
		{
			if(boxes[i].firstChild)
			{
				boxes[i].firstChild.setAttribute("draggable", false);
			}
		}
	};


	GameBoard.prototype.populateBoard = function()
	{
		let index = 0;

		for(let i = 0; i < this.chessBoard.length; i++)
		{
			for(let j = 0; j < this.chessBoard[0].length; j++)
			{

				boxes[index].setAttribute("id", index);

				if(this.chessBoard[i][j] != '0' && !boxes[index].firstChild)
				{
					boxes[index].setAttribute("id", index);	
					this.addPlayerToPiece(index, this.chessBoard[i][j]);
					boxes[index].firstChild.setAttribute("draggable", "false");
				}

				if(boxes[index].firstChild && this.chessBoard[i][j] == '0')
				{
					boxes[index].removeChild(boxes[index].childNodes[0]);
				}

				if(boxes[index].firstChild && this.chessBoard[i][j] != '0' && this.chessBoard[i][j].indexOf("new") != -1)
				{
					boxes[index].removeChild(boxes[index].childNodes[0]);
					var str = this.chessBoard[i][j];
					this.chessBoard[i][j] = str.replace("new", "");

					this.addPlayerToPiece(index, this.chessBoard[i][j]);

					boxes[index].firstChild.setAttribute("draggable", "false");

				}

				index++;
			}
		}
	};


	GameBoard.prototype.playerHasMadeMove = function()
	{
		var move;

		(this.madeMove == true) ? move = true :  move = false;

		
		if(move == true)
		{
			this.madeMove = false;
			return true;
		}

		return false;
	};



	// nu stiu exact cum ai facut mancatul pieselor, asa ca am folosit illegalMove sa vad daca piesa are vizibilitate la rege.
	// ca sa vad asta, field-ul regelui tb sa fie 0
GameBoard.prototype.checkBlack = function(to) 
	{
		for(var i = 0; i < 64; i++){
			if(i != to)
			{
				var place = this.findPlaceInMatrix(i);
				var i2 = place.i;
				var j2 = place.j;
				var aux;
				aux = this.getTypeOfPlayer(to);

				var place1 = this.findPlaceInMatrix(to);
				var i3 = place1.i;
				var j3 = place1.j;
				this.chessBoard[i3][j3] = '0';
				
				if(this.chessBoard[i2][j2] == "Pawn1" && this.legalTakeMovePawn1(i2,j2,i3,j3)){
					this.chessBoard[i3][j3] = aux;
					return true;
				}
				else if(this.getColorOfPiece(i2,j2) == 'White' && this.getTypeOfPlayer(i) != 'Pawn1' && this.illegalMove(this.getTypeOfPlayer(i), i, to)){
					this.chessBoard[i3][j3] = aux;
					return true;
				}
				this.chessBoard[i3][j3] = aux;
			}
		}
		return false;
	};

GameBoard.prototype.checkWhite = function(to) 
	{
		for(var i = 0; i < 64; i++){
			if(i != to)
			{
				var place = this.findPlaceInMatrix(i);
				var i2 = place.i;
				var j2 = place.j;

				var aux = this.getTypeOfPlayer(to);

				var place1 = this.findPlaceInMatrix(to);
				var i3 = place1.i;
				var j3 = place1.j;
				this.chessBoard[i3][j3] = '0';

				if(this.chessBoard[i2][j2] == "Pawn" && this.illegalMovePawn(i2,j2,i3,j3)){
					this.chessBoard[i3][j3] = aux;
					return true;
				} 
				else if(this.getColorOfPiece(i2,j2) == 'Black' && this.getTypeOfPlayer(i) != 'Pawn' && this.illegalMove(this.getTypeOfPlayer(i), i, to)){
					
						this.chessBoard[i3][j3] = aux;
						return true;
					}
					this.chessBoard[i3][j3] = aux;
				}
			}
			return false;
		};


	
	//!!!!!!!!!!!daca poti sa muti o piesa asa incat sa nu fie sah, returneaza true

	GameBoard.prototype.movePieceStopCheckBlack = function(from)
	{
		if(this.getTypeOfPlayer(from) == 'King')
			for(var i = 0; i < 64; i++)
			{
				for(var j = 0; j < 64; j++)
				{
					var place = this.findPlaceInMatrix(i);
					var i2 = place.i;
					var j2 = place.j;

					var place = this.findPlaceInMatrix(j);
					var i3 = place.i;
					var j3 = place.j;


					if(this.illegalMove(this.getTypeOfPlayer(this.getTypeOfPlayer(i), i, j)) && this.getColorOfPiece(i2,j2) == 'Black'){
						var aux = this.getTypeOfPlayer(j);
						this.chessBoard[i3][j3] = this.getTypeOfPlayer(i);

						if(!this.checkBlack(from)){
							this.chessBoard[i2][j2] = aux;
							return true;
						}
						this.chessBoard[i2][j2] = aux;
					}
				}
			}
			return false;
		};

		GameBoard.prototype.movePieceStopCheckWhite = function(from)
		{
			if(getTypeOfPlayer(from) == 'King1')
				for(var i = 0; i < 64; i++){
					for(var j = 0; j < 64; j++)

						var place = this.findPlaceInMatrix(i);
						var i2 = place.i;
						var j2 = place.j;

						var place = this.findPlaceInMatrix(j);
						var i3 = place.i;
						var j3 = place.j;	

					if(this.illegalMove(this.getTypeOfPlayer(this.getTypeOfPlayer(i), i, j)) && this.getColorOfPiece(i2,j2) == 'White'){
						var aux = this.getTypeOfPlayer(j);
						chessBoard[i3][j3] = this.getTypeOfPlayer(i);
						if(!this.checkWhite(from)){
							this.chessBoard[i][j] = aux;
							return true;
						}
						this.chessBoard[i2][j2] = aux;
					}
				}
				return false;
			};


		// verifica daca in pozitia aia, regele ar fi in sah (gen daca ai muta piesa acolo)
		GameBoard.prototype.checkSurroundingPlacesBlack = function(from)
		{		var place = this.findPlaceInMatrix(from);
			var i = place.i;
			var j = place.j;
			if(!(this.checkBlack(from)) && (this.getTypeOfPlayer(from) == '0' || this.getColorOfPiece(i,j) == 'White'))
				return false;
			return true;
		};

			//check if you can move the king to a close place which is not in check (also if you can eat an enemy piece so that it won't be chess)
			GameBoard.prototype.checkSurroundingPlacesWhite = function(from)
			{	var place = this.findPlaceInMatrix(from);
				var i = place.i;
				var j = place.j;
				if(!(this.checkWhite(from)) && (this.getTypeOfPlayer(from) == '0' || this.getColorOfPiece(i,j) == 'Black'))
					return false;
				return true;
			};


			//verifica daca exista piesa alba care sa aiba vedere la regele negru. daca da, e sah, deci return true
			GameBoard.prototype.checkMateBlack = function(to) 
			{
				var place = this.findPlaceInMatrix(to);
				var i = place.i;
				var j = place.j;

				var from;

						// verifica daca in pozitiile din jurul regelui poti muta si sa nu fie sah
						// verifica si movePieceCheckWBlack
						if(this.checkBlack(to)){
							if(i<6)
							{
								from = this.getBoxesIndex(i+1,j);
								if(this.checkSurroundingPlacesBlack(from) == false)
									return false;


								if(j>0)
								{
									from = this.getBoxesIndex(i+1,j-1);
									if(this.checkSurroundingPlacesBlack(from) == false)
										return false;
								}
							}

							if(i>1)
							{
								from = this.getBoxesIndex(i-1,j);
								if(this.checkSurroundingPlacesBlack(from) == false)
									return false;
								
								if(j>0)
								{
									from = this.getBoxesIndex(i-1,j-1);
									if(this.checkSurroundingPlacesBlack(from) == false)
										return false;
								}

								if(j<7)
								{
									from = this.getBoxesIndex(i-1,j+1);
									if(this.checkSurroundingPlacesBlack(from) == false)
										return false;
									
								}
							}

							if(i < 7)
							{
								from = this.getBoxesIndex(i+1,j);
								if(this.checkSurroundingPlacesBlack(from) == false)
									return false;
								

								if(j>0)
								{
									from = this.getBoxesIndex(i+1,j-1);
									if(this.checkSurroundingPlacesBlack(from) == false)
										return false;
									
								}

								if(j<7)
								{
									from = this.getBoxesIndex(i+1,j+1);
									if(this.checkSurroundingPlacesBlack(from) == false)
										return false;
									
								}
							}
							if(this.movePieceStopCheckBlack(to) == false)
								return false;
							return true;
						}
						return false;
					};

					GameBoard.prototype.getBoxesIndex = function(i, j)
					{
						return i * 8 + j;

					};


					GameBoard.prototype.checkMateWhite = function(to) 
					{
						var place = this.findPlaceInMatrix(to);
						var i = place.i;
						var j = place.j;
						var from;

						
						if(this.checkWhite(to))
						{
							if(i<6)
							{
								from = this.getBoxesIndex(i+1,j);
								if(this.checkSurroundingPlacesWhite(from) == false)
									return false;
								

								if(j>0)
								{
									from = this.getBoxesIndex(i+1,j-1);
									if(this.checkSurroundingPlacesWhite(from) == false)
										return false;
								}								
							} 

							if(i>1)
							{
								from = this.getBoxesIndex(i-1,j);
								if(this.checkSurroundingPlacesWhite(from) == false)
									return false;
								

								if(j>0)
								{
									from = this.getBoxesIndex(i-1,j-1);
									if(this.checkSurroundingPlacesWhite(from) == false)
										return false;
									
								}

								if(j<7)
								{
									from = this.getBoxesIndex(i-1,j+1);
									if(this.checkSurroundingPlacesWhite(from) == false)
										return false;
									
								}
							}

							if(i < 7)
							{
								from = this.getBoxesIndex(i+1,j);
								if(this.checkSurroundingPlacesWhite(from) == false)
									return false;
								

								if(j>0)
								{
									from = this.getBoxesIndex(i+1,j-1);
									if(this.checkSurroundingPlacesWhite(from) == false)
										return false;
									
								}

								if(j<7)
								{
									from = this.getBoxesIndex(i+1,j+1);
									if(this.checkSurroundingPlacesWhite(from) == false)
										return false;
									
								}

								if(this.movePieceStopCheckWhite(to) == false)
									return false;
							}
							return true;
						}
						return false;
					};

					GameBoard.prototype.checkTest = function(){
						for(var i = 0; i < 64; i++){
							if(this.getTypeOfPlayer(i) == 'King'){
								if(this.checkBlack(i) && !this.checkMateBlack(i))
								{

									return "CheckB";
								}

								if(this.checkMateBlack(i)){
									return "CheckMate";
								}
							}
							if(this.getTypeOfPlayer(i) == 'King1'){
								if(this.checkWhite(i) && !this.checkMateWhite(i))
								{
									return "CheckA";
								}
								if(this.checkMateWhite(i)){
									return "CheckMate";
								}
							}
						}

						return null;
					};

					GameBoard.prototype.wouldBeCheck = function(playerType, from, index)
					{

						var place = this.findPlaceInMatrix(index);
						var iTo = place.i;
						var jTo = place.j;

						var placeFrom = this.findPlaceInMatrix(from);
						var iFrom = placeFrom.i;
						var jFrom = placeFrom.j;

						var prev1 = this.chessBoard[iFrom][jFrom];

						this.chessBoard[iFrom][jFrom] = "0";

						var prev = this.chessBoard[iTo][jTo];

						this.chessBoard[iTo][jTo] = playerType;

						var result = this.checkTest();

						if(result)
						{
							this.chessBoard[iFrom][jFrom] = prev1;
							this.chessBoard[iTo][jTo] = prev;
							return {
								"result": true,
								"type" : result
							};
						}
						this.chessBoard[iFrom][jFrom] = prev1;
						this.chessBoard[iTo][jTo] = prev;

						return null;


					};

					GameBoard.prototype.setDraggable = function(index)
					{
						
						boxes[index].setAttribute("draggable", true);
					};

	GameBoard.prototype.enableDrop = function()
	{

		var that = this;

		for(let i = 0 ; i < boxes.length; i++)
		{
				boxes[i].addEventListener('dragstart', function dragStart(event){

						that.getAvailableMovesPlayer(that.getTypeOfPlayer(i), i);
						event.dataTransfer.setData("typeOfPlayer", that.getTypeOfPlayer(i));
						event.dataTransfer.setData("idParent", i);
						//event.dataTransfer.dropEffect = "move";
						setTimeout(() => (boxes[i].removeChild(boxes[i].firstChild)), 0);
					}, true);

					boxes[i].addEventListener('dragover', function dragOver(event){
						event.preventDefault();
					}, true);
				
				boxes[i].addEventListener('drop', function dragEnd(event){
				
						event.preventDefault();

						var index;

						if(event.target.className == "next_move_wrapper")
						{
							index = event.target.parentNode.id;

						}
						else if(event.target.className == "next_move")
						{
							index = event.target.parentNode.parentNode.id;
						}
						else if(event.target.className == "piecePlayer")
						{
							index = event.target.parentNode.id;
						}
						else
						{
							index = event.target.id;
						}

						var from = event.dataTransfer.getData("idParent");
						var typeOfPlayer = event.dataTransfer.getData("typeOfPlayer");
						that.clearColoredBoards();

						var placeFrom = that.findPlaceInMatrix(from);
						var iFrom = placeFrom.i;
						var jFrom = placeFrom.j;

						var color = that.getColorOfPiece(iFrom, jFrom);

						var place = that.findPlaceInMatrix(index);
						var iTo = place.i;
						var jTo = place.j;

						var playerTakenIndex = null;


						if(that.placeAvailable(index) && that.illegalMove(typeOfPlayer, from ,index))
						{

							if(that.wouldBeCheck(typeOfPlayer, from, index) != null)
							{
								var result = that.wouldBeCheck(typeOfPlayer, from, index);
								var type = result.type;
								
								if(type == "CheckA" && that.playerType == "A")
								{
									
									that.movePiece(from, index);
								}
								else if(type == "CheckB" && that.playerType == "B")
								{
								
									that.movePiece(from, index);
								}
								else if(type == "CheckMate")
								{
									that.movePiece(from, index);
								}
								else
								{
									that.movePiece(from, from);
									that.setDraggable(from);
								}
							}
							else
							{
								that.movePiece(from, index);
							}
							
						}
						else if(that.isEnemy(index, color, iTo, jTo))
						{
							if(typeOfPlayer == "Pawn")
							{
								if(that.legalTakeMove(iFrom, jFrom, iTo, jTo))
								{
									
									that.removePieceEnemy(index, typeOfPlayer);
									that.movePiece(from, index);
									playerTakenIndex = index;
									that.piecesTaken++;
								}
								else
								{
									that.movePiece(from, from);
									that.setDraggable(from);
								}
							}
							else if(typeOfPlayer == "Pawn1")
							{
								if(that.legalTakeMovePawn1(iFrom, jFrom, iTo, jTo))
								{
									that.removePieceEnemy(index, typeOfPlayer);
									that.movePiece(from, index);
									playerTakenIndex = index;
									that.piecesTaken++;
								}
								else
								{
									that.movePiece(from, from);
									that.setDraggable(from);
								}
							}
							else
							{
								
								that.removePieceEnemy(index, typeOfPlayer);
								that.movePiece(from, index);
								playerTakenIndex = index;
							}
						}
						else
						{
							that.movePiece(from, from);
							that.setDraggable(from);
						}

						

						if(playerTakenIndex != null)
						{
							that.changeTakenIndex(playerTakenIndex);
						}

						that.populateBoard();
				
				}, true);
			
		}

	};

	GameBoard.prototype.legalTakeMovePawn1 = function(i,j,i2,j2)
	{
		if(i >=1){
			if(i-1 == i2 && j <= 6 && j+1 == j2)
			{
				return true;
			}

			if(i-1 == i2 && j >= 1 && j-1 == j2)
			{
				return true;
			}
		}
		return false;
	};


	GameBoard.prototype.changeTakenIndex = function(index)
	{
		var place = this.findPlaceInMatrix(index);
		var i = place.i;
		var j = place.j;

		var val = this.chessBoard[i][j];
		this.chessBoard[i][j] = "new" + val;
		this.madeMove = true;
		this.madeMove = false;
	};

	GameBoard.prototype.getAvailableMovesPlayer = function(typeOfPlayer, index)
	{
		if(this.findPlaceInMatrix(index) != -1)
		{
			var place = this.findPlaceInMatrix(index);
			var i = place.i;
			var j = place.j;

			if(typeOfPlayer == "Pawn")
			{
				this.checkConditionsForPawn(i, j);
			}
			else if(typeOfPlayer == "Pawn1")
			{
				this.checkConditionsForPawn1(i, j);
			}
			else if(typeOfPlayer == "Horse" || typeOfPlayer == "Horse1")
			{
				this.checkConditionsForHorse(i,j);
			}
			else if(typeOfPlayer == "King" || typeOfPlayer == "King1")
			{
				this.checkConditionsForKing(i, j);

			}
			else if(typeOfPlayer == "Queen" || typeOfPlayer == "Queen1")
			{
				this.checkConditionsForQueen(i,j);
			}
			else if(typeOfPlayer == "Crazy" || typeOfPlayer == "Crazy1")
			{
				this.checkConditionsForCrazy(i,j);
			}
			else if(typeOfPlayer == "Tower" || typeOfPlayer == "Tower1")
			{
				this.checkConditionsForTower(i, j);
			}
		}
	};

	GameBoard.prototype.getTypeOfPlayer = function(index)
	{
		let toCompare = 0;

		for(let i = 0; i < this.chessBoard.length; i++)
		{
			for(let j = 0; j < this.chessBoard[0].length; j++)
			{
				if(index == toCompare)
				{
					return this.chessBoard[i][j];
				}
				toCompare++;
			}
		}
		return null;
	};


	GameBoard.prototype.movePiece = function(from, to)
	{
		var toCompare = 0;
		var value;

		for(let i = 0; i < this.chessBoard.length; i++)
		{
			for(let j = 0; j < this.chessBoard[0].length; j++)
			{
				if(toCompare == from)
				{
					value = this.chessBoard[i][j];
					this.chessBoard[i][j] = '0';
				}
				toCompare++;
			}
			
		}

		toCompare = 0;

		for(let i = 0; i < this.chessBoard.length; i++)
		{
			for(let j = 0; j < this.chessBoard[0].length; j++)
			{
				if(toCompare == to)
				{
					this.chessBoard[i][j] = value;
				}
				toCompare++;
			}
			
		}

		return (from != to) ? this.madeMove = true : this.madeMove = false;

	};

	GameBoard.prototype.colorBoard = function(index)
	{
		var main = document.createElement("div");

		main.setAttribute("class", "next_move_wrapper");
		var div = document.createElement("div");
		div.setAttribute("class", "next_move");

		main.appendChild(div);
		boxes[index].appendChild(main);
	};

	GameBoard.prototype.findPlaceInMatrix = function(index)
	{
		var toCompare = 0;
		for(let i = 0; i < this.chessBoard.length; i++)
		{
			for(let j = 0; j < this.chessBoard[0].length; j++)
			{
				if(index == toCompare)
				{
					return {
						"i" : i,
						"j" : j
					};
				}
				toCompare++;
			}
		}
		return null;
	};

	GameBoard.prototype.findIndex = function(x,y)
	{
		let toCompare = 0;

		for(let i = 0; i < this.chessBoard.length; i++)
		{
			for(let j = 0; j < this.chessBoard[0].length; j++)
			{
				if(i==x && j == y)
				{
					return toCompare;
				}
				toCompare++;
			}
		}
		return -1;
	};

	GameBoard.prototype.checkConditionsForKing = function(i, j)
	{
		if(i >= 1)
		{
			if(this.chessBoard[i-1][j] == '0')
				this.colorBoard(this.findIndex(i-1,j));
			if(j <= 6 && this.chessBoard[i-1][j+1] == '0')
				this.colorBoard(this.findIndex(i-1,j+1));
			if(j >= 1 &&this.chessBoard[i-1][j-1] == '0')
				this.colorBoard(this.findIndex(i-1,j-1));
		}
		if(i <= 6 && j <= 6 && this.chessBoard[i+1][j+1] == '0')
		{
			this.colorBoard(this.findIndex(i+1,j+1));
		}
		if(i <= 6 && j >= 1 && this.chessBoard[i+1][j-1] == '0')
		{
			this.colorBoard(this.findIndex(i+1,j-1));
		}
		if(i <= 6 && this.chessBoard[i+1][j] == '0')
		{
			this.colorBoard(this.findIndex(i+1,j));
		}
		if(j <= 6 && this.chessBoard[i][j+1] == '0')
		{
			this.colorBoard(this.findIndex(i,j+1));
		}
		if(j >= 1 && this.chessBoard[i][j-1] == '0')
		{
			this.colorBoard(this.findIndex(i,j-1));
		}
	};

	GameBoard.prototype.checkConditionsForPawn = function(i, j)
	{
		if(i<=6)
		{
			if(this.chessBoard[i+1][j] == '0')
			{
				this.colorBoard(this.findIndex(i+1,j));
			}
		}

		if(i<=5)
		{
			if(this.chessBoard[i+2][j] == '0' && i==1 && this.chessBoard[i+1][j] =='0')
			{
				this.colorBoard(this.findIndex(i+2,j));
			}
		}
	};


	GameBoard.prototype.checkConditionsForPawn1 = function(i , j)
	{

		if(i>=1)
		{
			if(this.chessBoard[i-1][j] == '0')
			{
				this.colorBoard(this.findIndex(i-1,j));
			}
		}

		if(i>=2)
		{
			if(this.chessBoard[i-2][j] == '0' && this.chessBoard[i-1][j] == '0' && i==this.chessBoard[0].length-2)
			{
				this.colorBoard(this.findIndex(i-2,j));
			}
		}
	};


	GameBoard.prototype.checkConditionsForCrazy = function(i, j)
	{
		var tempI, tempJ;
		tempI = i;
		tempJ = j;

		while(j >= 1 && i <= 6)
		{
			i++;
			j--;



			if(this.chessBoard[i][j] == '0' && this.findIndex(i,j)!= -1)
			{
				this.colorBoard(this.findIndex(i,j));
			}
			else
				break;		
		}

		i = tempI;
		j = tempJ;

		tempI = i;
		tempJ = j;

		while(i>0 && j<this.chessBoard[0].length-1)
		{
			i--;
			j++;

			if(this.findIndex(i,j)!= -1 && this.chessBoard[i][j] == '0')
			{
				this.colorBoard(this.findIndex(i,j));
			}
			else
				break;
		}


		i = tempI;
		j = tempJ;

		tempI = i;
		tempJ = j;

		while(j<this.chessBoard[0].length-1 && i < this.chessBoard[0].length-1)
		{
			i++;
			j++;
			
			if(this.findIndex(i,j)!= -1 && this.chessBoard[i][j] == '0')
			{
				this.colorBoard(this.findIndex(i,j));
			}
			else
				break;
		}

		i = tempI;
		j = tempJ;

		while(j>0 && i>0)
		{
			i--;
			j--;
			
			if(this.findIndex(i,j)!= -1 && this.chessBoard[i][j] == '0')
			{
				this.colorBoard(this.findIndex(i,j));
			}
			else
				break;
		}

	};


	GameBoard.prototype.checkConditionsForHorse = function(i,j)
	{	

		if(i<=5){
			if(this.chessBoard[i+2][j+1] == '0' && j <= 6)
			{
				this.colorBoard(this.findIndex(i+2,j+1));
			}
			if(this.chessBoard[i+2][j-1] == '0' && j >= 1)
			{
				this.colorBoard(this.findIndex(i+2,j-1));
			}
		}

		if(i>=2)
		{
			if(this.chessBoard[i-2][j+1] == '0' && j <= 6)
			{
				this.colorBoard(this.findIndex(i-2,j+1));
			}
			if(this.chessBoard[i-2][j-1] == '0' && j>=1)
			{
				this.colorBoard(this.findIndex(i-2,j-1));
			}
		}

		if(i>=1)
		{
			if(this.chessBoard[i-1][j+2] == '0' && j <=5)
			{
				this.colorBoard(this.findIndex(i-1,j+2));
			}
			if(this.chessBoard[i-1][j-2] == '0' && j >= 2)
			{
				this.colorBoard(this.findIndex(i-1,j-2));
			}
		}

		if(i<=6){
			if(this.chessBoard[i+1][j+2] == '0' && j <= 5)
			{
				this.colorBoard(this.findIndex(i+1,j+2));
			}
			if(this.chessBoard[i+1][j-2] == '0' && j >= 2)
			{
				this.colorBoard(this.findIndex(i+1,j-2));
			}
		}

	};



	GameBoard.prototype.checkConditionsForTower = function(i, j)
	{
		var tempI, tempJ;
		tempJ = j;
		while(j <= 6)
		{
			j++;
			
			if(this.findIndex(i,j)!=-1 && this.chessBoard[i][j] == '0')
			{
				this.colorBoard(this.findIndex(i,j));
			}
			else
				break;
		}
		j = tempJ;

		tempI = i;
		while(i <= 6)
		{
			i++;

			if(this.findIndex(i,j)!=-1 && this.chessBoard[i][j] == '0')
			{
				this.colorBoard(this.findIndex(i,j));
			}
			else
				break;
		}

		i = tempI;

		tempI = i;

		while(i >= 1)
		{
			i--;	
			
			if(this.findIndex(i,j)!=-1 && this.chessBoard[i][j] == '0')
			{
				this.colorBoard(this.findIndex(i,j));
			}
			else
				break;
		}

		i = tempI;

		while(j > 0)
		{
			j--;

			if(this.findIndex(i,j)!=-1 && this.chessBoard[i][j] == '0')
			{
				this.colorBoard(this.findIndex(i,j));
			}
			else
				break;
		}
	};

	GameBoard.prototype.checkConditionsForQueen = function(i,j)
	{
		this.checkConditionsForCrazy(i,j);
		this.checkConditionsForTower(i,j);
	};




	GameBoard.prototype.illegalMoveHorse = function(i,j,i2,j2)
	{
		if(i2 >= 2 && i2-2 == i)
			if((j2 <=6 && j2+1 ==j) ||(j2 >= 1 && j2-1 == j))
				return true;
			if(i2 >= 1 && i2-1 == i)
				if((j2 <= 5 && j2+2 ==j) || (j2 >=2 && j2-2 == j))
					return true;

				if(i2 <=5 && i2+2 == i)
				{
					if((j2 <=6 && j2+1==j) || (j2 >= 1 && j2-1==j))
						return true;
				}

				if(i2 <= 6 && i2+1 == i)
				{
					if((j2 <= 5 && j2+2 == j) || (j2 >=2 && j2-2 ==j))
						return true;
				}
				return false;
			}

			GameBoard.prototype.illegalMoveTower = function(i,j,i2,j2)
			{
				var tempI, tempJ, tempI2, tempJ2;

				tempI = i;
				tempJ = j;
				tempI2 = i2;
				tempJ2 = j2;

				if(i == i2)
				{
					while(j <= 6 && this.chessBoard[i][j] == '0')
					{
						j++;
						if(j == j2)
							return true;
					}
					i = tempI;
					j = tempJ;
					i2 = tempI2;
					j2 = tempJ2;

					tempI = i;
					tempJ = j;
					tempI2 = i2;
					tempJ2 = j2;

					while(j > 0  && this.chessBoard[i][j] == '0')
					{
						j--;
						if(j == j2)
							return true;
					}
				}


				else if(j == j2)
				{
					while(i <= 6  && this.chessBoard[i][j] == '0')
					{
						i++;
						if(i == i2)
							return true;
					}
					i = tempI;
					j = tempJ;
					i2 = tempI2;
					j2 = tempJ2;

					tempI = i;
					tempJ = j;
					tempI2 = i2;
					tempJ2 = j2;
					while(i > 0 && this.chessBoard[i][j] == '0')
					{
						i--;
						if(i == i2)
							return true;
					}
				}
				return false;
			};

			GameBoard.prototype.illegalMoveCrazy = function(i, j, i2, j2)
			{
				var tempI, tempJ, tempI2, tempJ2;

				tempI = i;
				tempJ = j;
				tempI2 = i2;
				tempJ2 = j2;

				while(i >= 1 && j <= 6  && this.chessBoard[i][j] == '0')
				{
					i--;
					j++;
					if(i == i2 && j == j2)
					{
						return true;
					}
				}

				i = tempI;
				j = tempJ;
				i2 = tempI2;
				j2 = tempJ2;

				tempI = i;
				tempJ = j;
				tempI2 = i2;
				tempJ2 = j2;

				while(j >= 1 && i <= 6  && this.chessBoard[i][j] == '0')
				{
					i++;
					j--;

					if(i == i2 && j == j2)
					{
						return true;
					}
				}

				i = tempI;
				j = tempJ;
				i2 = tempI2;
				j2 = tempJ2;

				tempI = i;
				tempJ = j;
				tempI2 = i2;
				tempJ2 = j2;

				while(this.chessBoard[i][j] == '0' && j <= 6 && i <= 6)
				{ 	
					i++;
					j++;

					if(i == i2 && j == j2)
					{
						return true;
					}
				}

				i = tempI;
				j = tempJ;
				i2 = tempI2;
				j2 = tempJ2;

				while(this.chessBoard[i][j] == '0' && j >= 1 && i >= 1)
				{	
					i--;
					j--;
					
					if(i == i2 && j == j2)
					{
						return true;
					}

				}

				return false;
			};

			GameBoard.prototype.illegalMoveKing = function(i, j, i2, j2)
			{	if(this.chessBoard[i][j] == '0'){
				if(i >= 1)
				{
					if(i - 1 == i2 && j == j2 )
						return true;
					if(i - 1 == i2 && j >= 1 && j-1 == j2)
					{
						return true;
					}
					if(i - 1 == i2 && j <= 6 && j + 1 == j2)
					{
						return true;
					}
				}
				 if(i <= 6){
					if(i+1 == i2 && j == j2 ){
						return true;
					}

					if(i+1 == i2 && j <= 6 && j+1 == j2 )
					{
						return true;
					}

					if(i+1 == i2 && j >= 1 && j-1 == j2)
					{
						return true;
					}
				}
				if(i == i2 && j <= 6 && j+1 == j2)
				{
					return true;
				} if(i == i2 && j >= 1 && j-1 == j2)
				{
					return true;
				}
				}
				
				return false;
			};

			GameBoard.prototype.illegalMovePawn = function(i, j, i2, j2)
			{
				if(i2 <=6)
				{
					if(j2 == j && (i2+1==i) && this.chessBoard[i][j] == '0')
					{
						return true;
					}
				}

				if(i2<=5)
				{
					if(j2==j && (i2+2==i) && i2==1 && this.chessBoard[i][j] == '0' && this.chessBoard[i-1][j] == '0')
					{
						return true;
					}
				}
				
				return false;
			};

			GameBoard.prototype.illegalMovePawn1 = function(i, j, i2, j2)
			{
				if(i2>=1)
				{
					if(j2 == j && (i2-1==i) && this.chessBoard[i][j] == '0')
					{
						return true;
					}
				}

				if(i2>=2)
				{
					if(j2==j && (i2-2==i) && i2==6 && this.chessBoard[i][j] == '0' && this.chessBoard[i+1][j] == '0')
					{
						return true;
					}
				}
				return false;
			};

			GameBoard.prototype.illegalMove = function(typeOfPlayer, from , to)
						{

							if(this.findPlaceInMatrix(to) != -1)
							{
								var place2 = this.findPlaceInMatrix(from)
								var place = this.findPlaceInMatrix(to);

								var i2 = place2.i;
								var j2 = place2.j;

								var i = place.i;
								var j = place.j;

								if(typeOfPlayer == "Pawn")
								{
									return this.illegalMovePawn(i, j, i2, j2);	
								}
								else if(typeOfPlayer == "Pawn1")
								{
									return this.illegalMovePawn1(i,j,i2,j2);
								}
								else if(typeOfPlayer == "King")
								{
									return this.illegalMoveKing(i,j,i2,j2) && !this.checkBlack(to);

								} else if(typeOfPlayer == "King1")
								{
									return this.illegalMoveKing(i,j,i2,j2) && !this.checkWhite(to);
								}
								else if(typeOfPlayer == "Queen" || typeOfPlayer == "Queen1")
								{
									return this.illegalMoveTower(i,j,i2,j2) || this.illegalMoveCrazy(i,j,i2,j2);
								}
								else if(typeOfPlayer == "Tower" || typeOfPlayer == "Tower1")
								{
									return this.illegalMoveTower(i,j,i2,j2);
								}
								else if(typeOfPlayer == "Crazy" || typeOfPlayer == "Crazy1")
								{
									return this.illegalMoveCrazy(i,j,i2,j2);
								}
								else if(typeOfPlayer == "Horse" || typeOfPlayer == "Horse1")
								{
									return this.illegalMoveHorse(i,j,i2,j2);
								}
							}
						};





			GameBoard.prototype.clearColoredBoards = function()
			{
				for(let i = 0; i < boxes.length; i++)
				{
					if(boxes[i].firstChild != null)
					{
						if(boxes[i].firstChild.className == "next_move_wrapper")
						{
							boxes[i].removeChild(boxes[i].childNodes[0]);
						}
					}
				}
			};

	//checks if board place is already occupied.

	GameBoard.prototype.placeAvailable = function(index)
	{
		var toCompare = 0;

		for(let i = 0; i < this.chessBoard.length; i++)
		{
			for(let j = 0; j < this.chessBoard[0].length; j++)
			{
				if(toCompare == index && this.chessBoard[i][j] == '0')
				{
					return true;
				}
				toCompare++;
			}
			
		}
		return false;
	};

	GameBoard.prototype.getColorOfPiece = function(i, j)
	{
		if(this.chessBoard[i][j].indexOf("1") !== -1)
			return "White";
		else if(this.chessBoard[i][j].indexOf("1") == -1)
		{
			return "Black";
		}
	};

	GameBoard.prototype.pieceIsEnemy = function(color, i, j)
	{
		if(color == "Black")
		{
			if(this.chessBoard[i][j].indexOf("1") != -1)
			{

				return true;
			}
		}
		else if(color == "White")
		{
			if(this.chessBoard[i][j].indexOf("1") == -1)
				return true;
		}
		return false;
	};

	GameBoard.prototype.isEnemy = function(index, color, i, j)
	{
		if(!this.placeAvailable(index) && this.pieceIsEnemy(color, i, j))
			return true;

		return false;
	};

	GameBoard.prototype.removePieceEnemy = function(index, typeOfPlayer)
	{
		boxes[index].removeChild(boxes[index].childNodes[0]);
	};

	GameBoard.prototype.legalTakeMove = function(i,j,i2,j2)
	{
		if(i <= 6){
			if(i+1 == i2 && j <= 6 && j+1 == j2)
			{
				return true;
			}

			if(i+1 == i2 && j >= 1 && j-1 == j2)
			{
				return true;
			}
		}
	};


	GameBoard.prototype.addPlayerToPiece = function(index, playerType)
	{
		var div = document.createElement("img");
		var urlString;

		if(playerType == "Pawn")
		{
			urlString = 'images/Chess_pdt60.png';
		}
		else if(playerType == "Tower")
		{
			urlString = 'images/Chess_rdt60.png';
		}
		else if(playerType == "Horse")
		{
			urlString = 'images/Chess_ndt60.png';
		}
		else if(playerType == "Crazy")
		{
			urlString = 'images/Chess_bdt60.png';
		}
		else if(playerType == "Queen")
		{
			urlString = 'images/Chess_qdt60.png';
		}
		else if(playerType == "King")
		{
			urlString = 'images/Chess_kdt60.png';
		}
		else if(playerType == "Tower1")
		{
			urlString = 'images/Chess_rlt60.png';
		}
		else if(playerType == "Horse1")
		{
			urlString = 'images/Chess_nlt60.png';
		}
		else if(playerType == "Crazy1")
		{
			urlString = 'images/Chess_blt60.png';
		}
		else if(playerType == "Queen1")
		{
			urlString = 'images/Chess_qlt60.png';
		}
		else if(playerType == "King1")
		{
			urlString = 'images/Chess_klt60.png';
		}
		else if(playerType == "Pawn1")
		{
			urlString = 'images/Chess_plt60.png';
		}

		div.src = urlString;
		div.setAttribute("class", "piecePlayer");
		boxes[index].appendChild(div);
	};