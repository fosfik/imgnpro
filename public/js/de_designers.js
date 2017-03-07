
 var  socket = io(),
                 bIsWorking = false,
                 nSecondsLeft = 0,
                 dDateNow;

            $(document).ready(function(){
                for (var i = 1; i <= 6; i++){
                    $('#p'+ i).hide();
                }    
                getPackages(); // obtiene los paquetes que se pueden trabajar.
                getWorkingPackages();
                getTopRankdesigners(); // obtiene el ranking de los diseñadores
                setInterval(function(){ 
                    if (bIsWorking){
                        var dActual = new Date();
                        var nSecondsPast = Math.floor((dActual.getTime()/1000) - (dDateNow.getTime()/1000));
                        $('#a_timeleft').html(getTimeinHours( nSecondsLeft - nSecondsPast ) );
                    }
                    
                 }, 1000);

                $('form').submit(function(){
                        socket.emit('chat_msg', '{ "msg":"' + $('#m').val() + '","userid":"'+ $("#UserIdInput").val()+'"}');
                        $('#m').val('');
                        return false;
                });

                socket.on('chat_msg', function(msg){
                    //$('#messages').append($('<li>').text(msg));
                    var jsMsg = JSON.parse(msg);
                    console.log(jsMsg);
                    $('#conversation').append('<p class=""> <b>' + jsMsg.username + ': '+  jsMsg.msg + '</p>');
                        var sHeight = $('#conversation')[0].scrollHeight;
                        //Scrolling the element to the sHeight
                        $('#box_conversation').scrollTop(sHeight);
                });

                 socket.on('err', function(msg){
                    var jsMsg = JSON.parse(msg);
                    console.log(jsMsg);
                        alert(jsMsg.msg);

                });

                socket.on('act_package', function(msg){
                    var jsMsg = JSON.parse(msg);
                    bIsWorking = jsMsg.isworking;
                    if (bIsWorking){
                        $('#a_timeleft').show();
                        $('#li_done').show();
                        $('#li_package_actual').show();
                        $('#a_order').html(jsMsg.numorder);
                        $('#a_orderpack').html(jsMsg.name);
                        $('#a_package_actual').attr('href', '/de_package_get/' + jsMsg.orderpackid);
                        $('#a_done').attr('href', '/de_uploadimages/' + jsMsg.orderpackid);
                        nSecondsLeft = jsMsg.secondsLeft;
                        dDateNow = new Date();
                    }
                });

                socket.on('packs_list', function(msg){
                    var jsMsg = JSON.parse(msg);
                    console.log(jsMsg);
                    for (var i = 1; i <= jsMsg.packs.length; i++){
                        $('#pno' + i).html(jsMsg.packs[i-1].imagecount);
                        $('#p' + i).show(1000);

                        $('#orderpackid' + i).val(jsMsg.packs[i-1]._id);
                    }  
                });
             
                socket.on('access_package', function(msg){
                    var jsMsg = JSON.parse(msg);
                    window.location='/de_package_get/' + jsMsg.orderpackid;
                });


                socket.on('package_confirm', function(msg){
                    var jsMsg = JSON.parse(msg);
                    console.log(jsMsg);
                    getPackages();
                });

                socket.on('toprankdesigner', function(msg){
                    var jsMsg = JSON.parse(msg);
                    console.log(jsMsg.length);
                    console.log(msg);
                    console.log(jsMsg);
                    
                    var i = 1;
                    try{
                        $.each(jsMsg, function (index, value) {
                            if (i == 1){ 
                                $('#firstplacename').text(value.name); 
                                $('#firstplaceimages').text(value.imagecount);     
                            }else{
                                $('#toprankdesigner').append('<li class="texto_plano_aside"><span class="encabezado_aside2">' + i + '. </span> ' + value.name +  ' <span class="imagenum">'+ value.imagecount +' imágen(es)</span></li>');
                            }    
                            i++;        
                        });
                    }
                    catch (e){
                        console.log(e);
                    }
                    
                });

                $('#p1').click(function(){
                    
                    socket.emit('reserve_pack', '{ "orderpackid":"' + $('#orderpackid1').val() + '","userid":"'+ $("#UserIdInput").val()+'"}');
                    
                });
                $('#p2').click(function(){
                    
                    socket.emit('reserve_pack', '{ "orderpackid":"' + $('#orderpackid2').val() + '","userid":"'+ $("#UserIdInput").val()+'"}');
                    
                });
                $('#p3').click(function(){
                    
                    socket.emit('reserve_pack', '{ "orderpackid":"' + $('#orderpackid3').val() + '","userid":"'+ $("#UserIdInput").val()+'"}');
                    
                });
                $('#p4').click(function(){
                    
                    socket.emit('reserve_pack', '{ "orderpackid":"' + $('#orderpackid4').val() + '","userid":"'+ $("#UserIdInput").val()+'"}');
                    
                });
                $('#p5').click(function(){
                    
                    socket.emit('reserve_pack', '{ "orderpackid":"' + $('#orderpackid5').val() + '","userid":"'+ $("#UserIdInput").val()+'"}');
                    
                });
                $('#p6').click(function(){
                    
                    socket.emit('reserve_pack', '{ "orderpackid":"' + $('#orderpackid6').val() + '","userid":"'+ $("#UserIdInput").val()+'"}');
                    
                });
                
                $('#buttondownload1').click(function(){
                    
                    socket.emit('confirm_pack', '{ "orderpackid":"' + $('#orderpackid1').val() + '","userid":"'+ $("#UserIdInput").val()+'"}');
                    
                });
                 $('#buttondownload2').click(function(){
                    
                    socket.emit('confirm_pack', '{ "orderpackid":"' + $('#orderpackid2').val() + '","userid":"'+ $("#UserIdInput").val()+'"}');
                    
                });
                 $('#buttondownload3').click(function(){
                    
                    socket.emit('confirm_pack', '{ "orderpackid":"' + $('#orderpackid3').val() + '","userid":"'+ $("#UserIdInput").val()+'"}');
                    
                });
                 $('#buttondownload4').click(function(){
                    
                    socket.emit('confirm_pack', '{ "orderpackid":"' + $('#orderpackid4').val() + '","userid":"'+ $("#UserIdInput").val()+'"}');
                    
                });
                 $('#buttondownload5').click(function(){
                    
                    socket.emit('confirm_pack', '{ "orderpackid":"' + $('#orderpackid5').val() + '","userid":"'+ $("#UserIdInput").val()+'"}');
                    
                });
                 $('#buttondownload6').click(function(){
                    
                    socket.emit('confirm_pack', '{ "orderpackid":"' + $('#orderpackid6').val() + '","userid":"'+ $("#UserIdInput").val()+'"}');
                    
                });

          
                function getWorkingPackages(){
                    socket.emit('get_work_package', '');
                }

                function getPackages(){
                    socket.emit('get_packages', '');
                    
                }
                function getTopRankdesigners(){
                   socket.emit('get_toprankdesigner', '');
                }

                function getTimeinHours(nSeconds){
                    var nHours = 0, nMinutes = 0;
                    if (nSeconds > 0){
                        nHours = Math.floor( nSeconds / 3600);
                        nSeconds = nSeconds - ( nHours * 3600);
                    } 
                    if (nSeconds > 0){
                        nMinutes = Math.floor( nSeconds / 60);
                        nSeconds = nSeconds - ( nMinutes * 60);
                    }
                    if (nSeconds < 0){
                        nSeconds = 0;
                    }
                    return (nHours + ":" + nMinutes + ":" + nSeconds ); 
                }
            });