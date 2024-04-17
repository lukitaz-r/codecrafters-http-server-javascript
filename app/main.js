const net = require("net");
const fs = require("fs");
const path = require("path");

const filePath = process.argv[3]

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
    socket.on("data", async (data) => {
        let request = data.toString().split("\r\n");
        let pathRequest = request[0].split(" ");
        if (pathRequest[1] === "/") {
            socket.write("HTTP/1.1 200 OK\r\n\r\n");
        } else if (pathRequest[1].includes("/echo/")) {
            let content = pathRequest[1].replace("/echo/", "");
            socket.write(
                `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`
            );
        } else if (pathRequest[1].includes("/user-agent")) {
            let userAgent = "";
            for (let i = 1; i < request.length; i++) {
                if (request[i].startsWith("User-Agent:")) {
                    userAgent = request[i].substring(12);
                    break;
                }
            }
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`);
        } else if(pathRequest[1].includes("/files/")) {
            if (request[0].includes("POST")) {
                const fileName = pathRequest[1].replace("/files/", "");
                const file = path.join(filePath, fileName);
                const content = request[request.length - 1];
                await fs.promises.writeFile(file, content);
                socket.write("HTTP/1.1 201 Created\r\n\r\n");
            } else {
                const fileName = pathRequest[1].replace("/files/", "")
                const file = path.join(filePath, fileName)
                if (fs.existsSync(file)) {
                    const content = await fs.promises.readFile(file)
                    socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}`);
                } else {
                socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
                
                }
            }
            socket.end();
        } else {
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
            socket.end();
        } 
        
    });
    socket.on("close", () => {
        socket.end();
        server.close();
    });
});

server.listen(4221, "localhost");
