const db = require('../config/db');

exports.getAllResearchers = async (req, res) => {
  try {
    const { department, search } = req.query;

    if (db.isLiveDbConnected()) {
      let sql = `
        SELECT r.*, d.name AS department_name, d.code AS department_code
        FROM researchers r
        LEFT JOIN departments d ON r.department_id = d.id
        WHERE 1=1
      `;
      const params = [];

      if (department) {
        sql += ` AND (d.code = ? OR d.name LIKE ?)`;
        params.push(department, `%${department}%`);
      }
      if (search) {
        sql += ` AND (r.name LIKE ? OR r.specialization LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }
      sql += ` ORDER BY r.citations_count DESC`;

      const rows = await db.query(sql, params);
      return res.json({ success: true, count: rows.length, data: rows });
    }

    let list = db.mockStore.researchers;
    if (department) {
      list = list.filter(r => 
        r.department_name.toLowerCase().includes(department.toLowerCase())
      );
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => 
        r.name.toLowerCase().includes(q) || r.specialization.toLowerCase().includes(q)
      );
    }
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getResearcherById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (db.isLiveDbConnected()) {
      const [researcher] = await db.query(
        `SELECT r.*, d.name AS department_name, d.code AS department_code 
         FROM researchers r 
         LEFT JOIN departments d ON r.department_id = d.id 
         WHERE r.id = ?`,
        [id]
      );
      if (!researcher) {
        return res.status(404).json({ success: false, message: 'Researcher not found' });
      }

      const publications = await db.query(
        `SELECT * FROM publications WHERE researcher_id = ? ORDER BY publication_year DESC`,
        [id]
      );
      const patents = await db.query(
        `SELECT * FROM patents WHERE inventor_id = ? ORDER BY filing_date DESC`,
        [id]
      );
      const proposals = await db.query(
        `SELECT * FROM project_proposals WHERE principal_investigator_id = ? ORDER BY submission_date DESC`,
        [id]
      );

      return res.json({
        success: true,
        data: {
          ...researcher,
          publications,
          patents,
          proposals
        }
      });
    }

    const researcher = db.mockStore.researchers.find(r => r.id === id);
    if (!researcher) {
      return res.status(404).json({ success: false, message: 'Researcher not found' });
    }

    const publications = db.mockStore.publications.filter(p => p.researcher_id === id);
    const patents = db.mockStore.patents.filter(p => p.inventor_id === id);
    const proposals = db.mockStore.proposals.filter(p => p.principal_investigator_id === id);

    res.json({
      success: true,
      data: {
        ...researcher,
        publications,
        patents,
        proposals
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createResearcher = async (req, res) => {
  try {
    const { name, email, phone, department_id, designation, specialization, bio, orcid_id, scopus_id } = req.body;

    if (!name || !email || !designation) {
      return res.status(400).json({ success: false, message: 'Name, email, and designation are required' });
    }

    if (db.isLiveDbConnected()) {
      const result = await db.query(
        `INSERT INTO researchers (name, email, phone, department_id, designation, specialization, bio, orcid_id, scopus_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, email, phone || null, department_id || 1, designation, specialization || '', bio || '', orcid_id || '', scopus_id || '']
      );
      return res.status(201).json({ success: true, message: 'Researcher created', id: result.insertId });
    }

    const newResearcher = {
      id: db.mockStore.researchers.length + 1,
      name,
      email,
      phone: phone || '',
      department_id: department_id || 1,
      department_name: 'Computer Science & Engineering',
      designation,
      specialization: specialization || '',
      h_index: 0,
      citations_count: 0,
      orcid_id: orcid_id || '',
      scopus_id: scopus_id || '',
      bio: bio || '',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    };

    db.mockStore.researchers.push(newResearcher);
    res.status(201).json({ success: true, message: 'Researcher profile created', data: newResearcher });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

