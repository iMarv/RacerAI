/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
var boostAvailable = true;
var checkpoints = [];
var listComplete = false;

// Minimum distance for activiating boost
const boostRadius = 2000;

// Distance starting from the middle of the checkpoint for the racer to aim for
const radius = 350;

// Distance steps for slowing down the racer
const brakeStep1 = 1300;
const brakeStep2 = 1100;
const brakeStep3 = 800;

// Print log
var log = (name, value) => {
    printErr(`${name}: ${value}`);
};

// Functions for calculating distance between two points
Math.dist = (x1, y1, x2 = 0, y2 = 0) => Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
var distanceBetween = (point1, point2) => Math.dist(point1.x, point1.y, point2.x, point2.y);

// Compare if two points have the same position
var areEqual = (point1, point2) => point1.x == point2.x && point1.y == point2.y;

// Get the index of a checkpoint in the checkpoint list
var indexOf = checkpoint => {
    // Iterate through all elements
    for (var i = 0, length = checkpoints.length; i < length; i++) {
        // If the coordinates of the points match, return index
        if (areEqual(checkpoints[i], checkpoint)) {
            return i;
        }
    }
    // Return -1 if no matching point was found
    return -1;
}

// Adjust speed to distance from checkpoint
var adjustSpeed = (distance, angle) => {
    // Log values for debugging
    log('angle', angle);
    log('dist', distance);

    // If angle is too wide
    if (angle >= 90 || angle <= -90) {
        return 0;
    }
    // If the goal is far enough away
    // AND the boost is available
    // AND the racer is heading straight for the gaol
    // AND the first lap has passed
    else if (distance > boostRadius && boostAvailable && angle === 0 && listComplete) {
        boostAvailable = false;
        return 'BOOST';
    }
    // Check for hardcoded distances to slow down the racer before turning
    else if (distance <= brakeStep3) {
        return 25;
    } else if (distance <= brakeStep2) {
        return 50;
    } else if (distance <= brakeStep1) {
        return 75;
    }

    return 100;
};

// Get position to head to
var calculateGoal = (current, goal) => {
    let m, b, goalY2, x1, x2, point1, point2;

    // y = m * x + b

    // Get m
    // m = (y2 - y1) / (x2 - x1)
    m = (goal.y - current.y) / (goal.x - current.x);

    // Get b
    // b = y - m * x
    b = goal.y - m * goal.x;

    // Calculate the two interference points
    x1 = (goal.x + radius / Math.sqrt(1 + m * m));
    x2 = (goal.x - radius / Math.sqrt(1 + m * m));

    // Create objects for each of the points
    point1 = {
        x: x1,
        y: m * x1 + b
    };

    point2 = {
        x: x2,
        y: m * x2 + b
    };

    // Return the point that is closer to the racer
    if (distanceBetween(current, point1) < distanceBetween(current, point2)) {
        return point1;
    }

    return point2;
};

// game loop
while (true) {
    // Read an save all game inputs
    var inputs = readline().split(' ');

    var racer = {
        x: parseInt(inputs[0]),
        y: parseInt(inputs[1])
    };

    var checkP = {
        x: parseInt(inputs[2]),
        y: parseInt(inputs[3])
    };

    var nextCheckpointDist = parseInt(inputs[4]); // distance to the next checkpoint
    var nextCheckpointAngle = parseInt(inputs[5]); // angle between your pod orientation and the direction of the next checkpoint
    var inputs = readline().split(' ');

    var opponent = {
        x: parseInt(inputs[0]),
        y: parseInt(inputs[1])
    }

    var goal;

    // Get index of the current checkpoint
    var checkIndex = indexOf(checkP);

    // If the index of the checkpoint is 0 and the list of checkpoints contains more than 2 checkpoints
    if (checkIndex === 0 && checkpoints.length > 1) {
        // All checkpoints have been found
        listComplete = true;
    }

    // If the checkpoint is not contained in the list yet
    if (checkIndex < 0) {
        // Add checkpoint to the list
        checkpoints.push(checkP);

        // Calculate goalpoint between racer and checkpoint
        goal = calculateGoal(racer, checkP);

    }
    // If the list is complete
    else if (listComplete) {
        // Find the upcoming checkpoint
        let nextCheck = (checkIndex + 1 == checkpoints.length) ? checkpoints[0] : checkpoints[checkIndex + 1];

        // Calculate the goalpoint between the current checkpoint and the next one
        goal = calculateGoal(nextCheck, checkP);
    }

    // Calculate the speed
    let speed = adjustSpeed(distanceBetween(racer, goal), nextCheckpointAngle);

    // Send command to the racer
    print(Math.round(goal.x) + ' ' + Math.round(goal.y) + ' ' + speed);
}
