import readline from 'readline'
// process.stdin.setEncoding('utf8');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


class SnakeGame {
    private readonly board: string[][]
    private readonly snake: number[][]
    private readonly food: number[]
    private movementInterval: any

    constructor(private readonly rows: number, private readonly cols: number) {
        this.board = Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => ".")
        )
        this.snake = [[0, 0]]
        this.food = this.generateFood()
        this.placeFood()
    }

    private generateFood(): number[] {
        const row = Math.floor(Math.random() * this.rows)
        const col = Math.floor(Math.random() * this.cols)
        return [row, col]
    }

    private placeFood(): void {
        const [row, col] = this.food
        this.board[row][col] = "*"
    }

    private clearSnake(): void {
        for (const [row, col] of this.snake) {
            this.board[row][col] = "."
        }
    }

    private drawSnake(): void {
        for (const [row, col] of this.snake) {
            this.board[row][col] = "#"
        }
    }

    private moveSnake(dx: number, dy: number): void {
        const [headRow, headCol] = this.snake[0]
        const newRow = headRow + dy
        const newCol = headCol + dx
        // if head hits border throw error
        if (
            newRow < 0 ||
            newRow >= this.rows ||
            newCol < 0 ||
            newCol >= this.cols ||
            this.board[newRow][newCol] === "#"
        ) {
            throw new Error("Game over!")
        } 

        this.snake.unshift([newRow, newCol])

        if (newRow === this.food[0] && newCol === this.food[1]) {
            this.food.splice(0, 1, ...this.generateFood())
            this.placeFood()
        } else {
            this.snake.pop()
        }
    }

    public start(): void {
        console.clear()
        console.log("Use arrow keys to move the snake.")
        console.log("Press Ctrl+C to exit the game.")
        this.drawSnake()
        this.placeFood()
        this.printBoard()

        const keyListener = (key: any): void => {
            // console.log("key ===", key)
            switch (key) {
                case "up":
                    this.clearSnake()
                    this.moveSnake(0, -1)
                    break
                case "down":
                    this.clearSnake()
                    this.moveSnake(0, 1)
                    break
                case "left":
                    this.clearSnake()
                    this.moveSnake(-1, 0)
                    break
                case "right":
                    this.clearSnake()
                    this.moveSnake(1, 0)
                    break
                default:
                    return
            }

            this.drawSnake()
            this.printBoard()
        }

        // listen for keypress events
        readline.emitKeypressEvents(process.stdin)
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true)
        }

        process.stdin.on('keypress', (key: string, _?: readline.Key) => {
            if(this.movementInterval){
                clearInterval(this.movementInterval)
            }
            this.movementInterval = setInterval(()=>{
                _ ? keyListener(_.name) : ""
            }, 300)
            // _ ? keyListener(_.name) : ""
            console.log(`key === ${key} _ === ${_}`)
        })
        // process.stdin.on('data', key => keyListener(key))
    }

    private printBoard(): void {
        console.clear()
        console.log(this.board.map((row) => row.join(" ")).join("\n"))
    }
}

const game = new SnakeGame(20, 20)
game.start()
