var food;
var prey;
var pred;

var foodCount = 20;
var preyCount = 10;
var predCount = 4;

var selected = 'f';


// Misc functions

function initCreatures() {
    food = [];
    for (var i = 0; i < foodCount; ++i) {
        var x = random(width);
        var y = random(height);
        food[i] = createEntity(x, y, foodTemplate);
    }

    prey = [];
    for (var i = 0; i < preyCount; ++i) {
        var x = random(width);
        var y = random(height);
        prey[i] = createEntity(x, y, preyTemplate);
    }

    pred = [];
    for (var i = 0; i < predCount; ++i) {
        var x = random(width);
        var y = random(height);
        pred[i] = createEntity(x, y, predTemplate);
    }
}

function removeDead() {
    for (var i = food.length - 1; i >= 0; --i) {
        if (!food[i].alive) food.splice(i, 1);
    }

    for (var i = prey.length - 1; i >= 0; --i) {
        if (!prey[i].alive) prey.splice(i, 1);
    }

    for (var i = pred.length - 1; i >= 0; --i) {
        if (!pred[i].alive) pred.splice(i, 1);
    }
}


// Main p5 functions

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    initCreatures();
}

function draw() {
    background(255);

    var total = food.length + prey.length + pred.length;
    var numCreatures = prey.length + pred.length;
    if (total <= 1 || total > 400 || numCreatures === 0) initCreatures();

    for (var i = 0; i < food.length; ++i) {
        var f = food[i];
        f.update();
        if (f.outsideBorders()) f.kill();
        f.draw();
    }

    for (var i = 0; i < prey.length; ++i) {
        var p = prey[i];
        p.steer(food, pred.concat(prey));
        p.update();
        if (p.outsideBorders()) p.kill();
        p.draw();

        // eating
        if (food.length === 0) continue;
        var f = p.getNearest(food);
        var cx = p.pos.x;
        var cy = p.pos.y;
        var fx = f.pos.x;
        var fy = f.pos.y;
        if (sq(fx - cx) + sq(fy - cy) < sq(p.radius)) {
            f.kill();
            prey.push(createEntity(cx, cy, preyTemplate));
        }
    }

    for (var i = 0; i < pred.length; ++i) {
        var p = pred[i];
        p.steer(prey, pred);
        p.update();
        if (p.outsideBorders()) p.kill();
        p.draw();

        // eating
        if (prey.length === 0) continue;
        var b = p.getNearest(prey);
        var cx = p.pos.x;
        var cy = p.pos.y;
        var bx = b.pos.x;
        var by = b.pos.y;
        if (sq(bx - cx) + sq(by - cy) < sq(p.radius)) {
            b.kill();
            food.push(createEntity(cx, cy, foodTemplate));
            pred.push(createEntity(cx, cy, predTemplate));
        }
    }

    removeDead();
}


// User input

function keyPressed() {
    switch (keyCode) {
        case 13:
            // Enter
            initCreatures();
            break;
        case 66:
            // B
            selected = 'b';
            break;
        case 70:
            // F
            selected = 'f';
            break;
        case 80:
            // P
            selected = 'p';
            break;
    }
}

function mousePressed() {
    switch(selected) {
        case 'b':
            prey.push(createEntity(mouseX, mouseY, preyTemplate));
            break;
        case 'f':
            food.push(createEntity(mouseX, mouseY, foodTemplate));
            break;
        case 'p':
            pred.push(createEntity(mouseX, mouseY, predTemplate));
            break;
    }
}