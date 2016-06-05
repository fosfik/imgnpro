var config = {
	// Produccion
	facebook:{
		key:'1748473698730930',
		secret:'947279e657965fc061e89ff28bc0d4fe',
		callbackURL: 'https://imgnpro.herokuapp.com/login/facebook/return'
    },
	// Prueba
	// facebook:{
	// 	key:'1709249819339885',
	// 	secret:'4894456da8d734e0aa2685d202e9d489',
	// 	callbackURL: 'http://localhost:3000/login/facebook/return'
	// },
	cloudinary:{ 
        cloud_name: 'dmpmxfwwt', 
        api_key: '225134126558414', 
        api_secret: 'Fewu645wVZ_dGSN76IAYXgDt7m8' 
    }
};

module.exports = config;