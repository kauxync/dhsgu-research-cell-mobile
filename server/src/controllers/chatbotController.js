const db = require('../config/db');

exports.handleChatMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const queryText = message.toLowerCase();

    // 1. Semantic match for Faculty / Researcher inquiry
    if (queryText.includes('who') || queryText.includes('faculty') || queryText.includes('expert') || queryText.includes('professor') || queryText.includes('specialist') || queryText.includes('researcher')) {
      const researchers = db.mockStore.researchers;
      const matched = researchers.filter(r => 
        queryText.includes(r.name.toLowerCase().split(' ')[1]?.toLowerCase() || '') ||
        queryText.split(' ').some(word => word.length > 3 && r.specialization.toLowerCase().includes(word)) ||
        r.department_name.toLowerCase().includes(queryText.includes('cse') ? 'computer' : queryText.includes('bio') ? 'bio' : queryText.includes('ece') ? 'electronics' : queryText.includes('mech') ? 'mechanical' : '____')
      );

      if (matched.length > 0) {
        const top = matched[0];
        return res.json({
          success: true,
          reply: `🎓 **Researcher Match:** **${top.name}** (${top.designation} in ${top.department_name}).\n\n📌 **Specialization:** ${top.specialization}\n📊 **Metrics:** H-Index: ${top.h_index} | Citations: ${top.citations_count}\n📧 **Contact:** ${top.email}`,
          suggestedActions: ['View Researcher Profile', 'See Publications', 'Submit Joint Proposal']
        });
      }
    }

    // 2. Grant / Funding Opportunities inquiry
    if (queryText.includes('grant') || queryText.includes('funding') || queryText.includes('scheme') || queryText.includes('money') || queryText.includes('serb') || queryText.includes('birac') || queryText.includes('drdo')) {
      const activeGrants = db.mockStore.funding;
      const listSummary = activeGrants.map((g, idx) => 
        `${idx + 1}. **${g.title}** (${g.agency_name})\n   • Max Amount: ₹${(g.grant_amount_max / 100000).toFixed(1)} Lakhs\n   • Deadline: ${g.deadline}\n   • Target: ${g.eligible_disciplines}`
      ).join('\n\n');

      return res.json({
        success: true,
        reply: `💰 **Active Funding & Grant Opportunities:**\n\n${listSummary}\n\n💡 *Tip: Check eligibility and submit proposals before deadlines.*`,
        suggestedActions: ['View All Grants', 'Check Eligibility', 'Draft Proposal']
      });
    }

    // 3. Proposal Status inquiry
    if (queryText.includes('proposal') || queryText.includes('status') || queryText.includes('approval') || queryText.includes('project')) {
      const proposals = db.mockStore.proposals;
      const summary = proposals.map(p => 
        `• **#${p.id} ${p.title}**\n  PI: ${p.principal_investigator_name} | Status: **${p.approval_status}** | Budget: ₹${(p.budget_requested / 100000).toFixed(1)}L`
      ).join('\n\n');

      return res.json({
        success: true,
        reply: `📋 **Current University Project Proposals:**\n\n${summary}`,
        suggestedActions: ['Submit New Proposal', 'View Proposal Details', 'Download Formats']
      });
    }

    // 4. Patent and IP inquiry
    if (queryText.includes('patent') || queryText.includes('ip') || queryText.includes('intellectual property') || queryText.includes('filing')) {
      const patents = db.mockStore.patents;
      const patentList = patents.map(p => 
        `• **${p.patent_number}** - *${p.title}*\n  Inventor: ${p.inventor_name} | Status: **${p.status}** (${p.jurisdiction})`
      ).join('\n\n');

      return res.json({
        success: true,
        reply: `⚖️ **University Patent & IP Registry:**\n\n${patentList}\n\nTo file a new patent disclosure through the University IP Cell, navigate to the **Publications & IP** tab and tap **Register Patent**.`,
        suggestedActions: ['Register Patent', 'Download IPR Form', 'Contact Dean R&D']
      });
    }

    // 5. Conference / Seminar inquiry
    if (queryText.includes('conference') || queryText.includes('seminar') || queryText.includes('icra') || queryText.includes('ieee')) {
      const confs = db.mockStore.conferences;
      const confList = confs.map(c => 
        `• **${c.name}**\n  Org: ${c.organized_by} | Date: ${c.conference_date} (${c.mode}) | Deadline: ${c.submission_deadline}`
      ).join('\n\n');

      return res.json({
        success: true,
        reply: `🌐 **Upcoming Academic Conferences:**\n\n${confList}`,
        suggestedActions: ['View Conferences', 'Submit Abstract', 'Travel Grant Request']
      });
    }

    // General fallback
    return res.json({
      success: true,
      reply: `🤖 **Research Cell AI Assistant**\n\nI can help you with:\n1. 🔍 Finding faculty & research labs by expertise (e.g. *"Who works on IoT?"*)\n2. 💰 Tracking funding schemes & grants (e.g. *"Show active SERB grants"*)\n3. 📑 Checking project proposal approvals (e.g. *"Proposal status"*)\n4. ⚖️ Searching patents and published papers\n5. 🌐 Looking up upcoming conference deadlines\n\nHow may I assist your research today?`,
      suggestedActions: ['Explore Faculty', 'Show Active Grants', 'Check Proposals', 'Search Patents']
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

