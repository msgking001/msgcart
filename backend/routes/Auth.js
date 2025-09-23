const express= require('express');  
const { registeruser,
     loginuser,logoutuser,
      forgotPassword, 
      resetPassword, 
      getUserProfile, 
      changePassword,
      updateProfile,
      getAllUser,
      getUser,
      UpdateUser,
      DeleteUser} = require('../controllers/Authcontroller');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/authenticate');
const router= express.Router();
router.post('/register', registeruser);
router.post('/login', loginuser);
router.route('/logout').get(logoutuser); // Assuming you want to log out the user
router.route('/password/forget').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);
router.route('/myprofile').get(isAuthenticatedUser,getUserProfile);
router.route('/password/change').put(isAuthenticatedUser,changePassword);
router.route('/update').put(isAuthenticatedUser,updateProfile);

//Admin-routes
router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'),getAllUser);
router.route('/admin/users/:id').get(isAuthenticatedUser,authorizeRoles('admin'),getUser);
router.route('/admin/users/:id').put(isAuthenticatedUser,authorizeRoles('admin'),UpdateUser);
router.route('/admin/users/:id').delete(isAuthenticatedUser,authorizeRoles('admin'),DeleteUser);


module.exports=router;