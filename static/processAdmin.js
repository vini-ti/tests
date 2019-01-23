var socket = io();

//var content = document.getElementById("div_conteudo");

window.onload = function(){
	socket.emit("auth",{email:"admin",pass:"admin1234"});
	socket.emit("carregaDados",{email:"admin"});
}

socket.on('mode', function(data) {
console.log(data+"\n");
//document.getElementById("txtlog").innerHTML += data+"<br>";
//var dt = new Date().toLocaleString();
//mkMsg(data.text,data.user,data.dt);
});

socket.on('dados', function(data) {
//console.log(data);
dvNovoVeiculo.innerHTML = "";
for(var s = 0; s < data.length;s++){
mkSo(data[s]);
}
});
socket.on('addsolicite', function(data) {
console.log(data+"\n");
//document.getElementById("txtlog").innerHTML += data+"<br>";
//var dt = new Date().toLocaleString();
//mkInfo(data,dt);
mkSo(data);
});



function mkSo(d) {
    var para = document.createElement("DIV");
    para.style.padding = "5px 5px 5px 0";
	para.style.background="##f0fff0";
    para.style.textAlign ="left";
	

    var msg = document.createElement("SPAM");
    msg.innerHTML = d.em;
    msg.style.display="block";
    msg.style.wordWrap="break-word";
    msg.style.fontSize = "24px";
    msg.style.paddingLeft = "10px";
    msg.style.float = "left";
    
    var usr = document.createElement("SPAM");
    usr.innerHTML = d.data;
    usr.style.fontSize = "16px";
    usr.style.margin = "0";
    usr.style.align = "left";
    usr.style.float = "right";
    
    
    para.style.border="1px solid grey";
    para.style.boxShadow="1px 1px 1px grey";
    para.style.borderRadius="1px";
    para.style.marginBottom = "5px";
    para.style.height = "40px";
    para.appendChild(msg);
    para.appendChild(usr);
    
    para.onclick = function(){
    povoarInfo(d);
    dvVisual.style.display = "block";
    }
    document.getElementById("dvNovoVeiculo").appendChild(para);
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
solicitanteAtual = d;
}

function confirmar(){
	var data = {em:solicitanteAtual.em,veiculo:enVeiculo.value,placa:enPlaca.value};
	solicitanteAtual.reserva = data;
	socket.emit("confirm",solicitanteAtual);
	dvVisual.style.display = "none";
}