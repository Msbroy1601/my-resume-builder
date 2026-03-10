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
  // More Indian IT & Consulting
  "Mindtree", "NIIT", "Mphasis", "Syntel", "Patni Computer Systems",
  "Geometric", "Sasken Technologies", "KPIT", "Birlasoft", "Infosonics",
  "CSS Corp", "Happiest Minds", "Microland", "Rackspace India", "Kellton Tech",
  "Xorbit", "Trigent Software", "Silverline", "Softsolutions", "Datamatics",
  // More Startups
  "Razorpay", "Cashfree", "Juspay", "Setu", "Perfios",
  "Khatabook", "OkCredit", "Vyapar", "Tally Solutions", "Busy Accounting",
  "Delhivery", "Ecom Express", "Blue Dart", "DTDC", "XpressBees",
  "Porter", "Shadowfax", "Shiprocket", "Pickrr", "Increff",
  "Udaan", "Moglix", "Industrybuying", "Power2SME", "OfBusiness",
  "Licious", "Country Delight", "Milkbasket", "Zepto", "Blinkit",
  "Oyo Rooms", "MakeMyTrip", "Goibibo", "Yatra", "Ixigo",
  "Cars24", "CarDekho", "Droom", "Spinny", "Cardekho",
  "Vedantu", "Toppr", "Doubtnut", "Embibe", "Extramarks",
  "Cure.fit", "HealthifyMe", "Practo", "Tata 1mg", "PharmEasy",
  "Pristyn Care", "Portea Medical", "DocsApp", "MFine",
  // More MNCs
  "Accenture", "Capgemini", "Cognizant", "Wipro BPS", "Genpact",
  "WNS Global", "Mphasis BPS", "Firstsource", "iEnergizer", "Concentrix",
  "Teleperformance", "Sutherland", "EXL Service", "Syntel", "Hexaware BPS",
  "HSBC GFC", "Deutsche Bank India", "JP Morgan India", "Goldman Sachs India",
  "Morgan Stanley India", "Barclays India", "Credit Suisse India", "UBS India",
  "Nomura India", "BNP Paribas India", "Societe Generale India",
  "American Express India", "Citigroup India", "Standard Chartered India",
  "Mastercard India", "Visa India", "Western Union India",
  "Amazon India", "Google India", "Microsoft India", "Apple India",
  "Adobe India", "Oracle India", "SAP India", "Salesforce India",
  "Cisco India", "Intel India", "Qualcomm India", "Texas Instruments India",
  "Broadcom India", "Nvidia India", "AMD India", "Micron India",
  "Philips India", "Honeywell India", "3M India", "GE India",
  "Siemens India", "ABB India", "Bosch India", "Schneider India",
  "Emerson India", "Rockwell Automation India",
  // More Indian Companies
  "Muthoot Group", "Manappuram Finance", "Shriram Finance", "Cholamandalam",
  "Sundaram Finance", "HDFC Securities", "ICICI Securities", "Kotak Securities",
  "Zerodha", "Angel One", "5paisa", "Sharekhan", "Motilal Oswal",
  "Edelweiss", "JM Financial", "Emkay Global", "Nirmal Bang",
  "Pidilite", "Asian Paints", "Berger Paints", "Kansai Nerolac", "Indigo Paints",
  "Havells", "Crompton", "Polycab", "Finolex", "KEI Industries",
  "Dixon Technologies", "Amber Enterprises", "Voltas", "Blue Star", "Daikin India",
  "Titan Company", "Tanishq", "Kalyan Jewellers", "Malabar Gold", "PC Jeweller",
  "Bata India", "Metro Brands", "Relaxo Footwear", "Campus Activewear",
  "Page Industries", "Dollar Industries", "Rupa & Company", "Lux Industries",
  "Marico", "Dabur", "Emami", "Himalaya", "Patanjali", "Zydus Wellness",
  "Britannia", "Parle", "ITC Foods", "Haldiram", "Bikaji Foods",
  "Amul", "Mother Dairy", "Heritage Foods", "Parag Milk Foods",
  "Dr Lal PathLabs", "SRL Diagnostics", "Thyrocare", "Metropolis Healthcare",
  "Other"
]

// ─── DATA: COURSES ────────────────────────────────────────────────────────────
const COURSES = [
  // Generic degrees
  "B.Tech (General)",
  "B.E. (General)",
  "M.Tech (General)",
  "M.E. (General)",
  "MBA (General)",
  "PGDM (General)",
  "BBA (General)",
  "BCA (General)",
  "MCA (General)",
  "B.Sc (General)",
  "M.Sc (General)",
  "B.Com (General)",
  "M.Com (General)",
  "BA (General)",
  "MA (General)",
  "B.Des (General)",
  "M.Des (General)",
  "Diploma (General)",
  "Ph.D (General)",
  // Engineering - B.Tech/B.E.
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
const YEARS = Array.from({ length: 57 }, (_, i) => (new Date().getFullYear() - i).toString())

// ─── DATA: SMART SUGGESTIONS ──────────────────────────────────────────────────
const LANGUAGE_LIST = [
  "Hindi","English","Bengali","Telugu","Marathi","Tamil","Urdu","Gujarati","Kannada","Odia",
  "Malayalam","Punjabi","Assamese","Maithili","Sanskrit","Santali","Kashmiri","Nepali","Sindhi","Konkani",
  "Manipuri","Bodo","Dogri","Arabic","French","German","Spanish","Portuguese","Italian","Russian",
  "Japanese","Chinese (Mandarin)","Chinese (Cantonese)","Korean","Dutch","Swedish","Norwegian","Danish",
  "Finnish","Polish","Czech","Slovak","Hungarian","Romanian","Bulgarian","Greek","Turkish","Persian",
  "Hebrew","Swahili","Indonesian","Malay","Thai","Vietnamese","Burmese","Sinhala","Dzongkha",
  "Tibetan","Tagalog","Javanese","Sundanese","Other"
]

const CERTIFICATION_LIST = [
  // Technology
  "AWS Certified Solutions Architect","AWS Certified Developer","AWS Certified Cloud Practitioner",
  "Google Cloud Professional Data Engineer","Google Cloud Associate Engineer","Azure Fundamentals (AZ-900)",
  "Azure Administrator (AZ-104)","Azure Developer (AZ-204)","Azure Solutions Architect (AZ-305)",
  "Certified Kubernetes Administrator (CKA)","Docker Certified Associate","HashiCorp Terraform Associate",
  "Google Associate Cloud Engineer","Red Hat Certified Engineer (RHCE)","CompTIA Security+",
  "CompTIA Network+","CompTIA A+","Certified Ethical Hacker (CEH)","CISSP","OSCP",
  // Data & Analytics
  "Google Data Analytics Certificate","IBM Data Science Professional","Microsoft Power BI Data Analyst",
  "Tableau Desktop Specialist","Cloudera Data Platform","Databricks Certified Associate",
  "Certified Analytics Professional (CAP)","SAS Certified Data Scientist",
  // Project Management
  "PMP - Project Management Professional","CAPM","Prince2 Foundation","Prince2 Practitioner",
  "Certified Scrum Master (CSM)","Certified Scrum Product Owner (CSPO)","SAFe Agilist",
  "ITIL Foundation","Six Sigma Green Belt","Six Sigma Black Belt","Lean Six Sigma",
  // Finance & Accounting
  "CFA Level 1","CFA Level 2","CFA Level 3","FRM Part 1","FRM Part 2","CFP - Certified Financial Planner",
  "CA - Chartered Accountant","CMA - Cost & Management Accountant","CS - Company Secretary",
  "ACCA","CPA - Certified Public Accountant","CAIA","Series 7","Series 63",
  // Marketing & Sales
  "Google Ads Certification","Google Analytics Certification","HubSpot Inbound Marketing",
  "HubSpot Content Marketing","Facebook Blueprint","Hootsuite Social Marketing",
  "Salesforce Administrator","Salesforce Sales Cloud Consultant","Marketo Certified Expert",
  // HR
  "SHRM-CP","SHRM-SCP","PHR - Professional in HR","SPHR","CHRP","Certified Payroll Professional",
  // Quality & Manufacturing
  "ISO 9001 Lead Auditor","ISO 27001 Lead Implementer","OHSAS 18001",
  "CQPA - Certified Quality Process Analyst","Lean Manufacturing Certification",
  // Design & Creative
  "Adobe Certified Professional","Google UX Design Certificate","Interaction Design Foundation",
  "AutoCAD Certified User","Revit Architecture Certified",
  // Indian Specific
  "NASSCOM Certified","NIELIT O Level","NIELIT A Level","NIELIT B Level","NIELIT C Level",
  "NSDC Certified Skill Trainer","Pradhan Mantri Kaushal Kendra Certification",
  "NISM Series I - Currency Derivatives","NISM Series V-A - Mutual Fund Distributors",
  "NISM Series VIII - Equity Derivatives","IRDA Life Insurance Agent","IRDA General Insurance",
  // Online Learning
  "Coursera Google IT Support","Coursera Deep Learning Specialization","Coursera Machine Learning",
  "edX MicroMasters","Udemy Complete Web Development","freeCodeCamp Full Stack",
  "LinkedIn Learning Certificate","Microsoft Certified Educator",
  "Other"
]

const SKILLS_BY_ROLE = {
  "Software Engineer": ["JavaScript","TypeScript","Python","Java","C++","React","Node.js","Express","Spring Boot","REST APIs","Git","Docker","Kubernetes","AWS","SQL","MongoDB","PostgreSQL","Redis","CI/CD","Agile","JIRA"],
  "Sr. Software Engineer": ["System Design","Microservices","Kafka","GraphQL","gRPC","Terraform","AWS","Azure","GCP","Leadership","Code Review","Architecture","DevOps","Docker","Kubernetes"],
  "Frontend Developer": ["HTML","CSS","JavaScript","TypeScript","React","Vue.js","Angular","Tailwind CSS","SCSS","Redux","Webpack","Figma","REST APIs","Git","Performance Optimisation","Accessibility"],
  "Backend Developer": ["Node.js","Python","Java","Go","REST APIs","GraphQL","SQL","PostgreSQL","MongoDB","Redis","Docker","AWS","Microservices","Message Queues","Authentication","CI/CD"],
  "Full Stack Developer": ["React","Node.js","JavaScript","TypeScript","Python","SQL","MongoDB","REST APIs","Docker","Git","AWS","HTML","CSS","Redux","Express"],
  "Data Analyst": ["Python","SQL","Excel","Tableau","Power BI","R","Pandas","NumPy","Data Visualisation","Statistical Analysis","A/B Testing","Google Analytics","ETL","VLOOKUP","Pivot Tables"],
  "Data Scientist": ["Python","R","Machine Learning","Deep Learning","TensorFlow","PyTorch","Scikit-learn","NLP","Computer Vision","SQL","Spark","Statistics","Feature Engineering","Model Deployment"],
  "Marketing Executive": ["SEO","SEM","Google Ads","Meta Ads","Content Marketing","Email Marketing","Social Media Marketing","Google Analytics","HubSpot","Canva","Copywriting","CRM","A/B Testing"],
  "Sales Executive": ["CRM","Salesforce","Negotiation","Lead Generation","Cold Calling","Pipeline Management","Customer Relationship","Product Demo","Excel","Presentation Skills","Target Achievement"],
  "Business Development Executive": ["B2B Sales","Partnership Development","Market Research","CRM","Salesforce","Negotiation","Lead Generation","Proposal Writing","Networking","Strategic Planning"],
  "HR Executive": ["Recruitment","Talent Acquisition","HRMS","Payroll","Employee Engagement","Performance Management","Labour Laws","Onboarding","Training & Development","Excel","Communication"],
  "Accountant": ["Tally","GST","TDS","Financial Reporting","Excel","SAP","QuickBooks","Auditing","Accounts Payable","Accounts Receivable","Budgeting","MIS Reporting","Tax Filing"],
  "Graphic Designer": ["Adobe Photoshop","Adobe Illustrator","Adobe InDesign","Canva","Figma","Typography","Branding","Print Design","Social Media Design","Video Editing","Premiere Pro","After Effects"],
  "UI/UX Designer": ["Figma","Adobe XD","Sketch","Prototyping","Wireframing","User Research","Usability Testing","Design Systems","HTML","CSS","Interaction Design","Information Architecture"],
  "Mechanical Engineer": ["AutoCAD","SolidWorks","CATIA","ANSYS","FEA","GD&T","Manufacturing Processes","Materials Science","Thermodynamics","Project Management","MS Office","Six Sigma"],
  "Civil Engineer": ["AutoCAD","Revit","STAAD Pro","ETABS","MS Project","AutoCAD Civil 3D","Structural Analysis","Surveying","Construction Management","IS Codes","Estimation & Costing"],
  "Operations Executive": ["Process Improvement","Supply Chain","Vendor Management","ERP","SAP","Excel","MIS Reporting","Logistics","SLA Management","Six Sigma","Project Management","Communication"],
  "Banking Executive": ["KYC","AML","Retail Banking","CASA","Loan Processing","CRM","Core Banking","Financial Products","Customer Service","Compliance","MS Office","Communication"],
  "Relationship Manager": ["Portfolio Management","Wealth Management","Financial Planning","CRM","Cross-selling","HNI Client Management","Investment Products","Compliance","Networking","Excel"],
  "General Fresher": ["MS Office","Communication","Teamwork","Problem Solving","Time Management","Excel","PowerPoint","Research","Adaptability","Attention to Detail"],
  "Engineering Intern": ["Python","Java","C","SQL","Git","MS Office","Communication","Problem Solving","Teamwork","Research","Documentation"]
}

const SUGGESTIONS = {
  "Software Engineer": {
    responsibilities: [
      "Develop and maintain scalable web applications using modern frameworks",
      "Collaborate with cross-functional teams to deliver product features on time",
      "Design and implement RESTful APIs for frontend-backend integration",
      "Participate in code reviews to ensure code quality and best practices",
      "Write unit and integration tests to ensure software reliability",
      "Troubleshoot and debug production issues and performance bottlenecks"
    ],
    achievements: [
      "Improved application performance by 30% through code optimisation",
      "Reduced bug count by 40% by implementing automated testing pipelines",
      "Delivered 3 major product features ahead of schedule",
      "Received 'Best Engineer' award for Q3 2024",
      "Reduced deployment time by 60% by implementing CI/CD pipelines",
      "Improved code coverage from 45% to 85% within 6 months"
    ]
  },
  "Sr. Software Engineer": {
    responsibilities: [
      "Lead a team of 5+ engineers and drive end-to-end feature delivery",
      "Architect scalable microservices-based solutions for high-traffic systems",
      "Mentor junior developers and conduct regular code reviews",
      "Drive technical discussions and align stakeholders on engineering decisions",
      "Define engineering best practices and coding standards for the team",
      "Collaborate with product managers to scope and plan technical roadmaps"
    ],
    achievements: [
      "Reduced system downtime by 40% through proactive monitoring and improvements",
      "Scaled platform to handle 10x traffic growth with zero downtime",
      "Mentored 4 junior engineers, 2 of whom were promoted within 1 year",
      "Delivered platform migration 2 weeks ahead of schedule saving ₹15L in costs",
      "Improved team velocity by 35% through process improvements",
      "Architected a new data pipeline reducing processing time by 50%"
    ]
  },
  "Frontend Developer": {
    responsibilities: [
      "Build responsive, accessible UI components using React and Tailwind CSS",
      "Integrate REST APIs and manage application state using Redux/Context API",
      "Collaborate with designers to translate Figma mockups into pixel-perfect UI",
      "Ensure cross-browser compatibility across Chrome, Firefox, and Safari",
      "Write reusable component libraries to improve development speed",
      "Conduct performance audits and implement optimisation strategies"
    ],
    achievements: [
      "Optimised page load times by 40% using lazy loading and code splitting",
      "Reduced bundle size by 35% through tree shaking and code optimisation",
      "Built a component library used across 3 product teams",
      "Improved Lighthouse performance score from 62 to 94",
      "Reduced UI bug reports by 50% through systematic testing",
      "Delivered complete redesign of dashboard in 4 weeks"
    ]
  },
  "Backend Developer": {
    responsibilities: [
      "Design and build RESTful APIs to support frontend and mobile applications",
      "Optimise database queries and manage schema design for performance",
      "Implement authentication systems including JWT, OAuth2, and SSO",
      "Deploy and manage applications on cloud platforms (AWS/GCP/Azure)",
      "Build event-driven architecture using message queues for async processing",
      "Maintain comprehensive API documentation and developer guides"
    ],
    achievements: [
      "Optimised database queries reducing average response time by 50%",
      "Built APIs serving 100K+ daily requests with 99.9% uptime",
      "Reduced server costs by 25% through infrastructure optimisation",
      "Implemented caching strategy reducing database load by 60%",
      "Migrated monolith to microservices reducing deployment risk significantly",
      "Achieved zero critical security vulnerabilities in annual audit"
    ]
  },
  "Full Stack Developer": {
    responsibilities: [
      "Develop end-to-end features across frontend (React) and backend (Node.js)",
      "Manage MySQL/MongoDB databases with efficient schema design",
      "Integrate third-party APIs including payment gateways and external services",
      "Deploy and manage applications on cloud platforms",
      "Implement real-time features using WebSockets",
      "Conduct code reviews and ensure adherence to coding standards"
    ],
    achievements: [
      "Delivered 5 full-stack features end-to-end within tight deadlines",
      "Reduced technical debt by 40% by refactoring legacy codebase",
      "Built an internal tool saving the operations team 8 hours/week",
      "Improved app load time by 45% through full-stack optimisations",
      "Successfully migrated application from monolith to microservices",
      "Increased test coverage from 20% to 80% across the codebase"
    ]
  },
  "Data Analyst": {
    responsibilities: [
      "Analyse large datasets using Python, SQL, and Excel to derive actionable insights",
      "Create interactive dashboards and reports in Power BI and Tableau",
      "Collaborate with business teams to understand data requirements",
      "Clean, preprocess, and validate datasets to ensure data quality",
      "Conduct A/B testing and statistical analysis to support product decisions",
      "Present data-driven findings and recommendations to senior stakeholders"
    ],
    achievements: [
      "Automated reporting workflows saving 10+ hours per week",
      "Identified ₹25L cost-saving opportunity through spend analysis",
      "Improved data quality by 25% through data cleaning initiatives",
      "Built a real-time sales dashboard adopted by the entire sales team",
      "Increased campaign ROI by 20% through data-driven targeting insights",
      "Reduced monthly reporting time from 3 days to 4 hours"
    ]
  },
  "Data Scientist": {
    responsibilities: [
      "Build and evaluate machine learning models for business use cases",
      "Perform feature engineering and model tuning to improve accuracy",
      "Collaborate with engineering teams to deploy ML models to production",
      "Use NLP and deep learning techniques for text and image analysis",
      "Conduct exploratory data analysis to uncover patterns and insights",
      "Document model methodologies and present findings to stakeholders"
    ],
    achievements: [
      "Built a churn prediction model achieving 91% accuracy",
      "Reduced customer churn by 15% through ML-driven interventions",
      "Deployed 3 ML models to production serving 50K+ users daily",
      "Improved recommendation engine CTR by 28%",
      "Reduced model training time by 50% through pipeline optimisation",
      "Generated ₹1.2Cr in revenue through a pricing optimisation model"
    ]
  },
  "Marketing Executive": {
    responsibilities: [
      "Plan and execute digital marketing campaigns across social media channels",
      "Manage Google Ads, Meta Ads, and email marketing campaigns",
      "Create and publish SEO-optimised content to drive organic traffic",
      "Coordinate with design team to produce marketing collaterals",
      "Monitor and report on campaign KPIs including CTR, CPC, and ROAS",
      "Conduct competitor research and market analysis"
    ],
    achievements: [
      "Increased organic traffic by 45% through a targeted SEO strategy",
      "Generated 500+ qualified leads per month through inbound marketing",
      "Reduced cost per lead by 30% through campaign optimisation",
      "Grew social media following from 2K to 18K in 6 months",
      "Achieved 3.5x ROAS on Google Ads campaigns",
      "Launched a campaign that generated ₹40L in pipeline revenue"
    ]
  },
  "Sales Executive": {
    responsibilities: [
      "Identify and pursue new business opportunities through outbound prospecting",
      "Conduct product demonstrations and presentations to potential clients",
      "Manage the full sales cycle from lead generation to deal closure",
      "Maintain and grow relationships with existing client accounts",
      "Prepare proposals, quotations, and contracts for prospective clients",
      "Maintain accurate records in CRM tools like Salesforce or Zoho"
    ],
    achievements: [
      "Consistently achieved 120% of monthly sales targets",
      "Generated ₹50L+ in new revenue through client acquisitions",
      "Closed the largest deal in company history worth ₹1.2Cr",
      "Reduced sales cycle length by 20% through improved demo process",
      "Ranked #1 in regional sales team for 3 consecutive quarters",
      "Expanded client portfolio by 35% within the first year"
    ]
  },
  "Business Development Executive": {
    responsibilities: [
      "Identify new business opportunities and potential partnership channels",
      "Build and manage a qualified pipeline through outbound prospecting",
      "Conduct market research to identify trends and growth opportunities",
      "Negotiate and close partnership and enterprise contracts",
      "Collaborate with product and marketing teams on go-to-market strategies",
      "Represent the company at industry events and networking forums"
    ],
    achievements: [
      "Onboarded 20+ new business partners in the first quarter",
      "Built a sales pipeline worth ₹1Cr+ through strategic outreach",
      "Closed 3 enterprise deals worth ₹75L in the first 6 months",
      "Expanded company presence into 2 new geographic markets",
      "Generated 40% of company's annual revenue through new partnerships",
      "Reduced partner onboarding time by 30% through process improvements"
    ]
  },
  "HR Executive": {
    responsibilities: [
      "Manage end-to-end recruitment including sourcing, screening, and onboarding",
      "Coordinate with hiring managers to understand role requirements",
      "Administer payroll, attendance, and leave management systems",
      "Organise employee engagement activities and team events",
      "Maintain HR records and ensure compliance with labour laws",
      "Handle employee grievances and support conflict resolution"
    ],
    achievements: [
      "Reduced time-to-hire by 20% by streamlining the interview process",
      "Successfully hired 50+ employees across departments in 6 months",
      "Improved employee satisfaction score from 6.2 to 8.1 out of 10",
      "Reduced attrition rate from 18% to 11% through engagement initiatives",
      "Automated payroll processing saving 15 hours per month",
      "Designed onboarding programme reducing new-hire ramp-up time by 25%"
    ]
  },
  "Accountant": {
    responsibilities: [
      "Prepare and maintain accurate financial statements, ledgers, and records",
      "File GST, TDS, and income tax returns in compliance with regulations",
      "Reconcile bank statements and resolve discrepancies promptly",
      "Process accounts payable and receivable transactions",
      "Assist in annual audit preparation and coordinate with auditors",
      "Prepare monthly MIS reports for management review"
    ],
    achievements: [
      "Reduced month-end closing time from 5 days to 2 days",
      "Identified ₹8L in tax savings through proactive tax planning",
      "Achieved zero audit findings for 2 consecutive years",
      "Improved accounts receivable collection cycle by 15 days",
      "Automated invoice processing reducing manual errors by 80%",
      "Recovered ₹12L in outstanding dues through systematic follow-ups"
    ]
  },
  "Graphic Designer": {
    responsibilities: [
      "Create visual assets for social media, print, and digital campaigns",
      "Design brand identities including logos, typography, and colour palettes",
      "Produce marketing collaterals including brochures, banners, and decks",
      "Collaborate with marketing and product teams to deliver on-brand designs",
      "Maintain brand consistency across all communication materials",
      "Manage multiple design projects simultaneously and meet deadlines"
    ],
    achievements: [
      "Redesigned company brand identity increasing brand recognition by 40%",
      "Created a campaign visual that achieved 2M+ impressions on social media",
      "Delivered 200+ design assets in Q1 with 100% on-time delivery",
      "Reduced design turnaround time by 30% by building a reusable asset library",
      "Won internal 'Best Creative' award for Q2 campaign design",
      "Produced a product catalogue that contributed to 15% sales increase"
    ]
  },
  "UI/UX Designer": {
    responsibilities: [
      "Conduct user research, surveys, and usability testing to inform design",
      "Create wireframes, user flows, prototypes, and high-fidelity mockups in Figma",
      "Collaborate with developers to ensure pixel-perfect implementation",
      "Build and maintain a comprehensive design system for consistent UI",
      "Analyse user behaviour data to identify UX improvement opportunities",
      "Present design concepts and rationale to stakeholders"
    ],
    achievements: [
      "Improved user retention by 25% through data-driven UX redesign",
      "Reduced user drop-off on checkout flow by 35%",
      "Shipped a complete app redesign in 8 weeks with zero usability regressions",
      "Design system adopted across 4 product teams reducing design time by 40%",
      "Increased NPS score from 32 to 58 through UX improvements",
      "Won a design award for best mobile UX at a regional design conference"
    ]
  },
  "Mechanical Engineer": {
    responsibilities: [
      "Design mechanical components and assemblies using SolidWorks and AutoCAD",
      "Conduct stress analysis, thermal analysis, and FEA simulations",
      "Coordinate with manufacturing team to ensure design feasibility",
      "Prepare technical drawings, BOMs, and specifications for production",
      "Perform root cause analysis and implement corrective actions",
      "Ensure designs comply with industry standards and safety regulations"
    ],
    achievements: [
      "Reduced material costs by 15% through design optimisation",
      "Improved product lifespan by 30% through material upgrade",
      "Led a design project that reduced assembly time by 20%",
      "Successfully delivered 5 product prototypes within tight deadlines",
      "Identified and resolved a critical design flaw saving ₹20L in recalls",
      "Achieved ISO 9001 certification for design processes"
    ]
  },
  "Civil Engineer": {
    responsibilities: [
      "Supervise construction activities and ensure adherence to project plans",
      "Prepare structural drawings, BOQs, and cost estimates",
      "Coordinate with contractors, consultants, and vendors on-site",
      "Conduct quality checks and material testing at various project stages",
      "Ensure compliance with IS codes, safety standards, and environmental norms",
      "Monitor project timelines and report progress to senior management"
    ],
    achievements: [
      "Delivered a ₹5Cr construction project 2 weeks ahead of schedule",
      "Reduced material waste by 12% through improved procurement planning",
      "Supervised construction of 150+ residential units without safety incidents",
      "Saved ₹8L in project costs through value engineering",
      "Successfully obtained all statutory approvals within planned timelines",
      "Reduced rework rate by 25% through rigorous quality inspection"
    ]
  },
  "Operations Executive": {
    responsibilities: [
      "Manage day-to-day operations and ensure smooth workflow across teams",
      "Coordinate with vendors and ensure timely procurement of resources",
      "Prepare MIS reports, dashboards, and operational metrics for leadership",
      "Implement and improve standard operating procedures (SOPs)",
      "Monitor SLAs, KPIs, and escalation matrices for service delivery",
      "Identify operational inefficiencies and drive process improvement projects"
    ],
    achievements: [
      "Reduced operational costs by 20% through vendor renegotiation",
      "Improved team efficiency by 30% through SOP implementation",
      "Reduced SLA breaches by 45% through real-time monitoring",
      "Streamlined vendor onboarding process from 15 days to 5 days",
      "Managed operations for a team of 50+ across 3 locations",
      "Launched a process automation project saving 20 hours/week"
    ]
  },
  "Banking Executive": {
    responsibilities: [
      "Handle customer account opening, KYC verification, and documentation",
      "Process loan applications and coordinate with credit team for approvals",
      "Cross-sell banking products including insurance, mutual funds, and FDs",
      "Maintain accurate records and ensure regulatory compliance",
      "Resolve customer queries and complaints within defined TAT",
      "Conduct financial need analysis and recommend suitable products"
    ],
    achievements: [
      "Achieved 110% of cross-selling targets for 3 consecutive quarters",
      "Processed 200+ loan applications with zero compliance errors",
      "Reduced customer complaint resolution time by 40%",
      "Onboarded 50+ HNI customers through targeted relationship building",
      "Ranked among top 5% performers in the regional branch network",
      "Contributed to branch achieving its annual CASA target 2 months early"
    ]
  },
  "Relationship Manager": {
    responsibilities: [
      "Manage a portfolio of HNI/corporate clients and their banking needs",
      "Conduct regular portfolio reviews and investment planning discussions",
      "Identify cross-sell and upsell opportunities within the client portfolio",
      "Acquire new clients through referrals, networking, and outreach",
      "Ensure compliance with KYC, AML, and regulatory requirements",
      "Coordinate with product teams to resolve client issues promptly"
    ],
    achievements: [
      "Managed a portfolio of 150+ HNI clients with AUM of ₹50Cr+",
      "Achieved 130% of quarterly revenue targets consistently",
      "Acquired 20+ new HNI clients generating ₹8Cr in fresh deposits",
      "Maintained zero client attrition for 2 consecutive years",
      "Increased wallet share by 35% through proactive cross-selling",
      "Won 'Best Relationship Manager' award for the northern region"
    ]
  },
  "General Fresher": {
    responsibilities: [
      "Assist senior team members with day-to-day tasks and deliverables",
      "Conduct research and compile data for team projects",
      "Prepare presentations, reports, and documentation as required",
      "Coordinate with internal teams to support project execution",
      "Learn and apply domain knowledge gained through academic training",
      "Participate in training programmes and team meetings actively"
    ],
    achievements: [
      "Completed final year project with distinction, scoring 9.1/10 CGPA",
      "Won 1st place at college-level technical fest/hackathon",
      "Completed 3 relevant online certifications during academic tenure",
      "Served as student coordinator for a 500+ attendee college event",
      "Published a research paper / article on relevant domain topic",
      "Received appreciation from internship manager for proactive attitude"
    ]
  },
  "Engineering Intern": {
    responsibilities: [
      "Assist senior engineers in designing, coding, and testing software modules",
      "Participate in daily standups, sprint planning, and team meetings",
      "Document technical processes and contribute to internal knowledge base",
      "Write and execute test cases to validate software functionality",
      "Research and evaluate new tools and technologies for team adoption",
      "Support production deployments and monitor post-deployment issues"
    ],
    achievements: [
      "Delivered an assigned feature end-to-end within the internship period",
      "Identified and fixed 12 bugs reducing open ticket count by 20%",
      "Built an internal tool that saved the team 5 hours per week",
      "Received a pre-placement offer (PPO) at the end of internship",
      "Achieved top intern ranking in performance review",
      "Completed 2 additional certifications during the internship period"
    ]
  }
}

const getSuggestions = (jobTitle) => {
  if (!jobTitle) return { responsibilities: [], achievements: [] }
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

  const filtered = options
    .filter(o => o !== 'Other' && o.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 60)
  const showOtherOption = options.includes('Other') && 'other'.includes(search.toLowerCase())

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
            {filtered.length === 0 && !showOtherOption ? (
              <div className="px-4 py-3 text-gray-500 text-sm">No results found</div>
            ) : (
              <>
                {filtered.map((option, i) => (
                  <div key={i} onClick={() => handleSelect(option)}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm ${value === option ? 'bg-blue-100 font-semibold text-blue-700' : ''}`}>
                    {option}
                  </div>
                ))}
                {showOtherOption && (
                  <div onClick={() => handleSelect('Other')}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm border-t border-gray-100 text-gray-500 italic">
                    ✏️ Other (type your own)
                  </div>
                )}
              </>
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
    roles: roles.filter(r => r !== 'Other' && r.toLowerCase().includes(search.toLowerCase()))
  })).filter(({ roles }) => roles.length > 0)
  const showOtherJobRole = 'other'.includes(search.toLowerCase())

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
            {showOtherJobRole && (
              <div onClick={() => handleSelect('Other')}
                className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm border-t border-gray-100 text-gray-500 italic">
                ✏️ Other (type your own)
              </div>
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
function MonthYearPicker({ label, monthValue, yearValue, onMonthChange, onYearChange, required, allowPresent, isPresent, onPresentChange, presentLabel }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
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
      {allowPresent && (
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id={`present-${label}`}
            checked={isPresent}
            onChange={e => onPresentChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 cursor-pointer"
          />
          <label htmlFor={`present-${label}`} className="text-sm text-gray-700 font-medium cursor-pointer">
            {presentLabel || 'Currently working here'}
          </label>
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
  const [nameError, setNameError] = useState('')
  const [photo, setPhoto] = useState(null) // base64 string
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [summary, setSummary] = useState('')

  const [workExperiences, setWorkExperiences] = useState([])
  const [currentWork, setCurrentWork] = useState({
    company: '', jobTitle: '', startMonth: '', startYear: '',
    endMonth: '', endYear: '', isPresent: false,
    responsibilities: '', achievements: ''
  })
  const [workErrors, setWorkErrors] = useState({})
  const [dateError, setDateError] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(null) // 'resp' | 'ach' | null

  const [educationList, setEducationList] = useState([])
  const [currentEducation, setCurrentEducation] = useState({
    school: '', degree: '', startMonth: '', startYear: '',
    endMonth: '', endYear: '', isPresent: false, score: ''
  })
  const [eduErrors, setEduErrors] = useState({})
  const [eduDateError, setEduDateError] = useState('')

  const [skillsList, setSkillsList] = useState([]) // [{name, level}]
  const [currentSkillInput, setCurrentSkillInput] = useState('')
  const [currentSkillLevel, setCurrentSkillLevel] = useState(3)

  // Projects
  const [projects, setProjects] = useState([])
  const [currentProject, setCurrentProject] = useState({ name: '', description: '', link: '' })

  // Certifications
  const [certifications, setCertifications] = useState([])
  const [currentCert, setCurrentCert] = useState({ name: '', issuer: '', year: '' })

  // Website Links
  const [websiteLinks, setWebsiteLinks] = useState({ linkedin: '', github: '', portfolio: '', other: '' })

  // Languages
  const [languages, setLanguages] = useState([])
  const [currentLanguage, setCurrentLanguage] = useState({ name: '', level: 3 })

  // Hobbies
  const [hobbies, setHobbies] = useState('')

  const [isDownloading, setIsDownloading] = useState(false)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [suggestedSkills, setSuggestedSkills] = useState([])
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false)
  const [skillSearch, setSkillSearch] = useState('')
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
        setProjects(data.projects || [])
        setCertifications(data.certifications || [])
        setWebsiteLinks(data.websiteLinks || { linkedin: '', github: '', portfolio: '', other: '' })
        setLanguages(data.languages || [])
        setHobbies(data.hobbies || '')
        setSkillsList(data.skillsList || [])
        if (data.photo) setPhoto(data.photo)
      }
    } catch (e) { console.error(e) }
  }, [])

  useEffect(() => {
    const t = searchParams.get('template')
    if (t) setSelectedTemplate(t)
  }, [searchParams])

  const handleSave = () => {
    localStorage.setItem('resumeData', JSON.stringify({ name, email, phone, summary, workExperiences, educationList, projects, skillsList, certifications, websiteLinks, languages, hobbies, selectedTemplate, photo }))
    alert('✅ Resume saved to browser!')
  }

  const handleClearAll = () => {
    if (!window.confirm('Clear all data? This cannot be undone.')) return
    setName(''); setEmail(''); setPhone(''); setSummary(''); setNameError('')
    setWorkExperiences([]); setEducationList([]); setProjects([]); setCertifications([]); setSkillsList([]); setPhoto(null); setWebsiteLinks({ linkedin: '', github: '', portfolio: '', other: '' }); setLanguages([]); setHobbies(''); setSkillsList([]); setPhoto(null)
    setCurrentWork({ company: '', jobTitle: '', startMonth: '', startYear: '', endMonth: '', endYear: '', isPresent: false, responsibilities: '', achievements: '' })
    setCurrentEducation({ school: '', degree: '', startMonth: '', startYear: '', endMonth: '', endYear: '', isPresent: false, score: '' })
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
    if (!currentWork.responsibilities) errors.responsibilities = 'At least responsibilities are required'
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
    setCurrentWork({ company: '', jobTitle: '', startMonth: '', startYear: '', endMonth: '', endYear: '', isPresent: false, responsibilities: '', achievements: '' })
    setWorkErrors({}); setDateError(''); setShowSuggestions(null)
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
    setCurrentEducation({ school: '', degree: '', startMonth: '', startYear: '', endMonth: '', endYear: '', isPresent: false, score: '' })
    setEduErrors({}); setEduDateError('')
  }

  const deleteEducation = (index) => setEducationList(educationList.filter((_, i) => i !== index))

  // Generate summary using Claude API
  const generateSummary = async () => {
    if (!name.trim()) { setNameError('Please enter your name first'); return }
    const hasData = workExperiences.length > 0 || educationList.length > 0 || skillsList.length > 0
    if (!hasData) {
      alert('Please fill in at least your work experience, education, or skills before generating a summary.')
      return
    }
    setIsGeneratingSummary(true)
    try {
      const cvData = {
        name, roles: workExperiences.map(e => `${e.jobTitle} at ${e.company}`).join(', '),
        education: educationList.map(e => `${e.degree} from ${e.school}`).join(', '),
        skills: skillsList.map(s => s.name).join(', '), certifications: certifications.map(c => c.name).join(', ')
      }
      const totalYears = workExperiences.reduce((acc, exp) => {
        const start = exp.startYear ? parseInt(exp.startYear) : 0
        const end = exp.isPresent ? new Date().getFullYear() : (exp.endYear ? parseInt(exp.endYear) : start)
        return acc + Math.max(0, end - start)
      }, 0)
      const prompt = `Write a concise, powerful 2-3 sentence professional summary for a resume. The person's name is ${cvData.name}. ${totalYears > 0 ? `They have exactly ${totalYears} year${totalYears !== 1 ? 's' : ''} of work experience — do NOT exaggerate or round up this number.` : 'They are a fresher with no work experience yet.'} ${cvData.roles ? `They have worked as: ${cvData.roles}.` : ''} ${cvData.education ? `Education: ${cvData.education}.` : ''} ${cvData.skills ? `Key skills: ${cvData.skills}.` : ''} ${cvData.certifications ? `Certifications: ${cvData.certifications}.` : ''} Write in first-person style starting with a strong descriptor. Keep it under 60 words. No bullet points, no markdown, no headers, no hashtags. Plain text only. Professional tone suitable for Indian job market.`
      const response = await fetch("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      })
      const data = await response.json()
      let text = data.text || ''
      text = text.replace(/^#+\s*/gm, '').replace(/\*\*/g, '').replace(/\*/g, '').trim()
      if (text) setSummary(text)
      else if (data.error) console.error('Summary error:', data.error)
    } catch(e) { console.error(e) }
    setIsGeneratingSummary(false)
  }

  // Get skill suggestions based on roles and education
  const getSkillSuggestions = () => {
    const suggested = new Set()
    workExperiences.forEach(exp => {
      const roleKey = Object.keys(SKILLS_BY_ROLE).find(k =>
        exp.jobTitle?.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(exp.jobTitle?.toLowerCase() || '')
      )
      if (roleKey) SKILLS_BY_ROLE[roleKey].forEach(s => suggested.add(s))
    })
    if (currentWork.jobTitle) {
      const roleKey = Object.keys(SKILLS_BY_ROLE).find(k =>
        currentWork.jobTitle.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(currentWork.jobTitle.toLowerCase())
      )
      if (roleKey) SKILLS_BY_ROLE[roleKey].forEach(s => suggested.add(s))
    }
    if (suggested.size === 0) SKILLS_BY_ROLE["General Fresher"].forEach(s => suggested.add(s))
    // Remove already added skills
    const currentSkillNames = skillsList.map(s => s.name.toLowerCase())
    return [...suggested].filter(s => !currentSkillNames.includes(s.toLowerCase()))
  }

  const addSkillFromSuggestion = (skill) => {
    if (!skillsList.map(s => s.name.toLowerCase()).includes(skill.toLowerCase())) {
      setSkillsList([...skillsList, { name: skill, level: 3 }])
    }
  }
  const addManualSkill = () => {
    const trimmed = currentSkillInput.trim()
    if (!trimmed) return
    if (skillsList.map(s => s.name.toLowerCase()).includes(trimmed.toLowerCase())) return
    setSkillsList([...skillsList, { name: trimmed, level: currentSkillLevel }])
    setCurrentSkillInput('')
    setCurrentSkillLevel(3)
  }
  const deleteSkill = (i) => setSkillsList(skillsList.filter((_, idx) => idx !== i))
  const updateSkillLevel = (i, level) => setSkillsList(skillsList.map((s, idx) => idx === i ? { ...s, level } : s))

  // Certifications
  const addCertification = () => {
    if (!currentCert.name.trim()) return
    if (certifications.some(c => c.name.toLowerCase() === currentCert.name.toLowerCase())) return
    setCertifications([...certifications, currentCert])
    setCurrentCert({ name: '', issuer: '', year: '' })
  }
  const deleteCertification = (i) => setCertifications(certifications.filter((_, idx) => idx !== i))

  // Languages
  const addLanguage = () => {
    if (!currentLanguage.name.trim()) return
    if (languages.some(l => l.name.toLowerCase() === currentLanguage.name.toLowerCase())) return
    setLanguages([...languages, currentLanguage])
    setCurrentLanguage({ name: '', level: 3 })
  }
  const deleteLanguage = (i) => setLanguages(languages.filter((_, idx) => idx !== i))

  // Projects
  const addProject = () => {
    if (!currentProject.name.trim()) return
    setProjects([...projects, currentProject])
    setCurrentProject({ name: '', description: '', link: '' })
  }
  const deleteProject = (index) => setProjects(projects.filter((_, i) => i !== index))

  const applySuggestion = (suggestion, field) => {
    const current = currentWork[field]
    setCurrentWork({ ...currentWork, [field]: current ? current + '\n• ' + suggestion : '• ' + suggestion })
  }

  const handleDownloadClick = () => setShowPaymentModal(true)

  const triggerDownload = () => {
    setIsDownloading(true)
    setShowPaymentModal(false)
    const element = document.getElementById('resume-preview')
    if (!element) { alert('❌ Could not find resume preview'); setIsDownloading(false); return }
    const opt = {
      margin: [8, 8, 8, 8],
      filename: `Resume_${(name || 'Resume').replace(/\s+/g, '_')}_${selectedTemplate}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, logging: false, scrollY: 0, windowWidth: 794 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'avoid-all', before: '.page-break-before', avoid: ['h2', 'h3', '.job-entry', '.edu-entry'] }
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
        {workExperiences.length > 0 && (<div className="mb-8 pb-8 border-b-2 border-gray-200"><h3 className="text-xl font-bold text-blue-600 mb-6 uppercase tracking-wide">Work Experience</h3><div className="space-y-6">{workExperiences.map((exp, i) => (<div key={i}><p className="text-xl font-bold text-gray-900 mb-1">{exp.jobTitle}</p><p className="text-base text-blue-600 font-semibold mb-1">{exp.company}</p><p className="text-sm text-gray-500 mb-3 italic">{formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p>{exp.responsibilities && <div className="text-base text-gray-700 whitespace-pre-line leading-relaxed">{exp.responsibilities}</div>}
{exp.achievements && <div className="mt-3 pt-2 border-t border-gray-100"><p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Key Achievements</p><div className="text-base text-gray-700 whitespace-pre-line leading-relaxed">{exp.achievements}</div></div>}</div>))}</div></div>)}
        {projects.length > 0 && (<div className="mb-8 pb-8 border-b-2 border-gray-200"><h3 className="text-xl font-bold text-blue-600 mb-6 uppercase tracking-wide">Projects</h3><div className="space-y-5">{projects.map((proj, i) => (<div key={i}><p className="text-lg font-bold text-gray-900 mb-1">🚀 {proj.name}</p>{proj.description && <p className="text-base text-gray-700 leading-relaxed mb-1">{proj.description}</p>}{proj.link && <p className="text-sm text-blue-500"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div></div>)}
        {educationList.length > 0 && (<div className="mb-8 pb-8 border-b-2 border-gray-200"><h3 className="text-xl font-bold text-blue-600 mb-6 uppercase tracking-wide">Education</h3><div className="space-y-5">{educationList.map((edu, i) => (<div key={i}><p className="text-lg font-bold text-gray-900 mb-1">{edu.school}</p><p className="text-base text-gray-700 mb-1">{edu.degree}</p><p className="text-sm text-gray-500 italic">{formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}{edu.score ? <span className="ml-2 text-blue-600 font-medium">{edu.score}</span> : null}</p></div>))}</div></div>)}
        {skillsList.length > 0 && (<div className="mb-6"><h3 className="text-xl font-bold text-blue-600 mb-5 uppercase tracking-wide">Skills</h3><div className="space-y-2">{skillsList.map((sk,i) => (<div key={i} className="flex items-center justify-between"><span className="text-base font-semibold text-gray-800">{sk.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n => <span key={n} className={`w-3 h-3 rounded-full ${sk.level>=n?'bg-blue-500':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {certifications.length > 0 && (<div className="mb-6"><h3 className="text-lg font-bold text-blue-600 mb-4 uppercase tracking-wide">Certifications</h3><div className="space-y-2">{certifications.map((cert,i) => (<div key={i}><p className="font-semibold text-gray-900">{cert.name}</p>{(cert.issuer||cert.year) && <p className="text-sm text-gray-500">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>}</div>))}</div></div>)}
        {languages.length > 0 && (<div className="mb-6"><h3 className="text-lg font-bold text-blue-600 mb-4 uppercase tracking-wide">Languages</h3><div className="flex flex-wrap gap-3">{languages.map((lang,i) => (<div key={i} className="flex items-center gap-2"><span className="font-medium text-gray-800">{lang.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n => <span key={n} className={`w-2.5 h-2.5 rounded-full ${lang.level>=n?'bg-blue-500':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {(websiteLinks.linkedin||websiteLinks.github||websiteLinks.portfolio||websiteLinks.other) && (<div className="mb-6"><h3 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide">Links</h3><div className="space-y-1">{websiteLinks.linkedin && <p className="text-sm text-blue-600 break-all">💼 <a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.linkedin}</a></p>}{websiteLinks.github && <p className="text-sm text-blue-600 break-all">🐙 <a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.github}</a></p>}{websiteLinks.portfolio && <p className="text-sm text-blue-600 break-all">🌍 <a href={websiteLinks.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.portfolio}</a></p>}{websiteLinks.other && <p className="text-sm text-blue-600 break-all">🔗 <a href={websiteLinks.other} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.other}</a></p>}</div></div>)}
        {hobbies && (<div className="mb-6"><h3 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide">Hobbies</h3><div className="flex flex-wrap gap-2">{hobbies.split(',').map((h,i) => h.trim() && <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{h.trim()}</span>)}</div></div>)}
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
        {workExperiences.length > 0 && (<div className="mb-10"><h3 className="text-lg font-bold text-gray-900 mb-5 uppercase border-b-4 border-gray-900 pb-2 tracking-wider">Professional Experience</h3><div className="space-y-6">{workExperiences.map((exp, i) => (<div key={i}><p className="font-bold text-gray-900 text-lg mb-1">{exp.jobTitle}</p><p className="text-base text-gray-800 italic mb-2">{exp.company} | {formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p>{exp.responsibilities && <div className="text-base text-gray-800 whitespace-pre-line leading-relaxed">{exp.responsibilities}</div>}
{exp.achievements && <div className="mt-3 pt-2 border-t border-gray-300"><p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Key Achievements</p><div className="text-base text-gray-800 whitespace-pre-line leading-relaxed">{exp.achievements}</div></div>}</div>))}</div></div>)}
        {projects.length > 0 && (<div className="mb-10"><h3 className="text-lg font-bold text-gray-900 mb-5 uppercase border-b-4 border-gray-900 pb-2 tracking-wider">Projects</h3><div className="space-y-4">{projects.map((proj, i) => (<div key={i}><p className="font-bold text-gray-900 text-base">🚀 {proj.name}</p>{proj.description && <p className="text-base text-gray-800 mt-1">{proj.description}</p>}{proj.link && <p className="text-sm text-gray-600 italic mt-1"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div></div>)}
        {educationList.length > 0 && (<div className="mb-10"><h3 className="text-lg font-bold text-gray-900 mb-5 uppercase border-b-4 border-gray-900 pb-2 tracking-wider">Education</h3><div className="space-y-4">{educationList.map((edu, i) => (<div key={i}><p className="font-bold text-gray-900 text-base">{edu.school}</p><p className="text-base text-gray-800">{edu.degree} | {formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div></div>)}
        {skillsList.length > 0 && (<div className="mb-6"><h3 className="text-lg font-bold text-gray-900 mb-4 uppercase border-b-4 border-gray-900 pb-2 tracking-wider">Skills</h3><div className="grid grid-cols-2 gap-2">{skillsList.map((sk,i) => (<div key={i} className="flex items-center justify-between"><span className="text-base text-gray-800 font-medium">{sk.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n => <span key={n} className={`w-2.5 h-2.5 rounded-full ${sk.level>=n?'bg-gray-800':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {certifications.length > 0 && (<div className="mb-6"><h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">Certifications</h3><div className="space-y-2">{certifications.map((cert,i) => (<div key={i}><p className="font-semibold text-gray-900">{cert.name}</p>{(cert.issuer||cert.year) && <p className="text-sm text-gray-500">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>}</div>))}</div></div>)}
        {languages.length > 0 && (<div className="mb-6"><h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">Languages</h3><div className="flex flex-wrap gap-3">{languages.map((lang,i) => (<div key={i} className="flex items-center gap-2"><span className="font-medium text-gray-800">{lang.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n => <span key={n} className={`w-2.5 h-2.5 rounded-full ${lang.level>=n?'bg-gray-700':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {(websiteLinks.linkedin||websiteLinks.github||websiteLinks.portfolio||websiteLinks.other) && (<div className="mb-6"><h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Links</h3><div className="space-y-1">{websiteLinks.linkedin && <p className="text-sm text-gray-700 break-all">💼 <a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.linkedin}</a></p>}{websiteLinks.github && <p className="text-sm text-gray-700 break-all">🐙 <a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.github}</a></p>}{websiteLinks.portfolio && <p className="text-sm text-gray-700 break-all">🌍 <a href={websiteLinks.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.portfolio}</a></p>}{websiteLinks.other && <p className="text-sm text-gray-700 break-all">🔗 <a href={websiteLinks.other} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.other}</a></p>}</div></div>)}
        {hobbies && (<div className="mb-6"><h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Hobbies</h3><div className="flex flex-wrap gap-2">{hobbies.split(',').map((h,i) => h.trim() && <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{h.trim()}</span>)}</div></div>)}
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
        {workExperiences.length > 0 && (<div className="mb-12"><h3 className="text-sm font-semibold text-gray-900 mb-6 tracking-widest uppercase">Experience</h3><div className="space-y-8">{workExperiences.map((exp, i) => (<div key={i}><p className="text-lg font-medium text-gray-900 mb-1">{exp.jobTitle}</p><p className="text-base text-gray-600 font-light mb-1">{exp.company}</p><p className="text-sm text-gray-500 mb-3 font-light">{formatDate(exp.startMonth, exp.startYear)} — {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p>{exp.responsibilities && <div className="text-base text-gray-700 whitespace-pre-line leading-relaxed font-light">{exp.responsibilities}</div>}
{exp.achievements && <div className="mt-3 pt-2 border-t border-gray-100"><p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Key Achievements</p><div className="text-base text-gray-700 whitespace-pre-line leading-relaxed font-light">{exp.achievements}</div></div>}</div>))}</div></div>)}
        {projects.length > 0 && (<div className="mb-12"><h3 className="text-sm font-semibold text-gray-900 mb-6 tracking-widest uppercase">Projects</h3><div className="space-y-5">{projects.map((proj, i) => (<div key={i}><p className="text-base font-medium text-gray-900">{proj.name}</p>{proj.description && <p className="text-base text-gray-700 font-light mt-1">{proj.description}</p>}{proj.link && <p className="text-sm text-gray-400 font-light mt-1"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div></div>)}
        {educationList.length > 0 && (<div className="mb-12"><h3 className="text-sm font-semibold text-gray-900 mb-6 tracking-widest uppercase">Education</h3><div className="space-y-5">{educationList.map((edu, i) => (<div key={i}><p className="text-base font-medium text-gray-900">{edu.school}</p><p className="text-base text-gray-700 font-light">{edu.degree}</p><p className="text-sm text-gray-500 font-light">{formatDate(edu.startMonth, edu.startYear)} — {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div></div>)}
        {skillsList.length > 0 && (<div className="mb-6"><h3 className="text-sm font-semibold text-gray-900 mb-5 tracking-widest uppercase">Skills</h3><div className="space-y-2">{skillsList.map((sk,i) => (<div key={i} className="flex items-center justify-between"><span className="text-base text-gray-700 font-light">{sk.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n => <span key={n} className={`w-2.5 h-2.5 rounded-full ${sk.level>=n?'bg-gray-500':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {certifications.length > 0 && (<div className="mb-6"><h3 className="text-lg font-bold text-gray-700 mb-4 uppercase tracking-wide">Certifications</h3><div className="space-y-2">{certifications.map((cert,i) => (<div key={i}><p className="font-semibold text-gray-900">{cert.name}</p>{(cert.issuer||cert.year) && <p className="text-sm text-gray-500">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>}</div>))}</div></div>)}
        {languages.length > 0 && (<div className="mb-6"><h3 className="text-lg font-bold text-gray-700 mb-4 uppercase tracking-wide">Languages</h3><div className="flex flex-wrap gap-3">{languages.map((lang,i) => (<div key={i} className="flex items-center gap-2"><span className="font-medium text-gray-800">{lang.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n => <span key={n} className={`w-2.5 h-2.5 rounded-full ${lang.level>=n?'bg-gray-400':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {(websiteLinks.linkedin||websiteLinks.github||websiteLinks.portfolio||websiteLinks.other) && (<div className="mb-6"><h3 className="text-lg font-bold text-gray-700 mb-3 uppercase tracking-wide">Links</h3><div className="space-y-1">{websiteLinks.linkedin && <p className="text-sm text-gray-500 break-all">💼 <a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.linkedin}</a></p>}{websiteLinks.github && <p className="text-sm text-gray-500 break-all">🐙 <a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.github}</a></p>}{websiteLinks.portfolio && <p className="text-sm text-gray-500 break-all">🌍 <a href={websiteLinks.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.portfolio}</a></p>}{websiteLinks.other && <p className="text-sm text-gray-500 break-all">🔗 <a href={websiteLinks.other} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.other}</a></p>}</div></div>)}
        {hobbies && (<div className="mb-6"><h3 className="text-lg font-bold text-gray-700 mb-3 uppercase tracking-wide">Hobbies</h3><div className="flex flex-wrap gap-2">{hobbies.split(',').map((h,i) => h.trim() && <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">{h.trim()}</span>)}</div></div>)}
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
        {workExperiences.length > 0 && (<div className="mb-8 pb-8 border-b-2 border-purple-200"><h3 className="text-lg font-bold text-purple-600 mb-6 uppercase tracking-wide flex items-center"><span className="mr-2">💼</span> Work Experience</h3><div className="space-y-6">{workExperiences.map((exp, i) => (<div key={i} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border-l-4 border-pink-500"><p className="text-xl font-bold text-gray-900 mb-1">{exp.jobTitle}</p><p className="text-base text-purple-600 font-bold mb-1">{exp.company}</p><p className="text-sm text-gray-600 mb-3 italic">{formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p>{exp.responsibilities && <div className="text-base text-gray-800 whitespace-pre-line leading-relaxed">{exp.responsibilities}</div>}
{exp.achievements && <div className="mt-3 pt-2 border-t border-gray-300"><p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Key Achievements</p><div className="text-base text-gray-800 whitespace-pre-line leading-relaxed">{exp.achievements}</div></div>}</div>))}</div></div>)}
        {projects.length > 0 && (<div className="mb-8 pb-8 border-b-2 border-purple-200"><h3 className="text-lg font-bold text-purple-600 mb-6 uppercase tracking-wide flex items-center"><span className="mr-2">🚀</span> Projects</h3><div className="space-y-5">{projects.map((proj, i) => (<div key={i} className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5 border-l-4 border-indigo-500"><p className="text-lg font-bold text-gray-900 mb-1">{proj.name}</p>{proj.description && <p className="text-base text-gray-800 mb-1">{proj.description}</p>}{proj.link && <p className="text-sm text-indigo-500"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div></div>)}
        {educationList.length > 0 && (<div className="mb-8 pb-8 border-b-2 border-purple-200"><h3 className="text-lg font-bold text-purple-600 mb-6 uppercase tracking-wide flex items-center"><span className="mr-2">🎓</span> Education</h3><div className="space-y-5">{educationList.map((edu, i) => (<div key={i} className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-5 border-l-4 border-orange-500"><p className="text-lg font-bold text-gray-900 mb-1">{edu.school}</p><p className="text-base text-gray-800 mb-1">{edu.degree}</p><p className="text-sm text-gray-600 italic">{formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div></div>)}
        {skillsList.length > 0 && (<div className="mb-6"><h3 className="text-lg font-bold text-purple-600 mb-5 uppercase tracking-wide flex items-center"><span className="mr-2">⚡</span> Skills</h3><div className="space-y-2">{skillsList.map((sk,i) => (<div key={i} className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-lg"><span className="text-base font-bold text-gray-800">{sk.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n => <span key={n} className={`w-3 h-3 rounded-full ${sk.level>=n?'bg-purple-500':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {certifications.length > 0 && (<div className="mb-6"><h3 className="text-lg font-bold text-purple-600 mb-4 uppercase tracking-wide">Certifications</h3><div className="space-y-2">{certifications.map((cert,i) => (<div key={i}><p className="font-semibold text-gray-900">{cert.name}</p>{(cert.issuer||cert.year) && <p className="text-sm text-gray-500">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>}</div>))}</div></div>)}
        {languages.length > 0 && (<div className="mb-6"><h3 className="text-lg font-bold text-purple-600 mb-4 uppercase tracking-wide">Languages</h3><div className="flex flex-wrap gap-3">{languages.map((lang,i) => (<div key={i} className="flex items-center gap-2"><span className="font-medium text-gray-800">{lang.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n => <span key={n} className={`w-2.5 h-2.5 rounded-full ${lang.level>=n?'bg-purple-500':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {(websiteLinks.linkedin||websiteLinks.github||websiteLinks.portfolio||websiteLinks.other) && (<div className="mb-6"><h3 className="text-lg font-bold text-purple-600 mb-3 uppercase tracking-wide">Links</h3><div className="space-y-1">{websiteLinks.linkedin && <p className="text-sm text-purple-600 break-all">💼 <a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.linkedin}</a></p>}{websiteLinks.github && <p className="text-sm text-purple-600 break-all">🐙 <a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.github}</a></p>}{websiteLinks.portfolio && <p className="text-sm text-purple-600 break-all">🌍 <a href={websiteLinks.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.portfolio}</a></p>}{websiteLinks.other && <p className="text-sm text-purple-600 break-all">🔗 <a href={websiteLinks.other} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.other}</a></p>}</div></div>)}
        {hobbies && (<div className="mb-6"><h3 className="text-lg font-bold text-purple-600 mb-3 uppercase tracking-wide">Hobbies</h3><div className="flex flex-wrap gap-2">{hobbies.split(',').map((h,i) => h.trim() && <span key={i} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">{h.trim()}</span>)}</div></div>)}
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
        {workExperiences.length > 0 && (<div className="mb-10 pb-6 border-b-2 border-gray-300"><h3 className="text-lg font-bold text-blue-600 mb-6 uppercase tracking-wide">Professional Experience</h3><div className="space-y-6 ml-5">{workExperiences.map((exp, i) => (<div key={i}><div className="flex justify-between items-baseline mb-2"><p className="text-xl font-bold text-gray-900">{exp.jobTitle}</p><p className="text-sm text-gray-600 italic">{formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p></div><p className="text-base text-blue-600 font-semibold mb-3">{exp.company}</p>{exp.responsibilities && <div className="text-base text-gray-800 whitespace-pre-line leading-relaxed">{exp.responsibilities}</div>}
{exp.achievements && <div className="mt-3 pt-2 border-t border-gray-300"><p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Key Achievements</p><div className="text-base text-gray-800 whitespace-pre-line leading-relaxed">{exp.achievements}</div></div>}</div>))}</div></div>)}
        {projects.length > 0 && (<div className="mb-10 pb-6 border-b-2 border-gray-300"><h3 className="text-lg font-bold text-blue-600 mb-6 uppercase tracking-wide">Projects</h3><div className="space-y-5 ml-5">{projects.map((proj, i) => (<div key={i}><p className="text-lg font-bold text-gray-900">🚀 {proj.name}</p>{proj.description && <p className="text-base text-gray-800 mt-1">{proj.description}</p>}{proj.link && <p className="text-sm text-blue-500 mt-1"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div></div>)}
        {educationList.length > 0 && (<div className="mb-10 pb-6 border-b-2 border-gray-300"><h3 className="text-lg font-bold text-blue-600 mb-6 uppercase tracking-wide">Education</h3><div className="space-y-5 ml-5">{educationList.map((edu, i) => (<div key={i}><p className="text-lg font-bold text-gray-900">{edu.school}</p><p className="text-base text-gray-800 mb-1">{edu.degree}</p><p className="text-sm text-gray-600 italic">{formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div></div>)}
        {skillsList.length > 0 && (<div className="mb-6"><h3 className="text-lg font-bold text-blue-600 mb-5 uppercase tracking-wide">Core Competencies</h3><div className="grid grid-cols-2 gap-2 ml-5">{skillsList.map((sk,i) => (<div key={i} className="flex items-center justify-between"><div className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3 inline-block"></span><span className="text-base text-gray-800">{sk.name}</span></div><div className="flex gap-1">{[1,2,3,4,5].map(n => <span key={n} className={`w-2.5 h-2.5 rounded-full ${sk.level>=n?'bg-blue-500':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {certifications.length > 0 && (<div className="mb-6"><h3 className="text-lg font-bold text-blue-600 mb-4 uppercase tracking-wide">Certifications</h3><div className="space-y-2">{certifications.map((cert,i) => (<div key={i}><p className="font-semibold text-gray-900">{cert.name}</p>{(cert.issuer||cert.year) && <p className="text-sm text-gray-500">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>}</div>))}</div></div>)}
        {languages.length > 0 && (<div className="mb-6"><h3 className="text-lg font-bold text-blue-600 mb-4 uppercase tracking-wide">Languages</h3><div className="flex flex-wrap gap-3">{languages.map((lang,i) => (<div key={i} className="flex items-center gap-2"><span className="font-medium text-gray-800">{lang.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n => <span key={n} className={`w-2.5 h-2.5 rounded-full ${lang.level>=n?'bg-blue-500':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {(websiteLinks.linkedin||websiteLinks.github||websiteLinks.portfolio||websiteLinks.other) && (<div className="mb-6"><h3 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide">Links</h3><div className="space-y-1">{websiteLinks.linkedin && <p className="text-sm text-blue-600 break-all">💼 <a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.linkedin}</a></p>}{websiteLinks.github && <p className="text-sm text-blue-600 break-all">🐙 <a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.github}</a></p>}{websiteLinks.portfolio && <p className="text-sm text-blue-600 break-all">🌍 <a href={websiteLinks.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.portfolio}</a></p>}{websiteLinks.other && <p className="text-sm text-blue-600 break-all">🔗 <a href={websiteLinks.other} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.other}</a></p>}</div></div>)}
        {hobbies && (<div className="mb-6"><h3 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide">Hobbies</h3><div className="flex flex-wrap gap-2">{hobbies.split(',').map((h,i) => h.trim() && <span key={i} className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm">{h.trim()}</span>)}</div></div>)}
      </div>
    </div>
  )

  const SidebarTemplate = () => (
    <div className="bg-white shadow-2xl overflow-hidden">
      <div className="p-8 pb-4"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-green-700 hover:to-teal-700 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}><span className="mr-2">📥</span> {isDownloading ? 'Generating PDF...' : 'Download PDF'}</button></div>
      <div id="resume-preview" className="grid grid-cols-3 gap-0">
        <div className="col-span-1 bg-gradient-to-b from-green-700 to-teal-700 text-white p-8">
          <h2 className="text-lg font-bold mb-8 text-center border-b-2 border-white pb-2">Live Preview - Sidebar</h2>
          {photo ? <img src={photo} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-green-400 mx-auto mb-5 shadow-md" /> : <div className="w-16 h-16 rounded-full bg-green-600 border-4 border-green-400 mx-auto mb-5 flex items-center justify-center text-xl font-bold text-white">{name ? name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : 'YN'}</div>}
          <div className="mb-8"><h3 className="text-sm font-bold mb-4 uppercase tracking-wider border-b border-green-300 pb-2">Contact</h3><div className="space-y-3 text-sm"><div><p className="text-green-200 text-xs mb-1">Email</p><p className="break-words">{email || 'your.email@example.com'}</p></div><div><p className="text-green-200 text-xs mb-1">Phone</p><p>{phone || '+91 98765 43210'}</p></div></div></div>
          {skillsList.length > 0 && (<div className="mb-8"><h3 className="text-sm font-bold mb-4 uppercase tracking-wider border-b border-green-300 pb-2">Skills</h3><div className="space-y-2">{skillsList.map((sk,i) => (<div key={i} className="flex items-center justify-between text-sm"><span className="flex items-center"><span className="w-2 h-2 bg-green-300 rounded-full mr-2 inline-block"></span>{sk.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n => <span key={n} className={`w-2 h-2 rounded-full ${sk.level>=n?'bg-green-300':'bg-green-800'}`}></span>)}</div></div>))}</div></div>)}
          {certifications.length > 0 && (<div className="mb-8"><h3 className="text-sm font-bold mb-4 uppercase tracking-wider border-b border-green-300 pb-2">Certifications</h3><div className="space-y-2">{certifications.map((cert,i) => (<div key={i}><p className="text-sm font-semibold">{cert.name}</p>{(cert.issuer||cert.year) && <p className="text-xs text-green-200">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>}</div>))}</div></div>)}
          {languages.length > 0 && (<div className="mb-8"><h3 className="text-sm font-bold mb-4 uppercase tracking-wider border-b border-green-300 pb-2">Languages</h3><div className="space-y-2">{languages.map((lang,i) => (<div key={i}><p className="text-sm font-semibold">{lang.name}</p><div className="flex gap-1 mt-1">{[1,2,3,4,5].map(n => <span key={n} className={`w-2.5 h-2.5 rounded-full ${lang.level>=n?'bg-green-300':'bg-green-800'}`}></span>)}</div></div>))}</div></div>)}
          {(websiteLinks.linkedin||websiteLinks.github||websiteLinks.portfolio||websiteLinks.other) && (<div className="mb-8"><h3 className="text-sm font-bold mb-3 uppercase tracking-wider border-b border-green-300 pb-2">Links</h3><div className="space-y-1">{websiteLinks.linkedin && <p className="text-xs text-green-200 break-all">💼 <a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.linkedin}</a></p>}{websiteLinks.github && <p className="text-xs text-green-200 break-all">🐙 <a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.github}</a></p>}{websiteLinks.portfolio && <p className="text-xs text-green-200 break-all">🌍 <a href={websiteLinks.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.portfolio}</a></p>}{websiteLinks.other && <p className="text-xs text-green-200 break-all">🔗 <a href={websiteLinks.other} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.other}</a></p>}</div></div>)}
          {hobbies && (<div className="mb-8"><h3 className="text-sm font-bold mb-3 uppercase tracking-wider border-b border-green-300 pb-2">Hobbies</h3><div className="flex flex-wrap gap-1">{hobbies.split(',').map((h,i) => h.trim() && <span key={i} className="text-xs bg-green-700 px-2 py-1 rounded-full">{h.trim()}</span>)}</div></div>)}
          {educationList.length > 0 && (<div><h3 className="text-sm font-bold mb-4 uppercase tracking-wider border-b border-green-300 pb-2">Education</h3><div className="space-y-4">{educationList.map((edu, i) => (<div key={i} className="text-sm"><p className="font-bold">{edu.school}</p><p className="text-green-200 text-xs mt-1">{edu.degree}</p><p className="text-green-300 text-xs mt-1">{formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div></div>)}
        </div>
        <div className="col-span-2 p-8">
          <div className="mb-8"><h3 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">{name || 'Your Name'}</h3><div className="h-1 w-24 bg-gradient-to-r from-green-600 to-teal-600"></div></div>
          {summary && (<div className="mb-8"><h3 className="text-lg font-bold text-green-700 mb-3 uppercase tracking-wide">Professional Summary</h3><p className="text-base text-gray-700 leading-relaxed">{summary}</p></div>)}
          {workExperiences.length > 0 && (<div className="mb-8"><h3 className="text-lg font-bold text-green-700 mb-5 uppercase tracking-wide">Work Experience</h3><div className="space-y-6">{workExperiences.map((exp, i) => (<div key={i}><p className="text-xl font-bold text-gray-900 mb-1">{exp.jobTitle}</p><p className="text-base text-green-600 font-semibold mb-1">{exp.company}</p><p className="text-sm text-gray-500 mb-3 italic">{formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p>{exp.responsibilities && <div className="text-base text-gray-700 whitespace-pre-line leading-relaxed">{exp.responsibilities}</div>}
{exp.achievements && <div className="mt-3 pt-2 border-t border-green-200"><p className="text-xs font-bold text-green-800 uppercase tracking-wide mb-1">Key Achievements</p><div className="text-base text-gray-700 whitespace-pre-line leading-relaxed">{exp.achievements}</div></div>}</div>))}</div></div>)}
          {projects.length > 0 && (<div className="mb-8"><h3 className="text-lg font-bold text-green-700 mb-5 uppercase tracking-wide">Projects</h3><div className="space-y-4">{projects.map((proj, i) => (<div key={i}><p className="text-base font-bold text-gray-900">🚀 {proj.name}</p>{proj.description && <p className="text-sm text-gray-700 mt-1">{proj.description}</p>}{proj.link && <p className="text-xs text-green-600 mt-1"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div></div>)}
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
        {workExperiences.length > 0 && (<div className="mb-10 pb-8 border-b border-rose-100"><h3 className="text-lg font-serif font-bold text-rose-600 mb-6 text-center italic">Professional Experience</h3><div className="space-y-6">{workExperiences.map((exp, i) => (<div key={i} className="border-l-4 border-rose-300 pl-6"><p className="text-xl font-serif font-bold text-gray-900 mb-1">{exp.jobTitle}</p><p className="text-base text-rose-600 font-semibold mb-1 italic">{exp.company}</p><p className="text-sm text-gray-500 mb-3 italic">{formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p>{exp.responsibilities && <div className="text-base text-gray-700 whitespace-pre-line leading-relaxed">{exp.responsibilities}</div>}
{exp.achievements && <div className="mt-3 pt-2 border-t border-gray-100"><p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Key Achievements</p><div className="text-base text-gray-700 whitespace-pre-line leading-relaxed">{exp.achievements}</div></div>}</div>))}</div></div>)}
        {projects.length > 0 && (<div className="mb-10 pb-8 border-b border-rose-100"><h3 className="text-lg font-serif font-bold text-rose-600 mb-6 text-center italic">Projects</h3><div className="space-y-5">{projects.map((proj, i) => (<div key={i} className="border-l-4 border-rose-200 pl-6"><p className="text-lg font-serif font-bold text-gray-900">{proj.name}</p>{proj.description && <p className="text-base text-gray-700 italic mt-1">{proj.description}</p>}{proj.link && <p className="text-sm text-rose-400 mt-1"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div></div>)}
        {educationList.length > 0 && (<div className="mb-10 pb-8 border-b border-rose-100"><h3 className="text-lg font-serif font-bold text-rose-600 mb-6 text-center italic">Education</h3><div className="space-y-5">{educationList.map((edu, i) => (<div key={i} className="border-l-4 border-orange-300 pl-6"><p className="text-lg font-serif font-bold text-gray-900">{edu.school}</p><p className="text-base text-gray-700 mb-1 italic">{edu.degree}</p><p className="text-sm text-gray-500 italic">{formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}{edu.score ? <span className="ml-2 text-blue-600 font-medium">{edu.score}</span> : null}</p></div>))}</div></div>)}
        {skillsList.length > 0 && (<div className="mb-6"><h3 className="text-lg font-serif font-bold text-rose-600 mb-5 text-center italic">Core Competencies</h3><div className="space-y-2">{skillsList.map((sk,i) => (<div key={i} className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-rose-50 to-orange-50 rounded-lg border border-rose-100"><span className="text-base text-rose-800 italic font-medium">{sk.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n => <span key={n} className={`w-3 h-3 rounded-full ${sk.level>=n?'bg-rose-400':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {certifications.length > 0 && (<div className="mb-6"><h3 className="text-lg font-bold text-rose-500 mb-4 uppercase tracking-wide">Certifications</h3><div className="space-y-2">{certifications.map((cert,i) => (<div key={i}><p className="font-semibold text-gray-900">{cert.name}</p>{(cert.issuer||cert.year) && <p className="text-sm text-gray-500">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>}</div>))}</div></div>)}
        {languages.length > 0 && (<div className="mb-6"><h3 className="text-lg font-bold text-rose-500 mb-4 uppercase tracking-wide">Languages</h3><div className="flex flex-wrap gap-3">{languages.map((lang,i) => (<div key={i} className="flex items-center gap-2"><span className="font-medium text-gray-800">{lang.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n => <span key={n} className={`w-2.5 h-2.5 rounded-full ${lang.level>=n?'bg-rose-400':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {(websiteLinks.linkedin||websiteLinks.github||websiteLinks.portfolio||websiteLinks.other) && (<div className="mb-6"><h3 className="text-lg font-bold text-rose-500 mb-3 uppercase tracking-wide">Links</h3><div className="space-y-1">{websiteLinks.linkedin && <p className="text-sm text-rose-500 break-all">💼 <a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.linkedin}</a></p>}{websiteLinks.github && <p className="text-sm text-rose-500 break-all">🐙 <a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.github}</a></p>}{websiteLinks.portfolio && <p className="text-sm text-rose-500 break-all">🌍 <a href={websiteLinks.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.portfolio}</a></p>}{websiteLinks.other && <p className="text-sm text-rose-500 break-all">🔗 <a href={websiteLinks.other} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.other}</a></p>}</div></div>)}
        {hobbies && (<div className="mb-6"><h3 className="text-lg font-bold text-rose-500 mb-3 uppercase tracking-wide">Hobbies</h3><div className="flex flex-wrap gap-2">{hobbies.split(',').map((h,i) => h.trim() && <span key={i} className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-sm">{h.trim()}</span>)}</div></div>)}
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
        {workExperiences.length > 0 && (<div className="mb-8 pb-8 border-b-2 border-violet-200"><h3 className="text-lg font-bold text-violet-600 mb-6 uppercase tracking-wide font-mono flex items-center"><span className="text-violet-400 mr-2">{'>'}</span>Work Experience</h3><div className="space-y-6">{workExperiences.map((exp, i) => (<div key={i} className="bg-gradient-to-r from-violet-50 to-purple-50 p-5 rounded-lg border-l-4 border-purple-500"><p className="text-xl font-bold text-gray-900 mb-1 font-mono">{exp.jobTitle}</p><p className="text-base text-violet-600 font-semibold mb-1 font-mono">{exp.company}</p><p className="text-sm text-gray-500 mb-3 font-mono"><span className="text-violet-400">{'['}</span>{formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}<span className="text-violet-400">{']'}</span></p>{exp.responsibilities && <div className="text-base text-gray-700 whitespace-pre-line leading-relaxed">{exp.responsibilities}</div>}
{exp.achievements && <div className="mt-3 pt-2 border-t border-gray-100"><p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Key Achievements</p><div className="text-base text-gray-700 whitespace-pre-line leading-relaxed">{exp.achievements}</div></div>}</div>))}</div></div>)}
        {projects.length > 0 && (<div className="mb-8 pb-8 border-b-2 border-violet-200"><h3 className="text-lg font-bold text-violet-600 mb-6 uppercase tracking-wide font-mono flex items-center"><span className="text-violet-400 mr-2">{'>'}</span>Projects</h3><div className="space-y-5">{projects.map((proj, i) => (<div key={i} className="bg-gradient-to-r from-violet-50 to-purple-50 p-5 rounded-lg border-l-4 border-violet-300"><p className="text-lg font-bold text-gray-900 font-mono">🚀 {proj.name}</p>{proj.description && <p className="text-base text-gray-700 mt-1">{proj.description}</p>}{proj.link && <p className="text-sm text-violet-500 font-mono mt-1"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div></div>)}
        {educationList.length > 0 && (<div className="mb-8 pb-8 border-b-2 border-violet-200"><h3 className="text-lg font-bold text-violet-600 mb-6 uppercase tracking-wide font-mono flex items-center"><span className="text-violet-400 mr-2">{'>'}</span>Education</h3><div className="space-y-5">{educationList.map((edu, i) => (<div key={i} className="bg-gray-50 p-5 rounded-lg border-l-4 border-violet-400"><p className="text-lg font-bold text-gray-900 font-mono">{edu.school}</p><p className="text-base text-gray-700 mb-1">{edu.degree}</p><p className="text-sm text-gray-500 font-mono">{formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div></div>)}
        {skillsList.length > 0 && (<div className="mb-6"><h3 className="text-lg font-bold text-violet-600 mb-5 uppercase tracking-wide font-mono flex items-center"><span className="text-violet-400 mr-2">{'>'}</span>Tech Stack</h3><div className="space-y-2">{skillsList.map((sk,i) => (<div key={i} className="flex items-center justify-between bg-gray-900 px-4 py-2 rounded-md"><span className="text-base text-violet-300 font-mono font-bold">{sk.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n => <span key={n} className={`w-3 h-3 rounded-sm ${sk.level>=n?'bg-violet-400':'bg-gray-700'}`}></span>)}</div></div>))}</div></div>)}
        {certifications.length > 0 && (<div className="mb-6"><h3 className="text-lg font-bold text-violet-600 mb-4 uppercase tracking-wide font-mono">Certifications</h3><div className="space-y-2">{certifications.map((cert,i) => (<div key={i}><p className="font-semibold text-gray-900 font-mono">{cert.name}</p>{(cert.issuer||cert.year) && <p className="text-sm text-gray-500">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>}</div>))}</div></div>)}
        {languages.length > 0 && (<div className="mb-6"><h3 className="text-lg font-bold text-violet-600 mb-4 uppercase tracking-wide font-mono">Languages</h3><div className="flex flex-wrap gap-3">{languages.map((lang,i) => (<div key={i} className="flex items-center gap-2"><span className="font-medium text-gray-800 font-mono">{lang.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n => <span key={n} className={`w-2.5 h-2.5 rounded-full ${lang.level>=n?'bg-violet-500':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {(websiteLinks.linkedin||websiteLinks.github||websiteLinks.portfolio||websiteLinks.other) && (<div className="mb-6"><h3 className="text-lg font-bold text-violet-600 mb-3 uppercase tracking-wide font-mono">Links</h3><div className="space-y-1">{websiteLinks.linkedin && <p className="text-sm text-violet-600 break-all font-mono">💼 <a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.linkedin}</a></p>}{websiteLinks.github && <p className="text-sm text-violet-600 break-all font-mono">🐙 <a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.github}</a></p>}{websiteLinks.portfolio && <p className="text-sm text-violet-600 break-all font-mono">🌍 <a href={websiteLinks.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.portfolio}</a></p>}{websiteLinks.other && <p className="text-sm text-violet-600 break-all font-mono">🔗 <a href={websiteLinks.other} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.other}</a></p>}</div></div>)}
        {hobbies && (<div className="mb-6"><h3 className="text-lg font-bold text-violet-600 mb-3 uppercase tracking-wide font-mono">Hobbies</h3><div className="flex flex-wrap gap-2">{hobbies.split(',').map((h,i) => h.trim() && <span key={i} className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm font-mono">{h.trim()}</span>)}</div></div>)}
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
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" value={name} onChange={e => { setName(e.target.value); setNameError('') }} placeholder="Enter your full name" className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${nameError ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
                  {nameError && <p className="text-red-500 text-xs mt-1">⚠️ {nameError}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your.email@example.com" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Phone</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>

                {/* Photo Upload - only shown for templates that display it */}
                {['sidebar', 'greensidebar', 'goldheader', 'classicserif', 'coral'].includes(selectedTemplate) && (
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Profile Photo <span className="text-gray-400 font-normal">(optional — shown in this template)</span>
                  </label>
                  <div className="flex items-center gap-4">
                    {photo ? (
                      <div className="relative">
                        <img src={photo} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-blue-200 shadow-md" />
                        <button onClick={() => setPhoto(null)}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 transition flex items-center justify-center shadow">
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm text-center leading-tight">
                        <span>No<br/>photo</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-indigo-600 transition shadow-sm">
                        📷 {photo ? 'Change Photo' : 'Upload Photo'}
                        <input type="file" accept="image/*" className="hidden"
                          onChange={e => {
                            const file = e.target.files[0]
                            if (!file) return
                            if (file.size > 2 * 1024 * 1024) { alert('Please choose an image smaller than 2MB'); return }
                            const reader = new FileReader()
                            reader.onload = ev => setPhoto(ev.target.result)
                            reader.readAsDataURL(file)
                          }} />
                      </label>
                      <p className="text-xs text-gray-400 mt-1.5">JPG, PNG · Max 2MB · Will appear in resume</p>
                    </div>
                  </div>
                </div>
                )}

              </div>
            </div>

            {/* Summary */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center"><span className="mr-2">📝</span> Professional Summary</h2>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">About You (2-3 sentences)</label>
                <textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="e.g. Experienced software engineer with 3+ years building scalable web applications..." rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">💡 Tip: Keep it concise and highlight your key strengths</p>
                  <button onClick={generateSummary} disabled={isGeneratingSummary}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm text-white ${isGeneratingSummary ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'}`}>
                    {isGeneratingSummary ? '⏳ Generating...' : '✨ Auto-generate from CV'}
                  </button>
                </div>
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
                  onChange={val => { setCurrentWork({ ...currentWork, jobTitle: val }); setWorkErrors({ ...workErrors, jobTitle: '' }); setShowSuggestions(null) }}
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
                      onMonthChange={val => {
                        const updated = { ...currentWork, endMonth: val }
                        setCurrentWork(updated)
                        if (updated.startYear && updated.endYear && updated.startMonth && val) {
                          const startIdx = MONTHS.indexOf(updated.startMonth)
                          const endIdx = MONTHS.indexOf(val)
                          const startY = parseInt(updated.startYear)
                          const endY = parseInt(updated.endYear)
                          if (endY < startY || (endY === startY && endIdx < startIdx)) {
                            setDateError('⚠️ End date cannot be before start date')
                          } else setDateError('')
                        } else setDateError('')
                      }}
                      onYearChange={val => {
                        const updated = { ...currentWork, endYear: val }
                        setCurrentWork(updated)
                        if (updated.startYear && val && updated.startMonth && updated.endMonth) {
                          const startIdx = MONTHS.indexOf(updated.startMonth)
                          const endIdx = MONTHS.indexOf(updated.endMonth)
                          const startY = parseInt(updated.startYear)
                          const endY = parseInt(val)
                          if (endY < startY || (endY === startY && endIdx < startIdx)) {
                            setDateError('⚠️ End date cannot be before start date')
                          } else setDateError('')
                        } else setDateError('')
                      }}
                      required
                      allowPresent
                      isPresent={currentWork.isPresent}
                      onPresentChange={val => setCurrentWork({ ...currentWork, isPresent: val, endMonth: '', endYear: '' })}
                    />
                    {(workErrors.endMonth || workErrors.endYear) && <p className="text-red-500 text-xs mt-1">⚠️ End date required</p>}
                  </div>
                </div>
                {dateError && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">{dateError}</p>}

                {/* Responsibilities */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Key Responsibilities <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={currentWork.responsibilities}
                    onChange={e => { setCurrentWork({ ...currentWork, responsibilities: e.target.value }); setWorkErrors({ ...workErrors, responsibilities: '' }) }}
                    placeholder="• Describe your main duties and day-to-day responsibilities..."
                    rows="4"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${workErrors.responsibilities ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                  />
                  {workErrors.responsibilities && <p className="text-red-500 text-xs mt-1">⚠️ {workErrors.responsibilities}</p>}
                  {currentWork.jobTitle && (
                    <button
                      onClick={() => setShowSuggestions(showSuggestions === 'resp' ? false : 'resp')}
                      className="mt-2 text-sm text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1 transition"
                    >
                      💼 {showSuggestions === 'resp' ? 'Hide suggestions' : 'Suggest responsibilities'}
                    </button>
                  )}
                  {showSuggestions === 'resp' && currentWork.jobTitle && (
                    <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="text-sm font-semibold text-blue-800 mb-3">
                        💡 Click to add for <em>{currentWork.jobTitle}</em>:
                      </p>
                      <div className="space-y-2">
                        {getSuggestions(currentWork.jobTitle).responsibilities.map((s, i) => (
                          <button key={i} onClick={() => applySuggestion(s, 'responsibilities')}
                            className="w-full text-left text-sm text-gray-700 hover:text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-lg transition border border-transparent hover:border-blue-200">
                            • {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Achievements */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Key Achievements <span className="text-gray-400 font-normal">(optional but recommended)</span>
                  </label>
                  <textarea
                    value={currentWork.achievements}
                    onChange={e => setCurrentWork({ ...currentWork, achievements: e.target.value })}
                    placeholder="• Highlight measurable wins, impact, and accomplishments..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                  {currentWork.jobTitle && (
                    <button
                      onClick={() => setShowSuggestions(showSuggestions === 'ach' ? false : 'ach')}
                      className="mt-2 text-sm text-purple-600 font-semibold hover:text-purple-800 flex items-center gap-1 transition"
                    >
                      🏆 {showSuggestions === 'ach' ? 'Hide suggestions' : 'Suggest achievements'}
                    </button>
                  )}
                  {showSuggestions === 'ach' && currentWork.jobTitle && (
                    <div className="mt-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
                      <p className="text-sm font-semibold text-purple-800 mb-3">
                        🏆 Click to add for <em>{currentWork.jobTitle}</em>:
                      </p>
                      <div className="space-y-2">
                        {getSuggestions(currentWork.jobTitle).achievements.map((s, i) => (
                          <button key={i} onClick={() => applySuggestion(s, 'achievements')}
                            className="w-full text-left text-sm text-gray-700 hover:text-purple-700 hover:bg-purple-100 px-3 py-2 rounded-lg transition border border-transparent hover:border-purple-200">
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
                      onMonthChange={val => {
                        const updated = { ...currentEducation, endMonth: val }
                        setCurrentEducation(updated)
                        if (updated.startYear && updated.endYear && updated.startMonth && val) {
                          const startIdx = MONTHS.indexOf(updated.startMonth)
                          const endIdx = MONTHS.indexOf(val)
                          const startY = parseInt(updated.startYear)
                          const endY = parseInt(updated.endYear)
                          if (endY < startY || (endY === startY && endIdx < startIdx)) {
                            setEduDateError('⚠️ End date cannot be before start date')
                          } else setEduDateError('')
                        } else setEduDateError('')
                      }}
                      onYearChange={val => {
                        const updated = { ...currentEducation, endYear: val }
                        setCurrentEducation(updated)
                        if (updated.startYear && val && updated.startMonth && updated.endMonth) {
                          const startIdx = MONTHS.indexOf(updated.startMonth)
                          const endIdx = MONTHS.indexOf(updated.endMonth)
                          const startY = parseInt(updated.startYear)
                          const endY = parseInt(val)
                          if (endY < startY || (endY === startY && endIdx < startIdx)) {
                            setEduDateError('⚠️ End date cannot be before start date')
                          } else setEduDateError('')
                        } else setEduDateError('')
                      }}
                      required
                      allowPresent
                      isPresent={currentEducation.isPresent}
                      onPresentChange={val => setCurrentEducation({ ...currentEducation, isPresent: val, endMonth: '', endYear: '' })}
                      presentLabel="Currently studying here"
                    />
                    {(eduErrors.endMonth || eduErrors.endYear) && <p className="text-red-500 text-xs mt-1">⚠️ End date required</p>}
                  </div>
                </div>
                {eduDateError && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">{eduDateError}</p>}

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Score / CGPA <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input type="text" value={currentEducation.score || ''} onChange={e => {
                      const val = e.target.value
                      // Allow only numbers and one decimal point
                      if (val === '' || /^\d*\.?\d*$/.test(val)) {
                        const num = parseFloat(val)
                        if (val === '' || val === '.' || (num <= 100)) {
                          setCurrentEducation({ ...currentEducation, score: val })
                        }
                      }
                    }}
                    placeholder="e.g. 8.5 or 78"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>

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
                          <p className="text-xs text-gray-500">{formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}{edu.score ? ` · ${edu.score}` : ''}</p>
                        </div>
                        <button onClick={() => deleteEducation(i)} className="text-red-600 hover:text-red-800 font-semibold text-sm hover:bg-red-50 px-3 py-1 rounded transition">Delete</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Projects */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center"><span className="mr-2">🚀</span> Projects</h2>
                <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">Optional</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">Add personal, academic or work projects that showcase your skills.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Project Name</label>
                  <input
                    type="text"
                    value={currentProject.name}
                    onChange={e => setCurrentProject({ ...currentProject, name: e.target.value })}
                    placeholder="e.g. E-commerce Website, ML Price Predictor"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Description</label>
                  <textarea
                    value={currentProject.description}
                    onChange={e => setCurrentProject({ ...currentProject, description: e.target.value })}
                    placeholder="Briefly describe what you built, the tech used, and the impact..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Link <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input
                    type="url"
                    value={currentProject.link}
                    onChange={e => setCurrentProject({ ...currentProject, link: e.target.value })}
                    placeholder="e.g. https://github.com/username/project"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${currentProject.link && !currentProject.link.startsWith('http') ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                  />
                  {currentProject.link && !currentProject.link.startsWith('http') && (
                    <p className="text-red-500 text-xs mt-1">⚠️ Please enter a valid URL starting with https://</p>
                  )}
                </div>
                <button
                  onClick={addProject}
                  disabled={!currentProject.name.trim()}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition shadow-md text-white ${currentProject.name.trim() ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : 'bg-gray-300 cursor-not-allowed'}`}
                >
                  + Add Project
                </button>
                {projects.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700">Added ({projects.length}):</h3>
                    {projects.map((proj, i) => (
                      <div key={i} className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100 flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">🚀 {proj.name}</p>
                          {proj.description && <p className="text-sm text-gray-600 mt-1">{proj.description}</p>}
                          {proj.link && <p className="text-xs text-blue-500 mt-1 truncate"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}
                        </div>
                        <button onClick={() => deleteProject(i)} className="text-red-600 hover:text-red-800 font-semibold text-sm hover:bg-red-50 px-3 py-1 rounded transition ml-3 flex-shrink-0">Delete</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>


            {/* Skills */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center"><span className="mr-2">⚡</span> Skills</h2>
              <div className="space-y-4">

                {/* Add skill manually */}
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Skill Name</label>
                    <input type="text" value={currentSkillInput} onChange={e => setCurrentSkillInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addManualSkill()}
                      placeholder="e.g. Python, React, Leadership..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Level</label>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(n => (
                        <button key={n} onClick={() => setCurrentSkillLevel(n)}
                          className={`w-8 h-8 rounded-full text-xs font-bold border-2 transition ${currentSkillLevel >= n ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-center">{['','Beginner','Elementary','Intermediate','Advanced','Expert'][currentSkillLevel]}</p>
                  </div>
                  <button onClick={addManualSkill} disabled={!currentSkillInput.trim()}
                    className={`px-4 py-3 rounded-lg font-semibold transition text-white mb-6 ${currentSkillInput.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}>
                    + Add
                  </button>
                </div>

                {/* Skill Suggestions */}
                <button onClick={() => { setShowSkillSuggestions(!showSkillSuggestions); setSuggestedSkills(getSkillSuggestions()) }}
                  className="text-sm text-purple-600 font-semibold hover:text-purple-800 flex items-center gap-1 transition">
                  💡 {showSkillSuggestions ? 'Hide suggestions' : 'Suggest skills based on your roles'}
                </button>
                {showSkillSuggestions && (
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <p className="text-sm font-semibold text-purple-800 mb-2">Click any skill to add it (default level 3):</p>
                    <input type="text" value={skillSearch} onChange={e => setSkillSearch(e.target.value)}
                      placeholder="Search suggestions..." className="w-full px-3 py-2 border border-purple-200 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400" />
                    <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto pr-1">
                      {suggestedSkills.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase())).map((skill, i) => (
                        <button key={i} onClick={() => addSkillFromSuggestion(skill)}
                          className="px-3 py-1.5 bg-white border border-purple-300 text-purple-800 rounded-full text-sm hover:bg-purple-600 hover:text-white hover:border-purple-600 transition font-medium">
                          + {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Added skills with level editing */}
                {skillsList.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Added ({skillsList.length}):</p>
                    <div className="space-y-2">
                      {skillsList.map((skill, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                          <span className="font-medium text-gray-900 text-sm">{skill.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {[1,2,3,4,5].map(n => (
                                <button key={n} onClick={() => updateSkillLevel(i, n)}
                                  className={`w-6 h-6 rounded-full text-xs font-bold border transition ${skill.level >= n ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                  {n}
                                </button>
                              ))}
                            </div>
                            <span className="text-xs text-gray-400 w-20">{['','Beginner','Elementary','Intermediate','Advanced','Expert'][skill.level]}</span>
                            <button onClick={() => deleteSkill(i)} className="text-red-400 hover:text-red-600 text-sm font-bold ml-1">✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Certifications */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center"><span className="mr-2">🏆</span> Certifications</h2>
                <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">Optional</span>
              </div>
              <div className="space-y-4">
                <div>
                  <SearchableDropdown
                    options={CERTIFICATION_LIST}
                    value={currentCert.name}
                    onChange={val => setCurrentCert({ ...currentCert, name: val })}
                    placeholder="Select or search certification..."
                    label="Certification Name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Issuing Organisation</label>
                    <input type="text" value={currentCert.issuer} onChange={e => setCurrentCert({ ...currentCert, issuer: e.target.value })}
                      placeholder="e.g. Amazon, NSDC, Coursera"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Year</label>
                    <select value={currentCert.year} onChange={e => setCurrentCert({ ...currentCert, year: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white">
                      <option value="">Select year</option>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={addCertification} disabled={!currentCert.name.trim()}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition shadow-md text-white ${currentCert.name.trim() ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : 'bg-gray-300 cursor-not-allowed'}`}>
                  + Add Certification
                </button>
                {certifications.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {certifications.map((cert, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">🏆 {cert.name}</p>
                          {cert.issuer && <p className="text-xs text-gray-500">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>}
                        </div>
                        <button onClick={() => deleteCertification(i)} className="text-red-500 hover:text-red-700 text-sm font-semibold ml-3">Delete</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Website Links */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center"><span className="mr-2">🌐</span> Website Links</h2>
                <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">Optional</span>
              </div>
              <div className="space-y-3">
                {[
                  { key: 'linkedin', label: '💼 LinkedIn', placeholder: 'https://linkedin.com/in/yourname' },
                  { key: 'github', label: '🐙 GitHub', placeholder: 'https://github.com/yourusername' },
                  { key: 'portfolio', label: '🌍 Portfolio', placeholder: 'https://yourportfolio.com' },
                  { key: 'other', label: '🔗 Other', placeholder: 'https://yourlink.com' }
                ].map(({ key, label, placeholder }) => {
                  const val = websiteLinks[key]
                  const isInvalid = val && !val.startsWith('http')
                  return (
                    <div key={key}>
                      <label className="block text-sm font-semibold mb-2 text-gray-700">{label}</label>
                      <input type="url" value={val}
                        onChange={e => setWebsiteLinks({ ...websiteLinks, [key]: e.target.value })}
                        placeholder={placeholder}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isInvalid ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
                      {isInvalid && <p className="text-red-500 text-xs mt-1">⚠️ Please enter a valid URL starting with https://</p>}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Languages */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center"><span className="mr-2">🌍</span> Languages</h2>
                <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">Optional</span>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <SearchableDropdown
                      options={LANGUAGE_LIST}
                      value={currentLanguage.name}
                      onChange={val => setCurrentLanguage({ ...currentLanguage, name: val })}
                      placeholder="Select language..."
                      label="Language"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Proficiency (1–5)</label>
                    <div className="flex items-center gap-1 mt-3">
                      {[1,2,3,4,5].map(n => (
                        <button key={n} onClick={() => setCurrentLanguage({ ...currentLanguage, level: n })}
                          className={`w-9 h-9 rounded-full text-sm font-bold transition border-2 ${currentLanguage.level >= n ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{['','Beginner','Elementary','Intermediate','Advanced','Native'][currentLanguage.level]}</p>
                  </div>
                </div>
                <button onClick={addLanguage} disabled={!currentLanguage.name.trim()}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition shadow-md text-white ${currentLanguage.name.trim() ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : 'bg-gray-300 cursor-not-allowed'}`}>
                  + Add Language
                </button>
                {languages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {languages.map((lang, i) => (
                      <div key={i} className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-2 rounded-lg">
                        <span className="text-sm font-semibold text-gray-800">{lang.name}</span>
                        <span className="text-xs text-blue-600">{['','Beginner','Elementary','Intermediate','Advanced','Native'][lang.level]}</span>
                        <button onClick={() => deleteLanguage(i)} className="text-red-400 hover:text-red-600 text-xs ml-1">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Hobbies */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center"><span className="mr-2">🎯</span> Hobbies & Interests</h2>
                <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">Optional</span>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Your hobbies (separate with commas)</label>
                <textarea value={hobbies} onChange={e => setHobbies(e.target.value)}
                  placeholder="e.g. Photography, Cricket, Travelling, Reading, Cooking"
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                <p className="text-xs text-gray-500 mt-2">💡 Keep it relevant and professional</p>
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
            {selectedTemplate === 'greensidebar' && <GreenSidebarTemplate />}
            {selectedTemplate === 'goldheader' && <GoldHeaderTemplate />}
            {selectedTemplate === 'classicserif' && <ClassicSerifTemplate />}
            {selectedTemplate === 'coral' && <CoralTemplate />}
            {selectedTemplate === 'amber' && <AmberTemplate />}
            {selectedTemplate === 'serif2' && <Serif2Template />}
            {selectedTemplate === 'hexagon' && <HexagonTemplate />}
            {selectedTemplate === 'navy' && <NavyTemplate />}
            {selectedTemplate === 'bluesidebar' && <BlueSidebarTemplate />}
          </div>
        </div>
      </div>
    </div>
  )
}


// ── TEMPLATE 9: Green Sidebar ─────────────────────────────────────────────────
const GreenSidebarTemplate = () => (
  <div className="p-8 bg-white rounded-xl shadow-xl border border-gray-200">
    <div className="mb-6">
      <button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-green-700 to-green-900 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-green-800 hover:to-green-950 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <span className="mr-2">📥</span> {isDownloading ? 'Generating PDF...' : 'Download PDF'}
      </button>
    </div>
    <div id="resume-preview">
      <h2 className="text-xl font-bold mb-6 text-gray-700 flex items-center"><span className="mr-2">👁️</span> Live Preview - Green Sidebar</h2>
      <div className="flex min-h-full">
        {/* Left sidebar - dark green */}
        <div className="w-64 flex-shrink-0 bg-green-800 text-white p-6 rounded-l-lg">
          <div className="mb-6 text-center">
            {photo
              ? <img src={photo} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-green-400 mx-auto mb-3 shadow-md" />
              : <div className="w-20 h-20 rounded-full bg-green-600 border-4 border-green-400 mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white">{name ? name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : 'YN'}</div>
            }
            <h3 className="text-xl font-bold text-white leading-tight">{name || 'Your Name'}</h3>
          </div>
          <div className="mb-6 border-t border-green-600 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-green-300 mb-3">Contact</h4>
            {email && <p className="text-xs text-green-100 mb-2 break-all">✉ {email}</p>}
            {phone && <p className="text-xs text-green-100 mb-2">📞 {phone}</p>}
            {websiteLinks.linkedin && <p className="text-xs text-green-200 break-all mb-1">💼 <a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.linkedin}</a></p>}
            {websiteLinks.github && <p className="text-xs text-green-200 break-all mb-1">🐙 <a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.github}</a></p>}
            {websiteLinks.portfolio && <p className="text-xs text-green-200 break-all mb-1">🌍 <a href={websiteLinks.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.portfolio}</a></p>}
          </div>
          {skillsList.length > 0 && (<div className="mb-6 border-t border-green-600 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-green-300 mb-3">Skills</h4>
            <div className="space-y-1.5">{skillsList.map((sk,i) => (<div key={i} className="flex items-center justify-between"><span className="text-xs text-green-100">{sk.name}</span><div className="flex gap-0.5">{[1,2,3,4,5].map(n => <span key={n} className={`w-2 h-2 rounded-full ${sk.level>=n?'bg-green-300':'bg-green-700'}`}></span>)}</div></div>))}</div>
          </div>)}
          {languages.length > 0 && (<div className="mb-6 border-t border-green-600 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-green-300 mb-3">Languages</h4>
            <div className="space-y-2">{languages.map((lang,i) => (<div key={i}><p className="text-xs font-semibold text-green-100">{lang.name}</p><div className="flex gap-1 mt-1">{[1,2,3,4,5].map(n => <span key={n} className={`w-2.5 h-2.5 rounded-full ${lang.level>=n?'bg-green-300':'bg-green-700'}`}></span>)}</div></div>))}</div>
          </div>)}
          {hobbies && (<div className="border-t border-green-600 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-green-300 mb-2">Interests</h4>
            <p className="text-xs text-green-200 leading-relaxed">{hobbies}</p>
          </div>)}
        </div>
        {/* Right main content */}
        <div className="flex-1 p-6 bg-white rounded-r-lg">
          {summary && (<div className="mb-6 pb-4 border-b border-gray-200"><p className="text-sm text-gray-600 leading-relaxed italic">{summary}</p></div>)}
          {workExperiences.length > 0 && (<div className="mb-6 pb-4 border-b border-gray-200">
            <h3 className="text-base font-bold text-green-800 mb-4 uppercase tracking-wide border-b-2 border-green-700 pb-1">Work History</h3>
            <div className="space-y-4">{workExperiences.map((exp,i) => (<div key={i} className="flex gap-3">
              <div className="text-xs text-gray-500 w-24 flex-shrink-0 mt-1">{formatDate(exp.startMonth, exp.startYear)}<br/>–<br/>{formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</div>
              <div><p className="font-bold text-gray-900 text-sm">{exp.jobTitle}</p><p className="text-xs text-green-700 italic mb-1">{exp.company}</p>
              {exp.responsibilities && <div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{exp.responsibilities}</div>}
              {exp.achievements && <div className="mt-1 pt-1 border-t border-gray-100"><p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-0.5">Key Achievements</p><div className="text-xs text-gray-700 whitespace-pre-line">{exp.achievements}</div></div>}</div>
            </div>))}</div>
          </div>)}
          {projects.length > 0 && (<div className="mb-6 pb-4 border-b border-gray-200">
            <h3 className="text-base font-bold text-green-800 mb-4 uppercase tracking-wide border-b-2 border-green-700 pb-1">Projects</h3>
            <div className="space-y-3">{projects.map((proj,i) => (<div key={i}><p className="font-bold text-gray-900 text-sm">🚀 {proj.name}</p>{proj.description && <p className="text-xs text-gray-700 mt-1">{proj.description}</p>}{proj.link && <p className="text-xs text-green-600 mt-1"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div>
          </div>)}
          {educationList.length > 0 && (<div className="mb-6 pb-4 border-b border-gray-200">
            <h3 className="text-base font-bold text-green-800 mb-4 uppercase tracking-wide border-b-2 border-green-700 pb-1">Education</h3>
            <div className="space-y-3">{educationList.map((edu,i) => (<div key={i} className="flex gap-3">
              <div className="text-xs text-gray-500 w-24 flex-shrink-0">{formatDate(edu.startMonth, edu.startYear)} – {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</div>
              <div><p className="font-bold text-gray-900 text-sm">{edu.degree}</p><p className="text-xs text-green-700 italic">{edu.school}</p></div>
            </div>))}</div>
          </div>)}
          {certifications.length > 0 && (<div className="mb-6">
            <h3 className="text-base font-bold text-green-800 mb-3 uppercase tracking-wide border-b-2 border-green-700 pb-1">Certifications</h3>
            <div className="space-y-2">{certifications.map((cert,i) => (<div key={i}><p className="text-sm font-semibold text-gray-800">{cert.name}</p>{(cert.issuer||cert.year) && <p className="text-xs text-gray-500">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>}</div>))}</div>
          </div>)}
        </div>
      </div>
    </div>
  </div>
)

// ── TEMPLATE 10: Gold Header ───────────────────────────────────────────────────
const GoldHeaderTemplate = () => (
  <div className="p-8 bg-white rounded-xl shadow-xl border border-gray-200">
    <div className="mb-6">
      <button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-yellow-600 to-amber-700 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-yellow-700 hover:to-amber-800 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <span className="mr-2">📥</span> {isDownloading ? 'Generating PDF...' : 'Download PDF'}
      </button>
    </div>
    <div id="resume-preview">
      <h2 className="text-xl font-bold mb-6 text-gray-700 flex items-center"><span className="mr-2">👁️</span> Live Preview - Gold Header</h2>
      {/* Gold header bar */}
      <div className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white px-6 py-5 rounded-t-lg flex items-center gap-4">
        {photo
          ? <img src={photo} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-white/60 flex-shrink-0 shadow" />
          : <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/60 flex items-center justify-center text-xl font-bold flex-shrink-0">{name ? name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : 'YN'}</div>
        }
        <div>
          <h3 className="text-2xl font-bold text-white leading-tight">{name || 'Your Name'}</h3>
        </div>
      </div>
      {/* Contact bar */}
      <div className="bg-gray-50 border border-gray-200 px-6 py-3 flex flex-wrap gap-4 text-sm text-gray-600 mb-5">
        {email && <span>✉ {email}</span>}
        {phone && <span>📞 {phone}</span>}
        {websiteLinks.linkedin && <span className="text-amber-700">💼 {websiteLinks.linkedin}</span>}
        {websiteLinks.github && <span className="text-amber-700">🐙 {websiteLinks.github}</span>}
        {websiteLinks.portfolio && <span className="text-amber-700">🌍 {websiteLinks.portfolio}</span>}
      </div>
      <div className="px-2">
        {summary && (<div className="mb-5 text-sm text-gray-700 leading-relaxed">{summary}</div>)}
        {workExperiences.length > 0 && (<div className="mb-5">
          <h3 className="text-base font-bold text-amber-700 mb-3 border-b-2 border-amber-400 pb-1 uppercase tracking-wide">Work History</h3>
          <div className="space-y-4">{workExperiences.map((exp,i) => (<div key={i}>
            <div className="flex justify-between items-start"><p className="font-bold text-gray-900">{exp.jobTitle}</p><span className="text-xs text-gray-500 whitespace-nowrap ml-2">{formatDate(exp.startMonth, exp.startYear)} – {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</span></div>
            <p className="text-sm text-amber-700 italic mb-1">{exp.company}</p>
            {exp.responsibilities && <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{exp.responsibilities}</div>}
            {exp.achievements && <div className="mt-2 pt-1 border-t border-amber-100"><p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">Key Achievements</p><div className="text-sm text-gray-700 whitespace-pre-line">{exp.achievements}</div></div>}
          </div>))}</div>
        </div>)}
        {projects.length > 0 && (<div className="mb-5">
          <h3 className="text-base font-bold text-amber-700 mb-3 border-b-2 border-amber-400 pb-1 uppercase tracking-wide">Projects</h3>
          <div className="space-y-3">{projects.map((proj,i) => (<div key={i}><p className="font-bold text-gray-900 text-sm">🚀 {proj.name}</p>{proj.description && <p className="text-sm text-gray-700 mt-1">{proj.description}</p>}{proj.link && <p className="text-xs text-amber-600 mt-1"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div>
        </div>)}
        {skillsList.length > 0 && (<div className="mb-5">
          <h3 className="text-base font-bold text-amber-700 mb-3 border-b-2 border-amber-400 pb-1 uppercase tracking-wide">Skills</h3>
          <div className="grid grid-cols-2 gap-2">{skillsList.map((sk,i) => (<div key={i}><p className="text-sm text-gray-800 font-medium mb-1">{sk.name}</p><div className="h-1.5 bg-gray-200 rounded-full"><div className="h-1.5 bg-amber-500 rounded-full" style={{width:`${sk.level*20}%`}}></div></div></div>))}</div>
        </div>)}
        {certifications.length > 0 && (<div className="mb-5">
          <h3 className="text-base font-bold text-amber-700 mb-3 border-b-2 border-amber-400 pb-1 uppercase tracking-wide">Certifications</h3>
          <div className="space-y-1">{certifications.map((cert,i) => (<p key={i} className="text-sm text-gray-700">• {cert.name}{cert.issuer ? ` – ${cert.issuer}` : ''}{cert.year ? ` (${cert.year})` : ''}</p>))}</div>
        </div>)}
        {educationList.length > 0 && (<div className="mb-5">
          <h3 className="text-base font-bold text-amber-700 mb-3 border-b-2 border-amber-400 pb-1 uppercase tracking-wide">Education</h3>
          <div className="space-y-3">{educationList.map((edu,i) => (<div key={i}><p className="font-bold text-gray-900 text-sm">{edu.degree}</p><p className="text-sm text-amber-700 italic">{edu.school} | {formatDate(edu.startMonth, edu.startYear)} – {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div>
        </div>)}
        {languages.length > 0 && (<div className="mb-5">
          <h3 className="text-base font-bold text-amber-700 mb-3 border-b-2 border-amber-400 pb-1 uppercase tracking-wide">Languages</h3>
          <div className="grid grid-cols-2 gap-2">{languages.map((lang,i) => (<div key={i}><p className="text-sm font-medium text-gray-800">{lang.name}</p><div className="flex gap-1 mt-1">{[1,2,3,4,5].map(n => <span key={n} className={`w-4 h-1.5 rounded-sm ${lang.level>=n?'bg-amber-500':'bg-gray-200'}`}></span>)}</div></div>))}</div>
        </div>)}
        {hobbies && (<div className="mb-5">
          <h3 className="text-base font-bold text-amber-700 mb-3 border-b-2 border-amber-400 pb-1 uppercase tracking-wide">Hobbies & Interests</h3>
          <div className="flex flex-wrap gap-2">{hobbies.split(',').map((h,i) => h.trim() && <span key={i} className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-sm">{h.trim()}</span>)}</div>
        </div>)}
      </div>
    </div>
  </div>
)

// ── TEMPLATE 11: Classic Serif ─────────────────────────────────────────────────
const ClassicSerifTemplate = () => (
  <div className="p-8 bg-white rounded-xl shadow-xl border border-gray-200">
    <div className="mb-6">
      <button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gray-800 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-900 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <span className="mr-2">📥</span> {isDownloading ? 'Generating PDF...' : 'Download PDF'}
      </button>
    </div>
    <div id="resume-preview">
      <h2 className="text-xl font-bold mb-6 text-gray-700 flex items-center"><span className="mr-2">👁️</span> Live Preview - Classic Serif</h2>
      {/* Header with photo placeholder + name */}
      <div className="flex items-center gap-5 mb-4 pb-4 border-b-2 border-gray-800">
        {photo
          ? <img src={photo} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-gray-400 flex-shrink-0" />
          : <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-gray-400 flex items-center justify-center text-xl font-bold text-gray-600 flex-shrink-0">{name ? name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : 'YN'}</div>
        }
        <div>
          <h3 className="text-3xl font-bold text-gray-900 tracking-wide" style={{fontVariant:'small-caps'}}>{name || 'Your Name'}</h3>
          <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
            {email && <span>{email}</span>}
            {phone && <span>• {phone}</span>}
            {websiteLinks.linkedin && <span className="text-blue-700">• {websiteLinks.linkedin}</span>}
            {websiteLinks.github && <span className="text-blue-700">• {websiteLinks.github}</span>}
          </div>
        </div>
      </div>
      {summary && (<div className="mb-4 pb-3 border-b border-gray-300"><p className="text-sm text-gray-700 leading-relaxed">{summary}</p></div>)}
      {workExperiences.length > 0 && (<div className="mb-4 pb-3 border-b border-gray-300">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3" style={{fontVariant:'small-caps', letterSpacing:'0.15em'}}>Work History</h3>
        <div className="space-y-4">{workExperiences.map((exp,i) => (<div key={i}>
          <div className="flex justify-between"><p className="font-bold text-gray-900 text-sm">{exp.jobTitle}</p><p className="text-xs text-gray-500">{formatDate(exp.startMonth, exp.startYear)} – {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p></div>
          <p className="text-sm text-gray-600 italic mb-1">{exp.company}</p>
          {exp.responsibilities && <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{exp.responsibilities}</div>}
          {exp.achievements && <div className="mt-2 pt-1 border-t border-gray-200"><p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Key Achievements</p><div className="text-sm text-gray-700 whitespace-pre-line">{exp.achievements}</div></div>}
        </div>))}</div>
      </div>)}
      {projects.length > 0 && (<div className="mb-4 pb-3 border-b border-gray-300">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3" style={{fontVariant:'small-caps', letterSpacing:'0.15em'}}>Projects</h3>
        <div className="space-y-2">{projects.map((proj,i) => (<div key={i}><p className="font-bold text-gray-900 text-sm">🚀 {proj.name}</p>{proj.description && <p className="text-sm text-gray-700 mt-0.5">{proj.description}</p>}{proj.link && <p className="text-xs text-blue-600 mt-0.5"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div>
      </div>)}
      {skillsList.length > 0 && (<div className="mb-4 pb-3 border-b border-gray-300">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2" style={{fontVariant:'small-caps', letterSpacing:'0.15em'}}>Skills</h3>
        <div className="space-y-1">{skillsList.map((sk,i) => (<div key={i} className="flex items-center justify-between"><div className="flex items-center gap-1 text-sm text-gray-700"><span className="w-1.5 h-1.5 bg-gray-600 rounded-full flex-shrink-0"></span>{sk.name}</div><div className="flex gap-1">{[1,2,3,4,5].map(n => <span key={n} className={`w-2 h-2 rounded-full ${sk.level>=n?'bg-gray-700':'bg-gray-200'}`}></span>)}</div></div>))}</div>
      </div>)}
      {certifications.length > 0 && (<div className="mb-4 pb-3 border-b border-gray-300">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2" style={{fontVariant:'small-caps', letterSpacing:'0.15em'}}>Certifications</h3>
        <div className="space-y-1">{certifications.map((cert,i) => (<p key={i} className="text-sm text-gray-700">• {cert.name}{cert.issuer ? ` – ${cert.issuer}` : ''}{cert.year ? ` (${cert.year})` : ''}</p>))}</div>
      </div>)}
      {educationList.length > 0 && (<div className="mb-4 pb-3 border-b border-gray-300">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2" style={{fontVariant:'small-caps', letterSpacing:'0.15em'}}>Education</h3>
        <div className="space-y-2">{educationList.map((edu,i) => (<div key={i}><p className="font-bold text-gray-900 text-sm">{edu.degree}</p><p className="text-sm text-gray-600">{edu.school} · {formatDate(edu.startMonth, edu.startYear)} – {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div>
      </div>)}
      {languages.length > 0 && (<div className="mb-4 pb-3 border-b border-gray-300">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2" style={{fontVariant:'small-caps', letterSpacing:'0.15em'}}>Languages</h3>
        <div className="flex flex-wrap gap-4">{languages.map((lang,i) => (<div key={i} className="flex items-center gap-2"><span className="text-sm text-gray-800">{lang.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n => <span key={n} className={`w-2.5 h-2.5 rounded-full border ${lang.level>=n?'bg-gray-700 border-gray-700':'border-gray-300'}`}></span>)}</div></div>))}</div>
      </div>)}
      {hobbies && (<div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2" style={{fontVariant:'small-caps', letterSpacing:'0.15em'}}>Interests</h3>
        <p className="text-sm text-gray-700">{hobbies}</p>
      </div>)}
    </div>
  </div>
)

// ── TEMPLATE 12: Coral Modern ─────────────────────────────────────────────────
const CoralTemplate = () => (
  <div className="p-8 bg-white rounded-xl shadow-xl border border-gray-200">
    <div className="mb-6">
      <button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-rose-600 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <span className="mr-2">📥</span> {isDownloading ? 'Generating PDF...' : 'Download PDF'}
      </button>
    </div>
    <div id="resume-preview">
      <h2 className="text-xl font-bold mb-6 text-gray-700 flex items-center"><span className="mr-2">👁️</span> Live Preview - Coral</h2>
      {/* Header */}
      <div className="flex items-center gap-4 mb-5 pb-5 border-b-2 border-orange-200">
        {photo
          ? <img src={photo} alt="Profile" className="w-14 h-14 rounded-lg object-cover flex-shrink-0 shadow-md border-2 border-orange-200" />
          : <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">{name ? name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : 'YN'}</div>
        }
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{name || 'Your Name'}</h3>
          <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
            {email && <span>✉ {email}</span>}
            {phone && <span>📞 {phone}</span>}
            {websiteLinks.linkedin && <span className="text-orange-600">💼 {websiteLinks.linkedin}</span>}
            {websiteLinks.github && <span className="text-orange-600">🐙 {websiteLinks.github}</span>}
            {websiteLinks.portfolio && <span className="text-orange-600">🌍 {websiteLinks.portfolio}</span>}
          </div>
        </div>
      </div>
      {summary && (<div className="mb-5 text-sm text-gray-600 leading-relaxed">{summary}</div>)}
      {workExperiences.length > 0 && (<div className="mb-5">
        <h3 className="text-base font-bold text-orange-600 mb-3 flex items-center gap-2"><span className="w-6 h-0.5 bg-orange-400 inline-block"></span>Work History<span className="flex-1 h-0.5 bg-orange-100 inline-block ml-2"></span></h3>
        <div className="space-y-4">{workExperiences.map((exp,i) => (<div key={i} className="pl-3 border-l-2 border-orange-200">
          <div className="flex justify-between items-start"><p className="font-bold text-gray-900 text-sm">{exp.jobTitle}</p><span className="text-xs text-gray-400 whitespace-nowrap ml-2">{formatDate(exp.startMonth, exp.startYear)} – {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</span></div>
          <p className="text-xs text-orange-600 italic mb-1">{exp.company}</p>
          {exp.responsibilities && <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{exp.responsibilities}</div>}
          {exp.achievements && <div className="mt-2 pt-1 border-t border-orange-100"><p className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-1">Key Achievements</p><div className="text-sm text-gray-700 whitespace-pre-line">{exp.achievements}</div></div>}
        </div>))}</div>
      </div>)}
      {projects.length > 0 && (<div className="mb-5">
        <h3 className="text-base font-bold text-orange-600 mb-3 flex items-center gap-2"><span className="w-6 h-0.5 bg-orange-400 inline-block"></span>Projects</h3>
        <div className="space-y-2">{projects.map((proj,i) => (<div key={i} className="pl-3 border-l-2 border-orange-200"><p className="font-bold text-gray-900 text-sm">🚀 {proj.name}</p>{proj.description && <p className="text-sm text-gray-700 mt-0.5">{proj.description}</p>}{proj.link && <p className="text-xs text-orange-500 mt-0.5"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div>
      </div>)}
      {skillsList.length > 0 && (<div className="mb-5">
        <h3 className="text-base font-bold text-orange-600 mb-3 flex items-center gap-2"><span className="w-6 h-0.5 bg-orange-400 inline-block"></span>Skills</h3>
        <div className="space-y-2">{skillsList.map((sk,i) => (<div key={i} className="flex items-center justify-between pl-3 border-l-2 border-orange-200"><span className="text-sm font-medium text-gray-800">{sk.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n => <span key={n} className={`w-3 h-3 rounded-full ${sk.level>=n?'bg-orange-400':'bg-gray-200'}`}></span>)}</div></div>))}</div>
      </div>)}
      {certifications.length > 0 && (<div className="mb-5">
        <h3 className="text-base font-bold text-orange-600 mb-3 flex items-center gap-2"><span className="w-6 h-0.5 bg-orange-400 inline-block"></span>Certifications</h3>
        <div className="space-y-1">{certifications.map((cert,i) => (<p key={i} className="text-sm text-gray-700 pl-3 border-l-2 border-orange-100">• {cert.name}{cert.issuer ? ` – ${cert.issuer}` : ''}{cert.year ? ` (${cert.year})` : ''}</p>))}</div>
      </div>)}
      {educationList.length > 0 && (<div className="mb-5">
        <h3 className="text-base font-bold text-orange-600 mb-3 flex items-center gap-2"><span className="w-6 h-0.5 bg-orange-400 inline-block"></span>Education</h3>
        <div className="space-y-2">{educationList.map((edu,i) => (<div key={i} className="pl-3 border-l-2 border-orange-200"><p className="font-bold text-gray-900 text-sm">{edu.degree}</p><p className="text-sm text-orange-600 italic">{edu.school} · {formatDate(edu.startMonth, edu.startYear)} – {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div>
      </div>)}
      {languages.length > 0 && (<div className="mb-5">
        <h3 className="text-base font-bold text-orange-600 mb-3 flex items-center gap-2"><span className="w-6 h-0.5 bg-orange-400 inline-block"></span>Languages</h3>
        <div className="flex flex-wrap gap-4">{languages.map((lang,i) => (<div key={i} className="flex items-center gap-2"><span className="text-sm font-medium text-gray-800">{lang.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n => <span key={n} className={`w-3 h-3 rounded-full ${lang.level>=n?'bg-orange-400':'bg-gray-200'}`}></span>)}</div></div>))}</div>
      </div>)}
      {hobbies && (<div className="mb-5">
        <h3 className="text-base font-bold text-orange-600 mb-3 flex items-center gap-2"><span className="w-6 h-0.5 bg-orange-400 inline-block"></span>Hobbies & Interests</h3>
        <div className="flex flex-wrap gap-2">{hobbies.split(',').map((h,i) => h.trim() && <span key={i} className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-sm border border-rose-200">{h.trim()}</span>)}</div>
      </div>)}
    </div>
  </div>
)

// ─── TEMPLATE 13: AMBER ──────────────────────────────────────────────────────
const AmberTemplate = () => (
  <div className="bg-white shadow-2xl overflow-hidden font-sans">
    <div className="p-6 pb-4"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-amber-700 hover:to-yellow-700 transition shadow-lg flex items-center justify-center ${isDownloading?'opacity-50 cursor-not-allowed':''}`}><span className="mr-2">📥</span>{isDownloading?'Generating PDF...':'Download PDF'}</button></div>
    <div id="resume-preview" className="bg-white">
      <div className="bg-amber-600 px-8 py-6 flex items-center gap-6">
        {photo?<img src={photo} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-amber-300 shadow-lg flex-shrink-0"/>:<div className="w-24 h-24 rounded-full bg-amber-500 border-4 border-amber-300 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">{name?name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase():'YN'}</div>}
        <div><h1 className="text-4xl font-bold text-white tracking-tight">{name||'Your Name'}</h1>{workExperiences.length>0&&<p className="text-amber-200 text-base mt-1 font-medium">{workExperiences[0].jobTitle}</p>}</div>
      </div>
      <div className="bg-gray-50 border-b border-gray-200 px-8 py-3 flex flex-wrap gap-4 text-sm text-gray-700">
        <span className="font-bold text-amber-700 border-r border-gray-300 pr-4">Contact</span>
        {email&&<span>{email}</span>}{phone&&<span>{phone}</span>}
        {websiteLinks.linkedin&&<a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">{websiteLinks.linkedin}</a>}
        {websiteLinks.github&&<a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">{websiteLinks.github}</a>}
        {websiteLinks.portfolio&&<a href={websiteLinks.portfolio} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">{websiteLinks.portfolio}</a>}
      </div>
      <div className="px-8 py-6">
        {summary&&<p className="text-gray-700 text-sm leading-relaxed mb-6 border-l-4 border-amber-400 pl-4 italic">{summary}</p>}
        {workExperiences.length>0&&(<div className="mb-6"><h2 className="text-base font-bold text-amber-600 mb-3 border-b border-amber-200 pb-1 uppercase tracking-wide">Work History</h2><div className="space-y-4">{workExperiences.map((exp,i)=>(<div key={i} className="flex gap-5"><div className="w-28 flex-shrink-0 text-xs text-gray-500 pt-0.5 leading-relaxed">{formatDate(exp.startMonth,exp.startYear)} -<br/>{formatDate(exp.endMonth,exp.endYear,exp.isPresent)}</div><div className="flex-1"><p className="font-bold text-gray-900 text-sm">{exp.jobTitle}</p><p className="text-amber-700 text-xs italic mb-1">{exp.company}</p>{exp.responsibilities&&<div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{exp.responsibilities}</div>}{exp.achievements&&<div className="mt-1 pt-1 border-t border-amber-100"><p className="text-xs font-bold text-amber-700 uppercase mb-0.5">Key Achievements</p><div className="text-xs text-gray-700 whitespace-pre-line">{exp.achievements}</div></div>}</div></div>))}</div></div>)}
        {educationList.length>0&&(<div className="mb-6"><h2 className="text-base font-bold text-amber-600 mb-3 border-b border-amber-200 pb-1 uppercase tracking-wide">Education</h2><div className="space-y-3">{educationList.map((edu,i)=>(<div key={i} className="flex gap-5"><div className="w-28 flex-shrink-0 text-xs text-gray-500 leading-relaxed">{formatDate(edu.startMonth,edu.startYear)} -<br/>{formatDate(edu.endMonth,edu.endYear,edu.isPresent)}</div><div><p className="font-bold text-gray-900 text-sm">{edu.degree}</p><p className="text-amber-700 text-xs italic">{edu.school}</p>{edu.score&&<p className="text-xs text-gray-500 mt-0.5">{edu.score}</p>}</div></div>))}</div></div>)}
        {projects.length>0&&(<div className="mb-6"><h2 className="text-base font-bold text-amber-600 mb-3 border-b border-amber-200 pb-1 uppercase tracking-wide">Projects</h2><div className="space-y-2">{projects.map((proj,i)=>(<div key={i}><p className="font-bold text-gray-900 text-sm">{proj.name}</p>{proj.description&&<p className="text-xs text-gray-700 mt-0.5">{proj.description}</p>}{proj.link&&<p className="text-xs mt-0.5"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">{proj.link}</a></p>}</div>))}</div></div>)}
        {skillsList.length>0&&(<div className="mb-6"><h2 className="text-base font-bold text-amber-600 mb-3 border-b border-amber-200 pb-1 uppercase tracking-wide">Skills</h2><div className="grid grid-cols-3 gap-x-6 gap-y-3">{skillsList.map((sk,i)=>(<div key={i}><p className="text-xs font-medium text-gray-800 mb-1">{sk.name}</p><div className="h-1.5 bg-gray-200 rounded-full"><div className="h-1.5 bg-amber-500 rounded-full" style={{width:`${sk.level*20}%`}}></div></div></div>))}</div></div>)}
        {certifications.length>0&&(<div className="mb-6"><h2 className="text-base font-bold text-amber-600 mb-3 border-b border-amber-200 pb-1 uppercase tracking-wide">Certifications</h2><ul className="space-y-1">{certifications.map((cert,i)=>(<li key={i} className="flex gap-2 text-xs text-gray-700"><span className="text-amber-500">·</span><span><span className="font-semibold">{cert.name}</span>{cert.issuer&&` — ${cert.issuer}`}{cert.year&&` (${cert.year})`}</span></li>))}</ul></div>)}
        {languages.length>0&&(<div className="mb-6"><h2 className="text-base font-bold text-amber-600 mb-3 border-b border-amber-200 pb-1 uppercase tracking-wide">Languages</h2><div className="grid grid-cols-3 gap-x-6 gap-y-3">{languages.map((lang,i)=>(<div key={i}><p className="text-xs font-medium text-gray-800 mb-1">{lang.name}</p><div className="h-1.5 bg-gray-200 rounded-full"><div className="h-1.5 bg-amber-400 rounded-full" style={{width:`${lang.level*20}%`}}></div></div></div>))}</div></div>)}
        {hobbies&&(<div><h2 className="text-base font-bold text-amber-600 mb-2 border-b border-amber-200 pb-1 uppercase tracking-wide">Hobbies</h2><p className="text-xs text-gray-700">{hobbies}</p></div>)}
      </div>
    </div>
  </div>
)

// ─── TEMPLATE 14: SERIF2 ─────────────────────────────────────────────────────
const Serif2Template = () => (
  <div className="bg-white shadow-2xl overflow-hidden">
    <div className="p-6 pb-4"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gray-800 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-900 transition shadow-lg flex items-center justify-center ${isDownloading?'opacity-50 cursor-not-allowed':''}`}><span className="mr-2">📥</span>{isDownloading?'Generating PDF...':'Download PDF'}</button></div>
    <div id="resume-preview" className="bg-white px-10 py-8">
      <div className="border-t-2 border-b-2 border-gray-800 py-4 mb-6 flex items-center gap-6">
        {photo?<img src={photo} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 flex-shrink-0"/>:<div className="w-20 h-20 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center text-xl font-bold text-gray-600 flex-shrink-0">{name?name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase():'YN'}</div>}
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-widest uppercase" style={{fontVariant:'small-caps'}}>{name||'Your Name'}</h1>
          <p className="text-sm text-gray-500 mt-2">{[email,phone].filter(Boolean).join(' • ')}</p>
          <div className="flex justify-center gap-4 mt-1 text-xs">{websiteLinks.linkedin&&<a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline">{websiteLinks.linkedin}</a>}{websiteLinks.github&&<a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline">{websiteLinks.github}</a>}</div>
        </div>
      </div>
      {summary&&(<div className="mb-6"><h2 className="text-sm font-bold text-gray-700 text-center tracking-widest uppercase mb-3 flex items-center gap-2"><span className="flex-1 h-px bg-gray-300"></span>Professional Summary<span className="flex-1 h-px bg-gray-300"></span></h2><p className="text-sm text-gray-700 leading-relaxed">{summary}</p></div>)}
      {workExperiences.length>0&&(<div className="mb-6"><h2 className="text-sm font-bold text-gray-700 text-center tracking-widest uppercase mb-4 flex items-center gap-2"><span className="flex-1 h-px bg-gray-300"></span>Work History<span className="flex-1 h-px bg-gray-300"></span></h2><div className="space-y-4">{workExperiences.map((exp,i)=>(<div key={i}><div className="flex justify-between items-baseline mb-0.5"><p className="font-bold text-gray-900 text-sm">{exp.jobTitle}, <span className="text-xs font-normal text-gray-500">{formatDate(exp.startMonth,exp.startYear)} - {formatDate(exp.endMonth,exp.endYear,exp.isPresent)}</span></p></div><p className="font-bold text-gray-700 text-xs mb-1">{exp.company}</p>{exp.responsibilities&&<div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed pl-2">{exp.responsibilities}</div>}{exp.achievements&&<div className="mt-1 pl-2"><p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-0.5">Key Achievements</p><div className="text-xs text-gray-700 whitespace-pre-line">{exp.achievements}</div></div>}</div>))}</div></div>)}
      {skillsList.length>0&&(<div className="mb-6"><h2 className="text-sm font-bold text-gray-700 text-center tracking-widest uppercase mb-4 flex items-center gap-2"><span className="flex-1 h-px bg-gray-300"></span>Skills<span className="flex-1 h-px bg-gray-300"></span></h2><div className="grid grid-cols-3 gap-x-6 gap-y-3">{skillsList.map((sk,i)=>(<div key={i}><p className="text-xs font-medium text-gray-800 mb-1">{sk.name}</p><div className="flex gap-0.5">{[1,2,3,4,5].map(n=><div key={n} className={`h-2 flex-1 rounded-sm ${sk.level>=n?'bg-gray-600':'bg-gray-200'}`}></div>)}</div></div>))}</div></div>)}
      {certifications.length>0&&(<div className="mb-6"><h2 className="text-sm font-bold text-gray-700 text-center tracking-widest uppercase mb-3 flex items-center gap-2"><span className="flex-1 h-px bg-gray-300"></span>Certifications<span className="flex-1 h-px bg-gray-300"></span></h2><ul className="space-y-1">{certifications.map((cert,i)=>(<li key={i} className="flex gap-2 text-xs text-gray-700"><span>•</span><span><span className="font-semibold">{cert.name}</span>{cert.issuer&&` — ${cert.issuer}`}{cert.year&&` (${cert.year})`}</span></li>))}</ul></div>)}
      {educationList.length>0&&(<div className="mb-6"><h2 className="text-sm font-bold text-gray-700 text-center tracking-widest uppercase mb-4 flex items-center gap-2"><span className="flex-1 h-px bg-gray-300"></span>Education<span className="flex-1 h-px bg-gray-300"></span></h2><div className="space-y-3">{educationList.map((edu,i)=>(<div key={i}><div className="flex justify-between"><p className="font-bold text-gray-900 text-sm">{edu.degree}</p><p className="text-xs text-gray-500">{formatDate(edu.endMonth,edu.endYear,edu.isPresent)}</p></div><p className="font-bold text-gray-700 text-xs">{edu.school}</p>{edu.score&&<p className="text-xs text-gray-500">{edu.score}</p>}</div>))}</div></div>)}
      {projects.length>0&&(<div className="mb-6"><h2 className="text-sm font-bold text-gray-700 text-center tracking-widest uppercase mb-3 flex items-center gap-2"><span className="flex-1 h-px bg-gray-300"></span>Projects<span className="flex-1 h-px bg-gray-300"></span></h2><div className="space-y-2">{projects.map((proj,i)=>(<div key={i}><p className="font-bold text-gray-900 text-sm">{proj.name}</p>{proj.description&&<p className="text-xs text-gray-700">{proj.description}</p>}{proj.link&&<a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:underline">{proj.link}</a>}</div>))}</div></div>)}
      {languages.length>0&&(<div className="mb-6"><h2 className="text-sm font-bold text-gray-700 text-center tracking-widest uppercase mb-4 flex items-center gap-2"><span className="flex-1 h-px bg-gray-300"></span>Languages<span className="flex-1 h-px bg-gray-300"></span></h2><div className="grid grid-cols-3 gap-x-6 gap-y-3">{languages.map((lang,i)=>(<div key={i}><p className="text-xs font-medium text-gray-800 mb-1">{lang.name}</p><div className="flex gap-0.5">{[1,2,3,4,5].map(n=><div key={n} className={`h-2 flex-1 rounded-sm ${lang.level>=n?'bg-gray-500':'bg-gray-200'}`}></div>)}</div><p className="text-xs text-gray-400 mt-0.5">{['','Beginner','Elementary','Intermediate','Advanced','Expert'][lang.level]}</p></div>))}</div></div>)}
      {hobbies&&(<div><h2 className="text-sm font-bold text-gray-700 text-center tracking-widest uppercase mb-2 flex items-center gap-2"><span className="flex-1 h-px bg-gray-300"></span>Hobbies<span className="flex-1 h-px bg-gray-300"></span></h2><p className="text-xs text-gray-700 text-center">{hobbies}</p></div>)}
    </div>
  </div>
)

// ─── TEMPLATE 15: HEXAGON ────────────────────────────────────────────────────
const HexagonTemplate = () => (
  <div className="bg-white shadow-2xl overflow-hidden">
    <div className="p-6 pb-4"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-rose-600 hover:to-pink-600 transition shadow-lg flex items-center justify-center ${isDownloading?'opacity-50 cursor-not-allowed':''}`}><span className="mr-2">📥</span>{isDownloading?'Generating PDF...':'Download PDF'}</button></div>
    <div id="resume-preview" className="bg-white px-10 py-8">
      <div className="flex items-center gap-6 mb-5">
        <div className="w-16 h-16 bg-rose-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)'}}>{name?name.split(' ').filter(Boolean).slice(0,2).map(n=>n[0]).join('').toUpperCase():'YN'}</div>
        <div><h1 className="text-3xl font-bold text-rose-500">{name||'Your Name'}</h1><div className="flex flex-wrap gap-4 mt-1 text-xs text-gray-500">{email&&<span>{email}</span>}{phone&&<span>{phone}</span>}{websiteLinks.linkedin&&<a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">{websiteLinks.linkedin}</a>}{websiteLinks.github&&<a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">{websiteLinks.github}</a>}</div></div>
      </div>
      {summary&&<p className="text-sm text-gray-700 leading-relaxed mb-6">{summary}</p>}
      {workExperiences.length>0&&(<div className="mb-6"><h2 className="text-base font-bold text-rose-500 mb-3 border-b border-rose-200 pb-1">Work History</h2><div className="space-y-4">{workExperiences.map((exp,i)=>(<div key={i} className="flex gap-5"><div className="w-24 flex-shrink-0 text-xs text-gray-500 leading-relaxed">{formatDate(exp.startMonth,exp.startYear)} -<br/>{formatDate(exp.endMonth,exp.endYear,exp.isPresent)}</div><div className="flex-1"><p className="font-bold text-gray-900 text-sm">{exp.jobTitle}</p><p className="text-rose-400 text-xs italic mb-1">{exp.company}</p>{exp.responsibilities&&<div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{exp.responsibilities}</div>}{exp.achievements&&<div className="mt-1 pt-1 border-t border-rose-100"><p className="text-xs font-bold text-rose-500 uppercase mb-0.5">Key Achievements</p><div className="text-xs text-gray-700 whitespace-pre-line">{exp.achievements}</div></div>}</div></div>))}</div></div>)}
      {skillsList.length>0&&(<div className="mb-6"><h2 className="text-base font-bold text-rose-500 mb-3 border-b border-rose-200 pb-1">Skills</h2><div className="grid grid-cols-3 gap-x-6 gap-y-3">{skillsList.map((sk,i)=>(<div key={i}><p className="text-xs font-medium text-gray-800 mb-1">{sk.name}</p><div className="flex gap-1">{[1,2,3,4,5].map(n=><span key={n} className={`w-3 h-3 rounded-full ${sk.level>=n?'bg-rose-400':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
      {certifications.length>0&&(<div className="mb-6"><h2 className="text-base font-bold text-rose-500 mb-3 border-b border-rose-200 pb-1">Certifications</h2><ul className="space-y-1">{certifications.map((cert,i)=>(<li key={i} className="flex gap-2 text-xs text-gray-700"><span className="text-rose-400">•</span><span><span className="font-semibold">{cert.name}</span>{cert.issuer&&` — ${cert.issuer}`}{cert.year&&` (${cert.year})`}</span></li>))}</ul></div>)}
      {educationList.length>0&&(<div className="mb-6"><h2 className="text-base font-bold text-rose-500 mb-3 border-b border-rose-200 pb-1">Education</h2><div className="space-y-3">{educationList.map((edu,i)=>(<div key={i} className="flex gap-5"><div className="w-24 flex-shrink-0 text-xs text-gray-500">{formatDate(edu.endMonth,edu.endYear,edu.isPresent)}</div><div><p className="font-bold text-gray-900 text-sm">{edu.degree}</p><p className="text-rose-400 text-xs italic">{edu.school}</p>{edu.score&&<p className="text-xs text-gray-500">{edu.score}</p>}</div></div>))}</div></div>)}
      {projects.length>0&&(<div className="mb-6"><h2 className="text-base font-bold text-rose-500 mb-3 border-b border-rose-200 pb-1">Projects</h2><div className="space-y-2">{projects.map((proj,i)=>(<div key={i}><p className="font-bold text-gray-900 text-sm">{proj.name}</p>{proj.description&&<p className="text-xs text-gray-700">{proj.description}</p>}{proj.link&&<a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-rose-500 hover:underline">{proj.link}</a>}</div>))}</div></div>)}
      {languages.length>0&&(<div className="mb-6"><h2 className="text-base font-bold text-rose-500 mb-3 border-b border-rose-200 pb-1">Languages</h2><div className="grid grid-cols-3 gap-x-6 gap-y-3">{languages.map((lang,i)=>(<div key={i}><p className="text-xs font-medium text-gray-800 mb-1">{lang.name}</p><div className="flex gap-1">{[1,2,3,4,5].map(n=><span key={n} className={`w-3 h-3 rounded-full ${lang.level>=n?'bg-rose-400':'bg-gray-200'}`}></span>)}</div><p className="text-xs text-gray-400 mt-0.5">{['','Beginner','Elementary','Intermediate','Advanced','Expert'][lang.level]}</p></div>))}</div></div>)}
      {hobbies&&(<div><h2 className="text-base font-bold text-rose-500 mb-2 border-b border-rose-200 pb-1">Hobbies & Interests</h2><div className="flex flex-wrap gap-2">{hobbies.split(',').map((h,i)=>h.trim()&&<span key={i} className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs border border-rose-200">{h.trim()}</span>)}</div></div>)}
    </div>
  </div>
)

// ─── TEMPLATE 16: NAVY ───────────────────────────────────────────────────────
const NavyTemplate = () => (
  <div className="bg-white shadow-2xl overflow-hidden">
    <div className="p-6 pb-4"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-blue-950 hover:to-indigo-950 transition shadow-lg flex items-center justify-center ${isDownloading?'opacity-50 cursor-not-allowed':''}`}><span className="mr-2">📥</span>{isDownloading?'Generating PDF...':'Download PDF'}</button></div>
    <div id="resume-preview" className="bg-white px-8 py-8">
      <div className="flex items-start gap-6 mb-6">
        {photo?<img src={photo} alt="Profile" className="w-24 h-24 object-cover flex-shrink-0 border-2 border-blue-900"/>:<div className="w-24 h-24 bg-blue-100 border-2 border-blue-900 flex items-center justify-center text-2xl font-bold text-blue-900 flex-shrink-0">{name?name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase():'YN'}</div>}
        <div className="flex-1"><h1 className="text-3xl font-bold text-blue-900 mb-2">{name||'Your Name'}</h1><div className="grid grid-cols-2 gap-1 text-xs text-gray-600">{email&&<span>✉ {email}</span>}{phone&&<span>📞 {phone}</span>}{websiteLinks.linkedin&&<a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">💼 {websiteLinks.linkedin}</a>}{websiteLinks.github&&<a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">🐙 {websiteLinks.github}</a>}</div></div>
      </div>
      {summary&&<p className="text-sm text-gray-700 leading-relaxed mb-6 border-l-4 border-blue-900 pl-3">{summary}</p>}
      {educationList.length>0&&(<div className="mb-6"><h2 className="flex items-center gap-2 text-sm font-bold text-white bg-blue-900 px-3 py-1.5 mb-3 rounded">🎓 Education</h2><div className="space-y-3">{educationList.map((edu,i)=>(<div key={i} className="flex gap-5"><div className="w-20 flex-shrink-0 text-xs text-gray-500">{formatDate(edu.endMonth,edu.endYear,edu.isPresent)}</div><div><p className="font-bold text-gray-900 text-sm">{edu.degree}</p><p className="text-blue-800 text-xs italic">{edu.school}</p>{edu.score&&<p className="text-xs text-gray-500">{edu.score}</p>}</div></div>))}</div></div>)}
      {skillsList.length>0&&(<div className="mb-6"><h2 className="flex items-center gap-2 text-sm font-bold text-white bg-blue-900 px-3 py-1.5 mb-3 rounded">🔧 Skills</h2><div className="grid grid-cols-3 gap-x-6 gap-y-3">{skillsList.map((sk,i)=>(<div key={i}><p className="text-xs font-medium text-gray-800 mb-1">{sk.name}</p><div className="flex gap-0.5">{[1,2,3,4,5].map(n=><div key={n} className={`h-2.5 w-5 ${sk.level>=n?'bg-blue-900':'bg-gray-200'}`}></div>)}</div></div>))}</div></div>)}
      {workExperiences.length>0&&(<div className="mb-6"><h2 className="flex items-center gap-2 text-sm font-bold text-white bg-blue-900 px-3 py-1.5 mb-3 rounded">💼 Work History</h2><div className="space-y-4">{workExperiences.map((exp,i)=>(<div key={i} className="flex gap-5"><div className="w-20 flex-shrink-0 text-xs text-gray-500 leading-relaxed">{formatDate(exp.startMonth,exp.startYear)} -<br/>{formatDate(exp.endMonth,exp.endYear,exp.isPresent)}</div><div className="flex-1"><p className="font-bold text-gray-900 text-sm">{exp.jobTitle}</p><p className="text-blue-800 text-xs italic mb-1">{exp.company}</p>{exp.responsibilities&&<div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{exp.responsibilities}</div>}{exp.achievements&&<div className="mt-1 pt-1 border-t border-blue-100"><p className="text-xs font-bold text-blue-800 uppercase mb-0.5">Key Achievements</p><div className="text-xs text-gray-700 whitespace-pre-line">{exp.achievements}</div></div>}</div></div>))}</div></div>)}
      {projects.length>0&&(<div className="mb-6"><h2 className="flex items-center gap-2 text-sm font-bold text-white bg-blue-900 px-3 py-1.5 mb-3 rounded">🚀 Projects</h2><div className="space-y-2">{projects.map((proj,i)=>(<div key={i}><p className="font-bold text-gray-900 text-sm">{proj.name}</p>{proj.description&&<p className="text-xs text-gray-700">{proj.description}</p>}{proj.link&&<a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 hover:underline">{proj.link}</a>}</div>))}</div></div>)}
      {certifications.length>0&&(<div className="mb-6"><h2 className="flex items-center gap-2 text-sm font-bold text-white bg-blue-900 px-3 py-1.5 mb-3 rounded">🏆 Certifications</h2><ul className="space-y-1">{certifications.map((cert,i)=>(<li key={i} className="flex gap-2 text-xs text-gray-700"><span className="text-blue-800">•</span><span><span className="font-semibold">{cert.name}</span>{cert.issuer&&` — ${cert.issuer}`}{cert.year&&` (${cert.year})`}</span></li>))}</ul></div>)}
      {languages.length>0&&(<div className="mb-6"><h2 className="flex items-center gap-2 text-sm font-bold text-white bg-blue-900 px-3 py-1.5 mb-3 rounded">🌐 Languages</h2><div className="grid grid-cols-3 gap-x-6 gap-y-3">{languages.map((lang,i)=>(<div key={i}><p className="text-xs font-medium text-gray-800 mb-1">{lang.name}</p><div className="flex gap-0.5">{[1,2,3,4,5].map(n=><div key={n} className={`h-2.5 w-5 ${lang.level>=n?'bg-blue-900':'bg-gray-200'}`}></div>)}</div></div>))}</div></div>)}
      {hobbies&&(<div><h2 className="flex items-center gap-2 text-sm font-bold text-white bg-blue-900 px-3 py-1.5 mb-3 rounded">⭐ Hobbies</h2><p className="text-xs text-gray-700">{hobbies}</p></div>)}
    </div>
  </div>
)

// ─── TEMPLATE 17: BLUE SIDEBAR ───────────────────────────────────────────────
const BlueSidebarTemplate = () => (
  <div className="bg-white shadow-2xl overflow-hidden">
    <div className="p-6 pb-4"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-cyan-600 transition shadow-lg flex items-center justify-center ${isDownloading?'opacity-50 cursor-not-allowed':''}`}><span className="mr-2">📥</span>{isDownloading?'Generating PDF...':'Download PDF'}</button></div>
    <div id="resume-preview" className="flex">
      <div className="w-48 bg-blue-500 text-white p-5 flex-shrink-0">
        {photo?<img src={photo} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white mx-auto mb-4 shadow-lg"/>:<div className="w-24 h-24 rounded-full bg-blue-400 border-4 border-white mx-auto mb-4 flex items-center justify-center text-2xl font-bold">{name?name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase():'YN'}</div>}
        <h1 className="text-lg font-bold text-white text-center mb-5 leading-tight">{name||'Your Name'}</h1>
        <div className="mb-5"><h3 className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2 border-b border-blue-400 pb-1">Contact</h3><div className="space-y-1.5 text-xs">{email&&<p className="break-all text-blue-100">{email}</p>}{phone&&<p className="text-blue-100">{phone}</p>}{websiteLinks.linkedin&&<a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:underline break-all block">{websiteLinks.linkedin}</a>}{websiteLinks.github&&<a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:underline break-all block">{websiteLinks.github}</a>}</div></div>
        {skillsList.length>0&&(<div className="mb-5"><h3 className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2 border-b border-blue-400 pb-1">Skills</h3><div className="space-y-2">{skillsList.map((sk,i)=>(<div key={i}><span className="text-xs text-white font-medium">{sk.name}</span><div className="h-1.5 bg-blue-400 rounded-full mt-0.5"><div className="h-1.5 bg-white rounded-full" style={{width:`${sk.level*20}%`}}></div></div></div>))}</div></div>)}
        {languages.length>0&&(<div className="mb-5"><h3 className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2 border-b border-blue-400 pb-1">Languages</h3><div className="space-y-2">{languages.map((lang,i)=>(<div key={i}><span className="text-xs text-white font-medium">{lang.name}</span><div className="flex gap-0.5 mt-0.5">{[1,2,3,4,5].map(n=><span key={n} className={`w-2.5 h-2.5 rounded-full ${lang.level>=n?'bg-white':'bg-blue-400'}`}></span>)}</div></div>))}</div></div>)}
        {hobbies&&(<div><h3 className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2 border-b border-blue-400 pb-1">Interests</h3><div className="flex flex-wrap gap-1">{hobbies.split(',').map((h,i)=>h.trim()&&<span key={i} className="text-xs bg-blue-400 text-white px-2 py-0.5 rounded-full">{h.trim()}</span>)}</div></div>)}
      </div>
      <div className="flex-1 p-6">
        {summary&&<p className="text-sm text-gray-700 leading-relaxed mb-5">{summary}</p>}
        {workExperiences.length>0&&(<div className="mb-5"><h2 className="text-base font-bold text-blue-500 mb-3 border-b-2 border-blue-200 pb-1 uppercase tracking-wide">Work History</h2><div className="space-y-4">{workExperiences.map((exp,i)=>(<div key={i} className="flex gap-4"><div className="w-20 flex-shrink-0 text-xs text-gray-500 leading-relaxed">{formatDate(exp.startMonth,exp.startYear)} -<br/>{formatDate(exp.endMonth,exp.endYear,exp.isPresent)}</div><div className="flex-1"><p className="font-bold text-gray-900 text-sm">{exp.jobTitle}</p><p className="text-blue-500 text-xs italic mb-1">{exp.company}</p>{exp.responsibilities&&<div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed">{exp.responsibilities}</div>}{exp.achievements&&<div className="mt-1 pt-1 border-t border-blue-100"><p className="text-xs font-bold text-blue-600 uppercase mb-0.5">Key Achievements</p><div className="text-xs text-gray-700 whitespace-pre-line">{exp.achievements}</div></div>}</div></div>))}</div></div>)}
        {certifications.length>0&&(<div className="mb-5"><h2 className="text-base font-bold text-blue-500 mb-3 border-b-2 border-blue-200 pb-1 uppercase tracking-wide">Certifications</h2><ul className="space-y-1">{certifications.map((cert,i)=>(<li key={i} className="flex gap-2 text-xs text-gray-700"><span className="text-blue-400">•</span><span><span className="font-semibold">{cert.name}</span>{cert.issuer&&` — ${cert.issuer}`}{cert.year&&` (${cert.year})`}</span></li>))}</ul></div>)}
        {educationList.length>0&&(<div className="mb-5"><h2 className="text-base font-bold text-blue-500 mb-3 border-b-2 border-blue-200 pb-1 uppercase tracking-wide">Education</h2><div className="space-y-3">{educationList.map((edu,i)=>(<div key={i} className="flex gap-4"><div className="w-20 flex-shrink-0 text-xs text-gray-500">{formatDate(edu.endMonth,edu.endYear,edu.isPresent)}</div><div><p className="font-bold text-gray-900 text-sm">{edu.degree}</p><p className="text-blue-500 text-xs italic">{edu.school}</p>{edu.score&&<p className="text-xs text-gray-500">{edu.score}</p>}</div></div>))}</div></div>)}
        {projects.length>0&&(<div className="mb-5"><h2 className="text-base font-bold text-blue-500 mb-3 border-b-2 border-blue-200 pb-1 uppercase tracking-wide">Projects</h2><div className="space-y-2">{projects.map((proj,i)=>(<div key={i}><p className="font-bold text-gray-900 text-sm">{proj.name}</p>{proj.description&&<p className="text-xs text-gray-700">{proj.description}</p>}{proj.link&&<a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">{proj.link}</a>}</div>))}</div></div>)}
      </div>
    </div>
  </div>
)

export default Builder

