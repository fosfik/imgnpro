
 $(document).ready(function(){
                activatePassOnFree();

                $('#quieroFac').click(function (){
                    userWantFact();
                });

                 $("#sel_contactcountry").change(function() {
                    if($("#sel_contactcountry option:selected").text() ==='México' ){
                        $('#quieroFac').show();
                        $('#lblquieroFac').show();
                      }
                    else{
                        $( "#quieroFac" ).prop( "checked", false );
                        $('#quieroFac').hide();
                        $('#lblquieroFac').hide();
                        userWantFact();
                    }  
                  });
            
                $.ajax({
                        type: 'get',
                        url: '/getUser_details/<%= user._id %>',
                        //data: frm.serialize(),
                        success: function (data) {
                            if (data.error == 1 ){
                                //document.getElementById('res_message').innerHTML= data.message;    
                                alert(data.message);
                                 //$('#specnombre').focus();
                            }
                            else{
                                $.each(data.user_details, function(elem, val) {
                                    $('input[name="' + elem +'"]').val(val);
                                    $('select[name="' + elem +'"]').val(val);
                                    $('input[value="' + val + '"]').prop('checked', true);
                                    userWantFact();
                                    if($("#sel_contactcountry option:selected").text() ==='México' ){
                                        $('#quieroFac').show();
                                        $('#lblquieroFac').show();
                                    }
                                });    
                            }
                         }
                });

            $('#buttonpay').click(function (ev) {
                // recuperar las variables localStorage
                
              if (validInput()){
                    $.ajax({ 
                        url: '/getUserEnable', 
                        type: 'get',
                        dataType: 'json', 
                        data: {'email':$('#contactemail').val().trim()},  
                        success: function(data){ 
                            //Proceso de los datos recibidos
                            if (data.err == 1 && localStorage.getItem('hasSpecFree')=='true'){
                                alert(data.message);
                                
                            }
                            else{
                                
                                var formdata = $('form').serialize();
                                $.ajax({
                                        type: 'post',
                                        url: '/updateuserdetails',
                                        data: formdata,
                                        success: function (data) {
                                            if (data.error == 1 ){
                                                //document.getElementById('res_message').innerHTML= data.message;    
                                                alert(data.message);
                                                 $('#contactname').focus();
                                            }
                                            else{
                                                //setTimeout(window.location='/subirimagen4.html',500);
                                                //alert(data.message); Usar Toast Bread
                                                

                                                $.ajax({
                                                    type: 'post',
                                                    url: '/confirmOrder/<%= numorder %>',
                                                    data: formdata,
                                                    success: function (data) {
                                                       if (data.error == 1 ){
                                                            //document.getElementById('res_message').innerHTML= data.message;    
                                                            alert(data.message);
                                                             $('#contactname').focus();
                                                        }
                                                        else{ 
                                                            window.localStorage.clear();
                                                            //document.location.href= "/" + data.href  + "/<%= numorder %>";
                                                            console.log(data.href);
                                                            if (data.href.indexOf("http") == -1){
                                                                document.location.href = "/" + data.href;
                                                            }
                                                            else{
                                                                document.location.href = data.href;
                                                            } 
                                                            
                                                        }
                                                    }

                                                });
                                                //if(confirm("¿Quieres subir imágenes?")){
                                                
                                                //}
                                                // else{
                                                //     document.getElementById("specForm").reset();
                                            }
                                        }
                                 });

                            }
                        } 
                    });



                

              }


                
                ev.preventDefault();
               });

               function activatePassOnFree(){
                    $.getJSON('/getFreeSpec', {disabled:true}).done(function(res) {
                            
                            if (res.err == 0 && res.email == 'demoimgnpro' ){
                                $('#lbl_password').show();
                                $('#lbl_confirmpassword').show();
                                $('#i_password').show();
                                $('#i_confirmpassword').show();
                                $('#div_accept_terms').show();
                                $('#gratis_modal').show();
                                $('#gratis_msg').show();
                                localStorage.setItem('hasSpecFree',true);
                                $('#hasSpecFree').val('true');
                                
                            }
                        }).fail(function() {
                           

                        });

               }

               function validEmail(){
                   

                 
               }

               function userWantFact(){
                    var ckbox = $('#quieroFac');
                    if (ckbox.is(':checked')) {
                        $('#facturacion1').addClass("want");
                        $('#facturacion2').addClass("want");
                        $('#facturacion3').addClass("want");
                        $('#hrfac').addClass("want");
                    } else {
                        $('#facturacion1').removeClass("want");
                        $('#facturacion2').removeClass("want");
                        $('#facturacion3').removeClass("want");
                        $('#hrfac').removeClass("want");
                    }
               }
                function hasSpecFree(){




                    // $.getJSON('/getFreeSpec', {disabled:true}).done(function(res) {
                    //         if (res.err == 0 && res.email == 'demoimgnpro' ){
                    //            return true;
                    //         }
                    //     }).fail(function() {
                           
                    //         return false;
                    // });

               }

              function validInput(){
                var bValor = false;
                if ($('#contactname').val().trim() === ''){
                        alert("Favor de capturar el nombre");
                        $('#contactname').focus(); 
                }
                else
                {
                    if ($('#contactemail').val().trim() === ''){
                            alert("Favor de capturar el correo electrónico"); 
                            $('#contactemail').focus(); 
                    }
                    else
                    {
                        if ($('#emailconfirm').val() !== $('#contactemail').val()){
                            alert("El correo electrónico no coincide");
                            $('#emailconfirm').focus(); 
                        }
                        else{
                            
                            if (localStorage.getItem('hasSpecFree')=='true'){
                                if ($('#i_password').val().trim() === ''){
                                    alert("favor de capturar una contraseña");
                                    $('#i_password').focus(); 
                                    bValor = false;
                                }
                                else if ($('#i_confirmpassword').val().trim() !== $('#i_password').val().trim() ){
                                    alert("La contraseña no coincide");
                                    $('#i_confirmpassword').focus(); 
                                    bValor = false;
                                }
                                else if($('#chk_accept_terms').prop('checked') !== true){

                                    alert("Por favor, acepte los términos y condiciones");
                                    $('#chk_accept_terms').focus(); 
                                    bValor = false;
                                }
                                else{
                                    bValor = true;

                                }

                            }else{
                                bValor = true;
                            }
                        }
                       
                    } 
                }
                return bValor;
              }   
            });