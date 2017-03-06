  
   $(document).ready(function(){
             
              
                $('#contactname').focus();
                $.ajax({
                        type: 'get',
                        url: $('#idinput').val(),
                        success: function (data) {
                            if (data.error == 1 ){
                                alert(data.message);
                                $('#contactname').focus();
                            }
                            else{
                                $.each(data.user_details, function(elem, val) {
                                    $('input[name="' + elem +'"]').val(val);
                                    $('select[name="' + elem +'"]').val(val);
                                    $('input[value="' + val + '"]').prop('checked', true);
                                });    
                            }
                         }
                });

            $('#chk_factura').bind("DOMSubtreeModified",function(){
              alert('changed');
            });
            $("#chk_factura").change(function(){
            }); 

            $('#btn_savedetails').click(function (ev) {
                // recuperar las variables localStorage

                if ($('#emailconfirm').val() !== $('#contactemail').val()){

                    alert("El correo electrónico no coincide");
                    return ev.preventDefault();
                }
                var formdata = $('form').serialize();
                $.ajax({
                        type: 'post',
                        url: '/updateuserdetails',
                        data: formdata,
                        success: function (data) {
                            if (data.error == 1 ){
                                alert(data.message);
                                 $('#contactname').focus();
                            }
                            else{
                                alert(data.message);
                            }
                        }
                 });
                ev.preventDefault();
               }); 

               function desactFormFact(){
                var chk_factura = document.getElementById('chk_factura').checked;
                    $('#factForm1').find('input, textarea, button, select').prop('disabled',!chk_factura);
                    $('#factForm2').find('input, textarea, button, select').prop('disabled',!chk_factura);
               }  


               
            });