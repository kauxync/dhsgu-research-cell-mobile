const db = require('../config/db');

exports.getAllProposals = async (req, res) => {
  try {
    const { status, search } = req.query;

    if (db.isLiveDbConnected()) {
      let sql = `
        SELECT pp.*, r.name AS principal_investigator_name, d.name AS department_name
        FROM project_proposals pp
        JOIN researchers r ON pp.principal_investigator_id = r.id
        LEFT JOIN departments d ON r.department_id = d.id
        WHERE 1=1
      `;
      const params = [];

      if (status) {
        sql += ` AND pp.approval_status = ?`;
        params.push(status);
      }
      if (search) {
        sql += ` AND (pp.title LIKE ? OR pp.funding_agency LIKE ? OR r.name LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      sql += ` ORDER BY pp.submission_date DESC`;

      const rows = await db.query(sql, params);
      return res.json({ success: true, count: rows.length, data: rows });
    }

    let list = db.mockStore.proposals;
    if (status) {
      list = list.filter(p => p.approval_status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.funding_agency.toLowerCase().includes(q) ||
        p.principal_investigator_name.toLowerCase().includes(q)
      );
    }
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createProposal = async (req, res) => {
  try {
    const {
      title,
      principal_investigator_id,
      co_investigators,
      funding_agency,
      budget_requested,
      duration_months
    } = req.body;

    if (!title || !principal_investigator_id || !funding_agency || !budget_requested) {
      return res.status(400).json({ success: false, message: 'Missing required proposal fields' });
    }

    const today = new Date().toISOString().split('T')[0];

    if (db.isLiveDbConnected()) {
      const result = await db.query(
        `INSERT INTO project_proposals (title, principal_investigator_id, co_investigators, funding_agency, budget_requested, duration_months, submission_date, approval_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'Under Review')`,
        [title, principal_investigator_id, co_investigators || '', funding_agency, budget_requested, duration_months || 24, today]
      );
      return res.status(201).json({ success: true, message: 'Proposal submitted for Research Cell review', id: result.insertId });
    }

    const pi = db.mockStore.researchers.find(r => r.id === Number(principal_investigator_id));
    const newProposal = {
      id: db.mockStore.proposals.length + 1,
      title,
      principal_investigator_id: Number(principal_investigator_id),
      principal_investigator_name: pi ? pi.name : 'Unknown Faculty',
      co_investigators: co_investigators || 'None',
      funding_agency,
      budget_requested: Number(budget_requested),
      duration_months: Number(duration_months) || 24,
      submission_date: today,
      approval_status: 'Under Review',
      review_comments: 'Initial submission received. Internal research cell review pending.'
    };

    db.mockStore.proposals.unshift(newProposal);
    res.status(201).json({ success: true, message: 'Proposal submitted successfully', data: newProposal });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateProposalStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { approval_status, review_comments } = req.body;

    if (!approval_status) {
      return res.status(400).json({ success: false, message: 'approval_status is required' });
    }

    if (db.isLiveDbConnected()) {
      await db.query(
        `UPDATE project_proposals SET approval_status = ?, review_comments = ? WHERE id = ?`,
        [approval_status, review_comments || null, id]
      );
      return res.json({ success: true, message: `Proposal status updated to ${approval_status}` });
    }

    const proposal = db.mockStore.proposals.find(p => p.id === id);
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    proposal.approval_status = approval_status;
    if (review_comments) proposal.review_comments = review_comments;

    res.json({ success: true, message: `Proposal status updated to ${approval_status}`, data: proposal });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

