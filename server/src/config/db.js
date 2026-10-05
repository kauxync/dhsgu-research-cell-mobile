const mysql = require('mysql2/promise');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config();

let pool = null;
let isConnected = false;

const mockStore = {
  departments: [
    { id: 1, name: 'Department of Computer Science & Applications (DCSA)', code: 'DCSA', head_of_department: 'Dr. Pangambam Sendash Singh' },
    { id: 2, name: 'Department of Physics', code: 'PHYS', head_of_department: 'Prof. M. S. Tiwari' },
    { id: 3, name: 'Department of Mathematics', code: 'MATH', head_of_department: 'Dr. Uttam Kumar Khedlekar' },
    { id: 4, name: 'Department of Chemistry', code: 'CHEM', head_of_department: 'Prof. A. P. Mishra' },
    { id: 5, name: 'Department of Botany', code: 'BOT', head_of_department: 'Prof. Mohammed Latif Khan' }
  ],
  researchers: [
    {
      id: 1,
      name: 'Dr. Pangambam Sendash Singh',
      email: 'pssingh@dhsgsu.edu.in',
      phone: '+91 94251 78901',
      department_id: 1,
      department_name: 'Department of Computer Science & Applications (DCSA)',
      designation: 'Assistant Professor & In-Charge, DCSA',
      specialization: 'Deep Learning, Hyperspectral Image Classification, Machine Learning & Remote Sensing',
      h_index: 15,
      citations_count: 620,
      orcid_id: '0000-0002-3490-5812',
      scopus_id: '57194829101',
      bio: 'Assistant Professor at DCSA, Dr. Harisingh Gour Vishwavidyalaya. Active researcher in computational intelligence, 3D-CNNs, deep feature extraction, and multispectral remote sensing.',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    },
    {
      id: 2,
      name: 'Dr. Kavita Sahu',
      email: 'kavita.sahu@dhsgsu.edu.in',
      phone: '+91 94254 12345',
      department_id: 1,
      department_name: 'Department of Computer Science & Applications (DCSA)',
      designation: 'Assistant Professor, DCSA',
      specialization: 'Software Reliability Engineering, Cloud Security, Machine Learning Predictive Modeling',
      h_index: 16,
      citations_count: 780,
      orcid_id: '0000-0001-8932-4411',
      scopus_id: '57201839204',
      bio: 'Assistant Professor in DCSA specializing in AI-driven software defect classification, cybersecurity in cloud networks, and medical decision support systems.',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    },
    {
      id: 3,
      name: 'Dr. Ranjit Rajak',
      email: 'ranjit.rajak@dhsgsu.edu.in',
      phone: '+91 98263 56789',
      department_id: 1,
      department_name: 'Department of Computer Science & Applications (DCSA)',
      designation: 'Assistant Professor, DCSA',
      specialization: 'Distributed Algorithms, Cloud Task Scheduling, Optimization & Parallel Computing',
      h_index: 12,
      citations_count: 430,
      orcid_id: '0000-0003-2194-7718',
      scopus_id: '57182940192',
      bio: 'Faculty member at DCSA research group focusing on dynamic resource allocation, genetic metaheuristics, and energy-aware cloud computing.',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    {
      id: 4,
      name: 'Neha Richhariya',
      email: 'neha.dcsa.phd@dhsgsu.edu.in',
      phone: '+91 91112 34567',
      department_id: 1,
      department_name: 'Department of Computer Science & Applications (DCSA)',
      designation: 'Ph.D. Research Scholar, DCSA',
      specialization: 'Natural Language Processing, Low-Resource Bundelkhandi-Hindi Speech & Text Corpus',
      h_index: 5,
      citations_count: 105,
      orcid_id: '0000-0002-1194-8833',
      scopus_id: '58102938471',
      bio: 'Doctoral scholar at DCSA working on Transformer-based neural speech processing and linguistic morphological models for Bundelkhand regional dialects.',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    },
    {
      id: 5,
      name: 'Prof. M. S. Tiwari',
      email: 'mstiwari@dhsgsu.edu.in',
      phone: '+91 94251 22334',
      department_id: 2,
      department_name: 'Department of Physics',
      designation: 'Senior Professor, Dept. of Physics',
      specialization: 'Plasma Physics, Kinetic Alfvén Waves, Magnetosphere-Ionosphere Electrodynamics',
      h_index: 28,
      citations_count: 2650,
      orcid_id: '0000-0002-9912-3341',
      scopus_id: '70048291032',
      bio: 'Eminent Senior Professor of Physics at DHSGSU Sagar with international recognition in space plasma dynamics, kinetic Alfvén wave particle acceleration, and ionosphere modeling.',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    },
    {
      id: 6,
      name: 'Dr. Maheswar Panda',
      email: 'mpanda@dhsgsu.edu.in',
      phone: '+91 94251 33455',
      department_id: 2,
      department_name: 'Department of Physics',
      designation: 'Assistant Professor, Dept. of Physics',
      specialization: 'Polymer Nanocomposites, Dielectric & Ferroelectric Materials, Supercapacitors',
      h_index: 22,
      citations_count: 1920,
      orcid_id: '0000-0001-7721-6543',
      scopus_id: '55928103940',
      bio: 'Assistant Professor in Physics leading the Advanced Materials & Dielectrics Lab with high-impact publications in PVDF nanocomposite energy storage devices.',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    },
    {
      id: 7,
      name: 'Dr. Dhananjay Kumar Gaur',
      email: 'dkgaur@dhsgsu.edu.in',
      phone: '+91 98270 44556',
      department_id: 2,
      department_name: 'Department of Physics',
      designation: 'Assistant Professor, Dept. of Physics',
      specialization: 'Soft Condensed Matter Physics, Liquid Crystals, Colloidal Self-Assembly',
      h_index: 14,
      citations_count: 590,
      orcid_id: '0000-0003-4412-9018',
      scopus_id: '57199401823',
      bio: 'Specialist in electro-optical phase switching, liquid crystal nanosuspensions, and polarized microscopy at the School of Mathematical & Physical Sciences.',
      avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
    },
    {
      id: 8,
      name: 'Vivek Kumar Mishra',
      email: 'vivek.phys.phd@dhsgsu.edu.in',
      phone: '+91 97551 12233',
      department_id: 2,
      department_name: 'Department of Physics',
      designation: 'Ph.D. Research Scholar, Physics',
      specialization: '2D Materials, Thin Film Solar Cells, Transition Metal Dichalcogenides (TMDs)',
      h_index: 6,
      citations_count: 125,
      orcid_id: '0000-0002-8831-2940',
      scopus_id: '58201948201',
      bio: 'Ph.D. fellow conducting research on chemical vapor deposition (CVD) synthesis of MoS2 and WS2 monolayer films for photovoltaic cell efficiency.',
      avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
    },
    {
      id: 9,
      name: 'Dr. Uttam Kumar Khedlekar',
      email: 'ukkhedlekar@dhsgsu.edu.in',
      phone: '+91 94251 44556',
      department_id: 3,
      department_name: 'Department of Mathematics',
      designation: 'Assistant Professor & Head, Mathematics',
      specialization: 'Inventory Management, Supply Chain Coordination, Mathematical Modeling of Deteriorating Items',
      h_index: 24,
      citations_count: 2040,
      orcid_id: '0000-0002-6631-9042',
      scopus_id: '36718294012',
      bio: 'Leading researcher in applied mathematics and operational research at DHSGSU, focusing on multi-echelon supply chain logistics and dynamic pricing policies.',
      avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'
    },
    {
      id: 10,
      name: 'Dr. Shivani Khare',
      email: 'shivani.khare@dhsgsu.edu.in',
      phone: '+91 98261 66778',
      department_id: 3,
      department_name: 'Department of Mathematics',
      designation: 'Assistant Professor, Dept. of Mathematics',
      specialization: 'Mathematical Epidemiology, Nonlinear Dynamical Systems, Infectious Disease Modeling',
      h_index: 17,
      citations_count: 920,
      orcid_id: '0000-0001-9482-1102',
      scopus_id: '56920194820',
      bio: 'Assistant Professor specializing in fractional-order SEIR disease transmission models, bifurcation theory, and epidemiological control strategies.',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
    },
    {
      id: 11,
      name: 'Dr. Triloki Nath Gupta',
      email: 'tngupta@dhsgsu.edu.in',
      phone: '+91 94254 77889',
      department_id: 3,
      department_name: 'Department of Mathematics',
      designation: 'Assistant Professor, Dept. of Mathematics',
      specialization: 'Optimization Theory, Multi-Objective Mathematical Programming, Variational Inequalities',
      h_index: 15,
      citations_count: 660,
      orcid_id: '0000-0003-8812-4590',
      scopus_id: '57102938471',
      bio: 'Expert in nonsmooth optimization, duality theorems, and vector variational inequality algorithms.',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    {
      id: 12,
      name: 'Amit Shukla',
      email: 'amit.math.phd@dhsgsu.edu.in',
      phone: '+91 93012 34567',
      department_id: 3,
      department_name: 'Department of Mathematics',
      designation: 'Ph.D. Research Scholar, Mathematics',
      specialization: 'Stochastic Operations Research, Fuzzy Optimization, Green Supply Networks',
      h_index: 4,
      citations_count: 75,
      orcid_id: '0000-0002-4491-0021',
      scopus_id: '58301928471',
      bio: 'Doctoral candidate analyzing stochastic inventory control under carbon emission constraints and inflationary macroeconomic parameters.',
      avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
    },
    {
      id: 13,
      name: 'Prof. A. P. Mishra',
      email: 'apmishra@dhsgsu.edu.in',
      phone: '+91 94251 55667',
      department_id: 4,
      department_name: 'Department of Chemistry',
      designation: 'Professor & Head / Dean Chemical Sciences',
      specialization: 'Coordination Chemistry, Schiff Base Metal Complexes, Bio-Inorganic & Antimicrobial Materials',
      h_index: 33,
      citations_count: 3520,
      orcid_id: '0000-0002-1209-8832',
      scopus_id: '66029384710',
      bio: 'Senior Professor and Dean of Chemical Sciences with over 30 years of research in synthesis, structural characterization, DNA binding, and cytotoxic screening of metal complexes.',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    },
    {
      id: 14,
      name: 'Prof. Ratnesh Das',
      email: 'ratnesh.das@dhsgsu.edu.in',
      phone: '+91 94251 66778',
      department_id: 4,
      department_name: 'Department of Chemistry',
      designation: 'Professor, Dept. of Chemistry',
      specialization: 'Computational Chemistry, Density Functional Theory (DFT), Electrochemistry & Medicinal Drug Design',
      h_index: 30,
      citations_count: 3010,
      orcid_id: '0000-0001-5582-7719',
      scopus_id: '55910293841',
      bio: 'Professor of Chemistry with extensive research output in molecular docking, DFT calculations for anticancer heterocyclic compounds, and electrochemical nanosensors.',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    },
    {
      id: 15,
      name: 'Dr. K. B. Joshi',
      email: 'kbjoshi@dhsgsu.edu.in',
      phone: '+91 98263 77889',
      department_id: 4,
      department_name: 'Department of Chemistry',
      designation: 'Assistant Professor, Dept. of Chemistry',
      specialization: 'Bio-Organic Chemistry, Peptide Self-Assembly, Nanotechnology & Targeted Therapeutics',
      h_index: 25,
      citations_count: 2240,
      orcid_id: '0000-0003-7712-4490',
      scopus_id: '24831920481',
      bio: 'Humboldt fellow and Assistant Professor investigating self-assembling peptide hydrogels, peptide nanotubes, and smart injectable therapeutic scaffolds.',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    },
    {
      id: 16,
      name: 'Deepali Sharma',
      email: 'deepali.chem.phd@dhsgsu.edu.in',
      phone: '+91 91791 23456',
      department_id: 4,
      department_name: 'Department of Chemistry',
      designation: 'Ph.D. Research Scholar, Chemistry',
      specialization: 'Green Nanocatalysis, Heterocyclic Synthesis, Magnetic Nanocomposites',
      h_index: 7,
      citations_count: 155,
      orcid_id: '0000-0002-3910-4491',
      scopus_id: '58401928471',
      bio: 'Ph.D. researcher developing environmentally benign magnetic core-shell Fe3O4@ZnO nanocatalysts for solvent-free multi-component reactions.',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    },
    {
      id: 17,
      name: 'Prof. Mohammed Latif Khan',
      email: 'mlkhan@dhsgsu.edu.in',
      phone: '+91 94251 88991',
      department_id: 5,
      department_name: 'Department of Botany',
      designation: 'Senior Professor (HAG Grade), Dept. of Botany',
      specialization: 'Conservation Biology, Forest Ecology, Biodiversity Assessment, Climate Resilience',
      h_index: 45,
      citations_count: 8100,
      orcid_id: '0000-0002-7712-9901',
      scopus_id: '66038472910',
      bio: 'Senior Professor (HAG) in Botany and Environmental Sciences, recipient of President of India Visitor Award and ranked in global top 2% scientists by Stanford University.',
      avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'
    },
    {
      id: 18,
      name: 'Prof. P. K. Khare',
      email: 'pkkhare@dhsgsu.edu.in',
      phone: '+91 94251 99002',
      department_id: 5,
      department_name: 'Department of Botany',
      designation: 'Professor, Dept. of Botany',
      specialization: 'Plant Taxonomy, Ethnomedicinal Flora of Bundelkhand, Phytosociology & Forest Biomass',
      h_index: 27,
      citations_count: 2480,
      orcid_id: '0000-0001-6642-1092',
      scopus_id: '56102938472',
      bio: 'Professor of Botany with pioneering work on taxonomic documentation of medicinal flora in Vindhyan and Bundelkhand forests and forest carbon sequestration.',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    {
      id: 19,
      name: 'Dr. Archita Singh',
      email: 'archita.singh@dhsgsu.edu.in',
      phone: '+91 98261 88990',
      department_id: 5,
      department_name: 'Department of Botany',
      designation: 'Assistant Professor, Dept. of Botany',
      specialization: 'Plant Molecular Biology, Abiotic Stress Signaling, Plant Transcriptomics & Drought Tolerance',
      h_index: 19,
      citations_count: 1240,
      orcid_id: '0000-0003-1029-4821',
      scopus_id: '57192840192',
      bio: 'Assistant Professor in Botany running research on WRKY transcription factors, reactive oxygen species signaling, and drought resilience in dryland crops.',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
    },
    {
      id: 20,
      name: 'Dr. Amit Jugnu Bishwas',
      email: 'ajbishwas@dhsgsu.edu.in',
      phone: '+91 94254 99112',
      department_id: 5,
      department_name: 'Department of Botany',
      designation: 'Assistant Professor, Dept. of Botany',
      specialization: 'Phytotaxonomy, Floristic Diversity of Sagar & Nauradehi, Ecological Restoration',
      h_index: 13,
      citations_count: 460,
      orcid_id: '0000-0002-8841-3910',
      scopus_id: '57201948271',
      bio: 'Assistant Professor focusing on floristic diversity mapping, herbarium digitalization, and taxonomic conservation of threatened angiosperms in Central India.',
      avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
    },
    {
      id: 21,
      name: 'Rajat Verma',
      email: 'rajat.bot.phd@dhsgsu.edu.in',
      phone: '+91 96301 23456',
      department_id: 5,
      department_name: 'Department of Botany',
      designation: 'Ph.D. Research Scholar, Botany',
      specialization: 'Plant Stress Physiology, Endophytic Fungal Symbiosis, Bioactive Metabolites',
      h_index: 5,
      citations_count: 95,
      orcid_id: '0000-0002-9910-1842',
      scopus_id: '58501928471',
      bio: 'Doctoral candidate researching endophytic fungal isolates from indigenous medicinal plants for enhanced secondary metabolite production.',
      avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
    }
  ],
  publications: [
    {
      id: 1,
      title: 'Hyperspectral Image Classification Using 3D-2D Hybrid Convolutional Neural Network with Spatial-Spectral Attention Mechanism',
      researcher_id: 1,
      researcher_name: 'Dr. Pangambam Sendash Singh',
      type: 'Journal Paper',
      journal_or_publisher: 'IEEE Geoscience and Remote Sensing Letters',
      publication_year: 2023,
      doi: '10.1109/LGRS.2023.3289104',
      abstract: 'Proposes an end-to-end 3D-2D hybrid CNN framework capturing joint spatial-spectral dependencies for high-precision satellite hyperspectral imagery classification.',
      indexing: 'SCI / Scopus Q1',
      citation_count: 42,
      download_url: 'https://doi.org/10.1109/LGRS.2023.3289104'
    },
    {
      id: 2,
      title: 'Ensemble Machine Learning Framework for Software Defect Prediction in Cloud-Native Computing Environments',
      researcher_id: 2,
      researcher_name: 'Dr. Kavita Sahu',
      type: 'Journal Paper',
      journal_or_publisher: 'Journal of Systems and Software (Elsevier)',
      publication_year: 2024,
      doi: '10.1016/j.jss.2024.111890',
      abstract: 'Presents a multi-model boosting ensemble architecture identifying latent software bugs in microservices cloud codebases with 94.6% recall rate.',
      indexing: 'SCI / Scopus Q1',
      citation_count: 31,
      download_url: 'https://doi.org/10.1016/j.jss.2024.111890'
    },
    {
      id: 3,
      title: 'Energy-Aware Dynamic Workflow Scheduling in Heterogeneous Cloud Data Centers using Metaheuristic Genetic Algorithm',
      researcher_id: 3,
      researcher_name: 'Dr. Ranjit Rajak',
      type: 'Journal Paper',
      journal_or_publisher: 'Cluster Computing (Springer)',
      publication_year: 2023,
      doi: '10.1007/s10586-023-04102-w',
      abstract: 'Formulates a multi-objective optimization strategy minimizing energy consumption while guaranteeing SLA deadlines for parallel scientific workflows.',
      indexing: 'SCI / Scopus Q2',
      citation_count: 27,
      download_url: 'https://doi.org/10.1007/s10586-023-04102-w'
    },
    {
      id: 4,
      title: 'Morphological Analysis and Neural Speech Recognition for Low-Resource Bundelkhand Dialectal Corpora',
      researcher_id: 4,
      researcher_name: 'Neha Richhariya',
      type: 'Journal Paper',
      journal_or_publisher: 'ACM Transactions on Asian and Low-Resource Language Information Processing (TALLIP)',
      publication_year: 2024,
      doi: '10.1145/3649102.2024',
      abstract: 'Introduces acoustic-phonetic dataset and fine-tuned Transformer model achieving state-of-the-art 88.6 BLEU score on Bundelkhandi-Hindi dialect speech translation.',
      indexing: 'SCI / Scopus Q1',
      citation_count: 14,
      download_url: 'https://doi.org/10.1145/3649102.2024'
    },
    {
      id: 5,
      title: 'Kinetic Alfvén Waves Generation by Ring Current Ions and Energy Transfer in Earth Magnetosphere',
      researcher_id: 5,
      researcher_name: 'Prof. M. S. Tiwari',
      type: 'Journal Paper',
      journal_or_publisher: 'Journal of Geophysical Research: Space Physics (AGU)',
      publication_year: 2023,
      doi: '10.1029/2023JA031456',
      abstract: 'Theoretical and computational investigation demonstrating the resonant interaction between energetic ring current ions and kinetic Alfvén waves in the terrestrial magnetosphere.',
      indexing: 'SCI / Scopus Q1',
      citation_count: 48,
      download_url: 'https://doi.org/10.1029/2023JA031456'
    },
    {
      id: 6,
      title: 'Enhanced Dielectric Permittivity and Energy Storage Density in Flexible PVDF-Graphene Oxide Nanocomposite Films',
      researcher_id: 6,
      researcher_name: 'Dr. Maheswar Panda',
      type: 'Journal Paper',
      journal_or_publisher: 'Applied Surface Science (Elsevier)',
      publication_year: 2024,
      doi: '10.1016/j.apsusc.2024.159480',
      abstract: 'Synthesizes functionalized graphene oxide incorporated PVDF composite membranes demonstrating ultra-high dielectric constant and 14.8 J/cm3 energy storage density.',
      indexing: 'SCI / Scopus Q1',
      citation_count: 38,
      download_url: 'https://doi.org/10.1016/j.apsusc.2024.159480'
    },
    {
      id: 7,
      title: 'Electro-Optical Switching and Phase Transition Dynamics of Nematic Liquid Crystals Doped with Metallic Nanoparticles',
      researcher_id: 7,
      researcher_name: 'Dr. Dhananjay Kumar Gaur',
      type: 'Journal Paper',
      journal_or_publisher: 'Liquid Crystals (Taylor & Francis)',
      publication_year: 2023,
      doi: '10.1080/02678292.2023.2189012',
      abstract: 'Experimental analysis on the threshold voltage reduction and faster optical response time in nematic liquid crystalline matrices dispersed with gold nanoparticles.',
      indexing: 'SCI / Scopus Q2',
      citation_count: 22,
      download_url: 'https://doi.org/10.1080/02678292.2023.2189012'
    },
    {
      id: 8,
      title: 'Synthesis and Optoelectronic Characterization of MoS2 Thin Films via Chemical Vapor Deposition for Photovoltaic Devices',
      researcher_id: 8,
      researcher_name: 'Vivek Kumar Mishra',
      type: 'Journal Paper',
      journal_or_publisher: 'Materials Letters (Elsevier)',
      publication_year: 2024,
      doi: '10.1016/j.matlet.2024.136102',
      abstract: 'Demonstrates scalable CVD synthesis of high-crystallinity continuous MoS2 monolayers with direct bandgap optical transition for next-generation solar cells.',
      indexing: 'SCI / Scopus Q2',
      citation_count: 12,
      download_url: 'https://doi.org/10.1016/j.matlet.2024.136102'
    },
    {
      id: 9,
      title: 'A Two-Echelon Supply Chain Model with Controllable Deterioration Rate and Price-Sensitive Dynamic Demand',
      researcher_id: 9,
      researcher_name: 'Dr. Uttam Kumar Khedlekar',
      type: 'Journal Paper',
      journal_or_publisher: 'Applied Mathematical Modelling (Elsevier)',
      publication_year: 2023,
      doi: '10.1016/j.apm.2023.05.021',
      abstract: 'Develops a non-linear mathematical optimization framework analyzing trade credit policies and preservation technology investments in supply chains with decaying inventories.',
      indexing: 'SCI / Scopus Q1',
      citation_count: 45,
      download_url: 'https://doi.org/10.1016/j.apm.2023.05.021'
    },
    {
      id: 10,
      title: 'Fractional-Order SEIR Epidemic Model with Media Awareness and Saturated Treatment Function: Stability and Bifurcation Analysis',
      researcher_id: 10,
      researcher_name: 'Dr. Shivani Khare',
      type: 'Journal Paper',
      journal_or_publisher: 'Chaos, Solitons & Fractals (Elsevier)',
      publication_year: 2023,
      doi: '10.1016/j.chaos.2023.113450',
      abstract: 'Constructs a Caputo fractional differential epidemic model showing Hopf bifurcation thresholds and the impact of public awareness on suppressing transmission rates.',
      indexing: 'SCI / Scopus Q1',
      citation_count: 37,
      download_url: 'https://doi.org/10.1016/j.chaos.2023.113450'
    },
    {
      id: 11,
      title: 'Duality Relations for Multi-Objective Fractional Variational Problems with Generalized Invexity',
      researcher_id: 11,
      researcher_name: 'Dr. Triloki Nath Gupta',
      type: 'Journal Paper',
      journal_or_publisher: 'Optimization (Taylor & Francis)',
      publication_year: 2023,
      doi: '10.1080/02331934.2023.2201924',
      abstract: 'Establishes sufficient optimality conditions and Mond-Weir type duality theorems for constrained continuous-time multi-objective programming problems.',
      indexing: 'SCI / Scopus Q2',
      citation_count: 21,
      download_url: 'https://doi.org/10.1080/02331934.2023.2201924'
    },
    {
      id: 12,
      title: 'Synthesis, Crystal Structure, DNA Binding, and In Vitro Cytotoxicity of Transition Metal(II) Complexes of Polyfunctional Schiff Bases',
      researcher_id: 13,
      researcher_name: 'Prof. A. P. Mishra',
      type: 'Journal Paper',
      journal_or_publisher: 'Journal of Molecular Structure (Elsevier)',
      publication_year: 2023,
      doi: '10.1016/j.molstruc.2023.136214',
      abstract: 'Characterizes novel copper(II), cobalt(II), and nickel(II) coordination complexes showing intercalative DNA binding mode and pronounced IC50 cytotoxicity on cancer lines.',
      indexing: 'SCI / Scopus Q2',
      citation_count: 52,
      download_url: 'https://doi.org/10.1016/j.molstruc.2023.136214'
    },
    {
      id: 13,
      title: 'Density Functional Theory (DFT) and Molecular Docking Investigation of Novel Heterocyclic Coumarin Derivatives as Potent EGFR Inhibitors',
      researcher_id: 14,
      researcher_name: 'Prof. Ratnesh Das',
      type: 'Journal Paper',
      journal_or_publisher: 'Journal of Biomolecular Structure and Dynamics',
      publication_year: 2024,
      doi: '10.1080/07391102.2024.2319012',
      abstract: 'Combines quantum chemical DFT calculations with molecular docking and dynamic simulations to evaluate newly synthesized coumarin scaffolds against oncology targets.',
      indexing: 'SCI / Scopus Q1',
      citation_count: 36,
      download_url: 'https://doi.org/10.1080/07391102.2024.2319012'
    },
    {
      id: 14,
      title: 'Short Self-Assembling Peptide Hydrogels as Injectable Scaffolds for Controlled Drug Delivery and Tissue Engineering',
      researcher_id: 15,
      researcher_name: 'Dr. K. B. Joshi',
      type: 'Journal Paper',
      journal_or_publisher: 'Biomacromolecules (ACS)',
      publication_year: 2023,
      doi: '10.1021/acs.biomac.3c00412',
      abstract: 'Synthesizes rationally designed ultrashort peptide sequences that spontaneously form nanofibrillar hydrogels with shear-thinning injectable properties for sustained protein delivery.',
      indexing: 'SCI / Scopus Q1',
      citation_count: 39,
      download_url: 'https://doi.org/10.1021/acs.biomac.3c00412'
    },
    {
      id: 15,
      title: 'Green Synthesis of Magnetically Separable Fe3O4@ZnO Nanocatalysts for Solvent-Free Synthesis of Benzimidazoles',
      researcher_id: 16,
      researcher_name: 'Deepali Sharma',
      type: 'Journal Paper',
      journal_or_publisher: 'RSC Advances (Royal Society of Chemistry)',
      publication_year: 2024,
      doi: '10.1039/D4RA01920E',
      abstract: 'Green plant-mediated synthesis of magnetic core-shell nanostructures exhibiting high catalytic reusability across six consecutive reaction cycles.',
      indexing: 'SCI / Scopus Q2',
      citation_count: 16,
      download_url: 'https://doi.org/10.1039/D4RA01920E'
    },
    {
      id: 16,
      title: 'Impact of Climate Warming on Regeneration and Phenology of Threatened Tree Taxa in Tropical Dry Deciduous Forests of Central India',
      researcher_id: 17,
      researcher_name: 'Prof. Mohammed Latif Khan',
      type: 'Journal Paper',
      journal_or_publisher: 'Forest Ecology and Management (Elsevier)',
      publication_year: 2023,
      doi: '10.1016/j.foreco.2023.121190',
      abstract: 'Ten-year empirical study documenting the shifting flowering/fruiting phenology and seed germination dynamics of vulnerable dry forest tree species in Madhya Pradesh.',
      indexing: 'SCI / Scopus Q1',
      citation_count: 64,
      download_url: 'https://doi.org/10.1016/j.foreco.2023.121190'
    },
    {
      id: 17,
      title: 'Phytosociological Investigation and Ethnomedicinal Inventory of Rare Herbaceous Flora in Nauradehi Wildlife Sanctuary, Sagar (M.P.)',
      researcher_id: 18,
      researcher_name: 'Prof. P. K. Khare',
      type: 'Journal Paper',
      journal_or_publisher: 'Journal of Ethnopharmacology (Elsevier)',
      publication_year: 2023,
      doi: '10.1016/j.jep.2023.116892',
      abstract: 'Comprehensive field documentation of 142 ethnomedicinal angiosperms used by indigenous communities of Bundelkhand region along with quantitative consensus indices.',
      indexing: 'SCI / Scopus Q1',
      citation_count: 37,
      download_url: 'https://doi.org/10.1016/j.jep.2023.116892'
    },
    {
      id: 18,
      title: 'Genome-Wide Identification and Expression Profiling of WRKY Transcription Factors in Response to Drought and Salinity Stresses in Millets',
      researcher_id: 19,
      researcher_name: 'Dr. Archita Singh',
      type: 'Journal Paper',
      journal_or_publisher: 'Plant Physiology and Biochemistry (Elsevier)',
      publication_year: 2024,
      doi: '10.1016/j.plaphy.2024.108490',
      abstract: 'Identifies 72 WRKY gene family members and analyzes qRT-PCR transcriptional upregulation under osmotic stress conditions.',
      indexing: 'SCI / Scopus Q1',
      citation_count: 28,
      download_url: 'https://doi.org/10.1016/j.plaphy.2024.108490'
    },
    {
      id: 19,
      title: 'Floristic Diversity and Conservation Status of Endemic Angiosperms in the Vindhyan Range of Madhya Pradesh',
      researcher_id: 20,
      researcher_name: 'Dr. Amit Jugnu Bishwas',
      type: 'Journal Paper',
      journal_or_publisher: 'Phytotaxa (Magnolia Press)',
      publication_year: 2023,
      doi: '10.11646/phytotaxa.598.2.3',
      abstract: 'Taxonomic reassessment of vulnerable endemic taxa in Vindhyan plateaus with GPS distribution mapping and IUCN red-list criteria evaluation.',
      indexing: 'SCI / Scopus Q2',
      citation_count: 17,
      download_url: 'https://doi.org/10.11646/phytotaxa.598.2.3'
    }
  ],
  patents: [
    {
      id: 1,
      title: 'A Deep Learning Spatial-Spectral Feature Fusion Architecture for High-Resolution Remote Sensing Classification',
      inventor_id: 1,
      inventor_name: 'Dr. Pangambam Sendash Singh',
      patent_number: 'IN202321074892',
      filing_date: '2023-05-14',
      grant_date: '2024-04-10',
      status: 'Granted',
      abstract: 'A deep convolutional apparatus and spatial-spectral attention method for multi-band satellite classification.',
      jurisdiction: 'India / IPO'
    },
    {
      id: 2,
      title: 'Flexible Polymeric Nanocomposite Thin Film for High Energy Density Dielectric Energy Storage Devices',
      inventor_id: 6,
      inventor_name: 'Dr. Maheswar Panda',
      patent_number: 'IN202421038491',
      filing_date: '2024-01-22',
      grant_date: null,
      status: 'Published',
      abstract: 'Novel PVDF-based nanocomposite thin film formulation achieving enhanced dielectric breakdown field.',
      jurisdiction: 'India / IPO'
    },
    {
      id: 3,
      title: 'Transition Metal Schiff Base Complex Formulation with Potent Antimicrobial and Antibiofilm Efficacy',
      inventor_id: 13,
      inventor_name: 'Prof. A. P. Mishra',
      patent_number: 'IN202321019284',
      filing_date: '2023-02-18',
      grant_date: '2024-01-15',
      status: 'Granted',
      abstract: 'Bio-inorganic pharmaceutical formulation showing strong bactericidal action against resistant pathogen biofilms.',
      jurisdiction: 'India / IPO'
    },
    {
      id: 4,
      title: 'Herbal Extract Formulation and Standardization for Anti-Diabetic Activity from Nauradehi Forest Flora',
      inventor_id: 18,
      inventor_name: 'Prof. P. K. Khare',
      patent_number: 'IN202221089201',
      filing_date: '2022-09-20',
      grant_date: '2023-11-10',
      status: 'Granted',
      abstract: 'Standardized bioactive extract derived from indigenous Bundelkhand medicinal plants with sustained hypoglycemic action.',
      jurisdiction: 'India / IPO'
    },
    {
      id: 5,
      title: 'Smart Dynamic Pricing and Automated Inventory Control Apparatus with Decay Sensor Telemetry',
      inventor_id: 9,
      inventor_name: 'Dr. Uttam Kumar Khedlekar',
      patent_number: 'IN202421051289',
      filing_date: '2024-03-05',
      grant_date: null,
      status: 'Under Review',
      abstract: 'An automated mathematical control apparatus adjusting retail pricing in real-time based on perishable item degradation metrics.',
      jurisdiction: 'India / IPO'
    }
  ],
  conferences: [
    {
      id: 1,
      name: 'National Conference on Recent Trends in Computing & Applications (NCRTCA 2026)',
      organized_by: 'DCSA, Dr. Harisingh Gour Vishwavidyalaya',
      location: 'Auditorium, DHSGSU Campus, Sagar (M.P.)',
      conference_date: '2026-11-20',
      mode: 'Hybrid',
      website_url: 'https://dhsgsu.edu.in/dcsa-ncrtca2026',
      submission_deadline: '2026-09-15',
      status: 'Upcoming'
    },
    {
      id: 2,
      name: 'International Conference on Frontiers in Materials Science and Condensed Matter Physics (ICFMS 2026)',
      organized_by: 'Department of Physics, DHSGSU',
      location: 'C. V. Raman Hall, Science Block, DHSGSU, Sagar',
      conference_date: '2026-12-14',
      mode: 'Hybrid',
      website_url: 'https://dhsgsu.edu.in/physics-icfms2026',
      submission_deadline: '2026-10-10',
      status: 'Upcoming'
    },
    {
      id: 3,
      name: 'National Symposium on Mathematical Modeling, Optimization and Biomathematics (NSMMOB 2026)',
      organized_by: 'Department of Mathematics, DHSGSU',
      location: 'Ramanujan Seminar Hall, DHSGSU Sagar',
      conference_date: '2026-10-25',
      mode: 'Offline',
      website_url: 'https://dhsgsu.edu.in/math-nsmmob2026',
      submission_deadline: '2026-08-30',
      status: 'Upcoming'
    },
    {
      id: 4,
      name: 'National Conference on Green Chemistry, Catalysis and Sustainable Drug Discovery (NCGCSDD 2026)',
      organized_by: 'Department of Chemistry, DHSGSU',
      location: 'Golden Jubilee Auditorium, DHSGSU Sagar',
      conference_date: '2026-11-05',
      mode: 'Hybrid',
      website_url: 'https://dhsgsu.edu.in/chem-ncgcsdd2026',
      submission_deadline: '2026-09-20',
      status: 'Upcoming'
    },
    {
      id: 5,
      name: 'International Conference on Biodiversity Conservation, Plant Stress Biology and Climate Resilience (ICBCPB 2026)',
      organized_by: 'Department of Botany, DHSGSU',
      location: 'Senate Hall, Administrative Block, DHSGSU Sagar',
      conference_date: '2026-12-02',
      mode: 'Hybrid',
      website_url: 'https://dhsgsu.edu.in/botany-icbcpb2026',
      submission_deadline: '2026-10-05',
      status: 'Upcoming'
    }
  ],
  proposals: [
    {
      id: 1,
      title: 'AI-Powered Hyperspectral Imaging System for Regional Crop Disease Mapping in Bundelkhand',
      principal_investigator_id: 1,
      principal_investigator_name: 'Dr. Pangambam Sendash Singh',
      co_investigators: 'Dr. Kavita Sahu (DCSA), Dr. Ranjit Rajak (DCSA)',
      funding_agency: 'Science and Engineering Research Board (SERB / ANRF)',
      budget_requested: 4850000.00,
      duration_months: 36,
      submission_date: '2026-02-15',
      approval_status: 'Research Cell Approved',
      review_comments: 'High societal impact for Bundelkhand farmers. Recommended by University Research Committee for central sanction.'
    },
    {
      id: 2,
      title: 'Development of High-Performance Dielectric Polymer Nanocomposites for Next-Gen Supercapacitor Energy Storage',
      principal_investigator_id: 6,
      principal_investigator_name: 'Dr. Maheswar Panda',
      co_investigators: 'Prof. M. S. Tiwari (Physics)',
      funding_agency: 'Council of Scientific and Industrial Research (CSIR)',
      budget_requested: 3800000.00,
      duration_months: 36,
      submission_date: '2026-03-01',
      approval_status: 'Under Review',
      review_comments: 'Evaluation by CSIR Physical Sciences Expert Committee in progress.'
    },
    {
      id: 3,
      title: 'Mathematical Modeling and Optimal Control Strategies for Vector-Borne Infectious Disease Epidemics in Central India',
      principal_investigator_id: 10,
      principal_investigator_name: 'Dr. Shivani Khare',
      co_investigators: 'Dr. Uttam Kumar Khedlekar (Mathematics)',
      funding_agency: 'Indian Council of Medical Research (ICMR)',
      budget_requested: 2850000.00,
      duration_months: 24,
      submission_date: '2026-03-20',
      approval_status: 'Agency Approved',
      review_comments: 'Grant sanctioned by ICMR. Epidemiological survey and data collection initialized.'
    },
    {
      id: 4,
      title: 'Computational Drug Design and Synthesis of Novel Metal-Based Heterocyclic Anticancer Therapeutics',
      principal_investigator_id: 14,
      principal_investigator_name: 'Prof. Ratnesh Das',
      co_investigators: 'Prof. A. P. Mishra (Chemistry)',
      funding_agency: 'Department of Biotechnology (DBT)',
      budget_requested: 6500000.00,
      duration_months: 36,
      submission_date: '2026-01-18',
      approval_status: 'Agency Approved',
      review_comments: 'Sanctioned under DBT Medicinal Biotechnology track. High-throughput synthesis lab setup underway.'
    },
    {
      id: 5,
      title: 'Assessment of Forest Carbon Stocks, Tree Diversity and Climate Vulnerability in Protected Forest Ecosystems of Madhya Pradesh',
      principal_investigator_id: 17,
      principal_investigator_name: 'Prof. Mohammed Latif Khan',
      co_investigators: 'Prof. P. K. Khare (Botany), Dr. Archita Singh (Botany)',
      funding_agency: 'Ministry of Environment, Forest and Climate Change (MoEFCC)',
      budget_requested: 8500000.00,
      duration_months: 36,
      submission_date: '2026-02-10',
      approval_status: 'Agency Approved',
      review_comments: 'Sanctioned by MoEFCC. Field sampling and GIS permanent plot establishment active.'
    }
  ],
  funding: [
    {
      id: 1,
      title: 'SERB Core Research Grant (CRG) - STEM Disciplines',
      agency_name: 'Science and Engineering Research Board / Anusandhan NRF',
      grant_amount_max: 6500000.00,
      eligible_disciplines: 'Computer Science (DCSA), Physics, Mathematics, Chemistry, Botany',
      deadline: '2026-12-05',
      application_link: 'https://serbonline.in/CRG',
      description: 'Flagship individual research grant supporting frontier fundamental and applied scientific research in Central Universities.',
      status: 'Active'
    },
    {
      id: 2,
      title: 'MPCOST Research & Development Grant Scheme 2026-27',
      agency_name: 'M.P. Council of Science and Technology (Bhopal)',
      grant_amount_max: 3500000.00,
      eligible_disciplines: 'Computer Science, Physics, Chemistry, Mathematical Sciences, Botanical Ecology',
      deadline: '2026-11-15',
      application_link: 'http://mpcost.gov.in/schemes',
      description: 'Supports state-oriented R&D projects addressing regional agro-industrial and technological development in Madhya Pradesh.',
      status: 'Active'
    },
    {
      id: 3,
      title: 'DBT / CSIR Frontier Research Fellowships in Chemical and Botanical Sciences',
      agency_name: 'Department of Biotechnology & CSIR',
      grant_amount_max: 5000000.00,
      eligible_disciplines: 'Chemistry, Botany, Bio-Inorganic Materials, Plant Biotechnology',
      deadline: '2026-10-30',
      application_link: 'https://dbtindia.gov.in/schemes',
      description: 'Focused funding for biomacromolecular synthesis, green nanomaterials, and biodiversity conservation.',
      status: 'Closing Soon'
    },
    {
      id: 4,
      title: 'MeitY Special AI / HPC Research Infrastructure Scheme',
      agency_name: 'Ministry of Electronics and Information Technology',
      grant_amount_max: 9000000.00,
      eligible_disciplines: 'Computer Science & Applications (DCSA), Computational Physics/Chemistry',
      deadline: '2026-11-30',
      application_link: 'https://meity.gov.in/ai-grants',
      description: 'Grants for establishing GPU computing clusters and deep learning laboratories in Central Universities.',
      status: 'Active'
    }
  ],
  notifications: [
    {
      id: 1,
      title: 'DCSA NCRTCA 2026 Call for Papers Open',
      message: 'Department of Computer Science & Applications (DCSA) invites research papers for NCRTCA 2026. Submit drafts before Sept 15.',
      category: 'Conference',
      target_role: 'All',
      is_read: false,
      created_at: '2026-10-04T10:00:00Z'
    },
    {
      id: 2,
      title: 'Grant Sanctioned: ICMR Epidemic Modeling Project',
      message: 'Congratulations to Dr. Shivani Khare (Dept. of Mathematics) on receiving ICMR Grant Sanction of ₹28.5 Lakhs.',
      category: 'Funding',
      target_role: 'Faculty',
      is_read: false,
      created_at: '2026-10-03T14:30:00Z'
    },
    {
      id: 3,
      title: 'DBT Research Grant Sanctioned: Dept. of Chemistry',
      message: 'Congratulations to Prof. Ratnesh Das and Prof. A. P. Mishra on receiving ₹65.0 Lakhs DBT Grant for Anticancer Drug Discovery.',
      category: 'Funding',
      target_role: 'All',
      is_read: false,
      created_at: '2026-10-02T11:00:00Z'
    },
    {
      id: 4,
      title: 'President Visitor Awardee Prof. M. L. Khan Keynote',
      message: 'Prof. M. L. Khan (Senior Professor, Botany) to deliver national keynote on Forest Climate Resilience at ICBCPB 2026.',
      category: 'General',
      target_role: 'All',
      is_read: true,
      created_at: '2026-10-01T09:15:00Z'
    }
  ]
};

async function initDB() {
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

  if (DB_HOST && DB_HOST !== 'srv123.main-hosting.eu' && DB_USER && DB_PASSWORD) {
    try {
      pool = mysql.createPool({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        port: Number(DB_PORT) || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 8000
      });

      const connection = await pool.getConnection();
      console.log(`[Database] Connected successfully to Hostinger MySQL (${DB_HOST}/${DB_NAME})`);
      connection.release();
      isConnected = true;
    } catch (err) {
      console.warn(`[Database] Hostinger MySQL connection attempt: ${err.message}`);
      console.log('[Database] Operating with resilient in-memory academic dataset.');
      isConnected = false;
    }
  } else {
    console.log('[Database] Hostinger credentials not configured or placeholder detected in .env.');
    console.log('[Database] Running with full simulated University Research Cell dataset.');
    isConnected = false;
  }
}

async function query(sql, params = []) {
  if (isConnected && pool) {
    try {
      const [rows] = await pool.query(sql, params);
      return rows;
    } catch (err) {
      console.error(`[Database Query Error] ${err.message}`);
      throw err;
    }
  }
  return null;
}

module.exports = {
  initDB,
  query,
  mockStore,
  isLiveDbConnected: () => isConnected,
  getPool: () => pool
};
