const auth = require('./AuthMiddleware/auth.middleware');
const trackAnalytics=require("./TrackAnalytics/trackAnalytics.middleware")
module.exports = { auth ,trackAnalytics};
