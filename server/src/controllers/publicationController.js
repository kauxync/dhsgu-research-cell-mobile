const db = require('../config/db');

exports.getAllPublications = async (req, res) => {
  try {
    const { type, year, search } = req.query;

    if (db.isLiveDbConnected()) {
      let sql = `
        SELECT p.*, r.name AS researcher_name, d.name AS department_name
        FROM publications p
        JOIN researchers r ON p.researcher_id = r.id
        LEFT JOIN departments d ON r.department_id = d.id
        WHERE 1=1
      `;
      const params = [];

      if (type) {
        sql += ` AND p.type = ?`;
        params.push(type);
      }
      if (year) {
        sql += ` AND p.publication_year = ?`;
        params.push(year);
      }
      if (search) {
        sql += ` AND (p.title LIKE ? OR p.journal_or_publisher LIKE ? OR r.name LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      sql += ` ORDER BY p.publication_year DESC, p.citation_count DESC`;

      const rows = await db.query(sql, params);
      return res.json({ success: true, count: rows.length, data: rows });
    }

    let list = db.mockStore.publications;
    if (type) {
      list = list.filter(p => p.type.toLowerCase() === type.toLowerCase());
    }
    if (year) {
      list = list.filter(p => String(p.publication_year) === String(year));
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.journal_or_publisher.toLowerCase().includes(q) ||
        p.researcher_name.toLowerCase().includes(q)
      );
    }
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createPublication = async (req, res) => {
  try {
    const { title, researcher_id, type, journal_or_publisher, publication_year, doi, abstract, indexing } = req.body;

    if (!title || !researcher_id || !journal_or_publisher || !publication_year) {
      return res.status(400).json({ success: false, message: 'Missing required publication fields' });
    }

    if (db.isLiveDbConnected()) {
      const result = await db.query(
        `INSERT INTO publications (title, researcher_id, type, journal_or_publisher, publication_year, doi, abstract, indexing)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, researcher_id, type || 'Journal Paper', journal_or_publisher, publication_year, doi || null, abstract || null, indexing || 'Scopus']
      );
      return res.status(201).json({ success: true, message: 'Publication added', id: result.insertId });
    }

    const researcher = db.mockStore.researchers.find(r => r.id === Number(researcher_id));
    const newPub = {
      id: db.mockStore.publications.length + 1,
      title,
      researcher_id: Number(researcher_id),
      researcher_name: researcher ? researcher.name : 'Unknown Faculty',
      type: type || 'Journal Paper',
      journal_or_publisher,
      publication_year: Number(publication_year),
      doi: doi || '',
      abstract: abstract || '',
      indexing: indexing || 'Scopus / SCI',
      citation_count: 0,
      download_url: doi ? `https://doi.org/${doi}` : ''
    };

    db.mockStore.publications.unshift(newPub);
    res.status(201).json({ success: true, message: 'Publication added successfully', data: newPub });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllPatents = async (req, res) => {
  try {
    const { status, search } = req.query;

    if (db.isLiveDbConnected()) {
      let sql = `
        SELECT pt.*, r.name AS inventor_name, d.name AS department_name
        FROM patents pt
        JOIN researchers r ON pt.inventor_id = r.id
        LEFT JOIN departments d ON r.department_id = d.id
        WHERE 1=1
      `;
      const params = [];

      if (status) {
        sql += ` AND pt.status = ?`;
        params.push(status);
      }
      if (search) {
        sql += ` AND (pt.title LIKE ? OR pt.patent_number LIKE ? OR r.name LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      sql += ` ORDER BY pt.filing_date DESC`;

      const rows = await db.query(sql, params);
      return res.json({ success: true, count: rows.length, data: rows });
    }

    let list = db.mockStore.patents;
    if (status) {
      list = list.filter(pt => pt.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(pt => 
        pt.title.toLowerCase().includes(q) || 
        pt.patent_number.toLowerCase().includes(q) ||
        pt.inventor_name.toLowerCase().includes(q)
      );
    }
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createPatent = async (req, res) => {
  try {
    const { title, inventor_id, patent_number, filing_date, status, abstract, jurisdiction } = req.body;

    if (!title || !inventor_id || !patent_number || !filing_date) {
      return res.status(400).json({ success: false, message: 'Title, inventor ID, patent number, and filing date are required' });
    }

    if (db.isLiveDbConnected()) {
      const result = await db.query(
        `INSERT INTO patents (title, inventor_id, patent_number, filing_date, status, abstract, jurisdiction)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, inventor_id, patent_number, filing_date, status || 'Filed', abstract || '', jurisdiction || 'India / IPO']
      );
      return res.status(201).json({ success: true, message: 'Patent registered', id: result.insertId });
    }

    const researcher = db.mockStore.researchers.find(r => r.id === Number(inventor_id));
    const newPatent = {
      id: db.mockStore.patents.length + 1,
      title,
      inventor_id: Number(inventor_id),
      inventor_name: researcher ? researcher.name : 'Unknown Faculty',
      patent_number,
      filing_date,
      grant_date: status === 'Granted' ? new Date().toISOString().split('T')[0] : null,
      status: status || 'Filed',
      abstract: abstract || '',
      jurisdiction: jurisdiction || 'India / IPO'
    };

    db.mockStore.patents.unshift(newPatent);
    res.status(201).json({ success: true, message: 'Patent registered successfully', data: newPatent });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

