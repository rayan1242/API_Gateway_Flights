 const express = require('express');

 const router = express.Router();
const { AuthRequestMiddlewares } = require('../../middlewares')
 const { InfoController } = require('../../controllers');
 const userRoutes = require('./user-routes');

 router.use('/user',
                    userRoutes);
 router.get('/info',
                    AuthRequestMiddlewares.checkAuth,
                    InfoController.info);

 module.exports = router;



