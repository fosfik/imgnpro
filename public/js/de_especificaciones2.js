$(document).ready(function(){
    //Se desactivan los botones de opcion de alineación
    var strspecid= $('#specid').val();
    // alert(strspecid.length);
    $('#specnombre').focus();
    $('#datespec').prop('value', Date.now);
    desactAllNext();
    desactSizeAllNext();
    //sumallextras();
    //var newbuttonspec = $('#savebuttonspec');
    //var newbuttonspec = $('#savebuttonspec');
    var frm = $('#specForm');
    if (strspecid.length > 0){
        var ajaxUrl = '/getOrdeSpec/' + $('#specid').val();
        $.ajax({
                type: 'get',
                url: ajaxUrl,
                //data: frm.serialize(),
                success: function (data) {
                    if (data.error == 1 ){
                        //document.getElementById('res_message').innerHTML= data.message;    
                        alert(data.message);
                            //$('#specnombre').focus();
                    }
                    else{
                        //setTimeout(window.location='/subirimagen4.html',500);
                        //alert(data.spec.sizenone);
                        $('#specnombre').prop("value", data.spec.name);
                        $('#specnombre').focus();
                        $('#format').prop("value", data.spec.format);
                        $('#colormode').prop("value", data.spec.colormode);
                        $('#background').prop("value", data.spec.background);
                        $('#colorselect').prop("value", data.spec.backgrndcolor);


                        // if (data.spec.sizenone==null){
                        //     $('#chksizenone').prop('checked', false);
                        // }

                        if (data.spec.dpinone !== null){
                            if (data.spec.dpinone === 'none'){
                                $('#chkDPInone').prop('checked',true);
                            }
                            else{
                                $('#chkDPInone').prop('checked',false);
                            }
                        }
                        else{
                            $('#chkDPInone').prop('checked',false);
                        }


                        if (data.spec.sizenone !== null){
                            if (data.spec.sizenone === 'none'){
                                $('#chksizenone').prop('checked',true);
                            }
                            else{
                                $('#chksizenone').prop('checked',false);
                            }
                        }
                        else{
                            $('#chksizenone').prop('checked',false);
                        }
                        

                            if (data.spec.alignnone !== null){
                            if (data.spec.alignnone === 'none'){
                                $('#chkalgnnone').prop('checked',true);
                            }
                            else{
                                $('#chkalgnnone').prop('checked',false);

                                var alignhor = data.spec.alignhor;
                                $('#'+ alignhor).prop('checked', true);  
                                var alignver = data.spec.alignver;
                                $('#'+ alignver).prop('checked', true);  
                            }
                            
                            //$('#marco').removeClass(currentClassName).addClass(currentAlignHor);  
                            //$('#' + currentAlignHor).prop("checked", true);
                        }
                        else{
                            $('#chkalgnnone').prop('checked',false);
                        }
                        

                        if (data.spec.marginmeasure !== null && data.spec.marginmeasure !== undefined){
                            $('#marginmeasure').prop('value', data.spec.marginmeasure);
                        }
                        
                        if (data.spec.margintop !== null && data.spec.margintop != undefined){
                            $("#specForm input[name='margintop']").prop('value', data.spec.margintop);
                        }
                        if (data.spec.marginbottom !== null && data.spec.marginbottom !== undefined){
                            $("#specForm input[name='marginbottom']").prop('value', data.spec.marginbottom);
                        }
                        if (data.spec.marginleft !== null && data.spec.marginleft !== undefined){
                            $("#specForm input[name='marginleft']").prop('value', data.spec.marginleft);
                        }
                        if (data.spec.marginright !== null && data.spec.marginright !== undefined){
                            $("#specForm input[name='marginright']").prop('value', data.spec.marginright);
                        }

                        if (data.spec.naturalshadow !== null && data.spec.naturalshadow !== undefined){  
                            $("#specForm input[name='naturalshadow']").prop( "checked", true );
                            $("#specForm input[name='dropshadow']").prop( "checked", false );
                                    
                        }  
                        if (data.spec.dropshadow !== null && data.spec.dropshadow !== undefined){  
                            $("#specForm input[name='naturalshadow']").prop( "checked", false );
                            $("#specForm input[name='dropshadow']").prop( "checked", true );
                        }  
                        if (data.spec.correctcolor !== null && data.spec.correctcolor !== undefined){  
                            $("#specForm input[name='correctcolor']").prop( "checked", true );
                        }  

                        if (data.spec.clippingpath !== null && data.spec.clippingpath !== undefined){  
                            $("#specForm input[name='clippingpath']").prop( "checked", true );
                        }  

                        if (data.spec.basicretouch !== null && data.spec.basicretouch !== undefined){  
                            $("#specForm input[name='basicretouch']").prop( "checked", true );
                        }  

                        if (data.spec.imagesize !== null && data.spec.imagesize !== undefined){
                            // $('input:radio[name=imagesize]').prop('value',data.spec.imagesize);
                            if (data.spec.imagesize === '1:1') {
                                $('#radio11').prop('checked', 'true');
                            }
                            if (data.spec.imagesize === '2:3') {
                                $('#radio23').prop('checked', 'true');
                            }
                            if (data.spec.imagesize === '3:2') {
                                $('#radio32').prop('checked', 'true');
                            }
                            if (data.spec.imagesize === '4:3') {
                                $('#radio43').prop('checked', 'true');
                            }
                            if (data.spec.imagesize === 'customize') {
                                $('#optcustomsize').prop('checked', 'true');
                            }
                        }
                        if (data.spec.dpi !== null && data.spec.dpi !== undefined){
                            $('#depeis').prop('value', data.spec.dpi);
                        }
                        if (data.spec.measuresize !== null && data.spec.measuresize !== undefined){
                            $('select[name=measuresize]').prop("value", data.spec.measuresize);
                        }
                        if(isNotNullUndefined(data.spec.widthsize)){ 
                            $("#specForm input[name='widthsize']").prop("value", data.spec.widthsize);
                        }
                        if(isNotNullUndefined(data.spec.heightsize)){ 
                            $("#specForm input[name='heightsize']").prop("value", data.spec.heightsize);
                        }
                            


                        //sumallextras();
                        desactAllNext();
                        desactSizeAllNext();
                        desactCustomAllNext();
                        desactDPI();
                        desactFormFact();
                        //putPrices();
                        
                        }

                    
                }
            });

    }

    $('#savebuttonspec').click(function (ev) { // Botón Guardar Cambios
        saveSpec(true);
        ev.preventDefault();

    }); 

    $('#saveploadbuttonspec').click(function (ev) { // Botón Guardar Cambios
        saveSpec(false);
        ev.preventDefault();

    });

    $("#chkalgnnone").change(function(){
        desactAllNext();
    }); 

    $("#chksizenone").change(function(){
        desactSizeAllNext();
    }); 

    $("#chkmarginone").change(function(){
        desactMarginAllNext();
    }); 
    
    $("input[name=imagesize]").change(function(){
        desactCustomAllNext();
    }); 
    
    $("#background").change(function() {
        if($("#background option:selected").text() ==='COLOR' ){
            $('#colorselect').prop("disabled", false);
            }
        else{
            $('#colorselect').prop("value", '#ffffff');
            $('#colorselect').prop("disabled", true);

        }
    });

    $("#format").change(function() {

        //alert( $("#format option:selected").text());
            $('#sin_fondo').prop("disabled", false);
            $('#mode_cmyk').prop("disabled", false);
            
            if($("#format option:selected").text() ==='JPG' || $("#format option:selected").text() ==='JPG WEB' ){
            $('#sin_fondo').prop("disabled", true);
            $('#background').prop("value", 'blanco');
            $('#colorselect').prop("value", '#ffffff');
            $('#colorselect').prop("disabled", true);  
            }

            if($("#format option:selected").text() ==='JPG WEB' || $("#format option:selected").text() ==='PNG' ){
            alert('Las imágenes JPG WEB ó PNG no permiten la opción de Clipping Path');
            $("#specForm input[name='clippingpath']").prop("checked",false);
            $("#specForm input[name='clippingpath']").prop("disabled",true);
            $('#mode_cmyk').prop("disabled", true);
            $('#colormode').prop("value", 'rgb');
            //sumallextras();
            }
            else{
            $("#specForm input[name='clippingpath']").prop("disabled",false);        
            } 
            
    });

    function saveSpec(uploadimages){
        if ($('#specnombre').val().trim() === ''){
            alert("Favor de capturar el nombre de la especificación");    
            $('#specnombre').focus();
        }
        else{
            $.ajax({
                type: frm.attr('method'),
                url: frm.attr('action'),
                data: frm.serialize(),
                success: function (data) {
                    if (data.error == 1 ){
                        //document.getElementById('res_message').innerHTML= data.message;    
                        alert(data.message);
                            $('#specnombre').focus();
                    }
                    else{
                        //setTimeout(window.location='/subirimagen4.html',500);
                        alert(data.message);
                        $('#specid').prop('value','');
                        document.getElementById("specForm").reset();
                        desactAllNext();
                        desactSizeAllNext();
                        //sumallextras(); 
                        if (uploadimages==true){
                            if(confirm("¿Quieres subir imágenes?")){
                                document.location.href="/uploadimages/" + data.newSpecid;
                            }
                        }
                        else
                        {
                            document.location.href="/uploadimages/" + data.newSpecid;
                        }
                        
                    }
                }
            });
        }

    }


    function desactAllNext(){
        var chkalgnnone = document.getElementById('chkalgnnone').checked;
        $('input:radio[name=alignhor]').prop('disabled', chkalgnnone);
        $('input:radio[name=alignver]').prop('disabled', chkalgnnone);
    }

        function desactMarginAllNext(){
        var chkmarginone = document.getElementById('chkmarginone').checked;
        $('#marginmeasure').prop('disabled', chkmarginone);
        $('input[name=margintop]').prop('disabled', chkmarginone);
        $('input[name=marginbottom]').prop('disabled', chkmarginone);
        $('input[name=marginleft]').prop('disabled', chkmarginone);
        $('input[name=marginright]').prop('disabled', chkmarginone);
    }

    function desactSizeAllNext(){
        var chksizenone = document.getElementById('chksizenone').checked;
        if(chksizenone==false && $('input:radio[name=imagesize]:checked').val() == null){
            $('#radio11').prop('checked', 'true');
        } 
        if(chksizenone==false && $('input:radio[name=imagesize]:checked').val() ==='1:1'){
            $('#radio11').prop('checked', 'true');
        } 
        if(chksizenone==false && $('input:radio[name=imagesize]:checked').val() ==='2:3'){
            $('#radio23').prop('checked', 'true');
        } 
        if(chksizenone==false && $('input:radio[name=imagesize]:checked').val() ==='3:2'){
            $('#radio32').prop('checked', 'true');
        } 
        if(chksizenone==false && $('input:radio[name=imagesize]:checked').val() ==='4:3'){
            $('#radio43').prop('checked', 'true');
        } 
        if(chksizenone==false && $('input:radio[name=imagesize]:checked').val() ==='customize'){
            $('#customize').prop('checked', 'true');
        } 
        
        $('input:radio[name=imagesize]').prop('disabled', chksizenone);
        $('select[name=measuresize]').prop('disabled', true);
        $('input[name=widthsize]').prop('disabled', true);
        $('input[name=heightsize]').prop('disabled', true);
    }

    function desactCustomAllNext(){
        if ($("input[name=imagesize]:checked").val() === 'customize'){
            $('select[name=measuresize]').prop('disabled', false);
            $('input[name=widthsize]').prop('disabled', false);
            $('input[name=heightsize]').prop('disabled', false);

            
        }
        else{
            $('select[name=measuresize]').prop('disabled', true);
            $('input[name=widthsize]').prop('disabled', true);
            $('input[name=heightsize]').prop('disabled', true);
        }
    }
    function desactFormFact(){
        
        $('#specForm').find('input, textarea, button, select').prop('disabled',true);
    } 

});

function desactDPI(){
    var chkalgnnone = document.getElementById('chkDPInone').checked;
    document.getElementById("depeis").disabled = chkalgnnone; 
}