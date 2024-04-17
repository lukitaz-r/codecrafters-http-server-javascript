const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        let request = data.toString().split("\r\n")
        let path = request[0].split(" ")
        if(path[1] === "/") socket.write('HTTP/1.1 200 OK\r\n\r\n')
        else socket.write('HTTP/1.1 404 Not Found\r\n\r\n')
        socket.end()
    });
    socket.on("close", () => {
        socket.end()
        server.close()
    });
});

server.listen(4221, "localhost");