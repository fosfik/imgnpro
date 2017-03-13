Dropzone.autoDiscover = false;
var acceptedFileType = ".jpg, .jpeg, .png, .tif, .tiff, .psd";
var imageCount = 0;
var imageUploadInfos =[];
$(document).ready(function(){
    caltotalpay();
    $("div#myId").dropzone({
        url:"https://" + $('#s3bucketnameid').val() + ".s3.amazonaws.com/",
        dictDefaultMessage: "<b>Suelta tus archivos aquí</b><br> <p class='texto_plano'> (o haz click)<p>",
        dictRemoveFile: "Borrar imagen",
        dictCancelUpload: "Borrar imagen",
        dictMaxFilesExceeded: "Ya no puedes cargar más imágenes, se ha alcanzado el límite de este paquete.",
        dictInvalidFileType: "No puedes subir archivos de este tipo (solamente: .jpg, .tif, .psd y .png)",
        method: "POST",
        maxFilesize: 2000, // in mb
        uploadMultiple: false,
        paramName: "file",
        thumbnailWidth: 100,
        thumbnailHeight: 100,
        parallelUploads: 20,
        autoProcessQueue: true,
        addRemoveLinks: true,
        clickable: true, //".fileinput-button" // Define the element that should be used as click trigger to select files.
        acceptedFiles: acceptedFileType,
        accept: function(file, cb) {
            //override the file name, to use the s3 signature
            var _fileName = normFileName(file.name); 
            var params = {
                filename: _fileName,
                filetype: file.type,
            };
            if (this.files.length) {
                var i, len, pre;
                for (i = 0, len = imageUploadInfos.length; i < len; i++) {
                    if (imageUploadInfos[i].imagename == _fileName ) {
                        alert("El archivo: " + _fileName + " ya está agregado al pedido.");
                        return (pre = file.previewElement) != null ? pre.parentNode.removeChild(file.previewElement) : void 0;
                    }
                }
            }
            $.getJSON('/sign-s3', params).done(function(res) {
                if (!res.policy) {
                    return cb('No se pudo recibir una URL para cargar la imagen');
                }
                file.postData = { key: res.key, AWSAccessKeyId: res.AWSAccessKeyId, acl: "public-read", policy: res.policy, signature: res.signature, 'content-type': file.type };
                file.signedRequest = res.url;
                cb();
            }).fail(function() {
                
                alert("Falló al cargar la imagen");
                return cb('No se pudo obtener una url válida');
            });
        },
        sending: function(file, xhr, formData) {
            $.each(file.postData, function (k, v) {
                formData.append(k, v);
            
            });
            formData.append("Content-Length", "200000000");

        },
        complete:function(file){
            if (file.accepted && file.status == 'error') {
            
                file.accepted = false;
                alert("No se pudo cargar el archivo, favor de borrarlo de la lista y volver a intentar");
                
            } else {
                
                if(file.accepted===true){    
                    imageCount++;
                    $("div#imageCount").html(imageCount);
                    caltotalpay();
                    imageUploadInfos.push({
                        imagename: normFileName(file.name),
                        width: file.width,
                        height: file.height,
                        length: file.size
                    });
                    }
            }
        },
        removedfile: function(file) {
            if(file.status !== 'error'){
                if (file.accepted===true){
                    imageCount--;
                }
                deleteitemfile(normFileName(file.name));
                $("div#imageCount").html(imageCount);
                caltotalpay();
            }
            
            if (file.previewElement != null){
                var _ref = file.previewElement;
                var params = {
                    filename: normFileName(file.name)
                    };
                if ( file.upload.progress === 100 ) { // se evalua si se completó la carga
                    $.getJSON('/delete-s3', params).done(function(data) {
                        if (data.error ===1) {
                            alert('No fue posible borrar el archivo del servidor');
                        }
                    }).fail(function() {
                        alert("No fue posible borrar el archivo");
                    });
                }  
                return(_ref.parentNode.removeChild(file.previewElement));
            }
            else{
                return 0;
            }
        }

    });

    var buttonspec = $('#buttoncontorder');
    var frm = $('#orderForm');
    buttonspec.click(function (ev) {
        if (imageCount > 0){
        var ntotalpay = $("#ntotalpay").html();
        var cadspecid = $('#specid').val();
        $.ajax({
            type: frm.attr('method'),
            url: frm.attr('action'),
            data: { 'imageUploadInfos': JSON.stringify(imageUploadInfos), 'imagecount': imageCount, 'specid': cadspecid, totalpay: ntotalpay },
            success: function (data) {
                if (data.error == 1 ){
                    alert(data.message);    
                }
                else{
                    setTimeout(window.location='/confirmpayorder/' + data.numorder, 500 );  
                }
            }
            });
        } 
        else{
            alert("Favor de cargar imágenes");
        }

        ev.preventDefault();
    });  



function deleteitemfile(filename){
    for (i = 0, len = imageUploadInfos.length; i <= len - 1; i++) {
        if (imageUploadInfos[i].imagename == filename) {
            imageUploadInfos.splice(i,1);
            break;
        }
    }
}

function caltotalpay(){
        
        var ntotalprice = $('#totalpriceid').val() * 100; 
        var ntotalimages = $("div#imageCount").html();
        
        var ntotalpay = ntotalprice * ntotalimages;


        ntotalpay = ntotalpay / 100;
        ntotalpay = ntotalpay.toFixed(2); // redondea a dos decimales
        $("#ntotalpay").html(setDecimals(ntotalpay,2));
    }


});