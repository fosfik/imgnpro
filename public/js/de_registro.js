var frm = $('#contactForm1');
                frm.submit(function (ev) {
                    $.ajax({
                        type: frm.attr('method'),
                        url: frm.attr('action'),
                        data: frm.serialize(),
                        success: function (data) {
                            if (data.error == 1 ){
                                document.getElementById('res_message').innerHTML= data.message;    
                            }
                            else{
                                setTimeout(window.location='/de_login',500);    
                            }
                        }
                    });

                    ev.preventDefault();
                });