$(document).ready(function(){
    $.ajax({
        type: 'get',
        url: '/listallorderpacksfinish',
        success: function (data) {
            for (var i = 0; i < data.length; i++){
                var row = $("<tr>");
                row.append($("<td>" + data[i].numorder + "</td>"))
                        .append($("<td>" + data[i].imagecount + "</td>"))
                        .append($("<td>" + data[i].date + "</td>"))
                        .append($("<td>" + data[i].status + "</td>"))
                        .append($("<td><a href='/de_package_get/" + data[i]._id + "'>" + data[i].name + "</a></td>"))
                        .append($("<td>" + data[i].userid + "</td>"))
                        .append($("<td>" + data[i].isworking + "</td>"))
                        .append($('<td><a id="icontable" href="/de_uploadimages/'+ data[i]._id +'"><img src="../images/icon_cloud.png" height="20px" width="20px"></a></td>'))
                        .append($("<td><a href='/de_package_review/" + data[i]._id + "'>Revisar paquete</a></td>"));
                $("#orderstable tbody").append(row);
            }
        }
    });
});