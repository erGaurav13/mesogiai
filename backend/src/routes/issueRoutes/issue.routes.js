const express = require('express');
const router = express.Router();
const { IssueController } = require('../../controller/index.controller');
const { auth } = require('../../middleware/index.middleware');
const { UploadImage } = require('../../middleware/index.middleware');

// Create Issue
router.post('/issues', auth, UploadImage.single('image'), (req, res) =>
  IssueController.createIssue(req, res),
);

router.get('/issues', (req, res) => IssueController.getIssues(req, res));

router.get('/issues/user', auth, (req, res) => IssueController.getUserIssues(req, res));

router.put('/issues/:id', auth,UploadImage.single('image'), (req, res) => IssueController.updateIssue(req, res));
router.get('/issues/:id', (req, res) => IssueController.getIssueById(req, res));

router.delete('/issues/:id', auth, (req, res) => IssueController.deleteIssue(req, res));
router.patch('/issues/:id/status', (req, res) => IssueController.changeIssueStatus(req, res));

module.exports = router;
