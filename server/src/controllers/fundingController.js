const db = require('../config/db');

exports.getAllFunding = async (req, res) => {
  try {
    const { status, search } = req.query;

    if (db.isLiveDbConnected()) {
      let sql = `SELECT * FROM funding_opportunities WHERE 1=1`;
      const params = [];

      if (status) {
        sql += ` AND status = ?`;
        params.push(status);
      }
      if (search) {
        sql += ` AND (title LIKE ? OR agency_name LIKE ? OR eligible_disciplines LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      sql += ` ORDER BY deadline ASC`;

      const rows = await db.query(sql, params);
      return res.json({ success: true, count: rows.length, data: rows });
    }

    let list = db.mockStore.funding;
    if (status) {
      list = list.filter(f => f.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(f => 
        f.title.toLowerCase().includes(q) || 
        f.agency_name.toLowerCase().includes(q) ||
        f.eligible_disciplines.toLowerCase().includes(q)
      );
    }
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllConferences = async (req, res) => {
  try {
    const { status, search } = req.query;

    if (db.isLiveDbConnected()) {
      let sql = `SELECT * FROM conferences WHERE 1=1`;
      const params = [];

      if (status) {
        sql += ` AND status = ?`;
        params.push(status);
      }
      if (search) {
        sql += ` AND (name LIKE ? OR organized_by LIKE ? OR location LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      sql += ` ORDER BY conference_date ASC`;

      const rows = await db.query(sql, params);
      return res.json({ success: true, count: rows.length, data: rows });
    }

    let list = db.mockStore.conferences;
    if (status) {
      list = list.filter(c => c.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.organized_by.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      );
    }
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    if (db.isLiveDbConnected()) {
      const rows = await db.query(`SELECT * FROM notifications ORDER BY created_at DESC LIMIT 20`);
      return res.json({ success: true, count: rows.length, data: rows });
    }

    res.json({ success: true, count: db.mockStore.notifications.length, data: db.mockStore.notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

