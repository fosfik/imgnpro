var paypal = require('paypal-rest-sdk');

var MODE_PAYPAL = process.env.MODE_PAYPAL || 'sandbox';
var CLIENT_ID_PAYPAL = process.env.CLIENT_ID_PAYPAL || 'AcF4GRqVpVBcdcmTSv-VJV3atX7nmF-VRekmP1HcfiLl2MjpuY_rZRlAW3DOsvzkfXuY-fAR2eoq29Hu';
var CLIENT_SECRET_PAYPAL = process.env.CLIENT_SECRET_PAYPAL|| 'ENLjgr2YzyBGvTEpd5blrjlwYZW4Jl3D-4yLcdLEHqIM2dtgwdRSxoKwEud-u7PGoGaP3IpWg7z6bglZ';

paypal.configure({
    'mode': MODE_PAYPAL , //sandbox or live
    'client_id': CLIENT_ID_PAYPAL,
    'client_secret': CLIENT_SECRET_PAYPAL,
    'headers' : {
		'custom': 'header'
    }
});


// paypal.configure({
//     'mode': MODE_PAYPAL , //sandbox or live
//     'client_id': 'Af5WhdPkRt5p0lXDvxR2giABWC0mywVuk2Azh3sbFcNoiv29fKJY3EsHve3I_ZEOF6BnId7pAN1fdIZy',
//     'client_secret': 'EIXf-8I03oSDxsI8Ebfv5MKcFEV1zYTbwZ9kYRU6SUUJdSzLq2NWaLNXPw-Bpnc_fL6sLjLBtlvyIAfG',
//     'headers' : {
// 		'custom': 'header'
//     }
// });


// paypal.configure({
//     'mode': 'sandbox', //sandbox or live
//     'client_id': 'AcF4GRqVpVBcdcmTSv-VJV3atX7nmF-VRekmP1HcfiLl2MjpuY_rZRlAW3DOsvzkfXuY-fAR2eoq29Hu',
//     'client_secret': 'ENLjgr2YzyBGvTEpd5blrjlwYZW4Jl3D-4yLcdLEHqIM2dtgwdRSxoKwEud-u7PGoGaP3IpWg7z6bglZ',
//     'headers' : {
// 		'custom': 'header'
//     }
// });



