/* global canvas */

var io = io.connect();

// Socket Events
canvas.on('object:moving', function () {
  io.emit('refresh', stringifyCanvas());
});

canvas.on('object:removed', function () {
  io.emit('remove', stringifyCanvas());
});

canvas.on('path:created', function () {
  io.emit('refresh', stringifyCanvas());
});

// Socket Listeners
io.on('refresh', function (data) {
  renderCanvas(data);
});

io.on('remove', function (data) {
  canvas.clear();
  renderCanvas(data);
});

// Refresh new user with most current canvas
io.on('new-user', function (id) {
  var data = JSON.stringify(canvas);
  io.emit('update-user', data, id);
});

function stringifyCanvas () {
  return JSON.stringify(canvas);
}

function renderCanvas (data) {
  return new Promise(function (resolve, reject) {
    canvas.loadFromJSON(data, canvas.renderAll.bind(canvas), function () {
      resolve();
    });
  });
}
