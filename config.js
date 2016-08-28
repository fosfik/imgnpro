var express = require('express');
var app = express();
var config;

// se puede configurar npm el proxy
// npm config set proxy http://proxy.company:8080

if (app.get('env') !== 'development') {
 
 config = {
	// Produccion
	// facebook:{
	// 	key:'1748473698730930',
	// 	secret:'947279e657965fc061e89ff28bc0d4fe',
	// 	callbackURL: 'https://www.imgnpro.com/login/facebook/return'
	// }
	// facebook:{
	// 	key:'1569270823378058',
	// 	secret:'fb521481fdae215007b136a12905ff94',
	// 	callbackURL: 'https://www.imgnpro.com/login/facebook/return'
	// }

	facebook:{
		appname:'IMGN Pro',
		key:'1569270823378058',
		secret:'fb521481fdae215007b136a12905ff94',
		callbackURL: 'http://www.imgnpro.com/login/facebook/return'
	},
	google:{
		key:'812259967962-gcvtg69gr1grfhbhi09poagqmjb1gkrl.apps.googleusercontent.com',
		secret:'7naFjeqHyO1ZG6xEV8Vw9EYI',
		callbackURL: 'http://www.imgnpro.com/login/google/return'
	},
	prices:{

		// hasta el el dia de hoy:

		// $1.50 Recorte / Remover Fondo a Imagen

		// -Extras-

		// $0.55 Sombra Natural
		// $0.20 Drop Shadow
		// $0.40 Correction Color
		// $2.40 Clipping Path
		// $0.60 Retoque Básico
		cutandremove:1.50,
		naturalshadow:0.55,
		dropshadow:0.20,
		correctcolor:0.40,
		clippingpath:2.40,
		basicretouch:0.60
	}


	// // Prueba
	// // facebook:{
	// // 	key:'1709249819339885',
	// // 	secret:'4894456da8d734e0aa2685d202e9d489',
	// // 	callbackURL: 'http://localhost:3000/login/facebook/return'
	// // },
	// cloudinary:{ 
 //        cloud_name: 'dmpmxfwwt', 
 //        api_key: '225134126558414', 
 //        api_secret: 'Fewu645wVZ_dGSN76IAYXgDt7m8' 
 //    }
	};
}
else{
  config = {
	// Produccion
	// facebook:{
	// 	key:'1748473698730930',
	// 	secret:'947279e657965fc061e89ff28bc0d4fe',
	// 	callbackURL: 'http://localhost:3000/login/facebook/return'
	// }
	
	// // Prueba
	facebook:{
		appname:'Photomaker',
		key:'1709249819339885',
		secret:'4894456da8d734e0aa2685d202e9d489',
		callbackURL: 'http://localhost:3000/login/facebook/return'
	},
	google:{
		key:'812259967962-gcvtg69gr1grfhbhi09poagqmjb1gkrl.apps.googleusercontent.com',
		secret:'7naFjeqHyO1ZG6xEV8Vw9EYI',
		callbackURL: 'http://localhost:3000/login/google/return'
	},
	prices:{

		// hasta el el dia de hoy:

		// $1.50 Recorte / Remover Fondo a Imagen

		// -Extras-

		// $0.55 Sombra Natural
		// $0.20 Drop Shadow
		// $0.40 Correction Color
		// $2.40 Clipping Path
		// $0.60 Retoque Básico
		cutandremove:1.50,
		naturalshadow:0.55,
		dropshadow:0.20,
		correctcolor:0.40,
		clippingpath:2.40,
		basicretouch:0.60
	}
	//,







	// facebook:{
	// 	key:'1569270823378058',
	// 	secret:'fb521481fdae215007b136a12905ff94',
	// 	callbackURL: 'http://localhost:3000/login/facebook/return'
	// }
	//,
	// // Prueba
	// // facebook:{
	// // 	key:'1709249819339885',
	// // 	secret:'4894456da8d734e0aa2685d202e9d489',
	// // 	callbackURL: 'http://localhost:3000/login/facebook/return'
	// // },
	// cloudinary:{ 
 //        cloud_name: 'dmpmxfwwt', 
 //        api_key: '225134126558414', 
 //        api_secret: 'Fewu645wVZ_dGSN76IAYXgDt7m8' 
 //    }
	};
}



module.exports = config;