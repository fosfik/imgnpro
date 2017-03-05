//CONTACTO
 $(document).ready(function() {
            var frm = $('#contactForm');
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
                            console.log(data);
                            setTimeout(window.location='/',500);    
                        }
                    }
                });
                ev.preventDefault();
            })
        });