//alert("Hello friends!");
const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div'),
    music = document.createElement('embed'),
    level1 = document.querySelector('.start .level1'),
    level2 = document.querySelector('.start .level2'),
    level3 = document.querySelector('.start .level3');




music.setAttribute('src', './audio.mp3');
music.setAttribute('type', 'audio/mp3');

car.classList.add('car');//add class to div(const car)

//console.log('Hello');


//old method - can use onley one event ( if on this var write new one it override old )
/*start.onclick = function() {
    start.classList.add('hide');
};*/


//new method
//can add many events on one var and duplicate too
//start.addEventListener('click', startGame);//button start game
level1.onclick = () => startGame(3);
level2.onclick = () => startGame(6);
level3.onclick = () => startGame(9);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);


const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const setting = {
    start: false,//game started if true
    score: 0,
    speed: 3,
    traffic: 3
};

//------------------ Json ----------------------------
// const response = fetch("http://localhost:8888/db.json");
// const myJson = response.json();
// console.log(JSON.stringify(myJson));


function getQuantityElements(heightElement) {
    return document.documentElement.clientHeight / heightElement + 1;
}
// console.log(getQuantityElements(200));

function startGame(level) {
    start.classList.add('hide');
    gameArea.innerHTML = '';//clean area for new game


    for (let i = 0 ; i < getQuantityElements(100) ; i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';

        line.y = i * 100;
        gameArea.appendChild(line);
    }

    for(let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url(./image/enemy${Math.floor(Math.random() * (4-1)) + 1}.png) center / cover no-repeat`;
        gameArea.appendChild(enemy);
    }
    setting.speed = level;
    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(car);
    gameArea.appendChild(music);

    //car.style.left = '125px';//put car to start
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;//better way
    car.style.top = 'auto';//""
    car.style.bottom = '10px';//""

    setting.x = car.offsetLeft;//move offset from start point on x
    setting.y = car.offsetTop;//move offset from start point on y
    requestAnimationFrame(playGame);//tell to browser we want animation for smooth move each frame
}

function playGame() {
    // console.log('Play game!');
    
    if(setting.start === true) {//game started can't run again
        setting.score += setting.speed;
        score.innerHTML ='SCORE<br>' + setting.score;

        moveRoad();
        moveEnemy();

        if(keys.ArrowLeft === true && setting.x > 0) {
            setting.x -= setting.speed;
        }

        if(keys.ArrowRight === true && setting.x < (gameArea.offsetWidth - car.offsetWidth) ){
            setting.x += setting.speed;
        }

        if(keys.ArrowDown === true  && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
            setting.y += setting.speed;
        }

        if(keys.ArrowUp === true && setting.y > 0) {
            setting.y -= setting.speed;
        }

        car.style.top = setting.y + 'px';
        car.style.left = setting.x + 'px';
        requestAnimationFrame(playGame);//recursion - this request from browser to wait empty space on stack and then start
    }
    
}

function startRun(event) {
    //------ variant 1 - FOR IGNORE NOT NEEDED PRESSED KEYS ------
    //event.preventDefault();
    //keys[event.key] = true;
    //console.log('start');
    //console.log(event.key);

    //----- variant 2 - this check good for fast check on sivils -------
    if(keys.hasOwnProperty(event.key)){
        keys[event.key] = true;
    }

    //------ variant 3 - good check for all nodes (parent , sivils and more - not fast variant )-------
    /*if(event.key in keys) {
        keys[event.key] = true;
    }*/
}

function stopRun(event) {
    //console.log('stop');
    //------ variant 1 - FOR IGNORE NOT NEEDED PRESSED KEYS ------
    //event.preventDefault();
    //keys[event.key] = false;
    //console.log('start');
    //console.log(event.key);

    //----- variant 2 this check good for fast check on sivils -------
    if(keys.hasOwnProperty(event.key)){
        keys[event.key] = false;
    }

    //------ variant 3 good check for all nodes (parent , sivils and more - not fast variant )-------
    /*if(event.key in keys) {
        keys[event.key] = false;
    }*/
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(line) {
        // console.log(item);
        line.y += setting.speed;
        line.style.top = line.y + 'px';

        if(line.y >= document.documentElement.clientHeight) {//if element go over the document get him back -100px
            line.y = -100;
        }
    });
}

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function(item) {
        // ---------- get bounds of cars - for crash  -----------
        let carRect = car.getBoundingClientRect();
        // console.log('carRect: ', carRect);
        let enemyRect = item.getBoundingClientRect();
        if(carRect.top <= enemyRect.bottom && carRect.right >= enemyRect.left && carRect.left <= enemyRect.right && carRect.bottom >= enemyRect.top){//term for crash
            console.warn('crash');

//------------------------------------------------------------  






 //------------------------------------------------------------
            setting.start = false;//stop the game
            start.classList.remove('hide');
            start.style.top = score.offsetHeight;//show score up to text start

       



        }
        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';

        if(item.y >= document.documentElement.clientHeight) {//if element go over the document get him back -100px * traffic =3
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });
}
