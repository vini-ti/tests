
var myemail = null;
var socket = io();

var content = document.getElementById("div_conteudo");

window.onload = function(){
	if(localStorage.getItem("email") != null && localStorage.getItem("pass") != null){
		myemail = localStorage.getItem("email");
		//console.log(myemail);
		telaPrincipal();
		socket.emit("load",myemail);
	}else{
		telaLogin();
	}
}

socket.on('message', function(data) {
 // console.log(data+"\n");
//document.getElementById("txtlog").innerHTML += data+"<br>";
//var dt = new Date().toLocaleString();
mkMsg(data.text,data.user,data.dt);
});

socket.on('info', function(data) {
 // console.log(data+"\n");
//document.getElementById("txtlog").innerHTML += data+"<br>";
var dt = new Date().toLocaleString();
mkInfo(data,dt);
});

socket.on('result', function(data) {
console.log(data);
if(data == false){
	telaLogin();
	document.getElementById("txt_info").innerHTML = "Email ou senha incorretos";

}else{
	localStorage.setItem("email",data.email);
	localStorage.setItem("pass",data.pass);
	telaPrincipal();
}
});
socket.on('result2', function(data) {
console.log(data);
if(data == false){
	telaNovaRequisicao();
	alert("Ocorreu um erro ao solicitar o veiculo");
}else{
	telaPrincipal();
	historico(data);
	alert("Veiculo solicitado");
}
});

//RESPOSTA DO ADMIN
socket.on('confirmed', function(data) {
//console.log(data);
	if (navigator.vibrate) {
	navigator.vibrate(500);
	}
	alert("Veiculo confirmado\nVeiculo: "+data.reserva.veiculo+"\nPlaca: "+data.reserva.placa);
	data.confirmado = true;
	historico(data);
	document.getElementById("btCheck").style.display = "block";
});
socket.on('loadsolits', function(data) {
//console.log(data);
for(var s = 0;s < data.length;s++){
historico(data[s]);
}
});


function autenticacao(){
var dados = {email: "", pass: ""}
var usu = document.getElementById("enUsuario");
var pas = document.getElementById("enPass");
dados.email = usu.value;
dados.pass = pas.value;
telaCarregando();
socket.emit('auth', dados);
}

function solicitar(){
	var usu = localStorage.getItem("email");
	var pas = localStorage.getItem("pass");
	var cc = document.getElementById("enCC").value;
	var dt = document.getElementById("enData").value;
	var dn = document.getElementById("enDest").value;
	var jt = document.getElementById("enJust").value;
	var hs = document.getElementById("enHs").value;
	var hc = document.getElementById("enHc").value;
	var cd = document.getElementById("enCond").value;
	var na = document.getElementById("enNa").value;
	
	
	if(cc!=""&&cd!=""){
	var dados = {em:usu,ps:pas,cc:cc,data:dt,destino:dn,just:jt,hs:hs,hc:hc,cond:cd,na:na};
	telaCarregando();
	document.getElementById("btNova").style.display = "none";
	socket.emit('solicite',dados);
	}else{
	alert("Preencha todos os campos!");
	}
	
}


function telaCarregando(){
	document.getElementById("div_topo").style.display = "none";
	content.innerHTML = "<center><progress></progress></center>";
	
}
function telaSolicitacoes(){
	document.getElementById("txTitulo").innerHTML = "Solicitações";
	var tlS = document.getElementById("div-solicitacoes");
	tlS.style.display = "block";
	document.getElementById("div-btsMenu").style.display = "none";
	//tlS.innerHTML = 
	content.innerHTML = "<button onclick='telaPrincipal()' class='btn' style='position:fixed; bottom: 0px; width: 100%; margin: 0;'>Voltar</button>";
}
function telaCheck(){
	document.getElementById("txTitulo").innerHTML = "Checklist";
	document.getElementById("div-btsMenu").style.display = "none";
	content.innerHTML = "<span id='container'><h3>Pneus: <input type='checkbox'/></h3><br><h3>Combustivel: <input type='checkbox'/></h3></span><br><br><button onclick='fimCheck()' class='btn' style='position:fixed; bottom: 0px; width: 100%; margin: 0;'>Finalizar</button>";
}
function telaLogin(){
	document.getElementById("div_topo").style.display = "none";
	content.innerHTML = "<div id='div_telaLogin'><center><div class='dvCentro'>      <div ><br>       <h3>App reserva</h3>      <br><hr>      <div><div>           <div > <div ><label for='inputEmail'>Email</label><input type='text' name='enUsuario' id='enUsuario' class='form-control' placeholder='Email' required='required' autofocus='autofocus'></div></div><br><div ><div ><label for='inputPassword'>Senha </label><input type='password' name='enPass' id='enPass' class='form-control' placeholder='Senha' required='required'></div></div><br><span id='txt_info'></span></div> <input type='button' value='Entrar' onclick='autenticacao()'/> </div></div></div></center></div>";
}
function telaPrincipal(){
	document.getElementById("txTitulo").innerHTML = "Reserva App";
	document.getElementById("div-solicitacoes").style.display = "none";
	content.innerHTML = "<span id='container' ></span>";
	document.getElementById("div-btsMenu").style.display = "block";
	document.getElementById("div_topo").style.display = "block";
	
	//document.getElementById("btMenu").style.display = "block";
	document.getElementsByTagName("BODY")[0].style.background = "#9dbcd6";
}
function telaNovaRequisicao(){
	document.getElementById("txTitulo").innerHTML = "Nova solicitação";
	document.getElementById("div_topo").style.display = "block";
	document.getElementById("div-btsMenu").style.display = "none";
	content.innerHTML = "<span id='container' ><div> <div ><br><input type='text' name='solicitante' id='enUsuario' hidden><input type='password' name='pass' id='enPass' hidden> <label>Centro de custo </label><br><input type='text' name='centroCusto' id='enCC'><br><br><label>Data </label><br><input type='date' name='data' id='enData'><br><br><label>Destino </label><br><input type='text' name='destino' id='enDest'><br><br><label>Justificativa </label><br><textarea name='justificativa' id='enJust'></textarea><hr><label>Horário de saída </label><br><input type='time' name='horSaida' id='enHs'><br><label>Horário de chegada </label><br><input type='time' name='horChegada' id='enHc'><hr><label>Condutor </label><input type='text' name='condutor' id='enCond'><br><br><label>Número de acompanhantes </label><input type='number' value='0' min='0' max='4' name='numAcom' id='enNa'><hr></div><div class='btInferior'><input type='button' id='btReservar' value='Reservar' onclick='solicitar()'/><input type='button' id='btCancelar' value='Cancelar' onclick='telaPrincipal()'/></div></div><br><br><br><br></span>";
}
function telaPerfil(){
	document.getElementById("txTitulo").innerHTML = "Perfil";
	document.getElementById("div_topo").style.display = "block";
	document.getElementById("div-btsMenu").style.display = "none";
	content.innerHTML = "<span id='container' ><div> <div ><br><label>Nome</label><br><input type='text' name='enNome' id='enNo'><br><br><label>Telefone</label><br><input type='tel' name='enFone' id='enFone'><br><br><hr></div><div class='btInferior'><input type='button' id='btReservar' value='Salvar' onclick='solicitar()'/><input type='button' id='btCancelar' value='Voltar' onclick='telaPrincipal()'/></div></div><br><br><br><br></span>";
}

function historico(dado){
console.log(dado);
	if(dado.confirmado){
		document.getElementById("div-solicitacoes").innerHTML = "<div style='background:#8fbc8fbd' onclick='alert("+dado.veiculo+dado.placa+")'> <h4 class='header'>Veiculo reservado </h4><h5 class='subheader'>"+dado.data+"</h5></div>";
		
	}else{
		document.getElementById("div-solicitacoes").innerHTML = "<div style='background:#faa'> <h4 class='header'>Veiculo solicitado</h4><br><br><h3 >Data: "+dado.data+"</h3><h3>Status: Solicitado</h3></div>";
	}
}

function fimCheck(){
	telaPrincipal();
	document.getElementById("btNova").style.display = "block";
	document.getElementById("btCheck").style.display = "none";
}
