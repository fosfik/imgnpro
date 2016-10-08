function toDateString(date){
  var dateformat = '';
  var d = new Date(date);
  dateformat = String('00' + d.getDate()).slice(-2) + '/' + String('00' + d.getMonth()).slice(-2)+ '/' + d.getFullYear();
  return dateformat;
}

function setDecimals(sVal, nDec){ 
	var n = parseFloat(sVal); 
	var s = "0.00"; 
	if (!isNaN(n)){ 
	 n = Math.round(n * Math.pow(10, nDec)) / Math.pow(10, nDec); 
	 s = String(n); 
	 s += (s.indexOf(".") == -1? ".": "") + String(Math.pow(10, nDec)).substr(1); 
	 s = s.substr(0, s.indexOf(".") + nDec + 1); 
	} 
	return s; 
} 
function isNotNullUndefined(param){
	// var bResult = false;
	// if (param !== null && param !== undefined){
	// 	bResult =
	// }
	return ( (param !== null && param !== undefined) ? true:false);
}

function fillzero(param,pattern){
	return (pattern + param).slice(-7);

}

function normFileName(filename){
	return filename.replace(/\s/g, "+");
}