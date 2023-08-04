 const express = require('express');

 const router = express.Router();

 const { InfoController } = require('../../controllers');
 const userRoutes = require('./user-routes');

 router.use('/user',userRoutes);
 router.get('/info',InfoController.info);

 module.exports = router;



