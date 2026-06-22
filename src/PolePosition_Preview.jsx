import { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "./supabase.js";
import { Search, Heart, X, ChevronRight, ArrowRight, User, Gauge, Calendar, CheckCircle, XCircle, Shield, Zap, ChevronDown, ChevronLeft, Award, Clock, TrendingUp, Users, Filter, Star, RotateCcw, Check, MapPin, Wrench, Fuel, MessageSquare, BookOpen, ThumbsUp, Send, Eye, Car, Activity, Share2, BarChart2, Plus, Bookmark, PenSquare, Hash, LogOut, AlertCircle, Edit2, Trash2, FileText, Lock, Hourglass, Upload, Film, Play } from "lucide-react";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  :root{--red:#DC2626;--dark:#0F172A;--card:#1E293B;--border:rgba(255,255,255,0.07);--f:Outfit,sans-serif;}
  body{font-family:var(--f);background:#F8FAFC;color:#0F172A;}
  input,textarea,select{font-family:var(--f);outline:none;}
  button{font-family:var(--f);outline:none;}
  .btn-red{background:var(--red);color:#fff;border:none;cursor:pointer;font-weight:700;font-family:var(--f);}
  .btn-red:hover{background:#B91C1C;}
  .glass{background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.8);}
  .pp-admin{background:#0F172A;color:#fff;}
  .pp-admin input,.pp-admin textarea,.pp-admin select{font:inherit;margin:0;line-height:1.4;}
  .pp-admin input,.pp-admin textarea{background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,255,255,0.1);color:#fff;padding:10px 14px;border-radius:10px;font-size:14px;width:100%;box-sizing:border-box;}
  .pp-admin input[type=number]::-webkit-inner-spin-button,.pp-admin input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}
  .pp-admin input[type=number]{-moz-appearance:textfield;}
  .pp-admin select{background-color:#0F172A;border:1.5px solid rgba(255,255,255,0.1);color:#fff;padding:10px 32px 10px 14px;border-radius:10px;font-size:14px;width:100%;box-sizing:border-box;-webkit-appearance:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;background-size:12px;text-overflow:ellipsis;}
  .pp-admin textarea{resize:vertical;line-height:1.6;}
  .range-dual{-webkit-appearance:none;appearance:none;background:transparent;pointer-events:none;position:absolute;top:0;left:0;width:100%;margin:0;}
  .range-dual::-webkit-slider-runnable-track{-webkit-appearance:none;height:4px;background:transparent;}
  .range-dual::-webkit-slider-thumb{-webkit-appearance:none;pointer-events:auto;width:16px;height:16px;border-radius:50%;background:#DC2626;border:2.5px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,0.35);cursor:pointer;margin-top:-6px;}
  .range-dual::-moz-range-track{height:4px;background:transparent;}
  .range-dual::-moz-range-thumb{pointer-events:auto;width:16px;height:16px;border-radius:50%;background:#DC2626;border:2.5px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,0.35);cursor:pointer;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
`;

// ── Mock data (preview only — production uses live Supabase data) ──
const CARS_SEED = [
  {id:1,make:"Honda",model:"City",year:2020,fuel:"Petrol",transmission:"Automatic",km:28000,seats:5,price:950000,score:87,badge:"Hot",img:"https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=800&q=80",images:["https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80"],category:"Sedan",tagline:"India's most reliable sedan.",owners:1,insurance:"Valid till Dec 2025",scoreBreakdown:{Engine:90,Body:88,Interior:85,Electrical:87,Tyres:75,Docs:95}},
  {id:2,make:"Maruti",model:"Swift",year:2021,fuel:"Petrol",transmission:"Manual",km:15000,seats:5,price:680000,score:91,badge:"Steal Deal",img:"https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80",images:["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80"],video:"https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",category:"Hatchback",tagline:"Fun, frugal, and fast.",owners:1,insurance:"Valid till Mar 2026",tyreWear:{fl:35,fr:30,rl:25,rr:25},scoreBreakdown:{Engine:93,Body:92,Interior:88,Electrical:91,Tyres:90,Docs:94}},
  {id:3,make:"Hyundai",model:"Creta",year:2022,fuel:"Diesel",transmission:"Automatic",km:22000,seats:5,price:1600000,score:89,badge:"Most Viewed",img:"https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=800&q=80",images:["https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1583267746897-2cf415887172?auto=format&fit=crop&w=800&q=80"],category:"SUV",tagline:"The compact SUV that does it all.",owners:1,insurance:"Valid till Jun 2025",scoreBreakdown:{Engine:91,Body:90,Interior:92,Electrical:88,Tyres:87,Docs:93}},
  {id:4,make:"Toyota",model:"Fortuner",year:2021,fuel:"Diesel",transmission:"Automatic",km:35000,seats:7,price:2800000,score:85,badge:null,img:"https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80",images:["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80"],category:"SUV",tagline:"Presence. Power. Prestige.",owners:1,insurance:"Valid till Aug 2024",scoreBreakdown:{Engine:88,Body:86,Interior:84,Electrical:83,Tyres:82,Docs:91}},
  {id:5,make:"Tata",model:"Nexon EV",year:2022,fuel:"Electric",transmission:"Automatic",km:18000,seats:5,price:1400000,score:93,badge:"Hot",img:"https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",images:["https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?auto=format&fit=crop&w=800&q=80"],category:"EV SUV",tagline:"The future, right now.",owners:1,insurance:"Valid till Feb 2026",scoreBreakdown:{Engine:95,Body:93,Interior:91,Electrical:96,Tyres:90,Docs:94}},
  {id:6,make:"Kia",model:"Seltos",year:2021,fuel:"Petrol",transmission:"DCT",km:30000,seats:5,price:1350000,score:86,badge:"Most Viewed",img:"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",images:["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1622194993300-272f43089a72?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80"],category:"SUV",tagline:"Style meets substance.",owners:1,insurance:"Valid till Sep 2025",scoreBreakdown:{Engine:87,Body:88,Interior:90,Electrical:86,Tyres:84,Docs:89}},
];

const BLOG_SEED = [
  {id:1,title:"2024 Maruti Swift Review: Reinvented",excerpt:"Sharper design, new Z-series engine, and a surprisingly premium interior. We drove it for 500 km.",tag:"Cars",readTime:"6 min",date:"Dec 10, 2024",img:"https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80",author:"Rahul Sharma",featured:true,views:4821},
  {id:2,title:"Tata Nexon EV Max: 6-Month Ownership Report",excerpt:"Range anxiety? Charging woes? We've lived with it daily. The unvarnished truth about EV ownership.",tag:"EV",readTime:"9 min",date:"Nov 28, 2024",img:"https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=80",author:"Priya Nair",featured:false,views:6302},
  {id:3,title:"5 Things to Check Before Buying a Used Car",excerpt:"Our complete inspection guide so you never get burned on a pre-owned purchase.",tag:"Guide",readTime:"5 min",date:"Nov 5, 2024",img:"https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=900&q=80",author:"PP Team",featured:false,views:8940},
];

const THREADS_SEED = [
  {id:1,title:"Nexon EV Max 8-month ownership diary — real range, real costs",cat:"Ownership Diaries",author:"RahulEV",replies:47,views:2341,last:"2h ago",pinned:true},
  {id:2,title:"Creta vs Seltos vs Hector — help me decide",cat:"Buying Help",author:"FirstTimeBuyer",replies:61,views:3102,last:"1d ago",pinned:false},
  {id:3,title:"Pre-purchase inspection checklist — community edition",cat:"Buying Help",author:"CarGuru",replies:92,views:5430,last:"6h ago",pinned:true},
];

const USERS_SEED = [
  {id:"u1",name:"Admin",is_admin:true,created_at:"2026-06-01T10:00:00Z"},
  {id:"u2",name:"Arjun Sharma",is_admin:false,created_at:"2026-06-10T10:00:00Z"},
  {id:"u3",name:"Priya Nair",is_admin:false,created_at:"2026-06-15T10:00:00Z"},
];

const ADMIN_TEAM_SEED = [
  {id:"a1",name:"Vasu",email:"vaseey@gmail.com",created_at:"2026-05-01T10:00:00Z",confirmed:true},
  {id:"a2",name:"Rohan Kapoor",email:"rohan@poleposition.in",created_at:"2026-06-12T10:00:00Z",confirmed:false},
];

const BADGE = {Hot:{bg:"linear-gradient(135deg,#EF4444,#DC2626)",label:"Hot"},"Steal Deal":{bg:"linear-gradient(135deg,#10B981,#059669)",label:"Steal Deal"},"Most Viewed":{bg:"linear-gradient(135deg,#F59E0B,#D97706)",label:"Most Viewed"}};
const TAG_COLORS = {Cars:"#DC2626",EV:"#059669",Bikes:"#7C3AED",Guide:"#D97706"};
const QUIZ = [
  {id:1,q:"What is your budget?",key:"budget",opts:[{l:"Under ₹8L",v:"low"},{l:"₹8L–15L",v:"mid"},{l:"₹15L–25L",v:"high"},{l:"Above ₹25L",v:"luxury"}]},
  {id:2,q:"How many people usually ride with you?",key:"seats",opts:[{l:"Just 2",v:"2"},{l:"Small family (4–5)",v:"5"},{l:"Extended family (6–7)",v:"7"}]},
  {id:3,q:"Fuel preference?",key:"fuel",opts:[{l:"Petrol",v:"Petrol"},{l:"Diesel",v:"Diesel"},{l:"Electric",v:"Electric"},{l:"No preference",v:"any"}]},
  {id:4,q:"What matters most?",key:"priority",opts:[{l:"Value for money",v:"value"},{l:"Reliability",v:"reliability"},{l:"Features & tech",v:"features"},{l:"Performance",v:"performance"}]},
];

// ── Helpers ───────────────────────────────────────────────────────

const fmt = p => "₹" + (p/100000).toFixed(1) + "L";
const fmtKm = k => k>=1000?(k/1000).toFixed(0)+"k km":k+" km";
const sc = s => s>=88?"#10B981":s>=75?"#F59E0B":"#EF4444";

const MAKE_MODELS = {
  "Maruti Suzuki":["Swift","Baleno","Dzire","WagonR","Alto","Ertiga","Brezza","Ciaz","Celerio","Eeco"],
  "Hyundai":["Creta","Venue","i20","i10 Nios","Verna","Exter","Alcazar","Tucson"],
  "Honda":["City","Amaze","WR-V","Jazz","Civic"],
  "Tata":["Nexon","Punch","Altroz","Tiago","Harrier","Safari","Tigor"],
  "Mahindra":["XUV700","Scorpio","Thar","Bolero","XUV300","XUV400"],
  "Kia":["Seltos","Sonet","Carens"],
  "Toyota":["Innova Crysta","Fortuner","Glanza","Urban Cruiser","Camry"],
  "Volkswagen":["Virtus","Taigun","Polo"],
  "Skoda":["Slavia","Kushaq","Octavia"],
  "MG":["Hector","Astor","ZS EV"],
  "Renault":["Kwid","Triber","Kiger"],
  "Nissan":["Magnite"],
  "BMW":["3 Series","5 Series","X1","X3","X5"],
  "Mercedes-Benz":["A-Class","C-Class","E-Class","GLA"],
  "Audi":["A4","A6","Q3","Q5"],
  "Jeep":["Compass","Meridian"],
  "Other":[],
};
const CATEGORY_OPTIONS=["Hatchback","Sedan","Micro SUV","Compact SUV","Full-size SUV","MUV","Electric"];
const CLASS_OPTIONS=["Economy","Premium","Luxury"];

const MODEL_CATEGORY={
  "Swift":"Hatchback","Baleno":"Hatchback","Alto":"Hatchback","WagonR":"Hatchback","Celerio":"Hatchback","Eeco":"Hatchback","Polo":"Hatchback","Kwid":"Hatchback","Triber":"Hatchback","i20":"Hatchback","i10 Nios":"Hatchback","Altroz":"Hatchback","Tiago":"Hatchback","Glanza":"Hatchback",
  "Dzire":"Sedan","Ciaz":"Sedan","City":"Sedan","Amaze":"Sedan","Verna":"Sedan","Tigor":"Sedan","Virtus":"Sedan","Slavia":"Sedan","Octavia":"Sedan","Camry":"Sedan","3 Series":"Sedan","5 Series":"Sedan","A-Class":"Sedan","C-Class":"Sedan","E-Class":"Sedan","A4":"Sedan","A6":"Sedan",
  "Punch":"Micro SUV","Brezza":"Micro SUV","Venue":"Micro SUV","Sonet":"Micro SUV","Nexon":"Micro SUV","Magnite":"Micro SUV","Kiger":"Micro SUV","WR-V":"Micro SUV","Exter":"Micro SUV","XUV300":"Micro SUV","XUV400":"Micro SUV",
  "Creta":"Compact SUV","Seltos":"Compact SUV","Harrier":"Compact SUV","Astor":"Compact SUV","Hector":"Compact SUV","Taigun":"Compact SUV","Kushaq":"Compact SUV","Urban Cruiser":"Compact SUV","GLA":"Compact SUV","Q3":"Compact SUV","Compass":"Compact SUV","ZS EV":"Compact SUV","X1":"Compact SUV","Jazz":"Hatchback","Civic":"Sedan",
  "Fortuner":"Full-size SUV","Safari":"Full-size SUV","Alcazar":"Full-size SUV","Tucson":"Full-size SUV","XUV700":"Full-size SUV","Scorpio":"Full-size SUV","Thar":"Full-size SUV","Bolero":"Full-size SUV","X3":"Full-size SUV","X5":"Full-size SUV","Q5":"Full-size SUV","Meridian":"Full-size SUV","Carens":"Full-size SUV",
  "Innova Crysta":"MUV","Ertiga":"MUV",
};

const MAKE_CLASS={
  "Maruti Suzuki":"Economy","Renault":"Economy","Nissan":"Economy","Tata":"Economy",
  "Hyundai":"Premium","Honda":"Premium","Kia":"Premium","MG":"Premium","Volkswagen":"Premium","Skoda":"Premium","Toyota":"Premium","Jeep":"Premium","Mahindra":"Premium",
  "BMW":"Luxury","Mercedes-Benz":"Luxury","Audi":"Luxury",
};

const TYRE_BRANDS={
  "MRF":["Wanderer","ZLX","Meteor","Revz-R","ZV2K","ZVTS"],
  "Apollo":["Alnac 4G","Amazer 4G Life","Apterra HP2","Aspire 4G"],
  "CEAT":["SecuraDrive","EnergyDrive","Milaze X3","Czar SUV"],
  "Bridgestone":["Ecopia EP150","Turanza T005","Alenza 001","Potenza S001"],
  "Michelin":["Energy XM2+","Pilot Sport 4","Primacy 4","e.Primacy"],
  "Goodyear":["Assurance TripleMax 2","EfficientGrip","Wrangler HP All Weather"],
  "Yokohama":["Earth-1 E400","BluEarth-GT AE51","dB S.Drive"],
  "JK Tyre":["Tornado","Vectra","Taximax","UX Royale"],
  "Continental":["ComfortContact 6","EcoContact 6","CrossContact ATR"],
  "Pirelli":["Cinturato P7","P Zero","Scorpion Verde"],
};

const TYRE_SIZES=["145/80 R12","155/70 R13","155/80 R13","165/65 R14","175/65 R14","175/70 R14","175/65 R15","185/55 R15","185/60 R15","185/65 R15","195/55 R15","195/55 R16","195/60 R15","195/60 R16","205/55 R16","205/60 R16","205/65 R15","215/55 R17","215/60 R17","215/65 R16","225/55 R17","225/60 R18","235/55 R17","235/60 R18","235/65 R17","245/45 R18","255/50 R19"];

const VARIANTS = {
  "Swift":["LXI","VXI","ZXI","ZXI+"],"Baleno":["Sigma","Delta","Zeta","Alpha"],"Dzire":["LXI","VXI","ZXI","ZXI+"],
  "WagonR":["LXI","VXI","VXI+","ZXI"],"Alto":["STD","LXI","VXI"],"Ertiga":["LXI","VXI","ZXI","ZXI+"],
  "Brezza":["LXI","VXI","ZXI","ZXI+"],"Ciaz":["Sigma","Delta","Zeta","Alpha"],"Celerio":["LXI","VXI","ZXI"],
  "Creta":["E","EX","S","SX","SX(O)"],"Venue":["E","S","SX","SX(O)"],"i20":["Magna","Sportz","Asta"],
  "i10 Nios":["Era","Magna","Sportz","Asta"],"Verna":["E","S","SX","SX(O)"],"Exter":["EX","S","SX","SX(O)"],
  "Alcazar":["Prestige","Platinum","Signature"],"Tucson":["Smart","Platinum","Signature"],
  "City":["SV","V","VX","ZX"],"Amaze":["E","S","VX"],"WR-V":["SV","VX"],"Jazz":["SV","VX"],"Civic":["V","VX","ZX"],
  "Nexon":["XE","XM","XZ","XZ+"],"Punch":["Pure","Adventure","Accomplished","Creative"],"Altroz":["XE","XM","XZ"],
  "Tiago":["XE","XM","XZ"],"Harrier":["XE","XM","XZ","XZ+"],"Safari":["XE","XM","XZ","XZ+"],"Tigor":["XE","XM","XZ"],
  "XUV700":["MX","AX3","AX5","AX7"],"Scorpio":["S3","S5","S7","S9"],"Thar":["AX","LX"],"Bolero":["B4","B6"],
  "XUV300":["W4","W6","W8"],"XUV400":["EC","EL"],
  "Seltos":["HTE","HTK","HTX","GTX"],"Sonet":["HTE","HTK","HTX","GTX"],"Carens":["Premium","Prestige","Luxury"],
  "Innova Crysta":["GX","VX","ZX"],"Fortuner":["4x2","4x4","Legender"],"Glanza":["E","S","G","V"],"Urban Cruiser":["Mid","High"],"Camry":["Hybrid"],
  "Virtus":["Trendline","Comfortline","Highline","GT"],"Taigun":["Trendline","Comfortline","Highline","GT"],"Polo":["Trendline","Comfortline","Highline"],
  "Slavia":["Active","Ambition","Style"],"Kushaq":["Active","Ambition","Style"],"Octavia":["Style","L&K"],
  "Hector":["Style","Super","Smart","Sharp"],"Astor":["Style","Super","Smart","Sharp"],"ZS EV":["Excite","Exclusive"],
  "Kwid":["RXE","RXL","RXT","Climber"],"Triber":["RXE","RXL","RXT"],"Kiger":["RXE","RXL","RXT"],
  "Magnite":["XE","XL","XV"],
  "3 Series":["320i","330i","320d"],"5 Series":["520i","530i","520d"],"X1":["sDrive20i","xDrive20d"],"X3":["xDrive20d","xDrive30i"],"X5":["xDrive30d","xDrive40i"],
  "A-Class":["A200","A220"],"C-Class":["C200","C220d"],"E-Class":["E200","E220d"],"GLA":["GLA200","GLA220d"],
  "A4":["Premium","Premium Plus","Technology"],"A6":["Premium","Technology"],"Q3":["Premium","Premium Plus"],"Q5":["Premium Plus","Technology"],
  "Compass":["Sport","Longitude","Limited"],"Meridian":["Limited","Limited(O)","Overland"],
};

// Auto-fill: variant → {fuel, transmission}. Covers the most common cases for Indian market.
// Keys must match exactly what's in VARIANTS above.
const VARIANT_SPECS = {
  // Maruti — most petrols, AMT on top trims
  "LXI":{fuel:"Petrol",transmission:"Manual"},"VXI":{fuel:"Petrol",transmission:"Manual"},
  "ZXI":{fuel:"Petrol",transmission:"Manual"},"ZXI+":{fuel:"Petrol",transmission:"AMT"},
  "Sigma":{fuel:"Petrol",transmission:"Manual"},"Delta":{fuel:"Petrol",transmission:"Manual"},
  "Zeta":{fuel:"Petrol",transmission:"Automatic"},"Alpha":{fuel:"Petrol",transmission:"Automatic"},
  "STD":{fuel:"Petrol",transmission:"Manual"},
  // Hyundai
  "E":{fuel:"Petrol",transmission:"Manual"},"EX":{fuel:"Petrol",transmission:"Manual"},
  "S":{fuel:"Petrol",transmission:"Manual"},"SX":{fuel:"Petrol",transmission:"Automatic"},
  "SX(O)":{fuel:"Petrol",transmission:"Automatic"},
  "Era":{fuel:"Petrol",transmission:"Manual"},"Magna":{fuel:"Petrol",transmission:"Manual"},
  "Sportz":{fuel:"Petrol",transmission:"Manual"},"Asta":{fuel:"Petrol",transmission:"Automatic"},
  "Prestige":{fuel:"Petrol",transmission:"Automatic"},"Platinum":{fuel:"Petrol",transmission:"Automatic"},
  "Signature":{fuel:"Petrol",transmission:"Automatic"},"Smart":{fuel:"Diesel",transmission:"Automatic"},
  // Honda
  "SV":{fuel:"Petrol",transmission:"Manual"},"V":{fuel:"Petrol",transmission:"Manual"},
  "VX":{fuel:"Petrol",transmission:"CVT"},"ZX":{fuel:"Petrol",transmission:"CVT"},
  // Tata
  "XE":{fuel:"Petrol",transmission:"Manual"},"XM":{fuel:"Petrol",transmission:"Manual"},
  "XZ":{fuel:"Petrol",transmission:"Manual"},"XZ+":{fuel:"Petrol",transmission:"Automatic"},
  "Pure":{fuel:"Petrol",transmission:"Manual"},"Adventure":{fuel:"Petrol",transmission:"Manual"},
  "Accomplished":{fuel:"Petrol",transmission:"AMT"},"Creative":{fuel:"Petrol",transmission:"Automatic"},
  // Mahindra
  "MX":{fuel:"Petrol",transmission:"Manual"},"AX3":{fuel:"Petrol",transmission:"Manual"},
  "AX5":{fuel:"Diesel",transmission:"Manual"},"AX7":{fuel:"Diesel",transmission:"Automatic"},
  "S3":{fuel:"Diesel",transmission:"Manual"},"S5":{fuel:"Diesel",transmission:"Manual"},
  "S7":{fuel:"Diesel",transmission:"Manual"},"S9":{fuel:"Diesel",transmission:"Automatic"},
  "AX":{fuel:"Petrol",transmission:"Manual"},"LX":{fuel:"Diesel",transmission:"Manual"},
  "B4":{fuel:"Diesel",transmission:"Manual"},"B6":{fuel:"Diesel",transmission:"Manual"},
  "W4":{fuel:"Petrol",transmission:"Manual"},"W6":{fuel:"Petrol",transmission:"Manual"},
  "W8":{fuel:"Petrol",transmission:"Automatic"},
  "EC":{fuel:"Electric",transmission:"Automatic"},"EL":{fuel:"Electric",transmission:"Automatic"},
  // Kia
  "HTE":{fuel:"Petrol",transmission:"Manual"},"HTK":{fuel:"Petrol",transmission:"Manual"},
  "HTX":{fuel:"Petrol",transmission:"DCT"},"GTX":{fuel:"Petrol",transmission:"DCT"},
  "Premium":{fuel:"Petrol",transmission:"Manual"},"Luxury":{fuel:"Petrol",transmission:"Automatic"},
  // Toyota
  "GX":{fuel:"Petrol",transmission:"Manual"},"4x2":{fuel:"Petrol",transmission:"Automatic"},
  "4x4":{fuel:"Diesel",transmission:"Automatic"},"Legender":{fuel:"Diesel",transmission:"Automatic"},
  "Hybrid":{fuel:"Hybrid",transmission:"Automatic"},
  "Mid":{fuel:"Petrol",transmission:"Manual"},"High":{fuel:"Petrol",transmission:"Automatic"},
  // VW / Skoda
  "Trendline":{fuel:"Petrol",transmission:"Manual"},"Comfortline":{fuel:"Petrol",transmission:"DCT"},
  "Highline":{fuel:"Petrol",transmission:"DCT"},"GT":{fuel:"Petrol",transmission:"DCT"},
  "Active":{fuel:"Petrol",transmission:"Manual"},"Ambition":{fuel:"Petrol",transmission:"DCT"},
  "Style":{fuel:"Petrol",transmission:"DCT"},"L&K":{fuel:"Petrol",transmission:"DCT"},
  // MG
  "Super":{fuel:"Petrol",transmission:"Automatic"},"Sharp":{fuel:"Petrol",transmission:"Automatic"},
  "Excite":{fuel:"Electric",transmission:"Automatic"},"Exclusive":{fuel:"Electric",transmission:"Automatic"},
  // Renault
  "RXE":{fuel:"Petrol",transmission:"Manual"},"RXL":{fuel:"Petrol",transmission:"Manual"},
  "RXT":{fuel:"Petrol",transmission:"AMT"},"Climber":{fuel:"Petrol",transmission:"AMT"},
  // Nissan
  "XL":{fuel:"Petrol",transmission:"Manual"},"XV":{fuel:"Petrol",transmission:"CVT"},
  // Luxury — generally auto/petrol
  "320i":{fuel:"Petrol",transmission:"Automatic"},"330i":{fuel:"Petrol",transmission:"Automatic"},
  "320d":{fuel:"Diesel",transmission:"Automatic"},"520i":{fuel:"Petrol",transmission:"Automatic"},
  "530i":{fuel:"Petrol",transmission:"Automatic"},"520d":{fuel:"Diesel",transmission:"Automatic"},
  "sDrive20i":{fuel:"Petrol",transmission:"Automatic"},"xDrive20d":{fuel:"Diesel",transmission:"Automatic"},
  "xDrive30i":{fuel:"Petrol",transmission:"Automatic"},"xDrive30d":{fuel:"Diesel",transmission:"Automatic"},
  "xDrive40i":{fuel:"Petrol",transmission:"Automatic"},
  "A200":{fuel:"Petrol",transmission:"Automatic"},"A220":{fuel:"Petrol",transmission:"Automatic"},
  "C200":{fuel:"Petrol",transmission:"Automatic"},"C220d":{fuel:"Diesel",transmission:"Automatic"},
  "E200":{fuel:"Petrol",transmission:"Automatic"},"E220d":{fuel:"Diesel",transmission:"Automatic"},
  "GLA200":{fuel:"Petrol",transmission:"Automatic"},"GLA220d":{fuel:"Diesel",transmission:"Automatic"},
  "Technology":{fuel:"Petrol",transmission:"Automatic"},
  "Sport":{fuel:"Petrol",transmission:"Manual"},"Longitude":{fuel:"Petrol",transmission:"Automatic"},
  "Limited":{fuel:"Diesel",transmission:"Automatic"},"Limited(O)":{fuel:"Diesel",transmission:"Automatic"},
  "Overland":{fuel:"Diesel",transmission:"Automatic"},
};

const SCORE_CATS = [
  {key:"engine",label:"Engine & Drivetrain",weight:25,icon:Gauge,color:"#3B82F6",desc:"Engine condition, oil, gearbox"},
  {key:"body",label:"Body & Paint",weight:20,icon:Car,color:"#10B981",desc:"Dents, scratches, rust, panel gaps"},
  {key:"interior",label:"Interior",weight:15,icon:Star,color:"#F59E0B",desc:"Upholstery, plastics, switchgear"},
  {key:"electrical",label:"Electrical Systems",weight:15,icon:Zap,color:"#8B5CF6",desc:"Battery, lights, infotainment"},
  {key:"tyres",label:"Tyres & Wheels",weight:10,icon:Activity,color:"#06B6D4",desc:"Tread depth, sidewall, alloys"},
  {key:"brakes",label:"Brakes & Suspension",weight:10,icon:Shield,color:"#EF4444",desc:"Pads, discs, shocks, bushings"},
  {key:"docs",label:"Documents",weight:5,icon:FileText,color:"#F97316",desc:"RC, insurance, service history"},
];


const rc = s => s>=80?"#10B981":s>=65?"#F59E0B":"#EF4444";
const rl = s => s>=90?"Excellent":s>=80?"Very Good":s>=70?"Good":s>=55?"Fair":"Poor";
const calcScore = bd => Math.round(SCORE_CATS.reduce((s,c)=>s+(bd[c.key]||0)*(c.weight/100),0));
const tyreColor = pct => pct>=70?"#EF4444":pct>=40?"#F59E0B":"#10B981";

const Card = ({children,style={}}) => <div style={{background:"#1E293B",borderRadius:16,border:"1px solid rgba(255,255,255,0.07)",...style}}>{children}</div>;
const Label = ({children}) => <div style={{color:"#94A3B8",fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:6}}>{children}</div>;
const Btn = ({onClick,children,danger,full,small,w}) => <button onClick={onClick} style={{padding:small?"6px 12px":"10px 20px",borderRadius:small?8:10,border:"none",cursor:"pointer",background:danger?"rgba(220,38,38,0.15)":full?"#DC2626":"rgba(59,130,246,0.15)",color:danger?"#F87171":full?"#fff":"#60A5FA",fontWeight:600,fontSize:small?12:13.5,display:"flex",alignItems:"center",justifyContent:w?"center":"flex-start",gap:6,fontFamily:"Outfit,sans-serif",width:w,flexShrink:0}}>{children}</button>;
const FormInput=({label,value,onChange,type="text",ph=""})=>(
  <div>
    <Label>{label}</Label>
    <input type={type} value={value??""} onChange={e=>onChange(type==="number"?Number(e.target.value):e.target.value)} placeholder={ph}/>
  </div>
);
const FormSection=({title,subtitle,children})=>(
  <div style={{background:"rgba(255,255,255,0.02)",border:"1.5px solid rgba(255,255,255,0.07)",borderRadius:16,padding:20,marginBottom:16}}>
    <div style={{marginBottom:16}}>
      <div style={{fontWeight:700,fontSize:14}}>{title}</div>
      {subtitle&&<div style={{color:"#64748B",fontSize:11.5,marginTop:2}}>{subtitle}</div>}
    </div>
    {children}
  </div>
);


// ── ScoreRing ────────────────────────────────────────────────────
function ScoreRing({score,size=52,light=false}){
  const r=size*0.38,circ=2*Math.PI*r,col=sc(score);
  return(
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={light?"rgba(15,23,42,0.08)":"rgba(255,255,255,0.12)"} strokeWidth="4"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth="4" strokeDasharray={circ} strokeDashoffset={circ*(1-score/100)} strokeLinecap="round"/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{color:col,fontWeight:900,fontSize:size*0.28,fontFamily:"Outfit,sans-serif"}}>{score}</span>
      </div>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────

// ── Navbar ───────────────────────────────────────────────────────
function Navbar({page,setPage,user,setUser,setShowLogin,isAdmin,onGoAdmin}){
  const [menuOpen,setMenuOpen]=useState(false);
  const [userMenuOpen,setUserMenuOpen]=useState(false);
  const [isMobile,setIsMobile]=useState(()=>window.innerWidth<=768);
  useEffect(()=>{
    const handler=()=>setIsMobile(window.innerWidth<=768);
    window.addEventListener("resize",handler);
    return()=>window.removeEventListener("resize",handler);
  },[]);
  const links=[["home","Home"],["browse","Browse"],["blog","Blog"],["forum","Community"]];
  return(
    <>
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:"rgba(255,255,255,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(0,0,0,0.06)",height:64,display:"flex",alignItems:"center",padding:"0 20px",gap:0}}>
      <button onClick={()=>setPage("home")} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",marginRight:"auto"}}>
        <div style={{width:32,height:32,background:"#DC2626",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center"}}><Car size={17} color="#fff"/></div>
        <span style={{fontWeight:900,fontSize:17,letterSpacing:"-0.04em",fontFamily:"Outfit,sans-serif"}}>Pole<span style={{color:"#DC2626"}}>Position</span></span>
      </button>
      {!isMobile&&(
        <>
        <div style={{display:"flex",gap:4,flex:1,justifyContent:"center"}}>
          {links.map(([p,l])=>(
            <button key={p} onClick={()=>setPage(p)} style={{padding:"7px 14px",borderRadius:9,border:"none",cursor:"pointer",background:page===p?"#FEF2F2":"transparent",color:page===p?"#DC2626":"#475569",fontWeight:600,fontSize:13.5}}>
              {l}
            </button>
          ))}
        </div>
        {user
          ?<div style={{position:"relative"}}>
              <button onClick={()=>setUserMenuOpen(m=>!m)} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",padding:"6px 10px",borderRadius:9}}>
                <span style={{fontSize:13.5,fontWeight:600,color:"#475569"}}>Hi, {user}</span>
                <ChevronDown size={14} color="#94A3B8"/>
              </button>
              {userMenuOpen&&(
                <div style={{position:"absolute",top:"100%",right:0,marginTop:8,background:"#fff",borderRadius:12,boxShadow:"0 12px 32px rgba(0,0,0,0.12)",border:"1px solid #E2E8F0",minWidth:210,overflow:"hidden",zIndex:300}}>
                  {isAdmin&&<button onClick={onGoAdmin} style={{width:"100%",padding:"12px 16px",border:"none",background:"none",cursor:"pointer",textAlign:"left",fontSize:13.5,fontWeight:600,color:"#0F172A",display:"flex",alignItems:"center",gap:9,borderBottom:"1px solid #F1F5F9"}}><Shield size={14} color="#DC2626"/> View Admin Dashboard</button>}
                  <button onClick={()=>{setPage("favorites");setUserMenuOpen(false);}} style={{width:"100%",padding:"12px 16px",border:"none",background:"none",cursor:"pointer",textAlign:"left",fontSize:13.5,fontWeight:600,color:"#0F172A",display:"flex",alignItems:"center",gap:9,borderBottom:"1px solid #F1F5F9"}}><Heart size={14} color="#DC2626"/> My Favourites</button>
                  <button onClick={()=>{setUser(null);setUserMenuOpen(false);}} style={{width:"100%",padding:"12px 16px",border:"none",background:"none",cursor:"pointer",textAlign:"left",fontSize:13.5,fontWeight:600,color:"#64748B",display:"flex",alignItems:"center",gap:9}}><LogOut size={14}/> Sign Out</button>
                </div>
              )}
            </div>
          :<div style={{display:"flex",alignItems:"center",gap:14}}>
              <button onClick={onGoAdmin} style={{fontSize:12.5,color:"#94A3B8",fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"Outfit,sans-serif"}}>Login as Admin</button>
              <button onClick={()=>setShowLogin(true)} className="btn-red" style={{padding:"8px 18px",borderRadius:10,fontSize:13.5}}>Sign In</button>
            </div>
        }
        </>
      )}
      {isMobile&&(
        <button onClick={()=>setMenuOpen(m=>!m)} style={{background:"none",border:"none",cursor:"pointer",padding:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:"#0F172A"}}>
          {menuOpen?"✕":"☰"}
        </button>
      )}
    </nav>
    {isMobile&&menuOpen&&(
      <div style={{position:"fixed",inset:0,zIndex:190,background:"rgba(15,23,42,0.5)"}} onClick={()=>setMenuOpen(false)}>
        <div style={{position:"absolute",top:64,left:0,right:0,background:"#fff",boxShadow:"0 12px 40px rgba(0,0,0,0.15)",padding:"16px 20px",display:"flex",flexDirection:"column",gap:4}} onClick={e=>e.stopPropagation()}>
          {links.map(([p,l])=>(
            <button key={p} onClick={()=>{setPage(p);setMenuOpen(false);}} style={{padding:"12px 16px",borderRadius:10,border:"none",cursor:"pointer",background:page===p?"#FEF2F2":"transparent",color:page===p?"#DC2626":"#0F172A",fontWeight:600,fontSize:15,textAlign:"left",fontFamily:"Outfit,sans-serif"}}>
              {l}
            </button>
          ))}
          <div style={{borderTop:"1px solid #F1F5F9",marginTop:8,paddingTop:8}}>
            {user?(
              <>
                {isAdmin&&<button onClick={()=>{onGoAdmin();setMenuOpen(false);}} style={{width:"100%",padding:"12px 16px",borderRadius:10,border:"none",background:"none",cursor:"pointer",textAlign:"left",fontSize:15,fontWeight:600,color:"#0F172A",display:"flex",alignItems:"center",gap:9,fontFamily:"Outfit,sans-serif"}}><Shield size={14} color="#DC2626"/> Admin Dashboard</button>}
                <button onClick={()=>{setPage("favorites");setMenuOpen(false);}} style={{width:"100%",padding:"12px 16px",borderRadius:10,border:"none",background:"none",cursor:"pointer",textAlign:"left",fontSize:15,fontWeight:600,color:"#0F172A",display:"flex",alignItems:"center",gap:9,fontFamily:"Outfit,sans-serif"}}><Heart size={14} color="#DC2626"/> My Favourites</button>
                <button onClick={()=>{setUser(null);setMenuOpen(false);}} style={{width:"100%",padding:"12px 16px",borderRadius:10,border:"none",background:"none",cursor:"pointer",textAlign:"left",fontSize:15,fontWeight:600,color:"#64748B",display:"flex",alignItems:"center",gap:9,fontFamily:"Outfit,sans-serif"}}><LogOut size={14}/> Sign Out</button>
              </>
            ):(
              <>
                <button onClick={()=>{onGoAdmin();setMenuOpen(false);}} style={{width:"100%",padding:"12px 16px",borderRadius:10,border:"none",background:"none",cursor:"pointer",textAlign:"left",fontSize:15,fontWeight:500,color:"#94A3B8",fontFamily:"Outfit,sans-serif"}}>Login as Admin</button>
                <button onClick={()=>{setShowLogin(true);setMenuOpen(false);}} className="btn-red" style={{width:"100%",padding:"12px 16px",borderRadius:10,fontSize:15,marginTop:4}}>Sign In</button>
              </>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}

// ── LoginModal ────────────────────────────────────────────────────

// ── LoginModal ───────────────────────────────────────────────────
function LoginCard({mode="user",onClose,onSubmit,error}){
  const [tab,setTab]=useState("login");
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [name,setName]=useState("");
  const [remember,setRemember]=useState(true);
  const [loading,setLoading]=useState(false);
  const submit=()=>{
    if(!email||!pass||loading)return;
    setLoading(true);
    setTimeout(()=>{
      onSubmit({tab,email,pass,name,remember});
      setLoading(false);
    },800);
  };
  const inp={width:"100%",padding:"11px 14px",fontSize:14,borderRadius:12,border:"1.5px solid #E2E8F0",background:"#F8FAFC",color:"#0F172A"};
  return(
    <div className="glass" style={{borderRadius:24,padding:36,width:390,maxWidth:"94vw",position:"relative"}} onClick={e=>e.stopPropagation()}>
      {onClose&&<button onClick={onClose} style={{position:"absolute",top:14,right:14,background:"#F1F5F9",border:"none",borderRadius:"50%",width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={14}/></button>}
      <div style={{width:40,height:40,background:"#DC2626",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}><Car size={19} color="#fff"/></div>
      <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:21,letterSpacing:"-0.04em",marginBottom:4,color:"#0F172A"}}>{mode==="admin"?"Pole Position Admin Console":(tab==="signup"?"Welcome aboard":"Welcome back")}</h2>
      <p style={{color:"#64748B",fontSize:13,marginBottom:20}}>{mode==="admin"?"Sign in with your admin account":"Sign in to save favourites and track listings"}</p>
      {mode==="user"&&(
        <div style={{display:"flex",background:"#F1F5F9",borderRadius:11,padding:3,marginBottom:20}}>
          {["login","signup"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"7px 0",borderRadius:9,border:"none",cursor:"pointer",fontWeight:600,fontSize:13,background:tab===t?"#fff":"transparent",color:tab===t?"#0F172A":"#64748B",boxShadow:tab===t?"0 2px 6px rgba(0,0,0,0.08)":"none"}}>
              {t==="login"?"Log in":"Sign up"}
            </button>
          ))}
        </div>
      )}
      {mode==="user"&&tab==="signup"&&<div style={{marginBottom:12}}><label style={{fontSize:11,fontWeight:700,color:"#64748B",textTransform:"uppercase",display:"block",marginBottom:6}}>Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Arjun Sharma" style={inp}/></div>}
      <div style={{marginBottom:12}}><label style={{fontSize:11,fontWeight:700,color:"#64748B",textTransform:"uppercase",display:"block",marginBottom:6}}>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com" style={inp}/></div>
      <div style={{marginBottom:12}}><label style={{fontSize:11,fontWeight:700,color:"#64748B",textTransform:"uppercase",display:"block",marginBottom:6}}>Password</label><input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="••••••••" style={inp}/></div>
      <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",marginBottom:18}}>
        <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} style={{width:15,height:15,accentColor:"#DC2626"}}/>
        <span style={{color:"#64748B",fontSize:12.5}}>Remember me</span>
      </label>
      {error&&<p style={{color:"#DC2626",fontSize:12.5,marginBottom:14}}>{error}</p>}
      <button className="btn-red" style={{width:"100%",padding:"12px",borderRadius:12,fontSize:15,opacity:loading?0.7:1,cursor:loading?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={submit} disabled={loading}>
        {loading?(<><span style={{width:14,height:14,border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite"}}/> Signing in…</>):(mode==="admin"?"Sign In to Admin":(tab==="login"?"Sign In":"Create Account"))}
      </button>
    </div>
  );
}

function LoginModal({onClose,onLogin}){
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [confirmed,setConfirmed]=useState(false);
  if(confirmed) return(
    <div style={{position:"fixed",inset:0,zIndex:500,background:"rgba(15,23,42,0.55)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div className="glass" style={{borderRadius:24,padding:40,width:390,maxWidth:"94vw",textAlign:"center"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:52,height:52,background:"#DCFCE7",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><CheckCircle size={26} color="#16A34A"/></div>
        <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:20,marginBottom:8,color:"#0F172A"}}>Check your email</h2>
        <p style={{color:"#64748B",fontSize:14,lineHeight:1.6,marginBottom:24}}>We've sent a confirmation link to your email. Click it to activate your account, then come back and sign in.</p>
        <button className="btn-red" style={{padding:"11px 28px",borderRadius:12,fontSize:14}} onClick={onClose}>Got it</button>
      </div>
    </div>
  );
  return(
    <div style={{position:"fixed",inset:0,zIndex:500,background:"rgba(15,23,42,0.55)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <LoginCard mode="user" onClose={onClose} error={err} loading={loading} onSubmit={async({tab,name,email,pass})=>{
        setErr("");setLoading(true);
        if(tab==="signup"){
          const {data,error}=await supabase.auth.signUp({email,password:pass,options:{data:{name}}});
          if(error){setErr(error.message);setLoading(false);return;}
          if(data.user&&!data.session){setConfirmed(true);setLoading(false);return;}
          onLogin({name:name||email.split("@")[0]||"User",email,id:data.user?.id});
        } else {
          const {data,error}=await supabase.auth.signInWithPassword({email,password:pass});
          if(error){setErr(error.message);setLoading(false);return;}
          const n=data.user?.user_metadata?.name||email.split("@")[0]||"User";
          onLogin({name:n,email,id:data.user?.id});
        }
        setLoading(false);
      }}/>
    </div>
  );
}

// ── CarCard ───────────────────────────────────────────────────────

// ── CarCard ──────────────────────────────────────────────────────
function CarCard({car,onFav,isFav,onClick}){
  const [hov,setHov]=useState(false);
  const [err,setErr]=useState(false);
  const b=car.badge?BADGE[car.badge]:null;
  const FB="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80";
  return(
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{borderRadius:20,overflow:"hidden",cursor:"pointer",position:"relative",aspectRatio:"3/4",transition:"transform 0.3s,box-shadow 0.3s",transform:hov?"translateY(-7px) scale(1.012)":"none",boxShadow:hov?"0 36px 72px rgba(0,0,0,0.35)":"0 6px 24px rgba(0,0,0,0.1)",background:"#1a1a2e"}}>
      <img src={err?FB:(car.img||FB)} onError={()=>setErr(true)} alt={car.make+" "+car.model}
        style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover"}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,0.08) 0%,rgba(0,0,0,0) 22%,rgba(0,0,0,0.55) 58%,rgba(0,0,0,0.97) 100%)"}}/>
      <div style={{position:"absolute",top:13,left:13,right:13,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        {b?<span style={{background:b.bg,padding:"4px 10px",borderRadius:100,fontSize:10,fontWeight:700,color:"#fff"}}>{b.label}</span>:<span/>}
        <button onClick={e=>{e.stopPropagation();onFav(car.id);}} style={{background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.2)",cursor:"pointer",width:34,height:34,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Heart size={13} fill={isFav?"#DC2626":"none"} color={isFav?"#DC2626":"#fff"} strokeWidth={2.2}/>
        </button>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0}}>
        <div style={{padding:"0 16px 2px"}}>
          {[{l:"Year",v:car.year},{l:"Fuel",v:car.fuel},{l:"Driven",v:fmtKm(car.km)}].map(s=>(
            <div key={s.l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.4)",fontWeight:500,letterSpacing:"0.07em",textTransform:"uppercase"}}>{s.l}</span>
              <span style={{fontSize:11.5,color:"#fff",fontWeight:700}}>{s.v}</span>
            </div>
          ))}
        </div>
        <div style={{padding:"9px 16px 10px",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          <div>
            <div style={{color:"#fff",fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:18,letterSpacing:"-0.035em",lineHeight:1.1}}>{car.make} {car.model}</div>
            <div style={{color:"rgba(255,255,255,0.38)",fontSize:10,marginTop:3,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase"}}>{car.category} · {car.transmission}</div>
          </div>
          <ScoreRing score={car.score} size={44}/>
        </div>
        <div style={{display:"flex",borderTop:"1px solid rgba(255,255,255,0.1)"}}>
          <div style={{padding:"11px 16px",flex:1}}>
            <div style={{color:"#fff",fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:17,letterSpacing:"-0.04em"}}>{fmt(car.price)}</div>
            <div style={{color:"rgba(255,255,255,0.28)",fontSize:10,marginTop:1,fontWeight:600,textTransform:"uppercase"}}>{car.owners} owner{car.owners>1?"s":""}</div>
          </div>
          <div style={{padding:"11px 16px",borderLeft:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",gap:4,color:"rgba(255,255,255,0.6)",fontSize:11.5,fontWeight:700}}>
            View <ChevronRight size={12}/>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── HomePage ──────────────────────────────────────────────────────

// ── HomePage ─────────────────────────────────────────────────────
function HomePage({setPage,setSelectedCar,favs,toggleFav,cars,blog}){
  const hot=useMemo(()=>cars.filter(c=>c.score>=86).slice(0,6),[cars]);
  const hero={minHeight:"100vh",background:"linear-gradient(135deg,#0F172A 0%,#1E293B 100%)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",textAlign:"center",padding:"0 24px",position:"relative",overflow:"hidden"};
  return(
    <div style={{paddingTop:64}}>
      {/* Hero */}
      <div style={hero}>
        <div style={{position:"absolute",top:"15%",left:"10%",width:400,height:400,background:"radial-gradient(circle,rgba(220,38,38,0.12) 0%,transparent 70%)",borderRadius:"50%"}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:680}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(220,38,38,0.1)",border:"1px solid rgba(220,38,38,0.25)",borderRadius:100,padding:"6px 14px",marginBottom:24}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#DC2626"}}/>
            <span style={{color:"#DC2626",fontSize:12.5,fontWeight:700,letterSpacing:"0.08em"}}>HYDERABAD'S TRUSTED USED CAR MARKETPLACE</span>
          </div>
          <h1 style={{color:"#fff",fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:"clamp(38px,7vw,72px)",letterSpacing:"-0.04em",lineHeight:1.0,marginBottom:20}}>
            Find Your Perfect<br/><span style={{color:"#DC2626"}}>Used Car</span>
          </h1>
          <p style={{color:"rgba(255,255,255,0.55)",fontSize:"clamp(15px,2vw,18px)",lineHeight:1.65,marginBottom:36,maxWidth:500,margin:"0 auto 36px"}}>
            Every car independently inspected and scored. No hidden surprises.
          </p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
            <button onClick={()=>setPage("browse")} className="btn-red" style={{padding:"14px 32px",borderRadius:12,fontSize:15,display:"flex",alignItems:"center",gap:8}}>
              Browse Cars <ChevronRight size={16}/>
            </button>
            <button onClick={()=>setPage("quiz")} style={{padding:"14px 28px",borderRadius:12,fontSize:15,border:"1.5px solid rgba(255,255,255,0.15)",background:"transparent",color:"#fff",cursor:"pointer",fontFamily:"Outfit,sans-serif",fontWeight:600}}>
              Find My Match
            </button>
          </div>
        </div>
      </div>

      {/* Hot listings */}
      <div style={{padding:"72px 32px",background:"#F8FAFC"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32}}>
            <div>
              <div style={{color:"#DC2626",fontSize:12,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Curated Picks</div>
              <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:32,letterSpacing:"-0.03em"}}>Top Rated Right Now</h2>
            </div>
            <button onClick={()=>setPage("browse")} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 18px",borderRadius:10,border:"1.5px solid #E2E8F0",background:"#fff",cursor:"pointer",fontWeight:600,fontSize:13.5,color:"#475569"}}>
              View all <ArrowRight size={14}/>
            </button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:20}}>
            {hot.map(c=><CarCard key={c.id} car={c} onFav={toggleFav} isFav={favs.includes(c.id)} onClick={()=>{setSelectedCar(c);}}/>)}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{background:"#0F172A",padding:"60px 32px"}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:32,textAlign:"center"}}>
          {[[cars.length+"+ Cars","In our showroom"],[cars.filter(c=>c.score>=85).length,"Scored 85+"],["100%","Inspected"]].map(([n,l])=>(
            <div key={l}>
              <div style={{color:"#fff",fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:44,letterSpacing:"-0.04em",marginBottom:6}}>{n}</div>
              <div style={{color:"rgba(255,255,255,0.4)",fontSize:14,fontWeight:500}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Blog preview */}
      <div style={{padding:"72px 32px",background:"#F8FAFC"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28}}>
            <div>
              <div style={{color:"#DC2626",fontSize:12,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>From the Blog</div>
              <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:28,letterSpacing:"-0.03em"}}>Expert Reviews & Guides</h2>
            </div>
            <button onClick={()=>setPage("blog")} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 18px",borderRadius:10,border:"1.5px solid #E2E8F0",background:"#fff",cursor:"pointer",fontWeight:600,fontSize:13.5,color:"#475569"}}>
              All articles <ArrowRight size={14}/>
            </button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20}}>
            {blog.slice(0,3).map(p=>(
              <div key={p.id} style={{background:"#fff",borderRadius:16,overflow:"hidden",border:"1px solid #E2E8F0",cursor:"pointer"}} onClick={()=>setPage("blog")}>
                <img src={p.img} alt="" style={{width:"100%",height:180,objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
                <div style={{padding:"16px 18px"}}>
                  <span style={{background:TAG_COLORS[p.tag]+"18",color:TAG_COLORS[p.tag],fontSize:10.5,fontWeight:700,padding:"3px 9px",borderRadius:20}}>{p.tag}</span>
                  <p style={{fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:15.5,marginTop:10,letterSpacing:"-0.02em",lineHeight:1.3}}>{p.title}</p>
                  <div style={{marginTop:10,fontSize:12,color:"#94A3B8"}}>{p.author} · {p.readTime} read</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{background:"#0F172A",padding:"40px 32px",textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center",marginBottom:12}}>
          <div style={{width:28,height:28,background:"#DC2626",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}><Car size={14} color="#fff"/></div>
          <span style={{color:"#fff",fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:15}}>Pole<span style={{color:"#DC2626"}}>Position</span></span>
        </div>
        <p style={{color:"rgba(255,255,255,0.3)",fontSize:13}}>© 2025 Pole Position. Hyderabad's #1 trusted used car marketplace.</p>
      </div>
    </div>
  );
}

// ── BrowsePage ────────────────────────────────────────────────────

// ── BrowsePage ───────────────────────────────────────────────────
function BrowseCarCard({car,onFav,isFav,onClick}){
  const [err,setErr]=useState(false);
  const FB="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80";
  const specs=[[Gauge,fmtKm(car.km)],[Fuel,car.fuel],[Car,car.transmission],[Users,car.seats+" seats"]];
  return(
    <div onClick={onClick} style={{background:"#fff",borderRadius:20,border:"1.5px solid #E2E8F0",overflow:"hidden",cursor:"pointer",transition:"box-shadow 0.2s,transform 0.2s,border-color 0.2s"}}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 18px 34px rgba(15,23,42,0.1)";e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.borderColor="#E2E8F0";}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none";}}>
      <div style={{position:"relative",aspectRatio:"16/10"}}>
        <img src={err?FB:(car.img||FB)} onError={()=>setErr(true)} alt={car.make+" "+car.model} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        {car.badge&&<span style={{position:"absolute",top:12,left:12,background:BADGE[car.badge].bg,color:"#fff",padding:"4px 11px",borderRadius:100,fontSize:10.5,fontWeight:700}}>{BADGE[car.badge].label}</span>}
        <button onClick={e=>{e.stopPropagation();onFav(car.id);}} style={{position:"absolute",top:10,right:10,width:32,height:32,borderRadius:"50%",border:"none",background:"rgba(255,255,255,0.92)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Heart size={14} fill={isFav?"#DC2626":"none"} color={isFav?"#DC2626":"#475569"}/>
        </button>
      </div>
      <div style={{padding:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:13}}>
          <div>
            <div style={{fontWeight:800,fontSize:16,letterSpacing:"-0.02em"}}>{car.make} {car.model}</div>
            <div style={{color:"#94A3B8",fontSize:11.5,fontWeight:600,marginTop:2}}>{car.year} · {car.category}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:9,flexShrink:0}}>
            <ScoreRing score={car.score} size={36} light/>
            <div style={{fontWeight:800,fontSize:16.5,color:"#DC2626",letterSpacing:"-0.02em",whiteSpace:"nowrap"}}>{fmt(car.price)}</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:14}}>
          {specs.map(([Icon,label],i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:6,background:"#F8FAFC",borderRadius:9,padding:"7px 9px"}}>
              <Icon size={12.5} color="#64748B"/><span style={{fontSize:11,color:"#475569",fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{label}</span>
            </div>
          ))}
        </div>
        <p style={{color:"#64748B",fontSize:12.5,lineHeight:1.5,marginBottom:14,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{car.tagline}</p>
        <button className="btn-red" style={{width:"100%",padding:"11px",borderRadius:11,fontSize:13.5,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
          View Details <ArrowRight size={13}/>
        </button>
      </div>
    </div>
  );
}

function FilterCard({title,onReset,children}){
  return(
    <div style={{background:"#fff",borderRadius:18,border:"1.5px solid #E2E8F0",padding:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <span style={{fontWeight:700,fontSize:13.5}}>{title}</span>
        {onReset&&<button onClick={onReset} style={{color:"#DC2626",fontSize:12,fontWeight:600,background:"none",border:"none",cursor:"pointer"}}>Reset</button>}
      </div>
      {children}
    </div>
  );
}

function ChipFilter({options,selected,onToggle}){
  return(
    <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
      {options.map(o=>{
        const active=selected.includes(o);
        return(
          <button key={o} onClick={()=>onToggle(o)} style={{padding:"7px 13px",borderRadius:9,border:active?"1.5px solid #DC2626":"1.5px solid #E2E8F0",background:active?"#FEF2F2":"#fff",color:active?"#DC2626":"#475569",fontSize:12.5,fontWeight:600,cursor:"pointer"}}>
            {o}
          </button>
        );
      })}
    </div>
  );
}

function BrowsePage({setPage,setSelectedCar,favs,toggleFav,cars}){
  const [openMake,setOpenMake]=useState(null);
  const [selModels,setSelModels]=useState([]);
  const [selTrans,setSelTrans]=useState([]);
  const [selFuel,setSelFuel]=useState([]);
  const [selCat,setSelCat]=useState([]);
  const [showMobileFilters,setShowMobileFilters]=useState(false);
  const [isMobile,setIsMobile]=useState(()=>window.innerWidth<=768);
  useEffect(()=>{
    const handler=()=>setIsMobile(window.innerWidth<=768);
    window.addEventListener("resize",handler);
    return()=>window.removeEventListener("resize",handler);
  },[]);

  const allPrices=cars.map(c=>c.price);
  const floorPrice=Math.min(...allPrices), ceilPrice=Math.max(...allPrices);
  const [priceMin,setPriceMin]=useState(floorPrice);
  const [priceMax,setPriceMax]=useState(ceilPrice);

  const allKm=cars.map(c=>c.km);
  const floorKm=Math.min(...allKm), ceilKm=Math.max(...allKm);
  const [kmMin,setKmMin]=useState(floorKm);
  const [kmMax,setKmMax]=useState(ceilKm);

  const allYears=cars.map(c=>c.year);
  const floorYear=Math.min(...allYears), ceilYear=Math.max(...allYears);
  const [yearMin,setYearMin]=useState(floorYear);
  const [yearMax,setYearMax]=useState(ceilYear);

  const makeModelMap={};
  cars.forEach(c=>{
    if(!makeModelMap[c.make])makeModelMap[c.make]=new Set();
    makeModelMap[c.make].add(c.model);
  });
  const allTrans=[...new Set(cars.map(c=>c.transmission))];
  const allFuels=[...new Set(cars.map(c=>c.fuel))];
  const allCats=[...new Set(cars.map(c=>c.category))];

  const toggleIn=(arr,setArr,v)=>setArr(arr.includes(v)?arr.filter(x=>x!==v):[...arr,v]);

  const filtered=cars.filter(c=>{
    const matchModel=selModels.length===0||selModels.includes(c.make+"|"+c.model);
    const matchTrans=selTrans.length===0||selTrans.includes(c.transmission);
    const matchFuel=selFuel.length===0||selFuel.includes(c.fuel);
    const matchCat=selCat.length===0||selCat.includes(c.category);
    const matchPrice=c.price>=priceMin&&c.price<=priceMax;
    const matchKm=c.km>=kmMin&&c.km<=kmMax;
    const matchYear=c.year>=yearMin&&c.year<=yearMax;
    return matchModel&&matchTrans&&matchFuel&&matchCat&&matchPrice&&matchKm&&matchYear;
  });

  const histBars=[30,45,60,80,95,70,85,100,75,55,65,40,50,35,25];
  const yearPct=v=>((v-floorYear)/((ceilYear-floorYear)||1))*100;

  return(
    <div style={{paddingTop:80,minHeight:"100vh",background:"#F8FAFC"}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 24px 70px"}}>

        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
          <h1 style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:32,letterSpacing:"-0.03em"}}>Browse Cars</h1>
          <span style={{background:"#DC2626",color:"#fff",padding:"5px 14px",borderRadius:100,fontWeight:700,fontSize:14}}>{filtered.length}</span>
        </div>

        <div style={{display:"flex",gap:26,alignItems:"flex-start"}}>
          {/* ── Filter sidebar ── */}
          {(!isMobile||showMobileFilters)&&(<div style={{width:268,flexShrink:0,display:"flex",flexDirection:"column",gap:16,...(isMobile?{position:"fixed",top:0,left:0,bottom:0,zIndex:400,width:300,background:"#fff",overflowY:"auto",padding:"70px 16px 20px",boxShadow:"0 0 40px rgba(0,0,0,0.2)"}:{position:"sticky",top:90,maxHeight:"calc(100vh - 110px)",overflowY:"auto",paddingRight:4})}}>
          {isMobile&&showMobileFilters&&<button onClick={()=>setShowMobileFilters(false)} style={{position:"fixed",top:20,right:20,zIndex:401,background:"#F1F5F9",border:"none",borderRadius:"50%",width:34,height:34,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={16}/></button>}

            <FilterCard title="Make & Model" onReset={selModels.length>0?()=>setSelModels([]):null}>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {Object.keys(makeModelMap).map(make=>{
                  const models=[...makeModelMap[make]];
                  const isOpen=openMake===make;
                  const selectedCount=models.filter(m=>selModels.includes(make+"|"+m)).length;
                  return(
                    <div key={make} style={{border:"1px solid #E2E8F0",borderRadius:11,overflow:"hidden"}}>
                      <button onClick={()=>setOpenMake(isOpen?null:make)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:selectedCount>0?"#FEF2F2":"#fff",border:"none",cursor:"pointer"}}>
                        <span style={{fontSize:13,fontWeight:600,color:selectedCount>0?"#DC2626":"#0F172A"}}>{make}{selectedCount>0?" ("+selectedCount+")":""}</span>
                        <ChevronDown size={14} color="#94A3B8" style={{transform:isOpen?"rotate(180deg)":"none",transition:"transform 0.15s"}}/>
                      </button>
                      {isOpen&&(
                        <div style={{padding:"4px 12px 10px",display:"flex",flexDirection:"column",gap:6,background:"#FAFBFC"}}>
                          {models.map(model=>{
                            const key=make+"|"+model;
                            const checked=selModels.includes(key);
                            return(
                              <label key={model} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                                <input type="checkbox" checked={checked} onChange={()=>toggleIn(selModels,setSelModels,key)} style={{width:14,height:14,accentColor:"#DC2626"}}/>
                                <span style={{fontSize:12.5,color:"#475569"}}>{model}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </FilterCard>

            <FilterCard title="Price" onReset={(priceMin>floorPrice||priceMax<ceilPrice)?()=>{setPriceMin(floorPrice);setPriceMax(ceilPrice);}:null}>
              <div style={{display:"flex",alignItems:"flex-end",gap:2,height:40,marginBottom:14}}>
                {histBars.map((h,i)=><div key={i} style={{flex:1,height:h+"%",background:"#FCA5A5",borderRadius:2}}/>)}
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input type="number" value={priceMin} onChange={e=>setPriceMin(Number(e.target.value)||0)} style={{width:"50%",padding:"8px 9px",borderRadius:9,border:"1.5px solid #E2E8F0",fontSize:12}}/>
                <span style={{color:"#CBD5E1",fontSize:12}}>–</span>
                <input type="number" value={priceMax} onChange={e=>setPriceMax(Number(e.target.value)||0)} style={{width:"50%",padding:"8px 9px",borderRadius:9,border:"1.5px solid #E2E8F0",fontSize:12}}/>
              </div>
            </FilterCard>

            <FilterCard title="Transmission" onReset={selTrans.length>0?()=>setSelTrans([]):null}>
              <ChipFilter options={allTrans} selected={selTrans} onToggle={v=>toggleIn(selTrans,setSelTrans,v)}/>
            </FilterCard>

            <FilterCard title="KM Driven" onReset={(kmMin>floorKm||kmMax<ceilKm)?()=>{setKmMin(floorKm);setKmMax(ceilKm);}:null}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input type="number" value={kmMin} onChange={e=>setKmMin(Number(e.target.value)||0)} style={{width:"50%",padding:"8px 9px",borderRadius:9,border:"1.5px solid #E2E8F0",fontSize:12}}/>
                <span style={{color:"#CBD5E1",fontSize:12}}>–</span>
                <input type="number" value={kmMax} onChange={e=>setKmMax(Number(e.target.value)||0)} style={{width:"50%",padding:"8px 9px",borderRadius:9,border:"1.5px solid #E2E8F0",fontSize:12}}/>
              </div>
            </FilterCard>

            <FilterCard title="Year" onReset={(yearMin>floorYear||yearMax<ceilYear)?()=>{setYearMin(floorYear);setYearMax(ceilYear);}:null}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                <span style={{fontSize:12.5,fontWeight:700,color:"#0F172A"}}>{yearMin}</span>
                <span style={{fontSize:12.5,fontWeight:700,color:"#0F172A"}}>{yearMax}</span>
              </div>
              <div style={{position:"relative",height:20}}>
                <div style={{position:"absolute",top:8,left:0,right:0,height:4,background:"#E2E8F0",borderRadius:2}}/>
                <div style={{position:"absolute",top:8,height:4,background:"#DC2626",borderRadius:2,left:yearPct(yearMin)+"%",right:(100-yearPct(yearMax))+"%"}}/>
                <input type="range" className="range-dual" min={floorYear} max={ceilYear} value={yearMin} onChange={e=>setYearMin(Math.min(Number(e.target.value),yearMax))} style={{zIndex:3}}/>
                <input type="range" className="range-dual" min={floorYear} max={ceilYear} value={yearMax} onChange={e=>setYearMax(Math.max(Number(e.target.value),yearMin))} style={{zIndex:4}}/>
              </div>
            </FilterCard>

            <FilterCard title="Fuel" onReset={selFuel.length>0?()=>setSelFuel([]):null}>
              <ChipFilter options={allFuels} selected={selFuel} onToggle={v=>toggleIn(selFuel,setSelFuel,v)}/>
            </FilterCard>

            <FilterCard title="Type" onReset={selCat.length>0?()=>setSelCat([]):null}>
              <ChipFilter options={allCats} selected={selCat} onToggle={v=>toggleIn(selCat,setSelCat,v)}/>
            </FilterCard>

          </div>)}

          {/* ── Results grid ── */}
          <div style={{flex:1}}>
            {isMobile&&(
              <div style={{marginBottom:16}}>
                <button onClick={()=>setShowMobileFilters(true)} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 18px",borderRadius:10,border:"1.5px solid #E2E8F0",background:"#fff",cursor:"pointer",fontWeight:600,fontSize:13.5,color:"#475569"}}>
                  <Filter size={14}/> Filters
                </button>
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20}}>
              {filtered.map(c=><BrowseCarCard key={c.id} car={c} onFav={toggleFav} isFav={favs.includes(c.id)} onClick={()=>{setSelectedCar(c);}}/>)}
            </div>
            {filtered.length===0&&<div style={{textAlign:"center",padding:"80px 0",color:"#94A3B8"}}>No cars match your filters.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CarDetailPage ─────────────────────────────────────────────────

// ── CarDetailPage ────────────────────────────────────────────────
function CarDetailPage({car,setPage,isFav,onFav,user,setShowLogin,userEmail}){
  const [tab,setTab]=useState("overview");
  const [err,setErr]=useState(false);
  const [activeImg,setActiveImg]=useState(0);
  const [enquired,setEnquired]=useState(false);
  const [showEnquiryModal,setShowEnquiryModal]=useState(false);
  const [enquiryPhone,setEnquiryPhone]=useState("");
  const [enquirySubmitting,setEnquirySubmitting]=useState(false);
  const [isMobile,setIsMobile]=useState(()=>window.innerWidth<=768);
  useEffect(()=>{
    const handler=()=>setIsMobile(window.innerWidth<=768);
    window.addEventListener("resize",handler);
    return()=>window.removeEventListener("resize",handler);
  },[]);
  if(!car)return null;
  const FB="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80";
  const bd=car.scoreBreakdown||{};
  const TABS=[["overview","Overview"],["inspection","Inspection"],["who","Who It's For"],["specs","Specs"]];

  // Derive highlights from car data
  const highlights=[
    car.owners===1?"Single owner — no fleet history":"Previously "+car.owners+" owners",
    car.km<20000?"Low mileage — "+fmtKm(car.km)+" driven":fmtKm(car.km)+" on the odometer",
    car.fuel==="Electric"?"Zero emissions, zero fuel costs":""+car.fuel+" engine",
    car.transmission==="Automatic"||car.transmission==="DCT"||car.transmission==="CVT"?"Automatic transmission — easy city driving":"Manual gearbox — driver's choice",
    car.insurance?"Insurance "+car.insurance:"Check insurance status",
    car.seats===7?"7-seater — great for large families":car.seats===5?"5-seater with comfortable rear bench":"Compact "+car.seats+" seats",
  ];

  // Derive "for who" from car attributes
  const forWho=[
    car.price<900000?"Budget-conscious buyers seeking value":"Buyers who want premium quality",
    car.fuel==="Electric"?"EV early adopters and eco-conscious buyers":"Petrol/diesel drivers with existing habits",
    car.category.includes("SUV")?"Families needing ground clearance and space":"City commuters who prefer easy parking",
    car.transmission==="Automatic"||car.transmission==="CVT"?"People who drive mostly in stop-go traffic":"Enthusiasts who enjoy engaging drives",
  ];
  const notForWho=[
    car.price>2000000?"First-time car buyers on a budget":"Buyers wanting the latest new car experience",
    car.km>40000?"Those who want very low mileage":"Those needing a 7-seater",
    car.fuel==="Electric"?"Buyers without home charging access":"Pure EV advocates",
    car.seats<7?"Large families of 6 or more":"Urban drivers who want a compact car",
  ];

  const scoreLabels={engine:"Engine",body:"Body & Paint",interior:"Interior",electrical:"Electrical",tyres:"Tyres",brakes:"Brakes",docs:"Documents"};

  // Pseudo engagement stat — deterministic per car, illustrative only
  const viewsToday=(car.id*53+121)%180+40;
  // Simple EMI estimate: 80% financed, 9.5% annual interest, 60-month tenure
  const principal=car.price*0.8, rate=0.095/12, n=60;
  const emi=Math.round(principal*rate*Math.pow(1+rate,n)/(Math.pow(1+rate,n)-1));
  const galleryImages=(car.images&&car.images.length)?car.images:[car.img||FB];
  const gallery=[...galleryImages.map(url=>({type:"image",url})),...(car.video?[{type:"video",url:car.video}]:[])];

  return(
    <div style={{paddingTop:64,minHeight:"100vh",background:"#F8FAFC",paddingBottom:isMobile?100:0}}>
      {isMobile&&(
        <div style={{position:"fixed",top:64,left:0,right:0,zIndex:150,background:"rgba(255,255,255,0.97)",backdropFilter:"blur(10px)",borderBottom:"1px solid #E2E8F0",padding:"10px 16px",display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setPage("browse")} style={{background:"none",border:"none",cursor:"pointer",color:"#64748B",display:"flex",alignItems:"center"}}><ChevronLeft size={18}/></button>
          <span style={{fontWeight:700,fontSize:15,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{car.make} {car.model}</span>
        </div>
      )}
      {/* Gallery + summary panel */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:isMobile?"60px 16px 0":"24px 28px 0"}}>
        {!isMobile&&<button onClick={()=>setPage("browse")} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"#64748B",fontSize:13,fontWeight:600,marginBottom:18}}>
          <ChevronLeft size={15}/> Back to results
        </button>}
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 360px",gap:30,alignItems:"flex-start"}}>
          {/* LEFT — gallery */}
          <div>
            <div style={{position:"relative",borderRadius:20,overflow:"hidden",aspectRatio:"16/10",background:"#0F172A"}}>
              {gallery[activeImg]?.type==="video"?(
                <video src={gallery[activeImg].url} controls style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              ):(
                <img src={err?FB:(gallery[activeImg]?.url||FB)} onError={()=>setErr(true)} alt={car.make+" "+car.model} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              )}
              {car.badge&&<div style={{position:"absolute",top:16,left:16,background:BADGE[car.badge].bg,padding:"5px 14px",borderRadius:100,fontSize:12,fontWeight:700,color:"#fff"}}>{BADGE[car.badge].label}</div>}
            </div>
            <div style={{display:"flex",gap:10,marginTop:12}}>
              {gallery.map((m,i)=>(
                <button key={i} onClick={()=>{setActiveImg(i);setErr(false);}} style={{width:80,height:60,borderRadius:11,overflow:"hidden",border:activeImg===i?"2.5px solid #DC2626":"2.5px solid transparent",padding:0,cursor:"pointer",flexShrink:0,opacity:activeImg===i?1:0.65,transition:"opacity 0.15s",position:"relative",background:"#0F172A"}}>
                  {m.type==="video"?(
                    <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}><Play size={15} color="#fff" fill="#fff"/></div>
                  ):(
                    <img src={m.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  )}
                </button>
              ))}
              <button onClick={()=>setTab("inspection")} style={{width:80,height:60,borderRadius:11,border:"1.5px solid #E2E8F0",background:"#F8FAFC",cursor:"pointer",flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3}}>
                <MessageSquare size={14} color="#64748B"/>
                <span style={{fontSize:8,color:"#94A3B8",fontWeight:700,textAlign:"center",lineHeight:1.1}}>Community</span>
              </button>
            </div>
          </div>

          {/* RIGHT — summary panel */}
          <div style={{background:"#fff",borderRadius:20,border:"1px solid #E2E8F0",padding:24,...(isMobile?{}:{position:"sticky",top:88})}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:6}}>
              <h1 style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:23,letterSpacing:"-0.03em",lineHeight:1.15}}>{car.make} {car.model}{car.variant&&<span style={{color:"#94A3B8",fontWeight:700}}> {car.variant}</span>}</h1>
              <div style={{display:"flex",gap:6,flexShrink:0}}>
                <button onClick={()=>onFav(car.id)} style={{width:34,height:34,borderRadius:10,border:"1.5px solid #E2E8F0",background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Heart size={15} fill={isFav?"#DC2626":"none"} color={isFav?"#DC2626":"#64748B"}/>
                </button>
                <button style={{width:34,height:34,borderRadius:10,border:"1.5px solid #E2E8F0",background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Share2 size={14} color="#64748B"/>
                </button>
              </div>
            </div>
            <p style={{color:"#94A3B8",fontSize:13,marginBottom:18}}>{car.tagline}</p>

            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
              <span style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:29,letterSpacing:"-0.03em"}}>{fmt(car.price)}</span>
              <div style={{textAlign:"center"}}>
                <ScoreRing score={car.score} size={52} light/>
                <div style={{color:"#94A3B8",fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginTop:3}}>PP Score</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:5,color:"#94A3B8",fontSize:12,marginBottom:16}}>
              <Eye size={13}/> {viewsToday} views today
            </div>

            <div style={{background:"#F8FAFC",borderRadius:12,padding:"11px 14px",marginBottom:18,display:"flex",alignItems:"center",gap:9}}>
              <BarChart2 size={14} color="#64748B"/>
              <span style={{fontSize:12.5,color:"#475569",fontWeight:600}}>EMI from ₹{emi.toLocaleString("en-IN")}/month</span>
            </div>

            <button onClick={()=>{if(!user){setShowLogin(true);return;}setShowEnquiryModal(true);}} className="btn-red" style={{width:"100%",padding:"13px",borderRadius:12,fontSize:15,marginBottom:enquired?10:22}}>{enquired?"Enquiry Sent ✓":"Enquire Now"}</button>
            {enquired&&<p style={{color:"#10B981",fontSize:12,textAlign:"center",marginBottom:22}}>Our team will reach out within 24 hours.</p>}

            <div style={{fontWeight:700,fontSize:13,marginBottom:11}}>Inspection Snapshot</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:12}}>
              {Object.entries(bd).map(([k,v])=>(
                <div key={k} style={{display:"flex",alignItems:"center",gap:6}}>
                  {v>=80?<CheckCircle size={13} color="#10B981"/>:<AlertCircle size={13} color="#F59E0B"/>}
                  <span style={{fontSize:12,color:"#475569",fontWeight:600}}>{k}</span>
                </div>
              ))}
            </div>
            <button onClick={()=>setTab("inspection")} style={{background:"none",border:"none",color:"#DC2626",fontSize:12.5,fontWeight:700,cursor:"pointer",padding:0,display:"flex",alignItems:"center",gap:4}}>
              View full inspection report <ChevronRight size={13}/>
            </button>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{background:"#fff",borderBottom:"1px solid #E2E8F0",position:"sticky",top:64,zIndex:100,marginTop:32}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 28px",display:"flex",gap:0}}>
          {TABS.map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)}
              style={{padding:"16px 22px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"Outfit,sans-serif",fontWeight:600,fontSize:14,color:tab===id?"#DC2626":"#64748B",borderBottom:tab===id?"2.5px solid #DC2626":"2.5px solid transparent",transition:"all 0.15s",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:6}}>
              {label}{id!=="overview"&&!user&&<Lock size={11} color="#CBD5E1"/>}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content — full width now that the summary panel lives up top */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"36px 28px",display:"flex",flexDirection:"column",gap:20}}>

          {/* ── OVERVIEW (always visible) ── */}
          {tab==="overview"&&(
            <>
              <div style={{background:"#fff",borderRadius:18,padding:"24px",border:"1px solid #E2E8F0"}}>
                <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:18,letterSpacing:"-0.03em",marginBottom:16}}>Why This Car?</h2>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {highlights.map((h,i)=>(
                    <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"12px 14px",background:"#F8FAFC",borderRadius:12}}>
                      <CheckCircle size={15} color="#10B981" style={{flexShrink:0,marginTop:2}}/>
                      <span style={{fontSize:13.5,color:"#334155",lineHeight:1.4}}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{background:"#fff",borderRadius:18,padding:"24px",border:"1px solid #E2E8F0"}}>
                <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:18,letterSpacing:"-0.03em",marginBottom:16}}>Quick Specs</h2>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
                  {[["Year",car.year],["Fuel",car.fuel],["Gearbox",car.transmission],["Km Driven",fmtKm(car.km)],["Seats",car.seats+" seats"],["Owners",car.owners+" owner"+(car.owners>1?"s":"")]].map(([l,v])=>(
                    <div key={l} style={{background:"#F8FAFC",borderRadius:12,padding:"14px"}}>
                      <div style={{color:"#94A3B8",fontSize:10.5,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:5}}>{l}</div>
                      <div style={{fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:15}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              {car.serviceHistory&&(
                <div style={{background:"#fff",borderRadius:18,padding:"20px 24px",border:"1px solid #E2E8F0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:38,height:38,borderRadius:10,background:"#F8FAFC",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><FileText size={17} color="#64748B"/></div>
                    <div>
                      <div style={{fontWeight:700,fontSize:14}}>Service History</div>
                      <div style={{color:"#94A3B8",fontSize:12}}>{car.serviceHistory.name}</div>
                    </div>
                  </div>
                  <a href={car.serviceHistory.url} download={car.serviceHistory.name} className="btn-red" style={{padding:"9px 18px",borderRadius:10,fontSize:13,textDecoration:"none",display:"flex",alignItems:"center",gap:6}}>Download</a>
                </div>
              )}
            </>
          )}

          {/* ── Gated tabs — locked behind sign-in ── */}
          {tab!=="overview"&&!user&&(
            <div style={{background:"#fff",borderRadius:18,padding:"56px 24px",border:"1px solid #E2E8F0",textAlign:"center"}}>
              <div style={{width:54,height:54,borderRadius:"50%",background:"#F1F5F9",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px"}}>
                <Shield size={22} color="#94A3B8"/>
              </div>
              <h3 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:18,marginBottom:8}}>Sign in to see the full report</h3>
              <p style={{color:"#64748B",fontSize:13.5,marginBottom:24,maxWidth:360,marginLeft:"auto",marginRight:"auto",lineHeight:1.5}}>The {TABS.find(([id])=>id===tab)?.[1]} section is available to registered Pole Position users — it only takes a few seconds to join.</p>
              <button onClick={()=>setShowLogin(true)} className="btn-red" style={{padding:"12px 28px",borderRadius:11,fontSize:14}}>Join Now</button>
            </div>
          )}
          {tab!=="overview"&&user&&(
            <>
          {/* ── INSPECTION ── */}
          {tab==="inspection"&&(
            <div style={{background:"#fff",borderRadius:18,padding:"28px",border:"1px solid #E2E8F0"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
                <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:18,letterSpacing:"-0.03em"}}>7-Point Inspection</h2>
                <div style={{background:"#0F172A",borderRadius:12,padding:"8px 16px",display:"flex",alignItems:"center",gap:10}}>
                  <ScoreRing score={car.score} size={36}/>
                  <div>
                    <div style={{color:"#fff",fontWeight:800,fontSize:16,fontFamily:"Outfit,sans-serif"}}>{car.score}/100</div>
                    <div style={{color:"rgba(255,255,255,0.4)",fontSize:10.5,fontWeight:600}}>{car.score>=88?"Excellent":car.score>=78?"Very Good":car.score>=68?"Good":"Fair"}</div>
                  </div>
                </div>
              </div>
              {Object.entries(bd).length>0
                ?Object.entries(bd).map(([k,v])=>(
                  <div key={k} style={{marginBottom:18}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                      <span style={{fontSize:14,fontWeight:600,color:"#334155"}}>{scoreLabels[k]||k}</span>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:13,fontWeight:800,color:sc(v)}}>{v}</span>
                        <span style={{background:sc(v)+"18",color:sc(v),fontSize:10.5,fontWeight:700,padding:"2px 9px",borderRadius:20}}>{v>=88?"Excellent":v>=78?"Very Good":v>=68?"Good":"Fair"}</span>
                      </div>
                    </div>
                    <div style={{height:8,background:"#F1F5F9",borderRadius:10,overflow:"hidden"}}>
                      <div style={{height:"100%",width:v+"%",background:sc(v),borderRadius:10}}/>
                    </div>
                  </div>
                ))
                :<p style={{color:"#94A3B8",fontSize:14}}>Inspection report not yet available for this vehicle.</p>
              }
              <div style={{marginTop:20,padding:"14px 16px",background:"#F8FAFC",borderRadius:12,fontSize:13,color:"#64748B",display:"flex",gap:8,alignItems:"flex-start"}}>
                <Shield size={14} color="#10B981" style={{flexShrink:0,marginTop:2}}/>
                <span>All scores are from an independent on-site inspection by the Pole Position team.</span>
              </div>
              {car.tyreWear&&(
                <div style={{marginTop:24,paddingTop:24,borderTop:"1px solid #F1F5F9"}}>
                  <h3 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:15,marginBottom:16}}>Tyre Condition</h3>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
                    {[["fl","Front Left"],["fr","Front Right"],["rl","Rear Left"],["rr","Rear Right"]].map(([k,label])=>(
                      <div key={k} style={{background:"#F8FAFC",borderRadius:12,padding:"12px 10px",textAlign:"center"}}>
                        <div style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:16,color:tyreColor(car.tyreWear[k])}}>{car.tyreWear[k]}%</div>
                        <div style={{color:"#94A3B8",fontSize:10.5,fontWeight:600,marginTop:3}}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── WHO IT'S FOR ── */}
          {tab==="who"&&(
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div style={{background:"#fff",borderRadius:18,padding:"24px",border:"1px solid #E2E8F0"}}>
                <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:18,letterSpacing:"-0.03em",marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
                  <CheckCircle size={18} color="#10B981"/> This car is great for
                </h2>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {forWho.map((item,i)=>(
                    <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"13px 16px",background:"#F0FDF4",borderRadius:12,border:"1px solid #BBF7D0"}}>
                      <CheckCircle size={14} color="#10B981" style={{flexShrink:0,marginTop:2}}/>
                      <span style={{fontSize:13.5,color:"#166534",lineHeight:1.45}}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{background:"#fff",borderRadius:18,padding:"24px",border:"1px solid #E2E8F0"}}>
                <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:18,letterSpacing:"-0.03em",marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
                  <XCircle size={18} color="#EF4444"/> Maybe not for
                </h2>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {notForWho.map((item,i)=>(
                    <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"13px 16px",background:"#FFF1F2",borderRadius:12,border:"1px solid #FECDD3"}}>
                      <XCircle size={14} color="#EF4444" style={{flexShrink:0,marginTop:2}}/>
                      <span style={{fontSize:13.5,color:"#9F1239",lineHeight:1.45}}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── SPECS ── */}
          {tab==="specs"&&(
            <div style={{background:"#fff",borderRadius:18,border:"1px solid #E2E8F0",overflow:"hidden"}}>
              <div style={{padding:"20px 24px",borderBottom:"1px solid #E2E8F0"}}>
                <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:18,letterSpacing:"-0.03em"}}>Full Specifications</h2>
              </div>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <tbody>
                  {[
                    ["Make",car.make],["Model",car.model],["Year",car.year],
                    ["Category",car.category],["Fuel Type",car.fuel],["Transmission",car.transmission],
                    ["KM Driven",fmtKm(car.km)],["Seats",car.seats],["Previous Owners",car.owners],
                    ["Listed Price",fmt(car.price)],["Insurance",car.insurance||"—"],["PP Score",car.score+"/100"],
                  ].map(([label,value],i)=>(
                    <tr key={label} style={{borderBottom:"1px solid #F1F5F9",background:i%2===0?"#fff":"#F8FAFC"}}>
                      <td style={{padding:"13px 24px",color:"#64748B",fontSize:13.5,fontWeight:600,width:"40%"}}>{label}</td>
                      <td style={{padding:"13px 24px",color:"#0F172A",fontSize:13.5,fontWeight:700}}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
            </>
          )}

        </div>
      {isMobile&&(
        <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:150,background:"rgba(255,255,255,0.97)",backdropFilter:"blur(10px)",borderTop:"1px solid #E2E8F0",padding:"12px 20px",display:"flex",gap:12,alignItems:"center"}}>
          <div style={{flex:1}}>
            <div style={{fontWeight:900,fontSize:20,letterSpacing:"-0.03em"}}>{fmt(car.price)}</div>
            <div style={{color:"#94A3B8",fontSize:11}}>EMI from ₹{emi.toLocaleString("en-IN")}/mo</div>
          </div>
          <button onClick={()=>{if(!user){setShowLogin(true);return;}setShowEnquiryModal(true);}} className="btn-red" style={{padding:"12px 24px",borderRadius:11,fontSize:14}}>Enquire Now</button>
        </div>
      )}
      {showEnquiryModal&&(
        <div style={{position:"fixed",inset:0,zIndex:600,background:"rgba(15,23,42,0.6)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"0 20px"}} onClick={()=>setShowEnquiryModal(false)}>
          <div style={{background:"#fff",borderRadius:20,padding:32,width:420,maxWidth:"100%",position:"relative"}} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setShowEnquiryModal(false)} style={{position:"absolute",top:14,right:14,background:"#F1F5F9",border:"none",borderRadius:"50%",width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={14}/></button>
            <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:20,marginBottom:6,color:"#0F172A"}}>Get in Touch</h2>
            <p style={{color:"#64748B",fontSize:13.5,marginBottom:20}}>We'll connect you with the seller via WhatsApp.</p>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:11,fontWeight:700,color:"#64748B",textTransform:"uppercase",display:"block",marginBottom:6}}>Phone Number</label>
              <input value={enquiryPhone} onChange={e=>setEnquiryPhone(e.target.value)} placeholder="+91 98765 43210" type="tel" style={{width:"100%",padding:"11px 14px",fontSize:14,borderRadius:12,border:"1.5px solid #E2E8F0",background:"#F8FAFC",color:"#0F172A",fontFamily:"Outfit,sans-serif",outline:"none"}}/>
            </div>
            <button disabled={enquirySubmitting||!enquiryPhone} onClick={async()=>{
              setEnquirySubmitting(true);
              try{
                await supabase.from("enquiries").insert({
                  car_id:car.id,
                  name:user,
                  email:userEmail||"",
                  phone:enquiryPhone,
                  listing_url:window.location.href,
                  car_title:`${car.make} ${car.model} ${car.year}`
                });
              }catch(e){}
              const msg=encodeURIComponent(`New Enquiry from Pole Position\n\nName: ${user}\nEmail: ${userEmail||""}\nPhone: ${enquiryPhone}\nListing: ${window.location.href}\nCar: ${car.make} ${car.model} ${car.year}`);
              window.open(`https://wa.me/919884257043?text=${msg}`,"_blank");
              setEnquirySubmitting(false);
              setShowEnquiryModal(false);
              setEnquired(true);
              setTimeout(()=>setEnquired(false),3000);
            }} className="btn-red" style={{width:"100%",padding:"13px",borderRadius:12,fontSize:15,opacity:(enquirySubmitting||!enquiryPhone)?0.6:1,cursor:(enquirySubmitting||!enquiryPhone)?"not-allowed":"pointer"}}>
              {enquirySubmitting?"Sending…":"Send Enquiry"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
// ── QuizPage ──────────────────────────────────────────────────────

// ── QuizPage ─────────────────────────────────────────────────────
function QuizPage({setPage,setSelectedCar,cars}){
  const [step,setStep]=useState(0);
  const [ans,setAns]=useState({});
  const pick=(key,val)=>{
    const na={...ans,[key]:val};
    setAns(na);
    if(step<QUIZ.length-1){setStep(step+1);}
    else{
      // match
      let scored=cars.map(c=>{
        let s=0;
        if(na.budget==="low"&&c.price<800000)s+=3;
        if(na.budget==="mid"&&c.price>=800000&&c.price<1500000)s+=3;
        if(na.budget==="high"&&c.price>=1500000&&c.price<2500000)s+=3;
        if(na.budget==="luxury"&&c.price>=2500000)s+=3;
        if(na.fuel!=="any"&&c.fuel===na.fuel)s+=2;
        if(na.seats==="7"&&c.seats===7)s+=2;
        if(na.seats==="5"&&c.seats===5)s+=1;
        s+=c.score/20;
        return{...c,match:s};
      });
      scored.sort((a,b)=>b.match-a.match);
      setSelectedCar(scored[0]);

    }
  };
  const q=QUIZ[step];
  return(
    <div style={{paddingTop:64,minHeight:"100vh",background:"linear-gradient(135deg,#0F172A,#1E293B)",display:"flex",alignItems:"center",justifyContent:"center",padding:"80px 24px"}}>
      <div style={{maxWidth:560,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{color:"#DC2626",fontSize:12,fontWeight:700,letterSpacing:"0.1em",marginBottom:12}}>STEP {step+1} OF {QUIZ.length}</div>
          <div style={{background:"rgba(255,255,255,0.08)",borderRadius:100,height:4,overflow:"hidden",marginBottom:28}}>
            <div style={{height:"100%",width:((step+1)/QUIZ.length*100)+"%",background:"#DC2626",transition:"width 0.4s ease"}}/>
          </div>
          <h2 style={{color:"#fff",fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:28,letterSpacing:"-0.03em"}}>{q.q}</h2>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {q.opts.map(o=>(
            <button key={o.v} onClick={()=>pick(q.key,o.v)}
              style={{padding:"18px 22px",borderRadius:14,border:"1.5px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"#fff",cursor:"pointer",textAlign:"left",fontSize:15,fontWeight:600,transition:"all 0.15s"}}>
              {o.l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── BlogPage ──────────────────────────────────────────────────────

// ── BlogPage ─────────────────────────────────────────────────────
function BlogPage({blog}){
  const [tag,setTag]=useState("All");
  const tags=["All","Cars","EV","Bikes","Guide"];
  const featured=blog[0]||{};
  const rest=blog.slice(1).filter(p=>tag==="All"||p.tag===tag);
  return(
    <div style={{paddingTop:64,minHeight:"100vh",background:"#F8FAFC"}}>
      <div style={{background:"linear-gradient(135deg,#0F172A,#1E293B)",padding:"60px 32px 50px",textAlign:"center"}}>
        <div style={{color:"#DC2626",fontSize:12,fontWeight:700,letterSpacing:"0.1em",marginBottom:12}}>POLE POSITION BLOG</div>
        <h1 style={{color:"#fff",fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:38,letterSpacing:"-0.04em",marginBottom:14}}>Expert Reviews & Guides</h1>
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginTop:24}}>
          {tags.map(t=><button key={t} onClick={()=>setTag(t)} style={{padding:"8px 18px",borderRadius:100,border:"none",cursor:"pointer",fontWeight:600,fontSize:13,background:tag===t?"#DC2626":"rgba(255,255,255,0.08)",color:tag===t?"#fff":"rgba(255,255,255,0.6)"}}>{t}</button>)}
        </div>
      </div>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"40px 24px"}}>
        {/* Featured */}
        <div style={{background:"#fff",borderRadius:20,overflow:"hidden",border:"1px solid #E2E8F0",display:"grid",gridTemplateColumns:"1.2fr 1fr",marginBottom:36,cursor:"pointer"}}>
          <img src={featured.img} alt="" style={{width:"100%",height:340,objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
          <div style={{padding:"32px"}}>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              <span style={{background:TAG_COLORS[featured.tag]+"18",color:TAG_COLORS[featured.tag],fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20}}>{featured.tag}</span>
              <span style={{background:"#FEF3C7",color:"#D97706",fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20}}>Featured</span>
            </div>
            <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:22,letterSpacing:"-0.03em",lineHeight:1.25,marginBottom:12}}>{featured.title}</h2>
            <p style={{color:"#64748B",fontSize:14,lineHeight:1.6,marginBottom:20}}>{featured.excerpt}</p>
            <div style={{fontSize:12.5,color:"#94A3B8"}}>{featured.author} · {featured.date} · {featured.readTime} read · {featured.views.toLocaleString()} views</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20}}>
          {rest.map(p=>(
            <div key={p.id} style={{background:"#fff",borderRadius:16,overflow:"hidden",border:"1px solid #E2E8F0",cursor:"pointer"}}>
              <div style={{position:"relative"}}>
                <img src={p.img} alt="" style={{width:"100%",height:190,objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
                <span style={{position:"absolute",top:12,left:12,background:TAG_COLORS[p.tag],color:"#fff",fontSize:10.5,fontWeight:700,padding:"3px 10px",borderRadius:20}}>{p.tag}</span>
              </div>
              <div style={{padding:"16px 18px"}}>
                <p style={{fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:15,letterSpacing:"-0.02em",lineHeight:1.3,marginBottom:10}}>{p.title}</p>
                <p style={{color:"#64748B",fontSize:12.5,lineHeight:1.55,marginBottom:12}}>{p.excerpt}</p>
                <div style={{fontSize:11.5,color:"#94A3B8"}}>{p.author} · {p.readTime} · {p.views.toLocaleString()} views</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ForumPage ─────────────────────────────────────────────────────

// ── ForumPage ────────────────────────────────────────────────────
function ForumPage({setPage,setThread,user,setShowLogin,threads}){
  const [cat,setCat]=useState("All");
  const cats=["All","Cars","Bikes & Scooters","EVs","Buying Help","Ownership Diaries"];
  const CAT_COLORS={Cars:"#DC2626","Bikes & Scooters":"#7C3AED",EVs:"#059669","Buying Help":"#F59E0B","Ownership Diaries":"#3B82F6"};
  const visible=threads.filter(t=>cat==="All"||t.cat===cat);
  return(
    <div style={{paddingTop:64,minHeight:"100vh",background:"#F8FAFC"}}>
      <div style={{background:"linear-gradient(135deg,#0F172A,#1E293B)",padding:"52px 32px 44px",textAlign:"center"}}>
        <div style={{color:"#DC2626",fontSize:12,fontWeight:700,letterSpacing:"0.1em",marginBottom:12}}>COMMUNITY</div>
        <h1 style={{color:"#fff",fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:36,letterSpacing:"-0.04em",marginBottom:14}}>The Pit Lane Forum</h1>
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginTop:20}}>
          {cats.map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:"7px 16px",borderRadius:100,border:"none",cursor:"pointer",fontWeight:600,fontSize:12.5,background:cat===c?"#DC2626":"rgba(255,255,255,0.08)",color:cat===c?"#fff":"rgba(255,255,255,0.6)"}}>{c}</button>)}
        </div>
      </div>
      <div style={{maxWidth:860,margin:"0 auto",padding:"36px 24px"}}>
        {!user&&(
          <div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:14,padding:"16px 20px",marginBottom:24,display:"flex",alignItems:"center",gap:12}}>
            <AlertCircle size={16} color="#DC2626"/>
            <span style={{fontSize:13.5,color:"#991B1B"}}>Sign in to participate in discussions.</span>
            <button onClick={()=>setShowLogin(true)} className="btn-red" style={{marginLeft:"auto",padding:"7px 16px",borderRadius:9,fontSize:13}}>Sign In</button>
          </div>
        )}
        {visible.map(t=>(
          <div key={t.id} onClick={()=>{setThread(t);setPage("thread");}} style={{background:"#fff",borderRadius:14,padding:"18px 20px",marginBottom:10,border:"1px solid #E2E8F0",cursor:"pointer",display:"flex",alignItems:"center",gap:14,transition:"border-color 0.15s",borderLeft:t.pinned?"3px solid #DC2626":"1px solid #E2E8F0"}}>
            <div style={{width:42,height:42,borderRadius:12,background:(CAT_COLORS[t.cat]||"#64748B")+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <MessageSquare size={17} color={CAT_COLORS[t.cat]||"#64748B"}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                {t.pinned&&<span style={{background:"#FEF2F2",color:"#DC2626",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20}}>Pinned</span>}
                <span style={{background:(CAT_COLORS[t.cat]||"#64748B")+"18",color:CAT_COLORS[t.cat]||"#64748B",fontSize:10.5,fontWeight:700,padding:"2px 8px",borderRadius:20}}>{t.cat}</span>
              </div>
              <p style={{fontWeight:700,fontSize:14.5,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.title}</p>
              <div style={{color:"#94A3B8",fontSize:12}}>{t.author} · {t.replies} replies · {t.views.toLocaleString()} views · {t.last}</div>
            </div>
            <ChevronRight size={16} color="#CBD5E1"/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ThreadPage ────────────────────────────────────────────────────

// ── ThreadPage ───────────────────────────────────────────────────
function ThreadPage({thread:t,setPage,user,setShowLogin}){
  const [reply,setReply]=useState("");
  const [replies,setReplies]=useState([
    {id:1,author:t?.author||"OP",body:"Original post: "+t?.title,time:"Original post",likes:12,isOP:true},
    {id:2,author:"AutoExpert",body:"Great thread! I've had a similar experience. The key is to check the service records first.",time:"3h ago",likes:8,isOP:false},
  ]);
  const [likes,setLikes]=useState({});
  if(!t)return null;
  const submit=()=>{
    if(!reply.trim())return;
    setReplies(r=>[...r,{id:Date.now(),author:user,body:reply,time:"Just now",likes:0,isOP:false}]);
    setReply("");
  };
  return(
    <div style={{paddingTop:64,minHeight:"100vh",background:"#F8FAFC"}}>
      <div style={{background:"linear-gradient(135deg,#0F172A,#1E293B)",padding:"36px 32px 30px"}}>
        <div style={{maxWidth:820,margin:"0 auto"}}>
          <button onClick={()=>setPage("forum")} style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:9,padding:"7px 14px",color:"rgba(255,255,255,0.7)",cursor:"pointer",fontSize:13,fontWeight:600,marginBottom:16}}>
            <ChevronLeft size={14}/> Back to Forum
          </button>
          <h1 style={{color:"#fff",fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:22,letterSpacing:"-0.03em",lineHeight:1.3}}>{t.title}</h1>
          <div style={{color:"rgba(255,255,255,0.4)",fontSize:12.5,marginTop:8}}>{t.cat} · {t.replies} replies · {t.views.toLocaleString()} views</div>
        </div>
      </div>
      <div style={{maxWidth:820,margin:"0 auto",padding:"28px 24px"}}>
        {replies.map(r=>(
          <div key={r.id} style={{background:"#fff",borderRadius:14,padding:"18px 20px",marginBottom:12,border:"1px solid #E2E8F0"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:"#0F172A",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:13}}>{r.author[0]}</div>
              <div>
                <div style={{fontWeight:700,fontSize:14}}>{r.author} {r.isOP&&<span style={{background:"#FEF2F2",color:"#DC2626",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,marginLeft:6}}>OP</span>}</div>
                <div style={{color:"#94A3B8",fontSize:11.5}}>{r.time}</div>
              </div>
            </div>
            <p style={{color:"#334155",fontSize:14,lineHeight:1.65,marginBottom:12}}>{r.body}</p>
            <button onClick={()=>setLikes(l=>({...l,[r.id]:!l[r.id]}))} style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"1px solid #E2E8F0",borderRadius:8,padding:"5px 12px",cursor:"pointer",color:likes[r.id]?"#DC2626":"#64748B",fontSize:12.5,fontWeight:600}}>
              <ThumbsUp size={12} fill={likes[r.id]?"#DC2626":"none"}/> {r.likes+(likes[r.id]?1:0)}
            </button>
          </div>
        ))}
        <div style={{background:"#fff",borderRadius:14,padding:"18px 20px",border:"1px solid #E2E8F0",marginTop:20}}>
          <h3 style={{fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:15,marginBottom:14}}>Add a Reply</h3>
          {user
            ?<><textarea value={reply} onChange={e=>setReply(e.target.value)} rows={4} placeholder="Share your thoughts…" style={{width:"100%",padding:"12px 14px",borderRadius:10,border:"1.5px solid #E2E8F0",fontSize:13.5,resize:"vertical",fontFamily:"inherit"}}/><button onClick={submit} className="btn-red" style={{marginTop:10,padding:"10px 22px",borderRadius:10,fontSize:13.5,display:"flex",alignItems:"center",gap:7}}><Send size={13}/> Post Reply</button></>
            :<div style={{textAlign:"center",padding:"20px 0"}}><p style={{color:"#64748B",marginBottom:12}}>Sign in to join the discussion</p><button onClick={()=>setShowLogin(true)} className="btn-red" style={{padding:"10px 22px",borderRadius:10,fontSize:13.5}}>Sign In</button></div>
          }
        </div>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────

// ── ScoreEditor (admin) ──────────────────────────────────────────
function ScoreEditor({car,initBd,onSave,onBack}){
  const [scores,setScores]=useState(()=>{const d={};SCORE_CATS.forEach(c=>{d[c.key]=initBd?.[c.key]??80;});return d;});
  const [notes,setNotes]=useState({});
  const [active,setActive]=useState(SCORE_CATS[0].key);
  const cum=calcScore(scores);
  const ac=SCORE_CATS.find(c=>c.key===active);
  const AIcon=ac.icon;
  const idx=SCORE_CATS.findIndex(c=>c.key===active);

  return(
    <div>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
        <Btn onClick={onBack}><ChevronLeft size={14}/> Back</Btn>
        <div>
          <h2 style={{fontWeight:800,fontSize:20,letterSpacing:"-0.03em"}}>Pole Position Score</h2>
          <div style={{color:"#64748B",fontSize:13}}>{car.make} {car.model} {car.year}</div>
        </div>
      </div>

      <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
        {/* Left nav */}
        <div style={{width:240,flexShrink:0,display:"flex",flexDirection:"column",gap:8}}>
          <Card style={{padding:"18px",textAlign:"center",marginBottom:4}}>
            <div style={{color:"#64748B",fontSize:10.5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:12}}>Cumulative Score</div>
            <div style={{position:"relative",width:88,height:88,margin:"0 auto 10px"}}>
              <svg viewBox="0 0 100 100" style={{transform:"rotate(-90deg)",width:"100%",height:"100%"}}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="9"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke={rc(cum)} strokeWidth="9" strokeDasharray={`${2*Math.PI*40}`} strokeDashoffset={`${2*Math.PI*40*(1-cum/100)}`} strokeLinecap="round" style={{transition:"all 0.3s"}}/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <span style={{color:rc(cum),fontWeight:900,fontSize:28,letterSpacing:"-0.04em",lineHeight:1}}>{cum}</span>
                <span style={{color:"#475569",fontSize:10}}>/100</span>
              </div>
            </div>
            <div style={{color:rc(cum),fontWeight:700,fontSize:13}}>{rl(cum)}</div>
          </Card>

          {SCORE_CATS.map(cat=>{
            const Icon=cat.icon;
            const isSel=active===cat.key;
            const s=scores[cat.key];
            return(
              <button key={cat.key} onClick={()=>setActive(cat.key)} style={{display:"flex",alignItems:"center",gap:9,padding:"10px 13px",borderRadius:12,border:isSel?`1.5px solid ${rc(s)}55`:"1.5px solid rgba(255,255,255,0.06)",background:isSel?`${rc(s)}12`:"#1E293B",cursor:"pointer",width:"100%",textAlign:"left"}}>
                <div style={{width:28,height:28,borderRadius:8,background:`${rc(s)}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Icon size={13} color={rc(s)}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:isSel?"#fff":"#94A3B8",fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cat.label}</div>
                  <div style={{color:"#334155",fontSize:10.5}}>{cat.weight}% weight</div>
                </div>
                <span style={{color:rc(s),fontWeight:900,fontSize:16,letterSpacing:"-0.03em"}}>{s}</span>
              </button>
            );
          })}
          <button onClick={()=>onSave(scores,cum)} style={{marginTop:6,padding:"12px",borderRadius:12,background:"#DC2626",border:"none",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"Outfit,sans-serif"}}>
            <CheckCircle size={15}/> Save Score & Apply
          </button>
        </div>

        {/* Right detail */}
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:14}}>
          <Card style={{padding:"22px 24px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:5}}>
                  <AIcon size={17} color={rc(scores[active])}/>
                  <h3 style={{fontWeight:800,fontSize:17}}>{ac.label}</h3>
                  <span style={{background:"rgba(255,255,255,0.06)",color:"#64748B",fontSize:10.5,fontWeight:700,padding:"2px 8px",borderRadius:20}}>{ac.weight}%</span>
                </div>
                <p style={{color:"#64748B",fontSize:13}}>{ac.desc}</p>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{color:rc(scores[active]),fontWeight:900,fontSize:48,letterSpacing:"-0.04em",lineHeight:1,transition:"color 0.3s"}}>{scores[active]}</div>
                <div style={{color:"#475569",fontSize:11}}>/ 100</div>
              </div>
            </div>
            <input type="range" min={0} max={100} value={scores[active]} onChange={e=>setScores(s=>({...s,[active]:Number(e.target.value)}))} style={{width:"100%",height:6,cursor:"pointer",accentColor:rc(scores[active]),margin:"8px 0"}}/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6,marginTop:14}}>
              {[[95,"Excellent"],[85,"Very Good"],[75,"Good"],[65,"Fair"],[50,"Below Avg"],[30,"Poor"]].map(([v,l])=>{
                const sel=scores[active]===v;
                return <button key={v} onClick={()=>setScores(s=>({...s,[active]:v}))} style={{padding:"7px 4px",borderRadius:9,border:sel?`1.5px solid ${rc(v)}88`:"1.5px solid rgba(255,255,255,0.06)",background:sel?`${rc(v)}18`:"rgba(255,255,255,0.02)",color:sel?rc(v):"#475569",fontSize:10.5,fontWeight:700,cursor:"pointer",textAlign:"center",lineHeight:1.3}}>
                  <div style={{fontSize:13,fontWeight:900}}>{v}</div><div>{l}</div>
                </button>;
              })}
            </div>
          </Card>
          <Card style={{padding:"18px 22px"}}>
            <Label>Inspector Notes</Label>
            <textarea value={notes[active]||""} onChange={e=>setNotes(n=>({...n,[active]:e.target.value}))} rows={3} placeholder={`Observations for ${ac.label}…`}/>
          </Card>
          {idx<SCORE_CATS.length-1&&(()=>{
            const next=SCORE_CATS[idx+1];const NIcon=next.icon;
            return <button onClick={()=>setActive(next.key)} style={{padding:"11px 18px",borderRadius:12,border:"1.5px solid rgba(255,255,255,0.07)",background:"rgba(255,255,255,0.02)",color:"#94A3B8",cursor:"pointer",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"space-between",fontFamily:"Outfit,sans-serif"}}>
              <span style={{color:"#475569"}}>Next →</span><div style={{display:"flex",alignItems:"center",gap:6}}><NIcon size={13}/> {next.label} <ChevronRight size={13}/></div>
            </button>;
          })()}
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────────

// ── Dashboard (admin) ────────────────────────────────────────────
function Dashboard({cars,blogs,users}){
  const stats=[
    {l:"Total Listings",v:cars.length,icon:Car,c:"#3B82F6"},
    {l:"Registered Users",v:users.length,icon:Users,c:"#10B981"},
    {l:"Blog Articles",v:blogs.length,icon:BookOpen,c:"#F59E0B"},
    {l:"Avg Score",v:cars.length?Math.round(cars.reduce((a,c)=>a+c.score,0)/cars.length):0,icon:Award,c:"#DC2626"},
  ];
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28}}>
        {stats.map(s=>{const Icon=s.icon;return(
          <Card key={s.l} style={{padding:"20px 22px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
              <div style={{width:38,height:38,borderRadius:10,background:`${s.c}22`,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon size={18} color={s.c}/></div>
            </div>
            <div style={{fontWeight:900,fontSize:30,letterSpacing:"-0.04em",marginBottom:3}}>{s.v}</div>
            <div style={{color:"#94A3B8",fontSize:13}}>{s.l}</div>
          </Card>
        );})}
      </div>
      <Card>
        <div style={{padding:"16px 22px",borderBottom:"1px solid rgba(255,255,255,0.07)",fontWeight:700,fontSize:15}}>Recent Listings</div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,0.07)"}}>{["Car","Year","Price","Score"].map(h=><th key={h} style={{padding:"11px 18px",textAlign:"left",color:"#64748B",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>{h}</th>)}</tr></thead>
          <tbody>{cars.slice(0,6).map(c=><tr key={c.id} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
            <td style={{padding:"12px 18px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><img src={c.img} alt="" style={{width:48,height:32,objectFit:"cover",borderRadius:7}} onError={e=>e.target.style.display="none"}/><span style={{fontWeight:600,fontSize:13.5}}>{c.make} {c.model}</span></div></td>
            <td style={{padding:"12px 18px",color:"#94A3B8",fontSize:13}}>{c.year}</td>
            <td style={{padding:"12px 18px",fontWeight:600,fontSize:13}}>{fmt(c.price)}</td>
            <td style={{padding:"12px 18px"}}><span style={{background:`${rc(c.score)}22`,color:rc(c.score),fontWeight:700,fontSize:12,padding:"3px 10px",borderRadius:20}}>{c.score}</span></td>
          </tr>)}</tbody>
        </table>
      </Card>
    </div>
  );
}

// ── Listings ─────────────────────────────────────────────────────

// ── Listings (admin) ─────────────────────────────────────────────
function Listings({cars,setCars}){
  const empty={make:"",model:"",variant:"",year:2022,fuel:"Petrol",transmission:"Automatic",km:0,seats:5,price:0,score:0,badge:null,img:"",images:[],video:null,category:"Sedan",carClass:"Economy",tagline:"",description:"",owners:1,status:"published",serviceHistory:null,tyreMake:"MRF",tyreModel:"",tyreSize:"",tyreWear:{fl:20,fr:20,rl:20,rr:20},scoreBreakdown:{}};
  const [edit,setEdit]=useState(null);
  const [form,setForm]=useState(empty);
  const [scoring,setScoring]=useState(false);
  const [media,setMedia]=useState([]);
  const [coverId,setCoverId]=useState(null);
  const [urlInput,setUrlInput]=useState("");
  const [kmFocused,setKmFocused]=useState(false);
  const [priceFocused,setPriceFocused]=useState(false);
  const [fileErr,setFileErr]=useState("");
  const [customMake,setCustomMake]=useState(false);
  const [customModel,setCustomModel]=useState(false);
  const [customVariant,setCustomVariant]=useState(false);
  const [variantOptions,setVariantOptions]=useState([]);
  const [variantLoading,setVariantLoading]=useState(false);

  const fetchVariants=async(make,model,year)=>{
    if(!make||!model||!year)return;
    setVariantLoading(true);
    setVariantOptions([]);
    setCustomVariant(false);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,messages:[{role:"user",content:`List every variant/trim of the ${year} ${make} ${model} sold in India. Return ONLY a JSON array, no other text, no markdown. Each item: {"variant":"NAME","fuel":"Petrol|Diesel|Electric|CNG|Hybrid","transmission":"Manual|Automatic|AMT|CVT|DCT"}. Include all fuel+transmission combos per variant if they differ.`}]})});
      const data=await res.json();
      const text=data.content?.[0]?.text||"[]";
      const clean=text.replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(clean);
      setVariantOptions(Array.isArray(parsed)?parsed:[]);
    }catch(e){
      const fallback=(VARIANTS[model]||[]).map(v=>({variant:v,...(VARIANT_SPECS[v]||{fuel:"Petrol",transmission:"Manual"})}));
      setVariantOptions(fallback);
    }
    setVariantLoading(false);
  };
  const [serviceDoc,setServiceDoc]=useState(null);
  const [previewing,setPreviewing]=useState(false);
  const fileInputRef=useRef(null);
  const serviceFileRef=useRef(null);

  useEffect(()=>{
    if(edit&&edit.id){
      setForm({tyreWear:{fl:20,fr:20,rl:20,rr:20},...edit});
      const imgs=(edit.images&&edit.images.length?edit.images:(edit.img?[edit.img]:[])).map((url,i)=>({id:"img"+i,type:"image",url}));
      const vid=edit.video?[{id:"vid0",type:"video",url:edit.video}]:[];
      setMedia([...imgs,...vid]);
      setCoverId(imgs[0]?.id||null);
      setCustomMake(!MAKE_MODELS[edit.make]);
      setCustomModel(!!(edit.make&&MAKE_MODELS[edit.make]&&!MAKE_MODELS[edit.make].includes(edit.model)));
      setCustomVariant(false);
      if(edit.model&&edit.year)fetchVariants(edit.make,edit.model,edit.year);
      setServiceDoc(edit.serviceHistory||null);
    }else{
      setForm(empty);
      setMedia([]);
      setCoverId(null);
      setCustomMake(false);
      setCustomModel(false);
      setCustomVariant(false);
      setServiceDoc(null);
    }
    setScoring(false);
    setFileErr("");
  },[edit]);

  const handleFiles=async(fileList)=>{
    const files=Array.from(fileList);
    const accepted=files.filter(f=>f.type.startsWith("image/")||f.type.startsWith("video/"));
    if(accepted.length<files.length)setFileErr("Some files were skipped — only images and videos are supported.");
    else setFileErr("");
    const uploaded=await Promise.all(accepted.map(async f=>{
      const ext=f.name.split(".").pop();
      const path=`${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const {error}=await supabase.storage.from("car-images").upload(path,f,{contentType:f.type,upsert:false});
      if(error){setFileErr("Upload failed: "+error.message);return null;}
      const {data}=supabase.storage.from("car-images").getPublicUrl(path);
      return {id:Date.now()+Math.random(),type:f.type.startsWith("video/")?"video":"image",url:data.publicUrl,name:f.name};
    }));
    const valid=uploaded.filter(Boolean);
    const firstNewImg=valid.find(u=>u.type==="image");
    if(firstNewImg)setCoverId(firstNewImg.id);
    setMedia(m=>[...m,...valid]);
  };

  const addFromUrl=()=>{
    if(!urlInput)return;
    setMedia(m=>[...m,{id:Date.now()+Math.random(),type:"image",url:urlInput,name:"linked image"}]);
    setUrlInput("");
  };

  const removeMedia=(id)=>setMedia(m=>m.filter(x=>x.id!==id));

  const save=async(status="published")=>{
    if(!form.make)return;
    const images=media.filter(m=>m.type==="image").map(m=>m.url);
    const video=media.find(m=>m.type==="video")?.url||null;
    const coverUrl=media.find(m=>m.id===coverId)?.url||images[0]||form.img||"";
    const payload={...form,images,video,img:coverUrl,status,serviceHistory:serviceDoc};
    const dbPayload={
      make:payload.make,model:payload.model,year:payload.year,fuel:payload.fuel,
      transmission:payload.transmission,km:payload.km,seats:payload.seats,price:payload.price,
      score:payload.score,badge:payload.badge||null,img:payload.img,images:payload.images,
      video:payload.video||null,category:payload.category,tagline:payload.tagline,
      owners:payload.owners,insurance:payload.insurance,
      score_breakdown:payload.scoreBreakdown||null,tyre_wear:payload.tyreWear||null,
    };
    if(payload.id && typeof payload.id==="number" && payload.id < 1e12){
      const {error}=await supabase.from("cars").update({...dbPayload,status}).eq("id",payload.id);
      if(error){alert("Save failed: "+error.message);return;}
      setCars(cars.map(c=>c.id===payload.id?payload:c));
    } else {
      const {data,error}=await supabase.from("cars").insert({...dbPayload,status}).select().single();
      if(error){alert("Save failed: "+error.message);return;}
      if(data) setCars([...cars,{...payload,id:data.id}]);
    }
    setEdit(null);
  };

  const buildPreviewCar=()=>{
    const images=media.filter(m=>m.type==="image").map(m=>m.url);
    const video=media.find(m=>m.type==="video")?.url||null;
    return {...form,images,video,img:images[0]||form.img||"",id:form.id||"preview",serviceHistory:serviceDoc};
  };

  if(scoring)return <ScoreEditor car={form} initBd={form.scoreBreakdown} onBack={()=>setScoring(false)} onSave={(bd,cum)=>{setForm(f=>({...f,score:cum,scoreBreakdown:bd}));setScoring(false);}}/>;

  if(previewing)return(
    <div style={{position:"fixed",inset:0,zIndex:700,background:"#F8FAFC",overflowY:"auto"}}>
      <div style={{position:"sticky",top:0,zIndex:10,background:"#0F172A",padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <button onClick={()=>setPreviewing(false)} style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,0.08)",border:"none",borderRadius:9,padding:"9px 16px",color:"#fff",cursor:"pointer",fontWeight:600,fontSize:13.5,fontFamily:"Outfit,sans-serif"}}>
          <ChevronLeft size={14}/> Back to Editing
        </button>
        <span style={{color:"#64748B",fontSize:12.5}}>Preview — exactly what buyers will see</span>
      </div>
      <CarDetailPage car={buildPreviewCar()} setPage={()=>{}} isFav={false} onFav={()=>{}} user="Preview" setShowLogin={()=>{}}/>
    </div>
  );

  if(edit!==null)return(
    <div>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
        <Btn onClick={()=>setEdit(null)}><ChevronLeft size={14}/> Back</Btn>
        <h2 style={{fontWeight:800,fontSize:20,letterSpacing:"-0.03em"}}>{form.id?`Edit — ${form.make} ${form.model}`:"Add New Listing"}</h2>
      </div>

      {/* Photos & Video — first thing, most prominent */}
      <FormSection title="Photos & Video">
        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,video/mp4,video/webm,video/quicktime" multiple style={{display:"none"}} onChange={e=>{handleFiles(e.target.files);e.target.value="";}}/>
        <div onClick={()=>fileInputRef.current?.click()}
          onDragOver={e=>e.preventDefault()}
          onDrop={e=>{e.preventDefault();handleFiles(e.dataTransfer.files);}}
          style={{border:"1.5px dashed rgba(255,255,255,0.15)",borderRadius:12,padding:"26px",textAlign:"center",cursor:"pointer",background:"rgba(255,255,255,0.02)"}}>
          <Upload size={22} color="#64748B" style={{marginBottom:8}}/>
          <div style={{fontSize:13.5,fontWeight:600,color:"#94A3B8"}}>Click to upload, or drag and drop</div>
          <div style={{fontSize:11.5,color:"#475569",marginTop:3}}>PNG or JPG images, and MP4 / WebM / MOV video</div>
        </div>
        {fileErr&&<p style={{color:"#F87171",fontSize:12,marginTop:8}}>{fileErr}</p>}
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <input value={urlInput} onChange={e=>setUrlInput(e.target.value)} placeholder="…or paste an image URL"/>
          <button onClick={addFromUrl} style={{padding:"10px 14px",borderRadius:10,border:"1px solid rgba(59,130,246,0.3)",background:"rgba(59,130,246,0.12)",color:"#60A5FA",cursor:"pointer",fontSize:13,fontWeight:600,flexShrink:0,fontFamily:"Outfit,sans-serif"}}>Add</button>
        </div>
        {media.length>0&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:10,marginTop:14}}>
            {media.map((m)=>{
              const isCover=(coverId?m.id===coverId:media.filter(x=>x.type==="image")[0]?.id===m.id)&&m.type==="image";
              return(
              <div key={m.id} style={{position:"relative",borderRadius:10,overflow:"hidden",aspectRatio:"4/3",background:"#0F172A",border:isCover?"2px solid #DC2626":"1px solid rgba(255,255,255,0.08)"}}>
                {m.type==="video"?(
                  <video src={m.url} style={{width:"100%",height:"100%",objectFit:"cover"}} muted/>
                ):(
                  <img src={m.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                )}
                {m.type==="video"&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.25)",pointerEvents:"none"}}><Play size={18} color="#fff" fill="#fff"/></div>}
                {isCover&&<span style={{position:"absolute",bottom:5,left:5,background:"#DC2626",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20}}>Cover</span>}
                {m.type==="image"&&!isCover&&<button onClick={()=>setCoverId(m.id)} style={{position:"absolute",bottom:5,left:5,background:"rgba(0,0,0,0.6)",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20,border:"none",cursor:"pointer"}}>Set cover</button>}
                <button onClick={()=>{removeMedia(m.id);if(coverId===m.id)setCoverId(null);}} style={{position:"absolute",top:5,right:5,width:22,height:22,borderRadius:"50%",border:"none",background:"rgba(0,0,0,0.6)",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={12}/></button>
              </div>
            )})}
          </div>
        )}
      </FormSection>

      {/* Make & Model — dependent dropdowns */}
      <FormSection title="Car Details">
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          <div>
            <Label>Make</Label>
            <input value={form.make||""} onChange={e=>setForm({...form,make:e.target.value})} placeholder="e.g. Honda"/>
          </div>
          <div>
            <Label>Model</Label>
            <input value={form.model||""} onChange={e=>{const mdl=e.target.value;const cat=MODEL_CATEGORY[mdl]||form.category;setForm(f=>({...f,model:mdl,category:cat}));if(form.make&&mdl&&form.year)fetchVariants(form.make,mdl,form.year);}} placeholder="e.g. City"/>
          </div>
          <div>
            <Label>Year</Label>
            <select value={form.year||2022} onChange={e=>{const yr=Number(e.target.value);setForm(f=>({...f,year:yr,variant:""}));if(form.model)fetchVariants(form.make,form.model,yr);}}>
              {Array.from({length:19},(_,i)=>2026-i).map(y=><option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <Label>Variant {variantLoading&&<span style={{color:"#F59E0B",fontSize:9,fontWeight:700,marginLeft:4}}>LOADING…</span>}</Label>
            <input value={form.variant||""} onChange={e=>{const v=e.target.value;const specs=VARIANT_SPECS[v]||{};setForm(f=>({...f,variant:v,...(specs.fuel?{fuel:specs.fuel}:{}),...(specs.transmission?{transmission:specs.transmission}:{})}));}} placeholder="e.g. VX"/>
          </div>
          <div>
            <Label>Category {MODEL_CATEGORY[form.model]&&<span style={{color:"#10B981",fontSize:9,fontWeight:700,marginLeft:4}}>AUTO</span>}</Label>
            <select value={form.category||"Sedan"} onChange={e=>setForm({...form,category:e.target.value})}>
              {CATEGORY_OPTIONS.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <Label>Class {MAKE_CLASS[form.make]&&<span style={{color:"#10B981",fontSize:9,fontWeight:700,marginLeft:4}}>AUTO</span>}</Label>
            <select value={form.carClass||"Economy"} onChange={e=>setForm({...form,carClass:e.target.value})}>
              {CLASS_OPTIONS.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <Label>Fuel {form.variant&&variantOptions.find(o=>o.variant===form.variant)?.fuel&&<span style={{color:"#10B981",fontSize:9,fontWeight:700,marginLeft:4}}>AUTO</span>}</Label>
            <select value={form.fuel||"Petrol"} onChange={e=>setForm({...form,fuel:e.target.value})}>
              {["Petrol","Diesel","Electric","CNG","Hybrid"].map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <Label>Transmission {form.variant&&variantOptions.find(o=>o.variant===form.variant)?.transmission&&<span style={{color:"#10B981",fontSize:9,fontWeight:700,marginLeft:4}}>AUTO</span>}</Label>
            <select value={form.transmission||"Manual"} onChange={e=>setForm({...form,transmission:e.target.value})}>
              <option value="Manual">Manual</option>
              <option value="IVT">IVT</option>
              <option disabled>── Automatic ──</option>
              <option value="Automatic">Automatic</option>
              <option value="DCT">DCT</option>
              <option value="AMT">AMT</option>
              <option value="CVT">CVT</option>
              <option value="TipTronic">TipTronic</option>
              <option value="MultiTronic">MultiTronic</option>
              <option value="PDK">PDK</option>
            </select>
          </div>
        </div>
      </FormSection>
      <FormSection title="History">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          <div>
            <Label>KM Driven</Label>
            <input
              type={kmFocused?"number":"text"}
              value={kmFocused?form.km:(form.km===0?"0":Number(form.km).toLocaleString('en-IN'))}
              onFocus={()=>{setKmFocused(true);if(form.km===0)setForm(f=>({...f,km:""}));}}
              onBlur={()=>{setKmFocused(false);if(form.km===""||form.km===undefined)setForm(f=>({...f,km:0}));}}
              onChange={e=>{const v=e.target.value;if(v===""||Number(v)>=0)setForm(f=>({...f,km:v===""?"":Number(v)}));}}
              placeholder="e.g. 25000"
              min="0"
            />
          </div>
          <div><Label>Owners</Label><select value={form.owners||1} onChange={e=>setForm({...form,owners:Number(e.target.value)})}>{[1,2,3,4].map(o=><option key={o} value={o}>{o===4?"4+":o===1?"1st owner":o===2?"2nd owner":"3rd owner"}</option>)}</select></div>
        </div>
        <div>
          <Label>Service History (optional)</Label>
          <input ref={serviceFileRef} type="file" accept=".pdf,.doc,.docx" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f)setServiceDoc({name:f.name,url:URL.createObjectURL(f)});e.target.value="";}}/>
          {serviceDoc?(
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderRadius:10,border:"1.5px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.03)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,minWidth:0}}>
                <FileText size={15} color="#64748B" style={{flexShrink:0}}/>
                <span style={{fontSize:12.5,color:"#CBD5E1",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{serviceDoc.name}</span>
              </div>
              <button onClick={()=>setServiceDoc(null)} style={{background:"none",border:"none",cursor:"pointer",color:"#94A3B8",flexShrink:0}}><X size={14}/></button>
            </div>
          ):(
            <button onClick={()=>serviceFileRef.current?.click()} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:10,border:"1.5px dashed rgba(255,255,255,0.15)",background:"rgba(255,255,255,0.02)",color:"#94A3B8",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"Outfit,sans-serif"}}>
              <Upload size={14}/> Upload service history (PDF or Word doc)
            </button>
          )}
          <p style={{color:"#475569",fontSize:11,marginTop:6}}>Shown to buyers as a downloadable file on the listing.</p>
        </div>
      </FormSection>

      {/* Tyres */}
      <FormSection title="Tyres">
        {/* Wear diagram */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:20,marginBottom:24}}>
          {/* Left column: FL top, RL bottom */}
          <div style={{display:"flex",flexDirection:"column",gap:60}}>
            {[{key:"fl",label:"FL"},{key:"rl",label:"RL"}].map(t=>(
              <div key={t.key} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{width:28,height:58,borderRadius:7,background:"#0F172A",border:`2px solid ${tyreColor(form.tyreWear?.[t.key]??20)}`}}/>
                <div style={{display:"flex",alignItems:"center",gap:2}}>
                  <input type="number" min="0" max="100" value={form.tyreWear?.[t.key]??20} onChange={e=>setForm(f=>({...f,tyreWear:{...f.tyreWear,[t.key]:Math.max(0,Math.min(100,Number(e.target.value)))}}))} style={{width:44,padding:"4px 5px",fontSize:11.5,textAlign:"center"}}/>
                  <span style={{fontSize:10,color:"#64748B"}}>%</span>
                </div>
                <span style={{fontSize:9.5,color:"#64748B",fontWeight:600}}>{t.label}</span>
              </div>
            ))}
          </div>
          {/* Center: car body */}
          <div style={{position:"relative",width:100,height:210}}>
            <div style={{position:"absolute",left:0,top:0,width:"100%",height:"100%",border:"2px solid rgba(255,255,255,0.12)",borderRadius:38,background:"rgba(255,255,255,0.015)"}}/>
            <div style={{position:"absolute",left:18,top:28,width:64,height:3,borderRadius:2,background:"rgba(255,255,255,0.1)"}}/>
          </div>
          {/* Right column: FR top, RR bottom */}
          <div style={{display:"flex",flexDirection:"column",gap:60}}>
            {[{key:"fr",label:"FR"},{key:"rr",label:"RR"}].map(t=>(
              <div key={t.key} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{width:28,height:58,borderRadius:7,background:"#0F172A",border:`2px solid ${tyreColor(form.tyreWear?.[t.key]??20)}`}}/>
                <div style={{display:"flex",alignItems:"center",gap:2}}>
                  <input type="number" min="0" max="100" value={form.tyreWear?.[t.key]??20} onChange={e=>setForm(f=>({...f,tyreWear:{...f.tyreWear,[t.key]:Math.max(0,Math.min(100,Number(e.target.value)))}}))} style={{width:44,padding:"4px 5px",fontSize:11.5,textAlign:"center"}}/>
                  <span style={{fontSize:10,color:"#64748B"}}>%</span>
                </div>
                <span style={{fontSize:9.5,color:"#64748B",fontWeight:600}}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{color:"#475569",fontSize:11,textAlign:"center",margin:"0 0 24px"}}>% wear — <span style={{color:"#10B981"}}>green = good</span> · <span style={{color:"#F59E0B"}}>amber = moderate</span> · <span style={{color:"#EF4444"}}>red = worn</span></p>
        {/* Tyre specs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          <div>
            <Label>Tyre Brand</Label>
            <select value={form.tyreMake||"MRF"} onChange={e=>setForm({...form,tyreMake:e.target.value,tyreModel:""})}>
              {Object.keys(TYRE_BRANDS).map(b=><option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <Label>Tyre Model</Label>
            <select value={form.tyreModel||""} onChange={e=>setForm({...form,tyreModel:e.target.value})}>
              <option value="">Select</option>
              {(TYRE_BRANDS[form.tyreMake]||[]).map(m=><option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <Label>Tyre Size</Label>
            <select value={form.tyreSize||""} onChange={e=>setForm({...form,tyreSize:e.target.value})}>
              <option value="">Select</option>
              {TYRE_SIZES.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </FormSection>

      {/* Pricing & highlight */}
      <FormSection title="Pricing & Highlight">
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          <div>
            <Label>Price (₹)</Label>
            <input
              type={priceFocused?"number":"text"}
              value={priceFocused?form.price:(form.price===0?"0":Number(form.price).toLocaleString('en-IN'))}
              onFocus={()=>{setPriceFocused(true);if(form.price===0)setForm(f=>({...f,price:""}));}}
              onBlur={()=>{setPriceFocused(false);if(form.price===""||form.price===undefined)setForm(f=>({...f,price:0}));}}
              onChange={e=>{const v=e.target.value;if(v===""||Number(v)>=0)setForm(f=>({...f,price:v===""?"":Number(v)}));}}
              placeholder="e.g. 950000"
              min="0"
            />
          </div>
          <div><Label>Badge</Label><select value={form.badge||"None"} onChange={e=>setForm({...form,badge:e.target.value==="None"?null:e.target.value})}>{["None","Hot","Steal Deal","Most Viewed"].map(o=><option key={o}>{o}</option>)}</select></div>
          <FormInput label="Tagline" value={form.tagline} onChange={v=>setForm({...form,tagline:v})} ph="e.g. “Fun, frugal, and fast.”"/>
        </div>
      </FormSection>

      {/* Description */}
      <FormSection title="Description">
        <textarea value={form.description||""} onChange={e=>setForm({...form,description:e.target.value})} rows={5} placeholder="Service history, condition notes, what makes this car worth a look…"/>
      </FormSection>

      {/* Score */}
      <FormSection title="Pole Position Score" subtitle="Optional, but builds buyer trust">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{position:"relative",width:50,height:50}}>
              <svg viewBox="0 0 100 100" style={{transform:"rotate(-90deg)",width:"100%",height:"100%"}}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke={form.score>0?rc(form.score):"#334155"} strokeWidth="10" strokeDasharray={`${2*Math.PI*40}`} strokeDashoffset={`${2*Math.PI*40*(1-(form.score||0)/100)}`} strokeLinecap="round"/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:form.score>0?rc(form.score):"#334155",fontWeight:900,fontSize:13}}>{form.score>0?form.score:"—"}</span></div>
            </div>
            <div>
              <div style={{color:"#475569",fontSize:12}}>{form.score>0?rl(form.score)+" — "+SCORE_CATS.filter(c=>form.scoreBreakdown?.[c.key]>0).length+"/"+SCORE_CATS.length+" sections rated":"Not rated yet"}</div>
            </div>
          </div>
          <Btn onClick={()=>setScoring(true)}>{form.score>0?<><Edit2 size={12}/> Edit Score</>:<><Award size={12}/> Set Score</>}</Btn>
        </div>
      </FormSection>
      <div style={{marginTop:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <button onClick={()=>setEdit(null)} style={{padding:"12px 20px",borderRadius:11,border:"1.5px solid rgba(255,255,255,0.1)",background:"transparent",color:"#94A3B8",cursor:"pointer",fontWeight:600,fontSize:14,fontFamily:"Outfit,sans-serif"}}>Cancel</button>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>form.make&&setPreviewing(true)} disabled={!form.make} style={{padding:"12px 22px",borderRadius:11,border:"1.5px solid rgba(255,255,255,0.12)",background:"transparent",color:form.make?"#60A5FA":"#475569",cursor:form.make?"pointer":"not-allowed",fontWeight:600,fontSize:14,fontFamily:"Outfit,sans-serif",display:"flex",alignItems:"center",gap:7}}><Eye size={14}/> Preview</button>
          <button onClick={()=>save("draft")} style={{padding:"12px 22px",borderRadius:11,border:"1.5px solid rgba(255,255,255,0.12)",background:"transparent",color:"#94A3B8",cursor:"pointer",fontWeight:600,fontSize:14,fontFamily:"Outfit,sans-serif"}}>Save as Draft</button>
          <button onClick={()=>save("published")} style={{padding:"12px 26px",borderRadius:11,background:"#DC2626",border:"none",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:14,fontFamily:"Outfit,sans-serif"}}>{form.id?"Save Changes":"Create Listing"}</button>
        </div>
      </div>
    </div>
  );

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <span style={{color:"#94A3B8",fontSize:14}}>{cars.length} listings</span>
        <button onClick={()=>setEdit({})} style={{padding:"10px 18px",borderRadius:10,background:"#DC2626",border:"none",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:6,fontFamily:"Outfit,sans-serif"}}><Plus size={14}/> Add Listing</button>
      </div>
      <Card>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,0.07)"}}>{["Car","Category","Year","Price","Score","Actions"].map(h=><th key={h} style={{padding:"12px 16px",textAlign:"left",color:"#64748B",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>{h}</th>)}</tr></thead>
          <tbody>{cars.map(c=><tr key={c.id} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
            <td style={{padding:"11px 16px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><img src={c.img} alt="" style={{width:52,height:36,objectFit:"cover",borderRadius:8,flexShrink:0}} onError={e=>e.target.style.display="none"}/><div><div style={{fontWeight:600,fontSize:13.5,display:"flex",alignItems:"center",gap:7}}>{c.make} {c.model}{c.status==="draft"&&<span style={{background:"#F59E0B22",color:"#F59E0B",fontSize:9.5,fontWeight:700,padding:"2px 7px",borderRadius:20}}>DRAFT</span>}</div><div style={{color:"#64748B",fontSize:11.5}}>{c.fuel} · {c.transmission}</div></div></div></td>
            <td style={{padding:"11px 16px",color:"#94A3B8",fontSize:13}}>{c.category}</td>
            <td style={{padding:"11px 16px",color:"#94A3B8",fontSize:13}}>{c.year}</td>
            <td style={{padding:"11px 16px",fontWeight:600,fontSize:13}}>{fmt(c.price)}</td>
            <td style={{padding:"11px 16px"}}>{c.score>0?<span style={{background:`${rc(c.score)}22`,color:rc(c.score),fontWeight:700,fontSize:12,padding:"3px 10px",borderRadius:20}}>{c.score}</span>:<span style={{color:"#334155",fontSize:12}}>—</span>}</td>
            <td style={{padding:"11px 16px"}}><div style={{display:"flex",gap:6}}><Btn small onClick={()=>setEdit(c)}><Edit2 size={11}/> Edit</Btn><Btn small danger onClick={async()=>{await supabase.from("cars").delete().eq("id",c.id);setCars(cars.filter(x=>x.id!==c.id));}}><Trash2 size={11}/> Del</Btn></div></td>
          </tr>)}</tbody>
        </table>
      </Card>
    </div>
  );
}

// ── Blog ─────────────────────────────────────────────────────────

// ── Blog editor (admin) ──────────────────────────────────────────
function Blog({blogs,setBlogs}){
  const [edit,setEdit]=useState(null);
  const empty={title:"",tag:"Cars",author:"",date:new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}),readTime:"5 min",img:"",featured:false,views:0,excerpt:""};
  const [form,setForm]=useState(empty);
  useEffect(()=>{if(edit&&edit.id)setForm({...edit});else setForm(empty);},[edit]);
  const save=()=>{
    if(!form.title)return;
    if(form.id)setBlogs(blogs.map(p=>p.id===form.id?form:p));
    else setBlogs([...blogs,{...form,id:Date.now()}]);
    setEdit(null);
  };
  if(edit!==null)return(
    <div>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}><Btn onClick={()=>setEdit(null)}><ChevronLeft size={14}/> Back</Btn><h2 style={{fontWeight:800,fontSize:20,letterSpacing:"-0.03em"}}>{form.id?"Edit Post":"Write New Post"}</h2></div>
      <Card style={{padding:24,display:"flex",flexDirection:"column",gap:14}}>
        {[["Title","title","Article title"],["Cover Image URL","img","https://images.unsplash.com/…"],["Author","author","Your name"],["Read Time","readTime","5 min"]].map(([l,k,ph])=><div key={k}><Label>{l}</Label><input value={form[k]||""} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={ph}/></div>)}
        <div><Label>Tag</Label><select value={form.tag} onChange={e=>setForm({...form,tag:e.target.value})}>{["Cars","EV","Bikes","Guide"].map(t=><option key={t}>{t}</option>)}</select></div>
        <div><Label>Excerpt</Label><textarea value={form.excerpt||""} onChange={e=>setForm({...form,excerpt:e.target.value})} rows={3} placeholder="Short summary…"/></div>
        <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} style={{width:15,height:15,accentColor:"#DC2626"}}/><span style={{color:"#94A3B8",fontSize:13}}>Mark as Featured</span></label>
        {form.img&&<img src={form.img} alt="" style={{width:320,height:180,objectFit:"cover",borderRadius:12}} onError={e=>e.target.style.display="none"}/>}
      </Card>
      <div style={{marginTop:14,display:"flex",gap:10}}><button onClick={save} style={{padding:"12px 26px",borderRadius:11,background:"#DC2626",border:"none",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:14,fontFamily:"Outfit,sans-serif"}}>{form.id?"Save":"Publish"}</button><button onClick={()=>setEdit(null)} style={{padding:"12px 20px",borderRadius:11,border:"1.5px solid rgba(255,255,255,0.1)",background:"transparent",color:"#94A3B8",cursor:"pointer",fontWeight:600,fontSize:14,fontFamily:"Outfit,sans-serif"}}>Cancel</button></div>
    </div>
  );
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><span style={{color:"#94A3B8",fontSize:14}}>{blogs.length} posts</span><button onClick={()=>setEdit({})} style={{padding:"10px 18px",borderRadius:10,background:"#DC2626",border:"none",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:6,fontFamily:"Outfit,sans-serif"}}><Plus size={14}/> New Post</button></div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {blogs.map(p=><Card key={p.id} style={{padding:"14px 18px",display:"flex",alignItems:"center",gap:14}}>
          <img src={p.img} alt="" style={{width:68,height:48,objectFit:"cover",borderRadius:9,flexShrink:0}} onError={e=>e.target.style.display="none"}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:700,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:4}}>{p.title}</div>
            <div style={{color:"#64748B",fontSize:12}}>{p.author} · {p.date} · {p.readTime} {p.featured&&<span style={{marginLeft:6,background:"rgba(245,158,11,0.15)",color:"#F59E0B",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20}}>Featured</span>}</div>
          </div>
          <div style={{display:"flex",gap:6,flexShrink:0}}><Btn small onClick={()=>setEdit(p)}><Edit2 size={11}/> Edit</Btn><Btn small danger onClick={()=>setBlogs(blogs.filter(x=>x.id!==p.id))}><Trash2 size={11}/> Del</Btn></div>
        </Card>)}
      </div>
    </div>
  );
}

// ── Users ────────────────────────────────────────────────────────

// ── UsersList (admin) ────────────────────────────────────────────
function AdminTeam(){
  const [team,setTeam]=useState(ADMIN_TEAM_SEED);
  const [showAdd,setShowAdd]=useState(false);
  const [addEmail,setAddEmail]=useState("");
  const [addBusy,setAddBusy]=useState(false);
  const [editingId,setEditingId]=useState(null);
  const [editName,setEditName]=useState("");
  const [confirmRemove,setConfirmRemove]=useState(null);

  const inviteAdmin=()=>{
    if(!addEmail)return;
    setAddBusy(true);
    setTimeout(()=>{
      setTeam(t=>[{id:"a"+Date.now(),name:addEmail.split("@")[0],email:addEmail,created_at:new Date().toISOString(),confirmed:false},...t]);
      setAddBusy(false);setAddEmail("");setShowAdd(false);
    },700);
  };
  const removeAdmin=(id)=>{setTeam(t=>t.filter(u=>u.id!==id));setConfirmRemove(null);};
  const saveName=(id)=>{setTeam(t=>t.map(u=>u.id===id?{...u,name:editName}:u));setEditingId(null);};
  const simulateConfirm=(id)=>setTeam(t=>t.map(u=>u.id===id?{...u,confirmed:true}:u));

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{color:"#94A3B8",fontSize:14}}>{team.length} admin {team.length===1?"account":"accounts"}</div>
        <Btn full onClick={()=>{setShowAdd(true);}}><Plus size={13}/> Add Admin</Btn>
      </div>

      <Card>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,0.07)"}}>{["Admin","Email","Status","Joined","Actions"].map(h=><th key={h} style={{padding:"12px 16px",textAlign:h==="Actions"?"right":"left",color:"#64748B",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>{h}</th>)}</tr></thead>
          <tbody>{team.map(u=><tr key={u.id} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
            <td style={{padding:"13px 16px"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:"#334155",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,color:"#94A3B8",flexShrink:0}}>{(u.name||u.email||"?")[0].toUpperCase()}</div>
                {editingId===u.id?(
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <input value={editName} onChange={e=>setEditName(e.target.value)} style={{padding:"6px 9px",fontSize:13,width:140}}/>
                    <button onClick={()=>saveName(u.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#10B981"}}><CheckCircle size={15}/></button>
                    <button onClick={()=>setEditingId(null)} style={{background:"none",border:"none",cursor:"pointer",color:"#64748B"}}><X size={15}/></button>
                  </div>
                ):(
                  <span style={{fontWeight:600,fontSize:14}}>{u.name||"Unnamed"}</span>
                )}
              </div>
            </td>
            <td style={{padding:"13px 16px",color:"#94A3B8",fontSize:13}}>{u.email}</td>
            <td style={{padding:"13px 16px"}}>
              {u.confirmed?
                <span style={{display:"inline-flex",alignItems:"center",gap:5,background:"#10B98122",color:"#10B981",fontWeight:600,fontSize:11,padding:"3px 10px",borderRadius:20}}><CheckCircle size={11}/> Active</span>:
                <span onClick={()=>simulateConfirm(u.id)} title="Click to simulate confirmation (preview only)" style={{display:"inline-flex",alignItems:"center",gap:5,background:"#F59E0B22",color:"#F59E0B",fontWeight:600,fontSize:11,padding:"3px 10px",borderRadius:20,cursor:"pointer"}}><Hourglass size={11}/> Pending</span>}
            </td>
            <td style={{padding:"13px 16px",color:"#94A3B8",fontSize:13}}>{new Date(u.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</td>
            <td style={{padding:"13px 16px"}}>
              <div style={{display:"flex",gap:7,justifyContent:"flex-end"}}>
                {confirmRemove===u.id?(
                  <>
                    <Btn small danger w={84} onClick={()=>removeAdmin(u.id)}>Confirm</Btn>
                    <Btn small w={84} onClick={()=>setConfirmRemove(null)}>Cancel</Btn>
                  </>
                ):u.confirmed?(
                  <>
                    {editingId!==u.id&&<Btn small w={84} onClick={()=>{setEditingId(u.id);setEditName(u.name||"");}}>Edit</Btn>}
                    <Btn small danger w={84} onClick={()=>setConfirmRemove(u.id)}>Remove</Btn>
                  </>
                ):(
                  <Btn small danger w={84} onClick={()=>removeAdmin(u.id)}>Cancel</Btn>
                )}
              </div>
            </td>
          </tr>)}</tbody>
        </table>
        {team.length===0&&<div style={{padding:"40px 20px",textAlign:"center",color:"#475569",fontSize:13}}>No admin accounts yet — add one above.</div>}
      </Card>

      {showAdd&&(
        <div style={{position:"fixed",inset:0,zIndex:500,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowAdd(false)}>
          <div className="pp-admin" style={{background:"#1E293B",borderRadius:18,padding:28,width:380,maxWidth:"90vw",border:"1px solid rgba(255,255,255,0.08)"}} onClick={e=>e.stopPropagation()}>
            <h3 style={{fontWeight:800,fontSize:17,marginBottom:6}}>Invite an admin</h3>
            <p style={{color:"#94A3B8",fontSize:12.5,marginBottom:18}}>They'll get an email with a link to confirm and set their password. (Preview mode: no real email is sent — click the Pending badge on their row to simulate them confirming.)</p>
            <Label>Email</Label>
            <input value={addEmail} onChange={e=>setAddEmail(e.target.value)} type="email" placeholder="teammate@example.com" style={{marginBottom:14}}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setShowAdd(false)} style={{flex:1,padding:"11px",borderRadius:10,border:"1px solid rgba(255,255,255,0.12)",background:"transparent",color:"#94A3B8",cursor:"pointer",fontWeight:600,fontFamily:"Outfit,sans-serif"}}>Cancel</button>
              <button onClick={inviteAdmin} disabled={addBusy} style={{flex:1,padding:"11px",borderRadius:10,border:"none",background:"#DC2626",color:"#fff",cursor:"pointer",fontWeight:700,fontFamily:"Outfit,sans-serif",opacity:addBusy?0.7:1}}>{addBusy?"Sending…":"Send Invite"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Error Boundary — catches render crashes instead of a blank page ──

// ── EnquiriesPanel ───────────────────────────────────────────────
function EnquiriesPanel(){
  const [enquiries,setEnquiries]=useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    supabase.from("enquiries").select("*").order("created_at",{ascending:false}).then(({data})=>{
      setEnquiries(data||[]);
      setLoading(false);
    });
  },[]);
  if(loading)return <div style={{color:"#64748B",padding:20}}>Loading enquiries…</div>;
  if(!enquiries.length)return <div style={{color:"#64748B",padding:20}}>No enquiries yet.</div>;
  return(
    <Card>
      <div style={{padding:"16px 22px",borderBottom:"1px solid rgba(255,255,255,0.07)",fontWeight:700,fontSize:15}}>All Enquiries</div>
      <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
        <thead><tr style={{borderBottom:"1px solid rgba(255,255,255,0.07)"}}>{["Car","Name","Email","Phone","Date","Listing"].map(h=><th key={h} style={{padding:"11px 16px",textAlign:"left",color:"#64748B",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
        <tbody>{enquiries.map((e,i)=><tr key={e.id||i} style={{borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
          <td style={{padding:"12px 16px",fontWeight:600,fontSize:13,whiteSpace:"nowrap"}}>{e.car_title||e.car_id}</td>
          <td style={{padding:"12px 16px",fontSize:13}}>{e.name}</td>
          <td style={{padding:"12px 16px",fontSize:13,color:"#94A3B8"}}>{e.email}</td>
          <td style={{padding:"12px 16px",fontSize:13}}>{e.phone}</td>
          <td style={{padding:"12px 16px",fontSize:13,color:"#94A3B8",whiteSpace:"nowrap"}}>{e.created_at?new Date(e.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"-"}</td>
          <td style={{padding:"12px 16px"}}>{e.listing_url?<a href={e.listing_url} target="_blank" rel="noopener noreferrer" style={{color:"#60A5FA",fontSize:12,fontWeight:600,textDecoration:"none"}}>View</a>:"-"}</td>
        </tr>)}</tbody>
      </table>
      </div>
    </Card>
  );
}

// ── AdminConsole ─────────────────────────────────────────────────
function AdminConsole({cars,setCars,blogs,setBlogs,users,onExit}){
  const [tab,setTab]=useState("dashboard");
  const [authed,setAuthed]=useState(false);
  const [loginErr,setLoginErr]=useState("");
  const [loginEmail,setLoginEmail]=useState("");
  const [loginPass,setLoginPass]=useState("");
  const [loginRemember,setLoginRemember]=useState(true);

  const handleLogin=async()=>{
    setLoginErr("");
    const {data,error}=await supabase.auth.signInWithPassword({email:loginEmail,password:loginPass});
    if(error){setLoginErr("Incorrect email or password.");return;}
    const profile=await supabase.from("profiles").select("is_admin").eq("id",data.user.id).single();
    if(!profile.data?.is_admin){setLoginErr("You do not have admin access.");return;}
    setAuthed(true);
  };

  if(!authed)return(
    <>
      <style>{G}</style>
      <div className="pp-admin" style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,background:"#0F172A"}}>
        <button onClick={onExit} style={{position:"absolute",top:20,left:24,display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"#64748B",fontSize:12.5,fontWeight:600,fontFamily:"Outfit,sans-serif"}}><ChevronLeft size={13}/> Back to site</button>
        <div style={{width:420,maxWidth:"94vw"}}>
          {/* Logo */}
          <div style={{textAlign:"center",marginBottom:36}}>
            <div style={{width:56,height:56,background:"linear-gradient(135deg,#DC2626,#991B1B)",borderRadius:16,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:18,boxShadow:"0 8px 32px rgba(220,38,38,0.35)"}}><Car size={26} color="#fff"/></div>
            <div style={{fontWeight:900,fontSize:26,letterSpacing:"-0.04em"}}>PolePosition</div>
            <div style={{color:"#DC2626",fontSize:11,fontWeight:700,letterSpacing:"0.18em",marginTop:4}}>ADMIN CONSOLE</div>
          </div>
          {/* Card */}
          <div style={{background:"#1E293B",borderRadius:22,padding:"32px 36px",border:"1px solid rgba(255,255,255,0.07)",boxShadow:"0 24px 64px rgba(0,0,0,0.5)"}}>
            <div style={{marginBottom:20}}>
              <Label>Email address</Label>
              <input value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} type="email" placeholder="you@example.com" onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
            </div>
            <div style={{marginBottom:20}}>
              <Label>Password</Label>
              <input value={loginPass} onChange={e=>setLoginPass(e.target.value)} type="password" placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                <input type="checkbox" checked={loginRemember} onChange={e=>setLoginRemember(e.target.checked)} style={{width:15,height:15,accentColor:"#DC2626"}}/>
                <span style={{color:"#94A3B8",fontSize:13}}>Remember me</span>
              </label>
              <span style={{color:"#475569",fontSize:12.5,cursor:"pointer"}}>Forgot password?</span>
            </div>
            {loginErr&&<div style={{background:"rgba(220,38,38,0.1)",border:"1px solid rgba(220,38,38,0.2)",color:"#F87171",fontSize:12.5,padding:"10px 14px",borderRadius:10,marginBottom:16}}>{loginErr}</div>}
            <button onClick={handleLogin} style={{width:"100%",padding:"14px",borderRadius:12,background:"linear-gradient(135deg,#DC2626,#B91C1C)",border:"none",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:15,fontFamily:"Outfit,sans-serif",boxShadow:"0 4px 16px rgba(220,38,38,0.35)"}}>Sign in to Admin</button>
          </div>
        </div>
      </div>
    </>
  );

  const NAV=[{id:"dashboard",label:"Dashboard",icon:BarChart2},{id:"listings",label:"Listings",icon:Car},{id:"users",label:"Admin Team",icon:Shield},{id:"blog",label:"Blog",icon:BookOpen},{id:"enquiries",label:"Enquiries",icon:MessageSquare}];
  return(
    <>
      <style>{G}</style>
      <div className="pp-admin" style={{height:"100vh",display:"flex",overflow:"hidden"}}>
        <div style={{width:220,background:"#1E293B",borderRight:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto"}}>
          <div style={{padding:"22px 20px 18px",borderBottom:"1px solid rgba(255,255,255,0.06)",position:"sticky",top:0,background:"#1E293B",zIndex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <div style={{width:32,height:32,background:"#DC2626",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}><Car size={16} color="#fff"/></div>
              <div><div style={{fontWeight:800,fontSize:14,letterSpacing:"-0.03em"}}>PolePosition</div><div style={{color:"#DC2626",fontSize:9.5,fontWeight:700,letterSpacing:"0.1em"}}>ADMIN</div></div>
            </div>
          </div>
          <nav style={{padding:"10px 0",flex:1}}>
            {NAV.map(n=>{const Icon=n.icon;const a=tab===n.id;return(
              <button key={n.id} onClick={()=>setTab(n.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 20px",border:"none",width:"100%",background:a?"rgba(220,38,38,0.1)":"transparent",cursor:"pointer",borderLeft:a?"3px solid #DC2626":"3px solid transparent",textAlign:"left",fontFamily:"Outfit,sans-serif"}}>
                <Icon size={16} color={a?"#DC2626":"#64748B"}/><span style={{color:a?"#fff":"#94A3B8",fontWeight:a?600:500,fontSize:13.5}}>{n.label}</span>
              </button>
            );})}
          </nav>
          <div style={{padding:"14px 20px",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",gap:10}}>
            <button onClick={onExit} style={{display:"flex",alignItems:"center",gap:8,background:"transparent",border:"none",cursor:"pointer",color:"#94A3B8",fontSize:13,fontWeight:600,fontFamily:"Outfit,sans-serif"}}><ChevronLeft size={13}/> Back to site</button>
            <button onClick={()=>setAuthed(false)} style={{display:"flex",alignItems:"center",gap:8,background:"transparent",border:"none",cursor:"pointer",color:"#64748B",fontSize:13,fontWeight:500,fontFamily:"Outfit,sans-serif"}}><LogOut size={13}/> Sign Out</button>
          </div>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{padding:"16px 28px",borderBottom:"1px solid rgba(255,255,255,0.06)",background:"#1E293B",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
            <h1 style={{fontWeight:800,fontSize:19,letterSpacing:"-0.03em"}}>{NAV.find(n=>n.id===tab)?.label}</h1>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{textAlign:"right"}}><div style={{fontSize:12.5,fontWeight:600}}>Admin</div><div style={{color:"#64748B",fontSize:11}}>vaseey@gmail.com</div></div>
              <div style={{width:34,height:34,background:"#DC2626",borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center"}}><Shield size={16} color="#fff"/></div>
            </div>
          </div>
          <div style={{padding:"26px 28px",overflowY:"auto",flex:1}}>
            {tab==="dashboard"&&<Dashboard cars={cars} blogs={blogs} users={users}/>}
            {tab==="listings"&&<Listings cars={cars} setCars={setCars}/>}
            {tab==="users"&&<AdminTeam/>}
            {tab==="blog"&&<Blog blogs={blogs} setBlogs={setBlogs}/>}
            {tab==="enquiries"&&<EnquiriesPanel/>}
          </div>
        </div>
      </div>
    </>
  );
}

// ── FavoritesPage ─────────────────────────────────────────────────
function FavoritesPage({setPage,setSelectedCar,favs,toggleFav,cars}){
  const saved=cars.filter(c=>favs.includes(c.id));
  return(
    <div style={{paddingTop:80,minHeight:"100vh",background:"#F8FAFC"}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 24px 70px"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
          <h1 style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:32,letterSpacing:"-0.03em"}}>My Favourites</h1>
          <span style={{background:"#DC2626",color:"#fff",padding:"5px 14px",borderRadius:100,fontWeight:700,fontSize:14}}>{saved.length}</span>
        </div>
        {saved.length===0?(
          <div style={{textAlign:"center",padding:"80px 20px",color:"#94A3B8"}}>
            <Heart size={36} color="#CBD5E1" style={{marginBottom:14}}/>
            <p style={{fontSize:15,marginBottom:18}}>You haven't saved any cars yet.</p>
            <button onClick={()=>setPage("browse")} className="btn-red" style={{padding:"11px 24px",borderRadius:11,fontSize:14}}>Browse Cars</button>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20}}>
            {saved.map(c=><BrowseCarCard key={c.id} car={c} onFav={toggleFav} isFav={true} onClick={()=>{setSelectedCar(c);}}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

// ── PublicSite + top-level switcher ──────────────────────────────
function PublicSite({cars,blog,threads,onGoAdmin}){
  const [page,setPage]=useState("home");
  const [car,setCar]=useState(null);
  const [thread,setThread]=useState(null);
  const [user,setUser]=useState(null);
  const [userEmail,setUserEmail]=useState(null);
  const [isAdmin,setIsAdmin]=useState(false);
  const [showLogin,setShowLogin]=useState(false);
  const [favs,setFavs]=useState([]);

  const toggleFav=(id)=>{
    if(!user){setShowLogin(true);return;}
    setFavs(f=>f.includes(id)?f.filter(x=>x!==id):[...f,id]);
  };

  const carSlug=(c)=>`${c.make}-${c.model}`.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")+`-${c.id}`;

  // Hash-based routing for shareable car URLs
  useEffect(()=>{
    const onHash=()=>{
      const hash=window.location.hash;
      const m=hash.match(/^#\/car\/(.+)$/);
      if(m){
        const slug=m[1];
        const idFromSlug=slug.split("-").pop();
        const found=cars.find(c=>String(c.id)===idFromSlug);
        if(found){setCar(found);setPage("detail");return;}
      }
      if(hash===""||hash==="#/")setPage("home");
    };
    onHash();
    window.addEventListener("hashchange",onHash);
    return()=>window.removeEventListener("hashchange",onHash);
  },[cars]);

  const navTo=(p,c=null)=>{
    if(p==="detail"&&c){window.location.hash=`#/car/${carSlug(c)}`;}
    else{window.location.hash=p==="home"?"":"#/"+p;}
    setPage(p);if(c)setCar(c);
  };

  useEffect(()=>{try{window.scrollTo(0,0);}catch(e){}},[page]);

  return(
    <>
      <style>{G}</style>
      <Navbar page={page} setPage={p=>navTo(p)} user={user} setUser={setUser} setShowLogin={setShowLogin} isAdmin={isAdmin} onGoAdmin={onGoAdmin}/>
      {showLogin&&<LoginModal onClose={()=>setShowLogin(false)} onLogin={({name,email})=>{
        if(email&&email.toLowerCase()==="vaseey@gmail.com"){setShowLogin(false);onGoAdmin();return;}
        setUser(name);setUserEmail(email);setIsAdmin(false);setShowLogin(false);
      }}/>}
      {page==="home"&&<HomePage setPage={p=>navTo(p)} setSelectedCar={c=>navTo("detail",c)} favs={favs} toggleFav={toggleFav} cars={cars} blog={blog}/>}
      {page==="browse"&&<BrowsePage setPage={p=>navTo(p)} setSelectedCar={c=>navTo("detail",c)} favs={favs} toggleFav={toggleFav} cars={cars}/>}
      {page==="favorites"&&<FavoritesPage setPage={p=>navTo(p)} setSelectedCar={c=>navTo("detail",c)} favs={favs} toggleFav={toggleFav} cars={cars}/>}
      {page==="detail"&&<CarDetailPage car={car} setPage={p=>navTo(p)} isFav={favs.includes(car?.id)} onFav={toggleFav} user={user} setShowLogin={setShowLogin} userEmail={userEmail}/>}
      {page==="quiz"&&<QuizPage setPage={p=>navTo(p)} setSelectedCar={c=>navTo("detail",c)} cars={cars}/>}
      {page==="blog"&&<BlogPage blog={blog}/>}
      {page==="forum"&&<ForumPage setPage={p=>navTo(p)} setThread={setThread} user={user} setShowLogin={setShowLogin} threads={threads}/>}
      {page==="thread"&&<ThreadPage thread={thread} setPage={p=>navTo(p)} user={user} setShowLogin={setShowLogin}/>}
    </>
  );
}

// ── Top-level switcher ───────────────────────────────────────────
export default function App(){
  const [view,setView]=useState("public");
  const [cars,setCars]=useState(CARS_SEED);
  const [blogs,setBlogs]=useState(BLOG_SEED);
  const [threads,setThreads]=useState(THREADS_SEED);
  const [users]=useState(USERS_SEED);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    async function fetchData(){
      const [carsRes,blogsRes,threadsRes]=await Promise.all([
        supabase.from("cars").select("*").order("id"),
        supabase.from("blog_posts").select("*").order("id"),
        supabase.from("forum_threads").select("*").order("pinned",{ascending:false}).order("id"),
      ]);
      if(carsRes.data?.length) setCars(carsRes.data.map(c=>({...c,scoreBreakdown:c.score_breakdown,tyreWear:c.tyre_wear})));
      if(blogsRes.data?.length) setBlogs(blogsRes.data.map(b=>({...b,readTime:b.read_time})));
      if(threadsRes.data?.length) setThreads(threadsRes.data);
      setLoading(false);
    }
    fetchData();
  },[]);

  // Detect Supabase email confirmation redirect
  const [confirmed,setConfirmed]=useState(()=>window.location.hash.includes("type=signup"));
  useEffect(()=>{
    if(!confirmed)return;
    supabase.auth.getSession(); // consume the token from hash
    const t=setTimeout(()=>{
      window.location.hash="";
      setConfirmed(false);
    },2500);
    return()=>clearTimeout(t);
  },[confirmed]);

  if(confirmed) return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"Outfit,sans-serif",background:"#F8FAFC",gap:16,textAlign:"center",padding:24}}>
      <div style={{width:64,height:64,background:"#DCFCE7",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}}><CheckCircle size={32} color="#16A34A"/></div>
      <h1 style={{fontWeight:900,fontSize:28,letterSpacing:"-0.03em",color:"#0F172A",margin:0}}>Your account is confirmed.</h1>
      <p style={{fontWeight:600,fontSize:17,color:"#0F172A",margin:0}}>Welcome to Pole Position.</p>
      <p style={{color:"#64748B",fontSize:14,margin:0}}>Please wait. Redirecting…</p>
      <div style={{width:36,height:36,border:"3px solid #E2E8F0",borderTopColor:"#DC2626",borderRadius:"50%",animation:"spin 0.8s linear infinite",marginTop:8}}/>
    </div>
  );

  if(loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"Outfit,sans-serif",fontSize:18,color:"#64748B"}}>Loading…</div>;

  if(view==="admin"){
    return <AdminConsole cars={cars} setCars={setCars} blogs={blogs} setBlogs={setBlogs} users={users} onExit={()=>setView("public")}/>;
  }
  return <PublicSite cars={cars.filter(c=>c.status!=="draft")} blog={blogs} threads={threads} onGoAdmin={()=>setView("admin")}/>;
}
// cache-bust: 1782134876
