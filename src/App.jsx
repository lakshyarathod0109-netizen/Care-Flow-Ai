import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, AlertCircle, ArrowDownRight, ArrowUpRight, Bot, CalendarDays, LogIn, UserPlus, TrendingUp, PieChart,
  Check, CheckCircle2, ChevronDown, CircleHelp, Clock3, Headphones,
  HeartPulse, LayoutDashboard, Menu, MessageCircle, Mic, Plus, Search, Building2, MapPin, Phone,
  Send, Settings, ShieldCheck, Stethoscope, Ticket, Users, X, Zap, Sun, Moon
} from "lucide-react";

const STORAGE_KEY = "careflow-ai-demo-v2";
const today = new Date();
const dateISO = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}-${String(x.getDate()).padStart(2,"0")}`;
};
const tomorrow = new Date(today); tomorrow.setDate(today.getDate()+1);
const dateLabel = (value) => {
  if (!value) return "Not set";
  const d = new Date(`${value}T12:00:00`);
  return d.toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
};

const samplePatientNames = [
  "Aarav Sharma","Ananya Patel","Kabir Verma","Riya Gupta","Dev Malhotra","Ishita Rao","Vivaan Joshi","Saanvi Jain","Aditya Singh","Myra Mehta",
  "Arjun Nair","Aditi Kulkarni","Reyansh Shah","Kiara Choudhary","Atharv Mishra","Pari Agrawal","Krishna Yadav","Navya Soni","Dhruv Bansal","Aanya Saxena",
  "Rudra Tiwari","Diya Rathore","Ishaan Dubey","Anvi Bhatt","Shaurya Pandey","Sara Khan","Manav Desai","Aarohi Pawar","Yash Thakur","Prisha Goyal",
  "Rohan Jain","Nisha Verma","Kunal Sharma","Meera Patel","Rahul Joshi","Pooja Singh","Siddharth Rao","Neha Gupta","Varun Mehta","Simran Kaur",
  "Omkar Kulkarni","Tanvi Shah","Harsh Choudhary","Kavya Mishra","Abhay Agrawal","Tara Soni","Nikhil Bansal","Ira Saxena","Parth Tiwari","Mahi Rathore"
];
const sampleAreas = ["Rau","Vijay Nagar","Palasia","Bhawarkua","Rajendra Nagar","Annapurna","Scheme 54","Sudama Nagar","Mhow Naka","Bengali Square"];
const sampleDepartments = ["Cardiology","Dermatology","Orthopedics","General Medicine","Pediatrics"];
const samplePatients = samplePatientNames.map((name,i)=>({
  id:`PAT-${String(1001+i)}`, name, age:18+((i*7+11)% sixty()),
  area:sampleAreas[i%sampleAreas.length], department:sampleDepartments[i%sampleDepartments.length],
  status:["Active","Appointment booked","Follow-up","New inquiry"][i%4],
  lastVisit:new Date(Date.now()-((i%28)+1)*86400000).toISOString().slice(0,10)
}));
function sixty(){ return 60; }
const directoryLastReviewed = "2026-10-28";
// Curated Indore directory assembled from government listings and hospital-published service pages.
// This is not an exhaustive registry. Areas/specialties are reference information; patients must confirm current details.
const hospitals = [
 {name:"Maharaja Yeshwantrao (M.Y.) Hospital",area:"MTH Compound / AB Road, central Indore",type:"Government teaching & multispecialty hospital",phone:"Confirm through official directory",website:"https://indore.nic.in/en/public-utility-category/government-hospitals/",specialties:["General Medicine","General Surgery","Emergency & Trauma","Orthopedics","Obstetrics & Gynaecology","Pediatrics","Ophthalmology","ENT","Neurology","Neurosurgery","Cardiology","Nephrology","Urology","Psychiatry","Dermatology","Diagnostics"],note:"Government tertiary-care hospital. Confirm department OPD and current services before visiting."},
 {name:"Super Speciality Hospital",area:"MTH Compound / central Indore",type:"Government super-specialty hospital",phone:"Confirm through official directory",website:"https://indore.nic.in/en/public-utility-category/government-hospitals/",specialties:["Cardiology","Cardiothoracic care","Neurology","Neurosurgery","Nephrology","Urology","Gastroenterology","Critical Care"],note:"Government specialty facility; confirm the exact service and clinic schedule."},
 {name:"Apollo Hospitals Indore",area:"Sector-D, Scheme No. 74C, Vijay Nagar",type:"Private multispecialty hospital",phone:"Use official contact page",website:"https://www.apollohospitals.com/hospitals/apollo-hospitals-indore",specialties:["Cardiac Sciences","Oncology","Neurology","Nephrology","Gastroenterology & Hepatology","Gynaecology","Pulmonology","Orthopedics","Urology","Critical Care","Emergency Medicine","ENT","Pediatrics","Internal Medicine","Plastic Surgery"],note:"Specialties based on the hospital's published Indore page. Verify doctor availability and appointment slots."},
 {name:"Bombay Hospital Indore",area:"IDA Scheme 94/95, Eastern Ring Road, Tulsi Nagar / Vijay Nagar",type:"Private tertiary multispecialty hospital",phone:"0731-4771111 (verify before calling)",website:"https://bombayhospitalindore.com/",specialties:["Cardiology","Cardiovascular & Thoracic Surgery","Oncology","Surgical Oncology","Neurology","Neurosurgery","Nephrology","Dialysis","Kidney Transplant","Gastroenterology","General Surgery","Orthopedics","Ophthalmology","ENT","Pediatrics","Neonatology","Obstetrics & Gynaecology","Urology","Plastic Surgery","Emergency & Casualty","Pathology"],note:"Department list based on the hospital website. Call to confirm clinic times and current services."},
 {name:"CARE CHL Hospitals",area:"AB Road, near LIG Square, RSS Nagar",type:"Private multispecialty hospital",phone:"0731-4774444 (verify before calling)",website:"https://www.carehospitals.com/indore/speciality-and-treatments",specialties:["Cardiology","Cardiac Surgery","Oncology","Medical Oncology","Nephrology","Pulmonology","Urology","Ophthalmology","ENT","Orthopedics","Dentistry","Dermatology","Endocrinology","Gastroenterology","General Surgery","Gynaecology & Obstetrics","Internal Medicine","Neurology","Neurosciences","Pediatrics","Psychiatry","Radiology","Critical Care","Transplant Services"],note:"Official specialty page lists these clinical services; verify which are available at the Indore facility."},
 {name:"Medanta Super Speciality Hospital",area:"Scheme 54, Rasoma Square, Vijay Nagar, AB Road",type:"Private multispecialty hospital",phone:"0731-4747185 (verify before calling)",website:"https://www.medanta.org/indore/",specialties:["Multispecialty consultations","Emergency & Critical Care","Cardiac care","Neurology","Orthopedics","Gastroenterology","Nephrology","Urology","Oncology","Diagnostics"],note:"Area and contact reference from public listing. Confirm exact specialty, doctor and appointment availability."},
 {name:"Shalby Hospital Indore",area:"AB Road / Indore (confirm exact branch address)",type:"Private multispecialty hospital",phone:"Use official contact page",website:"https://www.shalby.org/",specialties:["Orthopedics & Joint Replacement","Spine Care","Cardiology","Neurology","Nephrology","Oncology","General Surgery","Critical Care","Diagnostics"],note:"Specialty availability can vary by facility; confirm the Indore branch details on the official website."},
 {name:"Choithram Hospital & Research Centre",area:"Manik Bagh Road area",type:"Multispecialty hospital",phone:"Confirm through official hospital contact page",website:"https://choithramhospital.org/",specialties:["General Medicine","General Surgery","Cardiology","Neurology","Nephrology","Orthopedics","Pediatrics","Obstetrics & Gynaecology","Ophthalmology","ENT","Urology","Diagnostics","Emergency & Critical Care"],note:"Use the hospital's official contact page to verify current departments and OPD schedules."},
 {name:"Sri Aurobindo Institute of Medical Sciences (SAIMS) / Sri Aurobindo Hospital",area:"Bhawrasla, Indore–Ujjain State Highway, near MR-10",type:"Teaching & tertiary-care multispecialty hospital",phone:"0731-4231000 (verify before calling)",website:"https://www.saimsonline.com/",specialties:["General Medicine","General Surgery","Cardiology","Neurology","Neurosurgery","Nephrology","Dialysis","Gastroenterology","Oncology","Surgical Oncology","Orthopedics","Ophthalmology","ENT","Dermatology","Pediatrics","Neonatology","Obstetrics & Gynaecology","Psychiatry","Respiratory Medicine","Endocrinology","Radiology","Nuclear Medicine / PET imaging","Critical Care","Transplant-related services"],note:"Large teaching hospital; confirm current department, doctor, OPD hours and specific diagnostic availability."},
 {name:"Index Medical College, Hospital & Research Centre",area:"Index City, Nemawar Road, near Khudel",type:"Teaching multispecialty hospital",phone:"Use official hospital contact page",website:"https://www.indexgroup.in/",specialties:["General Medicine","General Surgery","Cardiology","Neurology","Neurosurgery","Oncology","Orthopedics","ENT","Ophthalmology","Dermatology","Pediatrics","Obstetrics & Gynaecology","Urology","Pulmonology","Pathology","Radiology","Dialysis","Emergency & Critical Care"],note:"Campus is outside the central city area; confirm travel route, department and appointment details."},
 {name:"Aditya Lifeline Hospital",area:"318, Usha Nagar, Indore 452009",type:"Private multispecialty hospital",phone:"0731-2483311 (verify before calling)",website:"https://adityahospitalindore.com/",specialties:["Cardiology","Vascular Surgery","Dermatology","Gastroenterology","General Medicine","General Surgery","Neurology","Neonatology","Pediatrics","Nephrology","Orthopedics","ENT","Ophthalmology","Oncology","Urology","Respiratory Medicine","Infectious Diseases","Critical Care"],note:"Departments are based on the hospital's published service page; confirm current availability."},
 {name:"Apple Hospital",area:"15/1 Bhawarkuan Main Road, Transport Nagar, Indore 452008",type:"Private general hospital",phone:"0731-4769900 (verify before calling)",website:"http://applehospitalindore.com/",specialties:["General Medicine","General Surgery","Emergency care","Diagnostics","Multispecialty consultations"],note:"Government directory listing provides the address; verify the exact specialty and clinic before visiting."},
 {name:"Medicare Hospital & Research Centre",area:"4/5 Old Palasia, Ravindra Nagar, Indore 452018",type:"Private multispecialty hospital",phone:"0731-4271600 (verify before calling)",website:"https://medicareindore.com/specialties/",specialties:["Anesthesiology","Critical Care","Dentistry","ENT","Gastroenterology","General & Laparoscopic Surgery","Gynecology & Obstetrics","Internal Medicine","Neurology & Neurosurgery","Oncology & Oncosurgery","Orthopedics & Joint Replacement","Pathology","Pediatric Surgery","Psychiatry","Pulmonology","Urology","Vascular Surgery"],note:"Published specialties page; confirm availability for the required consultation."},
 {name:"Medi-Square Hospital",area:"9 Vishnupuri, Bhanwarkua Square, AB Road, Indore 452014",type:"Hospital / orthopedics and acute care",phone:"0731-4224018 (verify before calling)",website:"https://www.medisquarehospital.com/",specialties:["Orthopedics","Joint Replacement","Trauma & Acute Care","Pain Management","Dermatology"],note:"Public listing identifies the Vishnupuri/Bhanwarkua location. Verify all other services directly."},
 {name:"Bhandari Hospital & Research Centre",area:"21–23 GF, Scheme No. 54, opposite Meghdoot Garden, Indore 452010",type:"Private multispecialty hospital",phone:"Confirm on official website",website:"http://www.bhrcindia.com/",specialties:["Cardiology","Chemotherapy / Oncology","Critical Care","Dentistry","ENT","General Surgery","Gastroenterology","Nephrology & Urology","Neurology","Neurosurgery","Obstetrics & Gynaecology","Ophthalmology","Orthopedics","Pediatrics"],note:"Area from public government directory; verify the currently offered specialties and contacts."},
 {name:"V One Hospital",area:"2/1 AB Road, near Geeta Bhawan Chouraha, Indore 452001",type:"Private multispecialty and emergency hospital",phone:"0731-3588888 (verify before calling)",website:"https://vonehospital.com/",specialties:["Cardiology","Cardiac Emergency","Trauma & Emergency","Critical Care","Multispecialty consultations"],note:"Confirm department-specific service and current appointment availability."},
 {name:"Dolphin Hospital",area:"Lantern Square, Yeshwant Niwas Road, opposite SGSITS, Indore 452003",type:"Mother & child hospital",phone:"0731-4650010 (verify before calling)",website:"https://dolphinhospital.com/",specialties:["Obstetrics & Gynaecology","Maternity","Neonatology","Newborn care","Pediatrics","Pediatric Surgery"],note:"Focused on maternity, newborn and child health; confirm service availability and timings."},
 {name:"Centre For Sight — Vijay Nagar",area:"Plot No. 124, Sector A/B, Scheme No. 54, Vijay Nagar, Indore 452010",type:"Eye hospital / ophthalmology centre",phone:"Use official branch contact page",website:"https://www.centreforsight.net/",specialties:["Ophthalmology","Cataract","Glaucoma","Retina","Cornea","Dry Eye","LASIK / refractive evaluation","Pediatric Ophthalmology"],note:"Eye-care specialties based on the published centre listing; confirm the branch's available procedures."},
 {name:"Raja Eye & Retina Research Centre",area:"152 Kanchan Bagh, Indore",type:"Eye hospital / retina centre",phone:"0731-2511333 (verify before calling)",website:"http://www.rajaseyehospital.in/",specialties:["Ophthalmology","Retina care","Eye diagnostics"],note:"Listed in the district directory. Confirm current address, specialists and services."},
 {name:"Kokilaben Dhirubhai Ambani Hospital, Indore",area:"Indore — verify exact current branch address before travel",type:"Multispecialty hospital with cancer and specialty centres",phone:"0731-4811111 (verify before calling)",website:"https://indore.kokilabenhospital.com/",specialties:["Cancer Care","Cardiac Sciences","Neurosciences","Bone & Joint","Mother & Child","Ophthalmology","ENT","Dentistry","Dermatology","Endocrinology","Gastroenterology","Gynaecology & Obstetrics","Internal Medicine","Nephrology","Psychiatry","Pulmonary Medicine","Urology","Critical Care","Radiology","Pain & Palliative Care"],note:"Specialties based on the hospital's published Indore department directory. Confirm exact address and department availability."},
 {name:"HCG Cancer Centre Indore",area:"Phadnis Colony / LIG Square area (confirm exact address before travel)",type:"Dedicated cancer centre",phone:"Use official centre contact page",website:"https://www.hcghospitals.com/our-centres/hcg-cancer-hospital-indore",specialties:["Medical Oncology","Surgical Oncology","Radiation Oncology","Cancer diagnostics","Multidisciplinary cancer consultation"],note:"Cancer-focused facility. Confirm cancer type-specific services, doctors, timings and costs directly."},
 {name:"ASG Eye Hospital — Indore branches",area:"Multiple locations in Indore; search official branch locator",type:"Eye hospital network",phone:"Use official branch locator",website:"https://asgeyehospital.com/",specialties:["Ophthalmology","Cataract evaluation","Retina","Glaucoma","Cornea","Refractive eye care"],note:"Network listing, not a single branch address. Select and verify the exact Indore branch before travel."},
 {name:"MediPlus Hospital & Research Centre",area:"166 Nyay Nagar Main Road, Sukhlia, Indore 452010",type:"Private hospital",phone:"Confirm through official directory",website:"https://indore.nic.in/en/public-utility-category/private-hospital/",specialties:["General hospital services — confirm departments directly"],note:"Listed in the district private-hospital directory; department-specific details need confirmation."},
 {name:"Lifeline Hospital",area:"14 LIG Square, Agra Bombay Road, Anoop Nagar, Indore 452008",type:"Private hospital",phone:"0731-2443400 (verify before calling)",website:"https://indore.nic.in/en/public-utility-category/private-hospital/",specialties:["Hospital services — confirm departments directly"],note:"Listed in the district private-hospital directory; verify current details."},
 {name:"Alhayat Hospital",area:"Khajrana Main Road, near Zam Zam Chauraha, Indore 452016",type:"Private hospital",phone:"Confirm through official directory",website:"https://indore.nic.in/en/public-utility-category/private-hospital/",specialties:["Hospital services — confirm departments directly"],note:"Address based on the district directory; verify current services and contacts."},
 {name:"Anand Hospital & Research Centre",area:"7 Sindhu Nagar, Bhanwar Kuan Main Road, near Juni Indore ROB",type:"Private hospital",phone:"0731-4078485 (verify before calling)",website:"https://indore.nic.in/en/public-utility-category/private-hospital/",specialties:["Hospital services — confirm departments directly"],note:"Listed in the district directory; confirm the required department before visiting."}
];

const initialData = {
  patients: samplePatients,
  appointments: [
    {id:"APT-1042", patient:"Aarav Sharma", department:"Cardiology", doctor:"Dr. Meera Nair", date:dateISO(today), time:"10:30 AM", status:"Confirmed", createdAt:Date.now()-3600000},
    {id:"APT-1043", patient:"Ananya Patel", department:"Dermatology", doctor:"Dr. Rohan Shah", date:dateISO(today), time:"11:00 AM", status:"Confirmed", createdAt:Date.now()-2400000},
    {id:"APT-1044", patient:"Kabir Verma", department:"Orthopedics", doctor:"Dr. Neha Joshi", date:dateISO(tomorrow), time:"02:00 PM", status:"Pending", createdAt:Date.now()-900000}
  ],
  tickets: [
    {id:"TKT-2081", patient:"Riya Gupta", topic:"Insurance desk callback", priority:"Normal", status:"Open", createdAt:Date.now()-7200000},
    {id:"TKT-2082", patient:"Dev Malhotra", topic:"Appointment reschedule request", priority:"High", status:"Needs staff", createdAt:Date.now()-1800000}
  ],
  leads: [
    {id:"LED-3011", patient:"Ishita Rao", interest:"Annual health check-up", contact:"Not provided", status:"New", createdAt:Date.now()-5000000}
  ],
  escalations: [
    {id:"ESC-4011", patient:"Dev Malhotra", reason:"Patient requested staff assistance", status:"Needs staff", createdAt:Date.now()-1800000}
  ]
};
function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return initialData;
}
const departmentNames = [
 "General Medicine","Family Medicine","General Surgery","Laparoscopic Surgery","Emergency Medicine","Trauma Care","Critical Care / ICU",
 "Cardiology","Cardiothoracic & Vascular Surgery","Neurology","Neurosurgery","Orthopedics","Spine Surgery","Joint Replacement",
 "Ophthalmology (Eye Care)","ENT (Ear, Nose & Throat)","Dermatology (Skin)","Dentistry & Oral Surgery","Obstetrics & Gynaecology","Fertility / Reproductive Medicine",
 "Pediatrics (Child Health)","Neonatology (Newborn Care)","Gastroenterology","Hepatology","Nephrology (Kidney)","Urology","Pulmonology / Respiratory Medicine",
 "Oncology (Cancer Care)","Medical Oncology","Surgical Oncology","Radiation Oncology","Haematology","Bone Marrow Transplant","Endocrinology & Diabetes",
 "Psychiatry","Psychology / Counselling","Clinical Immunology & Rheumatology","Infectious Diseases","Physical Medicine & Rehabilitation","Physiotherapy",
 "Pain & Palliative Care","Anaesthesiology","Radiology & Imaging","Interventional Radiology","Nuclear Medicine / PET Imaging","Pathology & Laboratory Medicine",
 "Blood Bank / Transfusion Medicine","Nutrition & Dietetics","Vascular Surgery","Plastic & Reconstructive Surgery","Pediatric Surgery","Pediatric Cardiology",
 "Geriatric Medicine","Sleep Medicine","Audiology & Speech Therapy","Breast Clinic","Burns Care","Dialysis","Transplant Services"
];
// Appointment slots and clinician labels are fictional demo values, not real hospital schedules or named doctors.
const departments = departmentNames.map((name,i)=>({
 name,
 doctor:"Demo clinician (not a real doctor)",
 slots:["09:30 AM","11:00 AM","02:00 PM","04:00 PM"]
}));

const faqs = [
  {q:"What are your OPD hours?", a:"Our demo OPD hours are Monday to Saturday, 9:00 AM–5:00 PM. Please confirm actual hours with hospital staff."},
  {q:"Where is the hospital?", a:"This demo represents CareFlow General Hospital. Replace this sample information with your hospital's verified address before real use."},
  {q:"What should I bring?", a:"For a routine appointment, bring your appointment confirmation and any documents requested by hospital staff. Please do not share sensitive medical records in this demo."},
  {q:"How do I contact a human?", a:"I can create a staff follow-up ticket for you. If this is a medical emergency, contact local emergency services or go to the nearest emergency department immediately."},
  {q:"What departments are available?", a:"The directory covers general medicine and surgery, eye care, ENT, skin, heart, brain and nerve care, orthopedics, women’s health, pediatrics, kidney, urinary, lung, digestive, cancer, mental health, diagnostics, rehabilitation, emergency and many other specialties. This list describes specialties to search for, not a guarantee that every hospital offers every department."}
];
const idFor = (prefix, list) => `${prefix}-${String(Math.max(1000, ...list.map(x => Number((x.id||"").split("-")[1])||0)+1))}`;
const fmtTime = () => new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
const prettyDay = (d) => d === dateISO(today) ? "today" : d === dateISO(tomorrow) ? "tomorrow" : dateLabel(d);

function getHospitalDirectoryAnswer(text, hindi=false) {
  const q = String(text||"").toLowerCase();
  const aliases = {
    "ophthalmology (eye care)": ["eye","eyes","ophthalmology","ophthalmologist","आंख","आँख","नेत्र","eye hospital"],
    "ent (ear, nose & throat)": ["ent","ear","nose","throat","कान","नाक","गला"],
    "dermatology (skin)": ["dermatology","skin","skin doctor","त्वचा"],
    "cardiology": ["cardiology","cardiologist","heart","दिल","हृदय"],
    "orthopedics": ["orthopedic","orthopaedic","bone","joint","हड्डी","जोड़"],
    "obstetrics & gynaecology": ["gynaecology","gynecology","gynaecologist","gynecologist","maternity","pregnancy","महिला","गर्भावस्था"],
    "pediatrics (child health)": ["pediatric","paediatric","child hospital","children hospital","बच्चों"],
    "oncology (cancer care)": ["oncology","oncologist","cancer","कैंसर"],
    "nephrology (kidney)": ["nephrology","kidney","dialysis","गुर्दा","किडनी"],
    "neurology": ["neurology","neurologist","brain","nerve","दिमाग"],
    "dentistry & oral surgery": ["dentist","dental","teeth","दांत","दाँत"],
    "psychiatry": ["psychiatry","psychiatrist","mental health","मानसिक स्वास्थ्य"],
    "gastroenterology": ["gastroenterology","stomach","digestive","पेट"]
  };
  const matchedDepartments = departmentNames.filter(d => {
    const dl=d.toLowerCase();
    if (q.includes(dl)) return true;
    return (aliases[dl]||[]).some(a=>q.includes(a));
  });
  const areaTerms = ["vijay nagar","scheme 54","scheme no. 54","lig square","rss nagar","palasia","old palasia","bhawarkua","bhanwarkua","vishnupuri","usha nagar","transport nagar","mth compound","m.y. hospital","manik bagh","khajrana","sukhlia","nyay nagar","bengali square","rajas eye","kanchan bagh","scheme 74c","scheme no. 74c","nemawar road","khudel","bhawrasla","mr-10","ring road","tulsi nagar","scheme 94","scheme 114","phadnis colony","anoop nagar","yashwant niwas","geeta bhawan"];
  const requestedAreas = areaTerms.filter(a=>q.includes(a));
  const wantsAreaList = /(near|nearby|in the area|area|locality|location|where|address|around|in indore|इंदौर में|पास|इलाके|क्षेत्र|कहाँ|कहां|पता|लोकेशन)/i.test(q);
  let matchedHospitals = hospitals.filter(h => {
    const textHaystack = `${h.name} ${h.area} ${h.type} ${(h.specialties||[]).join(" ")}`.toLowerCase();
    const areaHit = requestedAreas.some(a=>textHaystack.includes(a));
    const deptHit = matchedDepartments.some(d=>textHaystack.includes(d.toLowerCase()) || (d.includes("Ophthalmology") && /eye|ophthalmology|ophthalmologist/i.test(textHaystack)));
    const exactNameHit = q.split(/[^a-z0-9]+/).filter(t=>t.length>3).some(t=>h.name.toLowerCase().includes(t));
    const wantsHospitalType = /(government|govt|sarkari|eye hospital|eye centre|eye center|children hospital|maternity|cancer hospital|cancer centre|cancer center|multispecialty|multi-speciality|सरकारी|आंख|नेत्र|कैंसर)/i.test(q);
    const typeHit = wantsHospitalType && (h.type.toLowerCase().includes("government") && /government|govt|sarkari|सरकारी/i.test(q) || h.type.toLowerCase().includes("eye") && /eye|आंख|नेत्र/i.test(q) || h.type.toLowerCase().includes("cancer") && /cancer|कैंसर/i.test(q) || h.type.toLowerCase().includes("mother") && /maternity|children|child|मातृत्व|बच्चों/i.test(q));
    return (requestedAreas.length ? areaHit : false) || (matchedDepartments.length ? deptHit : false) || exactNameHit || typeHit;
  });
  if (!matchedHospitals.length && (matchedDepartments.length || requestedAreas.length || /(hospital|hospitals|department|specialit|doctor|clinic|इंदौर में अस्पताल|अस्पताल|विभाग)/i.test(q))) {
    matchedHospitals = hospitals.filter(h => !matchedDepartments.length || matchedDepartments.some(d=>(h.specialties||[]).some(sp=>sp.toLowerCase().includes(d.toLowerCase().replace(" (eye care)","").replace(" (skin)","").replace(" (kidney)","")))));
  }
  const isDirectoryQuestion = matchedDepartments.length>0 || requestedAreas.length>0 || /(list.*hospital|hospitals? in indore|hospital directory|all hospitals|departments available|all departments|medical departments|eye hospital|cancer hospital|government hospital|अस्पतालों की सूची|सभी अस्पताल|कौन से अस्पताल|कौनसे अस्पताल|कौन से विभाग|विभागों की सूची|नेत्र अस्पताल)/i.test(q);
  if (!isDirectoryQuestion) return null;
  const unique = [...new Map(matchedHospitals.map(h=>[h.name,h])).values()].slice(0,12);
  if (matchedDepartments.length && !requestedAreas.length && unique.length) {
    const wanted = matchedDepartments.map(d=>d.replace(/\s*\([^)]*\)/g, ""));
    const list = unique.map(h=>`• **${h.name}** — ${h.area}\n  Services listed: ${(h.specialties||[]).filter(s=>wanted.some(d=>s.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(s.toLowerCase()))).join(", ") || "Check the hospital's official service list"}\n  Website: ${h.website}`).join("\n\n");
    return (hindi?`**इंदौर में संबंधित अस्पतालों की संदर्भ सूची**\n\n`:`**Indore hospital directory — relevant results**\n\n`)+list+`\n\n${hindi?"यह क्यूरेटेड सूची है, सभी अस्पतालों की पूर्ण सरकारी सूची नहीं। क्षेत्र/सेवाएँ और डॉक्टर की उपलब्धता बदल सकती हैं; जाने से पहले आधिकारिक वेबसाइट या फोन से पुष्टि करें।":"This is a curated reference list, not a complete official registry. Confirm the exact branch, services, doctor availability, timings and address directly before travelling."}`;
  }
  if (unique.length) {
    const list=unique.map(h=>`• **${h.name}** — ${h.area}\n  Type: ${h.type}\n  Services listed: ${(h.specialties||[]).slice(0,10).join(", ")}${(h.specialties||[]).length>10?", and more":""}\n  Phone: ${h.phone}\n  Website: ${h.website}`).join("\n\n");
    return (hindi?`**इंदौर अस्पताल निर्देशिका — संबंधित परिणाम**\n\n`:`**Indore hospital directory — matching results**\n\n`)+list+`\n\n${hindi?"यह सार्वजनिक वेबसाइटों और जिला निर्देशिका पर आधारित क्यूरेटेड सूची है, इंदौर के हर अस्पताल की गारंटीशुदा पूर्ण सूची नहीं। फोन, पता, विभाग, डॉक्टर और OPD समय सीधे अस्पताल से सत्यापित करें।":"This is a curated directory based on public government listings and hospital-published pages, not a guaranteed complete list of every hospital in Indore. Verify phone numbers, exact addresses, departments, doctors and OPD hours directly with each hospital."}`;
  }
  if (matchedDepartments.length) return (hindi?"इन विभागों के लिए वर्तमान अस्पताल/डॉक्टर की उपलब्धता ऑनलाइन सूची से निश्चित नहीं हो सकी: ":"I couldn't verify a matching facility in this curated directory for: ")+matchedDepartments.join(", ")+". Please check the official hospital directory or contact a hospital directly.";
  return hindi ? "मैं इस क्यूरेटेड सूची में उस क्षेत्र के अस्पताल की पुष्टि नहीं कर पाया। कृपया क्षेत्र का नाम या विभाग बताएं; सूची पूर्ण नहीं है।" : "I couldn't confirm a matching hospital in this curated directory. Please specify the Indore area or department; this list is not exhaustive.";
}

function IconButton({children, onClick, title, className=""}) {
  return <button className={`icon-button ${className}`} onClick={onClick} title={title}>{children}</button>;
}
function Badge({children, tone="blue"}) { return <span className={`badge ${tone}`}>{children}</span>; }
function renderInlineMarkdown(text, keyPrefix = "inline") {
  const tokenPattern = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*\n]+\*|_[^_\n]+_|`[^`]+`|https?:\/\/[^\s]+)/g;
  const tokens = String(text ?? "").split(tokenPattern).filter(Boolean);
  return tokens.map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    if (/^https?:\/\//i.test(token)) {
      const cleanUrl = token.replace(/[),.!?;:]+$/, "");
      const trailing = token.slice(cleanUrl.length);
      return <React.Fragment key={key}><a href={cleanUrl} target="_blank" rel="noreferrer">{cleanUrl}</a>{trailing}</React.Fragment>;
    }
    if (/^\*\*[\s\S]+\*\*$/.test(token) || /^__[\s\S]+__$/.test(token)) return <strong key={key}>{token.slice(2, -2)}</strong>;
    if (/^\*[^*]+\*$/.test(token) || /^_[^_]+_$/.test(token)) return <em key={key}>{token.slice(1, -1)}</em>;
    if (/^`[^`]+`$/.test(token)) return <code key={key}>{token.slice(1, -1)}</code>;
    return <React.Fragment key={key}>{token}</React.Fragment>;
  });
}

function renderMessageText(text) {
  const lines = String(text ?? "").replace(/\r\n?/g, "\n").split("\n");
  const blocks = [];
  let paragraph = [];
  let listItems = [];
  let listType = null;
  const flushParagraph = () => {
    if (!paragraph.length) return;
    const blockIndex = blocks.length;
    blocks.push(<p key={`p-${blockIndex}`} style={{ margin: "0 0 10px", lineHeight: 1.65 }}>
      {paragraph.map((line, i) => <React.Fragment key={i}>{i > 0 && " "}{renderInlineMarkdown(line, `p-${blockIndex}-${i}`)}</React.Fragment>)}
    </p>);
    paragraph = [];
  };
  const flushList = () => {
    if (!listItems.length) return;
    const Tag = listType === "ol" ? "ol" : "ul";
    const blockIndex = blocks.length;
    blocks.push(<Tag key={`list-${blockIndex}`} style={{ margin: "0 0 12px", paddingLeft: 23, lineHeight: 1.65 }}>
      {listItems.map((item, i) => <li key={i} style={{ marginBottom: 4 }}>{renderInlineMarkdown(item, `list-${blockIndex}-${i}`)}</li>)}
    </Tag>);
    listItems = [];
    listType = null;
  };
  lines.forEach(rawLine => {
    const line = rawLine.trim();
    if (!line) { flushParagraph(); flushList(); return; }
    const heading = line.match(/^#{1,3}\s+(.+)$/);
    if (heading) {
      flushParagraph(); flushList();
      const level = line.match(/^#+/)[0].length;
      const Tag = level === 1 ? "h3" : level === 2 ? "h4" : "h5";
      blocks.push(<Tag key={`h-${blocks.length}`} style={{ margin: "4px 0 8px", fontSize: level === 1 ? 17 : level === 2 ? 15 : 14, fontWeight: 700 }}>{renderInlineMarkdown(heading[1], `h-${blocks.length}`)}</Tag>);
      return;
    }
    const bullet = line.match(/^(?:[-*•]|\u2022)\s+(.+)$/);
    const numbered = line.match(/^\d+[.)]\s+(.+)$/);
    if (bullet || numbered) {
      flushParagraph();
      const nextType = numbered ? "ol" : "ul";
      if (listType && listType !== nextType) flushList();
      listType = nextType;
      listItems.push((bullet || numbered)[1]);
      return;
    }
    flushList();
    paragraph.push(line);
  });
  flushParagraph();
  flushList();
  return <>{blocks}</>;
}

function stripMarkdownForSpeech(text) {
  return String(text ?? "")
    .replace(/https?:\/\/\S+/gi, " link provided ")
    .replace(/```[\s\S]*?```/g, " code omitted ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*(?:[-*•]|\u2022)\s+/gm, "")
    .replace(/^\s*\d+[.)]\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "$1")
    .replace(/_([^_\n]+)_/g, "$1")
    .replace(/[>#~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function App() {
  const [data, setData] = useState(loadData);
  const [page, setPage] = useState("Overview");
  const [query, setQuery] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [toast, setToast] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem("careflow-theme") === "dark" ? "dark" : "light"; } catch { return "light"; } });
  useEffect(() => { try { localStorage.setItem("careflow-theme", theme); } catch {} }, [theme]);
  const [messages, setMessages] = useState([
    {from:"bot", text:"Hello! I'm CareFlow AI, your hospital operations assistant. I can search a curated Indore hospital directory by area and specialty, explain a broad range of medical departments, help start demo appointment requests, record inquiries, create support tickets, and flag requests for staff follow-up. I use sample data only and cannot confirm real hospital services or bookings. How can I help today?", time:fmtTime()}
  ]);
  const [draft, setDraft] = useState("");
  const [language, setLanguage] = useState("en");
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("register");
  const [currentPatient, setCurrentPatient] = useState(() => { try { return JSON.parse(localStorage.getItem("careflow-current-patient") || "null"); } catch { return null; } });
  const [booking, setBooking] = useState({patient:"", department:"Cardiology", date:dateISO(tomorrow), time:"10:30 AM"});
  const [ticketForm, setTicketForm] = useState({patient:"", topic:""});
  const [leadForm, setLeadForm] = useState({patient:"", interest:"", contact:""});
  const chatEnd = useRef(null);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }, [data]);
  useEffect(() => { chatEnd.current?.scrollIntoView({behavior:"smooth"}); }, [messages]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const totalItems = data.appointments.length + data.tickets.length + data.leads.length;
  const todaysAppointments = data.appointments.filter(a => a.date === dateISO(today)).length;
  const openTickets = data.tickets.filter(t => t.status !== "Resolved").length;
  const needsStaff = data.escalations.filter(e => e.status !== "Resolved").length;
  const recentActivity = useMemo(() => [
    ...data.appointments.map(x=>({...x,kind:"Appointment",label:`Appointment booked — ${x.patient}`,when:x.createdAt})),
    ...data.tickets.map(x=>({...x,kind:"Ticket",label:`Support ticket created — ${x.patient}`,when:x.createdAt})),
    ...data.leads.map(x=>({...x,kind:"Lead",label:`New inquiry — ${x.patient}`,when:x.createdAt}))
  ].sort((a,b)=>b.when-a.when).slice(0,5), [data]);

  function updateData(key, updater) {
    setData(prev => ({...prev, [key]: typeof updater === "function" ? updater(prev[key]) : updater}));
  }
  function notify(text) { setToast(text); }
  function addBot(text) { setMessages(prev => [...prev, {from:"bot", text, time:fmtTime()}]); }
  function addUser(text) { setMessages(prev => [...prev, {from:"user", text, time:fmtTime()}]); }

  function createAppointment({patient, department, date, time}) {
    const dept = departments.find(d=>d.name===department) || departments[0];
    const conflict = data.appointments.some(a=>a.date===date && a.time===time && a.department===department && a.status!=="Cancelled");
    if (conflict) return {ok:false, message:`That ${time} slot in ${department} is already booked in this demo. Please choose another slot.`};
    const appt = {id:idFor("APT",data.appointments), patient:patient.trim(), department, doctor:dept.doctor, date, time, status:"Confirmed", createdAt:Date.now()};
    updateData("appointments", list=>[appt,...list]);
    return {ok:true, appt};
  }
  function createTicket({patient,topic,priority="Normal",status="Open"}) {
    const t = {id:idFor("TKT",data.tickets), patient:patient.trim()||"Patient (not provided)", topic:topic.trim(), priority, status, createdAt:Date.now()};
    updateData("tickets", list=>[t,...list]);
    return t;
  }
  function createLead({patient,interest,contact}) {
    const l = {id:idFor("LED",data.leads), patient:patient.trim()||"Patient (not provided)", interest:interest.trim(), contact:contact.trim()||"Not provided", status:"New", createdAt:Date.now()};
    updateData("leads", list=>[l,...list]);
    return l;
  }
  function createEscalation(patient, reason) {
    const e = {id:idFor("ESC",data.escalations), patient:patient||"Patient (not provided)", reason, status:"Needs staff", createdAt:Date.now()};
    updateData("escalations", list=>[e,...list]);
    const t = createTicket({patient:e.patient,topic:`Staff escalation: ${reason}`,priority:"High",status:"Needs staff"});
    return {e,t};
  }

  async function askGemini(text, answerInHindi = language === "hi") {
    const loadingText = answerInHindi ? "सोच रहा हूँ..." : "Thinking...";
    addBot(loadingText);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          language: answerInHindi ? "hi" : "en",
          context: {
            currentPage: page,
            departments: departments.map(d => ({ name: d.name, doctor: d.doctor, slots: d.slots })),
            hospitalDirectory: hospitals.map(h => ({ name: h.name, area: h.area, type: h.type, phone: h.phone, website: h.website, specialties: h.specialties, note: h.note })),
            availableDepartments: departmentNames,
            directoryLastReviewed,
            faqs,
            demoOnly: true,
            responseInstructions: "Answer directly and naturally using the supplied demo data. Never show raw Markdown markers; if formatting is useful, use standard Markdown headings, bold labels, and short bullet lists. Use the supplied Indore hospital directory and specialty list. Distinguish published specialty references from verified real-time availability. Do not claim this directory is exhaustive. Do not invent hospital hours, prices, availability, addresses, or contact details. State when information is only sample/demo data. Do not diagnose or prescribe. For emergency symptoms, direct the user to local emergency services."
          }
        })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "AI request failed");
      setMessages(prev => {
        const next = [...prev];
        const idx = next.findIndex(m => m.from === "bot" && m.text === loadingText);
        if (idx >= 0) next[idx] = { from: "bot", text: payload.reply, time: fmtTime() };
        else next.push({ from: "bot", text: payload.reply, time: fmtTime() });
        return next;
      });
    } catch (error) {
      setMessages(prev => {
        const next = [...prev];
        const idx = next.findIndex(m => m.from === "bot" && m.text === loadingText);
        const fallback = answerInHindi
          ? "Gemini से अभी संपर्क नहीं हो पाया। कृपया API key और सर्वर जाँचें। आप अपॉइंटमेंट, टिकट या स्टाफ सहायता के लिए सुझाए गए विकल्प भी चुन सकते हैं।"
          : "I couldn't reach Gemini just now. Please check that the API key is configured and the server is running. You can still use the appointment, ticket, and staff-support workflows.";
        if (idx >= 0) next[idx] = { from: "bot", text: fallback, time: fmtTime() };
        else next.push({ from: "bot", text: fallback, time: fmtTime() });
        return next;
      });
    }
  }

  function respondTo(text, answerInHindi = language === "hi") {
    const lower = text.toLowerCase();
    const hindi = answerInHindi || /[\u0900-\u097F]/.test(text);
    const directoryAnswer = getHospitalDirectoryAnswer(text, hindi);
    if (directoryAnswer) { addBot(directoryAnswer); return; }
    if (/(cancer|oncology|tumou?r|कैंसर|कॅन्सर|ऑन्कोलॉजी|ट्यूमर|tumor treatment)/i.test(text)) {
      const answer = hindi
        ? "इंदौर में कैंसर के इलाज के लिए कोई एक अस्पताल हर मरीज के लिए ‘सबसे अच्छा’ नहीं कहा जा सकता। सही विकल्प कैंसर के प्रकार, स्टेज, बायोप्सी/रिपोर्ट, डॉक्टर की विशेषज्ञता, इलाज की उपलब्धता, खर्च और बीमा पर निर्भर करता है। आप इन केंद्रों से ऑन्कोलॉजी परामर्श और दूसरी राय ले सकते हैं:\n\n• HCG Cancer Centre, Phadnis Colony / LIG Square — मेडिकल, सर्जिकल और रेडिएशन ऑन्कोलॉजी; वेबसाइट: https://www.hcghospitals.com/our-centres/hcg-cancer-hospital-indore\n• Apollo Hospitals, Vijay Nagar — कई प्रकार के कैंसर की जाँच और उपचार; वेबसाइट: https://www.apollohospitals.com/cancer-treatment-centres/cancer-hospital/indore/\n• CARE CHL / International Oncology Cancer Institute, Scheme 114 — कैंसर विशेषज्ञ सेवाएँ; वेबसाइट: https://www.carehospitals.com/indore/speciality/cancer-hospital-in-indore\n• Kokilaben Dhirubhai Ambani Hospital, Indore — कैंसर देखभाल और मल्टीडिसिप्लिनरी टीम; वेबसाइट: https://indore.kokilabenhospital.com/departments/centresofexcellence/cancer.html\n\nक्या करें: अपनी बायोप्सी रिपोर्ट, स्कैन, पैथोलॉजी रिपोर्ट और पहले के इलाज की फाइल लेकर मेडिकल/सर्जिकल/रेडिएशन ऑन्कोलॉजिस्ट से मिलें। पूछें कि आपके कैंसर के लिए कौन-से विकल्प उपयुक्त हैं, अनुमानित खर्च कितना है और क्या दूसरी राय लेना उपयोगी होगा। वेबसाइट/फोन पर वर्तमान डॉक्टर, सेवाएँ, समय और खर्च की पुष्टि करें। मैं निदान या इलाज तय नहीं कर सकता, लेकिन अपॉइंटमेंट या स्टाफ कॉलबैक अनुरोध दर्ज करने में मदद कर सकता हूँ।"
        : "There isn't one hospital that is best for every cancer patient. The right choice depends on cancer type and stage, biopsy/pathology results, specialist expertise, available treatment, cost, and insurance. You can contact these Indore centres for an oncology consultation or second opinion:\n\n• HCG Cancer Centre, Phadnis Colony / LIG Square — medical, surgical and radiation oncology. https://www.hcghospitals.com/our-centres/hcg-cancer-hospital-indore\n• Apollo Hospitals, Vijay Nagar — oncology services across several cancer types. https://www.apollohospitals.com/cancer-treatment-centres/cancer-hospital/indore/\n• CARE CHL / International Oncology Cancer Institute, Scheme 114 — oncology services. https://www.carehospitals.com/indore/speciality/cancer-hospital-in-indore\n• Kokilaben Dhirubhai Ambani Hospital, Indore — cancer care with a multidisciplinary team. https://indore.kokilabenhospital.com/departments/centresofexcellence/cancer.html\n\nBring biopsy/pathology reports, scans and prior treatment records. Ask an oncologist which options fit this specific diagnosis, expected costs, insurance coverage, and whether a second opinion would help. Please verify current doctors, services, hours and fees directly with the hospital. I can't diagnose or choose treatment, but I can help record an appointment or staff callback request.";
      addBot(answer); return;
    }
    if (/(आपातकाल|सांस नहीं|साँस नहीं|सीने में दर्द|बहुत खून|बेहोश|emergency|can't breathe|cannot breathe|chest pain|severe bleeding|unconscious)/i.test(text)) {
      addBot(hindi ? "यह आपात स्थिति हो सकती है। कृपया तुरंत स्थानीय आपातकालीन सेवा से संपर्क करें या नज़दीकी इमरजेंसी विभाग जाएँ। इस डेमो चैट के जवाब का इंतज़ार न करें। मैं आपातकालीन उपचार या निदान नहीं कर सकता।" : "Your safety comes first. I can't assess symptoms or provide emergency care. Please contact local emergency services or go to the nearest emergency department now. Don't wait for this demo system in an emergency.");
      return;
    }
    if (/(\b(book|appointment|schedule|see a doctor|consultation)\b|अपॉइंटमेंट|मुलाकात|डॉक्टर से मिलना|बुक कर|डॉक्टर को दिखाना)/i.test(text)) {
      const dept = departments.find(d=>lower.includes(d.name.toLowerCase())) ||
        (/(heart|cardio|दिल|हृदय|कार्डियोलॉजी)/i.test(text) ? departments.find(d=>d.name === "Cardiology") :
         /(eye|eyes|ophthalm|आंख|आँख|नेत्र)/i.test(text) ? departments.find(d=>d.name.startsWith("Ophthalmology")) :
         /(skin|dermatology|त्वचा|स्किन)/i.test(text) ? departments.find(d=>d.name.startsWith("Dermatology")) :
         /(bone|joint|orthop|हड्डी|जोड़)/i.test(text) ? departments.find(d=>d.name === "Orthopedics") :
         /(ear|nose|throat|\bent\b|कान|नाक|गला)/i.test(text) ? departments.find(d=>d.name.startsWith("ENT")) :
         /(child|children|pediatric|paediatric|बच्चों)/i.test(text) ? departments.find(d=>d.name.startsWith("Pediatrics")) :
         /(women|pregnan|maternity|gynecol|gynaecol|गर्भावस्था|महिला)/i.test(text) ? departments.find(d=>d.name.startsWith("Obstetrics")) :
         /(kidney|nephro|dialysis|किडनी|गुर्दा)/i.test(text) ? departments.find(d=>d.name.startsWith("Nephrology")) :
         /(brain|nerve|neuro|दिमाग)/i.test(text) ? departments.find(d=>d.name === "Neurology") :
         /(cancer|oncology|tumou?r|कैंसर)/i.test(text) ? departments.find(d=>d.name === "Oncology (Cancer Care)") :
         /(dentist|dental|teeth|दांत|दाँत)/i.test(text) ? departments.find(d=>d.name.startsWith("Dentistry")) :
         /(mental health|psychiatr|मानसिक स्वास्थ्य)/i.test(text) ? departments.find(d=>d.name === "Psychiatry") :
         /(stomach|digestive|gastro|पेट)/i.test(text) ? departments.find(d=>d.name === "Gastroenterology") : null);
      const chosen = dept || departments.find(d=>d.name === "General Medicine");
      const date = lower.includes("day after tomorrow") ? dateISO(new Date(today.getFullYear(),today.getMonth(),today.getDate()+2)) :
        lower.includes("tomorrow") ? dateISO(tomorrow) : dateISO(today);
      const time = chosen.slots.find(s=>lower.includes(s.toLowerCase())) || chosen.slots[0];
      const nameMatch = text.match(/(?:my name is|i am|i'm|name is)\s+([a-z][a-z .'-]{1,40})/i);
      const patient = nameMatch ? nameMatch[1].trim().replace(/[.!?]+$/,"") : "";
      setBooking({patient,department:chosen.name,date,time});
      if (!patient) {
        addBot(hindi ? `${chosen.name} के लिए डेमो अपॉइंटमेंट अनुरोध में मदद कर सकता हूँ। कृपया खुलने वाले फॉर्म में मरीज का नाम, तारीख और समय भरें। सुझाया गया डेमो स्लॉट: ${prettyDay(date)}, ${time}। यह वास्तविक अस्पताल बुकिंग नहीं है।` : `I can help with a ${chosen.name} appointment. Before I confirm anything, please enter the patient's name in the booking form below. Suggested demo slot: ${prettyDay(date)} at ${time}.`);
        setPage("Appointments");
        setShowNew(true);
      } else {
        const result = createAppointment({patient,department:chosen.name,date,time});
        if (result.ok) addBot(hindi ? `आपका डेमो अपॉइंटमेंट अनुरोध दर्ज हो गया है। पुष्टि ID: ${result.appt.id}। ${patient} के लिए ${chosen.name} विभाग में ${chosen.doctor} के साथ ${prettyDay(date)} को ${time} का स्लॉट दर्ज किया गया है। यह केवल डेमो बुकिंग है, वास्तविक अस्पताल की बुकिंग नहीं।` : `Appointment created successfully! Confirmation ID: ${result.appt.id}. ${patient} is booked with ${chosen.doctor} in ${chosen.name} for ${prettyDay(date)} at ${time}. This is a demo booking; please verify details with hospital staff.`);
        else addBot(hindi ? `यह डेमो स्लॉट पहले से बुक है। कृपया दूसरा समय चुनें।` : result.message);
      }
      return;
    }
    if (/(\b(ticket|complaint|problem|issue|reschedule|cancel|callback|staff|human|person|talk to someone|unresolved)\b|स्टाफ|शिकायत|समस्या|कॉलबैक|कॉल बैक|किसी व्यक्ति से बात|बात करनी है)/i.test(text)) {
      const nameMatch = text.match(/(?:my name is|i am|i'm|name is)\s+([a-z][a-z .'-]{1,40})/i);
      const patient = nameMatch ? nameMatch[1].trim().replace(/[.!?]+$/,"") : "Patient (not provided)";
      const reason = text.length > 140 ? `${text.slice(0,137)}...` : text;
      const {e,t} = createEscalation(patient, reason);
      addBot(hindi ? `मैंने आपका अनुरोध स्टाफ के लिए दर्ज कर दिया है। टिकट ${t.id} और एस्केलेशन ${e.id} डैशबोर्ड में दिखेंगे। यह डेमो वास्तविक स्टाफ को सूचना नहीं भेजता; टीम को डैशबोर्ड देखना होगा।` : `I've flagged this for hospital staff. Ticket ${t.id} has been created with high priority, and escalation ${e.id} is now visible in the staff dashboard. A staff member must review it; this demo does not send a real notification.`);
      return;
    }
    if (/(\b(interested|cost|price|health check|checkup|check-up|package|learn more|call me|contact me)\b|खर्च|कीमत|हेल्थ चेक|स्वास्थ्य जांच|स्वास्थ्य जाँच|पैकेज|संपर्क करें)/i.test(text)) {
      const interest = text.length > 120 ? `${text.slice(0,117)}...` : text;
      const l = createLead({patient:"Patient (not provided)",interest,contact:"Not provided"});
      addBot(hindi ? `धन्यवाद। आपकी पूछताछ ${l.id} के रूप में दर्ज की गई है। संपर्क जानकारी लेने के बाद अस्पताल की टीम फॉलो-अप कर सकती है। यह डेमो वास्तविक कॉल या संदेश नहीं भेजता।` : `Thanks for your interest. I've recorded your inquiry as lead ${l.id}. The hospital team can follow up after contact details are collected. This demo doesn't send an actual call or message.`);
      return;
    }
    if (hindi && /(समय|कब खुल|ओपीडी|opd)/i.test(text)) { addBot("इस डेमो अस्पताल के नमूना OPD समय सोमवार से शनिवार, सुबह 9 बजे से शाम 5 बजे तक हैं। यह वास्तविक अस्पताल का समय नहीं है—जाने से पहले अस्पताल से पुष्टि करें।"); return; }
    if (hindi && /(अस्पताल|हॉस्पिटल|कैंसर सेंटर|कैंसर अस्पताल|इलाज कहाँ|इलाज कहां)/i.test(text)) { addBot("इंदौर में कैंसर उपचार के लिए आप HCG Cancer Centre, Apollo Cancer Centre, CARE CHL / IOCI और Kokilaben Hospital जैसे केंद्रों से जानकारी ले सकते हैं। हर मरीज के लिए एक ही अस्पताल सबसे अच्छा नहीं होता—कैंसर का प्रकार, स्टेज, उपलब्ध विशेषज्ञ, इलाज की सुविधाएँ, खर्च और बीमा देखकर विकल्प चुनें। कृपया वर्तमान सेवाएँ और डॉक्टर की उपलब्धता सीधे अस्पताल से सत्यापित करें।\n\nHCG: https://www.hcghospitals.com/our-centres/hcg-cancer-hospital-indore\nApollo: https://www.apollohospitals.com/cancer-treatment-centres/cancer-hospital/indore/\nCARE CHL / IOCI: https://www.carehospitals.com/indore/speciality/cancer-hospital-in-indore\nKokilaben: https://indore.kokilabenhospital.com/departments/centresofexcellence/cancer.html\n\nअपनी रिपोर्ट के साथ योग्य ऑन्कोलॉजिस्ट से सलाह लें। मैं निदान या इलाज तय नहीं कर सकता, लेकिन अपॉइंटमेंट अनुरोध या स्टाफ कॉलबैक दर्ज करने में मदद कर सकता हूँ।"); return; }
    if (hindi && /(पता|कहाँ|कहां|लोकेशन)/i.test(text)) { addBot("यह CareFlow General का डेमो है, किसी एक वास्तविक अस्पताल का प्रतिनिधित्व नहीं करता। कृपया चुने हुए अस्पताल का वर्तमान पता उसकी आधिकारिक वेबसाइट या फोन से पुष्टि करें।"); return; }
    if (hindi && /(नमूना|क्या कर सकते|मदद|सहायता)/i.test(text)) { addBot("मैं अस्पताल की सामान्य जानकारी दे सकता हूँ, कैंसर केंद्रों की आधिकारिक वेबसाइट साझा कर सकता हूँ, डेमो अपॉइंटमेंट अनुरोध शुरू कर सकता हूँ, पूछताछ दर्ज कर सकता हूँ या स्टाफ कॉलबैक टिकट बना सकता हूँ। मैं निदान या इलाज तय नहीं करता।"); return; }
    const faq = faqs.find(f=>lower.includes(f.q.toLowerCase().replace(/[?]/g,"")) || f.q.toLowerCase().split(" ").some(w=>w.length>4 && lower.includes(w)));
    if (faq && (/\b(hours|time|open|where|address|bring|document|department|service|human|contact)\b/.test(lower))) {
      addBot(faq.a); return;
    }
    if (/(नमस्ते|नमस्कार|हेलो|हाय|कैसे हैं)/i.test(text)) {
      addBot("नमस्ते! मैं CareFlow AI हूँ। मैं अस्पताल की सामान्य जानकारी, अपॉइंटमेंट अनुरोध, कैंसर केंद्रों की संपर्क जानकारी, सेवा संबंधी पूछताछ और स्टाफ कॉलबैक अनुरोध में मदद कर सकता हूँ। आप क्या जानना चाहेंगे?"); return;
    }
    if (/\b(hi|hello|hey|good morning|good afternoon)\b/.test(lower)) {
      addBot("Hello! I can help you book a demo appointment, answer hospital FAQs, share hospital directory information, record a service inquiry, or create a staff support ticket. What would you like to do?"); return;
    }
    askGemini(text, hindi);
  }
  function sendMessage(value=draft) {
    const text = value.trim();
    if (!text) return;
    // Devanagari or common Roman-Hindi phrases switch the whole assistant chat to Hindi.
    const devanagari = /[\u0900-\u097F]/.test(text);
    const romanHindi = /\b(kya|kaise|mujhe|chahiye|batao|bataiye|hai|hain|karna|karni|indore me|ke liye|hospital batao|doctor batao|appointment chahiye)\b/i.test(text);
    const answerInHindi = devanagari || romanHindi || language === "hi";
    if (devanagari || romanHindi) setLanguage("hi");
    addUser(text);
    setDraft("");
    // Keep safety and transaction workflows deterministic; send ordinary questions to Gemini
    // so FAQs and follow-up questions are answered conversationally instead of repeating scripts.
    const emergencyIntent = /(आपातकाल|सांस नहीं|साँस नहीं|सीने में दर्द|बहुत खून|बेहोश|emergency|can't breathe|cannot breathe|chest pain|severe bleeding|unconscious)/i.test(text);
    const appointmentIntent = /(\b(book|appointment|schedule|see a doctor|consultation)\b|अपॉइंटमेंट|मुलाकात|डॉक्टर से मिलना|बुक कर|डॉक्टर को दिखाना)/i.test(text);
    const staffIntent = /(\b(ticket|complaint|problem|issue|reschedule|cancel|callback|staff|human|person|talk to someone|unresolved)\b|स्टाफ|शिकायत|समस्या|कॉलबैक|कॉल बैक|किसी व्यक्ति से बात|बात करनी है)/i.test(text);
    const leadIntent = /(\b(interested|cost|price|health check|checkup|check-up|package|learn more|call me|contact me)\b|खर्च|कीमत|हेल्थ चेक|स्वास्थ्य जांच|स्वास्थ्य जाँच|पैकेज|संपर्क करें)/i.test(text);
    const directoryIntent = /(hospital|hospitals|department|departments|specialit|specialty|specialities|eye hospital|eye doctor|government hospital|near me|nearby|area|locality|address|Indore|इंदौर|अस्पताल|विभाग|नेत्र|आंख|आँख|कैंसर|cardiology|cardiologist|dermatology|orthopedic|gynecology|gynaecology|pediatric|neurology|nephrology|oncology|ENT|dentist|ophthalmology)/i.test(text);
    if (emergencyIntent || appointmentIntent || staffIntent || leadIntent || directoryIntent) {
      respondTo(text, answerInHindi);
    } else {
      askGemini(text, answerInHindi);
    }
  }
  function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { notify(language === "hi" ? "इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है। Chrome आज़माएँ या टाइप करें।" : "Speech recognition isn't supported in this browser. Try Chrome, or use text chat."); return; }
    const rec = new SpeechRecognition();
    rec.lang = language === "hi" ? "hi-IN" : "en-IN"; rec.interimResults = false; rec.maxAlternatives = 1;
    rec.onresult = e => sendMessage(e.results[0][0].transcript);
    rec.onerror = () => notify(language === "hi" ? "वॉइस इनपुट शुरू नहीं हो सका। माइक्रोफ़ोन अनुमति जाँचें या टाइप करें।" : "Voice input could not start. Please use text chat.");
    rec.start();
  }
  function speakLast() {
    if (!("speechSynthesis" in window)) { notify("Text-to-speech isn't supported in this browser."); return; }
    const last = [...messages].reverse().find(m=>m.from==="bot");
    if (!last) return;
    window.speechSynthesis.cancel();
    const spokenText = stripMarkdownForSpeech(last.text);
    if (!spokenText) return;
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = /[\u0900-\u097F]/.test(last.text) || language === "hi" ? "hi-IN" : "en-IN"; window.speechSynthesis.speak(utterance);
  }
  function resetDemo() {
    if (!window.confirm("Reset all CareFlow demo data and restore sample records?")) return;
    localStorage.removeItem(STORAGE_KEY);
    setData(JSON.parse(JSON.stringify(initialData)));
    setMessages([{from:"bot",text:"Demo data has been reset. I'm ready to help with appointments, FAQs, inquiries, or staff follow-up.",time:fmtTime()}]);
    notify("Demo data reset.");
  }
  function resolveEscalation(id) {
    updateData("escalations", list=>list.map(x=>x.id===id?{...x,status:"Resolved"}:x));
    updateData("tickets", list=>list.map(x=>x.topic.startsWith("Staff escalation") && data.escalations.find(e=>e.id===id)?.reason && x.patient===data.escalations.find(e=>e.id===id)?.patient ? {...x,status:"Resolved"} : x));
    notify("Escalation marked resolved.");
  }
  function cancelAppointment(id) {
    updateData("appointments", list=>list.map(x=>x.id===id?{...x,status:"Cancelled"}:x));
    notify("Appointment cancelled in demo.");
  }
  function resolveTicket(id) {
    updateData("tickets", list=>list.map(x=>x.id===id?{...x,status:"Resolved"}:x));
    notify("Ticket marked resolved.");
  }

  const navItems = [
    {name:"Overview", icon:LayoutDashboard},
    {name:"Patients", icon:Users},
    {name:"Hospitals", icon:Building2},
    {name:"Patient Assistant", icon:MessageCircle},
    {name:"Appointments", icon:CalendarDays},
    {name:"Support Tickets", icon:Ticket},
    {name:"Patient Inquiries", icon:Users},
    {name:"Staff Escalations", icon:Headphones}
  ];
  const filteredAppointments = data.appointments.filter(x => `${x.patient} ${x.department} ${x.doctor} ${x.id}`.toLowerCase().includes(query.toLowerCase()));
  const filteredTickets = data.tickets.filter(x => `${x.patient} ${x.topic} ${x.id}`.toLowerCase().includes(query.toLowerCase()));
  const filteredLeads = data.leads.filter(x => `${x.patient} ${x.interest} ${x.id}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className={`app-shell ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      <style>{`
        .app-shell.theme-dark { background:#0b1220; color:#e5edf8; color-scheme:dark; }
        .app-shell.theme-dark .sidebar,.app-shell.theme-dark .topbar { background:#111b2d; border-color:#263449; color:#e5edf8; }
        .app-shell.theme-dark .main-area,.app-shell.theme-dark .page-content { background:#0b1220; color:#e5edf8; }
        .app-shell.theme-dark .panel,.app-shell.theme-dark .welcome-banner,.app-shell.theme-dark .stat-card,
        .app-shell.theme-dark .table-toolbar,.app-shell.theme-dark .chat-panel,.app-shell.theme-dark .modal-card,
        .app-shell.theme-dark .human-card,.app-shell.theme-dark .hospital-switch,.app-shell.theme-dark .activity-card,
        .app-shell.theme-dark .appointment-card,.app-shell.theme-dark .ticket-card,.app-shell.theme-dark .lead-card,
        .app-shell.theme-dark .escalation-card { background:#121e31; border-color:#2a3a50; color:#e5edf8; }
        .app-shell.theme-dark h1,.app-shell.theme-dark h2,.app-shell.theme-dark h3,.app-shell.theme-dark strong,
        .app-shell.theme-dark .brand-name,.app-shell.theme-dark .breadcrumbs,.app-shell.theme-dark label { color:#eef4ff; }
        .app-shell.theme-dark p,.app-shell.theme-dark .muted,.app-shell.theme-dark .brand-sub,
        .app-shell.theme-dark .hospital-info span,.app-shell.theme-dark .page-heading p,.app-shell.theme-dark .page-footer,
        .app-shell.theme-dark .sidebar-foot,.app-shell.theme-dark .nav-label { color:#a7b6ca; }
        .app-shell.theme-dark input,.app-shell.theme-dark select,.app-shell.theme-dark textarea,
        .app-shell.theme-dark .search-box input { background:#0b1424; border-color:#34465f; color:#e5edf8; }
        .app-shell.theme-dark table th { background:#17243a; color:#cbd8e9; }
        .app-shell.theme-dark table td,.app-shell.theme-dark table th { border-color:#2a3a50; }
        .app-shell.theme-dark .nav-item { color:#b8c6d9; }
        .app-shell.theme-dark .nav-item:hover,.app-shell.theme-dark .nav-item.active { background:#1d2d45; color:#f1f6ff; }
        .app-shell.theme-dark a { color:#8cc7ff; }
        .app-shell.theme-dark .auth-trigger,.app-shell.theme-dark .icon-button,.app-shell.theme-dark .theme-toggle { background:#1a2940; border-color:#34465f; color:#e5edf8; }
        .theme-toggle { display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid #dbe3ef;background:#fff;color:#334155;border-radius:10px;padding:9px 11px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap; }
        .theme-toggle:hover { opacity:.88; }
        @media(max-width:760px){.theme-toggle .theme-label{display:none}.theme-toggle{padding:9px}}
      `}</style>
      <aside className={`sidebar ${mobileNav?"open":""}`}>
        <div className="brand">
          <div className="brand-mark"><HeartPulse size={23}/></div>
          <div><div className="brand-name">CareFlow<span> AI</span></div><div className="brand-sub">HOSPITAL OPERATIONS</div></div>
          <IconButton className="mobile-close" onClick={()=>setMobileNav(false)} title="Close menu"><X size={18}/></IconButton>
        </div>
        <div className="hospital-switch">
          <div className="hospital-avatar"><Activity size={19}/></div>
          <div className="hospital-info"><strong>CareFlow General</strong><span>Demo hospital</span></div>
          <ChevronDown size={15} className="muted-icon"/>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {navItems.map(item => {
            const I = item.icon;
            return <button key={item.name} className={`nav-item ${page===item.name?"active":""}`} onClick={()=>{setPage(item.name);setMobileNav(false);setQuery("");}}>
              <I size={18}/><span>{item.name}</span>
              {item.name==="Staff Escalations" && needsStaff>0 && <span className="nav-count">{needsStaff}</span>}
            </button>;
          })}
        </nav>
        <div className="sidebar-spacer"/>
        <div className="human-card">
          <div className="human-card-icon"><ShieldCheck size={18}/></div>
          <div><strong>Human-first care</strong><p>Uncertain requests are routed to staff.</p></div>
        </div>
        <button className="nav-item settings-item" onClick={()=>notify("Settings are not connected in this demo.")}><Settings size={18}/><span>Settings</span></button>
        <div className="sidebar-foot"><span className="online-dot"/> Demo workspace <span className="version">v1.0</span></div>
      </aside>

      {mobileNav && <button className="mobile-scrim" onClick={()=>setMobileNav(false)} aria-label="Close navigation"/>}
      <main className="main-area">
        <header className="topbar">
          <div className="top-left">
            <IconButton className="menu-toggle" onClick={()=>setMobileNav(true)} title="Open menu"><Menu size={20}/></IconButton>
            <div className="breadcrumbs">Workspace <span>/</span> <strong>{page}</strong></div>
          </div>
          <div className="top-actions">
            <button className="theme-toggle" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>{theme === "dark" ? <Sun size={17}/> : <Moon size={17}/>}<span className="theme-label">{theme === "dark" ? "Light mode" : "Dark mode"}</span></button>
            <div className="demo-status"><span className="online-dot"/> Demo environment</div>
            <button className="auth-trigger" onClick={()=>{setAuthMode(currentPatient?"login":"register");setAuthOpen(true);}}><LogIn size={15}/>{currentPatient ? "Patient portal" : "Patient Login / Register"}</button>
            <div className="user-avatar">{currentPatient ? currentPatient.name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase() : "CF"}</div>
          </div>
        </header>
        <div className="page-content">
          {page==="Patients" && <PatientsPage patients={data.patients || samplePatients} query={query} setQuery={setQuery}/>}
          {page==="Hospitals" && <HospitalsPage query={query} setQuery={setQuery}/>}
          {page==="Overview" && <Overview data={data} todaysAppointments={todaysAppointments} openTickets={openTickets} needsStaff={needsStaff} recentActivity={recentActivity} setPage={setPage} setShowNew={setShowNew}/>}
          {page==="Patient Assistant" && <ChatPage messages={messages} draft={draft} setDraft={setDraft} sendMessage={sendMessage} startVoice={startVoice} speakLast={speakLast} chatEnd={chatEnd} language={language} setLanguage={setLanguage}/>}
          {page==="Appointments" && <AppointmentsPage data={filteredAppointments} allCount={data.appointments.length} query={query} setQuery={setQuery} showNew={showNew} setShowNew={setShowNew} booking={booking} setBooking={setBooking} departments={departments} createAppointment={createAppointment} cancelAppointment={cancelAppointment} notify={notify}/>}
          {page==="Support Tickets" && <TicketsPage data={filteredTickets} query={query} setQuery={setQuery} ticketForm={ticketForm} setTicketForm={setTicketForm} createTicket={createTicket} resolveTicket={resolveTicket} notify={notify}/>}
          {page==="Patient Inquiries" && <LeadsPage data={filteredLeads} query={query} setQuery={setQuery} leadForm={leadForm} setLeadForm={setLeadForm} createLead={createLead} notify={notify}/>}
          {page==="Staff Escalations" && <EscalationsPage data={data.escalations} resolveEscalation={resolveEscalation} setPage={setPage}/>}
          <footer className="page-footer"><span>CareFlow AI · Hackathon MVP</span><span><ShieldCheck size={13}/> Demo data only · Not for clinical use</span></footer>
        </div>
      </main>
      {authOpen && <PatientAuthModal mode={authMode} setMode={setAuthMode} onClose={()=>setAuthOpen(false)} onSuccess={(patient)=>{setCurrentPatient(patient);localStorage.setItem("careflow-current-patient",JSON.stringify(patient));setAuthOpen(false);notify(`Welcome, ${patient.name}! Patient profile saved on this device.`);}} currentPatient={currentPatient} onLogout={()=>{setCurrentPatient(null);localStorage.removeItem("careflow-current-patient");setAuthOpen(false);notify("Patient portal signed out.");}} />}
      {toast && <div className="toast"><CheckCircle2 size={18}/>{toast}</div>}
    </div>
  );
}


function PatientAuthModal({mode,setMode,onClose,onSuccess,currentPatient,onLogout}) {
  const [form,setForm] = useState({name:currentPatient?.name||"",email:currentPatient?.email||"",phone:currentPatient?.phone||"",age:currentPatient?.age||"",gender:currentPatient?.gender||"",password:""});
  const [error,setError] = useState("");
  const update=(key,value)=>setForm(prev=>({...prev,[key]:value}));
  function submit(e){
    e.preventDefault(); setError("");
    const users=(()=>{try{return JSON.parse(localStorage.getItem("careflow-patient-users")||"[]")}catch{return []}})();
    if(mode==="register"){
      if(!form.name.trim()||!form.email.trim()||!form.phone.trim()||!form.password){setError("Please fill all required fields.");return;}
      if(users.some(u=>u.email.toLowerCase()===form.email.trim().toLowerCase())){setError("This email is already registered on this device. Choose Login.");return;}
      const patient={id:`USR-${Date.now().toString().slice(-6)}`,name:form.name.trim(),email:form.email.trim(),phone:form.phone.trim(),age:form.age,gender:form.gender,createdAt:new Date().toISOString()};
      // Hackathon demo only: never store real patient passwords or medical details in a browser-only app.
      localStorage.setItem("careflow-patient-users",JSON.stringify([...users,{...patient,password:form.password}])); onSuccess(patient);
    } else {
      const user=users.find(u=>u.email.toLowerCase()===form.email.trim().toLowerCase()&&u.password===form.password);
      if(!user){setError("Login details not found. Register first on this browser, or check your email/password.");return;}
      const {password,...patient}=user; onSuccess(patient);
    }
  }
  return <div className="auth-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title"><button className="auth-close" onClick={onClose} aria-label="Close"><X size={19}/></button>
    <div className="auth-hero"><div className="auth-logo"><HeartPulse size={24}/></div><span className="auth-kicker">CAREFLOW PATIENT PORTAL</span><h2 id="auth-title">{mode==="register"?"Your care, in one place.":"Welcome back."}</h2><p>{mode==="register"?"Create a demo profile to get started with your patient journey.":"Log in to access the profile saved on this browser."}</p><div className="auth-trust"><ShieldCheck size={15}/> Prototype · local demo only</div></div>
    <div className="auth-form-area"><div className="auth-tabs"><button className={mode==="register"?"selected":""} onClick={()=>{setMode("register");setError("")}}><UserPlus size={15}/> Register</button><button className={mode==="login"?"selected":""} onClick={()=>{setMode("login");setError("")}}><LogIn size={15}/> Login</button></div>
    {currentPatient && <div className="signed-in-card"><div className="table-avatar">{currentPatient.name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()}</div><div><strong>{currentPatient.name}</strong><span>{currentPatient.email}</span><small>Profile saved on this device</small></div><button className="outline-button small" onClick={onLogout}>Sign out</button></div>}
    <form className="auth-form" onSubmit={submit}>{mode==="register"&&<label>Full name<input value={form.name} onChange={e=>update("name",e.target.value)} placeholder="e.g. Aarav Sharma" required/></label>}
      <label>Email address<input type="email" value={form.email} onChange={e=>update("email",e.target.value)} placeholder="you@example.com" required/></label>
      {mode==="register"&&<><div className="auth-fields-two"><label>Phone number<input type="tel" value={form.phone} onChange={e=>update("phone",e.target.value)} placeholder="Mobile number" required/></label><label>Age (optional)<input type="number" min="0" max="120" value={form.age} onChange={e=>update("age",e.target.value)} placeholder="Age"/></label></div><label>Gender (optional)<select value={form.gender} onChange={e=>update("gender",e.target.value)}><option value="">Prefer not to say</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Self-describe</option></select></label></>}
      <label>Password<input type="password" value={form.password} onChange={e=>update("password",e.target.value)} placeholder="Enter demo password" required minLength={4}/></label>
      {error&&<p className="auth-error">{error}</p>}<button className="primary-button auth-submit" type="submit">{mode==="register"?"Create patient profile":"Log in to patient portal"}<span>→</span></button>
    </form><p className="auth-disclaimer">Demo only: details are stored in this browser, not a hospital server. Do not enter real passwords, medical records, or sensitive information.</p></div></section></div>;
}


function PatientsPage({patients,query,setQuery}) {
  const [status,setStatus] = useState("All statuses");
  const visible = patients.filter(p=>`${p.id} ${p.name} ${p.area} ${p.department}`.toLowerCase().includes(query.toLowerCase()) && (status==="All statuses"||p.status===status));
  return <>
    <PageHeading eyebrow="PATIENT RECORDS" title="Patient registry" description="50 fictional demo patients for exploring CareFlow workflows. No real patient information is used." action={<Badge tone="green">{patients.length} sample patients</Badge>}/>
    <div className="panel table-panel"><div className="table-toolbar"><div><h3>Patient directory <span className="count-pill">{visible.length}</span></h3><p>Search by patient, ID, area, or department</p></div><SearchBox query={query} setQuery={setQuery} placeholder="Search patients..."/></div>
      <div style={{padding:"0 20px 16px",display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}><label style={{fontSize:13,color:"var(--muted,#64748b)"}}>Filter status </label><select value={status} onChange={e=>setStatus(e.target.value)} style={{padding:"9px 12px",borderRadius:10,border:"1px solid #dbe3ed",background:"white"}}>{["All statuses","Active","Appointment booked","Follow-up","New inquiry"].map(x=><option key={x}>{x}</option>)}</select><span style={{fontSize:12,color:"#64748b"}}>Demo records only · Do not use for clinical decisions</span></div>
      {visible.length===0?<EmptyState icon={Users} title="No patients found" text="Try another name, ID, area, or department."/>:<div className="table-scroll"><table><thead><tr><th>Patient ID</th><th>Patient</th><th>Age</th><th>Area</th><th>Department</th><th>Status</th><th>Last visit (sample)</th></tr></thead><tbody>{visible.map(p=><tr key={p.id}><td><span className="mono-id">{p.id}</span></td><td><div className="patient-cell"><div className="table-avatar">{p.name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()}</div><strong>{p.name}</strong></div></td><td>{p.age}</td><td>{p.area}</td><td>{p.department}</td><td><Badge tone={p.status==="Active"?"green":p.status==="Follow-up"?"amber":"blue"}>{p.status}</Badge></td><td>{dateLabel(p.lastVisit)}</td></tr>)}</tbody></table></div>}
    </div>
  </>;
}
function HospitalsPage({query,setQuery}) {
 const visible=hospitals.filter(h=>`${h.name} ${h.area} ${h.type}`.toLowerCase().includes(query.toLowerCase()));
 return <><PageHeading eyebrow="INDORE DIRECTORY" title="Hospitals around Indore" description={`Curated Indore hospital and specialty directory (${directoryLastReviewed}). This is not an exhaustive official registry; verify addresses, phone numbers, services, and availability directly with each hospital.`} action={<Badge tone="blue">{hospitals.length} listings</Badge>}/>
 <div className="table-toolbar" style={{marginBottom:16}}><div><h3>Hospital directory</h3><p>Search by hospital name, area, or type</p></div><SearchBox query={query} setQuery={setQuery} placeholder="Search hospitals..."/></div>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:16}}>{visible.map(h=><article className="panel" key={h.name} style={{padding:20}}><div style={{display:"flex",gap:12,alignItems:"flex-start"}}><div className="stat-icon blue"><Building2 size={20}/></div><div style={{flex:1}}><h3 style={{margin:"2px 0 6px",fontSize:17}}>{h.name}</h3><Badge tone="blue">{h.type}</Badge></div></div><p style={{display:"flex",gap:8,alignItems:"center",margin:"16px 0 8px",color:"#475569"}}><MapPin size={16}/>{h.area}, Indore</p><p style={{display:"flex",gap:8,alignItems:"center",margin:"8px 0",color:"#475569"}}><Phone size={16}/>{h.phone}</p><p style={{fontSize:12,lineHeight:1.5,color:"#64748b",marginBottom:8}}>{h.note}</p><div style={{fontSize:12,lineHeight:1.55,color:"#475569",marginTop:10}}><strong>Listed services:</strong> {(h.specialties||[]).slice(0,8).join(", ")}{(h.specialties||[]).length>8?"…":""}</div><p style={{fontSize:12,marginTop:10,marginBottom:0}}><a href={h.website} target="_blank" rel="noreferrer">Official / directory website ↗</a></p></article>)}</div>
 <p style={{fontSize:12,color:"#64748b",marginTop:18}}>Curated reference directory, last reviewed 28 Oct 2026 using public government listings and hospital-published pages. It is not exhaustive, and services can change. Verify directly with the hospital. For emergencies, contact local emergency services immediately.</p></>;
}

function PageHeading({eyebrow,title,description,action}) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}
function Overview({data,todaysAppointments,openTickets,needsStaff,recentActivity,setPage,setShowNew}) {
  const stats = [
    {label:"Appointments today",value:todaysAppointments,change:"Live demo records",icon:CalendarDays,tone:"blue",trend:"up"},
    {label:"Active patient inquiries",value:data.leads.filter(x=>x.status!=="Closed").length,change:`${data.leads.length} total inquiries`,icon:Users,tone:"violet",trend:"up"},
    {label:"Open support tickets",value:openTickets,change:"Needs follow-through",icon:Ticket,tone:"amber",trend:"down"},
    {label:"Needs staff attention",value:needsStaff,change:"Human escalation queue",icon:Headphones,tone:"rose",trend:"down"}
  ];
  return <>
    <PageHeading eyebrow="HOSPITAL OVERVIEW" title="Good morning, CareFlow team" description="Here's what's happening across your patient operations today."
      action={<button className="primary-button" onClick={()=>{setPage("Appointments");setShowNew(true);}}><Plus size={17}/> New appointment</button>}/>
    <div className="welcome-banner">
      <div className="welcome-art"><div className="pulse-circle"><HeartPulse size={30}/></div><span className="art-dot dot-a"/><span className="art-dot dot-b"/><span className="art-dot dot-c"/></div>
      <div className="welcome-copy"><Badge tone="light">AI OPERATIONS ACTIVE</Badge><h2>More time for better patient care.</h2><p>CareFlow turns patient conversations into trackable actions, so your team can focus on people—not repetitive admin.</p><button className="banner-link" onClick={()=>setPage("Patient Assistant")}>Try the patient assistant <span>→</span></button></div>
      <div className="welcome-side"><div className="side-stat"><span>Automated workflows</span><strong>3 <small>types</small></strong></div><div className="side-stat"><span>Staff escalations</span><strong>{needsStaff} <small>pending</small></strong></div></div>
    </div>
    <div className="section-title-row"><div><h2>Operations snapshot</h2><p>Current records in this demo workspace</p></div><span className="subtle-label"><span className="online-dot"/> Updated live</span></div>
    <div className="stats-grid">{stats.map(s=>{const I=s.icon;return <div className="stat-card" key={s.label}><div className={`stat-icon ${s.tone}`}><I size={19}/></div><div className="stat-label">{s.label}</div><div className="stat-value">{s.value}</div><div className="stat-foot">{s.trend==="up"?<ArrowUpRight size={14}/>:<ArrowDownRight size={14}/>}<span>{s.change}</span></div></div>;})}</div>
    <div className="analytics-grid">
      <section className="panel analytics-panel"><div className="panel-heading"><div><h3>Patient operations trend</h3><p>Illustrative activity across the last 7 days</p></div><span className="chart-pill"><TrendingUp size={13}/> +18% activity</span></div>
        <div className="trend-chart" role="img" aria-label="Illustrative bar chart of patient operations over seven days">{[{d:"Mon",v:38},{d:"Tue",v:56},{d:"Wed",v:44},{d:"Thu",v:72},{d:"Fri",v:61},{d:"Sat",v:86},{d:"Sun",v:68}].map((x,i)=><div className="trend-column" key={x.d}><div className="trend-track"><div className={`trend-bar ${i===5?"highlight":""}`} style={{height:`${x.v}%`}} title={`${x.d}: ${x.v} activity points`}/></div><span>{x.d}</span></div>)}</div>
        <div className="chart-legend"><span><i className="legend-dot blue-dot"/> Patient operations</span><span className="chart-footnote">Demo visualization · not real hospital analytics</span></div>
      </section>
      <section className="panel analytics-panel"><div className="panel-heading"><div><h3>Workflow mix</h3><p>Current demo records by category</p></div><PieChart size={18} color="#7890b7"/></div>
        <div className="mix-content"><div className="donut-chart" style={{background:`conic-gradient(#386af5 0 48%, #8a6af0 48% 73%, #f4b84c 73% 91%, #f17e91 91% 100%)`}}><div className="donut-hole"><strong>{data.appointments.length+data.tickets.length+data.leads.length}</strong><span>records</span></div></div>
        <div className="mix-legend"><div><i style={{background:"#386af5"}}/><span>Appointments</span><strong>{data.appointments.length}</strong></div><div><i style={{background:"#8a6af0"}}/><span>Support tickets</span><strong>{data.tickets.length}</strong></div><div><i style={{background:"#f4b84c"}}/><span>Patient inquiries</span><strong>{data.leads.length}</strong></div><div><i style={{background:"#f17e91"}}/><span>Staff escalations</span><strong>{data.escalations.length}</strong></div></div></div>
        <div className="chart-footnote">Updates as demo workflows change · local browser data</div>
      </section>
    </div>
    <div className="dashboard-grid">
      <section className="panel activity-panel"><div className="panel-heading"><div><h3>Recent activity</h3><p>Latest patient operations</p></div><button className="text-button" onClick={()=>setPage("Appointments")}>View all <span>→</span></button></div>
        {recentActivity.length===0?<EmptyState icon={Activity} title="No activity yet" text="Try the patient assistant to create your first action."/>:<div className="activity-list">{recentActivity.map((a,i)=><div className="activity-row" key={`${a.id}-${i}`}><div className={`activity-icon ${a.kind.toLowerCase()}`}>{a.kind==="Appointment"?<CalendarDays size={16}/>:a.kind==="Ticket"?<Ticket size={16}/>:<Users size={16}/>}</div><div className="activity-main"><strong>{a.label}</strong><span>{a.id} · {new Date(a.when).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}</span></div><Badge tone={a.kind==="Appointment"?"green":a.kind==="Ticket"?"amber":"violet"}>{a.kind}</Badge></div>)}</div>}
      </section>
      <section className="panel quick-panel"><div className="panel-heading"><div><h3>Quick actions</h3><p>Go straight to a workflow</p></div><Zap size={18} className="quick-zap"/></div>
        <button className="quick-action" onClick={()=>setPage("Patient Assistant")}><div className="quick-icon blue"><MessageCircle size={18}/></div><div><strong>Talk to CareFlow AI</strong><span>Chat, FAQs and patient requests</span></div><span className="quick-arrow">→</span></button>
        <button className="quick-action" onClick={()=>{setPage("Appointments");}}><div className="quick-icon violet"><CalendarDays size={18}/></div><div><strong>Manage appointments</strong><span>Review schedule and bookings</span></div><span className="quick-arrow">→</span></button>
        <button className="quick-action" onClick={()=>setPage("Support Tickets")}><div className="quick-icon amber"><Ticket size={18}/></div><div><strong>Resolve support tickets</strong><span>Track patient issues</span></div><span className="quick-arrow">→</span></button>
        <button className="quick-action" onClick={()=>setPage("Staff Escalations")}><div className="quick-icon rose"><Headphones size={18}/></div><div><strong>Staff escalation queue</strong><span>Human follow-up required</span></div><span className="quick-arrow">→</span></button>
      </section>
    </div>
    <div className="disclaimer"><ShieldCheck size={16}/><span><strong>Responsible AI:</strong> This prototype handles administrative workflows only. It does not diagnose, triage, or recommend treatment.</span></div>
  </>;
}
function ChatPage({messages,draft,setDraft,sendMessage,startVoice,speakLast,chatEnd,language,setLanguage}) {
  const suggestions = language === "hi" ? ["इंदौर में कैंसर के इलाज के विकल्प बताइए","कल डॉक्टर का अपॉइंटमेंट चाहिए","OPD का समय क्या है?","मुझे स्टाफ से बात करनी है"] : ["Which hospitals offer cancer treatment in Indore?","Book a cardiology appointment tomorrow","What are your OPD hours?","I need to speak to hospital staff"];
  return <>
    <PageHeading eyebrow={language === "hi" ? "मरीज़ सहायता" : "PATIENT EXPERIENCE"} title={language === "hi" ? "मरीज़ सहायक" : "Patient assistant"} description={language === "hi" ? "हिंदी या English में पूछें—सामान्य जानकारी, अपॉइंटमेंट अनुरोध और स्टाफ फॉलो-अप में मदद पाएँ।" : "A conversational front desk that answers common questions and helps execute administrative workflows."} action={<Badge tone="green"><span className="online-dot"/> {language === "hi" ? "मदद के लिए तैयार" : "Ready to help"}</Badge>}/>
    <div className="chat-layout">
      <section className="panel chat-panel">
        <div className="chat-top"><div className="bot-avatar"><Bot size={22}/><span className="avatar-online"/></div><div className="chat-person"><strong>CareFlow AI</strong><span><span className="online-dot"/> {language === "hi" ? "अस्पताल सहायता सहायक" : "Hospital operations assistant"}</span></div><div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}><button className="language-toggle" onClick={()=>{const next=language === "en" ? "hi" : "en";setLanguage(next);if(messages.length===1&&messages[0].from==="bot"){setMessages([{from:"bot",text:next==="hi"?"नमस्ते! मैं CareFlow AI हूँ। आप हिंदी में अस्पताल की जानकारी पूछ सकते हैं, अपॉइंटमेंट अनुरोध शुरू कर सकते हैं, पूछताछ दर्ज कर सकते हैं या स्टाफ कॉलबैक का अनुरोध कर सकते हैं। मैं आपकी कैसे मदद करूँ?":"Hello! I'm CareFlow AI. I can help with hospital information, appointment requests, inquiries, and staff callbacks. How can I help you today?",time:fmtTime()}]);}}} aria-label="Switch assistant language"><span className={language === "en" ? "lang-active" : ""}>EN</span><span className={language === "hi" ? "lang-active" : ""}>हिंदी</span></button><button className="outline-button small" onClick={speakLast}><Activity size={14}/> {language === "hi" ? "जवाब सुनें" : "Read reply aloud"}</button></div></div>
        <div className="chat-context"><ShieldCheck size={15}/><span>{language === "hi" ? "सामान्य जानकारी और प्रशासनिक सहायता। निजी मेडिकल जानकारी न डालें। आपातकाल में तुरंत स्थानीय आपातकालीन सेवा से संपर्क करें।" : "Administrative support and general information only. Don't enter sensitive medical details. Emergency? Contact local emergency services."}</span></div>
        <div className="message-list">
          {messages.map((m,i)=><div className={`message-row ${m.from}`} key={i}>{m.from==="bot"&&<div className="mini-bot"><Bot size={15}/></div>}<div className="message-bubble"><div className="message-text">{renderMessageText(m.text)}</div><span>{m.time}</span></div>{m.from==="user"&&<div className="mini-user">{language === "hi" ? "आप" : "You"}</div>}</div>)}
          <div ref={chatEnd}/>
        </div>
        <div className="suggestion-area"><div className="suggestion-label">{language === "hi" ? "ये सवाल पूछकर देखें" : "TRY ASKING"}</div><div className="suggestion-chips">{suggestions.map(s=><button key={s} onClick={()=>sendMessage(s)}>{s}</button>)}</div></div>
        <form className="chat-composer" onSubmit={e=>{e.preventDefault();sendMessage();}}><button type="button" className="voice-button" onClick={startVoice} title="Speak"><Mic size={19}/></button><input value={draft} onChange={e=>setDraft(e.target.value)} placeholder={language === "hi" ? "अपना सवाल यहाँ लिखें..." : "Type a patient request..."} aria-label="Patient message"/><button type="submit" className="send-button" disabled={!draft.trim()}><Send size={17}/><span>{language === "hi" ? "भेजें" : "Send"}</span></button></form>
        <div className="chat-bottom-note">{language === "hi" ? "हिंदी/English सहायता · डेमो डेटा इसी ब्राउज़र में सेव होता है" : "English/Hindi support · Workflow actions are saved locally in this browser"}</div>
      </section>
      <aside className="chat-aside">
        <div className="panel aside-panel"><div className="aside-heading"><div className="aside-icon blue"><Zap size={18}/></div><div><h3>{language === "hi" ? "मैं क्या कर सकता हूँ" : "What I can do"}</h3><p>{language === "hi" ? "जवाब के साथ काम भी" : "Actions, not just answers"}</p></div></div>{(language === "hi" ? [{icon:CalendarDays,title:"अपॉइंटमेंट अनुरोध",desc:"डेमो बुकिंग बनाएँ"},{icon:Users,title:"पूछताछ दर्ज करें",desc:"सेवा संबंधी रुचि दर्ज करें"},{icon:Ticket,title:"सपोर्ट टिकट",desc:"समस्याएँ और फॉलो-अप ट्रैक करें"},{icon:Headphones,title:"स्टाफ तक पहुँचाएँ",desc:"अनसुलझे अनुरोध आगे भेजें"}] : [{icon:CalendarDays,title:"Book appointments",desc:"Create a confirmed demo booking"},{icon:Users,title:"Record inquiries",desc:"Capture service-interest leads"},{icon:Ticket,title:"Create support tickets",desc:"Track issues and follow-ups"},{icon:Headphones,title:"Escalate to staff",desc:"Flag unresolved requests"}]).map(x=>{const I=x.icon;return <div className="capability-row" key={x.title}><I size={17}/><div><strong>{x.title}</strong><span>{x.desc}</span></div><Check size={15} className="cap-check"/></div>;})}</div>
        <div className="panel knowledge-panel"><div className="aside-heading"><div className="aside-icon violet"><CircleHelp size={18}/></div><div><h3>{language === "hi" ? "जानकारी केंद्र" : "Knowledge base"}</h3><p>{language === "hi" ? "अस्पताल की सामान्य जानकारी" : "Sample hospital FAQs"}</p></div></div>{(language === "hi" ? [
          {q:"OPD का समय क्या है?",a:"डेमो समय सोमवार–शनिवार, सुबह 9 से शाम 5 बजे तक है। वास्तविक समय अस्पताल से पुष्टि करें।"},
          {q:"मुझे क्या साथ लाना चाहिए?",a:"अपॉइंटमेंट की पुष्टि और अस्पताल द्वारा माँगे गए दस्तावेज़ साथ रखें। चैट में निजी मेडिकल रिकॉर्ड न डालें।"},
          {q:"किसी कर्मचारी से कैसे बात करें?",a:"मैं स्टाफ फॉलो-अप टिकट बना सकता हूँ। यह डेमो वास्तविक सूचना नहीं भेजता।"},
          {q:"कौन-से विभाग हैं?",a:"डेमो विभाग: हृदय रोग, त्वचा रोग, हड्डी रोग, सामान्य चिकित्सा और बाल रोग।"}
        ] : faqs.slice(0,4)).map(f=><div className="faq-row" key={f.q}><strong>{f.q}</strong><p>{f.a}</p></div>)}</div>
      </aside>
    </div>
  </>;
}
function SearchBox({query,setQuery,placeholder="Search records..."}) { return <div className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={placeholder}/>{query&&<button onClick={()=>setQuery("")}><X size={14}/></button>}</div>; }
function EmptyState({icon:Icon,title,text}) { return <div className="empty-state"><div><Icon size={22}/></div><strong>{title}</strong><p>{text}</p></div>; }
function AppointmentsPage({data,allCount,query,setQuery,showNew,setShowNew,booking,setBooking,departments,createAppointment,cancelAppointment,notify}) {
  const [filter,setFilter] = useState("All");
  const [error,setError] = useState("");
  const visible = data.filter(a=>filter==="All"||a.status===filter);
  function submit(e) {
    e.preventDefault(); setError("");
    if (!booking.patient.trim()) {setError("Please enter a patient name.");return;}
    if (!booking.date) {setError("Please select a date.");return;}
    const result=createAppointment(booking);
    if (!result.ok) {setError(result.message);return;}
    notify(`Appointment ${result.appt.id} created successfully.`);
    setShowNew(false);setBooking({patient:"",department:"Cardiology",date:dateISO(tomorrow),time:"10:30 AM"});
  }
  const selectedDept=departments.find(d=>d.name===booking.department)||departments[0];
  return <>
    <PageHeading eyebrow="SCHEDULING" title="Appointments" description="Manage patient bookings and prevent double-booking of the same department slot." action={<button className="primary-button" onClick={()=>setShowNew(v=>!v)}><Plus size={17}/> New appointment</button>}/>
    {showNew&&<section className="panel form-panel"><div className="panel-heading"><div><h3>Create appointment</h3><p>Use fictional patient data for this demo.</p></div><IconButton onClick={()=>setShowNew(false)} title="Close"><X size={18}/></IconButton></div>
      <form onSubmit={submit} className="record-form">
        <label>Patient name<input value={booking.patient} onChange={e=>setBooking({...booking,patient:e.target.value})} placeholder="e.g. Priya Sharma" required/></label>
        <label>Department<select value={booking.department} onChange={e=>setBooking({...booking,department:e.target.value,time:departments.find(d=>d.name===e.target.value).slots[0]})}>{departments.map(d=><option key={d.name}>{d.name}</option>)}</select></label>
        <label>Appointment date<input type="date" min={dateISO(today)} value={booking.date} onChange={e=>setBooking({...booking,date:e.target.value})} required/></label>
        <label>Available demo slot<select value={booking.time} onChange={e=>setBooking({...booking,time:e.target.value})}>{selectedDept.slots.map(s=><option key={s}>{s}</option>)}</select></label>
        <div className="form-full doctor-hint"><Stethoscope size={16}/> Assigned doctor: <strong>{selectedDept.doctor}</strong></div>
        {error&&<div className="form-error">{error}</div>}
        <div className="form-actions"><button type="button" className="outline-button" onClick={()=>setShowNew(false)}>Cancel</button><button className="primary-button" type="submit"><Check size={16}/> Confirm booking</button></div>
      </form>
    </section>}
    <div className="panel table-panel"><div className="table-toolbar"><div><h3>Appointment records <span className="count-pill">{allCount}</span></h3><p>Saved in this demo browser</p></div><SearchBox query={query} setQuery={setQuery} placeholder="Search patient, doctor..."/></div>
      <div className="filter-tabs">{["All","Confirmed","Pending","Cancelled"].map(f=><button key={f} className={filter===f?"selected":""} onClick={()=>setFilter(f)}>{f}</button>)}</div>
      {visible.length===0?<EmptyState icon={CalendarDays} title="No appointments found" text="Change your search or create a new appointment."/>:<div className="table-scroll"><table><thead><tr><th>Patient</th><th>Department / doctor</th><th>Date & time</th><th>Status</th><th>Confirmation</th><th/></tr></thead><tbody>{visible.map(a=><tr key={a.id}><td><div className="patient-cell"><div className="table-avatar">{a.patient.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()}</div><strong>{a.patient}</strong></div></td><td><strong>{a.department}</strong><span className="cell-sub">{a.doctor}</span></td><td><strong>{dateLabel(a.date)}</strong><span className="cell-sub">{a.time}</span></td><td><Badge tone={a.status==="Confirmed"?"green":a.status==="Pending"?"amber":"gray"}>{a.status}</Badge></td><td><span className="mono-id">{a.id}</span></td><td>{a.status!=="Cancelled"&&<button className="row-action" onClick={()=>cancelAppointment(a.id)}>Cancel</button>}</td></tr>)}</tbody></table></div>}
      <div className="table-foot"><span>Showing {visible.length} of {allCount} records</span><span><ShieldCheck size={13}/> Sample data only</span></div>
    </div>
  </>;
}
function TicketsPage({data,query,setQuery,ticketForm,setTicketForm,createTicket,resolveTicket,notify}) {
  const [showForm,setShowForm]=useState(false);
  const [error,setError]=useState("");
  function submit(e) {e.preventDefault();if(!ticketForm.topic.trim()){setError("Please describe the issue.");return;}const t=createTicket(ticketForm);notify(`Ticket ${t.id} created.`);setTicketForm({patient:"",topic:""});setShowForm(false);setError("");}
  return <>
    <PageHeading eyebrow="PATIENT SUPPORT" title="Support tickets" description="Track patient issues from creation through resolution." action={<button className="primary-button" onClick={()=>setShowForm(v=>!v)}><Plus size={17}/> Create ticket</button>}/>
    {showForm&&<section className="panel form-panel"><div className="panel-heading"><div><h3>New support ticket</h3><p>Record a patient request for staff follow-up.</p></div><IconButton onClick={()=>setShowForm(false)} title="Close"><X size={18}/></IconButton></div><form className="record-form" onSubmit={submit}><label>Patient name<input value={ticketForm.patient} onChange={e=>setTicketForm({...ticketForm,patient:e.target.value})} placeholder="Optional for demo"/></label><label className="form-full">Issue or request<textarea value={ticketForm.topic} onChange={e=>setTicketForm({...ticketForm,topic:e.target.value})} placeholder="Describe the administrative issue..." required rows={3}/></label>{error&&<div className="form-error">{error}</div>}<div className="form-actions"><button className="outline-button" type="button" onClick={()=>setShowForm(false)}>Cancel</button><button className="primary-button" type="submit"><Plus size={16}/> Create ticket</button></div></form></section>}
    <div className="panel table-panel"><div className="table-toolbar"><div><h3>All tickets <span className="count-pill">{data.length}</span></h3><p>Administrative support queue</p></div><SearchBox query={query} setQuery={setQuery}/></div>
      {data.length===0?<EmptyState icon={Ticket} title="No tickets found" text="New patient requests will appear here."/>:<div className="table-scroll"><table><thead><tr><th>Ticket ID</th><th>Patient</th><th>Issue</th><th>Priority</th><th>Status</th><th>Created</th><th/></tr></thead><tbody>{data.map(t=><tr key={t.id}><td><span className="mono-id">{t.id}</span></td><td><strong>{t.patient}</strong></td><td className="issue-cell">{t.topic}</td><td><Badge tone={t.priority==="High"?"rose":"blue"}>{t.priority||"Normal"}</Badge></td><td><Badge tone={t.status==="Resolved"?"green":t.status==="Needs staff"?"rose":"amber"}>{t.status}</Badge></td><td>{new Date(t.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</td><td>{t.status!=="Resolved"&&<button className="row-action" onClick={()=>resolveTicket(t.id)}>Resolve</button>}</td></tr>)}</tbody></table></div>}
      <div className="table-foot"><span>Ticket changes are saved automatically</span><span><ShieldCheck size={13}/> Demo workspace</span></div>
    </div>
  </>;
}
function LeadsPage({data,query,setQuery,leadForm,setLeadForm,createLead,notify}) {
  const [showForm,setShowForm]=useState(false);
  function submit(e){e.preventDefault();if(!leadForm.interest.trim())return;const l=createLead(leadForm);notify(`Inquiry ${l.id} recorded.`);setLeadForm({patient:"",interest:"",contact:""});setShowForm(false);}
  return <>
    <PageHeading eyebrow="GROWTH & FOLLOW-UP" title="Patient inquiries" description="Capture service inquiries so prospective patients don't get lost between conversations." action={<button className="primary-button" onClick={()=>setShowForm(v=>!v)}><Plus size={17}/> Record inquiry</button>}/>
    {showForm&&<section className="panel form-panel"><div className="panel-heading"><div><h3>Record patient inquiry</h3><p>Capture only the minimum contact information needed for a demo.</p></div><IconButton onClick={()=>setShowForm(false)} title="Close"><X size={18}/></IconButton></div><form className="record-form" onSubmit={submit}><label>Patient / contact name<input value={leadForm.patient} onChange={e=>setLeadForm({...leadForm,patient:e.target.value})} placeholder="Optional"/></label><label>Contact detail<input value={leadForm.contact} onChange={e=>setLeadForm({...leadForm,contact:e.target.value})} placeholder="Optional email or phone"/></label><label className="form-full">Inquiry / service interest<textarea value={leadForm.interest} onChange={e=>setLeadForm({...leadForm,interest:e.target.value})} placeholder="e.g. Annual health check-up package" required rows={3}/></label><div className="form-actions"><button className="outline-button" type="button" onClick={()=>setShowForm(false)}>Cancel</button><button className="primary-button" type="submit"><Plus size={16}/> Save inquiry</button></div></form></section>}
    <div className="panel table-panel"><div className="table-toolbar"><div><h3>Inquiry records <span className="count-pill">{data.length}</span></h3><p>Follow-up opportunities from patient conversations</p></div><SearchBox query={query} setQuery={setQuery}/></div>
      {data.length===0?<EmptyState icon={Users} title="No inquiries found" text="Record an inquiry or ask CareFlow to capture a service interest."/>:<div className="table-scroll"><table><thead><tr><th>Lead ID</th><th>Patient</th><th>Interest</th><th>Contact</th><th>Status</th><th>Created</th></tr></thead><tbody>{data.map(l=><tr key={l.id}><td><span className="mono-id">{l.id}</span></td><td><strong>{l.patient}</strong></td><td className="issue-cell">{l.interest}</td><td>{l.contact}</td><td><Badge tone="violet">{l.status}</Badge></td><td>{new Date(l.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</td></tr>)}</tbody></table></div>}
      <div className="table-foot"><span>Inquiry records persist in local browser storage</span><span><ShieldCheck size={13}/> Demo workspace</span></div>
    </div>
  </>;
}
function EscalationsPage({data,resolveEscalation,setPage}) {
  const pending=data.filter(x=>x.status!=="Resolved");
  return <>
    <PageHeading eyebrow="HUMAN-IN-THE-LOOP" title="Staff escalations" description="Requests that the AI could not safely or confidently resolve are routed for human review." action={<Badge tone={pending.length?"rose":"green"}>{pending.length} pending</Badge>}/>
    <div className="escalation-banner"><div className="escalation-icon"><Headphones size={23}/></div><div><strong>Human support stays in control</strong><p>Escalations are stored in this demo. No real hospital staff are notified; a production system would connect this queue to an authenticated staff workflow.</p></div></div>
    <div className="panel table-panel"><div className="table-toolbar"><div><h3>Escalation queue <span className="count-pill">{data.length}</span></h3><p>Review unresolved patient requests</p></div><button className="outline-button small" onClick={()=>setPage("Support Tickets")}><Ticket size={15}/> View tickets</button></div>
      {data.length===0?<EmptyState icon={Headphones} title="No escalations yet" text="Ask the assistant for human help or enter a request it cannot resolve."/>:<div className="escalation-list">{data.slice().sort((a,b)=>b.createdAt-a.createdAt).map(e=><div className={`escalation-row ${e.status==="Resolved"?"resolved":""}`} key={e.id}><div className="escalation-state">{e.status==="Resolved"?<CheckCircle2 size={20}/>:<AlertCircle size={20}/>}</div><div className="escalation-main"><div className="escalation-title"><strong>{e.patient}</strong><Badge tone={e.status==="Resolved"?"green":"rose"}>{e.status}</Badge></div><p>{e.reason}</p><span>{e.id} · {new Date(e.createdAt).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</span></div>{e.status!=="Resolved"&&<button className="primary-button small" onClick={()=>resolveEscalation(e.id)}><Check size={15}/> Mark resolved</button>}</div>)}</div>}
    </div>
  </>;
}