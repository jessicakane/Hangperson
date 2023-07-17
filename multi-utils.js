module.exports = function getRoomConnections(io, room) {
  const clients = io.sockets.adapter.rooms.get(room);
  return clients ? clients.size : 0;
};
