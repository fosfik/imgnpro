 
 $(document).ready(function(){
                    window.localStorage.clear();
                    $.ajax({
                        type: 'get',
                        url: '/listorders/5',
                        success: function (data) {
                            var statusfinal = '';
                            for (var i = 0; i < data.length; i++){

                                if (data[i].status ==='Por pagar'){
                                    statusfinal = "<a class='porpagar' href='/confirmpayorder/" + data[i].numorder + "'>Por Pagar</a>";
                                }
                                else if (data[i].status ==='En Proceso')
                                {
                                    statusfinal ="<a class='enproceso' href=''>En Proceso</a>";
                                }
                                else if (data[i].status ==='Terminado')
                                {
                                    statusfinal ="<a class='terminado' href='/downloadimages/"+  data[i].numorder +"'>Terminado</a>";
                                }
                                else if (data[i].status ==='Entregado')
                                {
                                    statusfinal ="<a class='entregado' href=''>Entregado</a>";
                                }
                                else
                                {
                                    statusfinal =data[i].status;
                                }

                                var row = $("<tr>");
                                row.append($("<td>" + data[i].numorder + "</td>"))
                                     .append($("<td>" + data[i].imagecount + "</td>"))
                                     .append($("<td>" + toDateString(data[i].date) + "</td>"))
                                     .append($("<td>" + statusfinal + "</td>"));
                                $("#orderstable tbody").append(row);
                            }
                              

                        }
                    });
                    $.ajax({
                        type: 'get',
                        url: '/listspecs/5',
                        success: function (data) {
                            console.log(data);
                            for (var i = 0; i < data.length; i++){

                                if (data[i].typespec == 'free'){
                                    document.location.href="/chooseanimage?specid=" + data[i]._id;
                                    break;
                                }
                                var row = $("<tr>");
                                row.append($("<td>" + data[i].name + "</td>"))
                                     .append($("<td>" + toDateString(data[i].date) + "</td>"))
                                     .append($("<td>" + setDecimals(data[i].totalprice,2) + "</td>"))
                                     .append( $('<td><a id="icontable" href="/uploadimages/'+ data[i]._id +'"><img src="../images/icon_cloud.png" height="20px" width="20px"></a><a id="icontable"  href="/especificaciones2/'+ data[i]._id + '"><img src="../images/icon_edit.png" height="20px" width="20px"></a></td>'));
                                $("#specstable tbody").append(row);
                            }
                              

                        }
                    });

            });
