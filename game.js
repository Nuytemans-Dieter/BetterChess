class Game {
    
    constructor() {

        this.players = ["white", "black"];
        this.pieces = ["pawn", "bishop", "knight", "rook", "queen", "king"];
        this.chessSet = "drawn";

        this.getLegalMoves = function (pieceName, pieceLocation, board) {
            return "a1";
        };
    }


    setupBoard(board) {

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

            let playerID = (y < 5) ? 0 : 1;
            board.setPiece(x, y, piece, playerID);
        }
    };

    getLegalMoves(pieceName, pieceLocation, board) {
        return "a1";
    }
};

class Board {
    
    constructor()
    {
        // Create the empty board
        this.board = [];
        for(let y = 0; y < 8; y++) {
            this.board[y] = [];
            for(let x = 0; x < 8; x++) {
                this.board[y][x] = "";
            }
        }
    }

    erasePiece(x, y)
    {
        this.setPiece(x, y, null, null);
    }

    setPiece(x, y, piece, playerID)
    {
        if (x < 0 || x > 7 || y < 0 || y > 7) return;
        
        let name = piece != null ? this.players[playerID] + "/" + piece : "";
        this.board[y][x] = name;
    }

    getPiece(x, y)
    {
        if (x < 0 || x > 7 || y < 0 || y > 7) return "";
        return this.board[y][x];
    }
}