/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
var boostAvailable = true;
var checkpoints = [];
var listComplete = false;

const boostRadius = 2000;
const radius = 350;
const brakeStep1 = 1300;
const brakeStep2 = 1100;
const brakeStep3 = 800;

// Print log
var log = (name, value) => { printErr(`${name}: ${value}`); };

// Functions for calculating distance between two points
Math.dist = (x1, y1, x2 = 0, y2 = 0) => Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
var distanceBetween = (point1, point2) => Math.dist(point1.x, point1.y, point2.x, point2.y);

// Compare if two points have the same position
var areEqual = (point1, point2) => point1.x == point2.x && point1.y == point2.y;

// Get the index of a checkpoint in the checkpoint list
var indexOf = checkpoint => {
    for(var i = 0, length = checkpoints.length; i < length; i++){
        if(areEqual(checkpoints[i], checkpoint)) {
            return i;
        }
    }
    return -1;
}

// Adjust speed to distance from checkpoint
var adjustSpeed = (distance, angle) => {
    log('angle', angle);
    log('dist', distance);
    
    if(angle >= 90 || angle <= -90) {
        return 0;
    }
    
    if(distance > boostRadius && boostAvailable && angle === 0 && listComplete) {
        boostAvailable = false;
        return 'BOOST';
    }
    
    if(distance <= brakeStep3) {
        return 25;
    }
    
    if(distance <= brakeStep2) {
        return 50;
    }
    
    if(distance <= brakeStep1) {
        return 75;
    }
    
    return 100;
};

// Get position to head to
var calculateGoal = (current, goal) => {
    // y = m * x + b
    let m, b;
    
    m = (goal.y - current.y) / (goal.x - current.x);
    b = goal.y - m * goal.x;
    
    let goalY2 = goal.y * goal.y;
    
    let x1 = (goal.x + radius / Math.sqrt(1 + m*m));
    let x2 = (goal.x - radius / Math.sqrt(1 + m*m));
    
    let point1 = {
        x: x1,
        y: m * x1 + b
    };
    
    let point2 = {
        x: x2,
        y: m * x2 + b
    };
    
    if(distanceBetween(current, point1) < distanceBetween(current, point2)) {
        return point1;
    }
    
    return point2;
};

// game loop
while (true) {
    var inputs = readline().split(' ');
    var x = parseInt(inputs[0]);
    var y = parseInt(inputs[1]);
    var nextCheckpointX = parseInt(inputs[2]); // x position of the next check point
    var nextCheckpointY = parseInt(inputs[3]); // y position of the next check point
    var nextCheckpointDist = parseInt(inputs[4]); // distance to the next checkpoint
    var nextCheckpointAngle = parseInt(inputs[5]); // angle between your pod orientation and the direction of the next checkpoint
    var inputs = readline().split(' ');
    var opponentX = parseInt(inputs[0]);
    var opponentY = parseInt(inputs[1]);
    
    var goal;
    
    var racer = { x, y };
    
    var checkP = {
        x: nextCheckpointX,
        y: nextCheckpointY
    };
    
    var checkIndex = indexOf(checkP);
    if(checkIndex === 0 && checkpoints.length > 1) {
        listComplete = true;
    }
    
    if(checkIndex < 0) {
        checkpoints.push(checkP);
        goal = calculateGoal(racer, checkP);
    }else if(listComplete){
        let nextCheck;
        
        if(checkIndex + 1 == checkpoints.length) {
            nextCheck = checkpoints[0];
        }else{
            nextCheck = checkpoints[checkIndex + 1];
        }
        
        goal = calculateGoal(nextCheck, checkP);
    }
    
    print(Math.round(goal.x) + ' ' + Math.round(goal.y) + ' ' + adjustSpeed(distanceBetween(racer, goal), nextCheckpointAngle));
}
