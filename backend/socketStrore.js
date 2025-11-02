const onlineUsers = new Map();

const addUser = (userId, socketId) => {
  onlineUsers.set(userId, socketId);
};

const removeUser = (socketId) => {
  for (const [userId, id] of onlineUsers.entries()) {
    if (id === socketId) {
      onlineUsers.delete(userId);
      break;
    }
  }
};

const getSocketId = (userId) => {
   
  return onlineUsers.get(userId);
 
};

const getAllUsers = () => {
  return Array.from(onlineUsers.keys());
};

module.exports = {
  addUser,
  removeUser,
  getSocketId,
  getAllUsers,
};