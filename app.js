var app = require('http').createServer(resposta);
var fs = require('fs');
var io = require('socket.io')(app);
var usuarios = [];

//Porta da aplicação
app.listen(1991);

console.log("Aplicação está em execução...");

//Função principal Servidor
function resposta(req, res) {
    var arquivo = "";
    if (req.url == "/") {
        arquivo = __dirname + '/chessboard.html';
    } else {
        arquivo = __dirname + req.url;
    }
    fs.readFile(arquivo,
        function (err, data) {
            if (err) {
                res.writeHead(404);
                return res.end('Página ou arquivo não encontrados');
            }

            res.writeHead(200);
            res.end(data);
        }
    );
}

io.on("connection", function (socket) {

    if (!usuarios["Brancas"]) {
        socket.jogador = "Brancas"
        usuarios["Brancas"] = socket;
    }
    else if (!usuarios["Pretas"]) {
        socket.jogador = "Pretas"
        usuarios["Pretas"] = socket;
    }

    io.sockets.emit("atualizar mensagens", { jogador: socket.jogador, mensagem: " Acabou de entrar na sala" });

    socket.on("enviar mensagem", function (mensagem_enviada, callback) {
        io.sockets.emit("atualizar mensagens", {mensagem:mensagem_enviada.msg, jogador: socket.jogador});
        console.log(socket.jogador);
        if (socket.jogador && usuarios["Brancas"] && usuarios["Pretas"])
            io.sockets.emit("achaPeca", { move: mensagem_enviada.msg, jogador: socket.jogador });
        callback();
    });
    socket.on("disconnect", function () {
        delete usuarios[socket.jogador];
        io.sockets.emit("atualizar mensagens", { jogador: socket.jogador, mensagem: " Saiu da sala" });
    });
});