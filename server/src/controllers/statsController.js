const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    if (db.isLiveDbConnected()) {
      const resCount = await db.query(`SELECT COUNT(*) AS total_researchers FROM researchers`);
      const pubCount = await db.query(`SELECT COUNT(*) AS total_publications FROM publications`);
      const patCount = await db.query(`SELECT COUNT(*) AS total_patents FROM patents`);
      const propCount = await db.query(`SELECT COUNT(*) AS total_proposals FROM project_proposals`);
      const grantCount = await db.query(`SELECT COUNT(*) AS active_grants FROM funding_opportunities WHERE status = 'Active'`);
      const fundSum = await db.query(`SELECT COALESCE(SUM(budget_requested), 0) AS total_funding_approved FROM project_proposals WHERE approval_status IN ('Agency Approved', 'Research Cell Approved')`);

      const total_researchers = resCount && resCount[0] ? resCount[0].total_researchers : 0;
      const total_publications = pubCount && pubCount[0] ? pubCount[0].total_publications : 0;
      const total_patents = patCount && patCount[0] ? patCount[0].total_patents : 0;
      const total_proposals = propCount && propCount[0] ? propCount[0].total_proposals : 0;
      const active_grants = grantCount && grantCount[0] ? grantCount[0].active_grants : 0;
      const total_funding_approved = fundSum && fundSum[0] ? Number(fundSum[0].total_funding_approved) : 0;

      return res.json({
        success: true,
        data: {
          total_researchers,
          total_publications,
          total_patents,
          total_proposals,
          active_grants,
          total_funding_approved
        }
      });
    }

    const total_researchers = db.mockStore.researchers.length;
    const total_publications = db.mockStore.publications.length;
    const total_patents = db.mockStore.patents.length;
    const total_proposals = db.mockStore.proposals.length;
    const active_grants = db.mockStore.funding.filter(f => f.status === 'Active').length;
    const total_funding_approved = db.mockStore.proposals
      .filter(p => ['Agency Approved', 'Research Cell Approved'].includes(p.approval_status))
      .reduce((sum, p) => sum + p.budget_requested, 0);

    res.json({
      success: true,
      data: {
        total_researchers,
        total_publications,
        total_patents,
        total_proposals,
        active_grants,
        total_funding_approved
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
