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

        // Update the player's turn
        this.playerTurn = this.playerTurn + 1 < this.players.length ? this.playerTurn + 1 : 0;

    }

    setupBoard(board) 
    {

        // Copy the players in this game to the board
        board.players = this.players;

        // Setup the pieces
        let rows = [0, 1, 6, 7];
        for (let i in rows)
        for (let x=0; x<8; x++)
        {
            let y = rows[i];

            let piece = "";
            if (y == 1 || y == 6)
                piece = "pawn";
            else {
                switch(x)
                {
                    case 0:
                    case 7:
                        piece = "rook";
                        break;
                    case 1:
                    case 6:
                        piece = "knight";
                        break;
                    case 2:
                    case 5:
                        piece = "bishop";
                        break;
                    case 3:
                        piece = "queen";
                        break;
                    case 4:
                        piece = "king";
                        break;
                }
            }

            let playerID = (y < 5) ? 1 : 0;
            board.setPiece(x, y, piece, playerID);
        }
    };

    getLegalMoves(pieceName, pieceLocation, board) {
        // Return no moves if there is no selected piece
        if (pieceName == "") return [];

        let pieceInfo = pieceName.split("/");
        let color = pieceInfo[0];
        let piece = pieceInfo[1];

        // Return no moves if these pieces are not of the current player
        if (color != this.players[this.playerTurn]) return [];

        // Handle player direction (for pawns, for example) 
        let multiplier = this.players[this.playerTurn] == "white" ? -1 : 1;

        // Calculate possible moves here
        let possibleMoves = [];
        for (let x = -1; x <= 1; x++)
        {
            let newX = pieceLocation[0] + x;
            let newY = pieceLocation[1] + multiplier;
            possibleMoves.push([newX, newY]);
        }
        
        // Filter out illegal moves and convert to right format
        let legalMoves = [];

        if (possibleMoves != null)
        for (let index in possibleMoves)
        {
            let loc = possibleMoves[index];
            if ( board.isLegalField(loc[0], loc[1]) )
            legalMoves.push(loc[0] + "/" + loc[1]);
        }

        return legalMoves;
    }
};

class Board {
    
    // Number of fields in each direction
    width = 8;
    height = 8;

    constructor()
    {
        // Create an empty board
        this.board = [];
        for(let y = 0; y < this.height; y++) {
            this.board[y] = [];
            for(let x = 0; x < this.width; x++) {
                this.board[y][x] = "";
            }
        }
    }

    erasePiece(x, y)
    {
        let piece = this.getPiece(x, y);
        this.setPiece(x, y, null, null);
        return piece;
    }

    setPiece(x, y, piece, playerID)
    {        
        let name = piece != null ? this.players[playerID] + "/" + piece : "";
        this.board[(this.height-1) - y][x] = name;
    }

    movePiece(oldX, oldY, newX, newY)
    {
        let captured = this.board[(this.height-1) - newY][newX];
        this.board[(this.height-1) - newY][newX] = this.board[(this.height-1) - oldY][oldX];
        this.board[(this.height-1) - oldY][oldX] = "";
        return captured;
    }
    
    hasPiece(x, y)
    {
        if ( ! this.isLegalField(x, y) ) return true;
        return this.board[(this.height-1) - y][x] != "";
    }

    playerHasPiece(x, y, playerString)
    {
        let piece = this.getPiece(x, y);
        if (piece == "") return false;
        let color = piece.split("/")[0];
        return color == playerString;
    }

    isLegalField(x, y)
    {
        return ( x >= 0 && x < this.width && y >= 0 && y < this.height );
    }

    getPiece(x, y)
    {
        return this.board[(this.height-1) - y][x];
    }
}