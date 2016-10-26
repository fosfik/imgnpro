
module.exports = function(io){
  var User = require('../models/user.js');
  var OrderPacks = require('../models/orderpacks.js');
  var app = require('express');
  var router = app.Router();
  // io.on('connection',function(socket){
  //   console.log("entro usuario");
  // });



io.on('connection', function(socket){
  console.log('a user connected');
  socket.broadcast.emit('Se conectó un usuario');
  
  // se desconecta el usuario
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  // llega un mensaje
  socket.on('chat_msg', function(msg){
    console.log('message: ' + msg);
    var jsMsg = JSON.parse(msg);
    console.log(jsMsg);
    console.log(jsMsg.userid);
    User.findOne({_id: jsMsg.userid}, function(err,user){
        console.log(err);
        if (err){
            console.log(err);
        }else{
          if (user){
            io.emit('chat_msg', '{"msg":"' + jsMsg.msg +'","username":"' + user.userlongname +  '"}'  );
          }else{
            console.log('Nada');
          }

        }

    });
    

    
  });

  socket.on('reserve_pack', function(msg){
    console.log('message: ' + msg);
    var jsMsg = JSON.parse(msg);
    console.log(jsMsg);
    console.log(jsMsg.userid);
    User.findOne({_id: jsMsg.userid}, function(err,user){
        console.log(err);
        if (user.usertype !== 'designer'){
          socket.emit('err', '{"msg":"Solamente los diseñadores pueden reservar paquetes", "userid":"'+ jsMsg.userid + '"}');
          return;
        }
        if (err){
            console.log(err);
        }else{
          if (user){
            OrderPacks.findOne({_id: jsMsg.orderpackid}, function(err, orderpack){
              if (err){
                console.log(err);
              }else{
                if (user){
                   io.emit('chat_msg', '{"msg":" Reservé el paquete: ' + orderpack.name + ', del pedido: ' + orderpack.numorder + '","username":"' + user.userlongname +  '"}'  );
                }
              }

            });
          }else{
            console.log('Nada');
          }

        }

    });
    

    
  });
  
  

   socket.on('confirm_pack', function(msg){
    console.log('message: ' + msg);
    var jsMsg = JSON.parse(msg);
    console.log(jsMsg);
    console.log(jsMsg.userid);
    User.findOne({_id: jsMsg.userid}, function(err,user){
        console.log(err);
        if (user.usertype !== 'designer'){
          socket.emit('err', '{"msg":"Solamente los diseñadores pueden confirmar paquetes", "userid":"'+ jsMsg.userid + '"}');
          return;
        }
        if (err){
            console.log(err);
        }else{
          if (user){
            OrderPacks.findOne({_id: jsMsg.orderpackid}, function(err, orderpack){
              if (err){
                console.log(err);
              }else{
                if (user){
                   io.emit('chat_msg', '{"msg":" Confirmé el paquete: ' + orderpack.name + ', del pedido: ' + orderpack.numorder + '","username":"' + user.userlongname +  '"}'  );
                }
              }

            });
          }else{
            console.log('Nada');
          }

        }

    });
    

    
  });
  socket.on('get_packages', function(msg){
    console.log(msg);
    //var jsMsg = JSON.parse(msg);

    OrderPacks.find({status:'En Proceso', isworking:false}, function(err, orderpacks){
      if (err){
            console.log(err);
        }else{
          if (orderpacks){

            io.emit('packs_list', '{"packs":'+ JSON.stringify(orderpacks) + '}'  );
          }else{
            console.log('Nada');
          }
        }
    }).select('_id imagecount').limit(6);
  });
});



  return router;
}