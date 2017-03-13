
$(document).ready(function(){
                    $.ajax({
                        type: 'get',
                        url: '/listorders',
                        success: function (data) {
                            
                            for (var i = 0; i < data.length; i++){
                                
                                if (data[i].status !=='Por pagar')
                                {
                                    statusfinal ="<a id='icontable' href='/receipt/"+ data[i].numorder + "'><img src='../images/icon_doc.png' height='20px' width='20px'></a>";
                                }
                             
                                else
                                {
                                    statusfinal ="";
                                }

                                var row = $("<tr>");
                                row.append($("<td>" + data[i].numorder + "</td>"))
                                     .append($("<td>" + data[i].imagecount + "</td>"))
                                     .append($("<td>" + toDateString(data[i].date) + "</td>"))
                                     .append($("<td>" + data[i].status + "</td>"))
                                     .append($("<td>" + statusfinal + "</td>"))
                                $("#orderstable tbody").append(row);
                            }
                              

                        }
                    });
            });