const express = require('express');
const router = express.Router();

const researcherController = require('../controllers/researcherController');
const publicationController = require('../controllers/publicationController');
const proposalController = require('../controllers/proposalController');
const fundingController = require('../controllers/fundingController');
const statsController = require('../controllers/statsController');
const chatbotController = require('../controllers/chatbotController');

// Stats
router.get('/stats', statsController.getDashboardStats);

// Researchers
router.get('/researchers', researcherController.getAllResearchers);
router.get('/researchers/:id', researcherController.getResearcherById);
router.post('/researchers', researcherController.createResearcher);

// Publications & Patents
router.get('/publications', publicationController.getAllPublications);
router.post('/publications', publicationController.createPublication);
router.get('/patents', publicationController.getAllPatents);
router.post('/patents', publicationController.createPatent);

// Project Proposals
router.get('/proposals', proposalController.getAllProposals);
router.post('/proposals', proposalController.createProposal);
router.patch('/proposals/:id/status', proposalController.updateProposalStatus);

// Funding & Conferences
router.get('/funding', fundingController.getAllFunding);
router.get('/conferences', fundingController.getAllConferences);
router.get('/notifications', fundingController.getNotifications);

// AI Chatbot
router.post('/chat', chatbotController.handleChatMessage);

module.exports = router;

