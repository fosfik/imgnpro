
module.exports = function(io){
  var User = require('../models/user.js');
  var OrderPacks = require('../models/orderpacks.js');
  var app = require('express');


  
  var router = app.Router();
  // io.on('connection',function(socket){
  //   console.log("entro usuario");
  // });



io.on('connection', function(socket){
  console.log(socket.request.user);
  console.log('a user connected');
  socket.broadcast.emit('Se conectó un usuario');
  // se desconecta el usuario
  socket.on('disconnect', function(){
    console.log('user disconnected');
    console.log(socket.request.user);
  });
  // llega un mensaje
  socket.on('chat_msg', function(msg){
    if (isLoggedIn(socket)){
      console.log(socket.request.user);
      console.log(socket.request.user._id);
      console.log('message: ' + msg);
      var jsMsg = JSON.parse(msg);
      console.log(jsMsg);
      console.log(jsMsg.userid);
      //io.emit('chat_msg', '{"msg":"' + jsMsg.msg +'","username":"' + socket.request.user.userlongname +  '"}'  );
      User.findOne({_id: socket.request.user._id}, function(err,user){
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
    }
  });

  socket.on('reserve_pack', function(msg){

    if (isLoggedIn(socket)){
      console.log('message: ' + msg);
      var jsMsg = JSON.parse(msg);
      console.log(jsMsg);
      console.log(jsMsg.userid);
      User.findOne({_id: socket.request.user._id}, function(err,user){
          console.log(err);
          if (user.usertype !== 'designer'){
            socket.emit('err', '{"msg":"Solamente los diseñadores pueden reservar paquetes", "userid":"'+ socket.request.user._id + '"}');
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
                  if (orderpack){
                    console.log(orderpack.isreserve);
                    var b_canReserve = false;
                    if ( orderpack.isreserve !== undefined || orderpack.isreserve === false ){
                       secondsPast = timeElapsed( orderpack.date_reserve );
                       console.log( secondsPast );
                       // if ( secondsPast > 30 && ( orderpack.reserve_byid === socket.request.user._id ) ){
                       //    socket.emit('err', '{"msg":"Debes confirmar el paquete antes de 30 segundos", "userid":"'+ socket.request.user._id + '"}');
                       //    return;
                       // }
                       if ( (secondsPast > 30) && orderpack.date_start_work === undefined ){
                          b_canReserve = true;
                       }
                     }

                    if ( b_canReserve === true){
                       orderpack.isreserve = true;
                       orderpack.date_reserve = Date();
                       orderpack.reserve_byid = socket.request.user._id;
                       orderpack.save(function(err){
                          if ( err ){
                            socket.emit('err', '{"msg":"Debido a un problema no se pudo reservar el paquete", "userid":"'+ socket.request.user._id + '"}');
                            return;
                          }
                          socket.emit( 'package_reserve' , '{"msg:"Paquete reservado con éxito", "orderpackid":"'+ orderpack._id +'"}' );
                          io.emit('chat_msg', '{"msg":" Reservé el paquete: ' + orderpack.name + ', del pedido: ' + orderpack.numorder + '","username":"' + user.userlongname +  '"}'  );
                       }); 

                    }
                    else{
                        console.log("Paquete ya reservado");
                        socket.emit( 'err' , '{"msg":"Paquete ya ha sido reservado o ya se está trabajando, por favor actualiza tu navegador", "orderpackid":"'+ orderpack._id +'"}' );
                    }
                  }
                }

              });
            }else{
              console.log('Nada');
            }

          }

      });
    }
    else{
      return;
    }
  });
  
  

   socket.on('confirm_pack', function(msg){
    console.log('message: ' + msg);
    var jsMsg = JSON.parse(msg);
    console.log(jsMsg);
    console.log(jsMsg.userid);
    User.findOne({_id: socket.request.user._id}, function(err,user){
        console.log(err);
        if (user.usertype !== 'designer'){
          socket.emit('err', '{"msg":"Solamente los diseñadores pueden confirmar paquetes", "userid":"'+ socket.request.user._id + '"}');
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
                if (orderpack){
                   secondsPast = timeElapsed( orderpack.date_reserve );
                   console.log( secondsPast );
                   if ( secondsPast > 30 && ( orderpack.reserve_byid === socket.request.user._id ) ){
                      socket.emit('err', '{"msg":"Debes confirmar el paquete antes de 30 segundos", "userid":"'+ socket.request.user._id + '"}');
                      return;
                   }
                   if ( secondsPast > 30 && ( orderpack.reserve_byid !== socket.request.user._id ) ){
                      socket.emit( 'package_confirm' , '{"msg:"Paquete confirmado con éxito", "orderpackid":"'+ orderpack._id +'"}' );
                      io.emit('chat_msg', '{"msg":" Confirmé el paquete: ' + orderpack.name + ', del pedido: ' + orderpack.numorder + '","username":"' + user.userlongname +  '"}'  );
                      return;
                   }
                   if ( secondsPast <= 30  && (orderpack.reserve_byid === socket.request.user._id) ){
                      socket.emit( 'package_confirm' , '{"msg:"Paquete confirmado con éxito", "orderpackid":"'+ orderpack._id +'"}' );
                      io.emit('chat_msg', '{"msg":" Confirmé el paquete: ' + orderpack.name + ', del pedido: ' + orderpack.numorder + '","username":"' + user.userlongname +  '"}'  );
                   } 
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

// Obtiene un true si el usuario existe y está logueado
function isLoggedIn( socket ){
  return (socket.request.user && socket.request.user.logged_in);
}

// Obtiene la diferencia en seundos entre dos fechas
function timeElapsed( date_to_compare){
  var d_to_compare = new Date(date_to_compare);
  var d_actual = new Date();
  var diff_dates_sec = (d_actual / 1000) - (d_to_compare.getTime() / 1000);
  return ( Math.floor(diff_dates_sec) );
}

  return router;
}

