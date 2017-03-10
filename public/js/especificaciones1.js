$(document).ready(function(){
        $(document).ajaxStart(function(){
            //$('#divload').show();
            window.location="#divload";
        });
        $( document ).ajaxStop(function() {
            $('#divload').hide();
        });
        $.ajax({
            type: 'get',
            url: '/listspecs',
            success: function (data) {
                for (var i = 0; i < data.length; i++){
                    var row = $("<tr>");
                    row.append($("<td>" + data[i].name + "</td>"))
                            .append($("<td>" + toDateString(data[i].date) + "</td>"))
                            .append($("<td>" + setDecimals(data[i].totalprice,2) + "</td>"))
                            .append( $('<td><a id="icontable" href="/uploadimages/'+ data[i]._id + '"><img src="../images/icon_cloud.png" height="20px" width="20px"></a><a id="icontable"  href="/especificaciones2/'+ data[i]._id + '"><img src="../images/icon_edit.png" height="20px" width="20px"></a></td>'));
                    $("#specstable tbody").append(row);
                }
            }
        });
});
