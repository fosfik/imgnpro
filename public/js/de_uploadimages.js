
 Dropzone.autoDiscover = false;
            var acceptedFileType = ".jpg, .png, .tiff, .psd";
            var imageCount = 0;
            var imageUploadInfos =[];
            $(document).ready(function(){
               

                $("div#myId").dropzone({
                    url: "https://"+ $('#S3_BUCKET_NAME_DONE').val() +".s3.amazonaws.com/",
                    dictDefaultMessage: "<b>Suelta tus archivos aquí</b><br> <p class='texto_plano'> (o haz click)<p>",
                    dictRemoveFile: "Borrar imagen",
                    dictCancelUpload: "Borrar imagen",
                    dictMaxFilesExceeded: "Ya no puedes cargar más imágenes, se ha alcanzado el límite de este paquete.",
                    dictInvalidFileType: "No puedes subir archivos de este tipo (solamente: .jpg, .tif, .psd y .png)",
                    method: "POST",
                    maxFilesize: 2000, // in mb
                    uploadMultiple: false,
                    paramName: "file",
                    maxFiles: $('#imagecount').val(),
                    thumbnailWidth: 100,
                    thumbnailHeight: 100,
                    parallelUploads: 20,
                    autoProcessQueue: true,
                    addRemoveLinks: true,
                    clickable: true, //".fileinput-button" // Define the element that should be used as click trigger to select files.
                    acceptedFiles: acceptedFileType,
                    
                    accept: function(file, cb) {
                        var params = {
                            filename: file.name,
                            filetype: file.type,
                            userid: $('#userid').val(),
                            orderpackid: $('#orderpackid').val()
                        };
                        if (this.files.length) {
                            var i, len, pre;

                            var sFname = file.name;
                            var sFext = sFname.match(/\.([^.]*)$/);
                            var sFNameComp = "";
                            if(sFext){
                                sFNameComp = sFname.substring(0, sFname.length - sFext[1].length );
                              }else{
                                return cb("El archivo no tiene extensión");
                            }


                            var sFnameU = "";
                            var sFNameCompU = ""; 
                            for (i = 0, len = imageUploadInfos.length; i < len; i++) {
                                sFnameU = imageUploadInfos[i].imagename;
                                var sFextU = sFnameU.match(/\.([^.]*)$/);

                                if(sFextU){
                                    sFNameCompU = sFnameU.substring(0, sFnameU.length - sFextU[1].length );
                                   
                                  }else{
                                    sFNameCompU = sFnameU;
                                 }


                                if ( sFNameCompU == sFNameComp) {
                                    alert("El archivo: " + file.name + " ya está agregado al paquete.");
                                    //this.files.splice(i,1);
                                    //cb();
                                    return (pre = file.previewElement) != null ? pre.parentNode.removeChild(file.previewElement) : void 0;
                                }
                            }

                        }

                        

                        //path to S3 signature
                        $.getJSON('/sign-s3done', params).done(function(res) {
                            if(res.err == 1){
                                return cb('Esta imagen no pertenece a este paquete:' + res.message);
                            }
                            if(res.err == 2){
                                return cb(res.message);
                            }
                            if (!res.policy) {
                                return cb('No se pudo recibir una URL para cargar la imagen');
                            }

                            
                            file.postData = { key: res.key, AWSAccessKeyId: res.AWSAccessKeyId, acl: "public-read", policy: res.policy, signature: res.signature, 'content-type': file.type };

                            file.signedRequest = res.url;

                            cb();
                        }).fail(function() {
                            alert("Falló al cargar la imagen");
                            return cb('No se pudo conseguir una url válida');
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
                                imageUploadInfos.push({
                                    imagename: file.name,
                                    width: file.width,
                                    height: file.height,
                                    length: file.size
                                });

                             }
                        }
                    },
                    removedfile: function(file) {
                        if(file.status !== 'error'){
                            imageCount--;
                            deleteitemfile(file.name);
                            $("div#imageCount").html(imageCount);
                        }
                       
                        if (file.previewElement != null){
                            var _ref = file.previewElement;
                            var params = {
                                filename: file.name,
                                userid: $('#userid').val(),
                                orderpackid: $('#orderpackid').val()
                             };
                            if ( file.upload.progress === 100 ) { // se evalua si se completó la carga
                                $.getJSON('/delete-s3done', params).done(function(data) {
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

                
                $('#bconfirmpack').click(function (ev) {
                    var packImgCount = $("div#packImgCount").html();
                    var imageCount = $("div#imageCount").html();
                    packImgCount = parseInt(packImgCount);
                    imageCount = parseInt(imageCount);

                   if (imageCount == packImgCount){
                    $.ajax({
                        type: 'post',
                        url: '/confirmPackage',
                        data: { 'orderpackid':$('#orderpackid').val(), 'designerid': $('#designerid').val() },
                        success: function (data) {
                            if (data.error == 1 ){
                                alert(data.message);    
                            }
                            else{
                                alert(data.message); 
                                window.location='/de_designers';
                            }
                        }
                     });
                   } 
                   else{
                        alert("Favor de cargar imágenes, faltan " + ( packImgCount - imageCount) + " por cargar");
                   }
               });

                    
            function deleteitemfile(filename){
                for (i = 0, len = imageUploadInfos.length; i <= len - 1; i++) {
                    if (imageUploadInfos[i].imagename == filename) {
                        imageUploadInfos.splice(i,1);
                        break;
                    }
                }
            }

        
            });
