var socket = io();

//var content = document.getElementById("div_conteudo");

window.onload = function(){
	socket.emit("auth",{email:"painel",pass:"painel"});
	socket.emit("carregaDadosPainel",{email:"painel"});
}

socket.on('mode', function(data) {
console.log(data+"\n");
//document.getElementById("txtlog").innerHTML += data+"<br>";
//var dt = new Date().toLocaleString();
//mkMsg(data.text,data.user,data.dt);
});
socket.on('dadosPainel', function(data) {
console.log(data);
for(var s = 0;s < data.length;s++){
mkReserva(data[s]);
}
});

socket.on('addreserva', function(data) {
console.log(data+"\n");
//document.getElementById("txtlog").innerHTML += data+"<br>";
//var dt = new Date().toLocaleString();
//mkInfo(data,dt);
mkReserva(data);
});

var tabela = document.createElement("TABLE");
document.getElementById("dvTabela").appendChild(tabela);

function mkReserva(d) {

    var tbrow = document.createElement("TR");
	
    var c1 = document.createElement("TD");
    c1.innerHTML = d.em;
    var c2 = document.createElement("TD");
    c2.innerHTML = d.hs;
    var c3 = document.createElement("TD");
    c3.innerHTML = d.hc;
    var c4 = document.createElement("TD");
    c4.innerHTML = d.cond;
    
    tbrow.appendChild(c1);
    tbrow.appendChild(c2);
    tbrow.appendChild(c3);
    tbrow.appendChild(c4);
    
    tbrow.onclick = function(){
    povoarInfo(d);
    dvVisual.style.display = "block";
    }
    
    tabela.appendChild(tbrow);
}

var solicitanteAtual;

function povoarInfo(d){
txSol.innerHTML = "Solicitante: " + d.em;
txCc.innerHTML = "Centro de custo: " + d.cc;
txDat.innerHTML = "Data: " + d.data;
txDes.innerHTML = "Destino: " + d.destino;
txJus.innerHTML = "Motivo: " + d.just;
txHs.innerHTML = "Horário de saída: " + d.hs;
txHc.innerHTML = "Horário de chegada: " + d.hc;
txCon.innerHTML = "Condutor: " + d.cond;
txNa.innerHTML = "Quantidade de acompanhantes: " + d.na;
solicitanteAtual = d.em;
}

function retirarVeiculo(){
	var data = {em:solicitanteAtual};
	socket.emit("retirar",data);
}