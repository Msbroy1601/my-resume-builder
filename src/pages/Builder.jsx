import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useUser, useClerk } from '@clerk/clerk-react'
import html2pdf from 'html2pdf.js'
import { supabase } from '../lib/supabase'

//  DATA: JOB ROLES 
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

//  DATA: COMPANIES 
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

//  DATA: COURSES 
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

//  DATA: COLLEGES 
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

//  DATA: MONTHS & YEARS 
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]
const YEARS = Array.from({ length: 57 }, (_, i) =>(new Date().getFullYear() - i).toString())

//  DATA: LANGUAGES 
const LANGUAGE_LIST = [
  "Hindi","English","Bengali","Telugu","Marathi","Tamil","Urdu","Gujarati","Kannada","Odia",
  "Malayalam","Punjabi","Assamese","Maithili","Sanskrit","Santali","Kashmiri","Nepali","Sindhi","Konkani",
  "Manipuri","Bodo","Dogri","Arabic","French","German","Spanish","Portuguese","Italian","Russian",
  "Japanese","Chinese (Mandarin)","Chinese (Cantonese)","Korean","Dutch","Swedish","Norwegian","Danish",
  "Finnish","Polish","Czech","Slovak","Hungarian","Romanian","Bulgarian","Greek","Turkish","Persian",
  "Hebrew","Swahili","Indonesian","Malay","Thai","Vietnamese","Burmese","Sinhala","Dzongkha",
  "Tibetan","Tagalog","Javanese","Sundanese","Other"
]

//  DATA: SKILLS BY ROLE 
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

//  DATA: CERTIFICATIONS 
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

//  ROLE CONTENT 
// 298 roles × 5 responsibilities + 5 achievements, lazy-loaded from /roleContent.json

const getSuggestions = (jobTitle, roleContent) =>{
  if (!jobTitle || !roleContent) return { responsibilities: [], achievements: [] }
  if (roleContent[jobTitle]) return roleContent[jobTitle]
  const key = Object.keys(roleContent).find(k => jobTitle.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(jobTitle.toLowerCase())
  )
  return key ? roleContent[key] : { responsibilities: [], achievements: [] }
}



//  HELPER: Render text as bullet list 
const BulletList = ({ text, className = '' }) =>{
  if (!text) return null
  const lines = text.split('\n').map(l =>l.replace(/^[-•*]\s*/, '').trim()).filter(Boolean)
  if (!lines.length) return null
  return (
    <ul style={{ listStyleType: 'disc', paddingLeft: '1.1em', margin: 0 }} className={className}> {lines.map((line, i) =><li key={i} style={{ marginBottom: '1px' }}>{line}</li>)}
</ul> )
}

//  DATA: TEMPLATES (for in-builder switcher) 
const TEMPLATE_LIST = [
  { id: 'modern',       name: 'Modern',        badge: 'Popular' },
  { id: 'classic',      name: 'Classic',        badge: '' },
  { id: 'minimal',      name: 'Minimal',        badge: '' },
  { id: 'creative',     name: 'Creative',       badge: '' },
  { id: 'professional', name: 'Professional',   badge: 'ATS Friendly' },
  { id: 'sidebar',      name: 'Sidebar',        badge: ' Photo' },
  { id: 'elegant',      name: 'Elegant',        badge: '' },
  { id: 'tech',         name: 'Tech',           badge: 'For Devs' },
  { id: 'greensidebar', name: 'Green Sidebar',  badge: ' Photo' },
  { id: 'goldheader',   name: 'Gold Header',    badge: ' Photo' },
  { id: 'classicserif', name: 'Classic Serif',  badge: ' Photo' },
  { id: 'coral',        name: 'Coral',          badge: ' Photo' },
  { id: 'amber',        name: 'Amber',          badge: ' Photo' },
  { id: 'serif2',       name: 'Formal Serif',   badge: ' Photo' },
  { id: 'hexagon',      name: 'Hexagon',        badge: '' },
  { id: 'navy',         name: 'Navy Icons',     badge: ' Photo' },
  { id: 'bluesidebar',  name: 'Blue Sidebar',   badge: ' Photo' },
]

//  COMPONENT: Searchable Dropdown 
function SearchableDropdown({ options, value, onChange, placeholder, label }) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [showOther, setShowOther] = useState(false)
  const [otherValue, setOtherValue] = useState('')

  const filtered = options
    .filter(o =>o !== 'Other' && o.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 60)
  const showOtherOption = options.includes('Other') && 'other'.includes(search.toLowerCase())

  const handleSelect = (option) =>{
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
    <div className="relative"> {label && <label className="block text-sm font-semibold mb-2 text-gray-700">{label}</label>}
      <div
        className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer flex justify-between items-center bg-white hover:border-blue-400 transition"
        onClick={() =>setOpen(!open)}
      > <span className={value ? 'text-gray-900' : 'text-gray-400'}>{value || placeholder}</span> <span className="text-gray-400 text-xs">{open ? '' : ''}</span>
</div> {open && (
        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-2xl mt-1 max-h-64 overflow-hidden"> <div className="p-2 border-b border-gray-100"> <input
              autoFocus
              type="text"
              value={search}
              onChange={e =>setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={e =>e.stopPropagation()}
            />
</div> <div className="overflow-y-auto max-h-48"> {filtered.length === 0 && !showOtherOption ? (
              <div className="px-4 py-3 text-gray-500 text-sm">No results found</div> ) : (
              <> {filtered.map((option, i) =>(
                  <div key={i} onClick={() =>handleSelect(option)}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm ${value === option ? 'bg-blue-100 font-semibold text-blue-700' : ''}`}> {option}
</div> ))}
                {showOtherOption && (
                  <div onClick={() =>handleSelect('Other')}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm border-t border-gray-100 text-gray-500 italic"> Other (type your own)
</div> )}
</> )}
</div>
</div> )}
      {showOther && (
        <div className="mt-2 flex gap-2"> <input
            autoFocus
            type="text"
            value={otherValue}
            onChange={e =>setOtherValue(e.target.value)}
            placeholder={`Type ${placeholder?.toLowerCase() || 'value'}...`}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={e =>{
              if (e.key === 'Enter' && otherValue.trim()) {
                onChange(otherValue.trim()); setShowOther(false); setOtherValue('')
              }
            }}
          /> <button
            onClick={() =>{ if (otherValue.trim()) { onChange(otherValue.trim()); setShowOther(false); setOtherValue('') } }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
          >OK</button>
</div> )}
</div> )
}

//  COMPONENT: Job Role Dropdown (grouped) 
function JobRoleDropdown({ value, onChange }) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [showOther, setShowOther] = useState(false)
  const [otherValue, setOtherValue] = useState('')

  const filteredGroups = Object.entries(JOB_ROLES).map(([group, roles]) =>({
    group,
    roles: roles.filter(r =>r !== 'Other' && r.toLowerCase().includes(search.toLowerCase()))
  })).filter(({ roles }) =>roles.length >0)
  const showOtherJobRole = 'other'.includes(search.toLowerCase())

  const handleSelect = (role) =>{
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
    <div className="relative"> <label className="block text-sm font-semibold mb-2 text-gray-700"> Job Title <span className="text-red-500">*</span>
</label> <div
        className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer flex justify-between items-center bg-white hover:border-blue-400 transition"
        onClick={() =>setOpen(!open)}
      > <span className={value ? 'text-gray-900' : 'text-gray-400'}>{value || 'Select job title...'}</span> <span className="text-gray-400 text-xs">{open ? '' : ''}</span>
</div> {open && (
        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-2xl mt-1 max-h-72 overflow-hidden"> <div className="p-2 border-b border-gray-100"> <input
              autoFocus
              type="text"
              value={search}
              onChange={e =>setSearch(e.target.value)}
              placeholder="Search job title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={e =>e.stopPropagation()}
            />
</div> <div className="overflow-y-auto max-h-56"> {filteredGroups.map(({ group, roles }) =>(
              <div key={group}> <div className="px-4 py-1 bg-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wide"> {group}
</div> {roles.map((role, i) =>(
                  <div key={i} onClick={() =>handleSelect(role)}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm ${value === role ? 'bg-blue-100 font-semibold text-blue-700' : ''}`}> {role}
</div> ))}
</div> ))}
            {showOtherJobRole && (
              <div onClick={() =>handleSelect('Other')}
                className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm border-t border-gray-100 text-gray-500 italic"> Other (type your own)
</div> )}
</div>
</div> )}
      {showOther && (
        <div className="mt-2 flex gap-2"> <input
            autoFocus
            type="text"
            value={otherValue}
            onChange={e =>setOtherValue(e.target.value)}
            placeholder="Type your job title..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={e =>{
              if (e.key === 'Enter' && otherValue.trim()) {
                onChange(otherValue.trim()); setShowOther(false); setOtherValue('')
              }
            }}
          /> <button
            onClick={() =>{ if (otherValue.trim()) { onChange(otherValue.trim()); setShowOther(false); setOtherValue('') } }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
          >OK</button>
</div> )}
</div> )
}

//  COMPONENT: Month-Year Picker 
function MonthYearPicker({ label, monthValue, yearValue, onMonthChange, onYearChange, required, allowPresent, isPresent, onPresentChange, presentLabel }) {
  return (
    <div> <label className="block text-sm font-semibold mb-2 text-gray-700"> {label} {required && <span className="text-red-500">*</span>}
</label> {isPresent ? (
        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 font-semibold text-sm"> Present
</div> ) : (
        <div className="grid grid-cols-2 gap-2"> <select
            value={monthValue}
            onChange={e =>onMonthChange(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          > <option value="">Month</option> {MONTHS.map(m =><option key={m} value={m}>{m}</option>)}
</select> <select
            value={yearValue}
            onChange={e =>onYearChange(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          > <option value="">Year</option> {YEARS.map(y =><option key={y} value={y}>{y}</option>)}
</select>
</div> )}
      {allowPresent && (
        <div className="flex items-center gap-2 mt-2"> <input
            type="checkbox"
            id={`present-${label}`}
            checked={isPresent}
            onChange={e =>onPresentChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 cursor-pointer"
          /> <label htmlFor={`present-${label}`} className="text-sm text-gray-700 font-medium cursor-pointer"> {presentLabel || 'Currently working here'}
</label>
</div> )}
</div> )
}

//  MAIN BUILDER 
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
  const [location, setLocation] = useState('')

  const [workExperiences, setWorkExperiences] = useState([])
  const [editingWorkIdx, setEditingWorkIdx] = useState(null)
  const [overlapWarning, setOverlapWarning] = useState(null) // { overlapping: exp, pending: work }
  const [showTemplateSwitcher, setShowTemplateSwitcher] = useState(false)
  const [roleContent, setRoleContent] = useState(null)
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

  // Lazy-load role suggestions on mount
  useEffect(() =>{
    fetch('/roleContent.json')
      .then(r =>r.json())
      .then(data =>setRoleContent(data))
      .catch(() =>{})
  }, [])

  useEffect(() =>{
    try {
      const savedData = localStorage.getItem('resumeData')
      if (savedData) {
        const data = JSON.parse(savedData)
        setName(data.name || '')
        setEmail(data.email || '')
        setPhone(data.phone || '')
        setSummary(data.summary || '')
        setLocation(data.location || '')
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

  useEffect(() =>{
    const t = searchParams.get('template')
    if (t) setSelectedTemplate(t)
    if (searchParams.get('import') === 'true') {
      setShowImport(true)
      setImportMsg(null)
      setImportPreview(null)
    }
  }, [searchParams])

  const handleSave = () =>{
    localStorage.setItem('resumeData', JSON.stringify({ name, email, phone, location, summary, workExperiences, educationList, projects, skillsList, certifications, websiteLinks, languages, hobbies, selectedTemplate, photo }))
    alert(' Resume saved to browser!')
  }

  const handleClearAll = () =>{
    if (!window.confirm('Clear all data? This cannot be undone.')) return
    setName(''); setEmail(''); setPhone(''); setLocation(''); setSummary(''); setNameError('')
    setWorkExperiences([]); setEducationList([]); setProjects([]); setCertifications([]); setSkillsList([]); setPhoto(null); setWebsiteLinks({ linkedin: '', github: '', portfolio: '', other: '' }); setLanguages([]); setHobbies(''); setSkillsList([]); setPhoto(null)
    setCurrentWork({ company: '', jobTitle: '', startMonth: '', startYear: '', endMonth: '', endYear: '', isPresent: false, responsibilities: '', achievements: '' })
    setCurrentEducation({ school: '', degree: '', startMonth: '', startYear: '', endMonth: '', endYear: '', isPresent: false, score: '' })
    localStorage.removeItem('resumeData')
  }

  //  ATS CHECKER 
  const runATSCheck = () =>{
    const checks = [
      // Critical (weight 3)
      {
        id: 'name', weight: 3, category: 'critical',
        label: 'Full name is present',
        pass: name.trim().length >0,
        tip: 'Add your full name in the Personal Information section.'
      },
      {
        id: 'email', weight: 3, category: 'critical',
        label: 'Email address included',
        pass: email.trim().length >0,
        tip: 'Add your email so recruiters and ATS systems can reach you.'
      },
      {
        id: 'phone', weight: 3, category: 'critical',
        label: 'Phone number included',
        pass: phone.trim().length >0,
        tip: 'Add your phone number for direct contact.'
      },
      {
        id: 'summary', weight: 3, category: 'critical',
        label: 'Professional summary written',
        pass: summary.trim().length >= 50,
        tip: 'Write a 2–3 sentence summary. ATS systems heavily weight this section for keyword matching.'
      },
      {
        id: 'work', weight: 3, category: 'critical',
        label: 'At least one work experience added',
        pass: workExperiences.length >0,
        tip: 'Add your most recent job to the Work Experience section.'
      },
      {
        id: 'education', weight: 3, category: 'critical',
        label: 'Education section filled',
        pass: educationList.length >0,
        tip: 'Add your highest qualification — most ATS systems filter by education level.'
      },
      {
        id: 'skills', weight: 3, category: 'critical',
        label: 'At least 5 skills listed',
        pass: skillsList.length >= 5,
        tip: `You have ${skillsList.length} skill(s). ATS systems match keywords from your Skills section to the job description — aim for 8–12.`
      },
      // Improvements (weight 2)
      {
        id: 'responsibilities', weight: 2, category: 'improvement',
        label: 'All roles have responsibilities filled',
        pass: workExperiences.length >0 && workExperiences.every(w =>w.responsibilities && w.responsibilities.trim().length >10),
        tip: 'Add key responsibilities for every job role — ATS systems scan these for role-match keywords.'
      },
      {
        id: 'achievements', weight: 2, category: 'improvement',
        label: 'Achievements added to work experience',
        pass: workExperiences.length >0 && workExperiences.some(w =>w.achievements && w.achievements.trim().length >10),
        tip: 'Add accomplishments to at least one role. Recruiters prioritise results-driven candidates.'
      },
      {
        id: 'quantified', weight: 2, category: 'improvement',
        label: 'Achievements include numbers or metrics',
        pass: workExperiences.some(w =>w.achievements && /\d/.test(w.achievements)),
        tip: 'Use numbers to quantify impact — e.g. "Increased revenue by 30%" or "Managed a team of 8".'
      },
      {
        id: 'summaryLength', weight: 2, category: 'improvement',
        label: 'Summary is detailed (100+ characters)',
        pass: summary.trim().length >= 100,
        tip: 'Expand your summary to at least 2–3 full sentences. More detail = more keyword coverage.'
      },
      {
        id: 'multipleJobs', weight: 2, category: 'improvement',
        label: 'Multiple work experiences listed',
        pass: workExperiences.length >= 2,
        tip: 'Listing 2+ roles shows career progression — ATS systems and recruiters both value this.'
      },
      // Bonus (weight 1)
      {
        id: 'location', weight: 1, category: 'bonus',
        label: 'Location included',
        pass: location.trim().length >0,
        tip: 'Many job postings filter by location — add your city at minimum.'
      },
      {
        id: 'certifications', weight: 1, category: 'bonus',
        label: 'Certifications added',
        pass: certifications.length >0,
        tip: 'Certifications can match role-specific ATS keywords and signal credibility.'
      },
    ]
    const maxScore = checks.reduce((s, c) =>s + c.weight, 0)
    const earned = checks.filter(c =>c.pass).reduce((s, c) =>s + c.weight, 0)
    const score = Math.round((earned / maxScore) * 100)
    return { checks, score }
  }

  const [showATS, setShowATS] = useState(false)
  const [atsData, setAtsData] = useState(null)

  const handleATSCheck = () =>{
    setAtsData(runATSCheck())
    setShowATS(true)
  }

  //  RESUME STRENGTH SCORE 
  const computeStrengthScore = () =>{
    const criteria = [
      { label: 'Full name',          pts: 10, pass: name.trim().length >0 },
      { label: 'Email address',      pts: 8,  pass: email.trim().length >0 },
      { label: 'Phone number',       pts: 5,  pass: phone.trim().length >0 },
      { label: 'Location',           pts: 3,  pass: location.trim().length >0 },
      { label: 'Profile photo',      pts: 4,  pass: !!photo },
      { label: 'Professional summary (50+ chars)', pts: 8, pass: summary.trim().length >= 50 },
      { label: 'Detailed summary (150+ chars)',    pts: 4, pass: summary.trim().length >= 150 },
      { label: 'Work experience',    pts: 12, pass: workExperiences.length >0 },
      { label: 'Multiple roles (2+)',pts: 5,  pass: workExperiences.length >= 2 },
      { label: 'Job responsibilities filled', pts: 5, pass: workExperiences.length >0 && workExperiences.every(w =>w.responsibilities?.trim().length >10) },
      { label: 'Achievements filled',pts: 5,  pass: workExperiences.length >0 && workExperiences.some(w =>w.achievements?.trim().length >10) },
      { label: 'Education',          pts: 10, pass: educationList.length >0 },
      { label: 'Skills (3+)',        pts: 6,  pass: skillsList.length >= 3 },
      { label: 'Skills (6+)',        pts: 4,  pass: skillsList.length >= 6 },
      { label: 'Projects',           pts: 4,  pass: projects.length >0 },
      { label: 'Certifications',     pts: 3,  pass: certifications.length >0 },
      { label: 'Website / LinkedIn', pts: 4,  pass: !!(websiteLinks.linkedin || websiteLinks.github || websiteLinks.portfolio) },
    ]
    const total = criteria.reduce((s, c) =>s + c.pts, 0)         // 100
    const earned = criteria.filter(c =>c.pass).reduce((s, c) =>s + c.pts, 0)
    const pct = Math.round((earned / total) * 100)
    const missing = criteria.filter(c =>!c.pass).sort((a, b) =>b.pts - a.pts)
    const tip = missing.length >0
      ? `Add ${missing[0].label.toLowerCase()} to boost your score (+${missing[0].pts} pts)`
      : 'Your resume is looking great! '
    const color = pct >= 90 ? '#10b981' : pct >= 70 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#ef4444'
    const label = pct >= 90 ? 'Excellent' : pct >= 70 ? 'Good' : pct >= 40 ? 'Fair' : 'Needs work'
    return { pct, tip, color, label, missing }
  }

  //  CLOUD SAVE 
  const [showCloudPanel, setShowCloudPanel] = useState(false)
  const [cloudSaves, setCloudSaves] = useState([])
  const [cloudSaveName, setCloudSaveName] = useState('')
  const [currentResumeId, setCurrentResumeId] = useState(null) // id of loaded cloud resume
  const [cloudLoading, setCloudLoading] = useState(false)
  const [cloudMsg, setCloudMsg] = useState(null) // { type: 'success'|'error', text }

  const getResumeData = () =>({
    name, email, phone, location, summary,
    workExperiences, educationList, projects,
    skillsList, certifications, websiteLinks,
    languages, hobbies, selectedTemplate, photo,
  })

  const applyResumeData = (data) =>{
    if (data.name !== undefined) setName(data.name)
    if (data.email !== undefined) setEmail(data.email)
    if (data.phone !== undefined) setPhone(data.phone)
    if (data.location !== undefined) setLocation(data.location)
    if (data.summary !== undefined) setSummary(data.summary)
    if (data.workExperiences) setWorkExperiences(data.workExperiences)
    if (data.educationList) setEducationList(data.educationList)
    if (data.projects) setProjects(data.projects)
    if (data.skillsList) setSkillsList(data.skillsList)
    if (data.certifications) setCertifications(data.certifications)
    if (data.websiteLinks) setWebsiteLinks(data.websiteLinks)
    if (data.languages) setLanguages(data.languages)
    if (data.hobbies !== undefined) setHobbies(data.hobbies)
    if (data.selectedTemplate) setSelectedTemplate(data.selectedTemplate)
    if (data.photo !== undefined) setPhoto(data.photo)
  }

  const fetchCloudSaves = useCallback(async () =>{
    if (!user) return
    setCloudLoading(true)
    const { data, error } = await supabase
      .from('resumes')
      .select('id, resume_name, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    setCloudLoading(false)
    if (!error) setCloudSaves(data || [])
  }, [user])

  const saveToCloud = async () =>{
    if (!user || !cloudSaveName.trim()) return
    setCloudLoading(true)
    setCloudMsg(null)
    const payload = {
      user_id: user.id,
      resume_name: cloudSaveName.trim(),
      data: getResumeData(),
      updated_at: new Date().toISOString(),
    }
    let error
    if (currentResumeId) {
      // Update existing record
      const res = await supabase.from('resumes').update(payload).eq('id', currentResumeId).eq('user_id', user.id)
      error = res.error
    } else {
      // Insert new record
      const res = await supabase.from('resumes').insert(payload).select().single()
      error = res.error
      if (!error && res.data) setCurrentResumeId(res.data.id)
    }
    setCloudLoading(false)
    if (error) {
      setCloudMsg({ type: 'error', text: 'Save failed — check your Supabase setup.' })
    } else {
      setCloudMsg({ type: 'success', text: `"${cloudSaveName.trim()}" saved to cloud ` })
      fetchCloudSaves()
    }
  }

  const loadFromCloud = async (resume) =>{
    setCloudLoading(true)
    const { data, error } = await supabase
      .from('resumes')
      .select('data')
      .eq('id', resume.id)
      .eq('user_id', user.id)
      .single()
    setCloudLoading(false)
    if (error || !data) return
    applyResumeData(data.data)
    setCurrentResumeId(resume.id)
    setCloudSaveName(resume.resume_name)
    setCloudMsg({ type: 'success', text: `"${resume.resume_name}" loaded ` })
  }

  const deleteFromCloud = async (id) =>{
    if (!window.confirm('Delete this saved resume?')) return
    await supabase.from('resumes').delete().eq('id', id).eq('user_id', user.id)
    if (currentResumeId === id) { setCurrentResumeId(null); setCloudSaveName('') }
    fetchCloudSaves()
  }

  const handleOpenCloudPanel = () =>{
    fetchCloudSaves()
    setCloudMsg(null)
    setShowCloudPanel(true)
  }

  //  RESUME TUNE-UP 
  const loadRazorpay = () =>new Promise((resolve) =>{
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () =>resolve(true)
    script.onerror = () =>resolve(false)
    document.body.appendChild(script)
  })

  const handleTuneUpPayment = async () =>{
    setTuneUpLoading(true)
    setTuneUpMsg(null)
    const loaded = await loadRazorpay()
    if (!loaded) {
      setTuneUpMsg({ type: 'error', text: 'Could not load payment gateway. Please check your connection and try again.' })
      setTuneUpLoading(false)
      return
    }
    const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID
    if (!rzpKey) {
      setTuneUpMsg({ type: 'error', text: 'Payment not configured yet. Please contact support.' })
      setTuneUpLoading(false)
      return
    }
    const options = {
      key: rzpKey,
      amount: 49900, // ₹499 in paise
      currency: 'INR',
      name: 'AI Resume Builder',
      description: 'Expert CV Review (24-hour turnaround)',
      image: 'https://my-resume-builder-nine.vercel.app/favicon.svg',
      prefill: {
        name: name || '',
        email: user?.primaryEmailAddress?.emailAddress || '',
      },
      theme: { color: '#6366f1' },
      handler: async (response) =>{
        // Payment successful — store order in Supabase
        try {
          await supabase.from('tuneup_orders').insert({
            user_id: user.id,
            user_name: name || '',
            user_email: user?.primaryEmailAddress?.emailAddress || '',
            payment_id: response.razorpay_payment_id,
            amount: 499,
            resume_data: getResumeData(),
            status: 'pending',
          })
        } catch (_) { /* non-blocking — order recorded via Razorpay dashboard regardless */ }
        setTuneUpLoading(false)
        setTuneUpMsg({
          type: 'success',
          text: `Payment confirmed! (${response.razorpay_payment_id}) Your CV has been sent for expert review. Expect detailed feedback within 24 hours at ${user?.primaryEmailAddress?.emailAddress || 'your email'}.`
        })
      },
      modal: {
        ondismiss: () =>setTuneUpLoading(false)
      }
    }
    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (resp) =>{
      setTuneUpLoading(false)
      setTuneUpMsg({ type: 'error', text: `Payment failed: ${resp.error.description}` })
    })
    rzp.open()
  }

  //  JOB MATCH SCORE 
  const STOP_WORDS = new Set([
    'a','an','the','and','or','but','in','on','at','to','for','of','with','by','from',
    'as','is','was','are','were','be','been','being','have','has','had','do','does','did',
    'will','would','could','should','may','might','shall','must','can','need','that','this',
    'these','those','it','its','we','you','he','she','they','them','their','our','your',
    'i','my','me','us','who','what','which','when','where','why','how','all','each','both',
    'than','then','so','if','not','no','nor','yet','either','neither','while','although',
    'because','since','unless','until','after','before','during','through','about','above',
    'below','between','into','over','under','up','down','out','off','such','more','most',
    'other','per','any','own','same','too','very','just','also','only','well','new','strong',
    'based','role','position','looking','candidate','applicants','experience','work','working',
    'including','support','ensure','provide','help','assist','responsible','ability','skills',
    'using','use','make','team','good','great','excellent','preferred','required','must',
  ])

  const extractKeywords = (text) =>{
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s\-+#.]/g, ' ')
      .split(/\s+/)
      .map(w =>w.replace(/^[-.]|[-.]$/g, '').trim())
      .filter(w =>w.length >= 3 && !STOP_WORDS.has(w) && !/^\d+$/.test(w))
  }

  const getResumeText = () =>[
    name, summary,
    ...workExperiences.map(w =>`${w.jobTitle} ${w.company} ${w.responsibilities} ${w.achievements}`),
    ...educationList.map(e =>`${e.degree} ${e.school}`),
    ...skillsList.map(s =>s.name),
    ...certifications.map(c =>c.name),
    ...projects.map(p =>`${p.name} ${p.description}`),
    hobbies,
  ].join(' ')

  const runJobMatch = (jd) =>{
    if (!jd.trim()) return null
    const jdKeywords = extractKeywords(jd)
    const jdUnique = [...new Set(jdKeywords)]
    // Count frequency in JD to find the most important keywords
    const freq = {}
    jdKeywords.forEach(w =>{ freq[w] = (freq[w] || 0) + 1 })
    // Sort by frequency, take top 40
    const topKeywords = jdUnique.sort((a, b) =>freq[b] - freq[a]).slice(0, 40)
    const resumeText = getResumeText().toLowerCase()
    const matched = topKeywords.filter(kw =>resumeText.includes(kw))
    const missing = topKeywords.filter(kw =>!resumeText.includes(kw)).slice(0, 15)
    const score = Math.round((matched.length / topKeywords.length) * 100)
    return { score, matched, missing, total: topKeywords.length }
  }

  const [showJobMatch, setShowJobMatch] = useState(false)
  const [jobMatchJD, setJobMatchJD] = useState('')
  const [jobMatchResult, setJobMatchResult] = useState(null)

  const handleJobMatch = () =>{
    setShowJobMatch(true)
    setJobMatchResult(null)
  }

  //  CV IMPORT 
  const [showImport, setShowImport] = useState(false)
  const [importLoading, setImportLoading] = useState(false)
  const [importMsg, setImportMsg] = useState(null)
  const [importPreview, setImportPreview] = useState(null) // parsed data before applying

  const [showTuneUp, setShowTuneUp] = useState(false)
  const [tuneUpLoading, setTuneUpLoading] = useState(false)
  const [tuneUpMsg, setTuneUpMsg] = useState(null) // null | { type: 'success'|'error', text: string }

  const [showWhatsNext, setShowWhatsNext] = useState(false)

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const parseMonthYear = (str) =>{
    if (!str) return { month: '', year: '' }
    const s = str.trim()
    // Try "Month Year" or "Month, Year" or "MM/YYYY"
    const monthMatch = MONTHS.find(m =>s.toLowerCase().includes(m.toLowerCase()))
    const yearMatch = s.match(/\b(19|20)\d{2}\b/)
    return { month: monthMatch || '', year: yearMatch ? yearMatch[0] : '' }
  }

  const extractFromText = (text) =>{
    const lines = text.split('\n').map(l =>l.trim()).filter(Boolean)
    const result = {
      name: '', email: '', phone: '', location: '', summary: '',
      workExperiences: [], educationList: [], skillsList: [],
    }

    // Email
    const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/)
    if (emailMatch) result.email = emailMatch[0]

    // Phone
    const phoneMatch = text.match(/(\+?\d[\d\s\-().]{7,}\d)/)
    if (phoneMatch) result.phone = phoneMatch[0].trim()

    // Name — usually first non-empty line that isn't an email/phone/URL
    for (const line of lines.slice(0, 5)) {
      if (!line.match(/@|http|linkedin|github|\+?\d[\d\s]{6,}/) && line.length >2 && line.length < 60) {
        result.name = line; break
      }
    }

    // Location — look for city/country patterns near the top
    const locMatch = text.match(/\b([A-Z][a-z]+([\s,]+[A-Z][a-z]+){0,3})\s*[,|]\s*(India|UK|US|USA|United Kingdom|United States|Australia|Canada|Singapore|UAE|Remote)\b/)
    if (locMatch) result.location = locMatch[0].trim()

    // Summary — look for "Summary", "Profile", "About" section
    const summaryIdx = lines.findIndex(l =>/^(summary|profile|about|objective|professional summary)/i.test(l))
    if (summaryIdx !== -1) {
      const summaryLines = []
      for (let i = summaryIdx + 1; i < Math.min(summaryIdx + 6, lines.length); i++) {
        if (/^(experience|education|skills|work|employment)/i.test(lines[i])) break
        summaryLines.push(lines[i])
      }
      result.summary = summaryLines.join(' ').trim()
    }

    // Skills — look for "Skills" section, collect comma/bullet separated items
    const skillsIdx = lines.findIndex(l =>/^(skills|technical skills|core skills|key skills)/i.test(l))
    if (skillsIdx !== -1) {
      const skillLines = []
      for (let i = skillsIdx + 1; i < Math.min(skillsIdx + 15, lines.length); i++) {
        if (/^(experience|education|work|employment|projects|certifications)/i.test(lines[i])) break
        skillLines.push(lines[i])
      }
      const skillText = skillLines.join(' ')
      const skills = skillText.split(/[,•|·\n]+/).map(s =>s.trim()).filter(s =>s.length >1 && s.length < 40)
      result.skillsList = skills.slice(0, 20).map(name =>({ name, level: 3 }))
    }

    // Work Experience — find section, parse job blocks
    const expIdx = lines.findIndex(l =>/^(experience|work experience|employment|professional experience)/i.test(l))
    const eduIdx = lines.findIndex(l =>/^(education|academic|qualifications)/i.test(l))
    if (expIdx !== -1) {
      const expEnd = eduIdx >expIdx ? eduIdx : lines.length
      const expLines = lines.slice(expIdx + 1, expEnd)
      let currentJob = null
      const respLines = []
      for (const line of expLines) {
        // Date range pattern: "Jan 2020 – Dec 2022" or "2020 - 2022"
        const dateRange = line.match(/((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[\s,]*\d{4}|\d{4})\s*[-–—to]+\s*((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[\s,]*\d{4}|\d{4}|Present|Current)/i)
        if (dateRange) {
          if (currentJob) {
            currentJob.responsibilities = respLines.join('\n')
            result.workExperiences.push(currentJob)
            respLines.length = 0
          }
          const [startStr, , endStr] = dateRange[0].split(/\s*[-–—to]+\s*/i)
          const start = parseMonthYear(startStr)
          const isPresent = /present|current/i.test(endStr)
          const end = isPresent ? { month: '', year: '' } : parseMonthYear(endStr)
          currentJob = {
            company: '', jobTitle: '',
            startMonth: start.month, startYear: start.year,
            endMonth: end.month, endYear: end.year,
            isPresent, responsibilities: '', achievements: ''
          }
        } else if (currentJob && !currentJob.jobTitle && line.length >2 && line.length < 80) {
          currentJob.jobTitle = line
        } else if (currentJob && !currentJob.company && line.length >2 && line.length < 80) {
          currentJob.company = line
        } else if (currentJob && line.startsWith('•') || line.startsWith('-') || line.startsWith('·')) {
          respLines.push(line.replace(/^[•\-·]\s*/, ''))
        } else if (currentJob && line.length >20) {
          respLines.push(line)
        }
      }
      if (currentJob) {
        currentJob.responsibilities = respLines.join('\n')
        result.workExperiences.push(currentJob)
      }
    }

    // Education
    if (eduIdx !== -1) {
      const eduLines = lines.slice(eduIdx + 1, Math.min(eduIdx + 20, lines.length))
      let currentEdu = null
      for (const line of eduLines) {
        if (/^(skills|experience|projects|certifications|languages)/i.test(line)) break
        const dateRange = line.match(/(19|20)\d{2}\s*[-–—to]*\s*((19|20)\d{2}|Present)?/i)
        if (dateRange) {
          if (currentEdu) result.educationList.push(currentEdu)
          const years = line.match(/\b(19|20)\d{2}\b/g) || []
          currentEdu = {
            school: '', degree: '',
            startMonth: '', startYear: years[0] || '',
            endMonth: '', endYear: years[1] || '',
            isPresent: /present/i.test(line), score: ''
          }
        } else if (currentEdu && !currentEdu.degree && line.length >2 && line.length < 100) {
          currentEdu.degree = line
        } else if (currentEdu && !currentEdu.school && line.length >2 && line.length < 100) {
          currentEdu.school = line
        }
      }
      if (currentEdu) result.educationList.push(currentEdu)
    }

    return result
  }

  const handleImportFile = async (file) =>{
    if (!file) return
    setImportLoading(true)
    setImportMsg(null)
    setImportPreview(null)
    try {
      let text = ''
      if (file.name.endsWith('.pdf')) {
        const pdfjsLib = await import('pdfjs-dist')
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          text += content.items.map(item =>item.str).join(' ') + '\n'
        }
      } else if (file.name.endsWith('.docx')) {
        const mammoth = await import('mammoth')
        const arrayBuffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        text = result.value
      } else if (file.name.endsWith('.txt')) {
        text = await file.text()
      } else {
        setImportMsg({ type: 'error', text: 'Please upload a PDF, DOCX, or TXT file.' })
        setImportLoading(false)
        return
      }
      const parsed = extractFromText(text)
      setImportPreview(parsed)
      setImportMsg({ type: 'success', text: `Parsed successfully! Review and click "Apply to CV" to fill in your form.` })
    } catch (err) {
      console.error(err)
      setImportMsg({ type: 'error', text: 'Could not parse this file. Try a different format or paste your CV text manually.' })
    }
    setImportLoading(false)
  }

  const applyImport = () =>{
    if (!importPreview) return
    if (importPreview.name) setName(importPreview.name)
    if (importPreview.email) setEmail(importPreview.email)
    if (importPreview.phone) setPhone(importPreview.phone)
    if (importPreview.location) setLocation(importPreview.location)
    if (importPreview.summary) setSummary(importPreview.summary)
    if (importPreview.workExperiences?.length) setWorkExperiences(importPreview.workExperiences)
    if (importPreview.educationList?.length) setEducationList(importPreview.educationList)
    if (importPreview.skillsList?.length) setSkillsList(importPreview.skillsList)
    setShowImport(false)
    setImportPreview(null)
    setImportMsg(null)
  }

  const formatDate = (month, year, isPresent) =>{
    if (isPresent) return 'Present'
    if (month && year) return `${month.slice(0, 3)} ${year}`
    if (year) return year
    return ''
  }

  const isDateAfter = (m1, y1, m2, y2) =>{
    if (!y1 || !y2) return false
    if (parseInt(y1) >parseInt(y2)) return true
    if (parseInt(y1) < parseInt(y2)) return false
    return MONTHS.indexOf(m1) >MONTHS.indexOf(m2)
  }

  // Work validation
  const validateWork = () =>{
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
        setDateError(' End date cannot be before start date')
        return false
      }
    }
    setDateError('')
    return Object.keys(errors).length === 0
  }


  const dateToNum = (month, year, isPresent) =>{
    if (isPresent) return 209912
    if (!month || !year) return null
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return parseInt(year) * 100 + (months.indexOf(month) + 1)
  }

  const findOverlap = (newWork, skipIdx = null) =>{
    const ns = dateToNum(newWork.startMonth, newWork.startYear, false)
    const ne = dateToNum(newWork.endMonth, newWork.endYear, newWork.isPresent)
    if (!ns || !ne) return null
    return workExperiences.find((exp, i) =>{
      if (i === skipIdx) return false
      const es = dateToNum(exp.startMonth, exp.startYear, false)
      const ee = dateToNum(exp.endMonth, exp.endYear, exp.isPresent)
      if (!es || !ee) return false
      return ns <= ee && es <= ne
    }) || null
  }

  const addWorkExperience = (forceAdd = false) =>{
    if (!validateWork()) return
    if (!forceAdd) {
      const overlap = findOverlap(currentWork, editingWorkIdx)
      if (overlap) {
        setOverlapWarning({ overlapping: overlap, pending: currentWork })
        return
      }
    }
    setOverlapWarning(null)
    if (editingWorkIdx !== null) {
      const updated = [...workExperiences]
      updated[editingWorkIdx] = currentWork
      setWorkExperiences(updated)
      setEditingWorkIdx(null)
    } else {
      setWorkExperiences([...workExperiences, currentWork])
    }
    setCurrentWork({ company: '', jobTitle: '', startMonth: '', startYear: '', endMonth: '', endYear: '', isPresent: false, responsibilities: '', achievements: '' })
    setWorkErrors({}); setDateError(''); setShowSuggestions(null)
  }

  const startEditWork = (i) =>{
    setCurrentWork({ ...workExperiences[i] })
    setEditingWorkIdx(i)
    setWorkErrors({}); setDateError(''); setShowSuggestions(null)
  }

  const deleteWorkExperience = (index) =>setWorkExperiences(workExperiences.filter((_, i) =>i !== index))

  // Education validation
  const validateEducation = () =>{
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
        setEduDateError(' End date cannot be before start date')
        return false
      }
    }
    setEduDateError('')
    return Object.keys(errors).length === 0
  }

  const addEducation = () =>{
    if (!validateEducation()) return
    setEducationList([...educationList, currentEducation])
    setCurrentEducation({ school: '', degree: '', startMonth: '', startYear: '', endMonth: '', endYear: '', isPresent: false, score: '' })
    setEduErrors({}); setEduDateError('')
  }

  const deleteEducation = (index) =>setEducationList(educationList.filter((_, i) =>i !== index))

  // Generate summary using Claude API
  const generateSummary = async () =>{
    if (!name.trim()) { setNameError('Please enter your name first'); return }
    const hasData = workExperiences.length >0 || educationList.length >0 || skillsList.length >0
    if (!hasData) {
      alert('Please fill in at least your work experience, education, or skills before generating a summary.')
      return
    }
    setIsGeneratingSummary(true)
    try {
      const cvData = {
        name, roles: workExperiences.map(e =>`${e.jobTitle} at ${e.company}`).join(', '),
        education: educationList.map(e =>`${e.degree} from ${e.school}`).join(', '),
        skills: skillsList.map(s =>s.name).join(', '), certifications: certifications.map(c =>c.name).join(', ')
      }
      const totalYears = workExperiences.reduce((acc, exp) =>{
        const start = exp.startYear ? parseInt(exp.startYear) : 0
        const end = exp.isPresent ? new Date().getFullYear() : (exp.endYear ? parseInt(exp.endYear) : start)
        return acc + Math.max(0, end - start)
      }, 0)
      const prompt = `Write a concise, powerful 2-3 sentence professional summary for a resume. The person's name is ${cvData.name}. ${totalYears >0 ? `They have exactly ${totalYears} year${totalYears !== 1 ? 's' : ''} of work experience — do NOT exaggerate or round up this number.` : 'They are a fresher with no work experience yet.'} ${cvData.roles ? `They have worked as: ${cvData.roles}.` : ''} ${cvData.education ? `Education: ${cvData.education}.` : ''} ${cvData.skills ? `Key skills: ${cvData.skills}.` : ''} ${cvData.certifications ? `Certifications: ${cvData.certifications}.` : ''} Write in first-person style starting with a strong descriptor. Keep it under 60 words. No bullet points, no markdown, no headers, no hashtags. Plain text only. Professional tone suitable for Indian job market.`
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
  const getSkillSuggestions = () =>{
    const suggested = new Set()
    workExperiences.forEach(exp =>{
      const roleKey = Object.keys(SKILLS_BY_ROLE).find(k => exp.jobTitle?.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(exp.jobTitle?.toLowerCase() || '')
      )
      if (roleKey) SKILLS_BY_ROLE[roleKey].forEach(s =>suggested.add(s))
    })
    if (currentWork.jobTitle) {
      const roleKey = Object.keys(SKILLS_BY_ROLE).find(k => currentWork.jobTitle.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(currentWork.jobTitle.toLowerCase())
      )
      if (roleKey) SKILLS_BY_ROLE[roleKey].forEach(s =>suggested.add(s))
    }
    if (suggested.size === 0) SKILLS_BY_ROLE["General Fresher"].forEach(s =>suggested.add(s))
    // Remove already added skills
    const currentSkillNames = skillsList.map(s =>s.name.toLowerCase())
    return [...suggested].filter(s =>!currentSkillNames.includes(s.toLowerCase()))
  }

  const addSkillFromSuggestion = (skill) =>{
    if (!skillsList.map(s =>s.name.toLowerCase()).includes(skill.toLowerCase())) {
      setSkillsList([...skillsList, { name: skill, level: 3 }])
    }
  }
  const addManualSkill = () =>{
    const trimmed = currentSkillInput.trim()
    if (!trimmed) return
    if (skillsList.map(s =>s.name.toLowerCase()).includes(trimmed.toLowerCase())) return
    setSkillsList([...skillsList, { name: trimmed, level: currentSkillLevel }])
    setCurrentSkillInput('')
    setCurrentSkillLevel(3)
  }
  const deleteSkill = (i) =>setSkillsList(skillsList.filter((_, idx) =>idx !== i))
  const updateSkillLevel = (i, level) =>setSkillsList(skillsList.map((s, idx) =>idx === i ? { ...s, level } : s))

  // Certifications
  const addCertification = () =>{
    if (!currentCert.name.trim()) return
    if (certifications.some(c =>c.name.toLowerCase() === currentCert.name.toLowerCase())) return
    setCertifications([...certifications, currentCert])
    setCurrentCert({ name: '', issuer: '', year: '' })
  }
  const deleteCertification = (i) =>setCertifications(certifications.filter((_, idx) =>idx !== i))

  // Languages
  const addLanguage = () =>{
    if (!currentLanguage.name.trim()) return
    if (languages.some(l =>l.name.toLowerCase() === currentLanguage.name.toLowerCase())) return
    setLanguages([...languages, currentLanguage])
    setCurrentLanguage({ name: '', level: 3 })
  }
  const deleteLanguage = (i) =>setLanguages(languages.filter((_, idx) =>idx !== i))

  // Projects
  const addProject = () =>{
    if (!currentProject.name.trim()) return
    setProjects([...projects, currentProject])
    setCurrentProject({ name: '', description: '', link: '' })
  }
  const deleteProject = (index) =>setProjects(projects.filter((_, i) =>i !== index))

  const applySuggestion = (suggestion, field) =>{
    const current = currentWork[field]
    setCurrentWork({ ...currentWork, [field]: current ? current + '\n• ' + suggestion : '• ' + suggestion })
  }

  const handleDownloadClick = () =>setShowPaymentModal(true)

  const triggerDownload = () =>{
    setIsDownloading(true)
    setShowPaymentModal(false)
    const element = document.getElementById('resume-preview')
    if (!element) { alert(' Could not find resume preview'); setIsDownloading(false); return }
    const opt = {
      margin: [8, 8, 8, 8],
      filename: `Resume_${(name || 'Resume').replace(/\s+/g, '_')}_${selectedTemplate}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, logging: false, scrollY: 0, windowWidth: 794 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'avoid-all', before: '.page-break-before', avoid: ['h2', 'h3', '.job-entry', '.edu-entry'] }
    }
    html2pdf().set(opt).from(element).save()
      .then(() =>{ setIsDownloading(false); setShowWhatsNext(true) })
      .catch(() =>{ setIsDownloading(false); alert(' Error generating PDF.') })
  }

  //  Payment Modal 
  const PaymentModal = () =>(
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"> <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 relative"> <button onClick={() =>setShowPaymentModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold">×</button> <div className="text-center mb-5"> <div className="text-4xl mb-3"></div> <h2 className="text-2xl font-bold text-gray-900 mb-2">This tool is completely free!</h2> <p className="text-gray-600">If it helped you, buy me a coffee?</p>
</div> <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center mb-5"> <p className="text-amber-800 font-semibold text-sm">We recommend sending ₹99 or more</p> <p className="text-amber-600 text-xs mt-1">100% voluntary — totally up to you!</p>
</div> <div className="text-center mb-4"> <p className="text-sm font-semibold text-gray-700 mb-3">Scan with any UPI app to tip</p> <div className="flex justify-center"> <img src="/qr-code.jpg" alt="UPI QR Code" className="w-44 h-44 object-contain border-2 border-gray-200 rounded-xl shadow-md" />
</div>
</div> <div className="bg-gray-50 rounded-xl p-3 text-center mb-5 border border-gray-200"> <p className="text-xs text-gray-500 mb-1">UPI ID</p> <p className="text-base font-bold text-gray-900 select-all">baishaliroy11@ybl</p> <p className="text-xs text-gray-400 mt-1">PhonePe / GPay / Paytm / Any UPI app</p>
</div> <button onClick={triggerDownload} disabled={isDownloading}
          className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition shadow-lg flex items-center justify-center gap-2 ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}> {isDownloading ? '⏳ Generating PDF...' : ' Download My Resume'}
</button> <p className="text-center text-xs text-gray-400 mt-3">No payment needed — but your support means a lot!</p>
</div>
</div> )

  //  Templates 
  const ModernTemplate = () =>(
    <div className="p-8 bg-white rounded-xl shadow-xl border border-gray-200"> <div className="mb-6"> <button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}> {isDownloading ? 'Generating PDF...' : 'Download PDF'}
</button>
</div> <div id="resume-preview" className="border-t-2 border-gray-200 pt-6"> <div className="mb-8 pb-8 border-b-2 border-gray-200"> <h3 className="text-4xl font-bold text-gray-900 mb-3 leading-tight tracking-tight">{name || 'Your Name'}</h3> <p className="text-base text-gray-600 mb-1">{email || 'your.email@example.com'}</p> <p className="text-base text-gray-600">{phone || '+91 98765 43210'}</p> {location && <p className="text-base text-gray-600 mt-0.5">{location}</p>}
</div> {summary && (<div className="mb-8 pb-8 border-b-2 border-gray-200"><h3 className="text-xl font-bold text-blue-600 mb-4 uppercase tracking-wide">Professional Summary</h3><p className="text-base text-gray-700 leading-relaxed">{summary}</p></div>)}
        {workExperiences.length >0 && (<div className="mb-8 pb-8 border-b-2 border-gray-200"><h3 className="text-xl font-bold text-blue-600 mb-6 uppercase tracking-wide">Work Experience</h3><div className="space-y-6">{workExperiences.map((exp, i) =>(<div key={i}><p className="text-xl font-bold text-gray-900 mb-1">{exp.jobTitle}</p><p className="text-base text-blue-600 font-semibold mb-1">{exp.company}</p><p className="text-sm text-gray-500 mb-3 italic">{formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p>{exp.responsibilities && <BulletList text={exp.responsibilities} className="text-sm text-gray-700 leading-relaxed" />}
{exp.achievements && <div className="mt-3 pt-2 border-t border-gray-100"><p className="text-xs font-bold text-gray-900 mb-1">Achievements:</p><BulletList text={exp.achievements} className="text-sm text-gray-700 leading-relaxed" /></div>}</div>))}</div></div>)}
        {projects.length >0 && (<div className="mb-8 pb-8 border-b-2 border-gray-200"><h3 className="text-xl font-bold text-blue-600 mb-6 uppercase tracking-wide">Projects</h3><div className="space-y-5">{projects.map((proj, i) =>(<div key={i}><p className="text-lg font-bold text-gray-900 mb-1">{proj.name}</p>{proj.description && <p className="text-base text-gray-700 leading-relaxed mb-1">{proj.description}</p>}{proj.link && <p className="text-sm text-blue-500"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div></div>)}
        {educationList.length >0 && (<div className="mb-8 pb-8 border-b-2 border-gray-200"><h3 className="text-xl font-bold text-blue-600 mb-6 uppercase tracking-wide">Education</h3><div className="space-y-5">{educationList.map((edu, i) =>(<div key={i}><p className="text-lg font-bold text-gray-900 mb-1">{edu.school}</p><p className="text-base text-gray-700 mb-1">{edu.degree}</p><p className="text-sm text-gray-500 italic">{formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}{edu.score ? <span className="ml-2 text-blue-600 font-medium">{edu.score}</span>: null}</p></div>))}</div></div>)}
        {skillsList.length >0 && (<div className="mb-6"><h3 className="text-xl font-bold text-blue-600 mb-5 uppercase tracking-wide">Skills</h3><div className="space-y-2">{skillsList.map((sk,i) =>(<div key={i} className="flex items-center justify-between"><span className="text-base font-semibold text-gray-800">{sk.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n =><span key={n} className={`w-3 h-3 rounded-full ${sk.level>=n?'bg-blue-500':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {certifications.length >0 && (<div className="mb-6"><h3 className="text-lg font-bold text-blue-600 mb-4 uppercase tracking-wide">Certifications</h3><div className="space-y-2">{certifications.map((cert,i) =>(<div key={i}><p className="font-semibold text-gray-900">{cert.name}</p>{(cert.issuer||cert.year) && <p className="text-sm text-gray-500">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>}</div>))}</div></div>)}
        {languages.length >0 && (<div className="mb-6"><h3 className="text-lg font-bold text-blue-600 mb-4 uppercase tracking-wide">Languages</h3><div className="flex flex-wrap gap-3">{languages.map((lang,i) =>(<div key={i} className="flex items-center gap-2"><span className="font-medium text-gray-800">{lang.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n =><span key={n} className={`w-2.5 h-2.5 rounded-full ${lang.level>=n?'bg-blue-500':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {(websiteLinks.linkedin||websiteLinks.github||websiteLinks.portfolio||websiteLinks.other) && (<div className="mb-6"><h3 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide">Links</h3><div className="space-y-1">{websiteLinks.linkedin && <p className="text-sm text-blue-600 break-all"><a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.linkedin}</a></p>}{websiteLinks.github && <p className="text-sm text-blue-600 break-all"><a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.github}</a></p>}{websiteLinks.portfolio && <p className="text-sm text-blue-600 break-all"><a href={websiteLinks.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.portfolio}</a></p>}{websiteLinks.other && <p className="text-sm text-blue-600 break-all"><a href={websiteLinks.other} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.other}</a></p>}</div></div>)}
        {hobbies && (<div className="mb-6"><h3 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide">Hobbies</h3><div className="flex flex-wrap gap-2">{hobbies.split(',').map((h,i) =>h.trim() && <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{h.trim()}</span>)}</div></div>)}
</div>
</div> )

  const ClassicTemplate = () =>(
    <div className="p-10 bg-white shadow-xl border-4 border-gray-900"> <div className="mb-6"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gray-900 text-white py-4 px-6 font-bold text-lg hover:bg-gray-800 transition flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}>{isDownloading ? 'Generating PDF...' : 'Download PDF'}</button></div> <div id="resume-preview" className="border-t-4 border-gray-900 pt-8"> <div className="mb-10 text-center"><h3 className="text-5xl font-bold text-gray-900 mb-3 uppercase tracking-tight">{name || 'Your Name'}</h3><div className="flex items-center justify-center gap-3 text-base text-gray-700"><span>{email || 'your.email@example.com'}</span><span className="font-bold">•</span><span>{phone || '+91 98765 43210'}</span>{location && <><span className="font-bold">•</span><span>{location}</span></>}</div></div> {summary && (<div className="mb-10"><h3 className="text-lg font-bold text-gray-900 mb-4 uppercase border-b-4 border-gray-900 pb-2 tracking-wider">Professional Summary</h3><p className="text-base text-gray-800 leading-relaxed">{summary}</p></div>)}
        {workExperiences.length >0 && (<div className="mb-10"><h3 className="text-lg font-bold text-gray-900 mb-5 uppercase border-b-4 border-gray-900 pb-2 tracking-wider">Professional Experience</h3><div className="space-y-6">{workExperiences.map((exp, i) =>(<div key={i}><p className="font-bold text-gray-900 text-lg mb-1">{exp.jobTitle}</p><p className="text-base text-gray-800 italic mb-2">{exp.company} | {formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p>{exp.responsibilities && <BulletList text={exp.responsibilities} className="text-sm text-gray-700 leading-relaxed" />}
{exp.achievements && <div className="mt-3 pt-2 border-t border-gray-300"><p className="text-xs font-bold text-gray-900 mb-1">Achievements:</p><BulletList text={exp.achievements} className="text-sm text-gray-700 leading-relaxed" /></div>}</div>))}</div></div>)}
        {projects.length >0 && (<div className="mb-10"><h3 className="text-lg font-bold text-gray-900 mb-5 uppercase border-b-4 border-gray-900 pb-2 tracking-wider">Projects</h3><div className="space-y-4">{projects.map((proj, i) =>(<div key={i}><p className="font-bold text-gray-900 text-base">{proj.name}</p>{proj.description && <p className="text-base text-gray-800 mt-1">{proj.description}</p>}{proj.link && <p className="text-sm text-gray-600 italic mt-1"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div></div>)}
        {educationList.length >0 && (<div className="mb-10"><h3 className="text-lg font-bold text-gray-900 mb-5 uppercase border-b-4 border-gray-900 pb-2 tracking-wider">Education</h3><div className="space-y-4">{educationList.map((edu, i) =>(<div key={i}><p className="font-bold text-gray-900 text-base">{edu.school}</p><p className="text-base text-gray-800">{edu.degree} | {formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div></div>)}
        {skillsList.length >0 && (<div className="mb-6"><h3 className="text-lg font-bold text-gray-900 mb-4 uppercase border-b-4 border-gray-900 pb-2 tracking-wider">Skills</h3><div className="grid grid-cols-2 gap-2">{skillsList.map((sk,i) =>(<div key={i} className="flex items-center justify-between"><span className="text-base text-gray-800 font-medium">{sk.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n =><span key={n} className={`w-2.5 h-2.5 rounded-full ${sk.level>=n?'bg-gray-800':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {certifications.length >0 && (<div className="mb-6"><h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">Certifications</h3><div className="space-y-2">{certifications.map((cert,i) =>(<div key={i}><p className="font-semibold text-gray-900">{cert.name}</p>{(cert.issuer||cert.year) && <p className="text-sm text-gray-500">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>}</div>))}</div></div>)}
        {languages.length >0 && (<div className="mb-6"><h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">Languages</h3><div className="flex flex-wrap gap-3">{languages.map((lang,i) =>(<div key={i} className="flex items-center gap-2"><span className="font-medium text-gray-800">{lang.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n =><span key={n} className={`w-2.5 h-2.5 rounded-full ${lang.level>=n?'bg-gray-700':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {(websiteLinks.linkedin||websiteLinks.github||websiteLinks.portfolio||websiteLinks.other) && (<div className="mb-6"><h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Links</h3><div className="space-y-1">{websiteLinks.linkedin && <p className="text-sm text-gray-700 break-all"><a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.linkedin}</a></p>}{websiteLinks.github && <p className="text-sm text-gray-700 break-all"><a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.github}</a></p>}{websiteLinks.portfolio && <p className="text-sm text-gray-700 break-all"><a href={websiteLinks.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.portfolio}</a></p>}{websiteLinks.other && <p className="text-sm text-gray-700 break-all"><a href={websiteLinks.other} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.other}</a></p>}</div></div>)}
        {hobbies && (<div className="mb-6"><h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Hobbies</h3><div className="flex flex-wrap gap-2">{hobbies.split(',').map((h,i) =>h.trim() && <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{h.trim()}</span>)}</div></div>)}
</div>
</div> )

  const MinimalTemplate = () =>(
    <div className="p-12 bg-white"> <div className="mb-6"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-black text-white py-4 px-6 font-medium text-lg hover:bg-gray-800 transition flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}>{isDownloading ? 'Generating PDF...' : 'Download PDF'}</button></div> <div id="resume-preview" className="border-t border-gray-300 pt-10"> <div className="mb-12"><h3 className="text-6xl font-light text-gray-900 mb-4 tracking-tight">{name || 'Your Name'}</h3><p className="text-base text-gray-600">{email || 'your.email@example.com'}</p><p className="text-base text-gray-600">{phone || '+91 98765 43210'}</p>{location && <p className="text-base text-gray-600">{location}</p>}</div> {summary && (<div className="mb-12"><h3 className="text-sm font-semibold text-gray-900 mb-4 tracking-widest uppercase">About</h3><p className="text-base text-gray-700 leading-relaxed font-light">{summary}</p></div>)}
        {workExperiences.length >0 && (<div className="mb-12"><h3 className="text-sm font-semibold text-gray-900 mb-6 tracking-widest uppercase">Experience</h3><div className="space-y-8">{workExperiences.map((exp, i) =>(<div key={i}><p className="text-lg font-medium text-gray-900 mb-1">{exp.jobTitle}</p><p className="text-base text-gray-600 font-light mb-1">{exp.company}</p><p className="text-sm text-gray-500 mb-3 font-light">{formatDate(exp.startMonth, exp.startYear)} — {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p>{exp.responsibilities && <BulletList text={exp.responsibilities} className="text-sm text-gray-700 leading-relaxed" />}
{exp.achievements && <div className="mt-3 pt-2 border-t border-gray-100"><p className="text-xs font-bold text-gray-900 mb-1">Achievements:</p><BulletList text={exp.achievements} className="text-sm text-gray-700 leading-relaxed" /></div>}</div>))}</div></div>)}
        {projects.length >0 && (<div className="mb-12"><h3 className="text-sm font-semibold text-gray-900 mb-6 tracking-widest uppercase">Projects</h3><div className="space-y-5">{projects.map((proj, i) =>(<div key={i}><p className="text-base font-medium text-gray-900">{proj.name}</p>{proj.description && <p className="text-base text-gray-700 font-light mt-1">{proj.description}</p>}{proj.link && <p className="text-sm text-gray-400 font-light mt-1"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div></div>)}
        {educationList.length >0 && (<div className="mb-12"><h3 className="text-sm font-semibold text-gray-900 mb-6 tracking-widest uppercase">Education</h3><div className="space-y-5">{educationList.map((edu, i) =>(<div key={i}><p className="text-base font-medium text-gray-900">{edu.school}</p><p className="text-base text-gray-700 font-light">{edu.degree}</p><p className="text-sm text-gray-500 font-light">{formatDate(edu.startMonth, edu.startYear)} — {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div></div>)}
        {skillsList.length >0 && (<div className="mb-6"><h3 className="text-sm font-semibold text-gray-900 mb-5 tracking-widest uppercase">Skills</h3><div className="space-y-2">{skillsList.map((sk,i) =>(<div key={i} className="flex items-center justify-between"><span className="text-base text-gray-700 font-light">{sk.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n =><span key={n} className={`w-2.5 h-2.5 rounded-full ${sk.level>=n?'bg-gray-500':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {certifications.length >0 && (<div className="mb-6"><h3 className="text-lg font-bold text-gray-700 mb-4 uppercase tracking-wide">Certifications</h3><div className="space-y-2">{certifications.map((cert,i) =>(<div key={i}><p className="font-semibold text-gray-900">{cert.name}</p>{(cert.issuer||cert.year) && <p className="text-sm text-gray-500">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>}</div>))}</div></div>)}
        {languages.length >0 && (<div className="mb-6"><h3 className="text-lg font-bold text-gray-700 mb-4 uppercase tracking-wide">Languages</h3><div className="flex flex-wrap gap-3">{languages.map((lang,i) =>(<div key={i} className="flex items-center gap-2"><span className="font-medium text-gray-800">{lang.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n =><span key={n} className={`w-2.5 h-2.5 rounded-full ${lang.level>=n?'bg-gray-400':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {(websiteLinks.linkedin||websiteLinks.github||websiteLinks.portfolio||websiteLinks.other) && (<div className="mb-6"><h3 className="text-lg font-bold text-gray-700 mb-3 uppercase tracking-wide">Links</h3><div className="space-y-1">{websiteLinks.linkedin && <p className="text-sm text-gray-500 break-all"><a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.linkedin}</a></p>}{websiteLinks.github && <p className="text-sm text-gray-500 break-all"><a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.github}</a></p>}{websiteLinks.portfolio && <p className="text-sm text-gray-500 break-all"><a href={websiteLinks.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.portfolio}</a></p>}{websiteLinks.other && <p className="text-sm text-gray-500 break-all"><a href={websiteLinks.other} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.other}</a></p>}</div></div>)}
        {hobbies && (<div className="mb-6"><h3 className="text-lg font-bold text-gray-700 mb-3 uppercase tracking-wide">Hobbies</h3><div className="flex flex-wrap gap-2">{hobbies.split(',').map((h,i) =>h.trim() && <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">{h.trim()}</span>)}</div></div>)}
</div>
</div> )

  const CreativeTemplate = () =>(
    <div className="p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-xl shadow-2xl border-4 border-purple-300"> <div className="mb-6"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}>{isDownloading ? 'Generating PDF...' : 'Download PDF'}</button></div> <div id="resume-preview" className="bg-white rounded-2xl p-8 shadow-xl"> <div className="mb-8 pb-8 border-b-2 border-purple-200"><h3 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 mb-4 leading-tight">{name || 'Your Name'}</h3><p className="text-base text-gray-700 font-medium">{email || 'your.email@example.com'}</p><p className="text-base text-gray-700 font-medium">{phone || '+91 98765 43210'}</p>{location && <p className="text-base text-gray-700 font-medium">{location}</p>}</div> {summary && (<div className="mb-8 pb-8 border-b-2 border-purple-200"><div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-5 border-l-4 border-purple-500"><h3 className="text-lg font-bold text-purple-900 mb-3 uppercase tracking-wide">About Me</h3><p className="text-base text-gray-800 leading-relaxed">{summary}</p></div></div>)}
        {workExperiences.length >0 && (<div className="mb-8 pb-8 border-b-2 border-purple-200"><h3 className="text-lg font-bold text-purple-600 mb-6 uppercase tracking-wide flex items-center">Work Experience</h3><div className="space-y-6">{workExperiences.map((exp, i) =>(<div key={i} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border-l-4 border-pink-500"><p className="text-xl font-bold text-gray-900 mb-1">{exp.jobTitle}</p><p className="text-base text-purple-600 font-bold mb-1">{exp.company}</p><p className="text-sm text-gray-600 mb-3 italic">{formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p>{exp.responsibilities && <BulletList text={exp.responsibilities} className="text-sm text-gray-700 leading-relaxed" />}
{exp.achievements && <div className="mt-3 pt-2 border-t border-gray-300"><p className="text-xs font-bold text-gray-900 mb-1">Achievements:</p><BulletList text={exp.achievements} className="text-sm text-gray-700 leading-relaxed" /></div>}</div>))}</div></div>)}
        {projects.length >0 && (<div className="mb-8 pb-8 border-b-2 border-purple-200"><h3 className="text-lg font-bold text-purple-600 mb-6 uppercase tracking-wide flex items-center">Projects</h3><div className="space-y-5">{projects.map((proj, i) =>(<div key={i} className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5 border-l-4 border-indigo-500"><p className="text-lg font-bold text-gray-900 mb-1">{proj.name}</p>{proj.description && <p className="text-base text-gray-800 mb-1">{proj.description}</p>}{proj.link && <p className="text-sm text-indigo-500"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div></div>)}
        {educationList.length >0 && (<div className="mb-8 pb-8 border-b-2 border-purple-200"><h3 className="text-lg font-bold text-purple-600 mb-6 uppercase tracking-wide flex items-center">Education</h3><div className="space-y-5">{educationList.map((edu, i) =>(<div key={i} className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-5 border-l-4 border-orange-500"><p className="text-lg font-bold text-gray-900 mb-1">{edu.school}</p><p className="text-base text-gray-800 mb-1">{edu.degree}</p><p className="text-sm text-gray-600 italic">{formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div></div>)}
        {skillsList.length >0 && (<div className="mb-6"><h3 className="text-lg font-bold text-purple-600 mb-5 uppercase tracking-wide flex items-center">Skills</h3><div className="space-y-2">{skillsList.map((sk,i) =>(<div key={i} className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-lg"><span className="text-base font-bold text-gray-800">{sk.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n =><span key={n} className={`w-3 h-3 rounded-full ${sk.level>=n?'bg-purple-500':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {certifications.length >0 && (<div className="mb-6"><h3 className="text-lg font-bold text-purple-600 mb-4 uppercase tracking-wide">Certifications</h3><div className="space-y-2">{certifications.map((cert,i) =>(<div key={i}><p className="font-semibold text-gray-900">{cert.name}</p>{(cert.issuer||cert.year) && <p className="text-sm text-gray-500">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>}</div>))}</div></div>)}
        {languages.length >0 && (<div className="mb-6"><h3 className="text-lg font-bold text-purple-600 mb-4 uppercase tracking-wide">Languages</h3><div className="flex flex-wrap gap-3">{languages.map((lang,i) =>(<div key={i} className="flex items-center gap-2"><span className="font-medium text-gray-800">{lang.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n =><span key={n} className={`w-2.5 h-2.5 rounded-full ${lang.level>=n?'bg-purple-500':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {(websiteLinks.linkedin||websiteLinks.github||websiteLinks.portfolio||websiteLinks.other) && (<div className="mb-6"><h3 className="text-lg font-bold text-purple-600 mb-3 uppercase tracking-wide">Links</h3><div className="space-y-1">{websiteLinks.linkedin && <p className="text-sm text-purple-600 break-all"><a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.linkedin}</a></p>}{websiteLinks.github && <p className="text-sm text-purple-600 break-all"><a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.github}</a></p>}{websiteLinks.portfolio && <p className="text-sm text-purple-600 break-all"><a href={websiteLinks.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.portfolio}</a></p>}{websiteLinks.other && <p className="text-sm text-purple-600 break-all"><a href={websiteLinks.other} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.other}</a></p>}</div></div>)}
        {hobbies && (<div className="mb-6"><h3 className="text-lg font-bold text-purple-600 mb-3 uppercase tracking-wide">Hobbies</h3><div className="flex flex-wrap gap-2">{hobbies.split(',').map((h,i) =>h.trim() && <span key={i} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">{h.trim()}</span>)}</div></div>)}
</div>
</div> )

  const ProfessionalTemplate = () =>(
    <div className="p-10 bg-white shadow-2xl border-l-8 border-blue-600"> <div className="mb-6"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}>{isDownloading ? 'Generating PDF...' : 'Download PDF'}</button></div> <div id="resume-preview" className="border-t-2 border-blue-600 pt-8"> <div className="mb-10 pb-6 border-b-2 border-gray-300"><h3 className="text-4xl font-bold text-gray-900 mb-3 uppercase tracking-tight">{name || 'Your Name'}</h3><div className="flex items-center gap-4 text-base text-gray-700"><span>{email || 'your.email@example.com'}</span><span className="text-gray-400">|</span><span>{phone || '+91 98765 43210'}</span>{location && <><span className="text-gray-400">|</span><span>{location}</span></>}</div></div> {summary && (<div className="mb-10 pb-6 border-b-2 border-gray-300"><h3 className="text-lg font-bold text-blue-600 mb-4 uppercase tracking-wide">Professional Summary</h3><p className="text-base text-gray-800 leading-relaxed ml-5">{summary}</p></div>)}
        {workExperiences.length >0 && (<div className="mb-10 pb-6 border-b-2 border-gray-300"><h3 className="text-lg font-bold text-blue-600 mb-6 uppercase tracking-wide">Professional Experience</h3><div className="space-y-6 ml-5">{workExperiences.map((exp, i) =>(<div key={i}><div className="flex justify-between items-baseline mb-2"><p className="text-xl font-bold text-gray-900">{exp.jobTitle}</p><p className="text-sm text-gray-600 italic">{formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p></div><p className="text-base text-blue-600 font-semibold mb-3">{exp.company}</p>{exp.responsibilities && <BulletList text={exp.responsibilities} className="text-sm text-gray-700 leading-relaxed" />}
{exp.achievements && <div className="mt-3 pt-2 border-t border-gray-300"><p className="text-xs font-bold text-gray-900 mb-1">Achievements:</p><BulletList text={exp.achievements} className="text-sm text-gray-700 leading-relaxed" /></div>}</div>))}</div></div>)}
        {projects.length >0 && (<div className="mb-10 pb-6 border-b-2 border-gray-300"><h3 className="text-lg font-bold text-blue-600 mb-6 uppercase tracking-wide">Projects</h3><div className="space-y-5 ml-5">{projects.map((proj, i) =>(<div key={i}><p className="text-lg font-bold text-gray-900">{proj.name}</p>{proj.description && <p className="text-base text-gray-800 mt-1">{proj.description}</p>}{proj.link && <p className="text-sm text-blue-500 mt-1"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div></div>)}
        {educationList.length >0 && (<div className="mb-10 pb-6 border-b-2 border-gray-300"><h3 className="text-lg font-bold text-blue-600 mb-6 uppercase tracking-wide">Education</h3><div className="space-y-5 ml-5">{educationList.map((edu, i) =>(<div key={i}><p className="text-lg font-bold text-gray-900">{edu.school}</p><p className="text-base text-gray-800 mb-1">{edu.degree}</p><p className="text-sm text-gray-600 italic">{formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div></div>)}
        {skillsList.length >0 && (<div className="mb-6"><h3 className="text-lg font-bold text-blue-600 mb-5 uppercase tracking-wide">Core Competencies</h3><div className="grid grid-cols-2 gap-2 ml-5">{skillsList.map((sk,i) =>(<div key={i} className="flex items-center justify-between"><div className="flex items-center"><span className="text-base text-gray-800">{sk.name}</span></div><div className="flex gap-1">{[1,2,3,4,5].map(n =><span key={n} className={`w-2.5 h-2.5 rounded-full ${sk.level>=n?'bg-blue-500':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {certifications.length >0 && (<div className="mb-6"><h3 className="text-lg font-bold text-blue-600 mb-4 uppercase tracking-wide">Certifications</h3><div className="space-y-2">{certifications.map((cert,i) =>(<div key={i}><p className="font-semibold text-gray-900">{cert.name}</p>{(cert.issuer||cert.year) && <p className="text-sm text-gray-500">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>}</div>))}</div></div>)}
        {languages.length >0 && (<div className="mb-6"><h3 className="text-lg font-bold text-blue-600 mb-4 uppercase tracking-wide">Languages</h3><div className="flex flex-wrap gap-3">{languages.map((lang,i) =>(<div key={i} className="flex items-center gap-2"><span className="font-medium text-gray-800">{lang.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n =><span key={n} className={`w-2.5 h-2.5 rounded-full ${lang.level>=n?'bg-blue-500':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {(websiteLinks.linkedin||websiteLinks.github||websiteLinks.portfolio||websiteLinks.other) && (<div className="mb-6"><h3 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide">Links</h3><div className="space-y-1">{websiteLinks.linkedin && <p className="text-sm text-blue-600 break-all"><a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.linkedin}</a></p>}{websiteLinks.github && <p className="text-sm text-blue-600 break-all"><a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.github}</a></p>}{websiteLinks.portfolio && <p className="text-sm text-blue-600 break-all"><a href={websiteLinks.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.portfolio}</a></p>}{websiteLinks.other && <p className="text-sm text-blue-600 break-all"><a href={websiteLinks.other} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.other}</a></p>}</div></div>)}
        {hobbies && (<div className="mb-6"><h3 className="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide">Hobbies</h3><div className="flex flex-wrap gap-2">{hobbies.split(',').map((h,i) =>h.trim() && <span key={i} className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm">{h.trim()}</span>)}</div></div>)}
</div>
</div> )

  const SidebarTemplate = () =>(
    <div className="bg-white shadow-2xl overflow-hidden"> <div className="p-8 pb-4"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-green-700 hover:to-teal-700 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}>{isDownloading ? 'Generating PDF...' : 'Download PDF'}</button></div> <div id="resume-preview" style={{overflow:"hidden", width:"100%"}}> <div style={{float:"left", width:"33%"}} className="bg-gradient-to-b from-green-700 to-teal-700 text-white p-8"> {photo ? <img src={photo} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-green-400 mx-auto mb-5 shadow-md" />: <div className="w-16 h-16 rounded-full bg-green-600 border-4 border-green-400 mx-auto mb-5 flex items-center justify-center text-xl font-bold text-white">{name ? name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : 'YN'}</div>}
          <div className="mb-8"><h3 className="text-sm font-bold mb-4 uppercase tracking-wider border-b border-green-300 pb-2">Contact</h3><div className="space-y-3 text-sm"><div><p className="text-green-200 text-xs mb-1">Email</p><p className="break-words">{email || 'your.email@example.com'}</p></div><div><p className="text-green-200 text-xs mb-1">Phone</p><p>{phone || '+91 98765 43210'}</p></div>{location && <div><p className="text-green-200 text-xs mb-1">Location</p><p>{location}</p></div>}</div></div> {skillsList.length >0 && (<div className="mb-8"><h3 className="text-sm font-bold mb-4 uppercase tracking-wider border-b border-green-300 pb-2">Skills</h3><div className="space-y-2">{skillsList.map((sk,i) =>(<div key={i} className="flex items-center justify-between text-sm"><span className="flex items-center">{sk.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n =><span key={n} className={`w-2 h-2 rounded-full ${sk.level>=n?'bg-green-300':'bg-green-800'}`}></span>)}</div></div>))}</div></div>)}
          {certifications.length >0 && (<div className="mb-8"><h3 className="text-sm font-bold mb-4 uppercase tracking-wider border-b border-green-300 pb-2">Certifications</h3><div className="space-y-2">{certifications.map((cert,i) =>(<div key={i}><p className="text-sm font-semibold">{cert.name}</p>{(cert.issuer||cert.year) && <p className="text-xs text-green-200">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>}</div>))}</div></div>)}
          {languages.length >0 && (<div className="mb-8"><h3 className="text-sm font-bold mb-4 uppercase tracking-wider border-b border-green-300 pb-2">Languages</h3><div className="space-y-2">{languages.map((lang,i) =>(<div key={i}><p className="text-sm font-semibold">{lang.name}</p><div className="flex gap-1 mt-1">{[1,2,3,4,5].map(n =><span key={n} className={`w-2.5 h-2.5 rounded-full ${lang.level>=n?'bg-green-300':'bg-green-800'}`}></span>)}</div></div>))}</div></div>)}
          {(websiteLinks.linkedin||websiteLinks.github||websiteLinks.portfolio||websiteLinks.other) && (<div className="mb-8"><h3 className="text-sm font-bold mb-3 uppercase tracking-wider border-b border-green-300 pb-2">Links</h3><div className="space-y-1">{websiteLinks.linkedin && <p className="text-xs text-green-200 break-all"><a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.linkedin}</a></p>}{websiteLinks.github && <p className="text-xs text-green-200 break-all"><a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.github}</a></p>}{websiteLinks.portfolio && <p className="text-xs text-green-200 break-all"><a href={websiteLinks.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.portfolio}</a></p>}{websiteLinks.other && <p className="text-xs text-green-200 break-all"><a href={websiteLinks.other} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.other}</a></p>}</div></div>)}
          {hobbies && (<div className="mb-8"><h3 className="text-sm font-bold mb-3 uppercase tracking-wider border-b border-green-300 pb-2">Hobbies</h3><div className="flex flex-wrap gap-1">{hobbies.split(',').map((h,i) =>h.trim() && <span key={i} className="text-xs bg-green-700 px-2 py-1 rounded-full">{h.trim()}</span>)}</div></div>)}
          {educationList.length >0 && (<div><h3 className="text-sm font-bold mb-4 uppercase tracking-wider border-b border-green-300 pb-2">Education</h3><div className="space-y-4">{educationList.map((edu, i) =>(<div key={i} className="text-sm"><p className="font-bold">{edu.school}</p><p className="text-green-200 text-xs mt-1">{edu.degree}</p><p className="text-green-300 text-xs mt-1">{formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div></div>)}
</div> <div style={{float:"left", width:"67%"}} className="p-8"> <div className="mb-8"><h3 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">{name || 'Your Name'}</h3><div className="h-1 w-24 bg-gradient-to-r from-green-600 to-teal-600"></div></div> {summary && (<div className="mb-8"><h3 className="text-lg font-bold text-green-700 mb-3 uppercase tracking-wide">Professional Summary</h3><p className="text-base text-gray-700 leading-relaxed">{summary}</p></div>)}
          {workExperiences.length >0 && (<div className="mb-8"><h3 className="text-lg font-bold text-green-700 mb-5 uppercase tracking-wide">Work Experience</h3><div className="space-y-6">{workExperiences.map((exp, i) =>(<div key={i}><p className="text-xl font-bold text-gray-900 mb-1">{exp.jobTitle}</p><p className="text-base text-green-600 font-semibold mb-1">{exp.company}</p><p className="text-sm text-gray-500 mb-3 italic">{formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p>{exp.responsibilities && <BulletList text={exp.responsibilities} className="text-sm text-gray-700 leading-relaxed" />}
{exp.achievements && <div className="mt-3 pt-2 border-t border-green-200"><p className="text-xs font-bold text-gray-900 mb-1">Achievements:</p><BulletList text={exp.achievements} className="text-sm text-gray-700 leading-relaxed" /></div>}</div>))}</div></div>)}
          {projects.length >0 && (<div className="mb-8"><h3 className="text-lg font-bold text-green-700 mb-5 uppercase tracking-wide">Projects</h3><div className="space-y-4">{projects.map((proj, i) =>(<div key={i}><p className="text-base font-bold text-gray-900">{proj.name}</p>{proj.description && <p className="text-sm text-gray-700 mt-1">{proj.description}</p>}{proj.link && <p className="text-xs text-green-600 mt-1"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div></div>)}
</div>
</div>
</div> )

  const ElegantTemplate = () =>(
    <div className="p-10 bg-gradient-to-br from-rose-50 to-orange-50 shadow-2xl"> <div className="mb-6"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-rose-600 to-orange-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-rose-700 hover:to-orange-700 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}>{isDownloading ? 'Generating PDF...' : 'Download PDF'}</button></div> <div id="resume-preview" className="bg-white p-10 rounded-lg shadow-xl"> <div className="text-center mb-10 pb-8 border-b-2 border-rose-200"><h3 className="text-5xl font-serif font-bold text-gray-900 mb-4 tracking-tight">{name || 'Your Name'}</h3><div className="flex items-center justify-center gap-3 text-base text-gray-600 italic"><span>{email || 'your.email@example.com'}</span><span>{phone || '+91 98765 43210'}</span>{location && <><span>{location}</span></>}</div></div> {summary && (<div className="mb-10 pb-8 border-b border-rose-100"><h3 className="text-lg font-serif font-bold text-rose-600 mb-4 text-center italic">Professional Profile</h3><p className="text-base text-gray-700 leading-relaxed text-center italic">{summary}</p></div>)}
        {workExperiences.length >0 && (<div className="mb-10 pb-8 border-b border-rose-100"><h3 className="text-lg font-serif font-bold text-rose-600 mb-6 text-center italic">Professional Experience</h3><div className="space-y-6">{workExperiences.map((exp, i) =>(<div key={i} className="border-l-4 border-rose-300 pl-6"><p className="text-xl font-serif font-bold text-gray-900 mb-1">{exp.jobTitle}</p><p className="text-base text-rose-600 font-semibold mb-1 italic">{exp.company}</p><p className="text-sm text-gray-500 mb-3 italic">{formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p>{exp.responsibilities && <BulletList text={exp.responsibilities} className="text-sm text-gray-700 leading-relaxed" />}
{exp.achievements && <div className="mt-3 pt-2 border-t border-gray-100"><p className="text-xs font-bold text-gray-900 mb-1">Achievements:</p><BulletList text={exp.achievements} className="text-sm text-gray-700 leading-relaxed" /></div>}</div>))}</div></div>)}
        {projects.length >0 && (<div className="mb-10 pb-8 border-b border-rose-100"><h3 className="text-lg font-serif font-bold text-rose-600 mb-6 text-center italic">Projects</h3><div className="space-y-5">{projects.map((proj, i) =>(<div key={i} className="border-l-4 border-rose-200 pl-6"><p className="text-lg font-serif font-bold text-gray-900">{proj.name}</p>{proj.description && <p className="text-base text-gray-700 italic mt-1">{proj.description}</p>}{proj.link && <p className="text-sm text-rose-400 mt-1"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div></div>)}
        {educationList.length >0 && (<div className="mb-10 pb-8 border-b border-rose-100"><h3 className="text-lg font-serif font-bold text-rose-600 mb-6 text-center italic">Education</h3><div className="space-y-5">{educationList.map((edu, i) =>(<div key={i} className="border-l-4 border-orange-300 pl-6"><p className="text-lg font-serif font-bold text-gray-900">{edu.school}</p><p className="text-base text-gray-700 mb-1 italic">{edu.degree}</p><p className="text-sm text-gray-500 italic">{formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}{edu.score ? <span className="ml-2 text-blue-600 font-medium">{edu.score}</span>: null}</p></div>))}</div></div>)}
        {skillsList.length >0 && (<div className="mb-6"><h3 className="text-lg font-serif font-bold text-rose-600 mb-5 text-center italic">Core Competencies</h3><div className="space-y-2">{skillsList.map((sk,i) =>(<div key={i} className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-rose-50 to-orange-50 rounded-lg border border-rose-100"><span className="text-base text-rose-800 italic font-medium">{sk.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n =><span key={n} className={`w-3 h-3 rounded-full ${sk.level>=n?'bg-rose-400':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {certifications.length >0 && (<div className="mb-6"><h3 className="text-lg font-bold text-rose-500 mb-4 uppercase tracking-wide">Certifications</h3><div className="space-y-2">{certifications.map((cert,i) =>(<div key={i}><p className="font-semibold text-gray-900">{cert.name}</p>{(cert.issuer||cert.year) && <p className="text-sm text-gray-500">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>}</div>))}</div></div>)}
        {languages.length >0 && (<div className="mb-6"><h3 className="text-lg font-bold text-rose-500 mb-4 uppercase tracking-wide">Languages</h3><div className="flex flex-wrap gap-3">{languages.map((lang,i) =>(<div key={i} className="flex items-center gap-2"><span className="font-medium text-gray-800">{lang.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n =><span key={n} className={`w-2.5 h-2.5 rounded-full ${lang.level>=n?'bg-rose-400':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {(websiteLinks.linkedin||websiteLinks.github||websiteLinks.portfolio||websiteLinks.other) && (<div className="mb-6"><h3 className="text-lg font-bold text-rose-500 mb-3 uppercase tracking-wide">Links</h3><div className="space-y-1">{websiteLinks.linkedin && <p className="text-sm text-rose-500 break-all"><a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.linkedin}</a></p>}{websiteLinks.github && <p className="text-sm text-rose-500 break-all"><a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.github}</a></p>}{websiteLinks.portfolio && <p className="text-sm text-rose-500 break-all"><a href={websiteLinks.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.portfolio}</a></p>}{websiteLinks.other && <p className="text-sm text-rose-500 break-all"><a href={websiteLinks.other} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.other}</a></p>}</div></div>)}
        {hobbies && (<div className="mb-6"><h3 className="text-lg font-bold text-rose-500 mb-3 uppercase tracking-wide">Hobbies</h3><div className="flex flex-wrap gap-2">{hobbies.split(',').map((h,i) =>h.trim() && <span key={i} className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-sm">{h.trim()}</span>)}</div></div>)}
</div>
</div> )

  const TechTemplate = () =>(
    <div className="p-8 bg-gray-900 shadow-2xl"> <div className="mb-6"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-violet-700 hover:to-purple-700 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}>{isDownloading ? 'Generating PDF...' : 'Download PDF'}</button></div> <div id="resume-preview" className="bg-white p-10 rounded-xl"> <div className="mb-8 pb-8 border-b-2 border-violet-200"><h3 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600 mb-3 leading-tight">{name || 'Your Name'}</h3><div className="flex items-center gap-3 text-base text-gray-600 font-mono"><span className="text-violet-600">$</span><span>{email || 'your.email@example.com'}</span><span className="text-violet-400">|</span><span>{phone || '+91 98765 43210'}</span>{location && <><span className="text-violet-400">|</span><span>{location}</span></>}</div></div> {summary && (<div className="mb-8 pb-8 border-b-2 border-violet-200"><h3 className="text-lg font-bold text-violet-600 mb-4 uppercase tracking-wide font-mono flex items-center"><span className="text-violet-400 mr-2">{'>'}</span>README.md</h3><div className="bg-gray-50 p-5 rounded-lg border-l-4 border-violet-500 font-mono text-sm"><p className="text-gray-700 leading-relaxed">{summary}</p></div></div>)}
        {workExperiences.length >0 && (<div className="mb-8 pb-8 border-b-2 border-violet-200"><h3 className="text-lg font-bold text-violet-600 mb-6 uppercase tracking-wide font-mono flex items-center"><span className="text-violet-400 mr-2">{'>'}</span>Work Experience</h3><div className="space-y-6">{workExperiences.map((exp, i) =>(<div key={i} className="bg-gradient-to-r from-violet-50 to-purple-50 p-5 rounded-lg border-l-4 border-purple-500"><p className="text-xl font-bold text-gray-900 mb-1 font-mono">{exp.jobTitle}</p><p className="text-base text-violet-600 font-semibold mb-1 font-mono">{exp.company}</p><p className="text-sm text-gray-500 mb-3 font-mono"><span className="text-violet-400">{'['}</span>{formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}<span className="text-violet-400">{']'}</span></p>{exp.responsibilities && <BulletList text={exp.responsibilities} className="text-sm text-gray-700 leading-relaxed" />}
{exp.achievements && <div className="mt-3 pt-2 border-t border-gray-100"><p className="text-xs font-bold text-gray-900 mb-1">Achievements:</p><BulletList text={exp.achievements} className="text-sm text-gray-700 leading-relaxed" /></div>}</div>))}</div></div>)}
        {projects.length >0 && (<div className="mb-8 pb-8 border-b-2 border-violet-200"><h3 className="text-lg font-bold text-violet-600 mb-6 uppercase tracking-wide font-mono flex items-center"><span className="text-violet-400 mr-2">{'>'}</span>Projects</h3><div className="space-y-5">{projects.map((proj, i) =>(<div key={i} className="bg-gradient-to-r from-violet-50 to-purple-50 p-5 rounded-lg border-l-4 border-violet-300"><p className="text-lg font-bold text-gray-900 font-mono">{proj.name}</p>{proj.description && <p className="text-base text-gray-700 mt-1">{proj.description}</p>}{proj.link && <p className="text-sm text-violet-500 font-mono mt-1"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div></div>)}
        {educationList.length >0 && (<div className="mb-8 pb-8 border-b-2 border-violet-200"><h3 className="text-lg font-bold text-violet-600 mb-6 uppercase tracking-wide font-mono flex items-center"><span className="text-violet-400 mr-2">{'>'}</span>Education</h3><div className="space-y-5">{educationList.map((edu, i) =>(<div key={i} className="bg-gray-50 p-5 rounded-lg border-l-4 border-violet-400"><p className="text-lg font-bold text-gray-900 font-mono">{edu.school}</p><p className="text-base text-gray-700 mb-1">{edu.degree}</p><p className="text-sm text-gray-500 font-mono">{formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div></div>)}
        {skillsList.length >0 && (<div className="mb-6"><h3 className="text-lg font-bold text-violet-600 mb-5 uppercase tracking-wide font-mono flex items-center"><span className="text-violet-400 mr-2">{'>'}</span>Tech Stack</h3><div className="space-y-2">{skillsList.map((sk,i) =>(<div key={i} className="flex items-center justify-between bg-gray-900 px-4 py-2 rounded-md"><span className="text-base text-violet-300 font-mono font-bold">{sk.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n =><span key={n} className={`w-3 h-3 rounded-sm ${sk.level>=n?'bg-violet-400':'bg-gray-700'}`}></span>)}</div></div>))}</div></div>)}
        {certifications.length >0 && (<div className="mb-6"><h3 className="text-lg font-bold text-violet-600 mb-4 uppercase tracking-wide font-mono">Certifications</h3><div className="space-y-2">{certifications.map((cert,i) =>(<div key={i}><p className="font-semibold text-gray-900 font-mono">{cert.name}</p>{(cert.issuer||cert.year) && <p className="text-sm text-gray-500">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>}</div>))}</div></div>)}
        {languages.length >0 && (<div className="mb-6"><h3 className="text-lg font-bold text-violet-600 mb-4 uppercase tracking-wide font-mono">Languages</h3><div className="flex flex-wrap gap-3">{languages.map((lang,i) =>(<div key={i} className="flex items-center gap-2"><span className="font-medium text-gray-800 font-mono">{lang.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n =><span key={n} className={`w-2.5 h-2.5 rounded-full ${lang.level>=n?'bg-violet-500':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
        {(websiteLinks.linkedin||websiteLinks.github||websiteLinks.portfolio||websiteLinks.other) && (<div className="mb-6"><h3 className="text-lg font-bold text-violet-600 mb-3 uppercase tracking-wide font-mono">Links</h3><div className="space-y-1">{websiteLinks.linkedin && <p className="text-sm text-violet-600 break-all font-mono"><a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.linkedin}</a></p>}{websiteLinks.github && <p className="text-sm text-violet-600 break-all font-mono"><a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.github}</a></p>}{websiteLinks.portfolio && <p className="text-sm text-violet-600 break-all font-mono"><a href={websiteLinks.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.portfolio}</a></p>}{websiteLinks.other && <p className="text-sm text-violet-600 break-all font-mono"><a href={websiteLinks.other} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.other}</a></p>}</div></div>)}
        {hobbies && (<div className="mb-6"><h3 className="text-lg font-bold text-violet-600 mb-3 uppercase tracking-wide font-mono">Hobbies</h3><div className="flex flex-wrap gap-2">{hobbies.split(',').map((h,i) =>h.trim() && <span key={i} className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm font-mono">{h.trim()}</span>)}</div></div>)}
</div>
</div> )

//  TEMPLATE 9: Green Sidebar 
const GreenSidebarTemplate = () =>(
  <div className="p-8 bg-white rounded-xl shadow-xl border border-gray-200"> <div className="mb-6"> <button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-green-700 to-green-900 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-green-800 hover:to-green-950 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}> {isDownloading ? 'Generating PDF...' : 'Download PDF'}
</button>
</div> <div id="resume-preview" style={{overflow:"hidden", width:"100%"}}> <div style={{float:"left", width:"33%"}} className="bg-green-800 text-white p-6 rounded-l-lg"> <div className="mb-6 text-center"> {photo
              ? <img src={photo} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-green-400 mx-auto mb-3 shadow-md" /> : <div className="w-20 h-20 rounded-full bg-green-600 border-4 border-green-400 mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-white">{name ? name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : 'YN'}</div> }
            <h3 className="text-xl font-bold text-white leading-tight">{name || 'Your Name'}</h3>
</div> <div className="mb-6 border-t border-green-600 pt-4"> <h4 className="text-xs font-bold uppercase tracking-widest text-green-300 mb-3">Contact</h4> {email && <p className="text-xs text-green-100 mb-2 break-all">{email}</p>}
            {phone && <p className="text-xs text-green-100 mb-2">{phone}</p>}
            {location && <p className="text-xs text-green-100 mb-2">{location}</p>}
            {websiteLinks.linkedin && <p className="text-xs text-green-200 break-all mb-1"><a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.linkedin}</a></p>}
            {websiteLinks.github && <p className="text-xs text-green-200 break-all mb-1"><a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.github}</a></p>}
            {websiteLinks.portfolio && <p className="text-xs text-green-200 break-all mb-1"><a href={websiteLinks.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline break-all">{websiteLinks.portfolio}</a></p>}
</div> {skillsList.length >0 && (<div className="mb-6 border-t border-green-600 pt-4"> <h4 className="text-xs font-bold uppercase tracking-widest text-green-300 mb-3">Skills</h4> <div className="space-y-1.5">{skillsList.map((sk,i) =>(<div key={i} className="flex items-center justify-between"><span className="text-xs text-green-100">{sk.name}</span><div className="flex gap-0.5">{[1,2,3,4,5].map(n =><span key={n} className={`w-2 h-2 rounded-full ${sk.level>=n?'bg-green-300':'bg-green-700'}`}></span>)}</div></div>))}</div>
</div>)}
          {languages.length >0 && (<div className="mb-6 border-t border-green-600 pt-4"> <h4 className="text-xs font-bold uppercase tracking-widest text-green-300 mb-3">Languages</h4> <div className="space-y-2">{languages.map((lang,i) =>(<div key={i}><p className="text-xs font-semibold text-green-100">{lang.name}</p><div className="flex gap-1 mt-1">{[1,2,3,4,5].map(n =><span key={n} className={`w-2.5 h-2.5 rounded-full ${lang.level>=n?'bg-green-300':'bg-green-700'}`}></span>)}</div></div>))}</div>
</div>)}
          {hobbies && (<div className="border-t border-green-600 pt-4"> <h4 className="text-xs font-bold uppercase tracking-widest text-green-300 mb-2">Interests</h4> <p className="text-xs text-green-200 leading-relaxed">{hobbies}</p>
</div>)}
</div> {/* Right main content */}
        <div style={{float:"left", width:"67%"}} className="p-6 bg-white rounded-r-lg"> {summary && (<div className="mb-6 pb-4 border-b border-gray-200"><p className="text-sm text-gray-600 leading-relaxed italic">{summary}</p></div>)}
          {workExperiences.length >0 && (<div className="mb-6 pb-4 border-b border-gray-200"> <h3 className="text-base font-bold text-green-800 mb-4 uppercase tracking-wide border-b-2 border-green-700 pb-1">Work History</h3> <div className="space-y-4">{workExperiences.map((exp,i) =>(<div key={i} className="flex gap-3"> <div className="text-xs text-gray-500 w-24 flex-shrink-0 mt-1">{formatDate(exp.startMonth, exp.startYear)}<br/>–<br/>{formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</div> <div><p className="font-bold text-gray-900 text-sm">{exp.jobTitle}</p><p className="text-xs text-green-700 italic mb-1">{exp.company}</p> {exp.responsibilities && <BulletList text={exp.responsibilities} className="text-xs text-gray-700 leading-relaxed" />}
              {exp.achievements && <div className="mt-1 pt-1 border-t border-gray-100"><p className="text-xs font-bold text-gray-900 mb-1">Achievements:</p><BulletList text={exp.achievements} className="text-xs text-gray-700" /></div>}</div>
</div>))}</div>
</div>)}
          {projects.length >0 && (<div className="mb-6 pb-4 border-b border-gray-200"> <h3 className="text-base font-bold text-green-800 mb-4 uppercase tracking-wide border-b-2 border-green-700 pb-1">Projects</h3> <div className="space-y-3">{projects.map((proj,i) =>(<div key={i}><p className="font-bold text-gray-900 text-sm">{proj.name}</p>{proj.description && <p className="text-xs text-gray-700 mt-1">{proj.description}</p>}{proj.link && <p className="text-xs text-green-600 mt-1"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div>
</div>)}
          {educationList.length >0 && (<div className="mb-6 pb-4 border-b border-gray-200"> <h3 className="text-base font-bold text-green-800 mb-4 uppercase tracking-wide border-b-2 border-green-700 pb-1">Education</h3> <div className="space-y-3">{educationList.map((edu,i) =>(<div key={i} className="flex gap-3"> <div className="text-xs text-gray-500 w-24 flex-shrink-0">{formatDate(edu.startMonth, edu.startYear)} – {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</div> <div><p className="font-bold text-gray-900 text-sm">{edu.degree}</p><p className="text-xs text-green-700 italic">{edu.school}</p></div>
</div>))}</div>
</div>)}
          {certifications.length >0 && (<div className="mb-6"> <h3 className="text-base font-bold text-green-800 mb-3 uppercase tracking-wide border-b-2 border-green-700 pb-1">Certifications</h3> <div className="space-y-2">{certifications.map((cert,i) =>(<div key={i}><p className="text-sm font-semibold text-gray-800">{cert.name}</p>{(cert.issuer||cert.year) && <p className="text-xs text-gray-500">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>}</div>))}</div>
</div>)}
</div>
</div>
</div>
)

//  TEMPLATE 10: Gold Header 
const GoldHeaderTemplate = () =>(
  <div className="p-8 bg-white rounded-xl shadow-xl border border-gray-200"> <div className="mb-6"> <button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-yellow-600 to-amber-700 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-yellow-700 hover:to-amber-800 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}> {isDownloading ? 'Generating PDF...' : 'Download PDF'}
</button>
</div> <div id="resume-preview"> {/* Gold header bar */}
      <div className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white px-6 py-5 rounded-t-lg flex items-center gap-4"> {photo
          ? <img src={photo} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-white/60 flex-shrink-0 shadow" /> : <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/60 flex items-center justify-center text-xl font-bold flex-shrink-0">{name ? name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : 'YN'}</div> }
        <div> <h3 className="text-2xl font-bold text-white leading-tight">{name || 'Your Name'}</h3>
</div>
</div> {/* Contact bar */}
      <div className="bg-gray-50 border border-gray-200 px-6 py-3 flex flex-wrap gap-4 text-sm text-gray-600 mb-5"> {email && <span>{email}</span>}
        {phone && <span>{phone}</span>}{location && <span>{location}</span>}
        {websiteLinks.linkedin && <span className="text-amber-700">{websiteLinks.linkedin}</span>}
        {websiteLinks.github && <span className="text-amber-700">{websiteLinks.github}</span>}
        {websiteLinks.portfolio && <span className="text-amber-700">{websiteLinks.portfolio}</span>}
</div> <div className="px-2"> {summary && (<div className="mb-5 text-sm text-gray-700 leading-relaxed">{summary}</div>)}
        {workExperiences.length >0 && (<div className="mb-5"> <h3 className="text-base font-bold text-amber-700 mb-3 border-b-2 border-amber-400 pb-1 uppercase tracking-wide">Work History</h3> <div className="space-y-4">{workExperiences.map((exp,i) =>(<div key={i}> <div className="flex justify-between items-start"><p className="font-bold text-gray-900">{exp.jobTitle}</p><span className="text-xs text-gray-500 whitespace-nowrap ml-2">{formatDate(exp.startMonth, exp.startYear)} – {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</span></div> <p className="text-sm text-amber-700 italic mb-1">{exp.company}</p> {exp.responsibilities && <BulletList text={exp.responsibilities} className="text-xs text-gray-700 leading-relaxed" />}
            {exp.achievements && <div className="mt-2 pt-1 border-t border-amber-100"><p className="text-xs font-bold text-gray-900 mb-1">Achievements:</p><BulletList text={exp.achievements} className="text-xs text-gray-700" /></div>}
</div>))}</div>
</div>)}
        {projects.length >0 && (<div className="mb-5"> <h3 className="text-base font-bold text-amber-700 mb-3 border-b-2 border-amber-400 pb-1 uppercase tracking-wide">Projects</h3> <div className="space-y-3">{projects.map((proj,i) =>(<div key={i}><p className="font-bold text-gray-900 text-sm">{proj.name}</p>{proj.description && <p className="text-sm text-gray-700 mt-1">{proj.description}</p>}{proj.link && <p className="text-xs text-amber-600 mt-1"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div>
</div>)}
        {skillsList.length >0 && (<div className="mb-5"> <h3 className="text-base font-bold text-amber-700 mb-3 border-b-2 border-amber-400 pb-1 uppercase tracking-wide">Skills</h3> <div className="grid grid-cols-2 gap-2">{skillsList.map((sk,i) =>(<div key={i}><p className="text-sm text-gray-800 font-medium mb-1">{sk.name}</p><div className="h-1.5 bg-gray-200 rounded-full"><div className="h-1.5 bg-amber-500 rounded-full" style={{width:`${sk.level*20}%`}}></div></div></div>))}</div>
</div>)}
        {certifications.length >0 && (<div className="mb-5"> <h3 className="text-base font-bold text-amber-700 mb-3 border-b-2 border-amber-400 pb-1 uppercase tracking-wide">Certifications</h3> <div className="space-y-1">{certifications.map((cert,i) =>(<p key={i} className="text-sm text-gray-700">• {cert.name}{cert.issuer ? ` – ${cert.issuer}` : ''}{cert.year ? ` (${cert.year})` : ''}</p>))}</div>
</div>)}
        {educationList.length >0 && (<div className="mb-5"> <h3 className="text-base font-bold text-amber-700 mb-3 border-b-2 border-amber-400 pb-1 uppercase tracking-wide">Education</h3> <div className="space-y-3">{educationList.map((edu,i) =>(<div key={i}><p className="font-bold text-gray-900 text-sm">{edu.degree}</p><p className="text-sm text-amber-700 italic">{edu.school} | {formatDate(edu.startMonth, edu.startYear)} – {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div>
</div>)}
        {languages.length >0 && (<div className="mb-5"> <h3 className="text-base font-bold text-amber-700 mb-3 border-b-2 border-amber-400 pb-1 uppercase tracking-wide">Languages</h3> <div className="grid grid-cols-2 gap-2">{languages.map((lang,i) =>(<div key={i}><p className="text-sm font-medium text-gray-800">{lang.name}</p><div className="flex gap-1 mt-1">{[1,2,3,4,5].map(n =><span key={n} className={`w-4 h-1.5 rounded-sm ${lang.level>=n?'bg-amber-500':'bg-gray-200'}`}></span>)}</div></div>))}</div>
</div>)}
        {hobbies && (<div className="mb-5"> <h3 className="text-base font-bold text-amber-700 mb-3 border-b-2 border-amber-400 pb-1 uppercase tracking-wide">Hobbies & Interests</h3> <div className="flex flex-wrap gap-2">{hobbies.split(',').map((h,i) =>h.trim() && <span key={i} className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-sm">{h.trim()}</span>)}</div>
</div>)}
</div>
</div>
</div>
)

//  TEMPLATE 11: Classic Serif 
const ClassicSerifTemplate = () =>(
  <div className="p-8 bg-white rounded-xl shadow-xl border border-gray-200"> <div className="mb-6"> <button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gray-800 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-900 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}> {isDownloading ? 'Generating PDF...' : 'Download PDF'}
</button>
</div> <div id="resume-preview"> {/* Header with photo placeholder + name */}
      <div className="flex items-center gap-5 mb-4 pb-4 border-b-2 border-gray-800"> {photo
          ? <img src={photo} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-gray-400 flex-shrink-0" /> : <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-gray-400 flex items-center justify-center text-xl font-bold text-gray-600 flex-shrink-0">{name ? name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : 'YN'}</div> }
        <div> <h3 className="text-3xl font-bold text-gray-900 tracking-wide" style={{fontVariant:'small-caps'}}>{name || 'Your Name'}</h3> <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600"> {email && <span>{email}</span>}
            {phone && <span>• {phone}</span>}{location && <span>•  {location}</span>}
            {websiteLinks.linkedin && <span className="text-blue-700">• {websiteLinks.linkedin}</span>}
            {websiteLinks.github && <span className="text-blue-700">• {websiteLinks.github}</span>}
</div>
</div>
</div> {summary && (<div className="mb-4 pb-3 border-b border-gray-300"><p className="text-sm text-gray-700 leading-relaxed">{summary}</p></div>)}
      {workExperiences.length >0 && (<div className="mb-4 pb-3 border-b border-gray-300"> <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3" style={{fontVariant:'small-caps', letterSpacing:'0.15em'}}>Work History</h3> <div className="space-y-4">{workExperiences.map((exp,i) =>(<div key={i}> <div className="flex justify-between"><p className="font-bold text-gray-900 text-sm">{exp.jobTitle}</p><p className="text-xs text-gray-500">{formatDate(exp.startMonth, exp.startYear)} – {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p></div> <p className="text-sm text-gray-600 italic mb-1">{exp.company}</p> {exp.responsibilities && <BulletList text={exp.responsibilities} className="text-xs text-gray-700 leading-relaxed" />}
          {exp.achievements && <div className="mt-2 pt-1 border-t border-gray-200"><p className="text-xs font-bold text-gray-900 mb-1">Achievements:</p><BulletList text={exp.achievements} className="text-xs text-gray-700" /></div>}
</div>))}</div>
</div>)}
      {projects.length >0 && (<div className="mb-4 pb-3 border-b border-gray-300"> <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-3" style={{fontVariant:'small-caps', letterSpacing:'0.15em'}}>Projects</h3> <div className="space-y-2">{projects.map((proj,i) =>(<div key={i}><p className="font-bold text-gray-900 text-sm">{proj.name}</p>{proj.description && <p className="text-sm text-gray-700 mt-0.5">{proj.description}</p>}{proj.link && <p className="text-xs text-blue-600 mt-0.5"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div>
</div>)}
      {skillsList.length >0 && (<div className="mb-4 pb-3 border-b border-gray-300"> <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2" style={{fontVariant:'small-caps', letterSpacing:'0.15em'}}>Skills</h3> <div className="space-y-1">{skillsList.map((sk,i) =>(<div key={i} className="flex items-center justify-between"><div className="flex items-center gap-1 text-sm text-gray-700">{sk.name}</div><div className="flex gap-1">{[1,2,3,4,5].map(n =><span key={n} className={`w-2 h-2 rounded-full ${sk.level>=n?'bg-gray-700':'bg-gray-200'}`}></span>)}</div></div>))}</div>
</div>)}
      {certifications.length >0 && (<div className="mb-4 pb-3 border-b border-gray-300"> <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2" style={{fontVariant:'small-caps', letterSpacing:'0.15em'}}>Certifications</h3> <div className="space-y-1">{certifications.map((cert,i) =>(<p key={i} className="text-sm text-gray-700">• {cert.name}{cert.issuer ? ` – ${cert.issuer}` : ''}{cert.year ? ` (${cert.year})` : ''}</p>))}</div>
</div>)}
      {educationList.length >0 && (<div className="mb-4 pb-3 border-b border-gray-300"> <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2" style={{fontVariant:'small-caps', letterSpacing:'0.15em'}}>Education</h3> <div className="space-y-2">{educationList.map((edu,i) =>(<div key={i}><p className="font-bold text-gray-900 text-sm">{edu.degree}</p><p className="text-sm text-gray-600">{edu.school} · {formatDate(edu.startMonth, edu.startYear)} – {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div>
</div>)}
      {languages.length >0 && (<div className="mb-4 pb-3 border-b border-gray-300"> <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2" style={{fontVariant:'small-caps', letterSpacing:'0.15em'}}>Languages</h3> <div className="flex flex-wrap gap-4">{languages.map((lang,i) =>(<div key={i} className="flex items-center gap-2"><span className="text-sm text-gray-800">{lang.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n =><span key={n} className={`w-2.5 h-2.5 rounded-full border ${lang.level>=n?'bg-gray-700 border-gray-700':'border-gray-300'}`}></span>)}</div></div>))}</div>
</div>)}
      {hobbies && (<div className="mb-4"> <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-2" style={{fontVariant:'small-caps', letterSpacing:'0.15em'}}>Interests</h3> <p className="text-sm text-gray-700">{hobbies}</p>
</div>)}
</div>
</div>
)

//  TEMPLATE 12: Coral Modern 
const CoralTemplate = () =>(
  <div className="p-8 bg-white rounded-xl shadow-xl border border-gray-200"> <div className="mb-6"> <button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-rose-600 transition shadow-lg flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}> {isDownloading ? 'Generating PDF...' : 'Download PDF'}
</button>
</div> <div id="resume-preview"> {/* Header */}
      <div className="flex items-center gap-4 mb-5 pb-5 border-b-2 border-orange-200"> {photo
          ? <img src={photo} alt="Profile" className="w-14 h-14 rounded-lg object-cover flex-shrink-0 shadow-md border-2 border-orange-200" /> : <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">{name ? name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : 'YN'}</div> }
        <div> <h3 className="text-2xl font-bold text-gray-900">{name || 'Your Name'}</h3> <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500"> {email && <span>{email}</span>}
            {phone && <span>{phone}</span>}
            {location && <span>{location}</span>}
            {websiteLinks.linkedin && <span className="text-orange-600">{websiteLinks.linkedin}</span>}
            {websiteLinks.github && <span className="text-orange-600">{websiteLinks.github}</span>}
            {websiteLinks.portfolio && <span className="text-orange-600">{websiteLinks.portfolio}</span>}
</div>
</div>
</div> {summary && (<div className="mb-5 text-sm text-gray-600 leading-relaxed">{summary}</div>)}
      {workExperiences.length >0 && (<div className="mb-5"> <h3 className="text-base font-bold text-orange-600 mb-3 flex items-center gap-2">Work History</h3> <div className="space-y-4">{workExperiences.map((exp,i) =>(<div key={i} className="pl-3 border-l-2 border-orange-200"> <div className="flex justify-between items-start"><p className="font-bold text-gray-900 text-sm">{exp.jobTitle}</p><span className="text-xs text-gray-400 whitespace-nowrap ml-2">{formatDate(exp.startMonth, exp.startYear)} – {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</span></div> <p className="text-xs text-orange-600 italic mb-1">{exp.company}</p> {exp.responsibilities && <BulletList text={exp.responsibilities} className="text-xs text-gray-700 leading-relaxed" />}
          {exp.achievements && <div className="mt-2 pt-1 border-t border-orange-100"><p className="text-xs font-bold text-gray-900 mb-1">Achievements:</p><BulletList text={exp.achievements} className="text-xs text-gray-700" /></div>}
</div>))}</div>
</div>)}
      {projects.length >0 && (<div className="mb-5"> <h3 className="text-base font-bold text-orange-600 mb-3 flex items-center gap-2">Projects</h3> <div className="space-y-2">{projects.map((proj,i) =>(<div key={i} className="pl-3 border-l-2 border-orange-200"><p className="font-bold text-gray-900 text-sm">{proj.name}</p>{proj.description && <p className="text-sm text-gray-700 mt-0.5">{proj.description}</p>}{proj.link && <p className="text-xs text-orange-500 mt-0.5"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}</div>))}</div>
</div>)}
      {skillsList.length >0 && (<div className="mb-5"> <h3 className="text-base font-bold text-orange-600 mb-3 flex items-center gap-2">Skills</h3> <div className="space-y-2">{skillsList.map((sk,i) =>(<div key={i} className="flex items-center justify-between pl-3 border-l-2 border-orange-200"><span className="text-sm font-medium text-gray-800">{sk.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n =><span key={n} className={`w-3 h-3 rounded-full ${sk.level>=n?'bg-orange-400':'bg-gray-200'}`}></span>)}</div></div>))}</div>
</div>)}
      {certifications.length >0 && (<div className="mb-5"> <h3 className="text-base font-bold text-orange-600 mb-3 flex items-center gap-2">Certifications</h3> <div className="space-y-1">{certifications.map((cert,i) =>(<p key={i} className="text-sm text-gray-700 pl-3 border-l-2 border-orange-100">• {cert.name}{cert.issuer ? ` – ${cert.issuer}` : ''}{cert.year ? ` (${cert.year})` : ''}</p>))}</div>
</div>)}
      {educationList.length >0 && (<div className="mb-5"> <h3 className="text-base font-bold text-orange-600 mb-3 flex items-center gap-2">Education</h3> <div className="space-y-2">{educationList.map((edu,i) =>(<div key={i} className="pl-3 border-l-2 border-orange-200"><p className="font-bold text-gray-900 text-sm">{edu.degree}</p><p className="text-sm text-orange-600 italic">{edu.school} · {formatDate(edu.startMonth, edu.startYear)} – {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}</p></div>))}</div>
</div>)}
      {languages.length >0 && (<div className="mb-5"> <h3 className="text-base font-bold text-orange-600 mb-3 flex items-center gap-2">Languages</h3> <div className="flex flex-wrap gap-4">{languages.map((lang,i) =>(<div key={i} className="flex items-center gap-2"><span className="text-sm font-medium text-gray-800">{lang.name}</span><div className="flex gap-1">{[1,2,3,4,5].map(n =><span key={n} className={`w-3 h-3 rounded-full ${lang.level>=n?'bg-orange-400':'bg-gray-200'}`}></span>)}</div></div>))}</div>
</div>)}
      {hobbies && (<div className="mb-5"> <h3 className="text-base font-bold text-orange-600 mb-3 flex items-center gap-2">Hobbies & Interests</h3> <div className="flex flex-wrap gap-2">{hobbies.split(',').map((h,i) =>h.trim() && <span key={i} className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-sm border border-rose-200">{h.trim()}</span>)}</div>
</div>)}
</div>
</div>
)

//  TEMPLATE 13: AMBER 
const AmberTemplate = () =>(
  <div className="bg-white shadow-2xl overflow-hidden font-sans"> <div className="p-6 pb-4"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-amber-700 hover:to-yellow-700 transition shadow-lg flex items-center justify-center ${isDownloading?'opacity-50 cursor-not-allowed':''}`}>{isDownloading?'Generating PDF...':'Download PDF'}</button></div> <div id="resume-preview" className="bg-white"> <div className="bg-amber-600 px-8 py-6 flex items-center gap-6"> {photo?<img src={photo} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-amber-300 shadow-lg flex-shrink-0"/>:<div className="w-24 h-24 rounded-full bg-amber-500 border-4 border-amber-300 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">{name?name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase():'YN'}</div>}
        <div><h1 className="text-4xl font-bold text-white tracking-tight">{name||'Your Name'}</h1>{workExperiences.length>0&&<p className="text-amber-200 text-base mt-1 font-medium">{workExperiences[0].jobTitle}</p>}</div>
</div> <div className="bg-gray-50 border-b border-gray-200 px-8 py-3 flex flex-wrap gap-4 text-sm text-gray-700"> <span className="font-bold text-amber-700 border-r border-gray-300 pr-4">Contact</span> {email&&<span>{email}</span>}{phone&&<span>{phone}</span>}{location&&<span>{location}</span>}
        {websiteLinks.linkedin&&<a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">{websiteLinks.linkedin}</a>}
        {websiteLinks.github&&<a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">{websiteLinks.github}</a>}
        {websiteLinks.portfolio&&<a href={websiteLinks.portfolio} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">{websiteLinks.portfolio}</a>}
</div> <div className="px-8 py-6"> {summary&&<p className="text-gray-700 text-sm leading-relaxed mb-6 border-l-4 border-amber-400 pl-4 italic">{summary}</p>}
        {workExperiences.length>0&&(<div className="mb-6"><h2 className="text-base font-bold text-amber-600 mb-3 border-b border-amber-200 pb-1 uppercase tracking-wide">Work History</h2><div className="space-y-4">{workExperiences.map((exp,i)=>(<div key={i} className="flex gap-5"><div className="w-28 flex-shrink-0 text-xs text-gray-500 pt-0.5 leading-relaxed">{formatDate(exp.startMonth,exp.startYear)} -<br/>{formatDate(exp.endMonth,exp.endYear,exp.isPresent)}</div><div className="flex-1"><p className="font-bold text-gray-900 text-sm">{exp.jobTitle}</p><p className="text-amber-700 text-xs italic mb-1">{exp.company}</p>{exp.responsibilities && <BulletList text={exp.responsibilities} className="text-xs text-gray-700 leading-relaxed" />}{exp.achievements&&<div className="mt-1 pt-1 border-t border-amber-100"><p className="text-xs font-bold text-gray-900 mb-1">Achievements:</p><BulletList text={exp.achievements} className="text-xs text-gray-700" /></div>}</div></div>))}</div></div>)}
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

//  TEMPLATE 14: SERIF2 
const Serif2Template = () =>(
  <div className="bg-white shadow-2xl overflow-hidden"> <div className="p-6 pb-4"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gray-800 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-900 transition shadow-lg flex items-center justify-center ${isDownloading?'opacity-50 cursor-not-allowed':''}`}>{isDownloading?'Generating PDF...':'Download PDF'}</button></div> <div id="resume-preview" className="bg-white px-10 py-8"> <div className="border-t-2 border-b-2 border-gray-800 py-4 mb-6 flex items-center gap-6"> {photo?<img src={photo} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 flex-shrink-0"/>:<div className="w-20 h-20 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center text-xl font-bold text-gray-600 flex-shrink-0">{name?name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase():'YN'}</div>}
        <div className="flex-1 text-center"> <h1 className="text-3xl font-bold text-gray-900 tracking-widest uppercase" style={{fontVariant:'small-caps'}}>{name||'Your Name'}</h1> <p className="text-sm text-gray-500 mt-2">{[email, phone, location ? ` ${location}` : ''].filter(Boolean).join(' • ')}</p> <div className="flex justify-center gap-4 mt-1 text-xs">{websiteLinks.linkedin&&<a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline">{websiteLinks.linkedin}</a>}{websiteLinks.github&&<a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline">{websiteLinks.github}</a>}</div>
</div>
</div> {summary&&(<div className="mb-6"><h2 className="text-sm font-bold text-gray-700 text-center tracking-widest uppercase mb-3 flex items-center gap-2">Professional Summary</h2><p className="text-sm text-gray-700 leading-relaxed">{summary}</p></div>)}
      {workExperiences.length>0&&(<div className="mb-6"><h2 className="text-sm font-bold text-gray-700 text-center tracking-widest uppercase mb-4 flex items-center gap-2">Work History</h2><div className="space-y-4">{workExperiences.map((exp,i)=>(<div key={i}><div className="flex justify-between items-baseline mb-0.5"><p className="font-bold text-gray-900 text-sm">{exp.jobTitle}, <span className="text-xs font-normal text-gray-500">{formatDate(exp.startMonth,exp.startYear)} - {formatDate(exp.endMonth,exp.endYear,exp.isPresent)}</span></p></div><p className="font-bold text-gray-700 text-xs mb-1">{exp.company}</p>{exp.responsibilities && <BulletList text={exp.responsibilities} className="text-xs text-gray-700 leading-relaxed" />}{exp.achievements&&<div className="mt-1 pl-2"><p className="text-xs font-bold text-gray-900 mb-1">Achievements:</p><BulletList text={exp.achievements} className="text-xs text-gray-700" /></div>}</div>))}</div></div>)}
      {skillsList.length>0&&(<div className="mb-6"><h2 className="text-sm font-bold text-gray-700 text-center tracking-widest uppercase mb-4 flex items-center gap-2">Skills</h2><div className="grid grid-cols-3 gap-x-6 gap-y-3">{skillsList.map((sk,i)=>(<div key={i}><p className="text-xs font-medium text-gray-800 mb-1">{sk.name}</p><div className="flex gap-0.5">{[1,2,3,4,5].map(n=><div key={n} className={`h-2 flex-1 rounded-sm ${sk.level>=n?'bg-gray-600':'bg-gray-200'}`}></div>)}</div></div>))}</div></div>)}
      {certifications.length>0&&(<div className="mb-6"><h2 className="text-sm font-bold text-gray-700 text-center tracking-widest uppercase mb-3 flex items-center gap-2">Certifications</h2><ul className="space-y-1">{certifications.map((cert,i)=>(<li key={i} className="flex gap-2 text-xs text-gray-700"><span>•</span><span><span className="font-semibold">{cert.name}</span>{cert.issuer&&` — ${cert.issuer}`}{cert.year&&` (${cert.year})`}</span></li>))}</ul></div>)}
      {educationList.length>0&&(<div className="mb-6"><h2 className="text-sm font-bold text-gray-700 text-center tracking-widest uppercase mb-4 flex items-center gap-2">Education</h2><div className="space-y-3">{educationList.map((edu,i)=>(<div key={i}><div className="flex justify-between"><p className="font-bold text-gray-900 text-sm">{edu.degree}</p><p className="text-xs text-gray-500">{formatDate(edu.endMonth,edu.endYear,edu.isPresent)}</p></div><p className="font-bold text-gray-700 text-xs">{edu.school}</p>{edu.score&&<p className="text-xs text-gray-500">{edu.score}</p>}</div>))}</div></div>)}
      {projects.length>0&&(<div className="mb-6"><h2 className="text-sm font-bold text-gray-700 text-center tracking-widest uppercase mb-3 flex items-center gap-2">Projects</h2><div className="space-y-2">{projects.map((proj,i)=>(<div key={i}><p className="font-bold text-gray-900 text-sm">{proj.name}</p>{proj.description&&<p className="text-xs text-gray-700">{proj.description}</p>}{proj.link&&<a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:underline">{proj.link}</a>}</div>))}</div></div>)}
      {languages.length>0&&(<div className="mb-6"><h2 className="text-sm font-bold text-gray-700 text-center tracking-widest uppercase mb-4 flex items-center gap-2">Languages</h2><div className="grid grid-cols-3 gap-x-6 gap-y-3">{languages.map((lang,i)=>(<div key={i}><p className="text-xs font-medium text-gray-800 mb-1">{lang.name}</p><div className="flex gap-0.5">{[1,2,3,4,5].map(n=><div key={n} className={`h-2 flex-1 rounded-sm ${lang.level>=n?'bg-gray-500':'bg-gray-200'}`}></div>)}</div><p className="text-xs text-gray-400 mt-0.5">{['','Beginner','Elementary','Intermediate','Advanced','Expert'][lang.level]}</p></div>))}</div></div>)}
      {hobbies&&(<div><h2 className="text-sm font-bold text-gray-700 text-center tracking-widest uppercase mb-2 flex items-center gap-2">Hobbies</h2><p className="text-xs text-gray-700 text-center">{hobbies}</p></div>)}
</div>
</div>
)

//  TEMPLATE 15: HEXAGON 
const HexagonTemplate = () =>(
  <div className="bg-white shadow-2xl overflow-hidden"> <div className="p-6 pb-4"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-rose-600 hover:to-pink-600 transition shadow-lg flex items-center justify-center ${isDownloading?'opacity-50 cursor-not-allowed':''}`}>{isDownloading?'Generating PDF...':'Download PDF'}</button></div> <div id="resume-preview" className="bg-white px-10 py-8"> <div className="flex items-center gap-6 mb-5"> <div className="w-16 h-16 bg-rose-400 flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)'}}>{name?name.split(' ').filter(Boolean).slice(0,2).map(n=>n[0]).join('').toUpperCase():'YN'}</div> <div><h1 className="text-3xl font-bold text-rose-500">{name||'Your Name'}</h1><div className="flex flex-wrap gap-4 mt-1 text-xs text-gray-500">{email&&<span>{email}</span>}{phone&&<span>{phone}</span>}{location&&<span>{location}</span>}{location&&<span>{location}</span>}{websiteLinks.linkedin&&<a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">{websiteLinks.linkedin}</a>}{websiteLinks.github&&<a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">{websiteLinks.github}</a>}</div></div>
</div> {summary&&<p className="text-sm text-gray-700 leading-relaxed mb-6">{summary}</p>}
      {workExperiences.length>0&&(<div className="mb-6"><h2 className="text-base font-bold text-rose-500 mb-3 border-b border-rose-200 pb-1">Work History</h2><div className="space-y-4">{workExperiences.map((exp,i)=>(<div key={i} className="flex gap-5"><div className="w-24 flex-shrink-0 text-xs text-gray-500 leading-relaxed">{formatDate(exp.startMonth,exp.startYear)} -<br/>{formatDate(exp.endMonth,exp.endYear,exp.isPresent)}</div><div className="flex-1"><p className="font-bold text-gray-900 text-sm">{exp.jobTitle}</p><p className="text-rose-400 text-xs italic mb-1">{exp.company}</p>{exp.responsibilities && <BulletList text={exp.responsibilities} className="text-xs text-gray-700 leading-relaxed" />}{exp.achievements&&<div className="mt-1 pt-1 border-t border-rose-100"><p className="text-xs font-bold text-gray-900 mb-1">Achievements:</p><BulletList text={exp.achievements} className="text-xs text-gray-700" /></div>}</div></div>))}</div></div>)}
      {skillsList.length>0&&(<div className="mb-6"><h2 className="text-base font-bold text-rose-500 mb-3 border-b border-rose-200 pb-1">Skills</h2><div className="grid grid-cols-3 gap-x-6 gap-y-3">{skillsList.map((sk,i)=>(<div key={i}><p className="text-xs font-medium text-gray-800 mb-1">{sk.name}</p><div className="flex gap-1">{[1,2,3,4,5].map(n=><span key={n} className={`w-3 h-3 rounded-full ${sk.level>=n?'bg-rose-400':'bg-gray-200'}`}></span>)}</div></div>))}</div></div>)}
      {certifications.length>0&&(<div className="mb-6"><h2 className="text-base font-bold text-rose-500 mb-3 border-b border-rose-200 pb-1">Certifications</h2><ul className="space-y-1">{certifications.map((cert,i)=>(<li key={i} className="flex gap-2 text-xs text-gray-700"><span className="text-rose-400">•</span><span><span className="font-semibold">{cert.name}</span>{cert.issuer&&` — ${cert.issuer}`}{cert.year&&` (${cert.year})`}</span></li>))}</ul></div>)}
      {educationList.length>0&&(<div className="mb-6"><h2 className="text-base font-bold text-rose-500 mb-3 border-b border-rose-200 pb-1">Education</h2><div className="space-y-3">{educationList.map((edu,i)=>(<div key={i} className="flex gap-5"><div className="w-24 flex-shrink-0 text-xs text-gray-500">{formatDate(edu.endMonth,edu.endYear,edu.isPresent)}</div><div><p className="font-bold text-gray-900 text-sm">{edu.degree}</p><p className="text-rose-400 text-xs italic">{edu.school}</p>{edu.score&&<p className="text-xs text-gray-500">{edu.score}</p>}</div></div>))}</div></div>)}
      {projects.length>0&&(<div className="mb-6"><h2 className="text-base font-bold text-rose-500 mb-3 border-b border-rose-200 pb-1">Projects</h2><div className="space-y-2">{projects.map((proj,i)=>(<div key={i}><p className="font-bold text-gray-900 text-sm">{proj.name}</p>{proj.description&&<p className="text-xs text-gray-700">{proj.description}</p>}{proj.link&&<a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-rose-500 hover:underline">{proj.link}</a>}</div>))}</div></div>)}
      {languages.length>0&&(<div className="mb-6"><h2 className="text-base font-bold text-rose-500 mb-3 border-b border-rose-200 pb-1">Languages</h2><div className="grid grid-cols-3 gap-x-6 gap-y-3">{languages.map((lang,i)=>(<div key={i}><p className="text-xs font-medium text-gray-800 mb-1">{lang.name}</p><div className="flex gap-1">{[1,2,3,4,5].map(n=><span key={n} className={`w-3 h-3 rounded-full ${lang.level>=n?'bg-rose-400':'bg-gray-200'}`}></span>)}</div><p className="text-xs text-gray-400 mt-0.5">{['','Beginner','Elementary','Intermediate','Advanced','Expert'][lang.level]}</p></div>))}</div></div>)}
      {hobbies&&(<div><h2 className="text-base font-bold text-rose-500 mb-2 border-b border-rose-200 pb-1">Hobbies & Interests</h2><div className="flex flex-wrap gap-2">{hobbies.split(',').map((h,i)=>h.trim()&&<span key={i} className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs border border-rose-200">{h.trim()}</span>)}</div></div>)}
</div>
</div>
)

//  TEMPLATE 16: NAVY 
const NavyTemplate = () =>(
  <div className="bg-white shadow-2xl overflow-hidden"> <div className="p-6 pb-4"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-blue-950 hover:to-indigo-950 transition shadow-lg flex items-center justify-center ${isDownloading?'opacity-50 cursor-not-allowed':''}`}>{isDownloading?'Generating PDF...':'Download PDF'}</button></div> <div id="resume-preview" className="bg-white px-8 py-8"> <div className="flex items-start gap-6 mb-6"> {photo?<img src={photo} alt="Profile" className="w-24 h-24 object-cover flex-shrink-0 border-2 border-blue-900"/>:<div className="w-24 h-24 bg-blue-100 border-2 border-blue-900 flex items-center justify-center text-2xl font-bold text-blue-900 flex-shrink-0">{name?name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase():'YN'}</div>}
        <div className="flex-1"><h1 className="text-3xl font-bold text-blue-900 mb-2">{name||'Your Name'}</h1><div className="grid grid-cols-2 gap-1 text-xs text-gray-600">{email&&<span>{email}</span>}{phone&&<span>{phone}</span>}{location&&<span>{location}</span>}{websiteLinks.linkedin&&<a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">{websiteLinks.linkedin}</a>}{websiteLinks.github&&<a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">{websiteLinks.github}</a>}</div></div>
</div> {summary&&<p className="text-sm text-gray-700 leading-relaxed mb-6 border-l-4 border-blue-900 pl-3">{summary}</p>}
      {educationList.length>0&&(<div className="mb-6"><h2 className="flex items-center gap-2 text-sm font-bold text-white bg-blue-900 px-3 py-1.5 mb-3 rounded">Education</h2><div className="space-y-3">{educationList.map((edu,i)=>(<div key={i} className="flex gap-5"><div className="w-20 flex-shrink-0 text-xs text-gray-500">{formatDate(edu.endMonth,edu.endYear,edu.isPresent)}</div><div><p className="font-bold text-gray-900 text-sm">{edu.degree}</p><p className="text-blue-800 text-xs italic">{edu.school}</p>{edu.score&&<p className="text-xs text-gray-500">{edu.score}</p>}</div></div>))}</div></div>)}
      {skillsList.length>0&&(<div className="mb-6"><h2 className="flex items-center gap-2 text-sm font-bold text-white bg-blue-900 px-3 py-1.5 mb-3 rounded">Skills</h2><div className="grid grid-cols-3 gap-x-6 gap-y-3">{skillsList.map((sk,i)=>(<div key={i}><p className="text-xs font-medium text-gray-800 mb-1">{sk.name}</p><div className="flex gap-0.5">{[1,2,3,4,5].map(n=><div key={n} className={`h-2.5 w-5 ${sk.level>=n?'bg-blue-900':'bg-gray-200'}`}></div>)}</div></div>))}</div></div>)}
      {workExperiences.length>0&&(<div className="mb-6"><h2 className="flex items-center gap-2 text-sm font-bold text-white bg-blue-900 px-3 py-1.5 mb-3 rounded">Work History</h2><div className="space-y-4">{workExperiences.map((exp,i)=>(<div key={i} className="flex gap-5"><div className="w-20 flex-shrink-0 text-xs text-gray-500 leading-relaxed">{formatDate(exp.startMonth,exp.startYear)} -<br/>{formatDate(exp.endMonth,exp.endYear,exp.isPresent)}</div><div className="flex-1"><p className="font-bold text-gray-900 text-sm">{exp.jobTitle}</p><p className="text-blue-800 text-xs italic mb-1">{exp.company}</p>{exp.responsibilities && <BulletList text={exp.responsibilities} className="text-xs text-gray-700 leading-relaxed" />}{exp.achievements&&<div className="mt-1 pt-1 border-t border-blue-100"><p className="text-xs font-bold text-gray-900 mb-1">Achievements:</p><BulletList text={exp.achievements} className="text-xs text-gray-700" /></div>}</div></div>))}</div></div>)}
      {projects.length>0&&(<div className="mb-6"><h2 className="flex items-center gap-2 text-sm font-bold text-white bg-blue-900 px-3 py-1.5 mb-3 rounded">Projects</h2><div className="space-y-2">{projects.map((proj,i)=>(<div key={i}><p className="font-bold text-gray-900 text-sm">{proj.name}</p>{proj.description&&<p className="text-xs text-gray-700">{proj.description}</p>}{proj.link&&<a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 hover:underline">{proj.link}</a>}</div>))}</div></div>)}
      {certifications.length>0&&(<div className="mb-6"><h2 className="flex items-center gap-2 text-sm font-bold text-white bg-blue-900 px-3 py-1.5 mb-3 rounded">Certifications</h2><ul className="space-y-1">{certifications.map((cert,i)=>(<li key={i} className="flex gap-2 text-xs text-gray-700"><span className="text-blue-800">•</span><span><span className="font-semibold">{cert.name}</span>{cert.issuer&&` — ${cert.issuer}`}{cert.year&&` (${cert.year})`}</span></li>))}</ul></div>)}
      {languages.length>0&&(<div className="mb-6"><h2 className="flex items-center gap-2 text-sm font-bold text-white bg-blue-900 px-3 py-1.5 mb-3 rounded">Languages</h2><div className="grid grid-cols-3 gap-x-6 gap-y-3">{languages.map((lang,i)=>(<div key={i}><p className="text-xs font-medium text-gray-800 mb-1">{lang.name}</p><div className="flex gap-0.5">{[1,2,3,4,5].map(n=><div key={n} className={`h-2.5 w-5 ${lang.level>=n?'bg-blue-900':'bg-gray-200'}`}></div>)}</div></div>))}</div></div>)}
      {hobbies&&(<div><h2 className="flex items-center gap-2 text-sm font-bold text-white bg-blue-900 px-3 py-1.5 mb-3 rounded">Hobbies</h2><p className="text-xs text-gray-700">{hobbies}</p></div>)}
</div>
</div>
)

//  TEMPLATE 17: BLUE SIDEBAR 
const BlueSidebarTemplate = () =>(
  <div className="bg-white shadow-2xl overflow-hidden"> <div className="p-6 pb-4"><button onClick={handleDownloadClick} disabled={isDownloading} className={`w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-cyan-600 transition shadow-lg flex items-center justify-center ${isDownloading?'opacity-50 cursor-not-allowed':''}`}>{isDownloading?'Generating PDF...':'Download PDF'}</button></div> <div id="resume-preview" style={{overflow:"hidden", width:"100%"}}> <div style={{float:"left", width:"33%"}} className="bg-blue-500 text-white p-5"> {photo?<img src={photo} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white mx-auto mb-4 shadow-lg"/>:<div className="w-24 h-24 rounded-full bg-blue-400 border-4 border-white mx-auto mb-4 flex items-center justify-center text-2xl font-bold">{name?name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase():'YN'}</div>}
        <h1 className="text-lg font-bold text-white text-center mb-5 leading-tight">{name||'Your Name'}</h1> <div className="mb-5"><h3 className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2 border-b border-blue-400 pb-1">Contact</h3><div className="space-y-1.5 text-xs">{email&&<p className="break-all text-blue-100">{email}</p>}{phone&&<p className="text-blue-100">{phone}</p>}{location&&<p className="text-xs text-blue-100">{location}</p>}{websiteLinks.linkedin&&<a href={websiteLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:underline break-all block">{websiteLinks.linkedin}</a>}{websiteLinks.github&&<a href={websiteLinks.github} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:underline break-all block">{websiteLinks.github}</a>}</div></div> {skillsList.length>0&&(<div className="mb-5"><h3 className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2 border-b border-blue-400 pb-1">Skills</h3><div className="space-y-2">{skillsList.map((sk,i)=>(<div key={i}><span className="text-xs text-white font-medium">{sk.name}</span><div className="h-1.5 bg-blue-400 rounded-full mt-0.5"><div className="h-1.5 bg-white rounded-full" style={{width:`${sk.level*20}%`}}></div></div></div>))}</div></div>)}
        {languages.length>0&&(<div className="mb-5"><h3 className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2 border-b border-blue-400 pb-1">Languages</h3><div className="space-y-2">{languages.map((lang,i)=>(<div key={i}><span className="text-xs text-white font-medium">{lang.name}</span><div className="flex gap-0.5 mt-0.5">{[1,2,3,4,5].map(n=><span key={n} className={`w-2.5 h-2.5 rounded-full ${lang.level>=n?'bg-white':'bg-blue-400'}`}></span>)}</div></div>))}</div></div>)}
        {hobbies&&(<div><h3 className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-2 border-b border-blue-400 pb-1">Interests</h3><div className="flex flex-wrap gap-1">{hobbies.split(',').map((h,i)=>h.trim()&&<span key={i} className="text-xs bg-blue-400 text-white px-2 py-0.5 rounded-full">{h.trim()}</span>)}</div></div>)}
</div> <div style={{float:"left", width:"67%"}} className="p-6"> {summary&&<p className="text-sm text-gray-700 leading-relaxed mb-5">{summary}</p>}
        {workExperiences.length>0&&(<div className="mb-5"><h2 className="text-base font-bold text-blue-500 mb-3 border-b-2 border-blue-200 pb-1 uppercase tracking-wide">Work History</h2><div className="space-y-4">{workExperiences.map((exp,i)=>(<div key={i} className="flex gap-4"><div className="w-20 flex-shrink-0 text-xs text-gray-500 leading-relaxed">{formatDate(exp.startMonth,exp.startYear)} -<br/>{formatDate(exp.endMonth,exp.endYear,exp.isPresent)}</div><div className="flex-1"><p className="font-bold text-gray-900 text-sm">{exp.jobTitle}</p><p className="text-blue-500 text-xs italic mb-1">{exp.company}</p>{exp.responsibilities && <BulletList text={exp.responsibilities} className="text-xs text-gray-700 leading-relaxed" />}{exp.achievements&&<div className="mt-1 pt-1 border-t border-blue-100"><p className="text-xs font-bold text-gray-900 mb-1">Achievements:</p><BulletList text={exp.achievements} className="text-xs text-gray-700" /></div>}</div></div>))}</div></div>)}
        {certifications.length>0&&(<div className="mb-5"><h2 className="text-base font-bold text-blue-500 mb-3 border-b-2 border-blue-200 pb-1 uppercase tracking-wide">Certifications</h2><ul className="space-y-1">{certifications.map((cert,i)=>(<li key={i} className="flex gap-2 text-xs text-gray-700"><span className="text-blue-400">•</span><span><span className="font-semibold">{cert.name}</span>{cert.issuer&&` — ${cert.issuer}`}{cert.year&&` (${cert.year})`}</span></li>))}</ul></div>)}
        {educationList.length>0&&(<div className="mb-5"><h2 className="text-base font-bold text-blue-500 mb-3 border-b-2 border-blue-200 pb-1 uppercase tracking-wide">Education</h2><div className="space-y-3">{educationList.map((edu,i)=>(<div key={i} className="flex gap-4"><div className="w-20 flex-shrink-0 text-xs text-gray-500">{formatDate(edu.endMonth,edu.endYear,edu.isPresent)}</div><div><p className="font-bold text-gray-900 text-sm">{edu.degree}</p><p className="text-blue-500 text-xs italic">{edu.school}</p>{edu.score&&<p className="text-xs text-gray-500">{edu.score}</p>}</div></div>))}</div></div>)}
        {projects.length>0&&(<div className="mb-5"><h2 className="text-base font-bold text-blue-500 mb-3 border-b-2 border-blue-200 pb-1 uppercase tracking-wide">Projects</h2><div className="space-y-2">{projects.map((proj,i)=>(<div key={i}><p className="font-bold text-gray-900 text-sm">{proj.name}</p>{proj.description&&<p className="text-xs text-gray-700">{proj.description}</p>}{proj.link&&<a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">{proj.link}</a>}</div>))}</div></div>)}
</div>
</div>
</div>
)

  //  RENDER 
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"> {showPaymentModal && <PaymentModal />}

      <header className="bg-white shadow-sm border-b border-gray-200"> <div className="max-w-7xl mx-auto px-8 py-6"> <div className="flex items-center justify-between"> <div> <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1> <p className="text-sm text-gray-600 mt-1">Create your professional resume</p>
</div> <div className="flex items-center gap-3"> <span className="text-gray-700">Hi, {displayName}!</span> <button onClick={() =>{ setShowImport(true); setImportMsg(null); setImportPreview(null) }} className="px-4 py-2 bg-orange-50 text-orange-700 rounded-lg font-semibold hover:bg-orange-100 transition text-sm border border-orange-200">Import CV</button> <button onClick={() =>setShowTemplateSwitcher(true)} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-100 transition text-sm border border-indigo-200">Switch Template</button> <button onClick={handleATSCheck} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-100 transition text-sm border border-emerald-200">ATS Check</button> <button onClick={handleJobMatch} className="px-4 py-2 bg-violet-50 text-violet-700 rounded-lg font-semibold hover:bg-violet-100 transition text-sm border border-violet-200">Job Match</button> <button onClick={handleOpenCloudPanel} className="px-4 py-2 bg-sky-50 text-sky-700 rounded-lg font-semibold hover:bg-sky-100 transition text-sm border border-sky-200">Cloud Saves</button> <button onClick={() =>navigate('/cover-letter')} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold hover:bg-blue-100 transition text-sm border border-blue-200">Cover Letter</button> <button onClick={() =>{ setShowTuneUp(true); setTuneUpMsg(null) }} className="px-4 py-2 bg-rose-50 text-rose-700 rounded-lg font-semibold hover:bg-rose-100 transition text-sm border border-rose-200">Tune-Up</button> <button onClick={handleSave} className="px-5 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition text-sm border border-green-200">Save</button> <button onClick={handleClearAll} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition text-sm border border-red-200">Clear All</button> <button onClick={() =>{ if (window.confirm('Log out?')) { signOut(); navigate('/') } }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition text-sm">Log Out</button>
</div>
</div>
</div>
</header> <div className="max-w-7xl mx-auto px-8 py-8"> <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> {/* LEFT: FORM */}
          <div className="space-y-6"> {/*  SECTION PROGRESS BAR  */}
            {(() =>{
              const sections = [
                { label: 'Personal', icon: '', heading: 'Personal Information', done: name.trim().length >0 && email.trim().length >0 },
                { label: 'Summary',  icon: '', heading: 'Professional Summary',  done: summary.trim().length >= 50 },
                { label: 'Experience', icon: '', heading: 'Work Experience',      done: workExperiences.length >0 },
                { label: 'Education', icon: '', heading: 'Education',             done: educationList.length >0 },
                { label: 'Skills',   icon: '', heading: 'Skills',                done: skillsList.length >= 3 },
                { label: 'Projects', icon: '', heading: 'Projects',              done: projects.length >0 },
                { label: 'Extras',   icon: '', heading: 'Certifications',        done: certifications.length >0 || languages.length >0 || !!hobbies.trim() },
              ]
              const doneCount = sections.filter(s =>s.done).length
              const pct = Math.round((doneCount / sections.length) * 100)
              const scrollTo = (heading) =>{
                const el = [...document.querySelectorAll('h2')].find(h =>h.textContent.includes(heading))
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
              return (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3"> <div className="flex items-center justify-between mb-2"> <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Sections</p> <p className="text-xs text-gray-400">{doneCount}/{sections.length} complete</p>
</div> <div className="flex gap-1.5 flex-wrap"> {sections.map(s =>(
                      <button
                        key={s.label}
                        onClick={() =>scrollTo(s.heading)}
                        title={s.done ? `${s.label} ` : `${s.label} — click to fill`}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition border ${
                          s.done
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 hover:text-gray-600'
                        }`}
                      > <span>{s.icon}</span> <span>{s.label}</span> {s.done && <span className="text-emerald-500 font-bold">&#10003;</span>}
</button> ))}
</div> <div className="mt-2.5 h-1.5 bg-gray-100 rounded-full overflow-hidden"> <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
                      style={{width: `${pct}%`}}
                    />
</div>
</div> )
            })()}

            {/* Personal Info */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100"> <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center">Personal Information</h2> <div className="space-y-4"> <div> <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name <span className="text-red-500">*</span></label> <input type="text" value={name} onChange={e =>{ setName(e.target.value); setNameError('') }} placeholder="Enter your full name" className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${nameError ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} /> {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
</div> <div> <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label> <input type="email" value={email} onChange={e =>setEmail(e.target.value)} placeholder="your.email@example.com" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
</div> <div> <label className="block text-sm font-semibold mb-2 text-gray-700">Phone</label> <input type="tel" value={phone} onChange={e =>setPhone(e.target.value)} placeholder="+91 98765 43210" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
</div> <div> <label className="block text-sm font-semibold mb-2 text-gray-700">Location <span className="text-gray-400 font-normal">(optional)</span></label> <input type="text" value={location} onChange={e =>setLocation(e.target.value)} placeholder="e.g. Mumbai, India" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
</div> {/* Photo Upload - only shown for templates that display it */}
                {['sidebar', 'greensidebar', 'goldheader', 'classicserif', 'coral'].includes(selectedTemplate) && (
                <div> <label className="block text-sm font-semibold mb-2 text-gray-700"> Profile Photo <span className="text-gray-400 font-normal">(optional — shown in this template)</span>
</label> <div className="flex items-center gap-4"> {photo ? (
                      <div className="relative"> <img src={photo} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-blue-200 shadow-md" /> <button onClick={() =>setPhoto(null)}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 transition flex items-center justify-center shadow"> </button>
</div> ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm text-center leading-tight"> <span>No<br/>photo</span>
</div> )}
                    <div className="flex-1"> <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-indigo-600 transition shadow-sm"> {photo ? 'Change Photo' : 'Upload Photo'}
                        <input type="file" accept="image/*" className="hidden"
                          onChange={e =>{
                            const file = e.target.files[0]
                            if (!file) return
                            if (file.size >2 * 1024 * 1024) { alert('Please choose an image smaller than 2MB'); return }
                            const reader = new FileReader()
                            reader.onload = ev =>setPhoto(ev.target.result)
                            reader.readAsDataURL(file)
                          }} />
</label> <p className="text-xs text-gray-400 mt-1.5">JPG, PNG · Max 2MB · Will appear in resume</p>
</div>
</div>
</div> )}

</div>
</div> {/* Summary */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100"> <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center">Professional Summary</h2> <div> <label className="block text-sm font-semibold mb-2 text-gray-700">About You (2-3 sentences)</label> <textarea value={summary} onChange={e =>setSummary(e.target.value)} placeholder="e.g. Experienced software engineer with 3+ years building scalable web applications..." rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" /> <div className="flex items-center justify-between mt-2"> <p className="text-xs text-gray-500">Tip: Keep it concise and highlight your key strengths</p> <button onClick={generateSummary} disabled={isGeneratingSummary}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm text-white ${isGeneratingSummary ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'}`}> {isGeneratingSummary ? '⏳ Generating...' : ' Auto-generate from CV'}
</button>
</div>
</div>
</div> {/* Work Experience */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100"> <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center">Work Experience</h2> <div className="space-y-4"> {/* Company dropdown */}
                <SearchableDropdown
                  options={COMPANIES}
                  value={currentWork.company}
                  onChange={val =>{ setCurrentWork({ ...currentWork, company: val }); setWorkErrors({ ...workErrors, company: '' }) }}
                  placeholder="Select or search company..."
                  label="Company Name *"
                /> {workErrors.company && <p className="text-red-500 text-xs -mt-2">{workErrors.company}</p>}

                {/* Job title dropdown */}
                <JobRoleDropdown
                  value={currentWork.jobTitle}
                  onChange={val =>{ setCurrentWork({ ...currentWork, jobTitle: val }); setWorkErrors({ ...workErrors, jobTitle: '' }); setShowSuggestions(null) }}
                /> {workErrors.jobTitle && <p className="text-red-500 text-xs -mt-2">{workErrors.jobTitle}</p>}

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4"> <div> <MonthYearPicker
                      label="From"
                      monthValue={currentWork.startMonth}
                      yearValue={currentWork.startYear}
                      onMonthChange={val =>{ setCurrentWork({ ...currentWork, startMonth: val }); setDateError('') }}
                      onYearChange={val =>{ setCurrentWork({ ...currentWork, startYear: val }); setDateError('') }}
                      required
                    /> {(workErrors.startMonth || workErrors.startYear) && <p className="text-red-500 text-xs mt-1">Start date required</p>}
</div> <div> <MonthYearPicker
                      label="To"
                      monthValue={currentWork.endMonth}
                      yearValue={currentWork.endYear}
                      onMonthChange={val =>{
                        const updated = { ...currentWork, endMonth: val }
                        setCurrentWork(updated)
                        if (updated.startYear && updated.endYear && updated.startMonth && val) {
                          const startIdx = MONTHS.indexOf(updated.startMonth)
                          const endIdx = MONTHS.indexOf(val)
                          const startY = parseInt(updated.startYear)
                          const endY = parseInt(updated.endYear)
                          if (endY < startY || (endY === startY && endIdx < startIdx)) {
                            setDateError(' End date cannot be before start date')
                          } else setDateError('')
                        } else setDateError('')
                      }}
                      onYearChange={val =>{
                        const updated = { ...currentWork, endYear: val }
                        setCurrentWork(updated)
                        if (updated.startYear && val && updated.startMonth && updated.endMonth) {
                          const startIdx = MONTHS.indexOf(updated.startMonth)
                          const endIdx = MONTHS.indexOf(updated.endMonth)
                          const startY = parseInt(updated.startYear)
                          const endY = parseInt(val)
                          if (endY < startY || (endY === startY && endIdx < startIdx)) {
                            setDateError(' End date cannot be before start date')
                          } else setDateError('')
                        } else setDateError('')
                      }}
                      required
                      allowPresent
                      isPresent={currentWork.isPresent}
                      onPresentChange={val =>setCurrentWork({ ...currentWork, isPresent: val, endMonth: '', endYear: '' })}
                    /> {(workErrors.endMonth || workErrors.endYear) && <p className="text-red-500 text-xs mt-1">End date required</p>}
</div>
</div> {dateError && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">{dateError}</p>}

                {/* Responsibilities */}
                <div> <label className="block text-sm font-semibold mb-2 text-gray-700"> Key Responsibilities <span className="text-red-500">*</span>
</label> <textarea
                    value={currentWork.responsibilities}
                    onChange={e =>{ setCurrentWork({ ...currentWork, responsibilities: e.target.value }); setWorkErrors({ ...workErrors, responsibilities: '' }) }}
                    placeholder="• Describe your main duties and day-to-day responsibilities..."
                    rows="4"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${workErrors.responsibilities ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                  /> {workErrors.responsibilities && <p className="text-red-500 text-xs mt-1">{workErrors.responsibilities}</p>}
                  {currentWork.jobTitle && (
                    <button
                      onClick={() =>setShowSuggestions(showSuggestions === 'resp' ? false : 'resp')}
                      className="mt-2 text-sm text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1 transition"
                    > {showSuggestions === 'resp' ? 'Hide suggestions' : 'Suggest responsibilities'}
</button> )}
                  {showSuggestions === 'resp' && currentWork.jobTitle && (
                    <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-200"> <p className="text-sm font-semibold text-blue-800 mb-3"> Click to add for <em>{currentWork.jobTitle}</em>:
</p> <div className="space-y-2"> {getSuggestions(currentWork.jobTitle, roleContent).responsibilities.map((s, i) =>(
                          <button key={i} onClick={() =>applySuggestion(s, 'responsibilities')}
                            className="w-full text-left text-sm text-gray-700 hover:text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-lg transition border border-transparent hover:border-blue-200"> • {s}
</button> ))}
</div>
</div> )}
</div> {/* Achievements */}
                <div> <label className="block text-sm font-semibold mb-2 text-gray-700"> Key Achievements <span className="text-gray-400 font-normal">(optional but recommended)</span>
</label> <textarea
                    value={currentWork.achievements}
                    onChange={e =>setCurrentWork({ ...currentWork, achievements: e.target.value })}
                    placeholder="• Highlight measurable wins, impact, and accomplishments..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  /> {currentWork.jobTitle && (
                    <button
                      onClick={() =>setShowSuggestions(showSuggestions === 'ach' ? false : 'ach')}
                      className="mt-2 text-sm text-purple-600 font-semibold hover:text-purple-800 flex items-center gap-1 transition"
                    > {showSuggestions === 'ach' ? 'Hide suggestions' : 'Suggest achievements'}
</button> )}
                  {showSuggestions === 'ach' && currentWork.jobTitle && (
                    <div className="mt-3 p-4 bg-purple-50 rounded-xl border border-purple-200"> <p className="text-sm font-semibold text-purple-800 mb-3"> Click to add for <em>{currentWork.jobTitle}</em>:
</p> <div className="space-y-2"> {getSuggestions(currentWork.jobTitle, roleContent).achievements.map((s, i) =>(
                          <button key={i} onClick={() =>applySuggestion(s, 'achievements')}
                            className="w-full text-left text-sm text-gray-700 hover:text-purple-700 hover:bg-purple-100 px-3 py-2 rounded-lg transition border border-transparent hover:border-purple-200"> • {s}
</button> ))}
</div>
</div> )}
</div> <button onClick={addWorkExperience} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md"> {editingWorkIdx !== null ? ' Update Work Experience' : '+ Add Work Experience'}
</button> {workExperiences.length >0 && (
                  <div className="mt-4 space-y-3"> <h3 className="text-sm font-semibold text-gray-700">Added ({workExperiences.length}):</h3> {workExperiences.map((exp, i) =>(
                      <div key={i} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 flex justify-between items-start"> <div> <p className="font-semibold text-gray-900">{exp.jobTitle}</p> <p className="text-sm text-gray-600">{exp.company}</p> <p className="text-xs text-gray-500">{formatDate(exp.startMonth, exp.startYear)} - {formatDate(exp.endMonth, exp.endYear, exp.isPresent)}</p>
</div> <div className="flex gap-2"> <button onClick={() =>startEditWork(i)} className="text-blue-600 hover:text-blue-800 font-semibold text-sm hover:bg-blue-50 px-3 py-1 rounded transition">Edit</button> <button onClick={() =>deleteWorkExperience(i)} className="text-red-600 hover:text-red-800 font-semibold text-sm hover:bg-red-50 px-3 py-1 rounded transition">Delete</button>
</div>
</div> ))}
</div> )}
</div>
</div> {/* Education */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100"> <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center">Education</h2> <div className="space-y-4"> <SearchableDropdown
                  options={COLLEGES}
                  value={currentEducation.school}
                  onChange={val =>{ setCurrentEducation({ ...currentEducation, school: val }); setEduErrors({ ...eduErrors, school: '' }) }}
                  placeholder="Select or search college/university..."
                  label="College / University *"
                /> {eduErrors.school && <p className="text-red-500 text-xs -mt-2">{eduErrors.school}</p>}

                <SearchableDropdown
                  options={COURSES}
                  value={currentEducation.degree}
                  onChange={val =>{ setCurrentEducation({ ...currentEducation, degree: val }); setEduErrors({ ...eduErrors, degree: '' }) }}
                  placeholder="Select or search course/degree..."
                  label="Course / Degree *"
                /> {eduErrors.degree && <p className="text-red-500 text-xs -mt-2">{eduErrors.degree}</p>}

                <div className="grid grid-cols-2 gap-4"> <div> <MonthYearPicker
                      label="From"
                      monthValue={currentEducation.startMonth}
                      yearValue={currentEducation.startYear}
                      onMonthChange={val =>{ setCurrentEducation({ ...currentEducation, startMonth: val }); setEduDateError('') }}
                      onYearChange={val =>{ setCurrentEducation({ ...currentEducation, startYear: val }); setEduDateError('') }}
                      required
                    /> {(eduErrors.startMonth || eduErrors.startYear) && <p className="text-red-500 text-xs mt-1">Start date required</p>}
</div> <div> <MonthYearPicker
                      label="To"
                      monthValue={currentEducation.endMonth}
                      yearValue={currentEducation.endYear}
                      onMonthChange={val =>{
                        const updated = { ...currentEducation, endMonth: val }
                        setCurrentEducation(updated)
                        if (updated.startYear && updated.endYear && updated.startMonth && val) {
                          const startIdx = MONTHS.indexOf(updated.startMonth)
                          const endIdx = MONTHS.indexOf(val)
                          const startY = parseInt(updated.startYear)
                          const endY = parseInt(updated.endYear)
                          if (endY < startY || (endY === startY && endIdx < startIdx)) {
                            setEduDateError(' End date cannot be before start date')
                          } else setEduDateError('')
                        } else setEduDateError('')
                      }}
                      onYearChange={val =>{
                        const updated = { ...currentEducation, endYear: val }
                        setCurrentEducation(updated)
                        if (updated.startYear && val && updated.startMonth && updated.endMonth) {
                          const startIdx = MONTHS.indexOf(updated.startMonth)
                          const endIdx = MONTHS.indexOf(updated.endMonth)
                          const startY = parseInt(updated.startYear)
                          const endY = parseInt(val)
                          if (endY < startY || (endY === startY && endIdx < startIdx)) {
                            setEduDateError(' End date cannot be before start date')
                          } else setEduDateError('')
                        } else setEduDateError('')
                      }}
                      required
                      allowPresent
                      isPresent={currentEducation.isPresent}
                      onPresentChange={val =>setCurrentEducation({ ...currentEducation, isPresent: val, endMonth: '', endYear: '' })}
                      presentLabel="Currently studying here"
                    /> {(eduErrors.endMonth || eduErrors.endYear) && <p className="text-red-500 text-xs mt-1">End date required</p>}
</div>
</div> {eduDateError && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-200">{eduDateError}</p>}

                <div> <label className="block text-sm font-semibold mb-2 text-gray-700">Score / CGPA <span className="text-gray-400 font-normal">(optional)</span></label> <input type="text" value={currentEducation.score || ''} onChange={e =>{
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
</div> <button onClick={addEducation} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-md"> + Add Education
</button> {educationList.length >0 && (
                  <div className="mt-4 space-y-3"> <h3 className="text-sm font-semibold text-gray-700">Added ({educationList.length}):</h3> {educationList.map((edu, i) =>(
                      <div key={i} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 flex justify-between items-start"> <div> <p className="font-semibold text-gray-900">{edu.school}</p> <p className="text-sm text-gray-600">{edu.degree}</p> <p className="text-xs text-gray-500">{formatDate(edu.startMonth, edu.startYear)} - {formatDate(edu.endMonth, edu.endYear, edu.isPresent)}{edu.score ? ` · ${edu.score}` : ''}</p>
</div> <button onClick={() =>deleteEducation(i)} className="text-red-600 hover:text-red-800 font-semibold text-sm hover:bg-red-50 px-3 py-1 rounded transition">Delete</button>
</div> ))}
</div> )}
</div>
</div> {/* Projects */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100"> <div className="flex items-center justify-between mb-5"> <h2 className="text-2xl font-bold text-gray-800 flex items-center">Projects</h2> <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">Optional</span>
</div> <p className="text-sm text-gray-500 mb-4">Add personal, academic or work projects that showcase your skills.</p> <div className="space-y-4"> <div> <label className="block text-sm font-semibold mb-2 text-gray-700">Project Name</label> <input
                    type="text"
                    value={currentProject.name}
                    onChange={e =>setCurrentProject({ ...currentProject, name: e.target.value })}
                    placeholder="e.g. E-commerce Website, ML Price Predictor"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
</div> <div> <label className="block text-sm font-semibold mb-2 text-gray-700">Description</label> <textarea
                    value={currentProject.description}
                    onChange={e =>setCurrentProject({ ...currentProject, description: e.target.value })}
                    placeholder="Briefly describe what you built, the tech used, and the impact..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
</div> <div> <label className="block text-sm font-semibold mb-2 text-gray-700">Link <span className="text-gray-400 font-normal">(optional)</span></label> <input
                    type="url"
                    value={currentProject.link}
                    onChange={e =>setCurrentProject({ ...currentProject, link: e.target.value })}
                    placeholder="e.g. https://github.com/username/project"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${currentProject.link && !currentProject.link.startsWith('http') ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
                  /> {currentProject.link && !currentProject.link.startsWith('http') && (
                    <p className="text-red-500 text-xs mt-1">Please enter a valid URL starting with https://</p> )}
</div> <button
                  onClick={addProject}
                  disabled={!currentProject.name.trim()}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition shadow-md text-white ${currentProject.name.trim() ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : 'bg-gray-300 cursor-not-allowed'}`}
                > + Add Project
</button> {projects.length >0 && (
                  <div className="mt-4 space-y-3"> <h3 className="text-sm font-semibold text-gray-700">Added ({projects.length}):</h3> {projects.map((proj, i) =>(
                      <div key={i} className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100 flex justify-between items-start"> <div> <p className="font-semibold text-gray-900">{proj.name}</p> {proj.description && <p className="text-sm text-gray-600 mt-1">{proj.description}</p>}
                          {proj.link && <p className="text-xs text-blue-500 mt-1 truncate"><a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{proj.link}</a></p>}
</div> <button onClick={() =>deleteProject(i)} className="text-red-600 hover:text-red-800 font-semibold text-sm hover:bg-red-50 px-3 py-1 rounded transition ml-3 flex-shrink-0">Delete</button>
</div> ))}
</div> )}
</div>
</div> {/* Skills */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100"> <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center">Skills</h2> <div className="space-y-4"> {/* Add skill manually */}
                <div className="flex gap-3 items-end"> <div className="flex-1"> <label className="block text-sm font-semibold mb-2 text-gray-700">Skill Name</label> <input type="text" value={currentSkillInput} onChange={e =>setCurrentSkillInput(e.target.value)}
                      onKeyDown={e =>e.key === 'Enter' && addManualSkill()}
                      placeholder="e.g. Python, React, Leadership..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
</div> <div> <label className="block text-sm font-semibold mb-2 text-gray-700">Level</label> <div className="flex gap-1"> {[1,2,3,4,5].map(n =>(
                        <button key={n} onClick={() =>setCurrentSkillLevel(n)}
                          className={`w-8 h-8 rounded-full text-xs font-bold border-2 transition ${currentSkillLevel >= n ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}> {n}
</button> ))}
</div> <p className="text-xs text-gray-400 mt-1 text-center">{['','Beginner','Elementary','Intermediate','Advanced','Expert'][currentSkillLevel]}</p>
</div> <button onClick={addManualSkill} disabled={!currentSkillInput.trim()}
                    className={`px-4 py-3 rounded-lg font-semibold transition text-white mb-6 ${currentSkillInput.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}> + Add
</button>
</div> {/* Skill Suggestions */}
                <button onClick={() =>{ setShowSkillSuggestions(!showSkillSuggestions); setSuggestedSkills(getSkillSuggestions()) }}
                  className="text-sm text-purple-600 font-semibold hover:text-purple-800 flex items-center gap-1 transition"> {showSkillSuggestions ? 'Hide suggestions' : 'Suggest skills based on your roles'}
</button> {showSkillSuggestions && (
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200"> <p className="text-sm font-semibold text-purple-800 mb-2">Click any skill to add it (default level 3):</p> <input type="text" value={skillSearch} onChange={e =>setSkillSearch(e.target.value)}
                      placeholder="Search suggestions..." className="w-full px-3 py-2 border border-purple-200 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400" /> <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto pr-1"> {suggestedSkills.filter(s =>s.toLowerCase().includes(skillSearch.toLowerCase())).map((skill, i) =>(
                        <button key={i} onClick={() =>addSkillFromSuggestion(skill)}
                          className="px-3 py-1.5 bg-white border border-purple-300 text-purple-800 rounded-full text-sm hover:bg-purple-600 hover:text-white hover:border-purple-600 transition font-medium"> + {skill}
</button> ))}
</div>
</div> )}

                {/* Added skills with level editing */}
                {skillsList.length >0 && (
                  <div> <p className="text-sm font-semibold text-gray-700 mb-3">Added ({skillsList.length}):</p> <div className="space-y-2"> {skillsList.map((skill, i) =>(
                        <div key={i} className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-100"> <span className="font-medium text-gray-900 text-sm">{skill.name}</span> <div className="flex items-center gap-2"> <div className="flex gap-1"> {[1,2,3,4,5].map(n =>(
                                <button key={n} onClick={() =>updateSkillLevel(i, n)}
                                  className={`w-6 h-6 rounded-full text-xs font-bold border transition ${skill.level >= n ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}> {n}
</button> ))}
</div> <span className="text-xs text-gray-400 w-20">{['','Beginner','Elementary','Intermediate','Advanced','Expert'][skill.level]}</span> <button onClick={() =>deleteSkill(i)} className="text-red-400 hover:text-red-600 text-sm font-bold ml-1"></button>
</div>
</div> ))}
</div>
</div> )}
</div>
</div> {/* Certifications */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100"> <div className="flex items-center justify-between mb-5"> <h2 className="text-2xl font-bold text-gray-800 flex items-center">Certifications</h2> <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">Optional</span>
</div> <div className="space-y-4"> <div> <SearchableDropdown
                    options={CERTIFICATION_LIST}
                    value={currentCert.name}
                    onChange={val =>setCurrentCert({ ...currentCert, name: val })}
                    placeholder="Select or search certification..."
                    label="Certification Name"
                  />
</div> <div className="grid grid-cols-2 gap-3"> <div> <label className="block text-sm font-semibold mb-2 text-gray-700">Issuing Organisation</label> <input type="text" value={currentCert.issuer} onChange={e =>setCurrentCert({ ...currentCert, issuer: e.target.value })}
                      placeholder="e.g. Amazon, NSDC, Coursera"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
</div> <div> <label className="block text-sm font-semibold mb-2 text-gray-700">Year</label> <select value={currentCert.year} onChange={e =>setCurrentCert({ ...currentCert, year: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"> <option value="">Select year</option> {YEARS.map(y =><option key={y} value={y}>{y}</option>)}
</select>
</div>
</div> <button onClick={addCertification} disabled={!currentCert.name.trim()}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition shadow-md text-white ${currentCert.name.trim() ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : 'bg-gray-300 cursor-not-allowed'}`}> + Add Certification
</button> {certifications.length >0 && (
                  <div className="mt-2 space-y-2"> {certifications.map((cert, i) =>(
                      <div key={i} className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-100 rounded-lg"> <div> <p className="font-semibold text-gray-900 text-sm">{cert.name}</p> {cert.issuer && <p className="text-xs text-gray-500">{cert.issuer}{cert.year ? ` · ${cert.year}` : ''}</p>}
</div> <button onClick={() =>deleteCertification(i)} className="text-red-500 hover:text-red-700 text-sm font-semibold ml-3">Delete</button>
</div> ))}
</div> )}
</div>
</div> {/* Website Links */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100"> <div className="flex items-center justify-between mb-5"> <h2 className="text-2xl font-bold text-gray-800 flex items-center">Website Links</h2> <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">Optional</span>
</div> <div className="space-y-3"> {[
                  { key: 'linkedin', label: ' LinkedIn', placeholder: 'https://linkedin.com/in/yourname' },
                  { key: 'github', label: ' GitHub', placeholder: 'https://github.com/yourusername' },
                  { key: 'portfolio', label: ' Portfolio', placeholder: 'https://yourportfolio.com' },
                  { key: 'other', label: ' Other', placeholder: 'https://yourlink.com' }
                ].map(({ key, label, placeholder }) =>{
                  const val = websiteLinks[key]
                  const isInvalid = val && !val.startsWith('http')
                  return (
                    <div key={key}> <label className="block text-sm font-semibold mb-2 text-gray-700">{label}</label> <input type="url" value={val}
                        onChange={e =>setWebsiteLinks({ ...websiteLinks, [key]: e.target.value })}
                        placeholder={placeholder}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isInvalid ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} /> {isInvalid && <p className="text-red-500 text-xs mt-1">Please enter a valid URL starting with https://</p>}
</div> )
                })}
</div>
</div> {/* Languages */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100"> <div className="flex items-center justify-between mb-5"> <h2 className="text-2xl font-bold text-gray-800 flex items-center">Languages</h2> <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">Optional</span>
</div> <div className="space-y-4"> <div className="grid grid-cols-2 gap-3"> <div> <SearchableDropdown
                      options={LANGUAGE_LIST}
                      value={currentLanguage.name}
                      onChange={val =>setCurrentLanguage({ ...currentLanguage, name: val })}
                      placeholder="Select language..."
                      label="Language"
                    />
</div> <div> <label className="block text-sm font-semibold mb-2 text-gray-700">Proficiency (1–5)</label> <div className="flex items-center gap-1 mt-3"> {[1,2,3,4,5].map(n =>(
                        <button key={n} onClick={() =>setCurrentLanguage({ ...currentLanguage, level: n })}
                          className={`w-9 h-9 rounded-full text-sm font-bold transition border-2 ${currentLanguage.level >= n ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}> {n}
</button> ))}
</div> <p className="text-xs text-gray-400 mt-1">{['','Beginner','Elementary','Intermediate','Advanced','Native'][currentLanguage.level]}</p>
</div>
</div> <button onClick={addLanguage} disabled={!currentLanguage.name.trim()}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition shadow-md text-white ${currentLanguage.name.trim() ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : 'bg-gray-300 cursor-not-allowed'}`}> + Add Language
</button> {languages.length >0 && (
                  <div className="flex flex-wrap gap-2 mt-2"> {languages.map((lang, i) =>(
                      <div key={i} className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-2 rounded-lg"> <span className="text-sm font-semibold text-gray-800">{lang.name}</span> <span className="text-xs text-blue-600">{['','Beginner','Elementary','Intermediate','Advanced','Native'][lang.level]}</span> <button onClick={() =>deleteLanguage(i)} className="text-red-400 hover:text-red-600 text-xs ml-1"></button>
</div> ))}
</div> )}
</div>
</div> {/* Hobbies */}
            <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100"> <div className="flex items-center justify-between mb-5"> <h2 className="text-2xl font-bold text-gray-800 flex items-center">Hobbies & Interests</h2> <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">Optional</span>
</div> <div> <label className="block text-sm font-semibold mb-2 text-gray-700">Your hobbies (separate with commas)</label> <textarea value={hobbies} onChange={e =>setHobbies(e.target.value)}
                  placeholder="e.g. Photography, Cricket, Travelling, Reading, Cooking"
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" /> <p className="text-xs text-gray-500 mt-2">Keep it relevant and professional</p>
</div>
</div>
</div> {/* RIGHT: PREVIEW */}
          <div className="lg:sticky lg:top-8 h-fit"> {/*  STRENGTH SCORE WIDGET  */}
            {(() =>{
              const { pct, tip, color, label, missing } = computeStrengthScore()
              const r = 34
              const circ = 2 * Math.PI * r
              const dash = circ * (pct / 100)
              return (
                <div className="mb-4 bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4"> <div className="flex items-center gap-4"> {/* SVG Ring */}
                    <div className="flex-shrink-0"> <svg width="80" height="80" viewBox="0 0 80 80"> <circle cx="40" cy="40" r={r} fill="none" stroke="#f3f4f6" strokeWidth="7" /> <circle
                          cx="40" cy="40" r={r} fill="none"
                          stroke={color} strokeWidth="7"
                          strokeLinecap="round"
                          strokeDasharray={`${dash} ${circ}`}
                          transform="rotate(-90 40 40)"
                          style={{transition:'stroke-dasharray 0.5s ease'}}
                        /> <text x="40" y="37" textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="bold" fill={color}>{pct}%</text> <text x="40" y="53" textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="#9ca3af">{label}</text>
</svg>
</div> {/* Text */}
                    <div className="flex-1 min-w-0"> <p className="text-sm font-bold text-gray-800 mb-1">Resume Strength</p> <p className="text-xs text-gray-500 leading-snug">{tip}</p> {missing.length >0 && (
                        <div className="mt-2 flex flex-wrap gap-1"> {missing.slice(0, 3).map(m =>(
                            <span key={m.label} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">+{m.pts} {m.label}</span> ))}
</div> )}
</div>
</div>
</div> )
            })()}

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
</div> {/*  Overlap Warning Modal  */}
      {/*  ATS CHECKER MODAL  */}
      {showATS && atsData && (() =>{
        const { checks, score } = atsData
        const critical = checks.filter(c =>c.category === 'critical')
        const improvements = checks.filter(c =>c.category === 'improvement')
        const bonus = checks.filter(c =>c.category === 'bonus')
        const failed = checks.filter(c =>!c.pass)
        const passed = checks.filter(c =>c.pass)
        const scoreColor = score >= 80 ? '#16a34a' : score >= 55 ? '#d97706' : '#dc2626'
        const scoreBg = score >= 80 ? '#f0fdf4' : score >= 55 ? '#fffbeb' : '#fef2f2'
        const scoreLabel = score >= 80 ? 'Great shape!' : score >= 55 ? 'Needs work' : 'Needs attention'
        const circumference = 2 * Math.PI * 40
        const strokeDash = circumference - (score / 100) * circumference
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() =>setShowATS(false)}> <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e =>e.stopPropagation()}> {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100"> <div> <h2 className="text-xl font-bold text-gray-900">ATS Compatibility Check</h2> <p className="text-xs text-gray-500 mt-0.5">How well will your CV pass automated screening?</p>
</div> <button onClick={() =>setShowATS(false)} className="text-gray-400 hover:text-gray-700 text-2xl font-light leading-none">×</button>
</div> {/* Score ring */}
              <div className="flex flex-col items-center py-5" style={{ backgroundColor: scoreBg }}> <svg width="100" height="100" viewBox="0 0 100 100"> <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10" /> <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={scoreColor} strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDash}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  /> <text x="50" y="45" textAnchor="middle" fontSize="20" fontWeight="bold" fill={scoreColor}>{score}</text> <text x="50" y="60" textAnchor="middle" fontSize="10" fill="#6b7280">/ 100</text>
</svg> <p className="text-sm font-semibold mt-1" style={{ color: scoreColor }}>{scoreLabel}</p> <p className="text-xs text-gray-500">{passed.length} of {checks.length} checks passed</p>
</div> {/* Checks list */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4"> {failed.length >0 && (
                  <div> <h3 className="text-xs font-bold uppercase tracking-wide text-red-600 mb-2">Issues to Fix ({failed.length})</h3> <div className="space-y-2"> {failed.map(c =>(
                        <div key={c.id} className="flex gap-3 p-3 bg-red-50 rounded-xl border border-red-100">  <div> <p className="text-sm font-semibold text-gray-800">{c.label}</p> <p className="text-xs text-gray-500 mt-0.5">{c.tip}</p>
</div>
</div> ))}
</div>
</div> )}

                {passed.length >0 && (
                  <div> <h3 className="text-xs font-bold uppercase tracking-wide text-emerald-600 mb-2">Passing ({passed.length})</h3> <div className="space-y-1.5"> {passed.map(c =>(
                        <div key={c.id} className="flex gap-3 p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">  <p className="text-sm text-gray-700">{c.label}</p>
</div> ))}
</div>
</div> )}
</div> {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100"> <button
                  onClick={() =>{ setAtsData(runATSCheck()); }}
                  className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition text-sm mb-2"
                > Re-run Check
</button> <button onClick={() =>setShowATS(false)} className="w-full py-2 text-gray-500 hover:text-gray-800 text-sm font-medium">Close</button>
</div>
</div>
</div> )
      })()}

      {/*  JOB MATCH MODAL  */}
      {showJobMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() =>setShowJobMatch(false)}> <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e =>e.stopPropagation()}> {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100"> <div> <h2 className="text-xl font-bold text-gray-900">Job Match Score</h2> <p className="text-xs text-gray-500 mt-0.5">Paste a job description to see how well your CV matches</p>
</div> <button onClick={() =>setShowJobMatch(false)} className="text-gray-400 hover:text-gray-700 text-2xl font-light leading-none">×</button>
</div> <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4"> {/* JD input */}
              <div> <label className="block text-sm font-semibold text-gray-700 mb-2">Paste the Job Description</label> <textarea
                  value={jobMatchJD}
                  onChange={e =>{ setJobMatchJD(e.target.value); setJobMatchResult(null) }}
                  placeholder="Copy and paste the full job description here — the more text, the more accurate the match..."
                  rows={7}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
                /> <button
                  onClick={() =>setJobMatchResult(runJobMatch(jobMatchJD))}
                  disabled={!jobMatchJD.trim()}
                  className="mt-2 w-full py-2.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                > Analyse Match →
</button>
</div> {/* Results */}
              {jobMatchResult && (() =>{
                const { score, matched, missing, total } = jobMatchResult
                const scoreColor = score >= 70 ? '#7c3aed' : score >= 45 ? '#d97706' : '#dc2626'
                const scoreBg = score >= 70 ? '#f5f3ff' : score >= 45 ? '#fffbeb' : '#fef2f2'
                const scoreLabel = score >= 70 ? 'Strong match!' : score >= 45 ? 'Partial match' : 'Low match'
                const circumference = 2 * Math.PI * 38
                const strokeDash = circumference - (score / 100) * circumference
                return (
                  <div className="space-y-4"> {/* Score ring */}
                    <div className="flex flex-col items-center py-4 rounded-2xl" style={{ backgroundColor: scoreBg }}> <svg width="96" height="96" viewBox="0 0 100 100"> <circle cx="50" cy="50" r="38" fill="none" stroke="#e5e7eb" strokeWidth="10" /> <circle
                          cx="50" cy="50" r="38" fill="none"
                          stroke={scoreColor} strokeWidth="10"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDash}
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        /> <text x="50" y="46" textAnchor="middle" fontSize="20" fontWeight="bold" fill={scoreColor}>{score}%</text> <text x="50" y="61" textAnchor="middle" fontSize="9" fill="#6b7280">match</text>
</svg> <p className="text-sm font-bold mt-1" style={{ color: scoreColor }}>{scoreLabel}</p> <p className="text-xs text-gray-500">{matched.length} of {total} keywords found in your CV</p>
</div> {/* Missing keywords */}
                    {missing.length >0 && (
                      <div> <h3 className="text-xs font-bold uppercase tracking-wide text-orange-600 mb-2">Keywords to add ({missing.length})</h3> <p className="text-xs text-gray-500 mb-2">These words appear in the JD but not in your CV. Consider adding relevant ones.</p> <div className="flex flex-wrap gap-2"> {missing.map(kw =>(
                            <span key={kw} className="px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-xs font-medium">{kw}</span> ))}
</div>
</div> )}

                    {/* Matched keywords */}
                    {matched.length >0 && (
                      <div> <h3 className="text-xs font-bold uppercase tracking-wide text-violet-600 mb-2">Matched keywords ({matched.length})</h3> <div className="flex flex-wrap gap-2"> {matched.map(kw =>(
                            <span key={kw} className="px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-200 rounded-full text-xs font-medium">{kw}</span> ))}
</div>
</div> )}
</div> )
              })()}
</div> <div className="px-6 py-4 border-t border-gray-100"> <button onClick={() =>setShowJobMatch(false)} className="w-full py-2 text-gray-500 hover:text-gray-800 text-sm font-medium">Close</button>
</div>
</div>
</div> )}

      {/*  CV IMPORT MODAL  */}
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={() =>setShowImport(false)}> <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e =>e.stopPropagation()}> <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100"> <div> <h2 className="text-xl font-bold text-gray-900">Import Existing CV</h2> <p className="text-xs text-gray-500 mt-0.5">Upload your CV and we'll pre-fill the form automatically</p>
</div> <button onClick={() =>setShowImport(false)} className="text-gray-400 hover:text-gray-700 text-2xl font-light leading-none">×</button>
</div> <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4"> {/* Upload area */}
              <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-orange-200 rounded-2xl p-8 cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition"> <span className="text-4xl">{importLoading ? '⏳' : ''}</span> <div className="text-center"> <p className="text-sm font-semibold text-gray-700">{importLoading ? 'Reading your CV…' : 'Click to upload your CV'}</p> <p className="text-xs text-gray-400 mt-1">PDF, DOCX, or TXT — max 10MB</p>
</div> <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  disabled={importLoading}
                  onChange={e =>handleImportFile(e.target.files?.[0])}
                />
</label> {importMsg && (
                <div className={`rounded-xl px-4 py-3 text-sm font-medium ${importMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}> {importMsg.text}
</div> )}

              {/* Preview parsed data */}
              {importPreview && (
                <div className="space-y-3"> <h3 className="text-sm font-bold text-gray-700">Detected fields — review before applying:</h3> {[
                    { label: 'Name', value: importPreview.name },
                    { label: 'Email', value: importPreview.email },
                    { label: 'Phone', value: importPreview.phone },
                    { label: 'Location', value: importPreview.location },
                  ].filter(f =>f.value).map(f =>(
                    <div key={f.label} className="flex gap-2 text-sm"> <span className="font-semibold text-gray-500 w-20 flex-shrink-0">{f.label}:</span> <span className="text-gray-800 truncate">{f.value}</span>
</div> ))}

                  {importPreview.summary && (
                    <div className="text-sm"> <span className="font-semibold text-gray-500">Summary:</span> <p className="text-gray-700 mt-0.5 text-xs line-clamp-3">{importPreview.summary}</p>
</div> )}

                  {importPreview.workExperiences?.length >0 && (
                    <div className="text-sm"> <span className="font-semibold text-gray-500">Work Experience ({importPreview.workExperiences.length} roles detected):</span> <div className="mt-1 space-y-1"> {importPreview.workExperiences.map((w, i) =>(
                          <div key={i} className="text-xs bg-gray-50 rounded-lg px-3 py-2"> <span className="font-semibold">{w.jobTitle || 'Role'}</span> {w.company && <span className="text-gray-500">@ {w.company}</span>}
                            {w.startYear && <span className="text-gray-400">· {w.startYear}–{w.isPresent ? 'Present' : w.endYear}</span>}
</div> ))}
</div>
</div> )}

                  {importPreview.educationList?.length >0 && (
                    <div className="text-sm"> <span className="font-semibold text-gray-500">Education ({importPreview.educationList.length} detected):</span> <div className="mt-1 space-y-1"> {importPreview.educationList.map((e, i) =>(
                          <div key={i} className="text-xs bg-gray-50 rounded-lg px-3 py-2"> <span className="font-semibold">{e.degree || 'Degree'}</span> {e.school && <span className="text-gray-500">@ {e.school}</span>}
</div> ))}
</div>
</div> )}

                  {importPreview.skillsList?.length >0 && (
                    <div className="text-sm"> <span className="font-semibold text-gray-500">Skills ({importPreview.skillsList.length} detected):</span> <div className="flex flex-wrap gap-1.5 mt-1"> {importPreview.skillsList.map((s, i) =>(
                          <span key={i} className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full text-xs border border-orange-100">{s.name}</span> ))}
</div>
</div> )}

                  <p className="text-xs text-gray-400 italic">This overwrites your current form data. You can edit anything after applying.</p>
</div> )}
</div> <div className="px-6 py-4 border-t border-gray-100 space-y-2"> {importPreview && (
                <button onClick={applyImport} className="w-full py-2.5 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition text-sm"> Apply to CV
</button> )}
              <button onClick={() =>setShowImport(false)} className="w-full py-2 text-gray-500 hover:text-gray-800 text-sm font-medium">Close</button>
</div>
</div>
</div> )}

      {/*  CLOUD SAVES PANEL  */}
      {showCloudPanel && (
        <div className="fixed inset-0 z-50 flex" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }} onClick={() =>setShowCloudPanel(false)}> <div className="ml-auto h-full bg-white shadow-2xl flex flex-col" style={{ width: '400px', maxWidth: '95vw' }} onClick={e =>e.stopPropagation()}> {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200"> <div> <h2 className="text-lg font-bold text-gray-900">Cloud Saves</h2> <p className="text-xs text-gray-500 mt-0.5">Save and switch between multiple CV versions</p>
</div> <button onClick={() =>setShowCloudPanel(false)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none font-light">×</button>
</div> {/* Save current */}
            <div className="px-5 py-4 border-b border-gray-100 bg-sky-50"> <p className="text-xs font-semibold text-sky-700 mb-2"> {currentResumeId ? ' Editing:' : ' Save current CV as:'}
</p> <div className="flex gap-2"> <input
                  type="text"
                  value={cloudSaveName}
                  onChange={e =>setCloudSaveName(e.target.value)}
                  onKeyDown={e =>e.key === 'Enter' && saveToCloud()}
                  placeholder="e.g. Google Application, Senior Dev CV..."
                  className="flex-1 px-3 py-2 border border-sky-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 bg-white"
                /> <button
                  onClick={saveToCloud}
                  disabled={cloudLoading || !cloudSaveName.trim()}
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg font-semibold text-sm hover:bg-sky-700 transition disabled:opacity-40"
                > {cloudLoading ? '…' : currentResumeId ? 'Update' : 'Save'}
</button>
</div> {cloudMsg && (
                <p className={`text-xs mt-2 font-medium ${cloudMsg.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}> {cloudMsg.text}
</p> )}
              {currentResumeId && (
                <button onClick={() =>{ setCurrentResumeId(null); setCloudSaveName('') }} className="text-xs text-sky-500 hover:text-sky-700 mt-1 underline"> + Save as new instead
</button> )}
</div> {/* Saved list */}
            <div className="flex-1 overflow-y-auto"> {cloudLoading && cloudSaves.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Loading…</div> ) : cloudSaves.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400 gap-2">  <p className="text-sm">No saved CVs yet.</p> <p className="text-xs">Give your current CV a name and hit Save.</p>
</div> ) : (
                <div className="divide-y divide-gray-100"> {cloudSaves.map(r =>(
                    <div key={r.id} className={`flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition ${currentResumeId === r.id ? 'bg-sky-50' : ''}`}> <div className="flex-1 min-w-0"> <div className="flex items-center gap-2"> <p className="text-sm font-semibold text-gray-800 truncate">{r.resume_name}</p> {currentResumeId === r.id && <span className="text-[10px] bg-sky-100 text-sky-600 rounded-full px-2 py-0.5 font-medium flex-shrink-0">active</span>}
</div> <p className="text-xs text-gray-400 mt-0.5"> {new Date(r.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
</p>
</div> <button
                        onClick={() =>loadFromCloud(r)}
                        className="px-3 py-1.5 text-xs font-semibold bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition flex-shrink-0"
                      > Load
</button> <button
                        onClick={() =>deleteFromCloud(r.id)}
                        className="px-2.5 py-1.5 text-xs font-semibold bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition flex-shrink-0"
                      > </button>
</div> ))}
</div> )}
</div> {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50"> <button onClick={() =>setShowCloudPanel(false)} className="w-full py-2.5 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition text-sm">Done</button>
</div>
</div>
</div> )}

      {/*  TEMPLATE SWITCHER PANEL  */}
      {showTemplateSwitcher && (
        <div
          className="fixed inset-0 z-50 flex"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          onClick={() =>setShowTemplateSwitcher(false)}
        > {/* Slide-in panel from right */}
          <div
            className="ml-auto h-full bg-white shadow-2xl flex flex-col"
            style={{ width: '420px', maxWidth: '95vw' }}
            onClick={e =>e.stopPropagation()}
          > {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200"> <div> <h2 className="text-lg font-bold text-gray-900">Choose a Template</h2> <p className="text-xs text-gray-500 mt-0.5">Your CV data is preserved — just pick a new look</p>
</div> <button
                onClick={() =>setShowTemplateSwitcher(false)}
                className="text-gray-400 hover:text-gray-700 text-2xl leading-none font-light"
              >×</button>
</div> {/* Scrollable grid */}
            <div className="flex-1 overflow-y-auto p-4"> <div className="grid grid-cols-2 gap-3"> {TEMPLATE_LIST.map(t =>(
                  <button
                    key={t.id}
                    onClick={() =>{ setSelectedTemplate(t.id); setShowTemplateSwitcher(false) }}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all group text-left
                      ${selectedTemplate === t.id
                        ? 'border-indigo-500 ring-2 ring-indigo-300'
                        : 'border-gray-200 hover:border-indigo-300'}`}
                  > {/* Thumbnail */}
                    <div className="w-full aspect-[3/4] bg-gray-100 overflow-hidden"> <img
                        src={`/template-previews/${t.id}.jpg`}
                        alt={t.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        onError={e =>{ e.target.style.display = 'none' }}
                      />
</div> {/* Name + badge */}
                    <div className="px-2 py-2 bg-white"> <div className="flex items-center gap-1 flex-wrap"> <span className="text-xs font-semibold text-gray-800">{t.name}</span> {t.badge && (
                          <span className="text-[10px] bg-indigo-50 text-indigo-600 rounded-full px-1.5 py-0.5 font-medium">{t.badge}</span> )}
</div>
</div> {/* Active tick */}
                    {selectedTemplate === t.id && (
                      <div className="absolute top-2 right-2 bg-indigo-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow"></div> )}
</button> ))}
</div>
</div> {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50"> <button
                onClick={() =>setShowTemplateSwitcher(false)}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition text-sm"
              > Done
</button>
</div>
</div>
</div> )}

      {/*  WHAT'S NEXT MODAL  */}
      {showWhatsNext && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor:'rgba(0,0,0,0.6)'}}> <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"> {/* Header */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-6 py-5 text-white relative"> <button onClick={() =>setShowWhatsNext(false)} className="absolute top-4 right-4 text-white/70 hover:text-white text-xl font-bold"></button> <div className="text-3xl mb-2"></div> <h2 className="text-xl font-bold">Your CV is ready!</h2> <p className="text-emerald-100 text-sm mt-1">Here are a few things you can do next</p>
</div> {/* Cards */}
            <div className="p-5 space-y-3"> {[
                {
                  icon: '', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
                  title: 'Write a cover letter',
                  desc: 'Generate a matching cover letter in seconds using your CV data',
                  action: () =>{ setShowWhatsNext(false); navigate('/cover-letter') }
                },
                {
                  icon: '', color: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
                  title: 'Check your ATS score',
                  desc: 'See how well your CV will pass automated screening filters',
                  action: () =>{ setShowWhatsNext(false); handleATSCheck() }
                },
                {
                  icon: '', color: 'bg-violet-50 border-violet-200 hover:bg-violet-100',
                  title: 'Match to a job description',
                  desc: 'Paste a job posting and see which keywords you\'re missing',
                  action: () =>{ setShowWhatsNext(false); setShowJobMatch(true) }
                },
                {
                  icon: '', color: 'bg-rose-50 border-rose-200 hover:bg-rose-100',
                  title: 'Get an expert CV review',
                  desc: 'A hiring specialist reviews your CV within 24 hours — ₹499',
                  action: () =>{ setShowWhatsNext(false); setShowTuneUp(true); setTuneUpMsg(null) }
                },
                {
                  icon: '', color: 'bg-sky-50 border-sky-200 hover:bg-sky-100',
                  title: 'Find matching jobs',
                  desc: 'Search for roles that match your experience on Naukri & LinkedIn',
                  action: () =>{
                    const query = encodeURIComponent((workExperiences[0]?.jobTitle || name || 'jobs') + ' jobs India')
                    window.open(`https://www.naukri.com/jobs-by-keyword?q=${query}`, '_blank')
                    setShowWhatsNext(false)
                  }
                },
              ].map(card =>(
                <button key={card.title} onClick={card.action}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition ${card.color}`}> <span className="text-2xl flex-shrink-0">{card.icon}</span> <div> <p className="text-sm font-bold text-gray-800">{card.title}</p> <p className="text-xs text-gray-500 mt-0.5">{card.desc}</p>
</div>
</button> ))}
</div> <div className="px-5 pb-5"> <button onClick={() =>setShowWhatsNext(false)}
                className="w-full py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50 transition"> Close
</button>
</div>
</div>
</div> )}

      {/*  RESUME TUNE-UP MODAL  */}
      {showTuneUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor:'rgba(0,0,0,0.6)'}}> <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"> {/* Header */}
            <div className="bg-gradient-to-br from-rose-500 to-pink-600 px-6 py-5 text-white relative"> <button onClick={() =>setShowTuneUp(false)} className="absolute top-4 right-4 text-white/70 hover:text-white text-xl font-bold"></button> <div className="text-3xl mb-2"></div> <h2 className="text-xl font-bold">Expert CV Tune-Up</h2> <p className="text-rose-100 text-sm mt-1">Get your resume reviewed by a hiring specialist</p>
</div> {/* Body */}
            <div className="px-6 py-5"> {tuneUpMsg ? (
                <div className={`rounded-xl p-4 ${tuneUpMsg.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}> <p className={`text-sm font-semibold mb-1 ${tuneUpMsg.type === 'success' ? 'text-green-700' : 'text-red-700'}`}> {tuneUpMsg.type === 'success' ? ' You\'re all set!' : ' Something went wrong'}
</p> <p className={`text-sm ${tuneUpMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{tuneUpMsg.text}</p> {tuneUpMsg.type === 'success' && (
                    <button onClick={() =>setShowTuneUp(false)} className="mt-4 w-full py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition text-sm"> Close
</button> )}
</div> ) : (
                <> <ul className="space-y-3 mb-5"> {[
                      { icon: '', title: 'Personalised feedback', desc: 'Line-by-line review tailored to your target role' },
                      { icon: '', title: 'ATS optimisation tips', desc: 'Keywords and formatting advice to pass automated filters' },
                      { icon: '', title: 'Impact improvements', desc: 'Suggestions to make your achievements stand out' },
                      { icon: '', title: '24-hour turnaround', desc: 'Feedback delivered directly to your email' },
                    ].map(item =>(
                      <li key={item.title} className="flex items-start gap-3"> <span className="text-xl flex-shrink-0">{item.icon}</span> <div> <p className="text-sm font-semibold text-gray-900">{item.title}</p> <p className="text-xs text-gray-500">{item.desc}</p>
</div>
</li> ))}
</ul> <div className="bg-rose-50 rounded-xl p-4 mb-5 flex items-center justify-between"> <div> <p className="text-xs text-rose-500 font-medium uppercase tracking-wide">One-time fee</p> <p className="text-2xl font-bold text-rose-700">₹499</p>
</div> <div className="text-right text-xs text-rose-500"> <p>Secure payment</p> <p>No subscription</p>
</div>
</div> <button
                    onClick={handleTuneUpPayment}
                    disabled={tuneUpLoading}
                    className={`w-full py-3.5 rounded-xl font-bold text-white transition text-sm flex items-center justify-center gap-2 ${tuneUpLoading ? 'bg-rose-300 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600'}`}
                  > {tuneUpLoading ? (
                      <><span className="animate-spin">⏳</span>Opening payment…</> ) : (
                      <>Pay ₹499 &amp; Get My CV Reviewed</> )}
</button> <p className="text-xs text-center text-gray-400 mt-3">Secured by Razorpay · UPI, cards, net banking accepted</p>
</> )}
</div>
</div>
</div> )}

      {overlapWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor:'rgba(0,0,0,0.6)'}}> <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"> <div className="flex items-start gap-3 mb-4"> <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-lg"></div> <div> <h3 className="font-bold text-gray-900 text-lg">Date Overlap Detected</h3> <p className="text-sm text-gray-600 mt-1"> This role overlaps with <span className="font-semibold text-gray-900">{overlapWarning.overlapping.jobTitle}</span>at <span className="font-semibold text-gray-900">{overlapWarning.overlapping.company}</span>.
</p> <p className="text-xs text-gray-500 mt-2"> That's okay if you were working at two organisations simultaneously — just confirming it's intentional.
</p>
</div>
</div> <div className="flex gap-3"> <button
                onClick={() =>setOverlapWarning(null)}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition text-sm"
              > ← Go Back & Edit
</button> <button
                onClick={() =>addWorkExperience(true)}
                className="flex-1 bg-amber-500 text-white font-bold py-2.5 rounded-xl hover:bg-amber-600 transition text-sm"
              > Save Anyway
</button>
</div>
</div>
</div> )}

</div> )
}



export default Builder

