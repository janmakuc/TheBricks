function drawIt() {
    var canvas = document.getElementById('igra');
    var point = document.getElementById('p');
    var gameover = document.getElementById('gameover');
    var cas = document.getElementById('cas');
    var storage = document.getElementById('storage');
    var dosezki = document.getElementById('dosezki');
    var ctx = canvas.getContext('2d');
    var lifeCan = document.getElementById('lifeCan');
    var ctd = lifeCan.getContext('2d');
    var button = document.getElementById('reset');
    var sirinaCan = canvas.width;
    var visinaCan = canvas.height;
    //plošček
    var right = false;
    var left = false;
    var sirina = 80;
    var visina = 18;
    var x2 = sirinaCan / 2 - sirina / 2;
    var dx2 = 6;
    //žogica
    var r = 8;
    var x;
    var y;
    var dx = 0;
    var dy = -4;
    //opeke
    var vrsta = 4;
    var stolpec = 16;
    var padding = 3.8;
    var brickHeight = 20;
    var brickhWidth = sirinaCan / stolpec + padding;
    var bricks = new Array(vrsta);
    var i;
    var j;
    //inicializacija opek
    for (i = 0; i < vrsta; i++) {
        bricks[i] = new Array(stolpec);
        for (j = 0; j < stolpec; j++) {
            bricks[i][j] = 1;
        }
    }
    button.style.visibility="hidden";
    //čas
    var sekundeI;
    var minuteI;
    var sekunde = 0;
    var izpisTimer = "00:00";
    var intervalTimer;
    var time = false;
    //gameplay
    var x = 0;
    var score = 0;
    var up = true;
    var life = 3;
    var refreshInterval;
    var rowheight = brickHeight + padding * 2;
    var colwidth = brickhWidth + padding;
    //local storage
    localStorage.setItem("time", izpisTimer);
    localStorage.setItem("score", 0);
    //postavitev
    point.style.marginTop = -visinaCan + document.getElementById('reset').offsetTop + padding * 2 + 'px';
    point.style.marginLeft = canvas.offsetLeft + canvas.clientWidth + padding * 2 + 'px';

    cas.style.marginTop = -visinaCan + point.offsetTop + 'px';
    cas.style.marginLeft = canvas.offsetLeft + canvas.clientWidth + padding * 2 + 'px';

    storage.style.marginTop = document.getElementById("x").clientHeight + 'px';
    dosezki.style.marginTop = -visinaCan + cas.offsetTop + 'px';
    dosezki.style.marginLeft = canvas.offsetLeft + canvas.clientWidth + padding * 2 + 'px';

    lifeCan.style.marginLeft = sirinaCan / 2 + padding + "px";
    lifeCan.style.marginTop = -visinaCan + dosezki.offsetTop + padding * 4 + 'px';
    //čas
    function timer() {
        if (time) {
            sekunde++;
            sekundeI = ((sekundeI = (sekunde % 60)) > 9) ? sekundeI : "0" + sekundeI;
            minuteI = ((minuteI = Math.floor(sekunde / 60)) > 9) ? minuteI : "0" + minuteI;
            izpisTimer = minuteI + ":" + sekundeI;
        }
        cas.innerHTML = "Č a s: " + izpisTimer;
    }
    this.reset = function () {
        gameover.style.display = 'none';
        score = 0;
        life = 3;
        x2 = sirinaCan / 2 - sirina / 2;
        x = x2 + sirina / 2 - r / 2;
        y = visinaCan - visina - r - 2;
        for (i = 0; i < vrsta; i++) {
            bricks[i] = new Array(stolpec);
            for (j = 0; j < stolpec; j++) {
                bricks[i][j] = 1;
            }
        }
    }

    function draw() {
        //žogica
        if (up) {
            x = x2 + sirina / 2 - r / 2;
            y = visinaCan - visina - r - 2;
        }
        ctx.fillStyle = "rgb(3,148,39)";
        ctx.clearRect(0, 0, sirinaCan, visinaCan);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        //plošček
        ctx.fillStyle = "rgb(153,74,42)";
        ctx.beginPath();
        ctx.rect(x2, visinaCan - visina, sirina, visina);
        ctx.closePath();
        ctx.fill();
        //točke
        point.innerHTML = "D o s e ž e k : " + score;
        //risanje opek
        var img2 = document.getElementById("kamen");
        var pat = ctx.createPattern(img2, "repeat");
        ctx.fillStyle = pat;
        for (i = 0; i < bricks.length; i++) {
            for (j = 0; j < bricks[i].length - 2; j++) {
                if (bricks[i][j] == 1) {
                    ctx.beginPath();
                    ctx.rect(j * (brickhWidth + padding) + padding, i * (brickHeight + padding) + padding, brickhWidth, brickHeight);
                    ctx.closePath();
                    ctx.fill();
                }
            }
        }
        //življenja
        var img = document.getElementById("life");
        switch (life) {
            case 1:
                ctd.beginPath();
                ctd.clearRect(0, 0, 200, 200);
                ctd.drawImage(img, 0, 0, 50, 50);
                ctd.closePath();
                ctd.fill();
                break;
            case 2:
                ctd.beginPath();
                ctd.clearRect(0, 0, 200, 200);
                ctd.drawImage(img, 0, 0, 50, 50);
                ctd.drawImage(img, 50, 0, 50, 50);
                ctd.closePath();
                ctd.fill();
                break;
            case 3:
                ctd.beginPath();
                ctd.clearRect(0, 0, 200, 200);
                ctd.drawImage(img, 0, 0, 50, 50);
                ctd.drawImage(img, 50, 0, 50, 50);
                ctd.drawImage(img, 100, 0, 50, 50);
                ctd.closePath();
                ctd.fill();
                break;
            default: 
                ctd.clearRect(0, 0, 200, 200);
                break;
        }
    }

    function move() {
        draw();
        //odboj od roba
        if (life != 0) {
            if (y <= 0 + r)
                dy = dy * (-1);
            else if (x >= sirinaCan - r || x <= 0 + r)
                dx = dx * (-1);
            else if (y > visinaCan - r) {
                life--;
                dy = dy * (-1);
            }
        } else {
            button.style.visibility="visible";
            //local storage
            if (localStorage.getItem("score") < score)
                localStorage.setItem("score", score);
            localStorage.setItem("time", izpisTimer);
            storage.innerHTML = "Čas: " + localStorage.getItem("time") + "\n" + "Dosežek: " + localStorage.getItem("score");
            //ustavljanje
            time = false;
            clearInterval(intervalTimer);
            clearInterval(refreshInterval);
            //konec igre slika
            gameover.style.display = 'block';
            gameover.style.animation = 'fadein 1s';
            gameover.style.marginTop = ((-visinaCan / 2) - gameover.clientHeight / 2) + 'px';
            gameover.style.marginLeft = ((canvas.offsetLeft + sirinaCan / 2) - gameover.clientWidth / 2) + 'px';

        }
        //tipkovnica
        document.addEventListener('keydown', function (event) {
            if (event.keyCode == 37) {
                left = true;
            }
            else if (event.keyCode == 39) {
                right = true;
            }
            else if (event.keyCode == 38 && up) {
                up = false;
            }
        });
        document.addEventListener('keyup', function (event) {
            if (event.keyCode == 37)
                left = false;
            else if (event.keyCode == 39)
                right = false;
        });
        if (right && x2 < sirinaCan - sirina)
            x2 = x2 + dx2;
        else if (left && x2 > 0)
            x2 = x2 - dx2;
        //odboj od ploščka
        if (x >= x2 && x <= x2 + sirina && y >= visinaCan - visina - r && y < visinaCan) {
            dx = 8 * ((x - (x2 + sirina / 2)) / sirina);
            dy = dy * -1;
        }
        //odboj od opeke
        i = Math.floor(y / rowheight);
        j = Math.floor(x / colwidth);
        if (y <= vrsta * rowheight && i >= 0 && j >= 0 && bricks[i][j] == 1) {
            dy = -dy;
            bricks[i][j] = 0;
            score++;
        }
        //start
        if (up) { }
        else {
            time = true;
            x += dx;
            y += dy;
        }
    }
    intervalTimer = setInterval(timer, 1000);
    refreshInterval = setInterval(move, 11);
}