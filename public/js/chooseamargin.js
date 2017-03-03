
$(document).ready(function(){
                var imageselected = localStorage.getItem("imageselected");
                var currentMarginnone =  localStorage.getItem("marginnone");
                $("#imgportaimage").attr("src",imageselected);
                if (currentMarginnone !== null){
                    if (currentMarginnone === 'none'){
                        $('#chkmarginone').prop('checked',true);
                    }
                    else{
                        $('#chkmarginone').prop('checked',false);
                    }
                    desactMarginAllNext();
                }
                else{
                    localStorage.setItem("marginnone", 'none');
                }


                $('#buttoncont').click(function (ev) {
                    localStorage.setItem("marginmeasure", $('select[name="marginmeasure"]').val());
                    localStorage.setItem("margintop", $('input:text[name=margintop]').val());
                    localStorage.setItem("marginbottom", $('input:text[name=marginbottom]').val());
                    localStorage.setItem("marginright", $('input:text[name=marginright]').val());
                    localStorage.setItem("marginleft", $('input:text[name=marginleft]').val());
                    document.location.href="/chooseanextra";
                    ev.preventDefault();
                }); 
                $("#chkmarginone").change(function(){
                    var chkmarginone = document.getElementById('chkmarginone').checked;
                    if (chkmarginone == false){
                        localStorage.setItem('marginnone','');            
                    }
                    else{
                        localStorage.setItem('marginnone','none'); 
                    }
                    desactMarginAllNext();
                }); 
                function desactMarginAllNext(){
                    var chkmarginone = document.getElementById('chkmarginone').checked;
                    $('#marginmeasure').prop('disabled', chkmarginone);
                    $('input[name=margintop]').prop('disabled', chkmarginone);
                    $('input[name=marginbottom]').prop('disabled', chkmarginone);
                    $('input[name=marginleft]').prop('disabled', chkmarginone);
                    $('input[name=marginright]').prop('disabled', chkmarginone);
                }
            });