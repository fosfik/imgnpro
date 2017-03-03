
$(document).ready(function(){
                var v_specname = localStorage.getItem("specname");
                var v_typespec = localStorage.getItem("typespec");

                var dom_typespec = $("#dom_typespec").val();
                var dom_specname = $("#dom_specname").val();
                localStorage.clear(); // limpia el localstorage
                localStorage.setItem("specname", dom_specname);
                localStorage.setItem("typespec", dom_typespec);
                if (v_typespec == 'free'){
                    localStorage.setItem("specname", v_specname);
                    localStorage.setItem("typespec", v_typespec);
                }
                if (dom_typespec == 'normal'){
                    localStorage.clear();
                }

                $('#buttoncontorder').click(function (ev) {
                    var imageselected = localStorage.getItem('imageselected');
                    if (imageselected === null){
                        alert("Favor de seleccionar una imagen");    
                    }
                    else{
                          document.location.href="/chooseaspecification";
                    }
                    ev.preventDefault();
                });
                $("#imageForm input[name=image]").change(function(){
                    var imageselected = $('input:radio[name=image]:checked').val();
                    localStorage.setItem("imageselected", imageselected);
                });
                
            });
            