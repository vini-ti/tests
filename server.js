var express = require('express');
var http = require('http');
var path = require('path');

var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);

var io = socketIO(server);
var nodemailer = require('nodemailer');
var nedb = require('nedb');
var dbu = new nedb({filename: 'dbusuario.db', autoload: true});
var dbs = new nedb({filename: 'dbsolicitacao.db', autoload: true});

const port=process.env.PORT || 3000;

app.set('port', port);
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/admin', function(request, response) {
  response.sendFile(path.join(__dirname, 'admin.html'));
});
app.get('/painel', function(request, response) {
  response.sendFile(path.join(__dirname, 'painel.html'));
});
// Starts the server.
server.listen(port, function() {
  console.log('Starting server on port '+ port);
});




var tmpData = [];
var tmpData2 = [];
var admId,adm2Id;

var autenticarEmail = false;

var emails = {};

// Add the WebSocket handlers
io.on('connection', function(socket) {
//console.log("Users: "+users.nome);
//if(users != undefined ){
socket.on('disconnect', function() {

	if(emails !== undefined && emails.length > 0){
    //io.sockets.emit('info', emails[socket.id].email + " saiu");
	console.log(emails[socket.id].email+"Saiu do app");
	}
  });
//}
});

//ACESSO ADMIN
var adm = "admin",admSen="admin1234";
var adm2 = "painel",admSen2="painel";

io.on('connection', function(socket) {
  socket.on('load', function(email) {
  console.log(email + " entrou no app");
	  /*
    users[socket.id] = {
     nome: usr,
	 id: socket.id
    };
	console.log("User "+usr+" entrou");
	io.sockets.emit('info', usr+" entrou");
	*/
	emails[email] = {socket: socket.id};
	//if(emails !== undefined && emails.length > 0){
	
	dbs.find({em:email}, function (err,docs){
		io.sockets.connected[emails[email].socket].emit("loadsolits",docs);
		console.log(docs);
    });
	
	console.log(emails);
	
  });
 
  
  socket.on('auth', function(data) {
	  if(data.email == adm && data.pass == admSen){
		admId = socket.id;
		io.sockets.connected[admId].emit("mode","admin");
	  }else if(data.email == adm2 && data.pass == admSen2){
		adm2Id = socket.id;
		io.sockets.connected[adm2Id].emit("mode","painel");
	  }else{
		emails[data.email] = {"socket": socket.id};
		tmpData.push(data);
		if(autenticarEmail){
		email(data.email,data.pass,0);
		}else{
		io.sockets.connected[emails[tmpData[0].email].socket].emit("result",tmpData.shift());
		}
		
		console.log(emails);
	  }
  });
  socket.on('solicite', function(data) {
	emails[data.em] = {"socket": socket.id};
	tmpData2.push(data);
	
	var d = new Date();
	var hs = d.getHours()+":"+d.getMinutes();
	var ds = (d.getDate()+1)+ "/"+(d.getMonth()+1)+"/"+d.getFullYear();
	data.data = ds;
	data.confirmado = false;
	dbs.insert(data, function(err){
	if(err)return console.log(err); 
	console.log("solicitacao de "+data.em+" adicionada");
	});
	/*
	dbs.find({}, function (err,docs){
        console.log(docs);//all docs
    });
	*/
	if(autenticarEmail){
	email(data.em,data.ps,1);
	}else{
	io.sockets.connected[emails[tmpData2[0].em].socket].emit("result2",tmpData2.shift());
	}
	if(admId!=null) io.sockets.connected[admId].emit("addsolicite",data);
	//io.sockets.connected[emails[data.em].socket].emit("result2", data);
	
	//console.log(emails);
  });
  socket.on('confirm', function(data) {
	//email(data.em,data.ps,1);
	//console.log(data);
	data.confirmado = true;
	if(emails[data.em] !== undefined){
	//console.log(emails[data.em]);
	io.sockets.connected[emails[data.em].socket].emit("confirmed",data);
	}else{
	console.log("erro de ID");
	}
	dbs.update({ em: data.em }, data, {}, function (err) {
	//dbs.update({ em: data.em }, {$set {idade: 19}}, {}, function (err) {
	if(err)return console.log(err);
	console.log(data);
	});
	if(adm2Id != null){
	io.sockets.connected[adm2Id].emit("addreserva",data);
	}
	dbs.find({em:data.em}, function (err,docs){
	if(emails[data.em] !== undefined){
		io.sockets.connected[emails[data.em].socket].emit("loadsolits",docs);
		}
		console.log(docs);
    });
	/*
	dbs.remove({em: data.em }, {}, function (err) {
	if(err)return console.log(err);
	console.log("Solicitação confirmada para "+data.em);
	});
	*/
	dbs.find({}, function (err,docs){
		io.sockets.connected[admId].emit("dados",docs);
	console.log(docs);
	
    });
	//tmpData2.shift();
	//authEmail = data.email;
	//io.sockets.connected[emails[data.email].socket].emit("login", );
  });
  socket.on('carregaDados', function(data) {
    dbs.find({}, function (err,docs){
		io.sockets.connected[admId].emit("dados",docs);
    });
	//authEmail = data.email;
	//io.sockets.connected[emails[data.email].socket].emit("login", );
  });
  socket.on('carregaDadosPainel', function(data) {
    dbs.find({confirmado: true}, function (err,docs){
	console.log("DADOS PAINEL\n"+docs);
		io.sockets.connected[adm2Id].emit("dadosPainel",docs);
    });
	//authEmail = data.email;
	//io.sockets.connected[emails[data.email].socket].emit("login", );
  });
  
  
  socket.on('send', function(data) {
	  var user = users[socket.id];
	  
    io.sockets.emit('message', data);
	//console.log(data);
  });
 });


function email(user,pass,tipo){
	var transporter = nodemailer.createTransport({
		host: "correio.level3br.com",
		port: 587,
		secure: false,
	auth: {
    user: user,
    pass: pass
  }
});

var mailOptions;

if(tipo == 0){
	mailOptions = {
  from: user,
  to: 'viny96v@gmail.com',
  subject: 'Novo login',
  text: "O usuario "+user+" realizou um novo login"
};
}else if(tipo == 1){
	var dado = tmpData2[0];
	mailOptions = {
  from: user,
  to: 'viny96v@gmail.com',
  subject: 'Solicitação de veículo',
  text: user+" solicitou um veiculo",
  html: "<style>table, tr, td {border: 1px solid black;border-collapse: collapse;font-family: Calibri;}</style><h3>Solicitante: "+user+"</h3><br><table style='width:500px'><tr><caption><img src='http://www.aegea.com.br/wp-content/uploads/2018/06/logo-aegea-160x70.png' style='float:left;width:100px;height:50px;margin:0;'/><b ><u style='float:left; font-size: 20px; margin: 10px 50px;'>Requisição de automóveis</s></u></caption></tr><tr><td colspan='2'><b>Centro de Custo: "+tmpData2[0].cc+"</b></td></tr><tr><td>Data: "+tmpData2[0].data+"</td><td>Destino: "+dado.destino+"</td></tr><tr><td colspan='2'>Motivo: "+dado.just+"</td></tr><tr><td>Horário de saída: "+dado.hs+"</td><td>Horário de chegada: "+dado.hc+"</td></tr><tr><td colspan='2'>Condutor: "+dado.cond+"</td></tr><tr><td colspan='2'>Quantidade de acompanhantes: "+dado.na+"</td></tr></table>"
};
}

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
	if(tipo == 0) io.sockets.connected[emails[tmpData[0].email].socket].emit("result",false);
	if(tipo == 1) io.sockets.connected[emails[tmpData2[0].em].socket].emit("result2",false);
  } else {
    console.log('Email sent: ' + info.response);
	if(tipo == 0) io.sockets.connected[emails[tmpData[0].email].socket].emit("result",tmpData.shift());
	if(tipo == 1) io.sockets.connected[emails[tmpData2[0].em].socket].emit("result2",tmpData2.shift());
  }
});
}
