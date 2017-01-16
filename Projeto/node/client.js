var socket = require('socket.io-client')('http://localhost:8080');
socket.on('connect', () => console.log('connected'));
socket.on('users', (data) => console.log('users: %s', data));
socket.on('disconnect', () => console.log('disconnected'));