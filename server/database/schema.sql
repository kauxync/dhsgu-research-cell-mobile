-- =======================================================
-- University Research Cell Database Schema (Hostinger MySQL)
-- =======================================================

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    head_of_department VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Faculty & Researchers Table
CREATE TABLE IF NOT EXISTS researchers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30),
    department_id INT,
    designation VARCHAR(100) NOT NULL,
    specialization TEXT,
    h_index INT DEFAULT 0,
    citations_count INT DEFAULT 0,
    orcid_id VARCHAR(50),
    scopus_id VARCHAR(50),
    bio TEXT,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Research Publications Table (Papers, Books, Chapters)
CREATE TABLE IF NOT EXISTS publications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    researcher_id INT NOT NULL,
    type ENUM('Journal Paper', 'Conference Paper', 'Book', 'Book Chapter') DEFAULT 'Journal Paper',
    journal_or_publisher VARCHAR(255) NOT NULL,
    publication_year INT NOT NULL,
    doi VARCHAR(150),
    abstract TEXT,
    indexing VARCHAR(100) DEFAULT 'Scopus / SCI',
    citation_count INT DEFAULT 0,
    download_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (researcher_id) REFERENCES researchers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Patents & Intellectual Property Table
CREATE TABLE IF NOT EXISTS patents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    inventor_id INT NOT NULL,
    patent_number VARCHAR(100) NOT NULL UNIQUE,
    filing_date DATE NOT NULL,
    grant_date DATE,
    status ENUM('Filed', 'Published', 'Granted', 'Licensed', 'Under Review') DEFAULT 'Under Review',
    abstract TEXT,
    jurisdiction VARCHAR(50) DEFAULT 'India / IPO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventor_id) REFERENCES researchers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Conferences Table
CREATE TABLE IF NOT EXISTS conferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    organized_by VARCHAR(255) NOT NULL,
    location VARCHAR(150),
    conference_date DATE NOT NULL,
    mode ENUM('Offline', 'Online', 'Hybrid') DEFAULT 'Hybrid',
    website_url VARCHAR(255),
    submission_deadline DATE,
    status ENUM('Upcoming', 'Ongoing', 'Completed') DEFAULT 'Upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Research Project Proposals & Approvals
CREATE TABLE IF NOT EXISTS project_proposals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    principal_investigator_id INT NOT NULL,
    co_investigators TEXT,
    funding_agency VARCHAR(150) NOT NULL,
    budget_requested DECIMAL(15,2) NOT NULL,
    duration_months INT NOT NULL,
    submission_date DATE NOT NULL,
    approval_status ENUM('Draft', 'Submitted', 'Under Review', 'Department Approved', 'Research Cell Approved', 'Agency Approved', 'Rejected') DEFAULT 'Under Review',
    review_comments TEXT,
    proposal_document_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (principal_investigator_id) REFERENCES researchers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Funding, Grants & Sponsorship Opportunities
CREATE TABLE IF NOT EXISTS funding_opportunities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    agency_name VARCHAR(150) NOT NULL,
    grant_amount_max DECIMAL(15,2),
    eligible_disciplines TEXT,
    deadline DATE NOT NULL,
    application_link VARCHAR(255),
    description TEXT,
    status ENUM('Active', 'Closing Soon', 'Expired') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Notifications & Broadcasts
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category ENUM('Funding', 'Conference', 'Proposal', 'Policy', 'General') DEFAULT 'General',
    target_role VARCHAR(50) DEFAULT 'All',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

