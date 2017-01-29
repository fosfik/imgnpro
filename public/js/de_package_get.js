$(document).ready(function(){
    var ajaxUrl = '/listorderpack/' + $('#packageid').val();
    console.log(ajaxUrl);
    $.ajax({
        type: 'get',
        url: ajaxUrl,
        success: function (data) {
            // console.log(data[0]);
            // console.log(data.images);
            $.getJSON('/findaorder/' + data[0].numorder).done(function(order) {
                        if (order) {
                        //console.log(order);
                            $("#specLink").attr("href","/de_especificaciones2/" + order.specid );
                        }
            });      
            $.each(data, function(index, value) {
                // console.log(value);
                $.each(value.images, function(index, valueimg) {
                    // console.log(valueimg);

                    var params = {
                        filename: valueimg.imagename,
                        userid: value.userid
                    };
                    $.getJSON('/sign-s3get', params).done(function(data) {
                                                //console.log(data);
                        var url ='';
                        var urlthumb ='';
                        if (data.signedRequest) {
                            url = data.signedRequest;
                            urlthumb = data.signedthumbRequest;
                        }
                        var row = $("<tr>");
                        row.append($("<td>" + value.numorder + "</td>"))
                                .append($("<td>" + value.name + "</td>"))
                                .append($("<td><a href='" + url + "' download>" + valueimg.imagename + "</a></td>"))
                                .append($("<td><img src='" + urlthumb + "'></td>"));       

                                
                        $("#orderstable tbody").append(row);

                    });
                    

                });
            }); 
        }
    });
});