const auth = require('./AuthMiddleware/auth.middleware');
const trackAnalytics=require("./TrackAnalytics/trackAnalytics.middleware")
const UploadImage = require('./ImageUpload/imageUpload')
module.exports = { auth ,trackAnalytics,UploadImage};
