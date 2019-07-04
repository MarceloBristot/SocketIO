var app = angular.module("myApp", []);
app.controller("myCtrl", function ($scope, $sce) {

    $scope.totalUsuarios = 0;
    var socket = io.connect();
    var brancas = ['♙', '♖', '♘', '♗', '♕', '♔'];
    var pretas = ['♟', '♜', '♞', '♝', '♛', '♚'];
    $scope.vez = "Brancas";

    function Peca() {
        this.cor = "";
        this.x = 0;
        this.y = 0;
        this.peca = "";
        this.id = "";
    }
    $scope.records = [
        1, 2, 3, 4, 5, 6, 7, 8
    ]

    $scope.pecas = [];

    for (let i = 1; i < 33; i++) {
        $scope.pecas.push(new Peca());
    }

    for (let i = 0; i < 8; i++) {
        $scope.pecas[i].cor = "white";
        $scope.pecas[i].x = 7;
        $scope.pecas[i].y = i + 1;
        $scope.pecas[i].peca = "&#9817;"
        $scope.pecas[i].id = "pw" + i;
    }

    var casa = 0;
    for (let i = 16; i < 24; i++) {

        $scope.pecas[i].cor = "black";
        $scope.pecas[i].x = 2;
        $scope.pecas[i].y = casa + 1;
        $scope.pecas[i].peca = "&#9823;"
        $scope.pecas[i].id = "pb" + i;
        casa++;
    }

    casa = 0;
    for (let i = 8; i < 16; i++) {
        $scope.pecas[i].cor = "white";
        $scope.pecas[i].x = 8;
        $scope.pecas[i].y = casa + 1;
        casa++;
    }

    var casa = 0;
    for (let i = 24; i < 32; i++) {

        $scope.pecas[i].cor = "black";
        $scope.pecas[i].x = 1;
        $scope.pecas[i].y = casa + 1;
        casa++;
    }

    $scope.pecas[8].peca = "&#9814;"
    $scope.pecas[9].peca = "&#9816;"
    $scope.pecas[10].peca = "&#9815;"
    $scope.pecas[11].peca = "&#9813;"
    $scope.pecas[12].peca = "&#9812;"
    $scope.pecas[13].peca = "&#9815;"
    $scope.pecas[14].peca = "&#9816;"
    $scope.pecas[15].peca = "&#9814;"

    $scope.pecas[24].peca = "&#9820;"
    $scope.pecas[25].peca = "&#9822;"
    $scope.pecas[26].peca = "&#9821;"
    $scope.pecas[27].peca = "&#9819;"
    $scope.pecas[28].peca = "&#9818;"
    $scope.pecas[29].peca = "&#9821;"
    $scope.pecas[30].peca = "&#9822;"
    $scope.pecas[31].peca = "&#9820;"


    console.log($scope.pecas);

    var casaNum = function (casa) {
        switch (casa) {
            case 'a': return 1; break;
            case 'b': return 2; break;
            case 'c': return 3; break;
            case 'd': return 4; break;
            case 'e': return 5; break;
            case 'f': return 6; break;
            case 'g': return 7; break;
            case 'h': return 8; break;

            default: break;
        }
    }

    var numCasa = function (casa) {
        switch (casa) {
            case 1: return 'a'; break;
            case 2: return 'b'; break;
            case 3: return 'c'; break;
            case 4: return 'd'; break;
            case 5: return 'e'; break;
            case 6: return 'f'; break;
            case 7: return 'g'; break;
            case 8: return 'h'; break;

            default: break;
        }
    }

    $("form#chat").submit(function (e) {
        //if($scope.totalUsuarios < 2){
        //  alert("Esperar segundo jogador!")
        //return ;
        //}
        e.preventDefault();

        var mensagem = $(this).find("#texto_mensagem").val();
        var usuario = $("#lista_usuarios").val();
        //var peca = achaPeca(mensagem);

        socket.emit("enviar mensagem", { msg: mensagem, usu: usuario }, function () {

            $("form#chat #texto_mensagem").val("");
        });
    });
    socket.on("atualizar mensagens", function (jogada) {
        if (!jogada.jogador)
            jogada.jogador = 'Espectador';
        var mensagem_formatada = $("<p />").text(jogada.jogador + ':' + jogada.mensagem);
        //achaPeca(mensagem.msg);
        $("#historico_mensagens").append(mensagem_formatada);
    });


    socket.on("achaPeca", function (jogada) {
        var teste = jogada.move.split(" ");
        var peca = $("#" + teste[0]).html();
        if (peca == "") {
            console.log("Nenhuma peça!");
        }
        else if (validarPeca(teste, peca, jogada.jogador)) {
            //alert("Aqui");

            $("#" + teste[0]).empty();
            $("#" + teste[1]).empty();
            $("#" + teste[1]).append(peca);
            //return $scope.pecas[i];
            if ($scope.vez == "Brancas")
                $scope.vez = "Pretas";
            else
                $scope.vez = "Brancas";

            $("#vez").empty();
            $("#vez").append("<b>Vez: " + $scope.vez + "</b>");
            //socket.emit("atualizar mensagens", {mensagem:jogada.move, jogador: jogada.jogador});

        }
        else
            console.log("Erro!");
    });

    var validarPeca = function (move, peca, jogador) {
        if (move[0] == move[1])
            return false;
        var vert = 0;
        var hor = 0;
        var casaAlfa = casaNum(move[0].charAt(0));
        var casaNumerica = parseInt(move[0].charAt(1));
        if ((brancas.includes(peca) || $scope.vez == "Brancas") && jogador == "Pretas") {
            console.log('Tá errado!');
            return false;
        }
        else if ((pretas.includes(peca) || $scope.vez == "Pretas") && jogador == "Brancas") {
            console.log('Tá errado!');
            return false;
        }


        //if (peca == '♙' || peca == '♟') {
        //  return movePeao(move, peca);
        //}

        if (peca == '♖' || peca == '♜') {
            if (move[0].charAt(0) != move[1].charAt(0) && move[0].charAt(1) != move[1].charAt(1)) {
                console.log("Movimento de torre incorreto!");
                return false;
            }
            else {
                if (casaNum(move[0].charAt(0)) > casaNum(move[1].charAt(0)))
                    hor = -1;
                else if (casaNum(move[0].charAt(0)) < casaNum(move[1].charAt(0)))
                    hor = 1;

                if (move[0].charAt(1) > move[1].charAt(1))
                    vert = -1;
                else if (move[0].charAt(1) < move[1].charAt(1))
                    vert = 1;
                casaAlfa += hor;
                casaNumerica += vert;
                while (!(casaAlfa == casaNum(move[1].charAt(0)) && casaNumerica == move[1].charAt(1))) {
                    var casa = $("#" + numCasa(casaAlfa).toString() + casaNumerica.toString()).html()
                    if (pretas.includes(casa) || brancas.includes(casa))
                        return false;
                    casaAlfa += hor;
                    casaNumerica += vert;
                }
            }
            return checaUltimo(peca, move);
        }

        else if (peca == '♗' || peca == '♝') {
            if (move[0].charAt(0) == move[1].charAt(0) || move[0].charAt(1) == move[1].charAt(1)) {
                console.log("Movimento de bispo incorreto!");
                return false;
            }
            else {
                if (casaNum(move[0].charAt(0)) > casaNum(move[1].charAt(0)))
                    hor = -1;
                else if (casaNum(move[0].charAt(0)) < casaNum(move[1].charAt(0)))
                    hor = 1;

                if (move[0].charAt(1) > move[1].charAt(1))
                    vert = -1;
                else if (move[0].charAt(1) < move[1].charAt(1))
                    vert = 1;

                casaAlfa += hor;
                casaNumerica += vert;
                while (!(casaAlfa == casaNum(move[1].charAt(0)) && casaNumerica == move[1].charAt(1))) {
                    var casa = $("#" + numCasa(casaAlfa).toString() + casaNumerica.toString()).html()
                    if (pretas.includes(casa) || brancas.includes(casa))
                        return false;
                    casaAlfa += hor;
                    casaNumerica += vert;
                }
            }
            return checaUltimo(peca, move);
        }

        else if (peca == '♕' || peca == '♛') {
            if (casaNum(move[0].charAt(0)) > casaNum(move[1].charAt(0)))
                hor = -1;
            else if (casaNum(move[0].charAt(0)) < casaNum(move[1].charAt(0)))
                hor = 1;

            if (move[0].charAt(1) > move[1].charAt(1))
                vert = -1;
            else if (move[0].charAt(1) < move[1].charAt(1))
                vert = 1;

            casaAlfa += hor;
            casaNumerica += vert;
            while (!(casaAlfa == casaNum(move[1].charAt(0)) && casaNumerica == move[1].charAt(1))) {
                var casa = $("#" + numCasa(casaAlfa).toString() + casaNumerica.toString()).html()
                if (pretas.includes(casa) || brancas.includes(casa))
                    return false;
                casaAlfa += hor;
                casaNumerica += vert;
            }
            return checaUltimo(peca, move);
        }
        else if (peca == '♔' || peca == '♚') {
            if (casaNum(move[0].charAt(0)) > casaNum(move[1].charAt(0)))
                hor = -1;
            else if (casaNum(move[0].charAt(0)) < casaNum(move[1].charAt(0)))
                hor = 1;

            if (move[0].charAt(1) > move[1].charAt(1))
                vert = -1;
            else if (move[0].charAt(1) < move[1].charAt(1))
                vert = 1;

            casaAlfa += hor;
            casaNumerica += vert;
            if (!(casaAlfa == casaNum(move[1].charAt(0)) && casaNumerica == move[1].charAt(1)))
                return false;

            return checaUltimo(peca, move);
        }

        return true;

    }


    var checaUltimo = function (peca, move) {
        var ultimaCasa = $("#" + move[1].charAt(0) + move[1].charAt(1)).html();

        if ((pretas.includes(peca) && pretas.includes(ultimaCasa)) || (brancas.includes(peca) && brancas.includes(ultimaCasa)))
            return false;

        return true;
    }

    // var peaoCaptura = function (move,peca) {
    //     if(move[0].charAt(0))
    //     if (peca == '♙'){

    //     }

    //         if(peca == '♟')
    //         return true;
    // }
});


app.filter('unsafe', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
});