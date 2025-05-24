const authRoutes = require('./authRoutes/auth.routes');
const IssueRoutes = require('./issueRoutes/issue.routes');
const VoteRoutes = require('./voteRoutes/vote.routes');
const AnalyticsRoutes = require('./analyticsRoutes/analyticsRoutes')
module.exports = {
  authRoutes,
  IssueRoutes,
  VoteRoutes,
  AnalyticsRoutes
};
