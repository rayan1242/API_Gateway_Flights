 const express = require ('express');

 const{ ServerConfig, Logger } = require('./config');
 const apiRoutes = require('./routes');
const rateLimit  = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
 const app = express();

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 3
})

 app.use(express.json());
 app.use(express.urlencoded({extended:true}));
 
 app.use(limiter);

 app.use('/flightService',createProxyMiddleware({
  target: ServerConfig.FLIGHT_SERVICE,
  changeOrigin: true,
  pathRewrite:{'^/flightService':'/'}
  }))
 app.use('/bookingService',createProxyMiddleware({
  target: ServerConfig.BOOKING_SERVICE,
  changeOrigin: true,
  pathRewrite:{'^/bookingService':'/'}

}))


 app.use('/api',apiRoutes);

 app.listen(ServerConfig.PORT,() =>{
   console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
   Logger.info("Successfully started the server",{});
})
 