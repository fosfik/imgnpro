function toDateString(date){
  var dateformat = '';
  var d = new Date(date);
  dateformat = String('00' + d.getDate()).slice(-2) + '/' + String('00' + d.getMonth()).slice(-2)+ '/' + d.getFullYear();
  return dateformat;
}