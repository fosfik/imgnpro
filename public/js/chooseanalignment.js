 
 $(document).ready(function(){
                // Desactivar las opciones de alineación 
                desactAllNext();
                if (typeof(Storage) !== "undefined") {
                    // Code for localStorage/sessionStorage.
                    var imageselected = localStorage.getItem("imageselected");
                    $("#imgportaimage").attr("src",imageselected);

                    var currentAlignHor =  localStorage.getItem("alignhor");
                    var currentAlignVer = localStorage.getItem("alignver");
                    var currentAlignnone =  localStorage.getItem("alignnone");

                    if (currentAlignHor !== null){
                        var currentClassName = $('#marco').attr('class');
                        $('#marco').removeClass(currentClassName).addClass(currentAlignHor);  
                        $('#' + currentAlignHor).prop("checked", true);
                    }
                    else{
                        localStorage.setItem("alignhor", 'alignHorizontalC');
                    }


                    if (currentAlignVer !== null){
                        currentClassName = $('#imgportaimage').attr('class');
                        $('#imgportaimage').removeClass(currentClassName).addClass(currentAlignVer);
                        $('#' + currentAlignVer).prop("checked", true);
                    } 
                    else{
                        localStorage.setItem("alignver", 'alignVerticalM');
                    }

                    if (currentAlignnone !== null){
                        if (currentAlignnone === 'none'){
                            $('#chkalgnnone').prop('checked',true);
                        }
                        else{
                            $('#chkalgnnone').prop('checked',false);
                        }
                        desactAllNext();
                    }
                    else{
                        localStorage.setItem("alignnone", 'none');
                    }
                    
                    
                } else {
                    alert("Este navegador no soporta LocalStorage");
                } 
                $("#alignForm1 input[name='alignhor']").click(function(){
                    var currentClassName = $('#marco').attr('class');
                    var newClassName = $('input:radio[name=alignhor]:checked').val();
                    $('#marco').removeClass(currentClassName).addClass(newClassName);  
                    localStorage.setItem("alignhor", newClassName);
                    
                });
                $("#alignForm1 input[name='alignver']").click(function(){
                    var currentClassName = $('#imgportaimage').attr('class');
                    var newClassName = $('input:radio[name=alignver]:checked').val();
                    $('#imgportaimage').removeClass(currentClassName).addClass(newClassName);
                    localStorage.setItem("alignver", newClassName);  
                });
            
                $("#chkalgnnone").change(function(){
                    var chkalgnnone = document.getElementById('chkalgnnone').checked;
                    if (chkalgnnone == false){
                        localStorage.setItem('alignnone','');            
                    }
                    else{
                        localStorage.setItem('alignnone','none'); 
                    }
                    desactAllNext();
                }); 
                function desactAllNext(){
                    var chkalgnnone = document.getElementById('chkalgnnone').checked;
                    $('input:radio[name=alignhor]').prop('disabled', chkalgnnone);
                    $('input:radio[name=alignver]').prop('disabled', chkalgnnone);
                }
            });