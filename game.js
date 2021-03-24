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

            let playerID = (y < 5) ? 1 : 0;
            board.setPiece(x, y, piece, playerID);
        }
    };

    getLegalMoves(pieceName, pieceLocation, board) {
        // Get color and piece
        let splitName = pieceName.split("/");
        let color = splitName[0];
        let piece = splitName[1];

        let x = pieceLocation[0];
        let y = pieceLocation[1];

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
                if ( (!board.hasPiece(x, twoMoveY)) && ( (color == "white" && y == 6) || (color == "black" && y == 1)) )
                {
                    possibleMoves.push([x, twoMoveY]);
                }
                
                // TODO: En passant

                break;
            case "rook":
                
                let hasCollision = false;
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

                let collisionLeftTop = false;
                let collisionRightTop = false;
                let collisionRightDown = false;
                let collisionLeftDown = false;
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
                break;
            case "queen":
                break;
        }

        // Retrieve all possible moves and store all moves that end up on the board

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
        if ( ! this.isLegalField(x, y) ) return true;
        return this.board[(this.height-1) - y][x] != "";
    }

    isLegalField(x, y)
    {
        return ( x >= 0 && x < this.width && y >= 0 && y < this.height );
    }

    getPiece(x, y)
    {
        if (x < 0 || x > 7 || y < 0 || y > 7) return "";
        return this.board[(this.height-1) - y][x];
    }
}