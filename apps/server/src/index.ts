import http from 'http';
import SocketService from './services/socket';

function init() {
    const socketService: SocketService = new SocketService();
    const httpServer = http.createServer();
    const PORT = process.env.PORT ? process.env.PORT : 8000;

    // attach socketService to httpService
    socketService.io.attach(httpServer);

    httpServer.listen(PORT, () => console.log(`Sever started at port ${PORT}`));

    socketService.initListeners();
}

init();