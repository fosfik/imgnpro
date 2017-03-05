//SCRIPT HEADER y BOTONES DEMO
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
                var frm = $('#contactForm1');
                frm.submit(function (ev) {
                    $.ajax({
                        type: frm.attr('method'),
                        url: frm.attr('action'),
                        data: frm.serialize(),
                        success: function (data) {
                            if (data.error == 1 ){
                               alert(data.message);    
                            }
                            else{
                                setTimeout(window.location='/principal',500);    
                            }
                        }
                    });
                    ev.preventDefault();
                });
            });

            //SCRIPT DE CONTRASEÑA
            function check(input,input2) {
                if (input.value != document.getElementById(input2).value) {
                    input.setCustomValidity('La contraseña no coincide.');
                } else {
                    // input is valid -- reset the error message
                    input.setCustomValidity('');
                }
            }

            //OTRO SCRIPT
             $(document).ready(function(){
               $(".cycle ul li:first-child").addClass("active");
                setTimeout(autoAddClass, 4000);
            });
            function autoAddClass(){
                var next = $(".cycle .active").removeClass("active").next();
                if(next.length)
                    $(next).addClass('active');
                else
                    $('.cycle ul li:first-child').addClass('active');
                setTimeout(autoAddClass, 4000);
            };