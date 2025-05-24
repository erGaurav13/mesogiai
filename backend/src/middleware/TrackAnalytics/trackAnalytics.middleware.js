const {AnalyticsModel} = require('../../model/index.model');
const mongoose = require('mongoose');
const trackAnalytics = (eventType) => {
  return async (req, res, next) => {
    // Don't await the analytics tracking - make it non-blocking
    console.log("req")
    try {
      const caseStudyId = req.params.id;
      const visitorIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                  const _id = new mongoose.Types.ObjectId().toString(); 
      
      // Fire-and-forget the analytics tracking
      AnalyticsModel.create({
        _id,
        caseStudyId,
        userId: req.user?.id || null,
        visitorIP,
        event: eventType,
        additionalData: req.body || {},
      }).catch(err => {
        console.error('Analytics tracking failed:', err.message);
      });
    } catch (err) {
      console.error('Error setting up analytics tracking:', err.message);
    }
    
    // Continue to the next middleware immediately
    next();
  };
};

module.exports = trackAnalytics;