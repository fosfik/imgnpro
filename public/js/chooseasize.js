 $(document).ready(function(){
                $('#buttoncont').click(function (ev) {
                    var imagesize = localStorage.getItem('imagesize');
                    if (imagesize=== null){
                        localStorage.setItem("measuresize", 'none');
                    }
                    if (imagesize === 'none'){
                        localStorage.setItem("sizenone", 'none');
                    }
                    else{
                        localStorage.removeItem("sizenone");
                    }
                    if (imagesize==='customize'){
                        localStorage.setItem("measuresize", $('select[name="measuresize"]').val());
                        localStorage.setItem("widthsize", $('input:text[name=widthsize]').val());
                        localStorage.setItem("heightsize", $('input:text[name=heightsize]').val());
                    }
                    document.location.href="/chooseanalignment";
                    ev.preventDefault();
                });

                if (typeof(Storage) !== "undefined") {
                    localStorage.setItem("imagesize", "none");
                } else {
                    alert("Este navegador no soporta LocalStorage");
                } 

               $("#sizeForm input[name='size']").click(function(){
                    localStorage.imagesize = $('input:radio[name=size]:checked').val();
                });
            });