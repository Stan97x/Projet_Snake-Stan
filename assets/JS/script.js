(function() {
    // Configuration du Canvas
    const canvas = document.getElementById("canvas")
    const ctx = canvas.getContext("2d")
    const canvasSize = 600
    const cellSize = 20  // Taille de chaque cellule du serpent et de la nourriture
    const w = (canvas.width = canvasSize)
    const h = (canvas.height = canvasSize)
    const canvasFillColor = "#000d36"
    const canvasStrokeColor = "rgba(85, 59, 73, 0.8)"
    
    // Récupération des ID
    const scoreEL = document.getElementById("score")
    const HighEL = document.getElementById("high-score")
    const play = document.getElementById("plays")
    const reset = document.getElementById("reset")

    // Variables de jeu
    let snake
    let direction
    let food
    let score
    const frameRate = 8
    let gameStarted = false

    // Mise en départ du score
    let highScore = localStorage.getItem("high-score") || 0
    HighEL.innerText = `High Score: ${highScore}`

    // Fonction pour générer une position aléatoire pour la nourriture
    const getRandomFoodPosition = () => ({
        x: Math.floor(Math.random() * (canvas.width / cellSize)) * cellSize,
        y: Math.floor(Math.random() * (canvas.height / cellSize)) * cellSize,
    })

    // Fonction pour dessiner le serpent
    const drawSnake = () => {
        ctx.fillStyle = "lightpink"
        ctx.strokeStyle = "darkpink"
        snake.forEach(part => {
            ctx.fillRect(part.x, part.y, cellSize, cellSize)
            ctx.strokeRect(part.x, part.y, cellSize, cellSize)
        })
    }

    // Fonction pour dessiner la nourriture
    const drawFood = () => {
        ctx.fillStyle = "red"
        ctx.roundRect(food.x, food.y, cellSize, cellSize)
        ctx.fillRect(food.x, food.y, cellSize, cellSize)
    }

    // Fonction pour mettre à jour la position du serpent
    const moveSnake = () => {
        const head = {x: snake[0].x + direction.x * cellSize, y: snake[0].y + direction.y * cellSize}
        snake.unshift(head);

        // Vérifie si le serpent a mangé la nourriture
        if (head.x === food.x && head.y === food.y) {
            score += 10
            setScore()
            food = getRandomFoodPosition()// Génère une nouvelle position pour la nourriture
        } else {
            snake.pop()// Supprime la dernière partie du serpent si la nourriture n'a pas été mangée
        }
    }

    // Fonction pour vérifier les collisions
    const checkCollision = () => {
        const head = snake[0]

        // Collision avec les murs
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            return true
        }

        // Collision avec soi-même
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true
            }
        }

        return false;
    }

    // Fonction pour mettre à jour le score
    const setScore = () => {
        scoreEL.innerHTML = `Score: ${score}`;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("high-score", highScore)
            HighEL.innerHTML = `High Score: ${highScore}`
        }
    }

    // Fonction pour dessiner le message Game Over
    const drawGameOver = () => {
        ctx.fillStyle = "green"
        ctx.font = "50px 'Press Start 2P'"
        ctx.textAlign = "center"
        ctx.fillText("Game Over", w / 2, h / 2)
    }

    // Fonction pour réinitialiser le jeu
    const resetGame = () => {
        snake = [{x: 140, y: 140}]
        direction = {x: 1, y: 0}
        score = 0
        food = getRandomFoodPosition()
        setScore()
        gameStarted = true
    }

    // Fonction principale d'animation
    const gameLoop = () => {
        if (!gameStarted) return

        if (checkCollision()) {
            drawGameOver();
            reset.style.display = "block"
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        carreau()
        drawGrid()
        moveSnake()
        drawSnake()
        drawFood()
        setTimeout(gameLoop, 1000 / frameRate)
    }

    // Écoute les touches du clavier pour changer la direction du serpent
    document.addEventListener("keydown", event => {
        const { key } = event
        if (key === "ArrowUp" && direction.y === 0) {
            direction = {x: 0, y: -1}
        } else if (key === "ArrowDown" && direction.y === 0) {
            direction = {x: 0, y: 1}
        } else if (key === "ArrowLeft" && direction.x === 0) {
            direction = {x: -1, y: 0}
        } else if (key === "ArrowRight" && direction.x === 0) {
            direction = {x: 1, y: 0}
        }
    })
    // Fonction pour dessiner le cadre du canvas
    const carreau = () => {
        ctx.fillStyle = canvasFillColor
        ctx.fillRect(0, 0, w, h)
        ctx.strokeStyle = canvasStrokeColor
        ctx.strokeRect(0, 0, w, h)
    }

    // Fonction pour dessiner la grille
    const drawGrid = () => {
        ctx.beginPath()
        const pGrid = 4
        const grid_line_len = canvasSize - 2 * pGrid
        const cellSize = grid_line_len / 44

        for (let i = 0; i <= grid_line_len; i += cellSize) {
            ctx.moveTo(i + pGrid, pGrid);
            ctx.lineTo(i + pGrid, grid_line_len + pGrid)
        }

        for (let i = 0; i <= grid_line_len; i += cellSize) {
            ctx.moveTo(pGrid, i + pGrid);
            ctx.lineTo(grid_line_len + pGrid, i + pGrid)
        }

        ctx.closePath()
        ctx.strokeStyle = canvasStrokeColor
        ctx.stroke();
    }

    // Gestionnaire d'événements pour le bouton Play
    play.addEventListener("click", () => {
        play.style.display = "none"
        reset.style.display = "none"
        resetGame()
        gameLoop()
    })

    // Gestionnaire d'événements pour le bouton Recommencer
    reset.addEventListener("click", () => {
        reset.style.display = "none"
        resetGame()
        gameLoop()
    })

    // Affiche le bouton Play au démarrage
    play.style.display = "block"
})()
