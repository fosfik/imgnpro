
            $(document).ready(function() {

                $('#a_freetest1').click(function (ev) {
                    demoSignup();
                    ev.preventDefault();
                });
                $('#a_freetest2').click(function (ev) {
                    demoSignup();
                    ev.preventDefault();
                });
                $('#a_freetest3').click(function (ev) {
                    demoSignup();
                    ev.preventDefault();
                });
                $('#a_freetest4').click(function (ev) {
                    demoSignup();
                    ev.preventDefault();
                });
                $('#a_freetest5').click(function (ev) {
                    demoSignup();
                    ev.preventDefault();
                });

                function demoSignup(){
                     $.ajax({
                        type: 'post',
                        url: '/signup',
                        data: {'userlongname':'demoimgnpro', 'email':'demoimgnpro', 'password':'demoimgnpro', 'accept_terms':true },
                        success: function (data) {
                            if (data.error == 1 ){
                               alert(data.message);    
                            }
                            else{
                                setTimeout(window.location='/principal',500);    
                            }
                        }
                    });
                }

                
                      
            });

                  //  SCRIPT CONTRASEÑA
          
            function check(input,input2) {
                if (input.value != document.getElementById(input2).value) {
                    input.setCustomValidity('La contraseña no coincide.');
                } else {
                    // input is valid -- reset the error message
                    input.setCustomValidity('');
                }
            }