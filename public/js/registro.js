//REGISTRO
 $(document).ready(function() {

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

                var frm2 = $('#contactForm2');
                frm2.submit(function (ev) {
                    $.ajax({
                        type: frm2.attr('method'),
                        url: frm2.attr('action'),
                        data: frm2.serialize(),
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
                

                $(window).on('scroll', function() {
                    if (Math.round($(window).scrollTop()) > 100) {
                        $('#contregistro').addClass("sticky");
                        $('#contenedor1').addClass("sticky");
                        $('#contregistro2').addClass("sticky");
                        $('#contenedor1a').addClass("sticky");
                    }
                    else {
                       $('#contregistro').removeClass("sticky");
                        $('#contenedor1').removeClass("sticky");
                        $('#contregistro2').removeClass("sticky");
                        $('#contenedor1a').removeClass("sticky");
                    }
                });
                

                
                      
            });

            //CARGA DE IMAGENES
             $(window).load(function() { //start after HTML, images have loaded

                var InfiniteRotator1 = 
                {
                    init: function()
                    {
                        //initial fade-in time (in milliseconds)
                        var initialFadeIn = 2000;

                        //interval between items (in milliseconds)
                        var itemInterval = 3000;

                        //cross-fade time (in milliseconds)
                        var fadeTime = 2500;

                        //count number of items
                        var numberOfItems = $('.rotating-item1').length;

                        //set current item
                        var currentItem = 0;

                        //show first item
                        $('.rotating-item1').eq(currentItem).fadeIn(initialFadeIn);

                        //loop through the items        
                        var infiniteLoop = setInterval(function(){
                            $('.rotating-item1').eq(currentItem).fadeOut(fadeTime);

                            if(currentItem == numberOfItems -1){
                                currentItem = 0;
                            }else{
                                currentItem++;
                            }
                            $('.rotating-item1').eq(currentItem).fadeIn(fadeTime);

                        }, itemInterval);   
                    }   
                };

                InfiniteRotator1.init();
                
                var InfiniteRotator2 = 
                {
                    init: function()
                    {
                        //initial fade-in time (in milliseconds)
                        var initialFadeIn = 2000;

                        //interval between items (in milliseconds)
                        var itemInterval = 3000;

                        //cross-fade time (in milliseconds)
                        var fadeTime = 2500;

                        //count number of items
                        var numberOfItems = $('.rotating-item2').length;

                        //set current item
                        var currentItem = 0;

                        //show first item
                        $('.rotating-item2').eq(currentItem).fadeIn(initialFadeIn);

                        //loop through the items        
                        var infiniteLoop = setInterval(function(){
                            $('.rotating-item2').eq(currentItem).fadeOut(fadeTime);

                            if(currentItem == numberOfItems -1){
                                currentItem = 0;
                            }else{
                                currentItem++;
                            }
                            $('.rotating-item2').eq(currentItem).fadeIn(fadeTime);

                        }, itemInterval);   
                    }   
                };

                InfiniteRotator2.init();
                
                var InfiniteRotator3 = 
                {
                    init: function()
                    {
                        //initial fade-in time (in milliseconds)
                        var initialFadeIn = 2000;

                        //interval between items (in milliseconds)
                        var itemInterval = 3000;

                        //cross-fade time (in milliseconds)
                        var fadeTime = 2500;

                        //count number of items
                        var numberOfItems = $('.rotating-item3').length;

                        //set current item
                        var currentItem = 0;

                        //show first item
                        $('.rotating-item3').eq(currentItem).fadeIn(initialFadeIn);

                        //loop through the items        
                        var infiniteLoop = setInterval(function(){
                            $('.rotating-item3').eq(currentItem).fadeOut(fadeTime);

                            if(currentItem == numberOfItems -1){
                                currentItem = 0;
                            }else{
                                currentItem++;
                            }
                            $('.rotating-item3').eq(currentItem).fadeIn(fadeTime);

                        }, itemInterval);   
                    }   
                };

                InfiniteRotator3.init();
                
                var InfiniteRotator4 = 
                {
                    init: function()
                    {
                        //initial fade-in time (in milliseconds)
                        var initialFadeIn = 2000;

                        //interval between items (in milliseconds)
                        var itemInterval = 3000;

                        //cross-fade time (in milliseconds)
                        var fadeTime = 2500;

                        //count number of items
                        var numberOfItems = $('.rotating-item4').length;

                        //set current item
                        var currentItem = 0;

                        //show first item
                        $('.rotating-item4').eq(currentItem).fadeIn(initialFadeIn);

                        //loop through the items        
                        var infiniteLoop = setInterval(function(){
                            $('.rotating-item4').eq(currentItem).fadeOut(fadeTime);

                            if(currentItem == numberOfItems -1){
                                currentItem = 0;
                            }else{
                                currentItem++;
                            }
                            $('.rotating-item4').eq(currentItem).fadeIn(fadeTime);

                        }, itemInterval);   
                    }   
                };

                InfiniteRotator4.init();

            });


               alert("registro en el js");
           
    function check(input,input2,message) {
         if (input.value != document.getElementById(input2).value) {
              input.setCustomValidity(message);
          } else {
                    // input is valid -- reset the error message
         input.setCustomValidity('');
           }
    }