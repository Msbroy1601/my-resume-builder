import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useUser, useClerk } from '@clerk/clerk-react'
import html2pdf from 'html2pdf.js'

// ─── DATA: JOB ROLES ──────────────────────────────────────────────────────────
const JOB_ROLES = {
  "Technology & IT": [
    "Software Engineer", "Sr. Software Engineer", "Lead Software Engineer",
    "Frontend Developer", "Sr. Frontend Developer",
    "Backend Developer", "Sr. Backend Developer",
    "Full Stack Developer", "Sr. Full Stack Developer",
    "Mobile App Developer", "Sr. Mobile App Developer",
    "Android Developer", "Sr. Android Developer",
    "iOS Developer", "Sr. iOS Developer",
    "DevOps Engineer", "Sr. DevOps Engineer",
    "Cloud Engineer", "Sr. Cloud Engineer",
    "Data Engineer", "Sr. Data Engineer",
    "Data Scientist", "Sr. Data Scientist",
    "Data Analyst", "Sr. Data Analyst",
    "Machine Learning Engineer", "Sr. Machine Learning Engineer",
    "AI Engineer", "Sr. AI Engineer",
    "Cybersecurity Analyst", "Sr. Cybersecurity Analyst",
    "Network Engineer", "Sr. Network Engineer",
    "System Administrator", "Sr. System Administrator",
    "Database Administrator", "Sr. Database Administrator",
    "QA Engineer", "Sr. QA Engineer",
    "Software Tester", "Sr. Software Tester",
    "IT Support Engineer", "Sr. IT Support Engineer",
    "ERP Consultant", "Sr. ERP Consultant",
    "SAP Consultant", "Sr. SAP Consultant",
    "Business Analyst", "Sr. Business Analyst",
    "Product Manager", "Sr. Product Manager",
    "Product Owner", "Sr. Product Owner",
    "Engineering Manager", "Sr. Engineering Manager",
    "Scrum Master", "Sr. Scrum Master",
    "Technical Lead", "Principal Engineer",
    "Solutions Architect", "Enterprise Architect",
    "Other"
  ],
  "Marketing & Sales": [
    "Marketing Executive", "Sr. Marketing Executive",
    "Digital Marketing Executive", "Sr. Digital Marketing Executive",
    "SEO Executive", "Sr. SEO Executive",
    "Social Media Manager", "Sr. Social Media Manager",
    "Content Writer", "Sr. Content Writer",
    "Copywriter", "Sr. Copywriter",
    "Brand Manager", "Sr. Brand Manager",
    "Performance Marketing Manager", "Sr. Performance Marketing Manager",
    "Sales Executive", "Sr. Sales Executive",
    "Business Development Executive", "Sr. Business Development Executive",
    "Account Manager", "Sr. Account Manager",
    "Pre-Sales Consultant", "Sr. Pre-Sales Consultant",
    "Inside Sales Executive", "Sr. Inside Sales Executive",
    "Field Sales Executive", "Sr. Field Sales Executive",
    "CRM Executive", "Sr. CRM Executive",
    "Marketing Manager", "Sr. Marketing Manager",
    "Growth Manager", "Other"
  ],
  "Finance & Accounts": [
    "Accountant", "Sr. Accountant",
    "Finance Analyst", "Sr. Finance Analyst",
    "Financial Controller", "Sr. Financial Controller",
    "Audit Executive", "Sr. Audit Executive",
    "Tax Consultant", "Sr. Tax Consultant",
    "CA (Chartered Accountant)", "Sr. CA",
    "Investment Analyst", "Sr. Investment Analyst",
    "Equity Research Analyst", "Sr. Equity Research Analyst",
    "Credit Analyst", "Sr. Credit Analyst",
    "Risk Analyst", "Sr. Risk Analyst",
    "Banking Executive", "Sr. Banking Executive",
    "Loan Officer", "Sr. Loan Officer",
    "Insurance Advisor", "Sr. Insurance Advisor",
    "Payroll Executive", "Sr. Payroll Executive",
    "Treasury Analyst", "Sr. Treasury Analyst",
    "Finance Manager", "CFO", "Other"
  ],
  "Banking": [
    "Bank Teller", "Sr. Bank Teller",
    "Relationship Manager", "Sr. Relationship Manager",
    "Branch Manager", "Sr. Branch Manager",
    "Credit Officer", "Sr. Credit Officer",
    "Loan Officer", "Sr. Loan Officer",
    "Investment Banking Analyst", "Sr. Investment Banking Analyst",
    "Retail Banking Executive", "Sr. Retail Banking Executive",
    "Trade Finance Executive", "Sr. Trade Finance Executive",
    "KYC Analyst", "Sr. KYC Analyst",
    "Anti Money Laundering Analyst", "Sr. AML Analyst",
    "Forex Dealer", "Sr. Forex Dealer",
    "Priority Banking Manager", "Wealth Manager",
    "Sr. Wealth Manager", "Private Banker", "Other"
  ],
  "HR & Admin": [
    "HR Executive", "Sr. HR Executive",
    "HR Manager", "Sr. HR Manager",
    "Talent Acquisition Specialist", "Sr. Talent Acquisition Specialist",
    "Recruiter", "Sr. Recruiter",
    "Learning & Development Executive", "Sr. L&D Executive",
    "Payroll Manager", "Sr. Payroll Manager",
    "Admin Executive", "Sr. Admin Executive",
    "Office Manager", "Sr. Office Manager",
    "Executive Assistant", "Sr. Executive Assistant",
    "Personal Assistant", "HRBP", "Sr. HRBP",
    "HR Director", "Other"
  ],
  "Design & Creative": [
    "UI/UX Designer", "Sr. UI/UX Designer",
    "Graphic Designer", "Sr. Graphic Designer",
    "Visual Designer", "Sr. Visual Designer",
    "Motion Designer", "Sr. Motion Designer",
    "Video Editor", "Sr. Video Editor",
    "Photographer", "Sr. Photographer",
    "Content Creator", "Sr. Content Creator",
    "3D Artist", "Sr. 3D Artist",
    "Illustrator", "Sr. Illustrator",
    "Web Designer", "Sr. Web Designer",
    "Creative Director", "Art Director", "Other"
  ],
  "Engineering & Manufacturing": [
    "Mechanical Engineer", "Sr. Mechanical Engineer",
    "Civil Engineer", "Sr. Civil Engineer",
    "Electrical Engineer", "Sr. Electrical Engineer",
    "Electronics Engineer", "Sr. Electronics Engineer",
    "Chemical Engineer", "Sr. Chemical Engineer",
    "Production Engineer", "Sr. Production Engineer",
    "Quality Engineer", "Sr. Quality Engineer",
    "Maintenance Engineer", "Sr. Maintenance Engineer",
    "Structural Engineer", "Sr. Structural Engineer",
    "AutoCAD Designer", "Sr. AutoCAD Designer",
    "Site Engineer", "Sr. Site Engineer",
    "Safety Officer", "Sr. Safety Officer",
    "Manufacturing Engineer", "Sr. Manufacturing Engineer",
    "Process Engineer", "Sr. Process Engineer", "Other"
  ],
  "Operations & Logistics": [
    "Operations Executive", "Sr. Operations Executive",
    "Operations Manager", "Sr. Operations Manager",
    "Supply Chain Manager", "Sr. Supply Chain Manager",
    "Logistics Coordinator", "Sr. Logistics Coordinator",
    "Warehouse Manager", "Sr. Warehouse Manager",
    "Procurement Executive", "Sr. Procurement Executive",
    "Inventory Manager", "Sr. Inventory Manager",
    "Import/Export Executive", "Sr. Import/Export Executive",
    "Fleet Manager", "Sr. Fleet Manager", "Other"
  ],
  "Healthcare": [
    "Doctor (General Physician)", "Specialist Doctor",
    "Nurse", "Sr. Nurse", "Head Nurse",
    "Pharmacist", "Sr. Pharmacist",
    "Medical Lab Technician", "Sr. Medical Lab Technician",
    "Physiotherapist", "Sr. Physiotherapist",
    "Radiologist", "Healthcare Administrator",
    "Clinical Research Associate", "Sr. Clinical Research Associate",
    "Hospital Administrator", "Other"
  ],
  "Education": [
    "Teacher", "Sr. Teacher",
    "Lecturer", "Sr. Lecturer",
    "Professor", "Associate Professor",
    "Academic Coordinator", "Sr. Academic Coordinator",
    "Training & Development Manager",
    "Education Counselor", "Sr. Education Counselor",
    "Curriculum Designer", "Tutor", "Other"
  ],
  "Hospitality & Retail": [
    "Hotel Manager", "Sr. Hotel Manager",
    "Front Desk Executive", "Sr. Front Desk Executive",
    "Restaurant Manager", "Sr. Restaurant Manager",
    "Chef", "Sr. Chef", "Executive Chef",
    "Retail Store Manager", "Sr. Retail Store Manager",
    "Customer Service Executive", "Sr. Customer Service Executive",
    "Travel Consultant", "Sr. Travel Consultant",
    "Event Manager", "Sr. Event Manager", "Other"
  ],
  "Fresher / Intern": [
    "Engineering Intern", "MBA Intern",
    "Marketing Intern", "Finance Intern",
    "HR Intern", "IT Intern",
    "Research Intern", "Design Intern",
    "Operations Intern", "Sales Intern",
    "General Fresher", "Graduate Trainee", "Other"
  ]
}

// ─── DATA: COMPANIES ──────────────────────────────────────────────────────────
const COMPANIES = [
  "TCS", "Infosys", "Wipro", "HCL Technologies", "Tech Mahindra", "Mphasis",
  "LTIMindtree", "Hexaware", "Persistent Systems", "Cognizant", "Capgemini India",
  "Accenture India", "L&T Infotech", "Mastech Digital", "Zensar Technologies",
  "Niit Technologies", "Sonata Software", "Cyient", "Tata Elxsi", "KPIT Technologies",
  "Reliance Industries", "Tata Group", "Adani Group", "Mahindra & Mahindra",
  "Bajaj Group", "Birla Group", "Godrej Group", "ITC Limited", "Larsen & Toubro",
  "Hindustan Unilever", "Asian Paints", "Pidilite Industries",
  "State Bank of India (SBI)", "HDFC Bank", "ICICI Bank", "Axis Bank",
  "Kotak Mahindra Bank", "Punjab National Bank", "Bank of Baroda", "Canara Bank",
  "IndusInd Bank", "Yes Bank", "Federal Bank", "RBL Bank", "IDFC First Bank",
  "Union Bank of India", "Indian Bank", "Bank of India", "Central Bank of India",
  "UCO Bank", "Indian Overseas Bank", "South Indian Bank", "Karur Vysya Bank",
  "City Union Bank", "Dhanlaxmi Bank",
  "Bajaj Finance", "Muthoot Finance", "HDFC Ltd", "LIC", "Paytm", "PhonePe",
  "Razorpay", "CRED", "BharatPe", "Zerodha", "Groww", "Upstox", "PolicyBazaar",
  "Lendingkart", "Capital Float", "Slice", "Jupiter", "Fi Money", "Navi",
  "Flipkart", "Myntra", "Meesho", "Nykaa", "Swiggy", "Zomato", "Ola", "Rapido",
  "Urban Company", "BYJU'S", "Unacademy", "upGrad", "Vedantu", "Dunzo",
  "BigBasket", "Lenskart", "Boat", "Dream11", "MPL", "ShareChat", "Dailyhunt",
  "InMobi", "Freshworks", "Zoho", "Postman", "BrowserStack", "Chargebee",
  "Clevertap", "MoEngage", "Darwinbox", "Leadsquared", "Whatfix", "Hasura",
  "Ather Energy", "Ola Electric", "Bounce", "Yulu",
  "Sun Pharma", "Dr. Reddy's", "Cipla", "Lupin", "Biocon", "Apollo Hospitals",
  "Fortis Healthcare", "Max Healthcare", "Manipal Hospitals", "Narayana Health",
  "Medanta", "Aster DM Healthcare",
  "Maruti Suzuki", "Hyundai India", "Tata Motors", "Bajaj Auto", "Hero MotoCorp",
  "TVS Motor", "Ashok Leyland", "Bharat Forge", "JSW Steel", "Tata Steel",
  "SAIL", "Hindalco", "Vedanta", "ONGC", "IOC", "BPCL", "HPCL",
  "Airtel", "Jio", "BSNL", "Vi (Vodafone Idea)", "Zee Entertainment",
  "Sony India", "Star India", "Times Group", "Network18", "TV18",
  "ISRO", "DRDO", "HAL", "BEL", "BHEL", "NTPC", "Power Grid", "GAIL",
  "Coal India", "Airports Authority of India", "Indian Railways",
  "Google", "Microsoft", "Amazon", "Apple", "Meta", "IBM", "Oracle", "SAP",
  "Adobe", "Salesforce", "Deloitte", "EY", "PwC", "KPMG", "McKinsey & Company",
  "BCG", "Bain & Company", "JP Morgan", "Goldman Sachs", "Morgan Stanley",
  "Citibank", "Deutsche Bank", "HSBC", "Standard Chartered", "Barclays",
  "Unilever", "P&G", "Nestlé", "Samsung", "LG", "Bosch", "Siemens",
  "3M", "GE", "Honeywell", "Caterpillar", "Cummins", "ABB", "Schneider Electric",
  "Cisco", "Intel", "Qualcomm", "Texas Instruments", "NXP Semiconductors",
  "Micron Technology", "Western Digital", "Seagate",
  "Uber", "Airbnb", "Booking.com", "Expedia", "Agoda",
  "Netflix", "Spotify", "LinkedIn", "PayPal", "eBay",
  "Other"
]

// ─── DATA: COURSES ────────────────────────────────────────────────────────────
const COURSES = [
  "B.Tech - Computer Science & Engineering",
  "B.Tech - Information Technology",
  "B.Tech - Electronics & Communication Engineering",
  "B.Tech - Electrical Engineering",
  "B.Tech - Mechanical Engineering",
  "B.Tech - Civil Engineering",
  "B.Tech - Chemical Engineering",
  "B.Tech - Aerospace Engineering",
  "B.Tech - Biotechnology",
  "B.Tech - Data Science & Engineering",
  "B.E. - Computer Science",
  "B.E. - Mechanical Engineering",
  "B.E. - Civil Engineering",
  "B.E. - Electrical Engineering",
  "B.E. - Electronics Engineering",
  "M.Tech - Computer Science",
  "M.Tech - Data Science",
  "M.Tech - Artificial Intelligence",
  "M.Tech - VLSI Design",
  "M.Tech - Mechanical Engineering",
  "M.Tech - Civil Engineering",
  "M.E. - Computer Science",
  "M.E. - Mechanical Engineering",
  "MBA - Finance",
  "MBA - Marketing",
  "MBA - Human Resources",
  "MBA - Operations Management",
  "MBA - Business Analytics",
  "MBA - International Business",
  "MBA - Entrepreneurship",
  "MBA - Supply Chain Management",
  "MBA - Information Technology",
  "MBA - General Management",
  "PGDM - Finance",
  "PGDM - Marketing",
  "PGDM - HR",
  "PGDM - Operations",
  "PGDM - Business Analytics",
  "Executive MBA",
  "B.Sc - Computer Science",
  "B.Sc - Information Technology",
  "B.Sc - Physics",
  "B.Sc - Chemistry",
  "B.Sc - Mathematics",
  "B.Sc - Statistics",
  "B.Sc - Data Science",
  "B.Sc - Biotechnology",
  "B.Sc - Microbiology",
  "M.Sc - Computer Science",
  "M.Sc - Data Science",
  "M.Sc - Artificial Intelligence",
  "M.Sc - Statistics",
  "M.Sc - Physics",
  "M.Sc - Chemistry",
  "M.Sc - Mathematics",
  "MCA - Master of Computer Applications",
  "BCA - Bachelor of Computer Applications",
  "B.Com - Bachelor of Commerce",
  "B.Com (Hons) - Commerce",
  "M.Com - Master of Commerce",
  "CA - Chartered Accountancy",
  "CMA - Cost & Management Accountancy",
  "CS - Company Secretary",
  "BBA - Bachelor of Business Administration",
  "BMS - Bachelor of Management Studies",
  "BAF - Banking & Finance",
  "BBI - Banking & Insurance",
  "CFA - Chartered Financial Analyst",
  "FRM - Financial Risk Manager",
  "CFP - Certified Financial Planner",
  "BA - English",
  "BA - Economics",
  "BA - Political Science",
  "BA - Psychology",
  "BA - Sociology",
  "BA - History",
  "BA - Philosophy",
  "BA - Geography",
  "MA - English",
  "MA - Economics",
  "MA - Psychology",
  "MA - Political Science",
  "MA - Sociology",
  "B.Des - Bachelor of Design",
  "M.Des - Master of Design",
  "BFA - Bachelor of Fine Arts",
  "MFA - Master of Fine Arts",
  "Diploma in Graphic Design",
  "Diploma in UI/UX Design",
  "Diploma in Animation & VFX",
  "BA - Mass Communication",
  "BMM - Bachelor of Mass Media",
  "BA - Journalism",
  "MA - Mass Communication",
  "LLB - Bachelor of Laws",
  "LLM - Master of Laws",
  "BA LLB - Integrated Law",
  "BBA LLB - Integrated Law",
  "B.Com LLB - Integrated Law",
  "MBBS",
  "BDS - Bachelor of Dental Surgery",
  "BAMS - Ayurvedic Medicine",
  "BHMS - Homeopathic Medicine",
  "B.Pharm - Bachelor of Pharmacy",
  "M.Pharm - Master of Pharmacy",
  "Pharm.D",
  "BPT - Bachelor of Physiotherapy",
  "B.Sc Nursing",
  "M.Sc Nursing",
  "MD - Doctor of Medicine",
  "MS - Master of Surgery",
  "MPH - Master of Public Health",
  "Diploma in Computer Science",
  "Diploma in Mechanical Engineering",
  "Diploma in Electrical Engineering",
  "Diploma in Civil Engineering",
  "Diploma in Electronics",
  "Diploma in Chemical Engineering",
  "ITI - Information Technology",
  "ITI - Electrician",
  "ITI - Fitter",
  "ITI - Machinist",
  "Polytechnic Diploma",
  "Ph.D - Computer Science",
  "Ph.D - Engineering",
  "Ph.D - Management",
  "Ph.D - Sciences",
  "Ph.D - Humanities",
  "Other"
]

// ─── DATA: COLLEGES ───────────────────────────────────────────────────────────
const COLLEGES = [
  "IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kanpur", "IIT Kharagpur",
  "IIT Roorkee", "IIT Guwahati", "IIT Hyderabad", "IIT BHU (Varanasi)",
  "IIT Indore", "IIT Tirupati", "ISM Dhanbad (IIT)", "IIT Mandi", "IIT Patna",
  "IIT Jodhpur", "IIT Gandhinagar", "IIT Bhubaneswar", "IIT Ropar",
  "IIT Palakkad", "IIT Jammu", "IIT Bhilai", "IIT Dharwad", "IIT Goa",
  "NIT Trichy", "NIT Warangal", "NIT Surathkal (NITK)", "NIT Calicut",
  "NIT Rourkela", "MNNIT Allahabad", "NIT Kurukshetra", "MNIT Jaipur",
  "NIT Durgapur", "NIT Patna", "SVNIT Surat", "VNIT Nagpur", "NIT Hamirpur",
  "NIT Silchar", "NIT Agartala", "NIT Srinagar", "NIT Meghalaya",
  "IIM Ahmedabad", "IIM Bangalore", "IIM Calcutta", "IIM Lucknow",
  "IIM Kozhikode", "IIM Indore", "IIM Shillong", "IIM Udaipur",
  "IIM Ranchi", "IIM Raipur", "IIM Tiruchirappalli", "IIM Visakhapatnam",
  "IIM Bodhgaya", "IIM Amritsar", "IIM Jammu", "IIM Nagpur",
  "IIM Sambalpur", "IIM Sirmaur", "IIM Kashipur",
  "Delhi University", "JNU (Jawaharlal Nehru University)",
  "BHU (Banaras Hindu University)", "University of Hyderabad",
  "Jadavpur University", "Jamia Millia Islamia", "AMU (Aligarh Muslim University)",
  "Pondicherry University", "TISS (Tata Institute of Social Sciences)",
  "EFLU (English & Foreign Languages University)", "IGNOU",
  "BITS Pilani", "BITS Goa", "BITS Hyderabad",
  "VIT Vellore", "VIT Chennai", "VIT Bhopal", "VIT AP",
  "Manipal Institute of Technology", "Manipal University",
  "SRM University Chennai", "SRM University Delhi-NCR",
  "Amity University Noida", "Amity University Mumbai",
  "Symbiosis Institute of Technology", "Symbiosis (SIBM)",
  "Christ University Bangalore", "Ashoka University",
  "Azim Premji University", "OP Jindal University",
  "Shiv Nadar University", "Bennett University",
  "Thapar University", "PES University", "RV College of Engineering",
  "MS Ramaiah Institute of Technology", "BMS College of Engineering",
  "PSG College of Technology", "SSN College of Engineering",
  "KJ Somaiya College", "NMIMS University", "Narsee Monjee",
  "Welingkar Institute", "SP Jain School of Management",
  "Great Lakes Institute of Management", "XLRI Jamshedpur",
  "MDI Gurgaon", "SPJIMR Mumbai", "FMS Delhi", "IIFT Delhi",
  "IMT Ghaziabad", "TAPMI Manipal", "XIMB Bhubaneswar",
  "COEP Pune (College of Engineering Pune)",
  "PICT Pune", "VJTI Mumbai", "ICT Mumbai",
  "St. Xavier's College Mumbai", "St. Xavier's College Kolkata",
  "Loyola College Chennai", "Presidency College Chennai",
  "Presidency University Kolkata",
  "Lady Shri Ram College Delhi", "Miranda House Delhi",
  "St. Stephen's College Delhi", "Hindu College Delhi",
  "Hansraj College Delhi", "SRCC Delhi",
  "Fergusson College Pune", "St. Joseph's College Bangalore",
  "Mount Carmel College", "Stella Maris College Chennai",
  "Mumbai University", "Pune University (SPPU)",
  "Anna University Chennai", "Osmania University Hyderabad",
  "Bangalore University", "Calcutta University",
  "Madras University", "Gujarat University",
  "Rajasthan University", "Punjab University Chandigarh",
  "Mysore University", "Andhra University",
  "Gauhati University", "Dibrugarh University",
  "Lucknow University", "Allahabad University",
  "Patna University", "Ranchi University",
  "AIIMS Delhi", "AIIMS Bhopal", "AIIMS Jodhpur", "AIIMS Patna",
  "AIIMS Rishikesh", "AIIMS Bhubaneswar", "JIPMER Pondicherry",
  "CMC Vellore (Christian Medical College)",
  "KEM Hospital Mumbai", "Grant Medical College Mumbai",
  "Maulana Azad Medical College Delhi",
  "Seth GS Medical College Mumbai", "BJ Medical College Pune",
  "Kasturba Medical College Manipal",
  "NLSIU Bangalore (National Law School)",
  "NALSAR Hyderabad", "NUJS Kolkata", "NLU Delhi",
  "NLU Jodhpur", "GNLU Gandhinagar",
  "Faculty of Law Delhi University", "ILS Law College Pune",
  "Government Law College Mumbai",
  "NID Ahmedabad (National Institute of Design)",
  "NID Delhi", "NID Bangalore",
  "NIFT Delhi", "NIFT Mumbai", "NIFT Bangalore", "NIFT Chennai",
  "Srishti Institute Bangalore", "Pearl Academy",
  "MIT Institute of Design Pune",
  "Sir JJ School of Art Mumbai",
  "Other"
]

// ─── DATA: MONTHS & YEARS ─────────────────────────────────────────────────────
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]
const YEARS = Array.from({ length: 26 }, (_, i) => (2025 - i).toString())

// ─── DATA: SMART SUGGESTIONS ──────────────────────────────────────────────────
const SUGGESTIONS = {
  "Software Engineer": [
    "Developed and maintained scalable web applications using modern frameworks",
    "Collaborated with cross-functional teams to deliver product features on time",
    "Improved application performance by 30% through code optimisation",
    "Participated in code reviews to ensure code quality and best practices",
    "Designed and implemented RESTful APIs for frontend-backend integration",
    "Wrote unit and integration tests achieving 85%+ code coverage"
  ],
  "Sr. Software Engineer": [
    "Led a team of 5 engineers to deliver high-impact product features",
    "Architected microservices-based solutions to improve system scalability",
    "Mentored junior developers and conducted regular code reviews",
    "Reduced system downtime by 40% through proactive monitoring",
    "Drove technical discussions and aligned stakeholders on engineering decisions",
    "Implemented CI/CD pipelines reducing deployment time by 60%"
  ],
  "Frontend Developer": [
    "Built responsive, accessible UI components using React and Tailwind CSS",
    "Optimised page load times by 40% using lazy loading and code splitting",
    "Integrated REST APIs and managed application state using Redux",
    "Ensured cross-browser compatibility across Chrome, Firefox, and Safari",
    "Collaborated with designers to translate Figma mockups into pixel-perfect UI",
    "Built reusable component libraries improving development speed"
  ],
  "Backend Developer": [
    "Designed and built RESTful APIs serving 100K+ daily requests",
    "Optimised database queries reducing response time by 50%",
    "Implemented JWT-based authentication and role-based access control",
    "Deployed and managed applications on AWS using EC2 and RDS",
    "Built event-driven architecture using message queues for async processing",
    "Maintained comprehensive API documentation using Swagger"
  ],
  "Full Stack Developer": [
    "Developed end-to-end features across frontend (React) and backend (Node.js)",
    "Built and deployed full-stack applications on cloud platforms",
    "Integrated third-party APIs including payment gateways and maps",
    "Managed MySQL/MongoDB databases with efficient schema design",
    "Implemented real-time features using WebSockets",
    "Reduced technical debt by refactoring legacy codebase"
  ],
  "Data Analyst": [
    "Analysed large datasets using Python and SQL to derive actionable insights",
    "Created interactive dashboards in Power BI/Tableau for business stakeholders",
    "Automated reporting workflows saving 10+ hours per week",
    "Conducted A/B testing and statistical analysis to support product decisions",
    "Cleaned and preprocessed datasets improving data quality by 25%",
    "Presented data-driven recommendations to senior management"
  ],
  "Data Scientist": [
    "Built machine learning models with 90%+ accuracy for business predictions",
    "Deployed ML models to production using Flask and Docker",
    "Performed feature engineering and model tuning to improve performance",
    "Collaborated with product teams to define data science use cases",
    "Used NLP techniques to analyse customer feedback at scale",
    "Reduced customer churn by 15% through predictive modelling"
  ],
  "Marketing Executive": [
    "Planned and executed digital marketing campaigns across social media channels",
    "Managed Google Ads campaigns with ₹10L+ monthly budget",
    "Increased organic traffic by 45% through SEO content strategy",
    "Generated 500+ qualified leads per month through inbound marketing",
    "Collaborated with design team to create engaging marketing materials",
    "Tracked KPIs and prepared weekly performance reports for management"
  ],
  "Sales Executive": [
    "Consistently achieved 120% of monthly sales targets",
    "Managed a portfolio of 50+ B2B clients across the region",
    "Generated ₹50L+ in revenue through new client acquisitions",
    "Conducted product demos and presentations to CXO-level stakeholders",
    "Built and maintained strong relationships with key accounts",
    "Identified upselling opportunities increasing average deal size by 25%"
  ],
  "Business Development Executive": [
    "Identified and onboarded 20+ new business partners in the first quarter",
    "Built a sales pipeline worth ₹1Cr+ through outbound prospecting",
    "Negotiated and closed enterprise contracts with Fortune 500 companies",
    "Conducted market research to identify new revenue opportunities",
    "Collaborated with product teams to align offerings with market needs",
    "Represented the company at industry events and conferences"
  ],
  "HR Executive": [
    "Managed end-to-end recruitment for 30+ positions across departments",
    "Reduced time-to-hire by 20% by optimising the interview process",
    "Onboarded 50+ new employees ensuring a smooth joining experience",
    "Processed monthly payroll for 200+ employees with 100% accuracy",
    "Organised employee engagement activities improving satisfaction scores",
    "Maintained HR records and ensured compliance with labour laws"
  ],
  "Accountant": [
    "Prepared and maintained accurate financial statements and ledgers",
    "Filed GST, TDS, and income tax returns in compliance with regulations",
    "Reconciled bank statements and resolved discrepancies promptly",
    "Assisted in annual audit preparation and coordinated with auditors",
    "Managed accounts payable/receivable and improved collection cycle",
    "Reduced month-end closing time by 30% through process automation"
  ],
  "Graphic Designer": [
    "Created visual assets for social media, print, and digital campaigns",
    "Designed brand identities including logos, typography, and colour palettes",
    "Produced marketing collaterals — brochures, banners, and presentations",
    "Collaborated with marketing and product teams to deliver design on time",
    "Maintained brand consistency across all communication materials",
    "Managed 10+ client projects simultaneously meeting all deadlines"
  ],
  "UI/UX Designer": [
    "Conducted user research and usability testing to inform design decisions",
    "Created wireframes, prototypes, and high-fidelity mockups in Figma",
    "Improved user retention by 25% through data-driven UX improvements",
    "Designed responsive interfaces for mobile and web platforms",
    "Collaborated with developers to ensure pixel-perfect implementation",
    "Built and maintained a comprehensive design system for consistent UI"
  ],
  "Mechanical Engineer": [
    "Designed mechanical components using CAD software (SolidWorks, AutoCAD)",
    "Conducted stress analysis and FEA simulations for product validation",
    "Reduced material costs by 15% through design optimisation",
    "Coordinated with manufacturing team to ensure design feasibility",
    "Prepared technical drawings and BOMs for production",
    "Participated in root cause analysis and implemented corrective actions"
  ],
  "Civil Engineer": [
    "Supervised construction of residential/commercial projects worth ₹5Cr+",
    "Prepared structural drawings and ensured compliance with IS codes",
    "Managed site activities coordinating with contractors and vendors",
    "Conducted quality checks and material testing at project stages",
    "Reduced project completion time by 10% through effective planning",
    "Prepared BOQ and assisted in cost estimation for tenders"
  ],
  "Operations Executive": [
    "Managed day-to-day operations ensuring smooth workflow across departments",
    "Reduced operational costs by 20% through process improvement initiatives",
    "Coordinated with vendors and ensured timely procurement of resources",
    "Prepared MIS reports and dashboards for senior management",
    "Implemented SOPs improving team efficiency by 30%",
    "Handled escalations and resolved operational issues within SLA"
  ],
  "Banking Executive": [
    "Handled customer account opening, KYC verification and documentation",
    "Processed loan applications and coordinated with credit team for approvals",
    "Achieved 110% of cross-selling targets for banking products",
    "Maintained accurate records and ensured regulatory compliance",
    "Resolved customer queries and complaints within defined TAT",
    "Conducted financial need analysis and recommended suitable products"
  ],
  "Relationship Manager": [
    "Managed a portfolio of 150+ HNI clients with AUM of ₹50Cr+",
    "Achieved 130% of quarterly revenue targets consistently",
    "Provided personalised financial planning and investment advice",
    "Acquired 20+ new HNI clients through referrals and networking",
    "Conducted regular portfolio reviews and rebalancing discussions",
    "Ensured highest level of client satisfaction with zero escalations"
  ],
  "General Fresher": [
    "Completed academic projects demonstrating strong analytical skills",
    "Participated in college technical/cultural events in leadership roles",
    "Proficient in Microsoft Office Suite — Word, Excel, PowerPoint",
    "Completed online certifications in relevant tools and technologies",
    "Strong team player with excellent communication skills",
    "Eager to learn and contribute to organisational goals"
  ],
  "Engineering Intern": [
    "Assisted senior engineers in designing and testing software modules",
    "Gained hands-on experience with industry-standard tools and workflows",
    "Completed assigned tasks within deadlines with minimal supervision",
    "Documented technical processes and contributed to the knowledge base",
    "Participated in daily standups and sprint planning meetings",
    "Received appreciation for proactive attitude and quick learning ability"
  ]
}

const getSuggestions = (jobTitle) => {
  if (!jobTitle) return []
  if (SUGGESTIONS[jobTitle]) return SUGGESTIONS[jobTitle]
  const key = Object.keys(SUGGESTIONS).find(k =>
    jobTitle.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(jobTitle.toLowerCase())
  )
  return key ? SUGGESTIONS[key] : SUGGESTIONS["General Fresher"]
}

// ─── COMPONENT: Searchable Dropdown ──────────────────────────────────────────
function SearchableDropdown({ options, value, onChange, placeholder, label }) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [showOther, setShowOther] = useState(false)
  const [otherValue, setOtherValue] = useState('')

  const filtered = options.filter(o =>
    o.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 60)

  const handleSelect = (option) => {
    if (option === 'Other') {
      setShowOther(true)
      setOpen(false)
    } else {
      onChange(option)
      setOpen(false)
      setSearch('')
      setShowOther(false)
    }
  }

  return (
    <div className="relative">
      {label && <label className="block text-sm font-semibold mb-2 text-gray-700">{label}</label>}
      <div
        className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer flex justify-between items-center bg-white hover:border-blue-400 transition"
        onClick={() => setOpen(!open)}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>{value || placeholder}</span>
        <span className="text-gray-400 text-xs">{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-2xl mt-1 max-h-64 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={e => e.stopPropagation()}
            />
          </div>
          <div className="overflow-y-auto max-h-48">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-gray-500 text-sm">No results — try typing "Other"</div>
            ) : (
              filtered.map((option, i) => (
                <div key={i} onClick={() => handleSelect(option)}
                  className={`px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm ${value === option ? 'bg-blue-100 font-semibold text-blue-700' : ''}`}>
                  {option}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {showOther && (
        <div className="mt-2 flex gap-2">
          <input
            autoFocus
            type="text"
            value={otherValue}
            onChange={e => setOtherValue(e.target.value)}
            placeholder={`Type ${placeholder?.toLowerCase() || 'value'}...`}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={e => {
              if (e.key === 'Enter' && otherValue.trim()) {
                onChange(otherValue.trim()); setShowOther(false); setOtherValue('')
              }
            }}
          />
          <button
            onClick={() => { if (otherValue.trim()) { onChange(otherValue.trim()); setShowOther(false); setOtherValue('') } }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
          >OK</button>
        </div>
      )}
    </div>
  )
}

// ─── COMPONENT: Job Role Dropdown (grouped) ───────────────────────────────────
function JobRoleDropdown({ value, onChange }) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [showOther, setShowOther] = useState(false)
  const [otherValue, setOtherValue] = useState('')

  const filteredGroups = Object.entries(JOB_ROLES).map(([group, roles]) => ({
    group,
    roles: roles.filter(r => r.toLowerCase().includes(search.toLowerCase()))
  })).filter(({ roles }) => roles.length > 0)

  const handleSelect = (role) => {
    if (role === 'Other') {
      setShowOther(true)
      setOpen(false)
    } else {
      onChange(role)
      setOpen(false)
      setSearch('')
      setShowOther(false)
    }
  }

  return (
    <div className="relative">
      <label className="block text-sm font-semibold mb-2 text-gray-700">
        Job Title <span className="text-red-500">*</span>
      </label>
      <div
        className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer flex justify-between items-center bg-white hover:border-blue-400 transition"
        onClick={() => setOpen(!open)}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>{value || 'Select job title...'}</span>
        <span className="text-gray-400 text-xs">{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-2xl mt-1 max-h-72 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search job title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={e => e.stopPropagation()}
            />
          </div>
          <div className="overflow-y-auto max-h-56">
            {filteredGroups.map(({ group, roles }) => (
              <div key={group}>
                <div className="px-4 py-1 bg-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  {group}
                </div>
                {roles.map((role, i) => (
                  <div key={i} onClick={() => handleSelect(role)}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm ${value === role ? 'bg-blue-100 font-semibold text-blue-700' : ''}`}>
                    {role}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      {showOther && (
        <div className="mt-2 flex gap-2">
          <input
            autoFocus
            type="text"
            value={otherValue}
            onChange={e => setOtherValue(e.target.value)}
            placeholder="Type your job title..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={e => {
              if (e.key === 'Enter' && otherValue.trim()) {
                onChange(otherValue.trim()); setShowOther(false); setOtherValue('')
              }
            }}
          />
          <button
            onClick={() => { if (otherValue.trim()) { onChange(otherValue.trim()); setShowOther(false); setOtherValue('') } }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
          >OK</button>
        </div>
      )}
    </div>
  )
}

// ─── COMPONENT: Month-Year Picker ─────────────────────────────────────────────
function MonthYearPicker({ label, monthValue, yearValue, onMonthChange, onYearChange, required, allowPresent, isPresent, onPresentChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {allowPresent && (
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            id={`present-${label}`}
            checked={isPresent}
            onChange={e => onPresentChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 cursor-pointer"
          />
          <label htmlFor={`present-${label}`} className="text-sm text-gray-700 font-medium cursor-pointer">
            Present (currently here)
          </label>
        </div>
      )}
      {isPresent ? (
        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 font-semibold text-sm">
          ✅ Present
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <select
            value={monthValue}
            onChange={e => onMonthChange(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="">Month</option>
            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select
            value={yearValue}
            onChange={e => onYearChange(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            <option value="">Year</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      )}
    </div>
  )
}

// ─── MAIN BUILDER ─────────────────────────────────────────────────────────────
function Builder() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useUser()
  const { signOut } = useClerk()
  const currentUser = user
  const displayName = currentUser?.firstName || currentUser?.fullName || 'there'

  const [selectedTemplate, setSelectedTemplate] = useState(searchParams.get('template') || 'modern')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [summary, setSummary] = useState('')

  const [workExperiences, setWorkExperiences] = useState([])
  const [currentWork, setCurrentWork] = useState({
    company: '', jobTitle: '', startMonth: '', startYear: '',
    endMonth: '', endYear: '', isPresent: false, description: ''
  })
  const [workErrors, setWorkErrors] = useState({})
  const [dateError, setDateError] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [educationList, setEducationList] = useState([])
  const [currentEducation, setCurrentEducation] = useState({
    school: '', degree: '', startMonth: '', startYear: '',
    endMonth: '', endYear: '', isPresent: false
  })
  const [eduErrors, setEduErrors] = useState({})
  const [eduDateError, setEduDateError] = useState('')

  const [skills, setSkills] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('resumeData')
      if (savedData) {
        const data = JSON.parse(savedData)
        setName(data.name || '')
        setEmail(data.email || '')
        setPhone(data.phone || '')
        setSummary(data.summary || '')
        setWorkExperiences(data.workExperiences || [])
        setEducationList(data.educationList || [])
        setSkills(data.skills || '')
      }
    } catch (e) { console.error(e) }
  }, [])

  useEffect(() => {
    const t = searchParams.get('template')
    if (t) setSelectedTemplate(t)
  }, [searchParams])

  const handleSave = () => {
    localStorage.setItem('resumeData', JSON.stringify({ name, email, phone, summary, workExperiences, educationList, skills, selectedTemplate }))
    alert('✅ Resume saved to browser!')
  }

  const handleClearAll = () => {
    if (!window.confirm('Clear all data? This cannot be undone.')) return
    setName(''); setEmail(''); setPhone(''); setSummary(''); setSkills('')
    setWorkExperiences([]); setEducationList([])
    setCurrentWork({ company: '', jobTitle: '', startMonth: '', startYear: '', endMonth: '', endYear: '', isPresent: false, description: '' })
    setCurrentEducation({ school: '', degree: '', startMonth: '', startYear: '', endMonth: '', endYear: '', isPresent: false })
    localStorage.removeItem('resumeData')
  }

  const formatDate = (month, year, isPresent) => {
    if (isPresent) return 'Present'
    if (month && year) return `${month.slice(0, 3)} ${year}`
    if (year) return year
    return ''
  }

  const isDateAfter = (m1, y1, m2, y2) => {
    if (!y1 || !y2) return false
    if (parseInt(y1) > parseInt(y2)) return true
    if (parseInt(y1) < parseInt(y2)) return false
    return MONTHS.indexOf(m1) > MONTHS.indexOf(m2)
  }

  // Work validation
  const validateWork = () => {
    const errors = {}
    if (!currentWork.company) errors.company = 'Required'
    if (!currentWork.jobTitle) errors.jobTitle = 'Required'
    if (!currentWork.startMonth) errors.startMonth = 'Required'
    if (!currentWork.startYear) errors.startYear = 'Required'
    if (!currentWork.isPresent && !currentWork.endMonth) errors.endMonth = 'Required'
    if (!currentWork.isPresent && !currentWork.endYear) errors.endYear = 'Required'
    if (!currentWork.description) errors.description = 'Required'
    setWorkErrors(errors)
    if (!currentWork.isPresent && currentWork.startMonth && currentWork.startYear && currentWork.endMonth && currentWork.endYear) {
      if (isDateAfter(currentWork.startMonth, currentWork.startYear, currentWork.endMonth, currentWork.endYear)) {
        setDateError('⚠️ End date cannot be before start date')
        return false
      }
    }
    setDateError('')
    return Object.keys(errors).length === 0
  }

  const addWorkExperience = () => {
    if (!validateWork()) return
    setWorkExperiences([...workExperiences, currentWork])
    setCurrentWork({ company: '', jobTitle: '', startMonth: '', startYear: '', endMonth: '', endYear: '', isPresent: false, description: '' })
    setWorkErrors({}); setDateError(''); setShowSuggestions(false)
  }

  const deleteWorkExperience = (index) => setWorkExperiences(workExperiences.filter((_, i) => i !== index))

  // Education validation
  const validateEducation = () => {
    const errors = {}
    if (!currentEducation.school) errors.school = 'Required'
    if (!currentEducation.degree) errors.degree = 'Required'
    if (!currentEducation.startMonth) errors.startMonth = 'Required'
    if (!currentEducation.startYear) errors.startYear = 'Required'
    if (!currentEducation.isPresent && !currentEducation.endMonth) errors.endMonth = 'Required'
    if (!currentEducation.isPresent && !currentEducation.endYear) errors.endYear = 'Required'
    setEduErrors(errors)
    if (!currentEducation.isPresent && currentEducation.startMonth && currentEducation.startYear && currentEducation.endMonth && currentEducation.endYear) {
      if (isDateAfter(currentEducation.startMonth, currentEducation.startYear, currentEducation.endMonth, currentEducation.endYear)) {
        setEduDateError('⚠️ End date cannot be before start date')
        return false
      }
    }
    setEduDateError('')
    return Object.keys(errors).length === 0
  }

  const addEducation = () => {
    if (!validateEducation()) return
    setEducationList([...educationList, currentEducation])
    setCurrentEducation({ school: '', degree: '', startMonth: '', startYear: '', endMonth: '', endYear: '', isPresent: false })
    setEduErrors({}); setEduDateError('')
  }

  const deleteEducation = (index) => setEducationList(educationList.filter((_, i) => i !== index))

  const applySuggestion = (suggestion) => {
    const current = currentWork.description
    setCurrentWork({ ...currentWork, description: current ? current + '\n• ' + suggestion : '• ' + suggestion })
  }

  const handleDownloadClick = () => setShowPaymentModal(true)

  const triggerDownload = () => {
    setIsDownloading(true)
    setShowPaymentModal(false)
    const element = document.getElementById('resume-preview')
    if (!element) { alert('❌ Could not find resume preview'); setIsDownloading(false); return }
    const opt = {
      margin: 10,
      filename: `Resume_${(name || 'Resume').replace(/\s+/g, '_')}_${selectedTemplate}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }
    html2pdf().set(opt).from(element).save()
      .then(() => setIsDownloading(false))
      .catch(() => { setIsDownloading(false); alert('❌ Error generating PDF.') })
  }

  // ── Payment Modal ──
  const PaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 relative">
        <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold">×</button>
        <div className="text-center mb-5">
          <div className="text-4xl mb-3">☕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">This tool is completely free!</h2>
          <p className="text-gray-600">If it helped you, buy me a coffee? 😊</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center mb-5">
          <p className="text-amber-800 font-semibold text-sm">💛 We recommend sending ₹99 or more</p>
          <p className="text-amber-600 text-xs mt-1">100% voluntary — totally up to you!</p>
        </div>
        <div className="text-center mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">Scan with any UPI app to tip</p>
          <div className="flex justify-center">
            <img src="/qr-code.jpg" alt="UPI QR Code" className="w-44 h-44 object-contain border-2 border-gray-200 rounded-xl shadow-md" />
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center mb-5 border border-gray-200">
          <p className="text-xs text-gray-500 mb-1">UPI ID</p>
          <p className="text-base font-bold text-gray-900 select-all">baishaliroy11@ybl</p>
          <p className="text-xs text-gray-400 mt-1">PhonePe / GPay / Paytm / Any UPI app</p>
        </div>
        <button onClick={triggerDownload} disabled={isDownloading}
          className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition shadow-lg flex items-center justify-center gap-2 ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {isDownloading ? '⏳ Generating PDF...' : '📥 Download My Resume'}
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">No payment needed — but your support means a lot! 🙏</p>
      </div>
    </div>
  )

  // ── Templates ──
  const ModernTemplate = () => (
    <div className="p-8 bg-white rounded-xl shadow-xl border border-gray-200">
      <div className="mb-6">
        <button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <span className="mr-2">📥</span> {isDownloading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>
      <div id="resume-preview" className="border-t-2 border-gray-200 pt-6">
        <h2 className="text-xl font-bold mb-8 text-gray-900 flex items-center"><span className="mr-2">👁️</span> Live Preview - Modern</h2>
        <div className="mb-8 pb-8 border-b-2 border-gray-200">
          <h3 className="text-4xl font-bold text-gray-900 mb-3 leading-tight tracking-tight">{name || 'Your Name'}</h3>
          <p className="text-base text-gray-600 mb-1">{email || 'your.email@example.com'}</p>
          <p className="text-base text-gray-600">{phone || '+91 98765 43210'}</p>
        </div>
        {summary && (<div className="mb-8 pb-8 border-b-2 border-gray-200"><h3 className="text-xl font-bold text-blue-600 mb-4 uppercase tracking-wide">Professional Summary</h3><p className="text-base text-gray-700 leading-relaxed">{summary}</p></div>)}
        {workExperiences.length > 0 && (<div className="mb-8 pb-8 border-b-2 border-gray-200"><h3 className="text-xl font-bold text-blue-600 mb-6 uppercase tracking-wide">Work Experience</h3><div className="space-y-6">{workExperiences.map((exp, i) => (<div key={i}><p className="text-xl font-bold text-gray-900 mb-1">{exp.jobTitle}</p><p className="text-base text-blue-600 font-semibold mb-1">{exp.company}</p><p className="text-sm text-gray-500 mb-3 italic">{formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p><p className="text-base text-gray-700 whitespace-pre-line leading-relaxed">{exp.description}</p></div>))}</div></div>)}
        {educationList.length > 0 && (<div className="mb-8 pb-8 border-b-2 border-gray-200"><h3 className="text-xl font-bold text-blue-600 mb-6 uppercase tracking-wide">Education</h3><div className="space-y-5">{educationList.map((edu, i) => (<div key={i}><p className="text-lg font-bold text-gray-900 mb-1">{edu.school}</p><p className="text-base text-gray-700 mb-1">{edu.degree}</p><p className="text-sm text-gray-500 italic">{formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div></div>)}
        {skills && (<div className="mb-6"><h3 className="text-xl font-bold text-blue-600 mb-5 uppercase tracking-wide">Skills</h3><div className="flex flex-wrap gap-3">{skills.split(',').map((s, i) => s.trim() && (<span key={i} className="px-5 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-900 rounded-full text-base font-semibold border-2 border-blue-200">{s.trim()}</span>))}</div></div>)}
      </div>
    </div>
  )

  const ClassicTemplate = () => (
    <div className="p-10 bg-white shadow-xl border-4 border-gray-900">
      <div className="mb-6"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gray-900 text-white py-4 px-6 font-bold text-lg hover:bg-gray-800 transition flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}><span className="mr-2">📥</span> {isDownloading ? 'Generating PDF...' : 'Download PDF'}</button></div>
      <div id="resume-preview" className="border-t-4 border-gray-900 pt-8">
        <h2 className="text-xl font-bold mb-8 text-gray-900 text-center uppercase tracking-wider">Live Preview - Classic</h2>
        <div className="mb-10 text-center"><h3 className="text-5xl font-bold text-gray-900 mb-3 uppercase tracking-tight">{name || 'Your Name'}</h3><div className="flex items-center justify-center gap-3 text-base text-gray-700"><span>{email || 'your.email@example.com'}</span><span className="font-bold">•</span><span>{phone || '+91 98765 43210'}</span></div></div>
        {summary && (<div className="mb-10"><h3 className="text-lg font-bold text-gray-900 mb-4 uppercase border-b-4 border-gray-900 pb-2 tracking-wider">Professional Summary</h3><p className="text-base text-gray-800 leading-relaxed">{summary}</p></div>)}
        {workExperiences.length > 0 && (<div className="mb-10"><h3 className="text-lg font-bold text-gray-900 mb-5 uppercase border-b-4 border-gray-900 pb-2 tracking-wider">Professional Experience</h3><div className="space-y-6">{workExperiences.map((exp, i) => (<div key={i}><p className="font-bold text-gray-900 text-lg mb-1">{exp.jobTitle}</p><p className="text-base text-gray-800 italic mb-2">{exp.company} | {formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p><p className="text-base text-gray-800 whitespace-pre-line leading-relaxed">{exp.description}</p></div>))}</div></div>)}
        {educationList.length > 0 && (<div className="mb-10"><h3 className="text-lg font-bold text-gray-900 mb-5 uppercase border-b-4 border-gray-900 pb-2 tracking-wider">Education</h3><div className="space-y-4">{educationList.map((edu, i) => (<div key={i}><p className="font-bold text-gray-900 text-base">{edu.school}</p><p className="text-base text-gray-800">{edu.degree} | {formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div></div>)}
        {skills && (<div className="mb-6"><h3 className="text-lg font-bold text-gray-900 mb-4 uppercase border-b-4 border-gray-900 pb-2 tracking-wider">Skills</h3><p className="text-base text-gray-800">{skills.split(',').map(s => s.trim()).filter(Boolean).join(' • ')}</p></div>)}
      </div>
    </div>
  )

  const MinimalTemplate = () => (
    <div className="p-12 bg-white">
      <div className="mb-6"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-black text-white py-4 px-6 font-medium text-lg hover:bg-gray-800 transition flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}><span className="mr-2">📥</span> {isDownloading ? 'Generating PDF...' : 'Download PDF'}</button></div>
      <div id="resume-preview" className="border-t border-gray-300 pt-10">
        <h2 className="text-lg font-medium mb-10 text-gray-900 text-center tracking-wide">Live Preview - Minimal</h2>
        <div className="mb-12"><h3 className="text-6xl font-light text-gray-900 mb-4 tracking-tight">{name || 'Your Name'}</h3><p className="text-base text-gray-600">{email || 'your.email@example.com'}</p><p className="text-base text-gray-600">{phone || '+91 98765 43210'}</p></div>
        {summary && (<div className="mb-12"><h3 className="text-sm font-semibold text-gray-900 mb-4 tracking-widest uppercase">About</h3><p className="text-base text-gray-700 leading-relaxed font-light">{summary}</p></div>)}
        {workExperiences.length > 0 && (<div className="mb-12"><h3 className="text-sm font-semibold text-gray-900 mb-6 tracking-widest uppercase">Experience</h3><div className="space-y-8">{workExperiences.map((exp, i) => (<div key={i}><p className="text-lg font-medium text-gray-900 mb-1">{exp.jobTitle}</p><p className="text-base text-gray-600 font-light mb-1">{exp.company}</p><p className="text-sm text-gray-500 mb-3 font-light">{formatDate(exp.startMonth, exp.startYear)} — {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p><p className="text-base text-gray-700 whitespace-pre-line leading-relaxed font-light">{exp.description}</p></div>))}</div></div>)}
        {educationList.length > 0 && (<div className="mb-12"><h3 className="text-sm font-semibold text-gray-900 mb-6 tracking-widest uppercase">Education</h3><div className="space-y-5">{educationList.map((edu, i) => (<div key={i}><p className="text-base font-medium text-gray-900">{edu.school}</p><p className="text-base text-gray-700 font-light">{edu.degree}</p><p className="text-sm text-gray-500 font-light">{formatDate(edu.startMonth, edu.startYear)} — {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div></div>)}
        {skills && (<div className="mb-6"><h3 className="text-sm font-semibold text-gray-900 mb-5 tracking-widest uppercase">Skills</h3><div className="flex flex-wrap gap-4">{skills.split(',').map((s, i) => s.trim() && (<span key={i} className="text-base text-gray-700 font-light">{s.trim()}</span>))}</div></div>)}
      </div>
    </div>
  )

  const CreativeTemplate = () => (
    <div className="p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-xl shadow-2xl border-4 border-purple-300">
      <div className="mb-6"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}><span className="mr-2">📥</span> {isDownloading ? 'Generating PDF...' : 'Download PDF'}</button></div>
      <div id="resume-preview" className="bg-white rounded-2xl p-8 shadow-xl">
        <h2 className="text-xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 flex items-center"><span className="mr-2">✨</span> Live Preview - Creative</h2>
        <div className="mb-8 pb-8 border-b-2 border-purple-200"><h3 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 mb-4 leading-tight">{name || 'Your Name'}</h3><p className="text-base text-gray-700 font-medium">{email || 'your.email@example.com'}</p><p className="text-base text-gray-700 font-medium">{phone || '+91 98765 43210'}</p></div>
        {summary && (<div className="mb-8 pb-8 border-b-2 border-purple-200"><div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-5 border-l-4 border-purple-500"><h3 className="text-lg font-bold text-purple-900 mb-3 uppercase tracking-wide">💫 About Me</h3><p className="text-base text-gray-800 leading-relaxed">{summary}</p></div></div>)}
        {workExperiences.length > 0 && (<div className="mb-8 pb-8 border-b-2 border-purple-200"><h3 className="text-lg font-bold text-purple-600 mb-6 uppercase tracking-wide flex items-center"><span className="mr-2">💼</span> Work Experience</h3><div className="space-y-6">{workExperiences.map((exp, i) => (<div key={i} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border-l-4 border-pink-500"><p className="text-xl font-bold text-gray-900 mb-1">{exp.jobTitle}</p><p className="text-base text-purple-600 font-bold mb-1">{exp.company}</p><p className="text-sm text-gray-600 mb-3 italic">{formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p><p className="text-base text-gray-800 whitespace-pre-line leading-relaxed">{exp.description}</p></div>))}</div></div>)}
        {educationList.length > 0 && (<div className="mb-8 pb-8 border-b-2 border-purple-200"><h3 className="text-lg font-bold text-purple-600 mb-6 uppercase tracking-wide flex items-center"><span className="mr-2">🎓</span> Education</h3><div className="space-y-5">{educationList.map((edu, i) => (<div key={i} className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-5 border-l-4 border-orange-500"><p className="text-lg font-bold text-gray-900 mb-1">{edu.school}</p><p className="text-base text-gray-800 mb-1">{edu.degree}</p><p className="text-sm text-gray-600 italic">{formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div></div>)}
        {skills && (<div className="mb-6"><h3 className="text-lg font-bold text-purple-600 mb-5 uppercase tracking-wide flex items-center"><span className="mr-2">⚡</span> Skills</h3><div className="flex flex-wrap gap-3">{skills.split(',').map((s, i) => s.trim() && (<span key={i} className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-base font-bold shadow-lg">{s.trim()}</span>))}</div></div>)}
      </div>
    </div>
  )

  const ProfessionalTemplate = () => (
    <div className="p-10 bg-white shadow-2xl border-l-8 border-blue-600">
      <div className="mb-6"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}><span className="mr-2">📥</span> {isDownloading ? 'Generating PDF...' : 'Download PDF'}</button></div>
      <div id="resume-preview" className="border-t-2 border-blue-600 pt-8">
        <h2 className="text-xl font-bold mb-8 text-blue-600 uppercase tracking-wider text-center">Live Preview - Professional</h2>
        <div className="mb-10 pb-6 border-b-2 border-gray-300"><h3 className="text-4xl font-bold text-gray-900 mb-3 uppercase tracking-tight">{name || 'Your Name'}</h3><div className="flex items-center gap-4 text-base text-gray-700"><span>✉️ {email || 'your.email@example.com'}</span><span className="text-gray-400">|</span><span>📱 {phone || '+91 98765 43210'}</span></div></div>
        {summary && (<div className="mb-10 pb-6 border-b-2 border-gray-300"><h3 className="text-lg font-bold text-blue-600 mb-4 uppercase tracking-wide">Professional Summary</h3><p className="text-base text-gray-800 leading-relaxed ml-5">{summary}</p></div>)}
        {workExperiences.length > 0 && (<div className="mb-10 pb-6 border-b-2 border-gray-300"><h3 className="text-lg font-bold text-blue-600 mb-6 uppercase tracking-wide">Professional Experience</h3><div className="space-y-6 ml-5">{workExperiences.map((exp, i) => (<div key={i}><div className="flex justify-between items-baseline mb-2"><p className="text-xl font-bold text-gray-900">{exp.jobTitle}</p><p className="text-sm text-gray-600 italic">{formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p></div><p className="text-base text-blue-600 font-semibold mb-3">{exp.company}</p><p className="text-base text-gray-800 whitespace-pre-line leading-relaxed">{exp.description}</p></div>))}</div></div>)}
        {educationList.length > 0 && (<div className="mb-10 pb-6 border-b-2 border-gray-300"><h3 className="text-lg font-bold text-blue-600 mb-6 uppercase tracking-wide">Education</h3><div className="space-y-5 ml-5">{educationList.map((edu, i) => (<div key={i}><p className="text-lg font-bold text-gray-900">{edu.school}</p><p className="text-base text-gray-800 mb-1">{edu.degree}</p><p className="text-sm text-gray-600 italic">{formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div></div>)}
        {skills && (<div className="mb-6"><h3 className="text-lg font-bold text-blue-600 mb-5 uppercase tracking-wide">Core Competencies</h3><div className="grid grid-cols-2 gap-3 ml-5">{skills.split(',').map((s, i) => s.trim() && (<div key={i} className="flex items-center text-base text-gray-800"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3 inline-block"></span>{s.trim()}</div>))}</div></div>)}
      </div>
    </div>
  )

  const SidebarTemplate = () => (
    <div className="bg-white shadow-2xl overflow-hidden">
      <div className="p-8 pb-4"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-green-700 hover:to-teal-700 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}><span className="mr-2">📥</span> {isDownloading ? 'Generating PDF...' : 'Download PDF'}</button></div>
      <div id="resume-preview" className="grid grid-cols-3 gap-0">
        <div className="col-span-1 bg-gradient-to-b from-green-700 to-teal-700 text-white p-8">
          <h2 className="text-lg font-bold mb-8 text-center border-b-2 border-white pb-2">Live Preview - Sidebar</h2>
          <div className="mb-8"><h3 className="text-sm font-bold mb-4 uppercase tracking-wider border-b border-green-300 pb-2">Contact</h3><div className="space-y-3 text-sm"><div><p className="text-green-200 text-xs mb-1">Email</p><p className="break-words">{email || 'your.email@example.com'}</p></div><div><p className="text-green-200 text-xs mb-1">Phone</p><p>{phone || '+91 98765 43210'}</p></div></div></div>
          {skills && (<div className="mb-8"><h3 className="text-sm font-bold mb-4 uppercase tracking-wider border-b border-green-300 pb-2">Skills</h3><div className="space-y-2">{skills.split(',').map((s, i) => s.trim() && (<div key={i} className="flex items-center text-sm"><span className="w-2 h-2 bg-green-300 rounded-full mr-2 inline-block"></span><span>{s.trim()}</span></div>))}</div></div>)}
          {educationList.length > 0 && (<div><h3 className="text-sm font-bold mb-4 uppercase tracking-wider border-b border-green-300 pb-2">Education</h3><div className="space-y-4">{educationList.map((edu, i) => (<div key={i} className="text-sm"><p className="font-bold">{edu.school}</p><p className="text-green-200 text-xs mt-1">{edu.degree}</p><p className="text-green-300 text-xs mt-1">{formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div></div>)}
        </div>
        <div className="col-span-2 p-8">
          <div className="mb-8"><h3 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">{name || 'Your Name'}</h3><div className="h-1 w-24 bg-gradient-to-r from-green-600 to-teal-600"></div></div>
          {summary && (<div className="mb-8"><h3 className="text-lg font-bold text-green-700 mb-3 uppercase tracking-wide">Professional Summary</h3><p className="text-base text-gray-700 leading-relaxed">{summary}</p></div>)}
          {workExperiences.length > 0 && (<div className="mb-8"><h3 className="text-lg font-bold text-green-700 mb-5 uppercase tracking-wide">Work Experience</h3><div className="space-y-6">{workExperiences.map((exp, i) => (<div key={i}><p className="text-xl font-bold text-gray-900 mb-1">{exp.jobTitle}</p><p className="text-base text-green-600 font-semibold mb-1">{exp.company}</p><p className="text-sm text-gray-500 mb-3 italic">{formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p><p className="text-base text-gray-700 whitespace-pre-line leading-relaxed">{exp.description}</p></div>))}</div></div>)}
        </div>
      </div>
    </div>
  )

  const ElegantTemplate = () => (
    <div className="p-10 bg-gradient-to-br from-rose-50 to-orange-50 shadow-2xl">
      <div className="mb-6"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-rose-600 to-orange-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-rose-700 hover:to-orange-700 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}><span className="mr-2">📥</span> {isDownloading ? 'Generating PDF...' : 'Download PDF'}</button></div>
      <div id="resume-preview" className="bg-white p-10 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-8 text-rose-600 text-center italic">Live Preview - Elegant</h2>
        <div className="text-center mb-10 pb-8 border-b-2 border-rose-200"><h3 className="text-5xl font-serif font-bold text-gray-900 mb-4 tracking-tight">{name || 'Your Name'}</h3><div className="flex items-center justify-center gap-3 text-base text-gray-600 italic"><span>{email || 'your.email@example.com'}</span><span className="text-rose-400">◆</span><span>{phone || '+91 98765 43210'}</span></div></div>
        {summary && (<div className="mb-10 pb-8 border-b border-rose-100"><h3 className="text-lg font-serif font-bold text-rose-600 mb-4 text-center italic">Professional Profile</h3><p className="text-base text-gray-700 leading-relaxed text-center italic">{summary}</p></div>)}
        {workExperiences.length > 0 && (<div className="mb-10 pb-8 border-b border-rose-100"><h3 className="text-lg font-serif font-bold text-rose-600 mb-6 text-center italic">Professional Experience</h3><div className="space-y-6">{workExperiences.map((exp, i) => (<div key={i} className="border-l-4 border-rose-300 pl-6"><p className="text-xl font-serif font-bold text-gray-900 mb-1">{exp.jobTitle}</p><p className="text-base text-rose-600 font-semibold mb-1 italic">{exp.company}</p><p className="text-sm text-gray-500 mb-3 italic">{formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p><p className="text-base text-gray-700 whitespace-pre-line leading-relaxed">{exp.description}</p></div>))}</div></div>)}
        {educationList.length > 0 && (<div className="mb-10 pb-8 border-b border-rose-100"><h3 className="text-lg font-serif font-bold text-rose-600 mb-6 text-center italic">Education</h3><div className="space-y-5">{educationList.map((edu, i) => (<div key={i} className="border-l-4 border-orange-300 pl-6"><p className="text-lg font-serif font-bold text-gray-900">{edu.school}</p><p className="text-base text-gray-700 mb-1 italic">{edu.degree}</p><p className="text-sm text-gray-500 italic">{formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div></div>)}
        {skills && (<div className="mb-6"><h3 className="text-lg font-serif font-bold text-rose-600 mb-5 text-center italic">Core Competencies</h3><div className="flex flex-wrap gap-3 justify-center">{skills.split(',').map((s, i) => s.trim() && (<span key={i} className="px-5 py-2 bg-gradient-to-r from-rose-100 to-orange-100 text-rose-800 rounded-full text-base font-medium italic border border-rose-200">{s.trim()}</span>))}</div></div>)}
      </div>
    </div>
  )

  const TechTemplate = () => (
    <div className="p-8 bg-gray-900 shadow-2xl">
      <div className="mb-6"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-violet-700 hover:to-purple-700 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}><span className="mr-2">📥</span> {isDownloading ? 'Generating PDF...' : 'Download PDF'}</button></div>
      <div id="resume-preview" className="bg-white p-10 rounded-xl">
        <h2 className="text-xl font-bold mb-8 text-violet-600 flex items-center"><span className="mr-2">💻</span> Live Preview - Tech</h2>
        <div className="mb-8 pb-8 border-b-2 border-violet-200"><h3 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600 mb-3 leading-tight">{name || 'Your Name'}</h3><div className="flex items-center gap-3 text-base text-gray-600 font-mono"><span className="text-violet-600">$</span><span>{email || 'your.email@example.com'}</span><span className="text-violet-400">|</span><span>{phone || '+91 98765 43210'}</span></div></div>
        {summary && (<div className="mb-8 pb-8 border-b-2 border-violet-200"><h3 className="text-lg font-bold text-violet-600 mb-4 uppercase tracking-wide font-mono flex items-center"><span className="text-violet-400 mr-2">{'>'}</span>README.md</h3><div className="bg-gray-50 p-5 rounded-lg border-l-4 border-violet-500 font-mono text-sm"><p className="text-gray-700 leading-relaxed">{summary}</p></div></div>)}
        {workExperiences.length > 0 && (<div className="mb-8 pb-8 border-b-2 border-violet-200"><h3 className="text-lg font-bold text-violet-600 mb-6 uppercase tracking-wide font-mono flex items-center"><span className="text-violet-400 mr-2">{'>'}</span>Work Experience</h3><div className="space-y-6">{workExperiences.map((exp, i) => (<div key={i} className="bg-gradient-to-r from-violet-50 to-purple-50 p-5 rounded-lg border-l-4 border-purple-500"><p className="text-xl font-bold text-gray-900 mb-1 font-mono">{exp.jobTitle}</p><p className="text-base text-violet-600 font-semibold mb-1 font-mono">{exp.company}</p><p className="text-sm text-gray-500 mb-3 font-mono"><span className="text-violet-400">{'['}</span>{formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}<span className="text-violet-400">{']'}</span></p><p className="text-base text-gray-700 whitespace-pre-line leading-relaxed">{exp.description}</p></div>))}</div></div>)}
        {educationList.length > 0 && (<div className="mb-8 pb-8 border-b-2 border-violet-200"><h3 className="text-lg font-bold text-violet-600 mb-6 uppercase tracking-wide font-mono flex items-center"><span className="text-violet-400 mr-2">{'>'}</span>Education</h3><div className="space-y-5">{educationList.map((edu, i) => (<div key={i} className="bg-gray-50 p-5 rounded-lg border-l-4 border-violet-400"><p className="text-lg font-bold text-gray-900 font-mono">{edu.school}</p><p className="text-base text-gray-700 mb-1">{edu.degree}</p><p className="text-sm text-gray-500 font-mono">{formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div></div>)}
        {skills && (<div className="mb-6"><h3 className="text-lg font-bold text-violet-600 mb-5 uppercase tracking-wide font-mono flex items-center"><span className="text-violet-400 mr-2">{'>'}</span>Tech Stack</h3><div className="flex flex-wrap gap-3">{skills.split(',').map((s, i) => s.trim() && (<span key={i} className="px-5 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-md text-base font-bold font-mono shadow-md">{s.trim()}</span>))}</div></div>)}
      </div>
    </div>
  )

  // ── RENDER ──
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {showPaymentModal && <PaymentModal />}

      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">✨ Resume Builder</h1>
              <p className="text-sm text-gray-600 mt-1">Create your professional resume</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-700">Hi, {displayName}!</span>
              <button onClick={() => navigate('/templates')} className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold">← Change Template</button>
              <button onClick={handleSave} className="px-5 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition text-sm border border-green-200">💾 Save</button>
              <button onClick={handleClearAll} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition text-sm border border-red-200">🗑️ Clear All</button>
              <button onClick={() => { if (window.confirm('Log out?')) { signOut(); navigate('/') } }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition text-sm">Log Out</button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT: FORM */}
          <div className="space-y-6">

            {/* Personal Info */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center"><span className="mr-2">👤</span> Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your.email@example.com" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Phone</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center"><span className="mr-2">📝</span> Professional Summary</h2>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">About You (2-3 sentences)</label>
                <textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="e.g. Experienced software engineer with 3+ years building scalable web applications..." rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                <p className="text-xs text-gray-500 mt-2">💡 Tip: Keep it concise and highlight your key strengths</p>
              </div>
            </div>

            {/* Work Experience */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center"><span className="mr-2">💼</span> Work Experience</h2>
              <div className="space-y-4">

                {/* Company dropdown */}
                <SearchableDropdown
                  options={COMPANIES}
                  value={currentWork.company}
                  onChange={val => { setCurrentWork({ ...currentWork, company: val }); setWorkErrors({ ...workErrors, company: '' }) }}
                  placeholder="Select or search company..."
                  label="Company Name *"
                />
                {workErrors.company && <p className="text-red-500 text-xs -mt-2">⚠️ {workErrors.company}</p>}

                {/* Job title dropdown */}
                <JobRoleDropdown
                  value={currentWork.jobTitle}
                  onChange={val => { setCurrentWork({ ...currentWork, jobTitle: val }); setWorkErrors({ ...workErrors, jobTitle: '' }); setShowSuggestions(false) }}
                />
                {workErrors.jobTitle && <p className="text-red-500 text-xs -mt-2">⚠️ {workErrors.jobTitle}</p>}

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <MonthYearPicker
                      label="From"
                      monthValue={currentWork.startMonth}
                      yearValue={currentWork.startYear}
                      onMonthChange={val => { setCurrentWork({ ...currentWork, startMonth: val }); setDateError('') }}
                      onYearChange={val => { setCurrentWork({ ...currentWork, startYear: val }); setDateError('') }}
                      required
                    />
                    {(workErrors.startMonth || workErrors.startYear) && <p className="text-red-500 text-xs mt-1">⚠️ Start date required</p>}
                  </div>
                  <div>
                    <MonthYearPicker
                      label="To"
                      monthValue={currentWork.endMonth}
                      yearValue={currentWork.endYear}
                      onMonthChange={val => { setCurrentWork({ ...currentWork, endMonth: val }); setDateError('') }}
                      onYearChange={val => { setCurrentWork({ ...currentWork, endYear: val }); setDateError('') }}
                      required
                      allowPresent
                      isPresent={currentWork.isPresent}
                      onPresentChange={val => setCurrentWork({ ...currentWork, isPresent: val, endMonth: '', endYear: '' })}
                    />
                    {(workErrors.endMonth || workErrors.endYear) && <p className="text-red-500 text-xs mt-1">⚠️ End date required</p>}
                  </div>
                </div>
                {dateError && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">{dateError}</p>}

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Description <span className="text-red-500">*</span></label>
                  <textarea
                    value={currentWork.description}
                    onChange={e => { setCurrentWork({ ...currentWork, description: e.target.value }); setWorkErrors({ ...workErrors, description: '' }) }}
                    placeholder="Describe your responsibilities and achievements..."
                    rows="4"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${workErrors.description ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                  />
                  {workErrors.description && <p className="text-red-500 text-xs mt-1">⚠️ {workErrors.description}</p>}

                  {/* Smart Suggestions toggle */}
                  {currentWork.jobTitle && (
                    <button
                      onClick={() => setShowSuggestions(!showSuggestions)}
                      className="mt-2 text-sm text-purple-600 font-semibold hover:text-purple-800 flex items-center gap-1 transition"
                    >
                      ✨ {showSuggestions ? 'Hide suggestions' : 'Auto-suggest bullet points'}
                    </button>
                  )}

                  {/* Smart Suggestions panel */}
                  {showSuggestions && currentWork.jobTitle && (
                    <div className="mt-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
                      <p className="text-sm font-semibold text-purple-800 mb-3">
                        💡 Click any suggestion to add it for <em>{currentWork.jobTitle}</em>:
                      </p>
                      <div className="space-y-2">
                        {getSuggestions(currentWork.jobTitle).map((s, i) => (
                          <button
                            key={i}
                            onClick={() => applySuggestion(s)}
                            className="w-full text-left text-sm text-gray-700 hover:text-purple-700 hover:bg-purple-100 px-3 py-2 rounded-lg transition border border-transparent hover:border-purple-200"
                          >
                            • {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button onClick={addWorkExperience} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md">
                  + Add Work Experience
                </button>

                {workExperiences.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700">Added ({workExperiences.length}):</h3>
                    {workExperiences.map((exp, i) => (
                      <div key={i} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">{exp.jobTitle}</p>
                          <p className="text-sm text-gray-600">{exp.company}</p>
                          <p className="text-xs text-gray-500">{formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p>
                        </div>
                        <button onClick={() => deleteWorkExperience(i)} className="text-red-600 hover:text-red-800 font-semibold text-sm hover:bg-red-50 px-3 py-1 rounded transition">Delete</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Education */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center"><span className="mr-2">🎓</span> Education</h2>
              <div className="space-y-4">

                <SearchableDropdown
                  options={COLLEGES}
                  value={currentEducation.school}
                  onChange={val => { setCurrentEducation({ ...currentEducation, school: val }); setEduErrors({ ...eduErrors, school: '' }) }}
                  placeholder="Select or search college/university..."
                  label="College / University *"
                />
                {eduErrors.school && <p className="text-red-500 text-xs -mt-2">⚠️ {eduErrors.school}</p>}

                <SearchableDropdown
                  options={COURSES}
                  value={currentEducation.degree}
                  onChange={val => { setCurrentEducation({ ...currentEducation, degree: val }); setEduErrors({ ...eduErrors, degree: '' }) }}
                  placeholder="Select or search course/degree..."
                  label="Course / Degree *"
                />
                {eduErrors.degree && <p className="text-red-500 text-xs -mt-2">⚠️ {eduErrors.degree}</p>}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <MonthYearPicker
                      label="From"
                      monthValue={currentEducation.startMonth}
                      yearValue={currentEducation.startYear}
                      onMonthChange={val => { setCurrentEducation({ ...currentEducation, startMonth: val }); setEduDateError('') }}
                      onYearChange={val => { setCurrentEducation({ ...currentEducation, startYear: val }); setEduDateError('') }}
                      required
                    />
                    {(eduErrors.startMonth || eduErrors.startYear) && <p className="text-red-500 text-xs mt-1">⚠️ Start date required</p>}
                  </div>
                  <div>
                    <MonthYearPicker
                      label="To"
                      monthValue={currentEducation.endMonth}
                      yearValue={currentEducation.endYear}
                      onMonthChange={val => { setCurrentEducation({ ...currentEducation, endMonth: val }); setEduDateError('') }}
                      onYearChange={val => { setCurrentEducation({ ...currentEducation, endYear: val }); setEduDateError('') }}
                      required
                      allowPresent
                      isPresent={currentEducation.isPresent}
                      onPresentChange={val => setCurrentEducation({ ...currentEducation, isPresent: val, endMonth: '', endYear: '' })}
                    />
                    {(eduErrors.endMonth || eduErrors.endYear) && <p className="text-red-500 text-xs mt-1">⚠️ End date required</p>}
                  </div>
                </div>
                {eduDateError && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">{eduDateError}</p>}

                <button onClick={addEducation} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md">
                  + Add Education
                </button>

                {educationList.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700">Added ({educationList.length}):</h3>
                    {educationList.map((edu, i) => (
                      <div key={i} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">{edu.school}</p>
                          <p className="text-sm text-gray-600">{edu.degree}</p>
                          <p className="text-xs text-gray-500">{formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p>
                        </div>
                        <button onClick={() => deleteEducation(i)} className="text-red-600 hover:text-red-800 font-semibold text-sm hover:bg-red-50 px-3 py-1 rounded transition">Delete</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center"><span className="mr-2">⚡</span> Skills</h2>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Your Skills (separate with commas)</label>
                <textarea value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. JavaScript, React, Python, Java, SQL" rows="3" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                <p className="text-xs text-gray-500 mt-2">💡 Tip: Separate each skill with a comma</p>
              </div>
            </div>
          </div>

          {/* RIGHT: PREVIEW */}
          <div className="lg:sticky lg:top-8 h-fit">
            {selectedTemplate === 'modern' && <ModernTemplate />}
            {selectedTemplate === 'classic' && <ClassicTemplate />}
            {selectedTemplate === 'minimal' && <MinimalTemplate />}
            {selectedTemplate === 'creative' && <CreativeTemplate />}
            {selectedTemplate === 'professional' && <ProfessionalTemplate />}
            {selectedTemplate === 'sidebar' && <SidebarTemplate />}
            {selectedTemplate === 'elegant' && <ElegantTemplate />}
            {selectedTemplate === 'tech' && <TechTemplate />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Builder
