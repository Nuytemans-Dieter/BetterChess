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

    setBoard(newBoard)
    {
        const dimensions = [
            newBoard.length,
            newBoard.reduce((x, y) => Math.max(x, y.length), 0)
        ];

        if (dimensions[0] != this.width || dimensions[1] != this.height) return;
        
        this.board = newBoard;
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