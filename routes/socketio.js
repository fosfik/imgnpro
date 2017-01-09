
module.exports = function(io){
  var User = require('../models/user.js');
  var OrderPacks = require('../models/orderpacks.js');
  var app = require('express');
  var config = require('../config');

  
  var router = app.Router();
  // io.on('connection',function(socket){
  //   console.log("entro usuario");
  // });

io.on('connection', function(socket){
  console.log(socket.request.user);
  console.log('a user connected');
  //getDesigners();
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
          if (user.isworking == true){
            socket.emit('err', '{"msg":"No puedes reservar más de un paquete, hasta que termines el que estás trabajando"}');
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
                    var secondsPast = 0;
                    console.log('orderpack:');
                    console.log(orderpack);
                    console.log(orderpack.isreserve);
                    var b_canReserve = false;
                    if ( orderpack.isreserve == undefined || orderpack.isreserve == false ){
                       
                       // if ( secondsPast > 30 && ( orderpack.reserve_byid === socket.request.user._id ) ){
                       //    socket.emit('err', '{"msg":"Debes confirmar el paquete antes de 30 segundos", "userid":"'+ socket.request.user._id + '"}');
                       //    return;
                       // }
                       console.log(orderpack.date_start_work);
                       console.log(orderpack.date_reserve);


                       if (orderpack.date_reserve == undefined){
                          b_canReserve = true;
                       }else{
                         secondsPast = timeElapsed( orderpack.date_reserve );
                         console.log( secondsPast );
                       }
                       if ( (secondsPast > 30) && orderpack.date_start_work == undefined ){
                          b_canReserve = true;
                       }
                     }

                    if (orderpack.isreserve === true){
                        var secondsPast = timeElapsed( orderpack.date_reserve );
                        if ( (secondsPast > 30) && orderpack.date_start_work == undefined ){
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
                        socket.emit( 'err' , '{"msg":"Paquete ya ha sido reservado o ya se está trabajando, por favor actualiza tu navegador o selecciona otro paquete", "orderpackid":"'+ orderpack._id +'"}' );
                    }
                  }
                }

              });
            }else{
              socket.emit( 'err' , '{"msg":"Inicia sesión de nuevo"}' );
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
        if ( user.usertype !== 'designer' ){
          socket.emit('err', '{"msg":"Solamente los diseñadores pueden confirmar paquetes", "userid":"'+ socket.request.user._id + '"}');
          return;
        }
        if ( user.isworking == true ){
            socket.emit('err', '{"msg":"No puedes bajar más de un paquete, hasta que termines el que estás trabajando"}');
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
                   // if ( secondsPast > 30 && ( orderpack.reserve_byid === socket.request.user._id ) ){
                   //    socket.emit('err', '{"msg":"Debes confirmar el paquete antes de 30 segundos", "userid":"'+ socket.request.user._id + '"}');
                   //    return;
                   // }
                   var b_canConfirm = false;
                   if ( orderpack.reserve_byid === socket.request.user._id && orderpack.date_start_work == undefined){
                       b_canConfirm = true;
                   }
                   if ( secondsPast > 30 && ( orderpack.reserve_byid !== socket.request.user._id ) && orderpack.date_start_work == undefined ){
                      b_canConfirm = true;
                   }
                   // if ( secondsPast <= 30  && (orderpack.reserve_byid === socket.request.user._id) ){
                   //    b_canConfirm = true;
                   // } 
                   if (b_canConfirm == true){

                      orderpack.date_start_work = Date();
                      orderpack.isworking = true;
                      orderpack.reserve_byid = socket.request.user._id;
                      orderpack.save(function(err){
                          if ( err ){
                            socket.emit('err', '{"msg":"Debido a un problema no se pudo confirmar el paquete", "userid":"'+ socket.request.user._id + '"}');
                            return;
                          }

                          user.isworking = true;
                          user.save(function(err){
                              if ( err ){
                                socket.emit('err', '{"msg":"Debido a un problema no se pudo confirmar el paquete", "userid":"'+ socket.request.user._id + '"}');
                                return;
                              }
                              socket.broadcast.emit( 'package_confirm' , '{"msg":"Paquete confirmado con éxito", "orderpackid":"'+ orderpack._id +'"}' );
                              socket.emit('access_package', '{"msg":"Paquete confirmado con éxito", "orderpackid":"'+ orderpack._id +'"}');
                              socket.broadcast.emit('chat_msg', '{"msg":" Confirmé el paquete: ' + orderpack.name + ', del pedido: ' + orderpack.numorder + '","username":"' + user.userlongname +  '"}'  );
                           }); 

                       }); 
                   }
                   else
                   {
                      socket.emit( 'err' , '{"msg":"Paquete ya ha sido reservado o ya se está trabajando, por favor actualiza tu navegador o selecciona otro paquete", "orderpackid":"'+ orderpack._id +'"}' );
                   }
                }
              }
            });
          }else{
            socket.emit( 'err' , '{"msg":"Inicia sesión de nuevo"}' );
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
            console.log(orderpacks);
            io.emit('packs_list', '{"packs":'+ JSON.stringify(orderpacks) + '}'  );
          }else{
            console.log('Nada');
          }
        }
    }).select('_id imagecount').limit(6);
  });

socket.on('get_work_package', function(msg){

    console.log('get_work_package');
    // socket.emit('act_package', '{"msg":"Hola"}');
    // socket.emit('err', '{"msg":"Hola"}');


    User.findOne({_id: socket.request.user._id}, function(err,user){
       
        if (err){
            console.log(err);
        }else{
          if (user){
              if ( user.isworking == true ){
                
                
                OrderPacks.findOne({reserve_byid: socket.request.user._id, isworking:true}, function(err, orderpack){
                  if (err){
                        console.log(err);
                    }else{
                      if (orderpack){
                        console.log(orderpack);
                        socket.emit('act_package', '{"msg":"Se está trabajando", "isworking":true, "secondsLeft":"'+ (config.package.timetofinish - timeElapsed(orderpack.date_start_work) ) +'", "numorder":"'+ orderpack.numorder +'", "name":"'+ orderpack.name +'", "orderpackid":"'+ orderpack._id +'"}');
                        //socket.emit('act_package', '{"msg":"Se estt trabajando"}');
                        //io.emit('packs_list', '{"packs":'+ JSON.stringify(orderpacks) + '}'  );
                      }else{
                        socket.emit('err', '{"msg": "No tiene reservado un paquete"}'  );
                      }
                    }
                });  


                return;
              }

          }
        }
      });
  
    // OrderPacks.find({status:'En Proceso', isworking:false}, function(err, orderpacks){
    //   if (err){
    //         console.log(err);
    //     }else{
    //       if (orderpacks){
    //         console.log(orderpacks);
    //         io.emit('packs_list', '{"packs":'+ JSON.stringify(orderpacks) + '}'  );
    //       }else{
    //         console.log('Nada');
    //       }
    //     }
    // }).select('_id imagecount').limit(6);
  });


  socket.on('get_toprankdesigner', function(msg){
      // if (isLoggedIn(socket)){
      //   console.log('message: ' + msg);
      //   var jsMsg = JSON.parse(msg);
      //   console.log(jsMsg);
      //   console.log(jsMsg.userid);
        //  getTopRankDesigners(function(toprankdocs){
        //     console.log(toprankdocs);
        //     socket.emit('toprankdesigner', JSON.stringify(toprankdocs));
        //  });
        
      // }
  });       



});


//.populate( 'tags', null, { tagName: { $in: ['funny', 'politics'] } } )

function getTopRankDesigners(cb){
  OrderPacks
  .find({status:'Terminado'})
  //.select('imagecount userlongname')
  .populate('designerid', 'userlongname')
  .sort('designerid')
  .exec(function(err,orderpacksdocs){
    console.log('error', err, 'Orderpacks', orderpacksdocs);
    var id_designer = orderpacksdocs[0].designerid._id;
    var sumimages = 0;
    var topRankDesigner = [];
    for ( var i = 0; i < orderpacksdocs.length ; i++){
      //console.log(orderpacksdocs[i].designerid._id);
      
      if (id_designer === orderpacksdocs[i].designerid._id ){
        sumimages = sumimages + orderpacksdocs[i].imagecount;
      }
      else{
        //console.log(id_designer, sumimages);
        topRankDesigner.push({name:orderpacksdocs[i].designerid.userlongname, imagecount: sumimages});
        id_designer = orderpacksdocs[i].designerid._id;
        sumimages = orderpacksdocs[i].imagecount;

      }
    }
    console.log(topRankDesigner);
    cb(topRankDesigner);
    // if (err){
    //   res.render('receipt', {message: '¡Lo sentimos!, No se encontró el número de recibo', user:req.user, numorder:0, countorders:ordersinproc});            
    // } 
    // else if (user_details){


    //   Orders
    //   .findOne({numorder:req.params.numorder})
    //   .populate('specid', 'totalprice')
    //   .exec(function(err,order){
    //   console.log(order);
      
    //   //findaorder(req.params.numorder,function(error,order){
    //      //console.log(order);
    //      //res.render('uploadimages', {message: req.flash('message'), user: req.user, namespec:spec[0].name, totalprice:spec[0].totalprice, specid:spec[0]._id });
    //      res.render('receipt', {message: req.flash('message'), user: req.user, numorder:req.params.numorder, order:order, countorders:ordersinproc, user_details:user_details});             
    //   });

    // }
    // else
    // {
    //   res.render('receipt', {message: '¡Lo sentimos!, No se encontró el número de recibo', user:req.user, numorder:0, countorders:ordersinproc});            
    // }
  });  
}

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
};

