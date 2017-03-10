$(document).ready(function(){
        $.ajax({
            type: 'get',
            url: '/listallorderpacks/' + $('#numorderidInput').val(),
            success: function (data) {
                for (var i = 0; i < data.length; i++){
                    console.log(data[i]._id);
                    $.ajax({
                        type: 'get',
                        url: '/listorderpack/' + data[i]._id,
                        success: function (data) {
                            // console.log(data[0]);
                            // console.log(data.images);
                            $.getJSON('/findaorder/' + $('#numorderidInput').val() ).done(function(order) {
                                        if (order) {
                                        //console.log(order);
                                            //$("#specLink").attr("href","/de_especificaciones2/" + order.specid );
                                            $("#imageCount").html(order.imagecount);
                                        }
                            });

                            
                            $.each(data, function(index, value) {
                                // console.log(value);
                                $.each(value.images, function(index, valueimg) {
                                    // console.log(valueimg);
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
                                                .append($("<td><a href='" + url + "' download>" + revimagename + "</a></td>"))
                                                .append($("<td><img src='" + urlthumb + "'></td>"));       
                                        $("#orderstable tbody").append(row);

                                    });
                                });
                            }); 
                        }
                    });
                }
            }
        });
});