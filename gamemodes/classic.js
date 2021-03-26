class Game {
    
    constructor() {

        // Game settings
        this.chessSet = "illustrated";                  // The default chosen chess set

        // Game information
        this.players = ["white", "black"];
        this.playerTurn = 0;
        this.winnerID = null;
        this.isGameOver = false;
        this.pieces = ["pawn", "bishop", "knight", "rook", "queen", "king"];
        
        // En passant state tracking
        this.passantLocation = null;
        this.passantAttackLocation = null;

        // Castling state tracking
        this.canCastle = new Map();
        for (let i in this.players)
        {
            this.canCastle.set(this.players[i], {
                'canQueenside': true,
                'canKingside': true
            });
        }
    }

    currentPlayerName()
    {
        return this.players[this.playerTurn];
    }

    movePiece(board, startX, startY, endX, endY)
    {
        // Get piece info
        let pieceInfo = board.getPiece(startX, startY);

        // Update the piece's position
        let captured = board.movePiece(startX, startY, endX, endY);
        let hasCaptured = captured != "";

        if (captured != "")
        {
            let capturedInfo = captured.split("/");
            let capColor = capturedInfo[0];
            let capPiece = capturedInfo[1];
            if (capPiece == "king")
            {
                this.isGameOver = true;
                this.winnerID = this.playerTurn;
            }
        }

        // Handle captured pieces through en passant captures
        if (this.passantAttackLocation != null && this.passantAttackLocation[0] == endX && this.passantAttackLocation[1] == endY)
        {
            if (this.passantLocation != null) 
            {
                board.erasePiece(this.passantLocation[0], this.passantLocation[1]);
                hasCaptured = true;
            }
        }

        // Reset the en passant tracker
        this.passantLocation = null;

        // update meta data
        if (pieceInfo != "")
        {

            let split = pieceInfo.split("/");
            let player = split[0];
            let piece = split[1];

            // Update castling rights on king movement and perform castling when needed
            if (piece == "king")
            {
                let dict = this.canCastle.get(this.currentPlayerName());
                dict.canKingside = false;
                dict.canQueenside = false;

                // Check if the king did a castling move and adjust the rook
                let delta = endX - startX;
                if (Math.abs(delta) == 2 && startY - endY == 0)
                {
                    let rookLoc;
                    let newRookLoc;
                    if (delta > 0)
                    {
                        rookLoc = [7, endY];
                        newRookLoc = [5, endY];
                    }
                    else
                    {
                        rookLoc = [0, endY];
                        newRookLoc = [3, endY];
                    }
                    
                    board.movePiece(rookLoc[0], rookLoc[1], newRookLoc[0], newRookLoc[1]);
                }
            }

            // Update castling rights on rook movement
            if (piece == "rook")
            {
                if (startX == 0)
                {
                    let dict = this.canCastle.get(this.currentPlayerName());
                    dict.canQueenside = false;
                }
                else if (startX == 7)
                {
                    let dict = this.canCastle.get(this.currentPlayerName());
                    dict.canKingside = false;
                }
            }

            // Update en passant tracker
            if (piece == "pawn" && ( (player == "white" && startY == 6) || (player == "black" && startY == 1) ) && Math.abs(startY - endY) == 2 )
            {
                this.passantLocation = [endX, endY];
            }

            // Handle pawn promotion: Always promote to queen 
            if (piece == "pawn")
            {
                let yPromote = this.players[this.playerTurn] == "white" ? 0 : 7;
                if (endY == yPromote)
                {
                    board.setPiece(endX, endY, "queen", this.playerTurn)
                }
            }
        }

        // Update the player's turn
        this.playerTurn = this.playerTurn + 1 < this.players.length ? this.playerTurn + 1 : 0;

        return hasCaptured;
    }

    setupBoard(board) 
    {

        // Copy the players in this game to the board
        board.players = this.players;

        // Hard coded, see dynamically generated solution at https://github.com/Nuytemans-Dieter/Nuytemans-Dieter.github.io/blob/46c32e4f550000085fb3196cdb286f2acd462ccf/gamemodes/classic.js#L143
        let newBoard = [
            ["white/rook", "white/knight", "white/bishop", "white/queen", "white/king", "white/bishop", "white/knight", "white/rook"],
            ["white/pawn", "white/pawn", "white/pawn", "white/pawn", "white/pawn", "white/pawn", "white/pawn", "white/pawn"],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["black/pawn", "black/pawn", "black/pawn", "black/pawn", "black/pawn", "black/pawn", "black/pawn", "black/pawn"],
            ["black/rook", "black/knight", "black/bishop", "black/queen", "black/king", "black/bishop", "black/knight", "black/rook"],
        ];

        board.setBoard(newBoard);
    };

    getLegalMoves(pieceName, pieceLocation, board) {
        // Get color and piece
        let splitName = pieceName.split("/");
        let color = splitName[0];
        let piece = splitName[1];

        if (color != this.players[this.playerTurn] || this.isGameOver)
            return [];        

        let x = pieceLocation[0];
        let y = pieceLocation[1];

        // Declare collision trackers
        let hasCollision;
        let collisionLeftTop;
        let collisionRightTop;
        let collisionRightDown;
        let collisionLeftDown;

        // Find all possible moves for each piece

        let possibleMoves = [];
        switch(piece)
        {
            case "pawn":
                let multiplier = color == "white" ? -1 : 1;
                let newY = y + multiplier;
                for (let relX = -1; relX <= 1; relX++)
                {
                    let newX = x + relX;

                    let mayHavePiece = Math.abs(relX % 2) == 1 ? true : false;
                    let hasPiece = board.hasPiece(newX, newY);

                    if ( hasPiece == mayHavePiece )
                    possibleMoves.push([newX, newY]);
                }
                
                // Allow two field move when no piece is present and pawn is of the right team and in the right location
                let twoMoveY = y + (multiplier * 2);
                if ( (!board.hasPiece(x, twoMoveY)) && !board.hasPiece(x, y + multiplier) && ( (color == "white" && y == 6) || (color == "black" && y == 1)) )
                {
                    possibleMoves.push([x, twoMoveY]);
                }
                
                // Handle en passant rules and extra data
                if (this.passantLocation != null)
                {
                    let passantInfo = board.getPiece(this.passantLocation[0], this.passantLocation[1]).split("/");
                    let passantColor = passantInfo[0];
                    if (passantColor != color)
                    {
                        if (this.passantLocation[0] == x - 1 && this.passantLocation[1] == y )
                        {
                            let loc = [x - 1, newY];
                            possibleMoves.push(loc);
                            this.passantAttackLocation = loc;
                        }
                        else if (this.passantLocation[0] == x + 1 && this.passantLocation[1] == y )
                        {
                            let loc = [x + 1, newY];
                            possibleMoves.push(loc);
                            this.passantAttackLocation = loc;
                        }
                    }
                }

                break;
            case "rook":
                
                hasCollision = false;
                for (let relX = -1; !hasCollision && relX >= -7; relX--)
                {
                    let newX = x + relX;
                    possibleMoves.push([newX, y]);

                    if (board.hasPiece(newX, y))
                        hasCollision = true;
                }

                hasCollision = false;
                for (let relX = 1; !hasCollision && relX <= 7; relX++)
                {
                    let newX = x + relX;
                    possibleMoves.push([newX, y]);

                    if (board.hasPiece(newX, y))
                        hasCollision = true;
                }

                hasCollision = false;
                for (let relY = -1; !hasCollision && relY >= -7; relY--)
                {
                    let newY = y + relY;
                    possibleMoves.push([x, newY]);

                    if (board.hasPiece(x, newY))
                        hasCollision = true;
                }

                hasCollision = false;
                for (let relY = 1; !hasCollision && relY <= 7; relY++)
                {
                    let newY = y + relY;
                    possibleMoves.push([x, newY]);

                    if (board.hasPiece(x, newY))
                        hasCollision = true;
                }

                break;
            case "knight":
                let rel = [-2, 2, -1, 1];
                for (let i = 0; i < rel.length; i++)
                for (let j = 0; j < rel.length; j++)
                {
                    let relX = rel[i];
                    let relY = rel[j];
                    if (Math.abs(relX) != Math.abs(relY))
                    {
                        possibleMoves.push([x + relX, y + relY]);
                    }
                }
                break;
            case "bishop":
                collisionLeftTop = false;
                collisionRightTop = false;
                collisionRightDown = false;
                collisionLeftDown = false;
                for (let rel = 1; rel <= 7; rel++)
                {
                    if (!collisionLeftTop)
                    {
                        let newX = x - rel;
                        let newY = y - rel;
                        possibleMoves.push([newX, newY]);
                        if (board.hasPiece(newX, newY)) collisionLeftTop = true;
                    }

                    if (!collisionRightDown)
                    {
                        let newX = x + rel;
                        let newY = y + rel;
                        possibleMoves.push([newX, newY]);
                        if (board.hasPiece(newX, newY)) collisionRightDown = true;
                    }

                    if (!collisionRightTop)
                    {
                        let newX = x + rel;
                        let newY = y - rel;
                        possibleMoves.push([newX, newY]);
                        if (board.hasPiece(newX, newY)) collisionRightTop = true;
                    }

                    if (!collisionLeftDown)
                    {
                        let newX = x - rel;
                        let newY = y + rel;
                        possibleMoves.push([newX, newY]);
                        if (board.hasPiece(newX, newY)) collisionLeftDown = true;
                    }

                }
                break;
            case "king":

                // Basic king movement
                for (let relX = -1; relX <= 1; relX++)
                for (let relY = -1; relY <= 1; relY++)
                {
                    if ( !(relX == 0 && relY == 0))
                        possibleMoves.push([x + relX, y + relY]);
                }
                
                // King side castling
                if (this.canCastle.get(this.currentPlayerName()).canKingside)
                {
                    let relX = x + 2;
                    let mayCastle = true;
                    for (let interX = 1; mayCastle && interX <= 2; interX++)
                    {
                        mayCastle = !board.hasPiece(x + interX, y);
                    }
                    possibleMoves.push([relX, y]);
                }
                
                // Queen side castling
                if (this.canCastle.get(this.currentPlayerName()).canQueenside)
                {
                    let relX = x - 2;
                    let mayCastle = true;
                    for (let interX = -1; mayCastle && interX >= -3; interX--)
                    {
                        mayCastle = !board.hasPiece(x + interX, y);
                    }
                    possibleMoves.push([relX, y]);
                }

                break;
            case "queen":
                hasCollision = false;
                for (let relX = -1; !hasCollision && relX >= -7; relX--)
                {
                    let newX = x + relX;
                    possibleMoves.push([newX, y]);

                    if (board.hasPiece(newX, y))
                        hasCollision = true;
                }

                hasCollision = false;
                for (let relX = 1; !hasCollision && relX <= 7; relX++)
                {
                    let newX = x + relX;
                    possibleMoves.push([newX, y]);

                    if (board.hasPiece(newX, y))
                        hasCollision = true;
                }

                hasCollision = false;
                for (let relY = -1; !hasCollision && relY >= -7; relY--)
                {
                    let newY = y + relY;
                    possibleMoves.push([x, newY]);

                    if (board.hasPiece(x, newY))
                        hasCollision = true;
                }

                hasCollision = false;
                for (let relY = 1; !hasCollision && relY <= 7; relY++)
                {
                    let newY = y + relY;
                    possibleMoves.push([x, newY]);

                    if (board.hasPiece(x, newY))
                        hasCollision = true;
                }

                collisionLeftTop = false;
                collisionRightTop = false;
                collisionRightDown = false;
                collisionLeftDown = false;
                for (let rel = 1; rel <= 7; rel++)
                {
                    if (!collisionLeftTop)
                    {
                        let newX = x - rel;
                        let newY = y - rel;
                        possibleMoves.push([newX, newY]);
                        if (board.hasPiece(newX, newY)) collisionLeftTop = true;
                    }

                    if (!collisionRightDown)
                    {
                        let newX = x + rel;
                        let newY = y + rel;
                        possibleMoves.push([newX, newY]);
                        if (board.hasPiece(newX, newY)) collisionRightDown = true;
                    }

                    if (!collisionRightTop)
                    {
                        let newX = x + rel;
                        let newY = y - rel;
                        possibleMoves.push([newX, newY]);
                        if (board.hasPiece(newX, newY)) collisionRightTop = true;
                    }

                    if (!collisionLeftDown)
                    {
                        let newX = x - rel;
                        let newY = y + rel;
                        possibleMoves.push([newX, newY]);
                        if (board.hasPiece(newX, newY)) collisionLeftDown = true;
                    }

                }
                break;
        }

        // Retrieve all possible moves and store all moves that end up on the board

        let legalMoves = [];

        if (possibleMoves != null)
        for (let index in possibleMoves)
        {
            let loc = possibleMoves[index];
            if ( board.isLegalField(loc[0], loc[1]) && !board.playerHasPiece(loc[0], loc[1], this.players[this.playerTurn]) )
            legalMoves.push(loc[0] + "/" + loc[1]);
        }

        return legalMoves;
    }
};