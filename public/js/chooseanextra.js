
 $(document).ready(function(){
                var newbuttonspec = $('#savebuttonspec');
                var v_typespec = localStorage.getItem("typespec");
                var iniformat = localStorage.getItem("format");
                if(iniformat ==='jpg_web' || iniformat ==='png'){
                    $('#a_cuadroxtra4').prop('href','#');
                    $('#a_cuadroxtra4').click(function(){
                        alert('Las imágenes JPG WEB ó PNG no permiten la opción de Clipping Path');
                    });
                }
                if (v_typespec == 'free'){
                    desactForm();    
                }
                //putPrices(); // pone los precios actuales
                sumallextras();
                newbuttonspec.click(function (ev) {
                    // recuperar las variables localStorage
                    var specInfos =[];
                    var specname = localStorage.getItem("specname");
                    var format = localStorage.getItem("format");
                    var colormode = localStorage.getItem("colormode");
                    var background = localStorage.getItem("background");
                    var DPI = localStorage.getItem("DPI");
                    var measuresize = localStorage.getItem("measuresize");
                    
                    var imagesize = localStorage.getItem('imagesize');
                    var sizenone = localStorage.getItem("sizenone");
                    // si se chekeo sin cambios en tamaño
                    if (sizenone === 'none'){
                        localStorage.removeItem('measuresize');
                        localStorage.removeItem('widthsize');
                        localStorage.removeItem('heightsize');
                    }
                    var naturalshadow = localStorage.getItem('naturalshadow');
                    var dropshadow = localStorage.getItem('dropshadow');
                    var correctcolor =  localStorage.getItem('correctcolor');
                    var basicretouch =  localStorage.getItem('basicretouch');
                    var clippingpath = localStorage.getItem('clippingpath');
                    var alignnone = localStorage.getItem('alignnone');
                    var description = localStorage.getItem('description');
                    // Si se chekeo sin cambios en alineación
                    if (alignnone === 'none'){
                        localStorage.removeItem('alignhor');
                        localStorage.removeItem('alignver');
                    }
                    var alignhor = localStorage.getItem('alignhor');
                    var alignver = localStorage.getItem('alignver');
                    if (localStorage.getItem('marginnone') === 'none'){
                        localStorage.removeItem('marginmeasure');
                        localStorage.removeItem('margintop');
                        localStorage.removeItem('marginbottom');
                        localStorage.removeItem('marginright');
                        localStorage.removeItem('marginleft');
                    }
                    specInfos.push({
                        specname:specname,
                        format:format,
                        colormode:colormode,
                        background:background,
                        backgrndcolor:localStorage.getItem("backgrndcolor"),
                        DPI:DPI,
                        dpinone:localStorage.getItem("dpinone"),
                        alignnone:localStorage.getItem('alignnone'),
                        totalprice:localStorage.getItem("totalprice"),
                        measuresize:localStorage.getItem("measuresize"),
                        sizenone:sizenone,
                        imagesize:imagesize,
                        widthsize:localStorage.getItem("widthsize"),
                        heightsize:localStorage.getItem("heightsize"),
                        alignver:alignver,
                        alignhor:alignhor,
                        naturalshadow:naturalshadow,
                        dropshadow:dropshadow,
                        correctcolor:correctcolor,
                        basicretouch:basicretouch,
                        clippingpath:clippingpath,
                        description:description,
                        marginnone:localStorage.getItem('marginnone'),
                        marginmeasure: localStorage.getItem('marginmeasure'),
                        margintop:localStorage.getItem('margintop'),
                        marginbottom:localStorage.getItem('marginbottom'),
                        marginright:localStorage.getItem('marginright'),
                        marginleft:localStorage.getItem('marginleft'),
                        date:Date.now(),
                        spectype:'stepbystep',
                        typespec:localStorage.getItem("typespec")
                    });
                    $.ajax({
                            type: 'post',
                            url: '/newstepspec',
                            data: { 'specInfos': JSON.stringify(specInfos)},
                            success: function (data) {
                                if (data.error == 1 ){
                                 
                                    alert(data.message);
                                     $('#specnombre').focus();
                                }
                                else{
                                   
                                    if (data.freeSpecid){
                                        
                                      
                                        document.location.href="/uploadimages/" + data.freeSpecid;
                                    }
                                    else
                                    {
                                        if (data.newSpecid==0){
                                            alert("Sucedió un error inesperado, favor de contactarse con el administrador");
                                        }else{
                                            document.location.href="/uploadimages/" + data.newSpecid;
                                        }
                                        
                                    }
                                }
                            }
                        });
                    ev.preventDefault();
                }); 

                if (typeof(Storage) !== "undefined") {
                    var lblnameSpec = $('#nameSpec');

                    lblnameSpec.html(localStorage.getItem('specname'));
                } else {
                    alert("Este navegador no soporta LocalStorage");
                } 

               $("#buttonshadow").click(function(){
                    var shadowsel = $('input:radio[name="shadow"]:checked');
                    localStorage.removeItem("naturalshadow");
                    localStorage.removeItem("dropshadow");
                    if ( shadowsel.prop('id') ==='naturalshadow'){
                        localStorage.setItem('naturalshadow',shadowsel.val());
                    }
                    if ( shadowsel.prop('id') ==='dropshadow'){
                        localStorage.setItem('dropshadow',shadowsel.val());
                    }
                 
                    sumallextras();
                });

               $("#buttoncolor").click(function(){
                    var correctcolor = $('input:radio[name="color"]:checked');
                    localStorage.removeItem("correctcolor");
                    if ( correctcolor.prop('id') ==='correctcolor'){
                        localStorage.setItem('correctcolor',correctcolor.val());
                    }
            
                    sumallextras();
                });
               $("#buttonretouch").click(function(){
                    var basicretouch = $('input:radio[name="retouch"]:checked');
                    localStorage.removeItem("basicretouch");
                    if ( basicretouch.prop('id') ==='basicretouch'){
                        localStorage.setItem('basicretouch',basicretouch.val());
                    }
                  
                    sumallextras();
                });
               $("#buttonpath").click(function(){
                    var clippingpath = $('input:radio[name="path"]:checked');
                    localStorage.removeItem("clippingpath");
                    if ( clippingpath.prop('id') ==='clippingpath'){
                        localStorage.setItem('clippingpath',clippingpath.val());
                    }
                    
                  
                    sumallextras();
                });
                

                  $('#buttondescription').click(function () {

                    if ($('#description').val().trim() === ''){
                       
                       
                    }
                    else{

                        var textocoment = $('#description').val();

                          localStorage.setItem("description",textocoment);
                    }
               
                });




                function desactForm(formName){
                    $('#div_msgDemo').show();
                } 


                function sumallextras(){
                    var v_typespec = localStorage.getItem("typespec");
                    if (v_typespec !== 'free'){
                                   
                        var ntotal = $('#configpricescutandremove').val(); 
                        ntotal = ntotal * 100;

                        
                        if(localStorage.getItem('naturalshadow')!== null){
                            
                             ntotal = ntotal + (localStorage.getItem('naturalshadow') * 100);
                        }

                        if(localStorage.getItem('dropshadow')!== null){
                             ntotal = ntotal + (localStorage.getItem('dropshadow') * 100);
                        }

                        if(localStorage.getItem('correctcolor')!== null){
                             ntotal = ntotal + (localStorage.getItem('correctcolor') * 100);
                        }
                        
                        if(localStorage.getItem('clippingpath')!== null){
                             ntotal = ntotal + (localStorage.getItem('clippingpath') * 100);
                        }

                        if(localStorage.getItem('basicretouch')!== null){
                             ntotal = ntotal + (localStorage.getItem('basicretouch') * 100);
                        }
                                    
                        ntotal = ntotal / 100;
                        $("#totalprice").html(setDecimals(ntotal,2));
                     }       
                }

            });