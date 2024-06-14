
const WebSocket = require('ws');


const server = new WebSocket.Server({ port: 8000 });

let clients = [];


function broadcast(message, sender = null) {
    const msg = JSON.stringify(message);
    clients.forEach((client, id) => {
        if (client !== sender) {
            client.send(msg);
        } else {
            client.send(JSON.stringify({ online: clients.map((clnt, idx) => ({ id: idx, name: clnt.username })) }));
        }
    });
}

server.on('connection', (ws) => {
   
    clients.push(ws);

    ws.on('message', (data) => {
        console.log(`Data received: ${data}`);
        let msgContent;
        try {
            msgContent = JSON.parse(data);
        } catch (e) {
            console.error('Invalid JSON received');
            return;
        }

        const msgToSend = {};

        if (msgContent.type === 'login') {
            ws.username = msgContent.username;
            console.log(`${ws.username} connected`);
            msgToSend.body = `${ws.username} has been connected`;
            msgToSend.type = 'login';
        } else if (msgContent.type === 'chat') {
            msgToSend.body = msgContent.body;
            msgToSend.type = 'chat';
        }

        broadcast(msgToSend, ws);
    });


    ws.on('close', () => {
        console.log(`${ws.username} disconnected`);
        clients = clients.filter(client => client !== ws);
        const msgToSend = {
            type: 'logout',
            body: `${ws.username} has been disconnected`
        };
        broadcast(msgToSend);
    });


    console.log(`New client connected: ${ws._socket.remoteAddress}`);
});

console.log('WebSocket server is running on ws://localhost:8000');
