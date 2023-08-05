const canvas = document.getElementById("game")
const context = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const paddleWidth = 18,
paddleHeight = 120,
paddleSpeed = 1,
ballRadius = 12,
initialBallSpeed = 14,
maxBallSpeed = 40,
netWidth = 5,
netColor = "WHITE";

function drawNet(){
    for(let i= 0;i<=canvas.height;i+=15){
        drawRect(canvas.width / 2- netWidth / 2, i, netWidth, 10, netColor)
    }
}

function drawRect(x, y, width, height, color){
    context.fillStyle = color
    context.fillRect(x ,y   ,width, height )
}

function drawCircle(x, y, radius, color){
    context.fillStyle = color
    context.beginPath()
    context.arc(x, y, radius, 0, Math.PI*2, false)
    context.closePath()
    context.fill()
}

function drawText(text, x, y, color, fontSize=500, fontWeight= 'bold', font = 'Courier New'){
    context.fillStyle = color
    context.font = '$(fontSize)px $(font)'
    context.textAlign = 'center'
    context.fillText(text, x, y)
}

function createPaddle(x, y, width, height, color){
    return{x, y, width, height, color, score:0}
}

function createBall(x, y, radius, velocityX, velocityY, color){
    return{x, y, radius, velocityX, velocityY, color, speed:initialBallSpeed}  
}

//define user and comp paddle
const user = createPaddle(0, canvas.height/2-paddleHeight/2, paddleWidth, paddleHeight, 'BLUE')

const comp = createPaddle(canvas.width-paddleWidth,canvas.height/2- paddleWidth/2, paddleWidth, paddleHeight, 'RED')

const ball = createBall(canvas.width/2, canvas.height/2, ballRadius, initialBallSpeed,initialBallSpeed, 'WHITE')

canvas.addEventListener('mousemove', mouvePaddle)

function mouvePaddle(event){
    const rect = canvas.getBoundingClientRect()
    user.y = event.clientY - rect.top - user.height/2
}

const threshold = 5;

function computerAI() {
  const compYCenter = comp.y + comp.height / 2;
  const ballYCenter = ball.y;

  const diffY = Math.abs(compYCenter - ballYCenter);

  if (diffY > threshold) {
    if (compYCenter < ballYCenter) {
      comp.y += paddleSpeed;
    } else {
      comp.y -= paddleSpeed;
    }
  }
}

function collision(b, p){
    return( b.x + b.radius > p.x && b.x-b.radius< p.x+p.width && b.y+b.radius > p.y&&b.y - b.radius < p.y+ p.height)
}

function resetBall(){
    ball.x = canvas.width/2
    ball.y = Math.random() * (canvas.height - ball.radius * 2) + ball.radius
    ball.velocityX= -ball.velocityX
    ball.speed = initialBallSpeed
}

function update(){
    //check score and reset ball if necessairy
    if (ball.x-ball.radius<0){
        comp.score++
        resetBall()
    }else if(ball.x + ball.radius > canvas.width){
        user.score++
        resetBall()
    }

    //update ball position
    ball.x += ball.velocityX
    ball.y += ball.velocityY

    //update computer ^paddle pos based on ball

    comp.y+=(ball.y - (comp.y + comp.height/2))*0.1
    //top and bottom walls

    if(ball.y - ball.radius<0 || ball.y + ball.radius > canvas.height){
        ball.velocityY= -ball.velocityY
    }

    //determine which paddle is begin hit by the ball and handle collision
    let player = ball.x + ball.radius < canvas.width / 2 ? user:comp
    if(collision(ball, player)){
        const collidePoint = ball.y - (player.y +player.height/2)
        const collisionAngle = (Math.PI/4 )*(collidePoint/(player.height/2))
        const direction = ball.x +ball.radius < canvas.width/2 ?1 : -1
        ball.velocityX = direction * ball.speed*Math.cos(collisionAngle)
        ball.velocityY = ball.speed*Math.sin(collisionAngle)
        
        //increase ball speed and limit max speed
        
        ball.speed += 0.2
        if (ball.speed > maxBallSpeed){
            ball.speed = maxBallSpeed
        }
    }
    computerAI()
}

//render game on canvas
function render(){
    //clear canvas with black screen
    drawRect(0,0,canvas.width, canvas.height, '#547579')
    drawNet()
    drawText(user.score, canvas.width/4, canvas.height/2, "WHITE",400, 'bold')
    drawText(comp.score,(3* canvas.width)/4, canvas.height/2, "WHITE",400, 'bold')

    drawRect(user.x, user.y, user.width,user.height,user.color)
    drawRect(comp.x, comp.y, comp.width,comp.height,comp.color)
    drawCircle(ball.x,ball.y, ball.radius,ball.color)


}

//run game loop
function gameLoop(){
    update();
    render()
}

const fps = 60
setInterval(gameLoop,1000/fps)
