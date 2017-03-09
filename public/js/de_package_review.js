
 $(document).ready(function(){

                    $.ajax({
                        type: 'get',
                        url: $('#packageidInput').val(),
                        success: function (data) {
                             console.log(data[0]);
                            $.getJSON('/findaorder/' + data[0].numorder).done(function(order) {
                                        if (order) {
                                        console.log(order);
                                            $("#specLink").attr("href","/de_especificaciones2/" + order.specid );
                                        }
                            });
                            $.each(data, function(index, value) {
                                $.each(value.images, function(index, valueimg) {

                                    var params = {
                                        filename: valueimg.imagename,
                                        userid: value.userid,
                                        orderpackid: value._id
                                    };
                                    $.getJSON('/sign-s3review', params).done(function(data) {
                                        var url ='';
                                        var urlthumb ='';
                                        var revimagename = '';
                                        if (data.signedRequest) {
                                            url = data.signedRequest;
                                            urlthumb = data.signedthumbRequest;
                                            revimagename = data.signedFileName;
                                        }
                                        var row = $("<tr>");
                                        row.append($("<td>" + value.numorder + "</td>"))
                                             .append($("<td>" + value.name + "</td>"))
                                             .append($("<td><a href='" + url + "' download>" + revimagename + "</a></td>"))
                                             .append($("<td><img src='" + urlthumb + "'></td>"));       

                                             
                                        $("#orderstable tbody").append(row);

                                    });
                                    

                                });
                            });                           

                        }
                    });

            });
