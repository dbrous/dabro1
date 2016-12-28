var users = [];
var latestData;

module.exports = function (io) {
  io.on('connection', function (socket) {
    users.push(socket.id);
    if (socket.id !== users[0]) {
      io.to(socket.id).emit('refresh', latestData);
    }
    console.log(users);

    // Update New User
    socket.on('update-user', function (data, id) {
      id[id].emit('refresh', data);
    });

    // Remove disconnected users
    socket.on('disconnect', function (data) {
      var index = users.indexOf(socket.id);
      if (index !== -1) {
        users.splice(index, 1);
      }
    });

    // CANVAS EVENTS =========================================================

    socket.on('path-created', function (data) {
      latestData = data;
      socket.broadcast.emit('path-created', data);
    });

    // Remove Obj
    socket.on('remove', function (data) {
      latestData = data;
      socket.broadcast.emit('remove', data);
    });

    // Add Obj
    socket.on('add', function (data) {
      latestData = data;
      socket.broadcast.emit('add', data);
    });

    // Refresh All
    socket.on('refresh', function (data) {
      latestData = data;
      socket.broadcast.emit('refresh', data);
    });

      //  ReSync All
    socket.on('resync', function (data) {
      latestData = data;
      socket.broadcast.emit('resync', data);
    });
  });
};
