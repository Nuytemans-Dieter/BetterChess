class Game {
    
    constructor() {

        this.players = ["white", "black"];
        this.pieces = ["pawn", "bishop", "knight", "rook", "queen", "king"];
        this.chessSet = "drawn";
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
        // Get color and piece
        let splitName = pieceName.split("/");
        let color = splitName[0];
        let piece = splitName[1];

        let legalMoves = [];

        switch(piece)
        {
            case "pawn":
                let multiplier = color == "white" ? 1 : -1;
                let newY = pieceLocation[1] + (multiplier);
                for (let relX = -1; relX < 2; relX++)
                {
                    let newX = pieceLocation[0] + relX;
                    let mayHavePiece = relX % 2 == 1 ? true : false;
                    let hasPiece = board.hasPiece(newX, newY);

                    if ( (hasPiece && mayHavePiece) || (!hasPiece && !mayHavePiece) )
                    legalMoves.push(newX + "/" + newY);
                }
                break;
            case "rook":
                break;
            case "knight":
                break;
            case "bishop":
                break;
            case "king":
                break;
            case "queen":
                break;
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
        this.setPiece(x, y, null, null);
    }

    setPiece(x, y, piece, playerID)
    {        
        let name = piece != null ? this.players[playerID] + "/" + piece : "";
        this.board[(this.height-1) - y][x] = name;
    }

    movePiece(oldX, oldY, newX, newY)
    {
        this.board[(this.height-1) - newY][newX] = this.board[(this.height-1) - oldY][oldX];
        this.board[(this.height-1) - oldY][oldX] = "";
    }
    
    hasPiece(x, y)
    {
        return this.board[y][x] != "";
    }

    getPiece(x, y)
    {
        if (x < 0 || x > 7 || y < 0 || y > 7) return "";
        return this.board[(this.height-1) - y][x];
    }
}