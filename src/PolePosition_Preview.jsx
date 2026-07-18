import { useState, useEffect, useMemo, useRef } from "react";
import { supabase } from "./supabase.js";
import { Search, Heart, X, ChevronRight, ArrowRight, User, Gauge, Calendar, CheckCircle, XCircle, Shield, Zap, ChevronDown, ChevronLeft, Award, Clock, TrendingUp, Users, Filter, Star, RotateCcw, Check, MapPin, Wrench, Fuel, MessageSquare, BookOpen, ThumbsUp, Send, Eye, Car, Activity, Share2, BarChart2, Plus, Bookmark, PenSquare, Hash, LogOut, AlertCircle, Edit2, Trash2, FileText, Lock, Hourglass, Upload, Film, Play } from "lucide-react";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  :root{--red:#9B2B2B;--blue:#1E3A6E;--dark:#0A0A0A;--card:#111111;--border:rgba(255,255,255,0.08);--f:Outfit,sans-serif;
    --pp-bg:#0A0A0A;--pp-card:#111111;--pp-card2:#1A1A1A;--pp-text:#ffffff;--pp-text2:rgba(255,255,255,0.62);--pp-text3:rgba(255,255,255,0.5);--pp-border:rgba(255,255,255,0.08);--pp-border2:rgba(255,255,255,0.12);--pp-nav:rgba(10,10,10,0.9);--pp-input:#1A1A1A;--pp-chip:rgba(255,255,255,0.1);--pp-chip-text:rgba(255,255,255,0.8);--pp-accent:#9B2B2B;--pp-primary:#1E3A6E;}
  :root.light{--pp-bg:#F4F6FB;--pp-card:#ffffff;--pp-card2:#EEF2F9;--pp-text:#0F172A;--pp-text2:#4B5A70;--pp-text3:#647087;--pp-border:#D8E0EE;--pp-border2:#B8C6E0;--pp-nav:rgba(248,250,255,0.95);--pp-input:#F4F6FB;--pp-chip:#EEF2F9;--pp-chip-text:#1E3A6E;--pp-accent:#9B2B2B;--pp-primary:#1E3A6E;}
  body{font-family:var(--f);background:var(--pp-bg);color:var(--pp-text);}
  input,textarea,select{font-family:var(--f);outline:none;}
  button{font-family:var(--f);outline:none;}
  /* Keyboard focus indicator — visible only when navigating by keyboard, so mouse users see no ring */
  a:focus-visible,button:focus-visible,input:focus-visible,textarea:focus-visible,select:focus-visible,[tabindex]:focus-visible{outline:2px solid var(--pp-accent);outline-offset:2px;border-radius:4px;}
  .btn-red{background:var(--red);color:#fff;border:none;cursor:pointer;font-weight:700;font-family:var(--f);}
  .btn-red:hover{background:#7A1F1F;}
  .glass{background:rgba(20,20,20,0.95);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08);}
  .pp-nav{background:rgba(0,0,0,0.85);backdrop-filter:blur(12px);border-bottom:1px solid rgba(255,255,255,0.08);}
  .pp-admin{background:#0F172A;color:#fff;--pp-text:#ffffff;--pp-text2:rgba(255,255,255,0.5);--pp-text3:rgba(255,255,255,0.3);--pp-border:rgba(255,255,255,0.08);--pp-card:#1E293B;--pp-chip:rgba(255,255,255,0.1);}
  .pp-admin input,.pp-admin textarea,.pp-admin select{font:inherit;margin:0;line-height:1.4;}
  .pp-admin input,.pp-admin textarea{background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,255,255,0.1);color:#fff;padding:10px 14px;border-radius:10px;font-size:14px;width:100%;box-sizing:border-box;}
  .pp-admin input[type=number]::-webkit-inner-spin-button,.pp-admin input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}
  .pp-admin input[type=number]{-moz-appearance:textfield;}
  .pp-admin select{background-color:#0F172A;border:1.5px solid rgba(255,255,255,0.1);color:#fff;padding:10px 32px 10px 14px;border-radius:10px;font-size:14px;width:100%;box-sizing:border-box;-webkit-appearance:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;background-size:12px;text-overflow:ellipsis;}
  .pp-admin textarea{resize:vertical;line-height:1.6;}
  .range-dual{-webkit-appearance:none;appearance:none;background:transparent;pointer-events:none;position:absolute;top:0;left:0;width:100%;margin:0;}
  .range-dual::-webkit-slider-runnable-track{-webkit-appearance:none;height:4px;background:transparent;}
  .range-dual::-webkit-slider-thumb{-webkit-appearance:none;pointer-events:auto;width:16px;height:16px;border-radius:50%;background:#9B2B2B;border:2.5px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,0.35);cursor:pointer;margin-top:-6px;}
  .range-dual::-moz-range-track{height:4px;background:transparent;}
  .range-dual::-moz-range-thumb{pointer-events:auto;width:16px;height:16px;border-radius:50%;background:#9B2B2B;border:2.5px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,0.35);cursor:pointer;}
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
  {id:1,title:"How to Buy a Used Car in India: A Practical Checklist",excerpt:"Most buyers get into trouble because they fall for a good looking car without checking what is underneath. Here's how to buy smart.",tag:"Guide",readTime:"5 min",date:"Jun 10, 2025",img:"https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=900&q=80",author:"PP Team",featured:true,views:8940,body:[
    {p:"Buying a used car in India is not complicated once you know what to look for. Most buyers get into trouble because they fall for a good looking car without checking what is underneath, literally and on paper."},
    {h:"Start with the paperwork, not the paint job",p:"Before you even sit in the car, ask for the RC book, insurance copy, and the last service record. Match the engine and chassis number on the RC with what is stamped on the car. If the seller is hesitant to show these, walk away."},
    {h:"Check for accident history",p:"Run your hand along the body panels. Uneven gaps, mismatched paint, or fresh welding marks are signs of past accident repair. A car that has been in a major accident may have hidden structural issues even if it looks fine on the surface."},
    {h:"Take it for a real test drive",p:"Not a five minute spin around the block. Drive it on a slightly bad road, brake hard once, and check if the steering pulls to one side. Listen for unusual noises from the engine and suspension."},
    {h:"Get a professional inspection",p:"This is where most individual buyers go wrong. A mechanic you trust, or a platform that does independent multi point inspections, will catch problems a regular buyer simply will not notice."},
    {h:"Negotiate with data, not guesswork",p:"Know the on-road price of a similar car with similar kilometres before you negotiate. This puts you in a stronger position than haggling on instinct."},
    {p:"At Pole Position, every car listed has already been through this process for you, so you are buying with information, not hope."},
  ]},
  {id:2,title:"What Our Inspection Checklist Actually Covers",excerpt:"When we say every car is inspected, we mean it goes through a detailed, structured process before it is listed. Here is what that actually involves.",tag:"Guide",readTime:"4 min",date:"Jun 15, 2025",img:"https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=900&q=80",author:"PP Team",featured:false,views:5210,body:[
    {p:"When we say every car is inspected, we mean it goes through a detailed, structured process before it is listed. Here is what that actually involves."},
    {h:"Engine and transmission",p:"We check for oil leaks, unusual engine noise, smoke colour on start up, and gear shift smoothness. Any car with a major engine or transmission issue does not make it to our showroom."},
    {h:"Electricals",p:"From the battery and alternator to power windows, central locking, and the infotainment system, every electrical component is tested. Faulty electricals are one of the most common and most annoying problems used car buyers face later."},
    {h:"Body and structure",p:"We inspect for rust, accident repair, panel alignment, and chassis damage. A car that looks fine from a distance can still have structural compromises, and our checks are built to catch exactly that."},
    {h:"Documentation",p:"RC, insurance, previous ownership history, and pending challans are all verified before listing. You should never have to discover a legal headache after the purchase."},
    {h:"Tyres, brakes, and suspension",p:"Tread depth, brake response, and suspension noise are checked under actual driving conditions, not just a visual look."},
    {p:"Every car that passes gets a score, and that score is what you see when you browse our listings. No guesswork, no surprises after you drive it home."},
  ]},
  {id:3,title:"Documents You Need When Buying a Used Car in India",excerpt:"A used car purchase in India involves more paperwork than most first time buyers expect. Missing even one document can cause problems months later.",tag:"Guide",readTime:"4 min",date:"Jun 18, 2025",img:"https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=80",author:"PP Team",featured:false,views:4120,body:[
    {p:"A used car purchase in India involves more paperwork than most first time buyers expect. Missing even one document can cause problems months later, especially during resale or RC transfer."},
    {h:"From the seller, you need:",p:"Original Registration Certificate (RC) · Valid insurance policy, ideally transferable · Pollution Under Control (PUC) certificate · Last service history, if available · Original invoice from the first purchase, where possible · No Objection Certificate (NOC) if the car is registered in a different state · Loan closure letter, if the car was under a loan."},
    {h:"From your side, you will need:",p:"Valid ID proof and address proof · PAN card, since RTO transfers usually require it · Passport size photographs for RTO forms."},
    {h:"Why this matters more than people think",p:"An incomplete RC transfer can leave the previous owner liable for challans or even legal issues linked to the car after it has been sold. Buyers without a properly transferred RC can also face trouble getting loans, insurance claims, or reselling the car later."},
    {p:"At Pole Position, our team verifies this paperwork before a car is listed, and we guide you through the transfer process after purchase, so you are not chasing documents on your own."},
  ]},
  {id:4,title:"Maruti Swift Second Hand Price in Hyderabad: What to Expect",excerpt:"The Maruti Swift remains one of the most searched used cars in Hyderabad. What affects the price and what should you check before buying?",tag:"Cars",readTime:"5 min",date:"Jun 20, 2025",img:"https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80",author:"Rahul Sharma",featured:false,views:6830,body:[
    {p:"The Maruti Swift remains one of the most searched used cars in Hyderabad, and for good reason. It is fuel efficient, easy to maintain, and has strong resale value compared to most hatchbacks in its segment."},
    {h:"What affects the price",p:"Year of manufacture, kilometres driven, fuel variant, and ownership history all play a role. A petrol Swift with a single owner and full service history will always command a better price than one with multiple owners or an unclear maintenance record."},
    {h:"Variant matters",p:"Older Swift models had noticeably different features across base and top variants. Buyers should be clear on whether they are looking at a base model or a fully loaded one, since the price difference can be significant for what looks like the same car."},
    {h:"What to check before buying",p:"Beyond the usual inspection points, Swift owners commonly report issues with clutch wear on high mileage cars and minor electrical faults in older models. Ask specifically about these during inspection."},
    {h:"Our take",p:"A well maintained Swift, regardless of year, is a dependable buy for first time car owners or anyone wanting a practical city runabout. Browse our current Swift listings on Pole Position, every one of them inspected and scored before going live."},
  ]},
  {id:5,title:"Tata Nexon EV Max: A 6-Month Ownership Report",excerpt:"Electric vehicles are no longer a novelty on Hyderabad roads. Here is what real ownership over six months tends to look like.",tag:"EV",readTime:"7 min",date:"Jun 22, 2025",img:"https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=900&q=80",author:"Priya Nair",featured:false,views:6302,body:[
    {p:"Electric vehicles are no longer a novelty on Hyderabad roads, and the Tata Nexon EV Max is among the more common ones we see come through our showroom. Here is what real ownership over six months tends to look like."},
    {h:"Range in real conditions",p:"Claimed range figures rarely match daily driving range. Factor in air conditioning use, Hyderabad traffic, and mixed city and highway driving, and most owners report noticeably lower real world range than the claimed number. Plan your charging around this, not the brochure figure."},
    {h:"Charging routine",p:"Home charging through a regular socket is slow and best treated as overnight top up. For anyone without access to a dedicated home charger, planning around public charging infrastructure in your specific part of Hyderabad becomes important before you buy."},
    {h:"Running costs",p:"This is where the Nexon EV Max genuinely impresses. Running costs are a fraction of an equivalent petrol or diesel SUV, and there is no engine oil, no major service intervals tied to combustion components."},
    {h:"What to check on a used one",p:"Battery health is the single most important thing to verify on a used EV. Ask for battery health reports and check if the vehicle is still within its battery warranty period."},
    {p:"If you are considering a used EV, get the battery and charging system checked specifically, not just the usual mechanical points. Pole Position's inspection process for EVs includes this as standard."},
  ]},
  {id:6,title:"Used Car or New Car: What Actually Makes Sense in India",excerpt:"This is one of the most common questions we hear, and the honest answer is that it depends on what you are optimising for.",tag:"Guide",readTime:"5 min",date:"Jun 24, 2025",img:"https://images.unsplash.com/photo-1583267746897-2cf415887172?auto=format&fit=crop&w=900&q=80",author:"PP Team",featured:false,views:7450,body:[
    {p:"This is one of the most common questions we hear, and the honest answer is that it depends on what you are optimising for."},
    {h:"Depreciation works against new cars",p:"A new car loses a significant chunk of its value the moment it is registered, and continues to depreciate fastest in the first two to three years. A used car, particularly one that is two to four years old, has already absorbed that steep drop, which means you get more car for your money."},
    {h:"Used cars come with known history",p:"With a new car, you are paying a premium for zero history. With a good used car, especially one that has been independently inspected, you actually know more about its real world performance than you would about a brand new model fresh off the line."},
    {h:"New cars win on warranty and financing terms",p:"If having the longest possible manufacturer warranty matters to you, or if you can access very low interest new car loans, that tips things in favour of new. But these advantages have narrowed, since most reputed used car platforms now offer their own warranty cover."},
    {h:"The practical middle ground",p:"A certified used car from a trusted source gives you most of the benefits of a new car, lower price, known condition, and warranty backing, without paying the depreciation premium. That is the gap Pole Position is built to fill."},
  ]},
  {id:7,title:"Car Loan Eligibility in India: What Lenders Actually Check",excerpt:"Getting a used car loan approved is generally easier than people expect, provided you understand what lenders are actually evaluating.",tag:"Guide",readTime:"5 min",date:"Jun 25, 2025",img:"https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",author:"PP Team",featured:false,views:3890,body:[
    {p:"Getting a used car loan approved is generally easier than people expect, provided you understand what lenders are actually evaluating."},
    {h:"Income and employment stability",p:"Lenders want to see consistent income, whether salaried or self employed. Salaried applicants typically need a minimum continuous employment period with the current employer, while self employed applicants are assessed on business vintage and income tax returns."},
    {h:"Credit score",p:"Your credit score is one of the first things checked. A healthy score gets you better interest rates and faster approval. If your score is on the lower side, a higher down payment or a co-applicant can still get you approved."},
    {h:"Age of the vehicle",p:"Most lenders have a cut off on the maximum age of a used car they will finance, often factoring in the loan tenure as well. An older car may mean a shorter loan tenure or a lower loan to value ratio."},
    {h:"Down payment",p:"A larger down payment improves your approval chances and reduces your EMI burden. It also signals lower risk to the lender."},
    {h:"How Pole Position helps",p:"We work with multiple banks, so instead of approaching one lender and hoping for the best, our finance partners help match you with the loan terms you are actually eligible for, without the back and forth."},
  ]},
  {id:8,title:"RC Transfer Process in Telangana: A Step by Step Guide",excerpt:"Transferring ownership of a used car in Telangana involves a defined process through the RTO. Here is what it generally looks like.",tag:"Guide",readTime:"5 min",date:"Jun 26, 2025",img:"https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=900&q=80",author:"PP Team",featured:false,views:2980,body:[
    {p:"Transferring ownership of a used car in Telangana involves a defined process through the RTO. Here is what it generally looks like."},
    {h:"Step 1: Application submission",p:"The buyer and seller jointly submit the transfer of ownership application, along with the required documents, either through the RTO or the designated online portal for Telangana."},
    {h:"Step 2: Document verification",p:"This includes the original RC, insurance, PUC certificate, address proof of the buyer, and a signed NOC from the seller's financier if the vehicle was under loan."},
    {h:"Step 3: Physical verification, if required",p:"In certain cases, particularly inter district or inter state transfers, the vehicle may need to be physically presented for verification."},
    {h:"Step 4: Fee payment",p:"Transfer fees vary based on vehicle category and are paid at the time of application. Keep the receipt for your records."},
    {h:"Step 5: Updated RC issuance",p:"Once processed, the updated RC reflecting the new owner's details is issued, either as a physical copy by post or available for collection, depending on current RTO procedures."},
    {h:"A word of caution",p:"Timelines and exact fee structures are revised periodically, so always confirm current requirements directly with the RTO or its official portal before applying. When you buy through Pole Position, our team assists with this entire process, so you are not navigating it alone."},
  ]},
  {id:9,title:"How to Check If a Used Car Has Pending Challans",excerpt:"Pending challans on a used car can become your problem the moment ownership transfers, which is why checking this before you buy is non-negotiable.",tag:"Guide",readTime:"4 min",date:"Jun 27, 2025",img:"https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80",author:"PP Team",featured:false,views:4510,body:[
    {p:"Pending challans on a used car can become your problem the moment ownership transfers, which is why checking this before you buy is non-negotiable."},
    {h:"Why this matters",p:"Traffic violations are linked to the vehicle registration number, not just the driver at the time. If there are unpaid challans, the new owner can be held responsible for clearing them, and in some cases this can hold up the RC transfer itself."},
    {h:"How to check",p:"The vehicle's registration number can be checked through the official traffic police e-challan portal for the respective state, or through the central government's parivahan portal. Simply enter the registration number to see any pending challans linked to that vehicle."},
    {h:"What to do if you find pending challans",p:"Negotiate with the seller to clear these before the deal is finalised, or factor the amount into your final negotiated price. Either way, do not proceed with the purchase until this is settled."},
    {h:"Our process",p:"At Pole Position, every car is checked for pending challans as part of our documentation verification before it is listed, so this is one less thing you need to worry about when you buy from us."},
  ]},
  {id:10,title:"Best Second Hand Cars Under 5 Lakhs in Hyderabad",excerpt:"Five lakhs is a sweet spot in Hyderabad's used car market. Here is a practical guide to what to look for and what you can realistically expect.",tag:"Cars",readTime:"5 min",date:"Jun 28, 2025",img:"https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80",author:"PP Team",featured:false,views:9120,body:[
    {p:"Five lakhs is a sweet spot in Hyderabad's used car market. It is enough budget to get a well maintained car from a reputed segment, without stretching into premium territory."},
    {h:"What this budget typically gets you",p:"Depending on the year and kilometres driven, this range usually covers well maintained hatchbacks and entry to mid level sedans from mainstream manufacturers, sometimes even a compact SUV variant if the mileage is on the higher side."},
    {h:"Prioritise condition over features",p:"At this budget, resist the temptation to chase a car loaded with features but with a questionable maintenance history. A clean, well serviced car with fewer features will cost you less in the long run than a feature rich car with hidden issues."},
    {h:"Fuel type consideration",p:"Petrol cars in this range tend to have lower maintenance costs for low annual mileage drivers, while diesel makes more sense only if you are covering significant distance every month. CNG variants are worth considering for daily city commuters looking to cut running costs further."},
    {h:"Where Pole Position fits in",p:"Every car in this budget range on our platform has gone through the same inspection and scoring process as our premium listings. Budget should not mean compromising on quality checks, and on Pole Position, it does not have to. Browse our current listings under 5 lakhs to see inspected, scored cars within this exact range."},
  ]},
];

const TESTIMONIALS_SEED = [
  {id:1,quote:"The inspection report gave me full confidence — no surprises after purchase. The team handled the RC transfer too. Couldn't have been easier.",name:"Arjun Mehta",designation:"Software Engineer",car:"Hyundai Creta 2022",rating:5,avatar:"https://i.pravatar.cc/80?img=11"},
  {id:2,quote:"I was sceptical about buying a used car online but the PP Score and the detailed breakdown made it simple. The car was exactly as described. Great experience.",name:"Priya Nair",designation:"Marketing Manager",car:"Maruti Swift 2021",rating:5,avatar:"https://i.pravatar.cc/80?img=47"},
  {id:3,quote:"Sold my Swift in three days. The valuation was fair, the process was transparent, and I didn't have to deal with random calls from strangers. Highly recommend.",name:"Rohan Kapoor",designation:"Business Owner",car:"Sold: Maruti Swift",rating:5,avatar:""},
  {id:4,quote:"The test drive was arranged at my home — I didn't even have to go to a showroom. That alone made me choose Pole Position over everyone else.",name:"Sneha Reddy",designation:"Doctor",car:"Toyota Fortuner 2021",rating:5,avatar:"https://i.pravatar.cc/80?img=5"},
  {id:5,quote:"Their finance team connected me with a loan at a better rate than my bank offered. Bought my first car stress-free. The team was very responsive on WhatsApp.",name:"Karthik Rao",designation:"Teacher",car:"Tata Nexon EV 2022",rating:4,avatar:""},
];

const FAQ_DATA = [
  {q:"Is Pole Position only for a particular budget or car segment?",a:"No. Pole Position is budget and brand agnostic. Whether you are looking at an entry level hatchback or a well maintained sedan or SUV, every car goes through the same inspection and pricing process."},
  {q:"What is checked during the inspection process?",a:"Every car is checked across engine and transmission, electricals, body and structure, tyres, brakes, suspension, and documentation, including RC, insurance, and pending challans. Only cars that clear this process are listed."},
  {q:"Do you offer a warranty on used cars?",a:"Yes. Every car sold through Pole Position comes with a limited after sales warranty, along with free towing within Hyderabad and Secunderabad postal codes during the warranty period."},
  {q:"Can I get my car serviced after buying it from Pole Position?",a:"Yes. Our sister company, Chequered Flag, runs a professionally managed workshop using OEM replacement parts. You can book a service any time after your purchase."},
  {q:"Do you help with car loans and insurance?",a:"Yes. We have tie ups with leading banks in Hyderabad, so you can apply for financing or insurance for your used car purchase without approaching multiple lenders on your own."},
  {q:"How do I sell my car on Pole Position?",a:"You can either sell your car outright for an upfront price, or park your car with us and sell it over time at the price you want. Both options start with a free, no obligation valuation."},
  {q:"How is the price of my car decided when I want to sell?",a:"Pricing is based on real market data for similar cars, factoring in year, kilometres driven, condition, and ownership history. The valuation is transparent and explained to you upfront."},
  {q:"Which areas in Hyderabad do you operate in?",a:"We serve buyers and sellers across Hyderabad and Secunderabad, including Financial District, Gachibowli, Jubilee Hills, Kondapur, Kukatpally, Kothapet, Madhapur, Gandipet, Osman Sagar, and Vikarabad."},
  {q:"What documents do I need to buy a car from Pole Position?",a:"You will need valid ID and address proof, and a PAN card for the RC transfer process. Our team guides you through the rest of the paperwork."},
  {q:"What documents do I need to sell my car?",a:"You will need the original RC, valid insurance, PUC certificate, and a loan closure letter if applicable. If the car is registered in a different state, an NOC will also be required."},
  {q:"Is RC transfer handled by Pole Position or do I have to do it myself?",a:"Our team assists with the RC transfer process for both buyers and sellers, so you are not dealing with the RTO on your own."},
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

const BADGE = {Hot:{bg:"linear-gradient(135deg,#EF4444,#9B2B2B)",label:"Hot"},"Steal Deal":{bg:"linear-gradient(135deg,#10B981,#059669)",label:"Steal Deal"},"Most Viewed":{bg:"linear-gradient(135deg,#F59E0B,#D97706)",label:"Most Viewed"}};

// Trust badges derived purely from existing car fields — a badge only appears
// when the underlying data is present, so nothing is faked.
function carBadges(car){
  const out=[];
  if(car.scoreBreakdown&&Object.keys(car.scoreBreakdown).length>0||car.score>0) out.push({label:"PP Inspected",icon:"shield"});
  if(car.owners) out.push({label:`${car.owners===1?"1st":car.owners===2?"2nd":car.owners===3?"3rd":car.owners+"th"} Owner`,icon:"user"});
  if(typeof car.km==="number"&&car.km>0&&car.km<30000) out.push({label:"Low KM",icon:"gauge"});
  if(car.serviceHistory) out.push({label:"Service Records",icon:"file"});
  if(car.insurance) out.push({label:"Insured",icon:"check"});
  return out;
}
function TrustBadges({car,max}){
  const badges=carBadges(car);
  if(badges.length===0)return null;
  const shown=max?badges.slice(0,max):badges;
  const ic={shield:Shield,user:User,gauge:Gauge,file:FileText,check:CheckCircle};
  return(
    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
      {shown.map(b=>{const I=ic[b.icon]||CheckCircle;return(
        <span key={b.label} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 9px",borderRadius:8,background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.22)",fontSize:10.5,fontWeight:700,color:"#10B981",whiteSpace:"nowrap"}}>
          <I size={11}/>{b.label}
        </span>
      );})}
    </div>
  );
}
const TAG_COLORS = {Cars:"#9B2B2B",EV:"#059669",Bikes:"#7C3AED",Guide:"#D97706"};
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

const Card = ({children,style={}}) => <div style={{background:"#1E293B",borderRadius:16,border:"1px solid var(--pp-border)",...style}}>{children}</div>;
const Label = ({children}) => <div style={{color:"var(--pp-text3)",fontSize:11,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:6}}>{children}</div>;
const Btn = ({onClick,children,danger,full,small,w}) => <button onClick={onClick} style={{padding:small?"6px 12px":"10px 20px",borderRadius:small?8:10,border:"none",cursor:"pointer",background:danger?"rgba(220,38,38,0.15)":full?"#9B2B2B":"rgba(59,130,246,0.15)",color:danger?"#F87171":full?"#fff":"#60A5FA",fontWeight:600,fontSize:small?12:13.5,display:"flex",alignItems:"center",justifyContent:w?"center":"flex-start",gap:6,fontFamily:"Outfit,sans-serif",width:w,flexShrink:0}}>{children}</button>;
const FormInput=({label,value,onChange,type="text",ph=""})=>(
  <div>
    <Label>{label}</Label>
    <input type={type} value={value??""} onChange={e=>onChange(type==="number"?Number(e.target.value):e.target.value)} placeholder={ph}/>
  </div>
);
const FormSection=({title,subtitle,children})=>(
  <div style={{background:"var(--pp-card2)",border:"1.5px solid var(--pp-border)",borderRadius:16,padding:20,marginBottom:16}}>
    <div style={{marginBottom:16}}>
      <div style={{fontWeight:700,fontSize:14}}>{title}</div>
      {subtitle&&<div style={{color:"var(--pp-text2)",fontSize:11.5,marginTop:2}}>{subtitle}</div>}
    </div>
    {children}
  </div>
);

const SpecSection=({title,icon,rows})=>{
  if(!rows||!rows.length)return null;
  return(
    <div style={{background:"var(--pp-card)",borderRadius:14,border:"1px solid var(--pp-border)",overflow:"hidden"}}>
      <div style={{padding:"12px 18px",borderBottom:"1px solid var(--pp-border)",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:15}}>{icon}</span>
        <span style={{fontWeight:700,fontSize:14,color:"var(--pp-text)"}}>{title}</span>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse"}}><tbody>
        {rows.map(([label,value],i)=>(
          <tr key={label} style={{borderBottom:i<rows.length-1?"1px solid var(--pp-border)":"none",background:i%2===0?"transparent":"var(--pp-card2)"}}>
            <td style={{padding:"11px 18px",color:"var(--pp-text2)",fontSize:13,fontWeight:600,width:"45%"}}>{label}</td>
            <td style={{padding:"11px 18px",color:"var(--pp-text)",fontSize:13,fontWeight:700}}>{value}</td>
          </tr>
        ))}
      </tbody></table>
    </div>
  );
};


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
function Navbar({page,setPage,user,setUser,setShowLogin,isAdmin,onGoAdmin,darkMode,setDarkMode}){
  const [menuOpen,setMenuOpen]=useState(false);
  const [userMenuOpen,setUserMenuOpen]=useState(false);
  const [isMobile,setIsMobile]=useState(()=>window.innerWidth<=768);
  useEffect(()=>{
    const handler=()=>setIsMobile(window.innerWidth<=768);
    window.addEventListener("resize",handler);
    return()=>window.removeEventListener("resize",handler);
  },[]);
  const links=[["home","Home"],["browse","Browse"],["blog","Blog"]];
  return(
    <>
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:"var(--pp-nav)",backdropFilter:"blur(12px)",borderBottom:"1px solid var(--pp-border)",height:56,display:"flex",alignItems:"center",padding:"0 20px",gap:0}}>
      <button onClick={()=>setPage("home")} style={{display:"flex",alignItems:"center",gap:10,background:"none",border:"none",cursor:"pointer",marginRight:"auto"}}>
        <svg width="36" height="36" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="#fff" stroke="#D8E0EE" strokeWidth="2"/>
          <circle cx="50" cy="50" r="38" fill="#1E3A6E"/>
          <rect x="43" y="12" width="7" height="76" fill="#9B2B2B" opacity="0.85"/>
          <rect x="53" y="12" width="5" height="76" fill="#9B2B2B" opacity="0.6"/>
          <circle cx="50" cy="50" r="22" fill="#fff"/>
          <circle cx="50" cy="50" r="18" fill="#1E3A6E"/>
          <circle cx="50" cy="50" r="8" fill="#fff"/>
          <circle cx="50" cy="50" r="5" fill="#1E3A6E"/>
          <line x1="50" y1="32" x2="50" y2="42" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
          <line x1="50" y1="58" x2="50" y2="68" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
          <line x1="32" y1="50" x2="42" y2="50" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
          <line x1="58" y1="50" x2="68" y2="50" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
          <path d="M50 2 A48 48 0 0 1 98 50" fill="none" stroke="none"/>
          <text fontFamily="Outfit,sans-serif" fontSize="10" fontWeight="700" fill="#1E3A6E" textAnchor="middle">
            <textPath href="#topArc" startOffset="50%">POLE POSITION</textPath>
          </text>
          <defs>
            <path id="topArc" d="M 12 50 A 38 38 0 0 1 88 50"/>
          </defs>
          <text x="50" y="90" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="9" fontWeight="700" fill="#1E3A6E" letterSpacing="3">CARS</text>
          <text x="18" y="46" fontSize="6" fill="#1E3A6E">★</text>
          <text x="76" y="46" fontSize="6" fill="#1E3A6E">★</text>
        </svg>
        <span style={{fontWeight:900,fontSize:16,letterSpacing:"-0.04em",fontFamily:"Outfit,sans-serif",color:"var(--pp-text)"}}>Pole<span style={{color:"#9B2B2B"}}>Position</span></span>
      </button>
      {!isMobile&&(
        <>
        <div style={{display:"flex",gap:4,flex:1,justifyContent:"center"}}>
          {links.map(([p,l])=>(
            <button key={p} onClick={()=>setPage(p)} style={{padding:"7px 14px",borderRadius:9,border:"none",cursor:"pointer",background:"transparent",color:"var(--pp-text)",fontWeight:page===p?700:500,fontSize:13}}>
              {l}
            </button>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>setPage("faq")} title="FAQ" aria-label="Frequently asked questions" style={{width:36,height:36,borderRadius:"50%",border:"1.5px solid var(--pp-border2)",background:"none",cursor:"pointer",fontSize:15,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--pp-text2)",fontFamily:"Outfit,sans-serif",flexShrink:0}}>?</button>
          <button onClick={()=>setDarkMode(d=>!d)} title={darkMode?"Switch to Light":"Switch to Dark"} aria-label={darkMode?"Switch to light mode":"Switch to dark mode"} style={{width:36,height:36,borderRadius:"50%",border:"1.5px solid var(--pp-border2)",background:"none",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--pp-text)",flexShrink:0}}>{darkMode?"☀":"🌙"}</button>
          {user
            ?<div style={{position:"relative"}}>
                <button onClick={()=>setUserMenuOpen(m=>!m)} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",padding:"6px 10px",borderRadius:9}}>
                  <span style={{fontSize:13,fontWeight:600,color:"var(--pp-text)"}}>Hi, {user}</span>
                  <ChevronDown size={14} color="var(--pp-text2)"/>
                </button>
                {userMenuOpen&&(
                  <div style={{position:"absolute",top:"100%",right:0,marginTop:8,background:"var(--pp-card)",borderRadius:12,boxShadow:"0 12px 32px rgba(0,0,0,0.6)",border:"1px solid var(--pp-border)",minWidth:210,overflow:"hidden",zIndex:300}}>
                    {isAdmin&&<button onClick={onGoAdmin} style={{width:"100%",padding:"12px 16px",border:"none",background:"none",cursor:"pointer",textAlign:"left",fontSize:13.5,fontWeight:600,color:"var(--pp-text)",display:"flex",alignItems:"center",gap:9,borderBottom:"1px solid var(--pp-border)"}}><Shield size={14} color="#9B2B2B"/> View Admin Dashboard</button>}
                    <button onClick={()=>{setPage("favorites");setUserMenuOpen(false);}} style={{width:"100%",padding:"12px 16px",border:"none",background:"none",cursor:"pointer",textAlign:"left",fontSize:13.5,fontWeight:600,color:"var(--pp-text)",display:"flex",alignItems:"center",gap:9,borderBottom:"1px solid var(--pp-border)"}}><Heart size={14} color="#9B2B2B"/> My Favourites</button>
                    <button onClick={()=>{supabase.auth.signOut();setUser(null);setUserMenuOpen(false);}} style={{width:"100%",padding:"12px 16px",border:"none",background:"none",cursor:"pointer",textAlign:"left",fontSize:13.5,fontWeight:600,color:"var(--pp-text2)",display:"flex",alignItems:"center",gap:9}}><LogOut size={14}/> Sign Out</button>
                  </div>
                )}
              </div>
            :<div style={{display:"flex",alignItems:"center",gap:8}}>
                <button onClick={onGoAdmin} style={{fontSize:12.5,color:"var(--pp-text2)",fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"Outfit,sans-serif"}}>Admin</button>
                <button onClick={()=>setShowLogin(true)} style={{padding:"7px 18px",borderRadius:100,fontSize:13,fontWeight:600,background:"transparent",color:"var(--pp-text)",border:"1.5px solid var(--pp-border2)",cursor:"pointer",fontFamily:"Outfit,sans-serif"}}>Sign In</button>
              </div>
          }
        </div>
        </>
      )}
      {isMobile&&(
        <button onClick={()=>setMenuOpen(m=>!m)} aria-label={menuOpen?"Close menu":"Open menu"} aria-expanded={menuOpen} style={{background:"none",border:"none",cursor:"pointer",padding:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:"var(--pp-text)"}}>
          {menuOpen?"✕":"☰"}
        </button>
      )}
    </nav>
    {isMobile&&menuOpen&&(
      <div style={{position:"fixed",inset:0,zIndex:190,background:"rgba(0,0,0,0.7)"}} onClick={()=>setMenuOpen(false)}>
        <div style={{position:"absolute",top:56,left:0,right:0,background:"var(--pp-card)",borderBottom:"1px solid var(--pp-border)",padding:"16px 20px",display:"flex",flexDirection:"column",gap:4}} onClick={e=>e.stopPropagation()}>
          {links.map(([p,l])=>(
            <button key={p} onClick={()=>{setPage(p);setMenuOpen(false);}} style={{padding:"12px 16px",borderRadius:10,border:"none",cursor:"pointer",background:page===p?"var(--pp-chip)":"transparent",color:"var(--pp-text)",fontWeight:page===p?700:500,fontSize:15,textAlign:"left",fontFamily:"Outfit,sans-serif"}}>
              {l}
            </button>
          ))}
          <div style={{borderTop:"1px solid var(--pp-border)",marginTop:8,paddingTop:8}}>
            <button onClick={()=>{setPage("faq");setMenuOpen(false);}} style={{width:"100%",padding:"12px 16px",borderRadius:10,border:"none",background:"none",cursor:"pointer",textAlign:"left",fontSize:15,fontWeight:600,color:"var(--pp-text)",display:"flex",alignItems:"center",gap:9,fontFamily:"Outfit,sans-serif"}}>❓ FAQs</button>
            <button onClick={()=>setDarkMode(d=>!d)} style={{width:"100%",padding:"12px 16px",borderRadius:10,border:"1px solid var(--pp-border)",background:"var(--pp-card2)",cursor:"pointer",textAlign:"left",fontSize:15,fontWeight:600,color:"var(--pp-text)",display:"flex",alignItems:"center",gap:9,fontFamily:"Outfit,sans-serif",marginBottom:8}}>{darkMode?"☀ Switch to Light Mode":"🌙 Switch to Dark Mode"}</button>
            {user?(
              <>
                {isAdmin&&<button onClick={()=>{onGoAdmin();setMenuOpen(false);}} style={{width:"100%",padding:"12px 16px",borderRadius:10,border:"none",background:"none",cursor:"pointer",textAlign:"left",fontSize:15,fontWeight:600,color:"var(--pp-text)",display:"flex",alignItems:"center",gap:9,fontFamily:"Outfit,sans-serif"}}><Shield size={14} color="#9B2B2B"/> Admin Dashboard</button>}
                <button onClick={()=>{setPage("favorites");setMenuOpen(false);}} style={{width:"100%",padding:"12px 16px",borderRadius:10,border:"none",background:"none",cursor:"pointer",textAlign:"left",fontSize:15,fontWeight:600,color:"var(--pp-text)",display:"flex",alignItems:"center",gap:9,fontFamily:"Outfit,sans-serif"}}><Heart size={14} color="#9B2B2B"/> My Favourites</button>
                <button onClick={()=>{supabase.auth.signOut();setUser(null);setMenuOpen(false);}} style={{width:"100%",padding:"12px 16px",borderRadius:10,border:"none",background:"none",cursor:"pointer",textAlign:"left",fontSize:15,fontWeight:600,color:"var(--pp-text2)",display:"flex",alignItems:"center",gap:9,fontFamily:"Outfit,sans-serif"}}><LogOut size={14}/> Sign Out</button>
              </>
            ):(
              <>
                <button onClick={()=>{onGoAdmin();setMenuOpen(false);}} style={{width:"100%",padding:"12px 16px",borderRadius:10,border:"none",background:"none",cursor:"pointer",textAlign:"left",fontSize:15,fontWeight:500,color:"var(--pp-text2)",fontFamily:"Outfit,sans-serif"}}>Login as Admin</button>
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
  const submit=async()=>{
    if(!email||!pass||loading)return;
    setLoading(true);
    // Call the real auth request directly — no artificial delay stacked on top of network latency.
    try{await onSubmit({tab,email,pass,name,remember});}finally{setLoading(false);}
  };
  const inp={width:"100%",padding:"11px 14px",fontSize:14,borderRadius:12,border:"1.5px solid var(--pp-border2)",background:"var(--pp-input)",color:"var(--pp-text)"};
  return(
    <div className="glass" style={{borderRadius:24,padding:36,width:390,maxWidth:"94vw",position:"relative"}} onClick={e=>e.stopPropagation()}>
      {onClose&&<button onClick={onClose} style={{position:"absolute",top:14,right:14,background:"var(--pp-card2)",border:"none",borderRadius:"50%",width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--pp-text)"}}><X size={14}/></button>}
      <div style={{width:40,height:40,background:"#9B2B2B",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}><Car size={19} color="#fff"/></div>
      <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:21,letterSpacing:"-0.04em",marginBottom:4,color:"var(--pp-text)"}}>{mode==="admin"?"Pole Position Admin Console":(tab==="signup"?"Welcome aboard":"Welcome back")}</h2>
      <p style={{color:"var(--pp-text2)",fontSize:13,marginBottom:20}}>{mode==="admin"?"Sign in with your admin account":"Sign in to save favourites and track listings"}</p>
      {mode==="user"&&(
        <div style={{display:"flex",background:"var(--pp-card2)",borderRadius:11,padding:3,marginBottom:20}}>
          {["login","signup"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"7px 0",borderRadius:9,border:"none",cursor:"pointer",fontWeight:600,fontSize:13,background:tab===t?"var(--pp-card)":"transparent",color:tab===t?"var(--pp-text)":"var(--pp-text2)",boxShadow:tab===t?"0 2px 6px rgba(0,0,0,0.15)":"none"}}>
              {t==="login"?"Log in":"Sign up"}
            </button>
          ))}
        </div>
      )}
      {mode==="user"&&tab==="signup"&&<div style={{marginBottom:12}}><label style={{fontSize:11,fontWeight:700,color:"var(--pp-text2)",textTransform:"uppercase",display:"block",marginBottom:6}}>Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Arjun Sharma" style={inp}/></div>}
      <div style={{marginBottom:12}}><label style={{fontSize:11,fontWeight:700,color:"var(--pp-text2)",textTransform:"uppercase",display:"block",marginBottom:6}}>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com" style={inp}/></div>
      <div style={{marginBottom:12}}><label style={{fontSize:11,fontWeight:700,color:"var(--pp-text2)",textTransform:"uppercase",display:"block",marginBottom:6}}>Password</label><input value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="••••••••" style={inp}/></div>
      <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",marginBottom:18}}>
        <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} style={{width:15,height:15,accentColor:"#9B2B2B"}}/>
        <span style={{color:"var(--pp-text2)",fontSize:12.5}}>Remember me</span>
      </label>
      {error&&<p style={{color:"#9B2B2B",fontSize:12.5,marginBottom:14}}>{error}</p>}
      <button className="btn-red" style={{width:"100%",padding:"12px",borderRadius:12,fontSize:15,opacity:loading?0.7:1,cursor:loading?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={submit} disabled={loading}>
        {loading?(<><span style={{width:14,height:14,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite"}}/> Signing in…</>):(mode==="admin"?"Sign In to Admin":(tab==="login"?"Sign In":"Create Account"))}
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
        <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:20,marginBottom:8,color:"var(--pp-text)"}}>Check your email</h2>
        <p style={{color:"var(--pp-text2)",fontSize:14,lineHeight:1.6,marginBottom:24}}>We've sent a confirmation link to your email. Click it to activate your account, then come back and sign in.</p>
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

// ── CarCard (vertical spec-grid style) ───────────────────────────
const fmtL = p => `₹ ${(p/100000).toFixed(1)} Lakh`;
// ── CarCard — single source of truth for every car card on the site ──
// layout="grid" (Home, Browse, Favorites) or layout="list" (Browse list view).
// Title/subtitle are computed once here, so the make/model/variant format can
// never again drift between pages (was the root cause of the Home-vs-Browse bug).
function CarCard({car,onFav,isFav,onClick,layout="grid"}){
  const [hov,setHov]=useState(false);
  const [err,setErr]=useState(false);
  const b=car.badge?BADGE[car.badge]:null;
  const FB="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80";
  const title=`${car.make} ${car.model}${car.variant?` ${car.variant}`:""}`;
  const subtitle=`${car.year} · ${car.category||car.fuel} · ${car.fuel}`;
  const transLabel=car.transmission==="Automatic"?"Auto":car.transmission==="Manual"?"Manual":car.transmission;
  const favBtn=(size,pos)=>(
    <button onClick={e=>{e.stopPropagation();onFav(car.id);}} aria-label={isFav?"Remove from favourites":"Add to favourites"} aria-pressed={isFav}
      style={{position:"absolute",...pos,width:size,height:size,borderRadius:"50%",background:"rgba(0,0,0,0.45)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <Heart size={size===30?13:14} fill={isFav?"#E74C3C":"none"} color={isFav?"#E74C3C":"#fff"} strokeWidth={2}/>
    </button>
  );

  if(layout==="list"){
    const specs=[
      {val:fmtKm(car.km),lbl:"km"},
      {val:car.year,lbl:"Year"},
      {val:transLabel,lbl:"Gearbox"},
      {val:car.fuel,lbl:"Fuel"},
      {val:car.seats+" Seats",lbl:"Capacity"},
    ];
    return(
      <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
        style={{background:"var(--pp-card)",borderRadius:20,border:"1px solid var(--pp-border)",overflow:"hidden",cursor:"pointer",display:"flex",transition:"all 0.25s",boxShadow:hov?"0 12px 32px rgba(0,0,0,0.12)":"0 2px 8px rgba(0,0,0,0.04)",transform:hov?"translateY(-2px)":"none"}}>
        {/* Image — left side */}
        <div style={{position:"relative",width:220,flexShrink:0,background:"var(--pp-card2)"}}>
          <img src={err?FB:(car.img||FB)} onError={()=>setErr(true)} alt={title}
            style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.5s",transform:hov?"scale(1.04)":"scale(1)"}}/>
          {b&&<span style={{position:"absolute",top:10,left:10,background:b.bg,padding:"3px 10px",borderRadius:100,fontSize:9.5,fontWeight:700,color:"#fff"}}>{b.label}</span>}
          {favBtn(30,{top:10,right:10})}
        </div>
        {/* Content — right side */}
        <div style={{flex:1,padding:"20px 22px",display:"flex",flexDirection:"column",justifyContent:"space-between",minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:4}}>
            <div>
              <div style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:18,color:"var(--pp-text)",letterSpacing:"-0.02em",marginBottom:2}}>{title}</div>
              <div style={{fontSize:12,color:"var(--pp-text3)"}}>{subtitle}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:22,letterSpacing:"-0.03em",color:"var(--pp-text)"}}>{fmtL(car.price)}</div>
              <div style={{fontSize:11,color:"var(--pp-text3)"}}>Fixed price</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",margin:"14px 0"}}>
            {specs.map(s=>(
              <div key={s.lbl} style={{padding:"7px 12px",borderRadius:10,border:"1px solid var(--pp-border)",background:"var(--pp-card2)",textAlign:"center"}}>
                <div style={{fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:12,color:"var(--pp-text)"}}>{s.val}</div>
                <div style={{fontSize:10,color:"var(--pp-text3)",marginTop:1}}>{s.lbl}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:4,color:"#9B2B2B",fontSize:12,fontWeight:600,marginBottom:car.tagline?4:0}}>
                <MapPin size={12} color="#9B2B2B"/><span>Hyderabad, TG</span>
              </div>
              {car.tagline&&<p style={{fontSize:12.5,color:"var(--pp-text2)",lineHeight:1.4,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{car.tagline}</p>}
            </div>
            <button onClick={e=>{e.stopPropagation();onClick();}}
              style={{padding:"10px 20px",borderRadius:100,border:"none",background:"#9B2B2B",fontSize:13,fontWeight:700,color:"#fff",cursor:"pointer",fontFamily:"Outfit,sans-serif",flexShrink:0,whiteSpace:"nowrap"}}>
              Enquire Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default: grid layout
  const specs=[
    {val:fmtKm(car.km),lbl:"Driven"},
    {val:car.year,lbl:"Year"},
    {val:car.seats+" Seats",lbl:"Capacity"},
    {val:transLabel,lbl:"Gearbox"},
  ];
  return(
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{borderRadius:22,overflow:"hidden",cursor:"pointer",background:"var(--pp-card)",border:"1px solid var(--pp-border)",transition:"all 0.3s",transform:hov?"translateY(-5px)":"none",boxShadow:hov?"0 20px 48px rgba(0,0,0,0.14)":"0 2px 12px rgba(0,0,0,0.05)",display:"flex",flexDirection:"column"}}>
      {/* Image */}
      <div style={{position:"relative",aspectRatio:"16/9",overflow:"hidden",background:"var(--pp-card2)",flexShrink:0}}>
        <img src={err?FB:(car.img||FB)} onError={()=>setErr(true)} alt={title}
          style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.5s",transform:hov?"scale(1.05)":"scale(1)"}}/>
        {b&&<span style={{position:"absolute",top:12,left:12,background:b.bg,padding:"4px 11px",borderRadius:100,fontSize:10,fontWeight:700,color:"#fff",letterSpacing:"0.04em"}}>{b.label}</span>}
        {favBtn(32,{top:12,right:12})}
      </div>
      {/* Body */}
      <div style={{padding:"16px 16px 18px",display:"flex",flexDirection:"column",flex:1}}>
        <div style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:17,color:"var(--pp-text)",letterSpacing:"-0.02em",marginBottom:2}}>{title}</div>
        <div style={{fontSize:12,color:"var(--pp-text3)",marginBottom:14}}>{subtitle}</div>
        {/* Spec grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",border:"1px solid var(--pp-border)",borderRadius:12,overflow:"hidden",marginBottom:14}}>
          {specs.map((s,i)=>(
            <div key={s.lbl} style={{padding:"10px 6px",textAlign:"center",borderRight:i<3?"1px solid var(--pp-border)":"none"}}>
              <div style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:12,color:"var(--pp-text)",lineHeight:1.2}}>{s.val}</div>
              <div style={{fontSize:10,color:"var(--pp-text3)",marginTop:2}}>{s.lbl}</div>
            </div>
          ))}
        </div>
        {/* Location */}
        <div style={{display:"flex",alignItems:"center",gap:4,color:"#9B2B2B",fontSize:12,fontWeight:600,marginBottom:car.tagline?6:12}}>
          <MapPin size={12} color="#9B2B2B"/><span>Hyderabad, TG</span>
        </div>
        {car.tagline&&<p style={{fontSize:12.5,color:"var(--pp-text2)",lineHeight:1.5,marginBottom:14,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{car.tagline}</p>}
        {/* Price + CTA */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"auto"}}>
          <span style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:21,letterSpacing:"-0.03em",color:"var(--pp-text)"}}>{fmtL(car.price)}</span>
          <button onClick={e=>{e.stopPropagation();onClick();}}
            style={{padding:"9px 18px",borderRadius:100,border:"none",background:"#9B2B2B",fontSize:12.5,fontWeight:700,color:"#fff",cursor:"pointer",fontFamily:"Outfit,sans-serif"}}>
            Enquire Now
          </button>
        </div>
      </div>
    </div>
  );
}
// Backwards-compatible aliases — every page now renders the same component.
const BrowseCarCard=CarCard;
const HorizontalCarCard=(props)=><CarCard {...props} layout="list"/>;


// ── FaqPage ───────────────────────────────────────────────────────
function FaqPage(){
  const [open,setOpen]=useState(null);
  return(
    <div style={{paddingTop:56,minHeight:"100vh",background:"var(--pp-bg)"}}>
      <div style={{maxWidth:760,margin:"0 auto",padding:"48px 24px 72px"}}>
        <div style={{marginBottom:36}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",color:"#9B2B2B",marginBottom:10,textTransform:"uppercase"}}>Got Questions?</div>
          <h1 style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:"clamp(28px,5vw,42px)",letterSpacing:"-0.04em",color:"var(--pp-text)",marginBottom:12}}>Frequently Asked Questions</h1>
          <p style={{color:"var(--pp-text2)",fontSize:15,lineHeight:1.65}}>Everything you need to know about buying and selling with Pole Position.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {FAQ_DATA.map((item,i)=>(
            <div key={i} style={{background:"var(--pp-card)",borderRadius:14,border:"1px solid var(--pp-border)",overflow:"hidden",transition:"box-shadow 0.2s"}}>
              <button onClick={()=>setOpen(open===i?null:i)} style={{width:"100%",padding:"18px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"transparent",border:"none",cursor:"pointer",textAlign:"left",gap:12}}>
                <span style={{fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:15,color:"var(--pp-text)",lineHeight:1.35}}>{item.q}</span>
                <span style={{color:"#9B2B2B",fontWeight:700,fontSize:18,flexShrink:0,transition:"transform 0.2s",transform:open===i?"rotate(45deg)":"none"}}>+</span>
              </button>
              {open===i&&(
                <div style={{padding:"0 20px 18px",borderTop:"1px solid var(--pp-border)"}}>
                  <p style={{color:"var(--pp-text2)",fontSize:14.5,lineHeight:1.7,marginTop:14}}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{marginTop:48,background:"var(--pp-card)",borderRadius:16,border:"1px solid var(--pp-border)",padding:"28px 24px",textAlign:"center"}}>
          <div style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:17,color:"var(--pp-text)",marginBottom:8}}>Still have questions?</div>
          <p style={{color:"var(--pp-text2)",fontSize:14,marginBottom:16}}>Reach us on WhatsApp — our team responds fast.</p>
          <a href="https://wa.me/919884257043" target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"12px 28px",borderRadius:50,background:"#25D366",color:"#fff",fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:14,textDecoration:"none"}}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

// ── TestDriveModal ────────────────────────────────────────────────
function TestDriveModal({car,onClose}){
  const [form,setForm]=useState({name:"",phone:"",date:"",time:"Morning (9am–12pm)",location:"Showroom"});
  const [submitting,setSubmitting]=useState(false);
  const [done,setDone]=useState(false);
  const [err,setErr]=useState("");
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  // A valid Indian mobile number: 10 digits (optionally +91/0 prefixed).
  const phoneDigits=form.phone.replace(/\D/g,"");
  const phoneValid=/^(91)?[6-9]\d{9}$/.test(phoneDigits)||/^0?[6-9]\d{9}$/.test(phoneDigits);
  const valid=form.name.trim()&&phoneValid&&form.date;
  const submit=async()=>{
    setSubmitting(true);setErr("");
    try{
      const {error}=await supabase.from("test_drive_bookings").insert({car_id:car?.id||null,car_title:car?`${car.make} ${car.model} ${car.year}`:"General",name:form.name,phone:form.phone,preferred_date:form.date,preferred_time:form.time,location_pref:form.location});
      if(error)throw error;
    }catch(e){
      // Don't show a false "confirmed" if we failed to record the lead.
      setSubmitting(false);
      setErr("We couldn't save your booking just now. Please try again, or reach us directly on WhatsApp / call +91 98842 57043.");
      return;
    }
    const msg=encodeURIComponent(`🚗 Test Drive Booking – Pole Position\n\nName: ${form.name}\nPhone: ${form.phone}\nDate: ${form.date}\nTime: ${form.time}\nLocation: ${form.location}${car?`\nCar: ${car.make} ${car.model} ${car.year}`:""}`);
    window.open(`https://wa.me/919884257043?text=${msg}`,"_blank");
    setSubmitting(false);setDone(true);
  };
  const inpStyle={width:"100%",padding:"12px 14px",fontSize:14,borderRadius:12,border:"1.5px solid var(--pp-border2)",background:"var(--pp-input)",color:"var(--pp-text)",fontFamily:"Outfit,sans-serif",outline:"none",boxSizing:"border-box"};
  const lbl={fontSize:11,fontWeight:700,color:"var(--pp-text2)",textTransform:"uppercase",display:"block",marginBottom:5,letterSpacing:"0.06em"};
  return(
    <div style={{position:"fixed",inset:0,zIndex:700,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}} onClick={onClose}>
      <div style={{background:"var(--pp-card)",borderRadius:22,padding:"30px 28px",width:"100%",maxWidth:440,border:"1px solid var(--pp-border)",boxShadow:"0 24px 80px rgba(0,0,0,0.5)",animation:"fadeUp 0.25s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div>
            <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:22,letterSpacing:"-0.03em",color:"var(--pp-text)",margin:0}}>Book a Test Drive</h2>
            {car&&<p style={{color:"var(--pp-text2)",fontSize:13,marginTop:4}}>{car.make} {car.model} {car.year}</p>}
          </div>
          <button onClick={onClose} aria-label="Close" style={{width:34,height:34,borderRadius:"50%",border:"1px solid var(--pp-border)",background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--pp-text2)"}}><X size={16}/></button>
        </div>
        {done?(
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <CheckCircle size={48} color="#22C55E" style={{margin:"0 auto 14px"}}/>
            <div style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:18,color:"var(--pp-text)",marginBottom:8}}>Booking Confirmed!</div>
            <p style={{color:"var(--pp-text2)",fontSize:13.5}}>We've recorded your request and we'll reach out to confirm your test drive slot. If WhatsApp didn't open, you can call us at <a href="tel:+919884257043" style={{color:"#9B2B2B",fontWeight:700,textDecoration:"none"}}>+91 98842 57043</a>.</p>
            <button onClick={onClose} style={{marginTop:20,padding:"12px 32px",borderRadius:50,background:"#9B2B2B",color:"#fff",border:"none",cursor:"pointer",fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:14}}>Done</button>
          </div>
        ):(
          <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
              <div style={{gridColumn:"1/-1"}}>
                <label style={lbl}>Your Name</label>
                <input value={form.name} onChange={set("name")} placeholder="Rahul Sharma" style={inpStyle}/>
              </div>
              <div style={{gridColumn:"1/-1"}}>
                <label style={lbl}>Phone Number</label>
                <input value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" type="tel" style={inpStyle}/>
              </div>
              <div>
                <label style={lbl}>Preferred Date</label>
                <input value={form.date} onChange={set("date")} type="date" style={inpStyle}/>
              </div>
              <div>
                <label style={lbl}>Preferred Time</label>
                <select value={form.time} onChange={set("time")} style={{...inpStyle,appearance:"none",backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 12px center"}}>
                  {["Morning (9am–12pm)","Afternoon (12pm–3pm)","Evening (3pm–7pm)"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <label style={lbl}>Location Preference</label>
              <div style={{display:"flex",gap:10}}>
                {["Showroom","Home Visit"].map(loc=>(
                  <button key={loc} onClick={()=>setForm(f=>({...f,location:loc}))} style={{flex:1,padding:"11px",borderRadius:12,border:`1.5px solid ${form.location===loc?"#9B2B2B":"var(--pp-border2)"}`,background:form.location===loc?"rgba(155,43,43,0.1)":"transparent",color:form.location===loc?"#9B2B2B":"var(--pp-text2)",fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",transition:"all 0.15s"}}>
                    {loc==="Showroom"?"🏢 Showroom":"🏠 Home Visit"}
                  </button>
                ))}
              </div>
            </div>
            {form.phone.trim()&&!phoneValid&&<p style={{color:"#F59E0B",fontSize:12,marginBottom:10,marginTop:-8}}>Please enter a valid 10-digit mobile number.</p>}
            {err&&<div style={{background:"rgba(220,38,38,0.1)",border:"1px solid rgba(220,38,38,0.3)",borderRadius:12,padding:"12px 14px",marginBottom:12,fontSize:12.5,color:"#F87171",lineHeight:1.5}}>{err}</div>}
            <button disabled={!valid||submitting} onClick={submit} style={{width:"100%",padding:"14px",borderRadius:50,background:(!valid||submitting)?"var(--pp-card2)":"#9B2B2B",color:(!valid||submitting)?"var(--pp-text3)":"#fff",border:"none",cursor:(!valid||submitting)?"not-allowed":"pointer",fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:15}}>
              {submitting?"Booking…":"Confirm Booking →"}
            </button>
            <a href="tel:+919884257043" style={{display:"block",textAlign:"center",marginTop:12,fontSize:12.5,color:"var(--pp-text2)",textDecoration:"none"}}>Prefer to talk? Call us at <span style={{color:"#9B2B2B",fontWeight:700}}>+91 98842 57043</span></a>
          </>
        )}
      </div>
    </div>
  );
}

// ── HomePage ──────────────────────────────────────────────────────

// ── HomePage ─────────────────────────────────────────────────────
function HomePage({setPage,setSelectedCar,setSelectedPost,favs,toggleFav,cars,blog,testimonials}){
  const hot=useMemo(()=>cars.filter(c=>c.score>=86).slice(0,6),[cars]);
  const [isMobile,setIsMobile]=useState(()=>window.innerWidth<=768);
  useEffect(()=>{const h=()=>setIsMobile(window.innerWidth<=768);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);
  const heroImg=hot[0]?.img||"https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80";
  return(
    <div style={{paddingTop:56}}>
      {/* Hero — split layout */}
      <div style={{position:"relative",background:"var(--pp-bg)",minHeight:"100vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
        <div style={{maxWidth:1280,margin:"0 auto",padding:isMobile?"80px 24px 60px":"60px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:40,width:"100%",position:"relative",zIndex:1}}>
          {/* Left — text */}
          <div style={{flex:"0 0 auto",maxWidth:isMobile?"100%":480}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",color:"#9B2B2B",marginBottom:16,textTransform:"uppercase"}}>— Hyderabad's Premier Used Car Marketplace</div>
            <h1 style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:isMobile?"clamp(36px,10vw,54px)":"clamp(44px,5vw,72px)",color:"var(--pp-text)",letterSpacing:"-0.04em",lineHeight:1.05,marginBottom:20}}>
              Sell &amp; Buy Your Car<br/>For The Best Price.
            </h1>
            <p style={{color:"var(--pp-text2)",fontSize:15,marginBottom:32,lineHeight:1.65,maxWidth:400}}>
              Every car independently inspected and scored. No hidden surprises — transparent pricing guaranteed.
            </p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <button onClick={()=>setPage("browse")} style={{padding:"13px 28px",borderRadius:100,fontSize:14,fontWeight:700,background:"#9B2B2B",color:"#fff",border:"none",cursor:"pointer",fontFamily:"Outfit,sans-serif",display:"flex",alignItems:"center",gap:6}}>
                Buy Car <ArrowRight size={15}/>
              </button>
              <button onClick={()=>setPage("quiz")} style={{padding:"13px 28px",borderRadius:100,fontSize:14,fontWeight:700,background:"transparent",color:"var(--pp-text)",border:"1.5px solid var(--pp-border2)",cursor:"pointer",fontFamily:"Outfit,sans-serif"}}>
                Find My Match
              </button>
            </div>
            <div style={{display:"flex",gap:32,marginTop:40,paddingTop:32,borderTop:"1px solid var(--pp-border)"}}>
              {[[cars.length+"+","Cars in showroom"],["100%","Inspected"],["5★","Customer rating"]].map(([n,l])=>(
                <div key={l}>
                  <div style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:22,color:"var(--pp-text)",letterSpacing:"-0.03em"}}>{n}</div>
                  <div style={{fontSize:11,color:"var(--pp-text2)",marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Right — hero car image (desktop only) */}
          {!isMobile&&(
            <div style={{flex:"1 1 auto",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",minHeight:360}}>
              <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"110%",height:"110%",background:"radial-gradient(ellipse at center,var(--pp-primary)18 0%,transparent 70%)",pointerEvents:"none"}}/>
              <img src={heroImg} alt="Featured car" style={{width:"100%",maxWidth:560,objectFit:"contain",filter:"drop-shadow(0 24px 60px rgba(0,0,0,0.35))",position:"relative",zIndex:1,animation:"fadeIn 0.7s ease"}}/>
            </div>
          )}
        </div>
        {/* Ambient watermark */}
        <div style={{position:"absolute",bottom:-30,left:"50%",transform:"translateX(-50%)",fontSize:"clamp(80px,18vw,200px)",fontWeight:900,color:"rgba(255,255,255,0.025)",letterSpacing:"-0.05em",whiteSpace:"nowrap",fontFamily:"Outfit,sans-serif",userSelect:"none",pointerEvents:"none",lineHeight:1}}>POLE POSITION</div>
      </div>

      {/* Hot listings */}
      <div style={{padding:"72px 32px",background:"var(--pp-bg)"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32}}>
            <div>
              <div style={{color:"var(--pp-text2)",fontSize:12,fontWeight:500,marginBottom:6}}>The most</div>
              <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:"clamp(24px,4vw,36px)",letterSpacing:"-0.03em",color:"var(--pp-text)"}}>Searched Cars</h2>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setPage("browse")} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 18px",borderRadius:100,border:"1px solid var(--pp-border)",background:"transparent",cursor:"pointer",fontWeight:600,fontSize:13.5,color:"var(--pp-text2)"}}>
                View all <ArrowRight size={14}/>
              </button>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:20}}>
            {hot.map(c=><CarCard key={c.id} car={c} onFav={toggleFav} isFav={favs.includes(c.id)} onClick={()=>{setSelectedCar(c);}}/>)}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{background:"var(--pp-card)",padding:"60px 32px",borderTop:"1px solid var(--pp-border)",borderBottom:"1px solid var(--pp-border)"}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:32,textAlign:"center"}}>
          {[[cars.length+"+ Cars","In our showroom"],[cars.filter(c=>c.score>=85).length,"Scored 85+"],["100%","Inspected"]].map(([n,l])=>(
            <div key={l}>
              <div style={{color:"var(--pp-text)",fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:44,letterSpacing:"-0.04em",marginBottom:6}}>{n}</div>
              <div style={{color:"var(--pp-text2)",fontSize:14,fontWeight:500}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      {testimonials.length>0&&(
        <div style={{padding:"72px 32px",background:"var(--pp-card)",borderTop:"1px solid var(--pp-border)"}}>
          <div style={{maxWidth:1200,margin:"0 auto"}}>
            <div style={{marginBottom:40}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",color:"#9B2B2B",marginBottom:10,textTransform:"uppercase"}}>Testimonials</div>
              <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:"clamp(24px,4vw,38px)",letterSpacing:"-0.04em",color:"var(--pp-text)",lineHeight:1.15}}>Don't take our word for it.<br/>Hear it from our customers.</h2>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20}}>
              {testimonials.map((t,i)=>{
                const initials=(t.name||"").split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase();
                const avatarColors=["#1E3A6E","#9B2B2B","#059669","#7C3AED","#D97706"];
                const bg=avatarColors[i%avatarColors.length];
                return(
                <div key={t.id||i} style={{background:"var(--pp-bg)",borderRadius:18,padding:"24px",border:"1px solid var(--pp-border)",display:"flex",flexDirection:"column",gap:16}}>
                  {/* Stars */}
                  <div style={{display:"flex",gap:2}}>
                    {[1,2,3,4,5].map(s=><span key={s} style={{color:s<=(t.rating||5)?"#F59E0B":"var(--pp-border2)",fontSize:15}}>★</span>)}
                  </div>
                  {/* Quote */}
                  <p style={{fontSize:14,color:"var(--pp-text2)",lineHeight:1.75,margin:0,flex:1}}>"{t.quote}"</p>
                  {/* Divider */}
                  <div style={{borderTop:"1px solid var(--pp-border)"}}/>
                  {/* Person */}
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    {t.avatar
                      ?<img src={t.avatar} alt={t.name} style={{width:42,height:42,borderRadius:"50%",objectFit:"cover",flexShrink:0}}/>
                      :<div style={{width:42,height:42,borderRadius:"50%",background:bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:14,color:"#fff",letterSpacing:"0.02em"}}>{initials}</div>
                    }
                    <div style={{minWidth:0}}>
                      <div style={{fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:14,color:"var(--pp-text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.name}</div>
                      <div style={{fontSize:12,color:"var(--pp-text3)",marginTop:1}}>{t.designation}</div>
                      {t.car&&<div style={{fontSize:11,color:"#9B2B2B",fontWeight:600,marginTop:2,display:"flex",alignItems:"center",gap:4}}><Car size={10}/>{t.car}</div>}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Blog preview */}
      <div style={{padding:"72px 32px",background:"var(--pp-bg)"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28}}>
            <div>
              <div style={{color:"var(--pp-text2)",fontSize:12,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>From the Blog</div>
              <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:28,letterSpacing:"-0.03em",color:"var(--pp-text)"}}>Expert Reviews & Guides</h2>
            </div>
            <button onClick={()=>setPage("blog")} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 18px",borderRadius:100,border:"1px solid var(--pp-border)",background:"transparent",cursor:"pointer",fontWeight:600,fontSize:13.5,color:"var(--pp-text2)"}}>
              All articles <ArrowRight size={14}/>
            </button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20}}>
            {blog.slice(0,3).map(p=>(
              <div key={p.id} style={{background:"var(--pp-card)",borderRadius:16,overflow:"hidden",border:"1px solid var(--pp-border)",cursor:"pointer"}} onClick={()=>{setSelectedPost(p);setPage("post");}}>
                <img src={p.img} alt="" style={{width:"100%",height:180,objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
                <div style={{padding:"16px 18px"}}>
                  <span style={{background:TAG_COLORS[p.tag]+"22",color:TAG_COLORS[p.tag],fontSize:10.5,fontWeight:700,padding:"3px 9px",borderRadius:20}}>{p.tag}</span>
                  <p style={{fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:15.5,marginTop:10,letterSpacing:"-0.02em",lineHeight:1.3,color:"var(--pp-text)"}}>{p.title}</p>
                  <div style={{marginTop:10,fontSize:12,color:"var(--pp-text2)"}}>{p.author} · {p.readTime} read</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{background:"var(--pp-bg)",borderTop:"1px solid var(--pp-border)",padding:"40px 32px",textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center",marginBottom:12}}>
          <div style={{width:28,height:28,background:"#9B2B2B",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}><Car size={14} color="#fff"/></div>
          <span style={{color:"var(--pp-text)",fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:15}}>Pole<span style={{fontWeight:900}}>Position</span></span>
        </div>
        <p style={{color:"var(--pp-text3)",fontSize:13}}>© 2025 Pole Position. Hyderabad's #1 trusted used car marketplace.</p>
      </div>
    </div>
  );
}

// ── Browse filters + page ─────────────────────────────────────────
function FilterCard({title,onReset,children}){
  return(
    <div style={{background:"var(--pp-card)",borderRadius:16,border:"1px solid var(--pp-border)",padding:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <span style={{fontWeight:700,fontSize:13.5,color:"var(--pp-text)"}}>{title}</span>
        {onReset&&<button onClick={onReset} style={{color:"#9B2B2B",fontSize:12,fontWeight:600,background:"none",border:"none",cursor:"pointer"}}>Reset</button>}
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
          <button key={o} onClick={()=>onToggle(o)} style={{padding:"7px 13px",borderRadius:9,border:active?"1.5px solid #9B2B2B":"1px solid var(--pp-border)",background:active?"rgba(220,38,38,0.12)":"transparent",color:active?"#9B2B2B":"var(--pp-text2)",fontSize:12.5,fontWeight:600,cursor:"pointer"}}>
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
  const [search,setSearch]=useState("");
  const [sortBy,setSortBy]=useState("score");
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

  const q=search.trim().toLowerCase();
  const filtered=cars.filter(c=>{
    const matchSearch=q===""||`${c.make} ${c.model} ${c.variant||""} ${c.category||""} ${c.fuel||""}`.toLowerCase().includes(q);
    const matchModel=selModels.length===0||selModels.includes(c.make+"|"+c.model);
    const matchTrans=selTrans.length===0||selTrans.includes(c.transmission);
    const matchFuel=selFuel.length===0||selFuel.includes(c.fuel);
    const matchCat=selCat.length===0||selCat.includes(c.category);
    const matchPrice=c.price>=priceMin&&c.price<=priceMax;
    const matchKm=c.km>=kmMin&&c.km<=kmMax;
    const matchYear=c.year>=yearMin&&c.year<=yearMax;
    return matchSearch&&matchModel&&matchTrans&&matchFuel&&matchCat&&matchPrice&&matchKm&&matchYear;
  });

  const histBars=[30,45,60,80,95,70,85,100,75,55,65,40,50,35,25];
  const yearPct=v=>((v-floorYear)/((ceilYear-floorYear)||1))*100;

  const CAT_TABS=[["all","All"],["Hatchback","Hatchback"],["Sedan","Sedan"],["SUV","SUV"],["Electric","Electric"],["Luxury","Luxury"]];
  const [activeCat,setActiveCat]=useState("all");
  const [listView,setListView]=useState(false);
  const clearFilters=()=>{
    setSelModels([]);setSelTrans([]);setSelFuel([]);setSelCat([]);setActiveCat("all");setOpenMake(null);setSearch("");
    setPriceMin(floorPrice);setPriceMax(ceilPrice);
    setKmMin(floorKm);setKmMax(ceilKm);
    setYearMin(floorYear);setYearMax(ceilYear);
  };
  const catFiltered=activeCat==="all"?filtered:filtered.filter(c=>{
    if(activeCat==="Electric")return c.fuel==="Electric"||c.category?.toLowerCase().includes("ev");
    if(activeCat==="Luxury")return c.price>=2000000;
    return c.category===activeCat||c.category?.includes(activeCat);
  });
  const SORTS=[["score","Best PP Score"],["priceLow","Price: Low to High"],["priceHigh","Price: High to Low"],["yearNew","Year: Newest"],["kmLow","KM: Lowest"]];
  const finalFiltered=[...catFiltered].sort((a,b)=>{
    switch(sortBy){
      case "priceLow":return a.price-b.price;
      case "priceHigh":return b.price-a.price;
      case "yearNew":return b.year-a.year;
      case "kmLow":return a.km-b.km;
      default:return (b.score||0)-(a.score||0);
    }
  });

  return(
    <div style={{minHeight:"100vh",background:"var(--pp-bg)"}}>
      {/* LuxAuto-style hero header */}
      <div style={{position:"relative",paddingTop:56,background:"var(--pp-bg)",overflow:"hidden",borderBottom:"1px solid var(--pp-border)"}}>
        <div style={{maxWidth:1280,margin:"0 auto",padding:"40px 24px 32px",position:"relative",zIndex:1}}>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.15em",color:"#9B2B2B",marginBottom:10,textTransform:"uppercase"}}>Browse · {cars.length} Cars Available</div>
          <h1 style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:"clamp(28px,5vw,52px)",letterSpacing:"-0.04em",color:"var(--pp-text)",marginBottom:20,lineHeight:1.1}}>Our Collection</h1>
          {/* Search */}
          <div style={{position:"relative",maxWidth:440}}>
            <Search size={17} color="var(--pp-text3)" style={{position:"absolute",left:15,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search make, model or variant…" aria-label="Search cars"
              style={{width:"100%",padding:"13px 40px 13px 42px",fontSize:14.5,borderRadius:50,border:"1.5px solid var(--pp-border2)",background:"var(--pp-card)",color:"var(--pp-text)",fontFamily:"Outfit,sans-serif",outline:"none",boxSizing:"border-box"}}/>
            {search&&<button onClick={()=>setSearch("")} aria-label="Clear search" style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"var(--pp-chip)",border:"none",borderRadius:"50%",width:22,height:22,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--pp-text2)"}}><X size={13}/></button>}
          </div>
        </div>
        {/* Giant watermark */}
        <div style={{position:"absolute",top:"50%",right:-20,transform:"translateY(-50%)",fontSize:"clamp(60px,14vw,160px)",fontWeight:900,color:"rgba(255,255,255,0.025)",letterSpacing:"-0.05em",whiteSpace:"nowrap",fontFamily:"Outfit,sans-serif",userSelect:"none",pointerEvents:"none",lineHeight:1}}>OUR COLLECTION</div>
      </div>

      {/* Category chip bar */}
      <div style={{background:"var(--pp-card)",borderBottom:"1px solid var(--pp-border)",position:"sticky",top:56,zIndex:150}}>
        <div style={{maxWidth:1280,margin:"0 auto",padding:"0 24px",display:"flex",gap:4,overflowX:"auto",scrollbarWidth:"none"}}>
          {CAT_TABS.map(([k,l])=>(
            <button key={k} onClick={()=>setActiveCat(k)} style={{flexShrink:0,padding:"12px 18px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"Outfit,sans-serif",fontWeight:600,fontSize:13.5,color:activeCat===k?"#9B2B2B":"var(--pp-text2)",borderBottom:activeCat===k?"2.5px solid #9B2B2B":"2.5px solid transparent",transition:"all 0.15s",whiteSpace:"nowrap"}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:1280,margin:"0 auto",padding:"24px 24px 70px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
          <span style={{color:"var(--pp-text2)",fontSize:13.5,fontWeight:600}}>{finalFiltered.length} cars found</span>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {isMobile&&<button onClick={()=>setShowMobileFilters(true)} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 16px",borderRadius:100,border:"1px solid var(--pp-border)",background:"transparent",cursor:"pointer",fontWeight:600,fontSize:13,color:"var(--pp-text2)"}}><Filter size={13}/> Filters</button>}
            {/* Sort */}
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} aria-label="Sort cars" style={{padding:"8px 30px 8px 12px",borderRadius:10,border:"1px solid var(--pp-border)",background:"var(--pp-card)",color:"var(--pp-text)",fontSize:13,fontWeight:600,fontFamily:"Outfit,sans-serif",cursor:"pointer",outline:"none",appearance:"none",backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 10px center"}}>
              {SORTS.map(([k,l])=><option key={k} value={k}>{l}</option>)}
            </select>
            {/* Grid / List toggle */}
            <div style={{display:"flex",border:"1px solid var(--pp-border)",borderRadius:10,overflow:"hidden"}}>
              <button onClick={()=>setListView(false)} title="Grid view" style={{padding:"7px 12px",border:"none",cursor:"pointer",background:!listView?"var(--pp-chip)":"transparent",color:!listView?"var(--pp-text)":"var(--pp-text3)",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor"/></svg>
              </button>
              <button onClick={()=>setListView(true)} title="List view" style={{padding:"7px 12px",border:"none",borderLeft:"1px solid var(--pp-border)",cursor:"pointer",background:listView?"var(--pp-chip)":"transparent",color:listView?"var(--pp-text)":"var(--pp-text3)",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="1" y="7" width="14" height="3" rx="1.5" fill="currentColor"/><rect x="1" y="12" width="14" height="3" rx="1.5" fill="currentColor"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div style={{display:"flex",gap:26,alignItems:"flex-start"}}>
          {/* ── Filter sidebar ── */}
          {(!isMobile||showMobileFilters)&&(<div style={{width:268,flexShrink:0,display:"flex",flexDirection:"column",gap:16,...(isMobile?{position:"fixed",top:0,left:0,bottom:0,zIndex:400,width:300,background:"var(--pp-card)",overflowY:"auto",padding:"70px 16px 20px",boxShadow:"0 0 40px rgba(0,0,0,0.8)"}:{position:"sticky",top:100,maxHeight:"calc(100vh - 120px)",overflowY:"auto",paddingRight:4})}}>
          {isMobile&&showMobileFilters&&<button onClick={()=>setShowMobileFilters(false)} aria-label="Close filters" style={{position:"fixed",top:20,right:20,zIndex:401,background:"var(--pp-chip)",border:"none",borderRadius:"50%",width:34,height:34,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--pp-text)"}}><X size={16}/></button>}

            <FilterCard title="Make & Model" onReset={selModels.length>0?()=>setSelModels([]):null}>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {Object.keys(makeModelMap).map(make=>{
                  const models=[...makeModelMap[make]];
                  const isOpen=openMake===make;
                  const selectedCount=models.filter(m=>selModels.includes(make+"|"+m)).length;
                  return(
                    <div key={make} style={{border:"1px solid var(--pp-border)",borderRadius:11,overflow:"hidden"}}>
                      <button onClick={()=>setOpenMake(isOpen?null:make)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:selectedCount>0?"rgba(155,43,43,0.1)":"transparent",border:"none",cursor:"pointer"}}>
                        <span style={{fontSize:13,fontWeight:600,color:selectedCount>0?"#9B2B2B":"var(--pp-text)"}}>{make}{selectedCount>0?" ("+selectedCount+")":""}</span>
                        <ChevronDown size={14} color="var(--pp-text2)" style={{transform:isOpen?"rotate(180deg)":"none",transition:"transform 0.15s"}}/>
                      </button>
                      {isOpen&&(
                        <div style={{padding:"4px 12px 10px",display:"flex",flexDirection:"column",gap:6,background:"var(--pp-card2)"}}>
                          {models.map(model=>{
                            const key=make+"|"+model;
                            const checked=selModels.includes(key);
                            return(
                              <label key={model} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                                <input type="checkbox" checked={checked} onChange={()=>toggleIn(selModels,setSelModels,key)} style={{width:14,height:14,accentColor:"#9B2B2B"}}/>
                                <span style={{fontSize:12.5,color:"var(--pp-text2)"}}>{model}</span>
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
                {histBars.map((h,i)=><div key={i} style={{flex:1,height:h+"%",background:"rgba(220,38,38,0.5)",borderRadius:2}}/>)}
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input type="number" value={priceMin} onChange={e=>setPriceMin(Number(e.target.value)||0)} style={{width:"50%",padding:"8px 9px",borderRadius:9,border:"1px solid var(--pp-border)",background:"var(--pp-card2)",color:"var(--pp-text)",fontSize:12}}/>
                <span style={{color:"var(--pp-text3)",fontSize:12}}>–</span>
                <input type="number" value={priceMax} onChange={e=>setPriceMax(Number(e.target.value)||0)} style={{width:"50%",padding:"8px 9px",borderRadius:9,border:"1px solid var(--pp-border)",background:"var(--pp-card2)",color:"var(--pp-text)",fontSize:12}}/>
              </div>
            </FilterCard>

            <FilterCard title="Transmission" onReset={selTrans.length>0?()=>setSelTrans([]):null}>
              <ChipFilter options={allTrans} selected={selTrans} onToggle={v=>toggleIn(selTrans,setSelTrans,v)}/>
            </FilterCard>

            <FilterCard title="KM Driven" onReset={(kmMin>floorKm||kmMax<ceilKm)?()=>{setKmMin(floorKm);setKmMax(ceilKm);}:null}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input type="number" value={kmMin} onChange={e=>setKmMin(Number(e.target.value)||0)} style={{width:"50%",padding:"8px 9px",borderRadius:9,border:"1px solid var(--pp-border)",background:"var(--pp-card2)",color:"var(--pp-text)",fontSize:12}}/>
                <span style={{color:"var(--pp-text3)",fontSize:12}}>–</span>
                <input type="number" value={kmMax} onChange={e=>setKmMax(Number(e.target.value)||0)} style={{width:"50%",padding:"8px 9px",borderRadius:9,border:"1px solid var(--pp-border)",background:"var(--pp-card2)",color:"var(--pp-text)",fontSize:12}}/>
              </div>
            </FilterCard>

            <FilterCard title="Year" onReset={(yearMin>floorYear||yearMax<ceilYear)?()=>{setYearMin(floorYear);setYearMax(ceilYear);}:null}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
                <span style={{fontSize:12.5,fontWeight:700,color:"var(--pp-text)"}}>{yearMin}</span>
                <span style={{fontSize:12.5,fontWeight:700,color:"var(--pp-text)"}}>{yearMax}</span>
              </div>
              <div style={{position:"relative",height:20}}>
                <div style={{position:"absolute",top:8,left:0,right:0,height:4,background:"var(--pp-chip)",borderRadius:2}}/>
                <div style={{position:"absolute",top:8,height:4,background:"#9B2B2B",borderRadius:2,left:yearPct(yearMin)+"%",right:(100-yearPct(yearMax))+"%"}}/>
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

            {/* Mobile-only sticky footer: live result count + apply, so users don't have to close the panel to see what filtered */}
            {isMobile&&showMobileFilters&&(
              <div style={{position:"sticky",bottom:0,marginTop:"auto",paddingTop:12,display:"flex",gap:10,background:"var(--pp-card)"}}>
                <button onClick={clearFilters} style={{padding:"13px 16px",borderRadius:50,border:"1px solid var(--pp-border2)",background:"transparent",color:"var(--pp-text2)",cursor:"pointer",fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:13.5,flexShrink:0}}>Clear</button>
                <button onClick={()=>setShowMobileFilters(false)} style={{flex:1,padding:"13px",borderRadius:50,border:"none",background:"#9B2B2B",color:"#fff",cursor:"pointer",fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:14}}>
                  {finalFiltered.length===0?"No cars match":`Show ${finalFiltered.length} ${finalFiltered.length===1?"car":"cars"}`}
                </button>
              </div>
            )}

          </div>)}

          {/* ── Results ── */}
          <div style={{flex:1,minWidth:0}}>
            {listView
              ?<div style={{display:"flex",flexDirection:"column",gap:16}}>
                  {finalFiltered.map(c=><HorizontalCarCard key={c.id} car={c} onFav={toggleFav} isFav={favs.includes(c.id)} onClick={()=>{setSelectedCar(c);}}/>)}
                </div>
              :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20}}>
                  {finalFiltered.map(c=><BrowseCarCard key={c.id} car={c} onFav={toggleFav} isFav={favs.includes(c.id)} onClick={()=>{setSelectedCar(c);}}/>)}
                </div>
            }
            {finalFiltered.length===0&&(
              <div style={{textAlign:"center",padding:"80px 20px",color:"var(--pp-text3)"}}>
                <Filter size={26} style={{margin:"0 auto 14px",opacity:0.5}}/>
                <div style={{fontSize:15,fontWeight:600,color:"var(--pp-text2)",marginBottom:6}}>No cars match your filters</div>
                <p style={{fontSize:13,marginBottom:20}}>Try widening your price, year or km range, or clear everything to start over.</p>
                <button onClick={clearFilters} style={{display:"inline-flex",alignItems:"center",gap:8,padding:"11px 22px",borderRadius:50,background:"#9B2B2B",color:"#fff",border:"none",cursor:"pointer",fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:13.5}}><RotateCcw size={14}/> Clear all filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CarDetailPage ─────────────────────────────────────────────────

// ── CarDetailPage ────────────────────────────────────────────────
function CarDetailPage({car,setPage,isFav,onFav,user,setShowLogin,userEmail,darkMode,setDarkMode}){
  const [tab,setTab]=useState("overview");
  const [err,setErr]=useState(false);
  const [activeImg,setActiveImg]=useState(0);
  const [enquired,setEnquired]=useState(false);
  const [showEnquiryModal,setShowEnquiryModal]=useState(false);
  const [enquiryPhone,setEnquiryPhone]=useState("");
  const [enquirySubmitting,setEnquirySubmitting]=useState(false);
  const [showTestDrive,setShowTestDrive]=useState(false);
  const [isMobile,setIsMobile]=useState(()=>window.innerWidth<=768);
  useEffect(()=>{
    const handler=()=>setIsMobile(window.innerWidth<=768);
    window.addEventListener("resize",handler);
    return()=>window.removeEventListener("resize",handler);
  },[]);
  if(!car)return null;
  const FB="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80";
  const bd=car.scoreBreakdown||{};
  const TABS=[["overview","Overview"],["inspection","Inspection"],["who","Who's Pro"],["specs","Specs"]];
  const highlights=[
    car.owners===1?"Single owner — no fleet history":"Previously "+car.owners+" owners",
    car.km<20000?"Low mileage — "+fmtKm(car.km)+" driven":fmtKm(car.km)+" on the odometer",
    car.fuel==="Electric"?"Zero emissions, zero fuel costs":car.fuel+" engine",
    car.transmission==="Automatic"||car.transmission==="DCT"||car.transmission==="CVT"?"Automatic transmission — easy city driving":"Manual gearbox — driver's choice",
    car.insurance?"Insurance "+car.insurance:"Check insurance status",
    car.seats===7?"7-seater — great for large families":car.seats===5?"5-seater with comfortable rear bench":"Compact "+car.seats+" seats",
  ];
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
  const viewsToday=(car.id*53+121)%180+40;
  const principal=car.price*0.8,rate=0.095/12,n=60;
  const emi=Math.round(principal*rate*Math.pow(1+rate,n)/(Math.pow(1+rate,n)-1));
  const galleryImages=(car.images&&car.images.length)?car.images:[car.img||FB];
  const gallery=[...galleryImages.map(url=>({type:"image",url})),...(car.video?[{type:"video",url:car.video}]:[])];

  const openEnquiry=()=>{if(!user){setShowLogin(true);return;}setShowEnquiryModal(true);};

  /* ── MOBILE LAYOUT ── */
  if(isMobile) return(
    <div style={{background:"var(--pp-bg)",minHeight:"100vh",paddingTop:56,paddingBottom:80,overflowX:"hidden"}}>
      {/* Mobile sticky header */}
      <div style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:"var(--pp-nav)",backdropFilter:"blur(12px)",borderBottom:"1px solid var(--pp-border)",height:56,display:"flex",alignItems:"center",padding:"0 16px",gap:12}}>
        <button onClick={()=>setPage("browse")} style={{display:"flex",alignItems:"center",gap:4,background:"none",border:"none",cursor:"pointer",color:"#9B2B2B",fontWeight:700,fontSize:13,fontFamily:"Outfit,sans-serif",flexShrink:0}}>
          <ChevronLeft size={16} color="#9B2B2B"/> Back
        </button>
        <div style={{flex:1,textAlign:"center",fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:15,letterSpacing:"-0.03em",color:"var(--pp-text)"}}>
          Pole<span style={{color:"#9B2B2B"}}>Position</span>
        </div>
        <button onClick={()=>setDarkMode&&setDarkMode(d=>!d)} aria-label={darkMode?"Switch to light mode":"Switch to dark mode"} style={{width:34,height:34,borderRadius:"50%",border:"1.5px solid var(--pp-border2)",background:"none",cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--pp-text)",flexShrink:0}}>{darkMode?"☀":"🌙"}</button>
      </div>

      {/* Hero image — full width, edge to edge */}
      <div style={{position:"relative",width:"100%",aspectRatio:"4/3",background:"#0F172A",overflow:"hidden"}}>
        {gallery[activeImg]?.type==="video"?(
          <video src={gallery[activeImg].url} controls style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        ):(
          <img src={err?FB:(gallery[activeImg]?.url||FB)} onError={()=>setErr(true)} alt={car.make+" "+car.model} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        )}
        {car.badge&&<div style={{position:"absolute",top:14,left:14,background:"#E87722",padding:"5px 14px",borderRadius:100,fontSize:12,fontWeight:700,color:"var(--pp-text)"}}>{BADGE[car.badge]?.label||car.badge}</div>}
        {gallery.length>1&&(
          <>
            <button aria-label="Previous image" onClick={()=>setActiveImg(i=>(i-1+gallery.length)%gallery.length)} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",width:32,height:32,borderRadius:"50%",background:"rgba(0,0,0,0.45)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><ChevronLeft size={16} color="#fff"/></button>
            <button aria-label="Next image" onClick={()=>setActiveImg(i=>(i+1)%gallery.length)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",width:32,height:32,borderRadius:"50%",background:"rgba(0,0,0,0.45)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><ChevronRight size={16} color="#fff"/></button>
            <div style={{position:"absolute",bottom:12,right:12,background:"rgba(0,0,0,0.55)",borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:700,color:"var(--pp-text)"}}>{activeImg+1} / {gallery.length}</div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      <div style={{display:"flex",gap:8,padding:"10px 12px",overflowX:"auto",scrollbarWidth:"none",background:"var(--pp-card)"}}>
        {gallery.map((m,i)=>(
          <button key={i} onClick={()=>{setActiveImg(i);setErr(false);}} style={{width:64,height:52,borderRadius:8,overflow:"hidden",border:activeImg===i?"2px solid #9B2B2B":"2px solid var(--pp-border)",padding:0,cursor:"pointer",flexShrink:0,background:"var(--pp-card2)"}}>
            {m.type==="video"?<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--pp-card2)"}}><Play size={14} color="var(--pp-text)" fill="var(--pp-text)"/></div>:<img src={m.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
          </button>
        ))}
      </div>

      {/* Info block */}
      <div style={{padding:"14px 16px 0",background:"var(--pp-card)"}}>
        <h1 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:22,letterSpacing:"-0.03em",color:"var(--pp-text)",marginBottom:8}}>{car.make} {car.model}{car.variant?` ${car.variant}`:""}</h1>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <span style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:28,letterSpacing:"-0.03em",color:"var(--pp-text)"}}>{fmt(car.price)}</span>
          {car.tagline&&<span style={{background:"var(--pp-card2)",borderRadius:20,padding:"3px 10px",fontSize:11.5,fontWeight:600,color:"var(--pp-text2)"}}>{car.tagline}</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6,color:"var(--pp-text3)",fontSize:12.5,marginBottom:14,flexWrap:"wrap"}}>
          <Eye size={13}/><span>{viewsToday} views today</span>
          <span style={{color:"var(--pp-text3)"}}>·</span>
          <span>{fmtKm(car.km)}</span>
          <span style={{color:"var(--pp-text3)"}}>·</span>
          <span>₹{emi.toLocaleString("en-IN")}/month</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{borderTop:"1px solid var(--pp-border)",borderBottom:"1px solid var(--pp-border)",background:"var(--pp-card)",position:"sticky",top:56,zIndex:100}}>
        <div style={{display:"flex",overflowX:"auto",scrollbarWidth:"none"}}>
          {TABS.map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{flexShrink:0,padding:"13px 18px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"Outfit,sans-serif",fontWeight:600,fontSize:13.5,color:tab===id?"#9B2B2B":"var(--pp-text3)",borderBottom:tab===id?"2.5px solid #9B2B2B":"2.5px solid transparent",transition:"all 0.15s"}}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{padding:"16px 16px 20px",background:"var(--pp-bg)"}}>
        {tab==="overview"&&(
          <>
            <div style={{background:"var(--pp-card)",borderRadius:14,padding:"18px 16px",marginBottom:14,border:"1px solid var(--pp-border)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <Star size={16} color="#9B2B2B" fill="#9B2B2B"/>
                <span style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:16,color:"var(--pp-text)"}}>Why This Car?</span>
              </div>
              {highlights.map((h,i)=>(
                <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:10}}>
                  <CheckCircle size={16} color="#22C55E" style={{flexShrink:0,marginTop:2}}/>
                  <span style={{fontSize:14,color:"var(--pp-text2)",lineHeight:1.45}}>{h}</span>
                </div>
              ))}
            </div>
            <div style={{background:"var(--pp-card)",borderRadius:14,padding:"18px 16px",border:"1px solid var(--pp-border)"}}>
              <div style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:16,color:"var(--pp-text)",marginBottom:14}}>Quick Specs</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[["Year",car.year],["Fuel Type",car.fuel],["Seats",car.seats+" seats"],["Transmission",car.transmission],["Kilometres",fmtKm(car.km)],["Owners",car.owners+" owner"+(car.owners>1?"s":"")]].map(([l,v])=>(
                  <div key={l} style={{border:"1px solid var(--pp-border)",borderRadius:12,padding:"12px 14px"}}>
                    <div style={{color:"var(--pp-text3)",fontSize:11,fontWeight:600,marginBottom:4}}>{l}</div>
                    <div style={{fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:15,color:"var(--pp-text)"}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {tab!=="overview"&&tab!=="inspection"&&!user&&(
          <div style={{background:"var(--pp-card)",borderRadius:14,padding:"40px 20px",textAlign:"center",border:"1px solid var(--pp-border)"}}>
            <Lock size={28} color="var(--pp-text3)" style={{margin:"0 auto 14px"}}/>
            <div style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:17,marginBottom:8,color:"var(--pp-text)"}}>Sign in to unlock</div>
            <p style={{color:"var(--pp-text2)",fontSize:13.5,marginBottom:20}}>This section is available to registered users.</p>
            <button onClick={()=>setShowLogin(true)} style={{background:"#9B2B2B",color:"#fff",border:"none",borderRadius:50,padding:"12px 28px",fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:14,cursor:"pointer"}}>Sign In</button>
          </div>
        )}
        {tab==="inspection"&&(
          <div style={{background:"var(--pp-card)",borderRadius:14,padding:"18px 16px",border:"1px solid var(--pp-border)"}}>
            <div style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:16,marginBottom:16,color:"var(--pp-text)"}}>Inspection Report</div>
            {Object.entries(bd).map(([k,v])=>(
              <div key={k} style={{marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:13.5,fontWeight:600,color:"var(--pp-text)"}}>{scoreLabels[k]||k}</span>
                  <span style={{fontWeight:800,color:sc(v),fontSize:13}}>{v}/100</span>
                </div>
                <div style={{height:7,background:"var(--pp-card2)",borderRadius:10,overflow:"hidden"}}>
                  <div style={{height:"100%",width:v+"%",background:sc(v),borderRadius:10}}/>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==="who"&&user&&(
          <>
            <div style={{background:"var(--pp-card)",borderRadius:14,padding:"18px 16px",marginBottom:14,border:"1px solid var(--pp-border)"}}>
              <div style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:15,marginBottom:12,color:"#16A34A"}}>Great for</div>
              {forWho.map((h,i)=><div key={i} style={{display:"flex",gap:10,marginBottom:8}}><CheckCircle size={15} color="#22C55E" style={{flexShrink:0,marginTop:2}}/><span style={{fontSize:13.5,color:"var(--pp-text2)"}}>{h}</span></div>)}
            </div>
            <div style={{background:"var(--pp-card)",borderRadius:14,padding:"18px 16px",border:"1px solid var(--pp-border)"}}>
              <div style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:15,marginBottom:12,color:"#9B2B2B"}}>Maybe not for</div>
              {notForWho.map((h,i)=><div key={i} style={{display:"flex",gap:10,marginBottom:8}}><XCircle size={15} color="#EF4444" style={{flexShrink:0,marginTop:2}}/><span style={{fontSize:13.5,color:"var(--pp-text2)"}}>{h}</span></div>)}
            </div>
          </>
        )}
        {tab==="specs"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <SpecSection title="This Car" icon="🚗" rows={[
              ["Make & Model",`${car.make} ${car.model}${car.variant?" "+car.variant:""}`],
              ["Year",car.year],["Fuel",car.fuel],["Transmission",car.transmission],
              ["KM Driven",fmtKm(car.km)],["Seats",car.seats+" seater"],
              ["Owners",car.owners],["Price",fmt(car.price)],
              car.insurance&&["Insurance",car.insurance],
            ].filter(Boolean)}/>
            {car.specs&&<>
              <SpecSection title="Performance" icon="⚡" rows={[
                car.specs.engine&&["Engine",car.specs.engine],
                car.specs.maxPower&&["Max Power",car.specs.maxPower],
                car.specs.maxTorque&&["Torque",car.specs.maxTorque],
                car.specs.mileage&&["Mileage",car.specs.mileage],
                car.specs.topSpeed&&["Top Speed",car.specs.topSpeed+" kmph"],
                car.specs.acceleration&&["0–100 kmph",car.specs.acceleration+"s"],
              ].filter(Boolean)}/>
              <SpecSection title="Dimensions" icon="📐" rows={[
                car.specs.length&&["Length",car.specs.length+" mm"],
                car.specs.wheelbase&&["Wheelbase",car.specs.wheelbase+" mm"],
                car.specs.groundClearance&&["Ground Clearance",car.specs.groundClearance+" mm"],
                car.specs.bootspace&&["Boot Space",car.specs.bootspace+" L"],
                car.specs.fuelTank&&["Fuel Tank",car.specs.fuelTank+" L"],
              ].filter(Boolean)}/>
              <SpecSection title="Safety" icon="🛡️" rows={[
                car.specs.airbags&&["Airbags",car.specs.airbags],
                car.specs.abs&&["ABS",car.specs.abs],
                car.specs.ncapRating&&["NCAP",car.specs.ncapRating],
              ].filter(Boolean)}/>
              <SpecSection title="Tyres" icon="🔄" rows={[
                car.specs.frontTyres&&["Front",car.specs.frontTyres],
                car.specs.rearTyres&&["Rear",car.specs.rearTyres],
              ].filter(Boolean)}/>
            </>}
          </div>
        )}
      </div>

      {/* Fixed bottom enquire bar */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:150,padding:"12px 16px",background:"var(--pp-card)",borderTop:"1px solid var(--pp-border)",display:"flex",gap:10}}>
        <button onClick={()=>setShowTestDrive(true)} style={{flex:1,background:"var(--pp-primary)",color:"#fff",border:"none",borderRadius:50,padding:"15px",fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <Car size={16}/> Test Drive
        </button>
        <button onClick={openEnquiry} style={{flex:1,background:"#9B2B2B",color:"#fff",border:"none",borderRadius:50,padding:"15px",fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          Enquire Now
        </button>
      </div>
      {showTestDrive&&<TestDriveModal car={car} onClose={()=>setShowTestDrive(false)}/>}

      {/* Enquiry modal */}
      {showEnquiryModal&&(
        <div style={{position:"fixed",inset:0,zIndex:600,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setShowEnquiryModal(false)}>
          <div style={{background:"var(--pp-card)",borderRadius:"20px 20px 0 0",padding:"28px 20px 36px",width:"100%",border:"1px solid var(--pp-border)"}} onClick={e=>e.stopPropagation()}>
            <div style={{width:40,height:4,background:"var(--pp-border2)",borderRadius:4,margin:"0 auto 20px"}}/>
            <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:20,marginBottom:6,color:"var(--pp-text)"}}>Get in Touch</h2>
            <p style={{color:"var(--pp-text2)",fontSize:13.5,marginBottom:20}}>We'll connect you with the seller via WhatsApp.</p>
            <label style={{fontSize:11,fontWeight:700,color:"var(--pp-text2)",textTransform:"uppercase",display:"block",marginBottom:6}}>Phone Number</label>
            <input value={enquiryPhone} onChange={e=>setEnquiryPhone(e.target.value)} placeholder="+91 98765 43210" type="tel" style={{width:"100%",padding:"13px 14px",fontSize:15,borderRadius:12,border:"1.5px solid var(--pp-border2)",background:"var(--pp-input)",color:"var(--pp-text)",fontFamily:"Outfit,sans-serif",outline:"none",boxSizing:"border-box",marginBottom:16}}/>
            <button disabled={enquirySubmitting||!enquiryPhone} onClick={async()=>{
              setEnquirySubmitting(true);
              try{const {error}=await supabase.from("enquiries").insert({car_id:car.id,name:user,email:userEmail||"",phone:enquiryPhone,listing_url:window.location.href,car_title:`${car.make} ${car.model} ${car.year}`});if(error)console.warn("Enquiry insert failed:",error.message);}catch(e){console.warn("Enquiry insert failed:",e);}
              const msg=encodeURIComponent(`New Enquiry from Pole Position\n\nName: ${user}\nEmail: ${userEmail||""}\nPhone: ${enquiryPhone}\nListing: ${window.location.href}\nCar: ${car.make} ${car.model} ${car.year}`);
              window.open(`https://wa.me/919884257043?text=${msg}`,"_blank");
              setEnquirySubmitting(false);setShowEnquiryModal(false);setEnquired(true);setTimeout(()=>setEnquired(false),3000);
            }} style={{width:"100%",background:(!enquiryPhone||enquirySubmitting)?"var(--pp-card2)":"#9B2B2B",color:(!enquiryPhone||enquirySubmitting)?"var(--pp-text3)":"#fff",border:"none",borderRadius:50,padding:"15px",fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:15,cursor:(!enquiryPhone||enquirySubmitting)?"not-allowed":"pointer"}}>
              {enquirySubmitting?"Sending…":"Send Enquiry"}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  /* ── DESKTOP LAYOUT ── */
  return(
    <div style={{paddingTop:56,minHeight:"100vh",background:"var(--pp-bg)",overflowX:"hidden"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"24px 28px 0"}}>
        <button onClick={()=>setPage("browse")} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"var(--pp-text2)",fontSize:13,fontWeight:600,marginBottom:18}}>
          <ChevronLeft size={15}/> Back to results
        </button>
        <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:30,alignItems:"flex-start"}}>
          <div>
            <div style={{position:"relative",overflow:"hidden",maxHeight:600,background:"var(--pp-bg)"}}>
              {gallery[activeImg]?.type==="video"?(
                <video src={gallery[activeImg].url} controls style={{width:"100%",maxHeight:600,objectFit:"cover"}}/>
              ):(
                <img src={err?FB:(gallery[activeImg]?.url||FB)} onError={()=>setErr(true)} alt={car.make+" "+car.model} style={{width:"100%",maxHeight:600,objectFit:"cover"}}/>
              )}
              {car.badge&&<div style={{position:"absolute",top:16,left:16,background:BADGE[car.badge]?.bg||"#9B2B2B",padding:"5px 14px",borderRadius:100,fontSize:12,fontWeight:700,color:"var(--pp-text)"}}>{BADGE[car.badge]?.label||car.badge}</div>}
              {gallery.length>1&&(
                <>
                  <button aria-label="Previous image" onClick={()=>setActiveImg(i=>(i-1+gallery.length)%gallery.length)} style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",width:36,height:36,borderRadius:"50%",background:"rgba(0,0,0,0.55)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><ChevronLeft size={18} color="#fff"/></button>
                  <button aria-label="Next image" onClick={()=>setActiveImg(i=>(i+1)%gallery.length)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",width:36,height:36,borderRadius:"50%",background:"rgba(0,0,0,0.55)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><ChevronRight size={18} color="#fff"/></button>
                  <div style={{position:"absolute",bottom:14,right:14,background:"rgba(0,0,0,0.7)",borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:700,color:"var(--pp-text)"}}>{activeImg+1} / {gallery.length}</div>
                </>
              )}
            </div>
            {/* Thumbnail strip */}
            <div style={{display:"flex",gap:10,marginTop:12,overflowX:"auto",paddingBottom:4,background:"var(--pp-bg)"}}>
              {gallery.map((m,i)=>(
                <button key={i} onClick={()=>{setActiveImg(i);setErr(false);}} style={{width:80,height:60,borderRadius:8,overflow:"hidden",border:activeImg===i?"2px solid #fff":"2px solid transparent",padding:0,cursor:"pointer",flexShrink:0,opacity:activeImg===i?1:0.5,background:"var(--pp-card)"}}>
                  {m.type==="video"?<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}><Play size={15} color="#fff" fill="#fff"/></div>:<img src={m.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                </button>
              ))}
            </div>
          </div>
          {/* Info sidebar */}
          <div style={{background:"var(--pp-card)",borderRadius:16,border:"1px solid var(--pp-border)",padding:24,position:"sticky",top:76}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:6}}>
              <h1 style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:22,letterSpacing:"-0.03em",lineHeight:1.15,color:"var(--pp-text)"}}>{car.make} {car.model}{car.variant&&<span style={{color:"var(--pp-text2)",fontWeight:700}}> {car.variant}</span>}</h1>
              <div style={{display:"flex",gap:6,flexShrink:0}}>
                <button onClick={()=>onFav(car.id)} aria-label={isFav?"Remove from favourites":"Add to favourites"} aria-pressed={isFav} style={{width:34,height:34,borderRadius:10,border:"1px solid var(--pp-border)",background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Heart size={15} fill={isFav?"#9B2B2B":"none"} color={isFav?"#9B2B2B":"var(--pp-text2)"}/></button>
                <button style={{width:34,height:34,borderRadius:10,border:"1px solid var(--pp-border)",background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Share2 size={14} color="var(--pp-text2)"/></button>
              </div>
            </div>
            <p style={{color:"var(--pp-text2)",fontSize:13,marginBottom:18}}>{car.tagline}</p>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
              <span style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:28,letterSpacing:"-0.03em",color:"var(--pp-text)"}}>{fmt(car.price)}</span>
              <div style={{textAlign:"center"}}><ScoreRing score={car.score} size={52}/><div style={{color:"var(--pp-text2)",fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",marginTop:3}}>PP Score</div></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:5,color:"var(--pp-text2)",fontSize:12,marginBottom:16}}><Eye size={13}/> {viewsToday} views today</div>
            <div style={{background:"var(--pp-card2)",borderRadius:12,padding:"11px 14px",marginBottom:18,display:"flex",alignItems:"center",gap:9,border:"1px solid var(--pp-border)"}}>
              <BarChart2 size={14} color="var(--pp-text2)"/>
              <span style={{fontSize:12.5,color:"var(--pp-text2)",fontWeight:600}}>EMI from ₹{emi.toLocaleString("en-IN")}/month</span>
            </div>
            <div style={{display:"flex",gap:10,marginBottom:22}}>
              <button onClick={openEnquiry} style={{flex:1,padding:"13px",borderRadius:100,fontSize:14,background:"#9B2B2B",color:"#fff",border:"none",cursor:"pointer",fontFamily:"Outfit,sans-serif",fontWeight:700}}>{enquired?"Sent ✓":"Enquire Now →"}</button>
              <button onClick={()=>setShowTestDrive(true)} style={{flex:1,padding:"13px",borderRadius:100,fontSize:14,background:"var(--pp-primary)",color:"#fff",border:"none",cursor:"pointer",fontFamily:"Outfit,sans-serif",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Car size={14}/> Test Drive</button>
            </div>
            {showTestDrive&&<TestDriveModal car={car} onClose={()=>setShowTestDrive(false)}/>}
            <div style={{fontWeight:700,fontSize:13,marginBottom:11,color:"var(--pp-text)"}}>Inspection Snapshot</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:12}}>
              {Object.entries(bd).map(([k,v])=>(
                <div key={k} style={{display:"flex",alignItems:"center",gap:6}}>
                  {v>=80?<CheckCircle size={13} color="#10B981"/>:<AlertCircle size={13} color="#F59E0B"/>}
                  <span style={{fontSize:12,color:"var(--pp-text2)",fontWeight:600}}>{k}</span>
                </div>
              ))}
            </div>
            <button onClick={()=>setTab("inspection")} style={{background:"none",border:"none",color:"#9B2B2B",fontSize:12.5,fontWeight:700,cursor:"pointer",padding:0,display:"flex",alignItems:"center",gap:4}}>View full inspection <ChevronRight size={13}/></button>
          </div>
        </div>
      </div>
      {/* Tab bar */}
      <div style={{background:"var(--pp-bg)",borderBottom:"1px solid var(--pp-border)",position:"sticky",top:56,zIndex:100,marginTop:32}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 28px",display:"flex",gap:0}}>
          {TABS.map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{padding:"16px 22px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"Outfit,sans-serif",fontWeight:600,fontSize:14,color:tab===id?"var(--pp-text)":"var(--pp-text3)",borderBottom:tab===id?"2.5px solid var(--pp-text)":"2.5px solid transparent",transition:"all 0.15s",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:6}}>
              {label}{id!=="overview"&&id!=="inspection"&&!user&&<Lock size={11} color="var(--pp-text3)"/>}
            </button>
          ))}
        </div>
      </div>
      {/* Tab content */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"36px 28px",display:"flex",flexDirection:"column",gap:20}}>
        {tab==="overview"&&(
          <>
            <div style={{background:"var(--pp-card)",borderRadius:16,padding:"24px",border:"1px solid var(--pp-border)"}}>
              <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:18,marginBottom:16,color:"var(--pp-text)"}}>Why This Car?</h2>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {highlights.map((h,i)=>(
                  <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"12px 14px",background:"var(--pp-card2)",borderRadius:12}}>
                    <CheckCircle size={15} color="#10B981" style={{flexShrink:0,marginTop:2}}/>
                    <span style={{fontSize:13.5,color:"var(--pp-text2)",lineHeight:1.4}}>{h}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:"var(--pp-card)",borderRadius:16,padding:"24px",border:"1px solid var(--pp-border)"}}>
              <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:18,marginBottom:16,color:"var(--pp-text)"}}>Quick Specs</h2>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
                {[["Year",car.year],["Fuel",car.fuel],["Gearbox",car.transmission],["Km Driven",fmtKm(car.km)],["Seats",car.seats+" seats"],["Owners",car.owners+" owner"+(car.owners>1?"s":"")]].map(([l,v])=>(
                  <div key={l} style={{background:"var(--pp-card2)",borderRadius:12,padding:"14px",border:"1px solid var(--pp-border)"}}>
                    <div style={{color:"var(--pp-text2)",fontSize:10.5,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:5}}>{l}</div>
                    <div style={{fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:15,color:"var(--pp-text)"}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {tab!=="overview"&&tab!=="inspection"&&!user&&(
          <div style={{background:"var(--pp-card)",borderRadius:16,padding:"56px 24px",border:"1px solid var(--pp-border)",textAlign:"center"}}>
            <Shield size={22} color="var(--pp-text3)" style={{margin:"0 auto 18px"}}/>
            <h3 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:18,marginBottom:8,color:"var(--pp-text)"}}>Sign in to see the full report</h3>
            <p style={{color:"var(--pp-text2)",fontSize:13.5,marginBottom:24}}>Register to access the {TABS.find(([id])=>id===tab)?.[1]} section.</p>
            <button onClick={()=>setShowLogin(true)} className="btn-red" style={{padding:"12px 28px",borderRadius:100,fontSize:14}}>Join Now</button>
          </div>
        )}
        {tab!=="overview"&&(user||tab==="inspection")&&(
          <>
            {tab==="inspection"&&(
              <div style={{background:"var(--pp-card)",borderRadius:16,padding:"28px",border:"1px solid var(--pp-border)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
                  <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:18,color:"var(--pp-text)"}}>7-Point Inspection</h2>
                  <div style={{background:"var(--pp-card2)",borderRadius:12,padding:"8px 16px",display:"flex",alignItems:"center",gap:10,border:"1px solid var(--pp-border)"}}>
                    <ScoreRing score={car.score} size={36}/><div><div style={{color:"var(--pp-text)",fontWeight:800,fontSize:16}}>{car.score}/100</div><div style={{color:"var(--pp-text2)",fontSize:10.5,fontWeight:600}}>{car.score>=88?"Excellent":car.score>=78?"Very Good":"Good"}</div></div>
                  </div>
                </div>
                {Object.entries(bd).map(([k,v])=>(
                  <div key={k} style={{marginBottom:18}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                      <span style={{fontSize:14,fontWeight:600,color:"var(--pp-text)"}}>{scoreLabels[k]||k}</span>
                      <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:13,fontWeight:800,color:sc(v)}}>{v}</span><span style={{background:sc(v)+"22",color:sc(v),fontSize:10.5,fontWeight:700,padding:"2px 9px",borderRadius:20}}>{v>=88?"Excellent":v>=78?"Very Good":v>=68?"Good":"Fair"}</span></div>
                    </div>
                    <div style={{height:8,background:"var(--pp-chip)",borderRadius:10,overflow:"hidden"}}><div style={{height:"100%",width:v+"%",background:sc(v),borderRadius:10}}/></div>
                  </div>
                ))}
                {car.tyreWear&&(
                  <div style={{marginTop:24,paddingTop:24,borderTop:"1px solid var(--pp-border)"}}>
                    <h3 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:15,marginBottom:16,color:"var(--pp-text)"}}>Tyre Condition</h3>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
                      {[["fl","Front Left"],["fr","Front Right"],["rl","Rear Left"],["rr","Rear Right"]].map(([k,label])=>(
                        <div key={k} style={{background:"var(--pp-card2)",borderRadius:12,padding:"12px 10px",textAlign:"center",border:"1px solid var(--pp-border)"}}>
                          <div style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:16,color:tyreColor(car.tyreWear[k])}}>{car.tyreWear[k]}%</div>
                          <div style={{color:"var(--pp-text2)",fontSize:10.5,fontWeight:600,marginTop:3}}>{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {tab==="who"&&(
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                <div style={{background:"var(--pp-card)",borderRadius:16,padding:"24px",border:"1px solid var(--pp-border)"}}>
                  <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:18,marginBottom:16,display:"flex",alignItems:"center",gap:8,color:"var(--pp-text)"}}><CheckCircle size={18} color="#10B981"/> Great for</h2>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {forWho.map((item,i)=><div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"13px 16px",background:"rgba(16,185,129,0.08)",borderRadius:12,border:"1px solid rgba(16,185,129,0.2)"}}><CheckCircle size={14} color="#10B981" style={{flexShrink:0,marginTop:2}}/><span style={{fontSize:13.5,color:"var(--pp-text)",lineHeight:1.45}}>{item}</span></div>)}
                  </div>
                </div>
                <div style={{background:"var(--pp-card)",borderRadius:16,padding:"24px",border:"1px solid var(--pp-border)"}}>
                  <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:18,marginBottom:16,display:"flex",alignItems:"center",gap:8,color:"var(--pp-text)"}}><XCircle size={18} color="#EF4444"/> Maybe not for</h2>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {notForWho.map((item,i)=><div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",padding:"13px 16px",background:"rgba(239,68,68,0.08)",borderRadius:12,border:"1px solid rgba(239,68,68,0.2)"}}><XCircle size={14} color="#EF4444" style={{flexShrink:0,marginTop:2}}/><span style={{fontSize:13.5,color:"var(--pp-text)",lineHeight:1.45}}>{item}</span></div>)}
                  </div>
                </div>
              </div>
            )}
            {tab==="specs"&&(
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                {/* Listing basics — always shown */}
                <SpecSection title="This Car" icon="🚗" rows={[
                  ["Make & Model",`${car.make} ${car.model}${car.variant?" "+car.variant:""}`],
                  ["Year",car.year],["Category",car.category],
                  ["Fuel",car.fuel],["Transmission",car.transmission],
                  ["KM Driven",fmtKm(car.km)],["Seats",car.seats+" seater"],
                  ["Owners",car.owners],["Listed Price",fmt(car.price)],
                  car.insurance&&["Insurance",car.insurance],
                  car.score>0&&["PP Score",car.score+"/100"],
                ].filter(Boolean)}/>

                {/* Specs from database — shown only when available */}
                {car.specs&&<>
                  <SpecSection title="Performance" icon="⚡" rows={[
                    car.specs.engine&&["Engine",car.specs.engine],
                    car.specs.maxPower&&["Max Power",car.specs.maxPower],
                    car.specs.maxTorque&&["Max Torque",car.specs.maxTorque],
                    car.specs.mileage&&["Mileage (ARAI)",car.specs.mileage],
                    car.specs.topSpeed&&["Top Speed",car.specs.topSpeed+" kmph"],
                    car.specs.acceleration&&["0–100 kmph",car.specs.acceleration+"s"],
                    car.specs.drivetrain&&["Drivetrain",car.specs.drivetrain],
                    car.specs.emissionStandard&&["Emission Standard",car.specs.emissionStandard],
                  ].filter(Boolean)}/>
                  <SpecSection title="Dimensions & Capacity" icon="📐" rows={[
                    car.specs.length&&["Length",car.specs.length+" mm"],
                    car.specs.width&&["Width",car.specs.width+" mm"],
                    car.specs.height&&["Height",car.specs.height+" mm"],
                    car.specs.wheelbase&&["Wheelbase",car.specs.wheelbase+" mm"],
                    car.specs.groundClearance&&["Ground Clearance",car.specs.groundClearance+" mm"],
                    car.specs.bootspace&&["Boot Space",car.specs.bootspace+" L"],
                    car.specs.fuelTank&&["Fuel Tank",car.specs.fuelTank+" L"],
                  ].filter(Boolean)}/>
                  <SpecSection title="Safety" icon="🛡️" rows={[
                    car.specs.airbags&&["Airbags",car.specs.airbags],
                    car.specs.abs&&["ABS",car.specs.abs],
                    car.specs.esp&&["ESP / ESC",car.specs.esp],
                    car.specs.ncapRating&&["NCAP Rating",car.specs.ncapRating],
                  ].filter(Boolean)}/>
                  <SpecSection title="Tyres" icon="🔄" rows={[
                    car.specs.frontTyres&&["Front Tyres",car.specs.frontTyres],
                    car.specs.rearTyres&&["Rear Tyres",car.specs.rearTyres],
                  ].filter(Boolean)}/>
                  <SpecSection title="Features" icon="✨" rows={[
                    car.specs.sunroof&&["Sunroof",car.specs.sunroof],
                    car.specs.cruiseControl&&["Cruise Control",car.specs.cruiseControl],
                  ].filter(Boolean)}/>
                </>}
              </div>
            )}
          </>
        )}
      </div>
      {showEnquiryModal&&(
        <div style={{position:"fixed",inset:0,zIndex:600,background:"rgba(0,0,0,0.8)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"0 20px"}} onClick={()=>setShowEnquiryModal(false)}>
          <div style={{background:"var(--pp-card)",borderRadius:20,padding:32,width:420,maxWidth:"100%",position:"relative",border:"1px solid var(--pp-border)"}} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setShowEnquiryModal(false)} style={{position:"absolute",top:14,right:14,background:"var(--pp-chip)",border:"none",borderRadius:"50%",width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--pp-text)"}}><X size={14}/></button>
            <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:20,marginBottom:6,color:"var(--pp-text)"}}>Get in Touch</h2>
            <p style={{color:"var(--pp-text2)",fontSize:13.5,marginBottom:20}}>We'll connect you with the seller via WhatsApp.</p>
            <label style={{fontSize:11,fontWeight:700,color:"var(--pp-text2)",textTransform:"uppercase",display:"block",marginBottom:6}}>Phone Number</label>
            <input value={enquiryPhone} onChange={e=>setEnquiryPhone(e.target.value)} placeholder="+91 98765 43210" type="tel" style={{width:"100%",padding:"11px 14px",fontSize:14,borderRadius:12,border:"1px solid var(--pp-border)",background:"var(--pp-card2)",color:"var(--pp-text)",fontFamily:"Outfit,sans-serif",outline:"none",marginBottom:16}}/>
            <button disabled={enquirySubmitting||!enquiryPhone} onClick={async()=>{
              setEnquirySubmitting(true);
              try{const {error}=await supabase.from("enquiries").insert({car_id:car.id,name:user,email:userEmail||"",phone:enquiryPhone,listing_url:window.location.href,car_title:`${car.make} ${car.model} ${car.year}`});if(error)console.warn("Enquiry insert failed:",error.message);}catch(e){console.warn("Enquiry insert failed:",e);}
              const msg=encodeURIComponent(`New Enquiry from Pole Position\n\nName: ${user}\nEmail: ${userEmail||""}\nPhone: ${enquiryPhone}\nListing: ${window.location.href}\nCar: ${car.make} ${car.model} ${car.year}`);
              window.open(`https://wa.me/919884257043?text=${msg}`,"_blank");
              setEnquirySubmitting(false);setShowEnquiryModal(false);setEnquired(true);setTimeout(()=>setEnquired(false),3000);
            }} style={{width:"100%",padding:"13px",borderRadius:100,fontSize:15,background:(enquirySubmitting||!enquiryPhone)?"var(--pp-card2)":"#9B2B2B",color:(enquirySubmitting||!enquiryPhone)?"var(--pp-text3)":"#fff",border:"none",fontFamily:"Outfit,sans-serif",fontWeight:700,opacity:1,cursor:(enquirySubmitting||!enquiryPhone)?"not-allowed":"pointer"}}>
              {enquirySubmitting?"Sending…":"Send Enquiry"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
    <div style={{paddingTop:56,minHeight:"100vh",background:"var(--pp-bg)",display:"flex",alignItems:"center",justifyContent:"center",padding:"80px 24px"}}>
      <div style={{maxWidth:560,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{color:"#9B2B2B",fontSize:12,fontWeight:700,letterSpacing:"0.1em",marginBottom:12}}>STEP {step+1} OF {QUIZ.length}</div>
          <div style={{background:"var(--pp-card2)",borderRadius:100,height:4,overflow:"hidden",marginBottom:28}}>
            <div style={{height:"100%",width:((step+1)/QUIZ.length*100)+"%",background:"#9B2B2B",transition:"width 0.4s ease"}}/>
          </div>
          <h2 style={{color:"var(--pp-text)",fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:28,letterSpacing:"-0.03em"}}>{q.q}</h2>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {q.opts.map(o=>(
            <button key={o.v} onClick={()=>pick(q.key,o.v)}
              style={{padding:"18px 22px",borderRadius:14,border:"1.5px solid var(--pp-border2)",background:"var(--pp-card)",color:"var(--pp-text)",cursor:"pointer",textAlign:"left",fontSize:15,fontWeight:600,transition:"all 0.15s"}}>
              {o.l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── BlogPostPage ──────────────────────────────────────────────────
function BlogPostPage({post,setPage}){
  if(!post)return null;
  return(
    <div style={{paddingTop:56,minHeight:"100vh",background:"var(--pp-bg)"}}>
      <div style={{maxWidth:740,margin:"0 auto",padding:"40px 24px 80px"}}>
        <button onClick={()=>setPage("blog")} style={{display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"var(--pp-text2)",fontSize:13,fontWeight:600,marginBottom:28,fontFamily:"Outfit,sans-serif"}}>
          <ChevronLeft size={15}/> Back to Blog
        </button>
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{background:(TAG_COLORS[post.tag]||"#9B2B2B")+"22",color:TAG_COLORS[post.tag]||"#9B2B2B",fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:20}}>{post.tag}</span>
          <span style={{color:"var(--pp-text3)",fontSize:12}}>{post.date} · {post.readTime} read · {post.views?.toLocaleString()} views</span>
        </div>
        <h1 style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:"clamp(24px,5vw,36px)",letterSpacing:"-0.04em",lineHeight:1.15,color:"var(--pp-text)",marginBottom:12}}>{post.title}</h1>
        <div style={{fontSize:13,color:"var(--pp-text2)",marginBottom:28,fontWeight:600}}>By {post.author}</div>
        <img src={post.img} alt={post.title} style={{width:"100%",borderRadius:16,objectFit:"cover",maxHeight:360,marginBottom:36}} onError={e=>e.target.style.display="none"}/>
        <div style={{fontSize:16,lineHeight:1.8,color:"var(--pp-text2)"}}>
          {(post.body||[]).map((block,i)=>(
            <div key={i} style={{marginBottom:22}}>
              {block.h&&<div style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:18,color:"var(--pp-text)",marginBottom:8,letterSpacing:"-0.02em"}}>{block.h}</div>}
              <p style={{margin:0,color:"var(--pp-text2)",lineHeight:1.8,fontSize:15.5}}>{block.p}</p>
            </div>
          ))}
        </div>
        <div style={{marginTop:48,padding:"24px",background:"var(--pp-card)",borderRadius:16,border:"1px solid var(--pp-border)",textAlign:"center"}}>
          <div style={{fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:16,color:"var(--pp-text)",marginBottom:6}}>Ready to find your car?</div>
          <p style={{color:"var(--pp-text2)",fontSize:13.5,marginBottom:16}}>Browse our inspected and scored inventory in Hyderabad.</p>
          <button onClick={()=>setPage("browse")} style={{padding:"11px 28px",borderRadius:50,background:"#9B2B2B",color:"#fff",border:"none",cursor:"pointer",fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:14}}>Browse Cars →</button>
        </div>
      </div>
    </div>
  );
}

// ── BlogPage ──────────────────────────────────────────────────────

// ── BlogPage ─────────────────────────────────────────────────────
function BlogPage({blog,setPost,setPage}){
  const [tag,setTag]=useState("All");
  const tags=["All","Cars","EV","Bikes","Guide"];
  const featured=blog[0]||{};
  const rest=blog.slice(1).filter(p=>tag==="All"||p.tag===tag);
  return(
    <div style={{paddingTop:56,minHeight:"100vh",background:"var(--pp-bg)"}}>
      <div style={{background:"var(--pp-card)",borderBottom:"1px solid var(--pp-border)",padding:"60px 32px 50px",textAlign:"center"}}>
        <div style={{color:"var(--pp-text2)",fontSize:12,fontWeight:700,letterSpacing:"0.1em",marginBottom:12}}>POLE POSITION BLOG</div>
        <h1 style={{color:"var(--pp-text)",fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:38,letterSpacing:"-0.04em",marginBottom:14}}>Expert Reviews & Guides</h1>
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginTop:24}}>
          {tags.map(t=><button key={t} onClick={()=>setTag(t)} style={{padding:"8px 18px",borderRadius:100,border:"none",cursor:"pointer",fontWeight:600,fontSize:13,background:tag===t?"#9B2B2B":"var(--pp-chip)",color:tag===t?"#fff":"var(--pp-text)"}}>{t}</button>)}
        </div>
      </div>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"40px 24px"}}>
        {/* Featured */}
        <div onClick={()=>{setPost(featured);setPage("post");}} style={{background:"var(--pp-card)",borderRadius:16,overflow:"hidden",border:"1px solid var(--pp-border)",display:"grid",gridTemplateColumns:"1.2fr 1fr",marginBottom:36,cursor:"pointer"}}>
          <img src={featured.img} alt="" style={{width:"100%",height:340,objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
          <div style={{padding:"32px"}}>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              <span style={{background:TAG_COLORS[featured.tag]+"22",color:TAG_COLORS[featured.tag],fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20}}>{featured.tag}</span>
              <span style={{background:"rgba(217,119,6,0.15)",color:"#F59E0B",fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20}}>Featured</span>
            </div>
            <h2 style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:22,letterSpacing:"-0.03em",lineHeight:1.25,marginBottom:12,color:"var(--pp-text)"}}>{featured.title}</h2>
            <p style={{color:"var(--pp-text2)",fontSize:14,lineHeight:1.6,marginBottom:20}}>{featured.excerpt}</p>
            <div style={{fontSize:12.5,color:"var(--pp-text3)"}}>{featured.author} · {featured.date} · {featured.readTime} read · {featured.views.toLocaleString()} views</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:20}}>
          {rest.map(p=>(
            <div key={p.id} onClick={()=>{setPost(p);setPage("post");}} style={{background:"var(--pp-card)",borderRadius:16,overflow:"hidden",border:"1px solid var(--pp-border)",cursor:"pointer"}}>
              <div style={{position:"relative"}}>
                <img src={p.img} alt="" style={{width:"100%",height:190,objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
                <span style={{position:"absolute",top:12,left:12,background:TAG_COLORS[p.tag],color:"var(--pp-text)",fontSize:10.5,fontWeight:700,padding:"3px 10px",borderRadius:20}}>{p.tag}</span>
              </div>
              <div style={{padding:"16px 18px"}}>
                <p style={{fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:15,letterSpacing:"-0.02em",lineHeight:1.3,marginBottom:10,color:"var(--pp-text)"}}>{p.title}</p>
                <p style={{color:"var(--pp-text2)",fontSize:12.5,lineHeight:1.55,marginBottom:12}}>{p.excerpt}</p>
                <div style={{fontSize:11.5,color:"var(--pp-text3)"}}>{p.author} · {p.readTime} · {p.views.toLocaleString()} views</div>
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
  const CAT_COLORS={Cars:"#9B2B2B","Bikes & Scooters":"#7C3AED",EVs:"#059669","Buying Help":"#F59E0B","Ownership Diaries":"#3B82F6"};
  const visible=threads.filter(t=>cat==="All"||t.cat===cat);
  return(
    <div style={{paddingTop:56,minHeight:"100vh",background:"var(--pp-bg)"}}>
      <div style={{background:"var(--pp-card)",borderBottom:"1px solid var(--pp-border)",padding:"52px 32px 44px",textAlign:"center"}}>
        <div style={{color:"var(--pp-text2)",fontSize:12,fontWeight:700,letterSpacing:"0.1em",marginBottom:12}}>COMMUNITY</div>
        <h1 style={{color:"var(--pp-text)",fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:36,letterSpacing:"-0.04em",marginBottom:14}}>The Pit Lane Forum</h1>
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginTop:20}}>
          {cats.map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:"7px 16px",borderRadius:100,border:"none",cursor:"pointer",fontWeight:600,fontSize:12.5,background:cat===c?"#9B2B2B":"var(--pp-chip)",color:cat===c?"#fff":"var(--pp-text)"}}>{c}</button>)}
        </div>
      </div>
      <div style={{maxWidth:860,margin:"0 auto",padding:"36px 24px"}}>
        {!user&&(
          <div style={{background:"rgba(220,38,38,0.08)",border:"1px solid rgba(220,38,38,0.2)",borderRadius:14,padding:"16px 20px",marginBottom:24,display:"flex",alignItems:"center",gap:12}}>
            <AlertCircle size={16} color="#9B2B2B"/>
            <span style={{fontSize:13.5,color:"var(--pp-text2)"}}>Sign in to participate in discussions.</span>
            <button onClick={()=>setShowLogin(true)} className="btn-red" style={{marginLeft:"auto",padding:"7px 16px",borderRadius:100,fontSize:13}}>Sign In</button>
          </div>
        )}
        {visible.map(t=>(
          <div key={t.id} onClick={()=>{setThread(t);setPage("thread");}} style={{background:"var(--pp-card)",borderRadius:14,padding:"18px 20px",marginBottom:10,border:t.pinned?"1px solid rgba(220,38,38,0.3)":"1px solid rgba(255,255,255,0.07)",cursor:"pointer",display:"flex",alignItems:"center",gap:14,transition:"border-color 0.15s",borderLeft:t.pinned?"3px solid #9B2B2B":"1px solid rgba(255,255,255,0.07)"}}>
            <div style={{width:42,height:42,borderRadius:12,background:(CAT_COLORS[t.cat]||"#64748B")+"22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <MessageSquare size={17} color={CAT_COLORS[t.cat]||"#64748B"}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                {t.pinned&&<span style={{background:"rgba(220,38,38,0.15)",color:"#9B2B2B",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20}}>Pinned</span>}
                <span style={{background:(CAT_COLORS[t.cat]||"#64748B")+"22",color:CAT_COLORS[t.cat]||"#64748B",fontSize:10.5,fontWeight:700,padding:"2px 8px",borderRadius:20}}>{t.cat}</span>
              </div>
              <p style={{fontWeight:700,fontSize:14.5,marginBottom:4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"var(--pp-text)"}}>{t.title}</p>
              <div style={{color:"var(--pp-text2)",fontSize:12}}>{t.author} · {t.replies} replies · {t.views.toLocaleString()} views · {t.last}</div>
            </div>
            <ChevronRight size={16} color="var(--pp-text3)"/>
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
    <div style={{paddingTop:56,minHeight:"100vh",background:"var(--pp-bg)"}}>
      <div style={{background:"var(--pp-card)",borderBottom:"1px solid var(--pp-border)",padding:"36px 32px 30px"}}>
        <div style={{maxWidth:820,margin:"0 auto"}}>
          <button onClick={()=>setPage("forum")} style={{display:"flex",alignItems:"center",gap:6,background:"var(--pp-chip)",border:"1px solid var(--pp-border)",borderRadius:9,padding:"7px 14px",color:"var(--pp-text2)",cursor:"pointer",fontSize:13,fontWeight:600,marginBottom:16}}>
            <ChevronLeft size={14}/> Back to Forum
          </button>
          <h1 style={{color:"var(--pp-text)",fontFamily:"Outfit,sans-serif",fontWeight:800,fontSize:22,letterSpacing:"-0.03em",lineHeight:1.3}}>{t.title}</h1>
          <div style={{color:"var(--pp-text2)",fontSize:12.5,marginTop:8}}>{t.cat} · {t.replies} replies · {t.views.toLocaleString()} views</div>
        </div>
      </div>
      <div style={{maxWidth:820,margin:"0 auto",padding:"28px 24px"}}>
        {replies.map(r=>(
          <div key={r.id} style={{background:"var(--pp-card)",borderRadius:14,padding:"18px 20px",marginBottom:12,border:"1px solid var(--pp-border)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:"var(--pp-chip)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--pp-text)",fontWeight:700,fontSize:13}}>{r.author[0]}</div>
              <div>
                <div style={{fontWeight:700,fontSize:14,color:"var(--pp-text)"}}>{r.author} {r.isOP&&<span style={{background:"rgba(220,38,38,0.15)",color:"#9B2B2B",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,marginLeft:6}}>OP</span>}</div>
                <div style={{color:"var(--pp-text2)",fontSize:11.5}}>{r.time}</div>
              </div>
            </div>
            <p style={{color:"var(--pp-text2)",fontSize:14,lineHeight:1.65,marginBottom:12}}>{r.body}</p>
            <button onClick={()=>setLikes(l=>({...l,[r.id]:!l[r.id]}))} style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"1px solid var(--pp-border)",borderRadius:8,padding:"5px 12px",cursor:"pointer",color:likes[r.id]?"#9B2B2B":"var(--pp-text2)",fontSize:12.5,fontWeight:600}}>
              <ThumbsUp size={12} fill={likes[r.id]?"#9B2B2B":"none"}/> {r.likes+(likes[r.id]?1:0)}
            </button>
          </div>
        ))}
        <div style={{background:"var(--pp-card)",borderRadius:14,padding:"18px 20px",border:"1px solid var(--pp-border)",marginTop:20}}>
          <h3 style={{fontFamily:"Outfit,sans-serif",fontWeight:700,fontSize:15,marginBottom:14,color:"var(--pp-text)"}}>Add a Reply</h3>
          {user
            ?<><textarea value={reply} onChange={e=>setReply(e.target.value)} rows={4} placeholder="Share your thoughts…" style={{width:"100%",padding:"12px 14px",borderRadius:10,border:"1px solid var(--pp-border)",background:"var(--pp-card2)",color:"var(--pp-text)",fontSize:13.5,resize:"vertical",fontFamily:"inherit"}}/><button onClick={submit} className="btn-red" style={{marginTop:10,padding:"10px 22px",borderRadius:100,fontSize:13.5,display:"flex",alignItems:"center",gap:7}}><Send size={13}/> Post Reply</button></>
            :<div style={{textAlign:"center",padding:"20px 0"}}><p style={{color:"var(--pp-text2)",marginBottom:12}}>Sign in to join the discussion</p><button onClick={()=>setShowLogin(true)} className="btn-red" style={{padding:"10px 22px",borderRadius:100,fontSize:13.5}}>Sign In</button></div>
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
          <div style={{color:"var(--pp-text2)",fontSize:13}}>{car.make} {car.model} {car.year}</div>
        </div>
      </div>

      <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
        {/* Left nav */}
        <div style={{width:240,flexShrink:0,display:"flex",flexDirection:"column",gap:8}}>
          <Card style={{padding:"18px",textAlign:"center",marginBottom:4}}>
            <div style={{color:"var(--pp-text2)",fontSize:10.5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:12}}>Cumulative Score</div>
            <div style={{position:"relative",width:88,height:88,margin:"0 auto 10px"}}>
              <svg viewBox="0 0 100 100" style={{transform:"rotate(-90deg)",width:"100%",height:"100%"}}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--pp-border)" strokeWidth="9"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke={rc(cum)} strokeWidth="9" strokeDasharray={`${2*Math.PI*40}`} strokeDashoffset={`${2*Math.PI*40*(1-cum/100)}`} strokeLinecap="round" style={{transition:"all 0.3s"}}/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <span style={{color:rc(cum),fontWeight:900,fontSize:28,letterSpacing:"-0.04em",lineHeight:1}}>{cum}</span>
                <span style={{color:"var(--pp-text2)",fontSize:10}}>/100</span>
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
          <button onClick={()=>onSave(scores,cum)} style={{marginTop:6,padding:"12px",borderRadius:12,background:"#9B2B2B",border:"none",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"Outfit,sans-serif"}}>
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
                  <span style={{background:"var(--pp-card2)",color:"var(--pp-text2)",fontSize:10.5,fontWeight:700,padding:"2px 8px",borderRadius:20}}>{ac.weight}%</span>
                </div>
                <p style={{color:"var(--pp-text2)",fontSize:13}}>{ac.desc}</p>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{color:rc(scores[active]),fontWeight:900,fontSize:48,letterSpacing:"-0.04em",lineHeight:1,transition:"color 0.3s"}}>{scores[active]}</div>
                <div style={{color:"var(--pp-text2)",fontSize:11}}>/ 100</div>
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
            return <button onClick={()=>setActive(next.key)} style={{padding:"11px 18px",borderRadius:12,border:"1.5px solid var(--pp-border)",background:"var(--pp-card2)",color:"var(--pp-text3)",cursor:"pointer",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"space-between",fontFamily:"Outfit,sans-serif"}}>
              <span style={{color:"var(--pp-text2)"}}>Next →</span><div style={{display:"flex",alignItems:"center",gap:6}}><NIcon size={13}/> {next.label} <ChevronRight size={13}/></div>
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
    {l:"Avg Score",v:cars.length?Math.round(cars.reduce((a,c)=>a+c.score,0)/cars.length):0,icon:Award,c:"#9B2B2B"},
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
            <div style={{color:"var(--pp-text3)",fontSize:13}}>{s.l}</div>
          </Card>
        );})}
      </div>
      <Card>
        <div style={{padding:"16px 22px",borderBottom:"1px solid var(--pp-border)",fontWeight:700,fontSize:15}}>Recent Listings</div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:"1px solid var(--pp-border)"}}>{["Car","Year","Price","Score"].map(h=><th key={h} style={{padding:"11px 18px",textAlign:"left",color:"var(--pp-text2)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>{h}</th>)}</tr></thead>
          <tbody>{cars.slice(0,6).map(c=><tr key={c.id} style={{borderBottom:"1px solid var(--pp-border)"}}>
            <td style={{padding:"12px 18px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><img src={c.img} alt="" style={{width:48,height:32,objectFit:"cover",borderRadius:7}} onError={e=>e.target.style.display="none"}/><span style={{fontWeight:600,fontSize:13.5}}>{c.make} {c.model}</span></div></td>
            <td style={{padding:"12px 18px",color:"var(--pp-text3)",fontSize:13}}>{c.year}</td>
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
  const empty={make:"",model:"",variant:"",year:2022,fuel:"Petrol",transmission:"Automatic",km:0,seats:5,price:0,score:0,badge:null,img:"",images:[],video:null,category:"Sedan",carClass:"Economy",tagline:"",description:"",owners:1,status:"published",serviceHistory:null,tyreMake:"MRF",tyreModel:"",tyreSize:"",tyreWear:{fl:20,fr:20,rl:20,rr:20},scoreBreakdown:{},specs:null};
  const [edit,setEdit]=useState(null);
  const [listingMode,setListingMode]=useState("manual");
  const [autoSel,setAutoSel]=useState({make:"",model:"",year:2022,version:""});
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
  const [specLoading,setSpecLoading]=useState(false);

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

  const normTx=t=>{if(!t)return"Automatic";t=String(t);if(t.includes("CVT"))return"CVT";if(t.includes("DCT"))return"DCT";if(t.includes("AMT"))return"AMT";if(/auto/i.test(t))return"Automatic";return"Manual";};
  const normFuel=f=>{if(!f)return"Petrol";if(/diesel/i.test(f))return"Diesel";if(/electric|ev/i.test(f))return"Electric";if(/cng/i.test(f))return"CNG";if(/hybrid/i.test(f))return"Hybrid";return"Petrol";};

  const fetchAndApplySpecs=async(make,model,year,variant)=>{
    if(!make||!model||!variant)return;
    setSpecLoading(true);
    try{
      // Try Supabase car_specs first (populated when Excel is imported)
      const {data:dbSpec}=await supabase.from("car_specs")
        .select("*").eq("make",make).eq("model",model).eq("version",variant).maybeSingle();
      if(dbSpec){
        const specs={
          engine:dbSpec.key_engine,fuel:normFuel(dbSpec.key_fuel_type),
          transmission:normTx(dbSpec.key_transmission),seats:parseInt(dbSpec.key_seating_capacity)||5,
          mileage:dbSpec.key_mileage_arai,maxPower:dbSpec.max_power,maxTorque:dbSpec.max_torque,
          topSpeed:dbSpec.top_speed,acceleration:dbSpec.acceleration_0_100,
          length:dbSpec.length_mm,width:dbSpec.width_mm,height:dbSpec.height_mm,
          wheelbase:dbSpec.wheelbase_mm,groundClearance:dbSpec.ground_clearance,
          bootspace:dbSpec.bootspace,fuelTank:dbSpec.fuel_tank_capacity,
          frontTyres:dbSpec.front_tyres,rearTyres:dbSpec.rear_tyres,
          airbags:dbSpec.airbags,abs:dbSpec.abs,esp:dbSpec.esp,
          ncapRating:dbSpec.ncap_rating,sunroof:dbSpec.sunroof,
          cruiseControl:dbSpec.cruise_control,drivetrain:dbSpec.drivetrain,
          emissionStandard:dbSpec.emission_standard,bodyStyle:dbSpec.body_style,
        };
        const bodyToCategory={Sedan:"Sedan",Hatchback:"Hatchback",SUV:"Compact SUV","Compact SUV":"Compact SUV","Full Size SUV":"Full-size SUV",MUV:"MUV",MPV:"MUV",Electric:"Electric"};
        const luxuryMakes=["BMW","Mercedes-Benz","Audi","Volvo","Jaguar","Land Rover","Porsche","Lexus"];
        const premiumMakes=["Kia","Volkswagen","Skoda","MG","Jeep","Toyota","Nissan"];
        setForm(f=>({...f,make,model,variant,year,
          fuel:specs.fuel,transmission:specs.transmission,seats:specs.seats,
          tyreSize:specs.frontTyres||f.tyreSize,
          category:bodyToCategory[specs.bodyStyle]||MODEL_CATEGORY[model]||f.category,
          carClass:luxuryMakes.includes(make)?"Luxury":premiumMakes.includes(make)?"Premium":"Economy",
          specs,
        }));
        setSpecLoading(false);return;
      }
      // Fall back to Claude API
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1200,messages:[{role:"user",content:`Return ONLY a valid JSON object (no markdown, no explanation) with full specs for the ${year} ${make} ${model} ${variant} sold in India. Use these exact keys: fuel (Petrol/Diesel/Electric/CNG/Hybrid), transmission (Manual/Automatic/AMT/CVT/DCT), seats (integer), engine (e.g. "1498 cc"), maxPower (e.g. "120 bhp @ 6000 rpm"), maxTorque (e.g. "145 Nm @ 4400 rpm"), mileage (e.g. "18.4 kmpl"), topSpeed (integer kmph), acceleration (0-100 seconds as decimal), length (mm integer), width (mm integer), height (mm integer), wheelbase (mm integer), groundClearance (mm integer), bootspace (litres integer), fuelTank (litres integer), frontTyres (e.g. "215/55 R16"), rearTyres, airbags (integer), abs ("Yes"/"No"), esp ("Yes"/"No"), ncapRating (e.g. "5 Star" or null), sunroof ("Yes"/"No"), cruiseControl ("Yes"/"No"), drivetrain ("FWD"/"RWD"/"AWD"/"4WD"), emissionStandard (e.g. "BS6"), bodyStyle (Sedan/Hatchback/SUV/MUV/Coupe).`}]})});
      const d=await res.json();
      const text=d.content?.[0]?.text||"{}";
      const specs=JSON.parse(text.replace(/```json|```/g,"").trim());
      const bodyToCategory={Sedan:"Sedan",Hatchback:"Hatchback",SUV:"Compact SUV",MUV:"MUV"};
      const luxuryMakes=["BMW","Mercedes-Benz","Audi","Volvo","Jaguar","Land Rover","Porsche","Lexus"];
      const premiumMakes=["Kia","Volkswagen","Skoda","MG","Jeep","Toyota","Nissan"];
      setForm(f=>({...f,make,model,variant,year,
        fuel:normFuel(specs.fuel)||f.fuel,transmission:normTx(specs.transmission)||f.transmission,
        seats:specs.seats||f.seats,tyreSize:specs.frontTyres||f.tyreSize,
        category:bodyToCategory[specs.bodyStyle]||MODEL_CATEGORY[model]||f.category,
        carClass:luxuryMakes.includes(make)?"Luxury":premiumMakes.includes(make)?"Premium":"Economy",
        specs,
      }));
    }catch(e){
      // Silent fail — user can still fill manually
    }
    setSpecLoading(false);
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
      score_breakdown:payload.scoreBreakdown||null,tyre_wear:payload.tyreWear||null,specs:payload.specs||null,
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
        <button onClick={()=>setPreviewing(false)} style={{display:"flex",alignItems:"center",gap:7,background:"var(--pp-chip)",border:"none",borderRadius:9,padding:"9px 16px",color:"#fff",cursor:"pointer",fontWeight:600,fontSize:13.5,fontFamily:"Outfit,sans-serif"}}>
          <ChevronLeft size={14}/> Back to Editing
        </button>
        <span style={{color:"var(--pp-text2)",fontSize:12.5}}>Preview — exactly what buyers will see</span>
      </div>
      <CarDetailPage car={buildPreviewCar()} setPage={()=>{}} isFav={false} onFav={()=>{}} user="Preview" setShowLogin={()=>{}}/>
    </div>
  );

  // Automated tab — Supabase-backed state
  const [autoMakes,setAutoMakes]=useState([]);
  const [autoModels,setAutoModels]=useState([]);
  const [autoVersions,setAutoVersions]=useState([]);
  const [autoSelected,setAutoSelected]=useState(null);
  const [autoLoading,setAutoLoading]=useState("");

  // Load makes once when switching to automated tab
  useEffect(()=>{
    if(listingMode!=="automated"||autoMakes.length)return;
    setAutoLoading("makes");
    supabase.from("car_specs").select("make").then(({data,error})=>{
      if(!error&&data){
        const unique=[...new Set(data.map(r=>r.make))].sort();
        setAutoMakes(unique);
      }
      setAutoLoading("");
    });
  },[listingMode]);

  // Load models when make changes
  useEffect(()=>{
    if(!autoSel.make)return;
    setAutoModels([]);setAutoVersions([]);setAutoSelected(null);
    setAutoSel(s=>({...s,model:"",version:""}));
    setAutoLoading("models");
    supabase.from("car_specs").select("model").eq("make",autoSel.make).then(({data,error})=>{
      if(!error&&data){
        const unique=[...new Set(data.map(r=>r.model))].sort();
        setAutoModels(unique);
      }
      setAutoLoading("");
    });
  },[autoSel.make]);

  // Load versions when model changes
  useEffect(()=>{
    if(!autoSel.make||!autoSel.model)return;
    setAutoVersions([]);setAutoSelected(null);
    setAutoSel(s=>({...s,version:""}));
    setAutoLoading("versions");
    supabase.from("car_specs")
      .select("version_id,version,key_fuel_type,key_transmission,key_seating_capacity,body_style,key_engine,key_mileage_arai,max_power,max_torque,top_speed,acceleration_0_100,drivetrain,emission_standard,engine_detail,engine_type,front_tyres,rear_tyres,airbags,abs,esp,sunroof,ncap_rating,length_mm,width_mm,height_mm,wheelbase_mm,ground_clearance,kerb_weight,bootspace,fuel_tank_capacity,description,image_url,onroad_hyderabad,ex_showroom_price")
      .eq("make",autoSel.make).eq("model",autoSel.model)
      .then(({data,error})=>{
        if(!error&&data)setAutoVersions(data);
        setAutoLoading("");
      });
  },[autoSel.model]);

  // Select a specific version — auto-apply specs immediately
  useEffect(()=>{
    if(!autoSel.version){setAutoSelected(null);return;}
    const found=autoVersions.find(r=>r.version===autoSel.version)||null;
    setAutoSelected(found);
    if(found) fetchAndApplySpecs(autoSel.make,autoSel.model,autoSel.year,autoSel.version);
  },[autoSel.version,autoVersions]);

  const normalizeTransmission=t=>{
    if(!t)return"Automatic";
    if(t.includes("CVT"))return"CVT";
    if(t.includes("DCT"))return"DCT";
    if(t.includes("AMT"))return"AMT";
    if(t.toLowerCase().includes("auto"))return"Automatic";
    return"Manual";
  };
  const normalizeFuel=f=>{
    if(!f)return"Petrol";
    if(f.includes("Diesel"))return"Diesel";
    if(f.includes("Electric"))return"Electric";
    if(f.includes("CNG"))return"CNG";
    if(f.includes("Hybrid"))return"Hybrid";
    return"Petrol";
  };

  const applyAutoSpec=()=>{
    if(!autoSelected)return;
    const bodyToCategory={Sedan:"Sedan",Hatchback:"Hatchback",SUV:"Compact SUV","Compact SUV":"Compact SUV","Full Size SUV":"Full-size SUV",MUV:"MUV",MPV:"MUV",Electric:"Electric",Coupe:"Sedan",Convertible:"Sedan"};
    const luxuryMakes=["BMW","Mercedes-Benz","Audi","Volvo","Jaguar","Land Rover","Porsche","Lexus","Bentley","Ferrari","Lamborghini"];
    const premiumMakes=["Kia","Volkswagen","Skoda","MG","Jeep","Toyota","Nissan"];
    setForm(f=>({...f,
      make:autoSel.make,
      model:autoSel.model,
      variant:autoSelected.version||"",
      year:autoSel.year,
      fuel:normalizeFuel(autoSelected.key_fuel_type),
      transmission:normalizeTransmission(autoSelected.key_transmission),
      seats:parseInt(autoSelected.key_seating_capacity)||5,
      category:bodyToCategory[autoSelected.body_style]||"Sedan",
      carClass:luxuryMakes.includes(autoSel.make)?"Luxury":premiumMakes.includes(autoSel.make)?"Premium":"Economy",
      description:[
        autoSelected.engine_detail&&`Engine: ${autoSelected.engine_detail}`,
        autoSelected.key_mileage_arai&&`Mileage: ${autoSelected.key_mileage_arai}`,
        autoSelected.max_power&&`Max Power: ${autoSelected.max_power}`,
        autoSelected.max_torque&&`Max Torque: ${autoSelected.max_torque}`,
        autoSelected.top_speed&&`Top Speed: ${autoSelected.top_speed} kmph`,
        autoSelected.acceleration_0_100&&`0-100 kmph: ${autoSelected.acceleration_0_100}s`,
        autoSelected.drivetrain&&`Drivetrain: ${autoSelected.drivetrain}`,
        autoSelected.airbags&&`Airbags: ${autoSelected.airbags}`,
        autoSelected.ncap_rating&&`NCAP: ${autoSelected.ncap_rating}`,
      ].filter(Boolean).join(" · ")||f.description,
    }));
  };

  if(edit!==null)return(
    <div>
      <div style={{display:"flex",flexWrap:"wrap",alignItems:"center",gap:10,marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
          <Btn onClick={()=>setEdit(null)}><ChevronLeft size={14}/> Back</Btn>
          <h2 style={{fontWeight:800,fontSize:18,letterSpacing:"-0.03em",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{form.id?`Edit — ${form.make} ${form.model}`:"Add New Listing"}</h2>
        </div>
        {!form.id&&(
          <div style={{display:"flex",background:"var(--pp-card2)",borderRadius:10,padding:3,gap:2,border:"1px solid var(--pp-border)"}}>
            {["manual","automated"].map(m=>(
              <button key={m} onClick={()=>setListingMode(m)} style={{padding:"7px 16px",borderRadius:8,border:"none",background:listingMode===m?"#9B2B2B":"transparent",color:listingMode===m?"#fff":"var(--pp-text2)",fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"Outfit,sans-serif",textTransform:"capitalize",transition:"all 0.15s"}}>{m}</button>
            ))}
          </div>
        )}
      </div>

      {/* Automated tab */}
      {listingMode==="automated"&&!form.id&&(
        <div>
          <FormSection title="Select Vehicle" subtitle="Pick make, model, year and variant — all specs load from the database automatically">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12}}>
              <label style={{display:"flex",flexDirection:"column",gap:5}}>
                <span style={{fontSize:11.5,fontWeight:600,color:"var(--pp-text2)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Make {autoLoading==="makes"&&<span style={{color:"#60A5FA",fontWeight:400}}>loading…</span>}</span>
                <select value={autoSel.make} onChange={e=>setAutoSel(s=>({...s,make:e.target.value}))} style={{borderRadius:9,border:"1px solid var(--pp-border2)",padding:"10px 12px",background:"var(--pp-card2)",color:"var(--pp-text1)",fontSize:13.5,fontFamily:"Outfit,sans-serif"}}>
                  <option value="">Select make…</option>
                  {autoMakes.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
              </label>
              <label style={{display:"flex",flexDirection:"column",gap:5}}>
                <span style={{fontSize:11.5,fontWeight:600,color:"var(--pp-text2)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Model {autoLoading==="models"&&<span style={{color:"#60A5FA",fontWeight:400}}>loading…</span>}</span>
                <select value={autoSel.model} onChange={e=>setAutoSel(s=>({...s,model:e.target.value}))} disabled={!autoSel.make||autoLoading==="models"} style={{borderRadius:9,border:"1px solid var(--pp-border2)",padding:"10px 12px",background:"var(--pp-card2)",color:"var(--pp-text1)",fontSize:13.5,fontFamily:"Outfit,sans-serif",opacity:autoSel.make?1:0.5}}>
                  <option value="">Select model…</option>
                  {autoModels.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
              </label>
              <label style={{display:"flex",flexDirection:"column",gap:5}}>
                <span style={{fontSize:11.5,fontWeight:600,color:"var(--pp-text2)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Year</span>
                <select value={autoSel.year} onChange={e=>setAutoSel(s=>({...s,year:Number(e.target.value)}))} style={{borderRadius:9,border:"1px solid var(--pp-border2)",padding:"10px 12px",background:"var(--pp-card2)",color:"var(--pp-text1)",fontSize:13.5,fontFamily:"Outfit,sans-serif"}}>
                  {Array.from({length:19},(_,i)=>2026-i).map(y=><option key={y} value={y}>{y}</option>)}
                </select>
              </label>
              <label style={{display:"flex",flexDirection:"column",gap:5}}>
                <span style={{fontSize:11.5,fontWeight:600,color:"var(--pp-text2)",textTransform:"uppercase",letterSpacing:"0.06em"}}>Variant {autoLoading==="versions"&&<span style={{color:"#60A5FA",fontWeight:400}}>loading…</span>}</span>
                <select value={autoSel.version} onChange={e=>setAutoSel(s=>({...s,version:e.target.value}))} disabled={!autoSel.model||autoLoading==="versions"} style={{borderRadius:9,border:"1px solid var(--pp-border2)",padding:"10px 12px",background:"var(--pp-card2)",color:"var(--pp-text1)",fontSize:13.5,fontFamily:"Outfit,sans-serif",opacity:autoSel.model?1:0.5}}>
                  <option value="">Select variant…</option>
                  {autoVersions.map(r=><option key={r.version_id} value={r.version}>{r.version}</option>)}
                </select>
              </label>
            </div>

            {autoSelected&&(
              <div style={{marginTop:16,background:"rgba(155,43,43,0.07)",border:"1px solid rgba(155,43,43,0.2)",borderRadius:12,padding:"16px 18px"}}>
                <div style={{fontSize:11.5,fontWeight:700,color:"#9B2B2B",marginBottom:12,textTransform:"uppercase",letterSpacing:"0.07em"}}>Full specs loaded from database</div>

                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:"8px 16px",marginBottom:12}}>
                  {[
                    ["Fuel",autoSelected.key_fuel_type],
                    ["Transmission",autoSelected.key_transmission],
                    ["Seats",autoSelected.key_seating_capacity],
                    ["Body Style",autoSelected.body_style],
                    ["Engine",autoSelected.key_engine],
                    ["Mileage (ARAI)",autoSelected.key_mileage_arai],
                    ["Max Power",autoSelected.max_power],
                    ["Max Torque",autoSelected.max_torque],
                    ["Top Speed",autoSelected.top_speed&&autoSelected.top_speed+" kmph"],
                    ["0–100 kmph",autoSelected.acceleration_0_100&&autoSelected.acceleration_0_100+"s"],
                    ["Drivetrain",autoSelected.drivetrain],
                    ["Emission",autoSelected.emission_standard],
                    ["Airbags",autoSelected.airbags],
                    ["ABS",autoSelected.abs],
                    ["ESP",autoSelected.esp],
                    ["NCAP Rating",autoSelected.ncap_rating],
                    ["Front Tyres",autoSelected.front_tyres],
                    ["Rear Tyres",autoSelected.rear_tyres],
                    ["Length",autoSelected.length_mm],
                    ["Wheelbase",autoSelected.wheelbase_mm],
                    ["Ground Clearance",autoSelected.ground_clearance],
                    ["Kerb Weight",autoSelected.kerb_weight],
                    ["Bootspace",autoSelected.bootspace],
                    ["Fuel Tank",autoSelected.fuel_tank_capacity],
                    ["Sunroof",autoSelected.sunroof],
                    ["On-road Hyderabad",autoSelected.onroad_hyderabad],
                  ].filter(([,v])=>v).map(([k,v])=>(
                    <div key={k} style={{fontSize:12}}>
                      <span style={{color:"var(--pp-text2)"}}>{k}: </span>
                      <span style={{fontWeight:600,color:"var(--pp-text1)"}}>{v}</span>
                    </div>
                  ))}
                </div>

                <button onClick={applyAutoSpec} style={{padding:"10px 22px",borderRadius:9,background:"#9B2B2B",border:"none",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"Outfit,sans-serif",display:"flex",alignItems:"center",gap:7}}>
                  Apply & Continue Filling Details →
                </button>
              </div>
            )}
          </FormSection>

          {form.make&&(
            <div style={{marginTop:6,padding:"11px 16px",background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:9,fontSize:13,color:"#10B981",fontWeight:600}}>
              ✓ Specs applied for {form.make} {form.model} {form.variant} — scroll down to add photos, price, km, owners, then save.
            </div>
          )}
        </div>
      )}

      {/* Photos & Video — first thing, most prominent */}
      <FormSection title="Photos & Video">
        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,video/mp4,video/webm,video/quicktime" multiple style={{display:"none"}} onChange={e=>{handleFiles(e.target.files);e.target.value="";}}/>
        <div onClick={()=>fileInputRef.current?.click()}
          onDragOver={e=>e.preventDefault()}
          onDrop={e=>{e.preventDefault();handleFiles(e.dataTransfer.files);}}
          style={{border:"1.5px dashed var(--pp-border2)",borderRadius:12,padding:"26px",textAlign:"center",cursor:"pointer",background:"var(--pp-card2)"}}>
          <Upload size={22} color="#64748B" style={{marginBottom:8}}/>
          <div style={{fontSize:13.5,fontWeight:600,color:"var(--pp-text3)"}}>Click to upload, or drag and drop</div>
          <div style={{fontSize:11.5,color:"var(--pp-text2)",marginTop:3}}>PNG or JPG images, and MP4 / WebM / MOV video</div>
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
              <div key={m.id} style={{position:"relative",borderRadius:10,overflow:"hidden",aspectRatio:"4/3",background:"#0F172A",border:isCover?"2px solid #9B2B2B":"1px solid rgba(255,255,255,0.08)"}}>
                {m.type==="video"?(
                  <video src={m.url} style={{width:"100%",height:"100%",objectFit:"cover"}} muted/>
                ):(
                  <img src={m.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                )}
                {m.type==="video"&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.25)",pointerEvents:"none"}}><Play size={18} color="#fff" fill="#fff"/></div>}
                {isCover&&<span style={{position:"absolute",bottom:5,left:5,background:"#9B2B2B",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20}}>Cover</span>}
                {m.type==="image"&&!isCover&&<button onClick={()=>setCoverId(m.id)} style={{position:"absolute",bottom:5,left:5,background:"rgba(0,0,0,0.6)",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:20,border:"none",cursor:"pointer"}}>Set cover</button>}
                <button onClick={()=>{removeMedia(m.id);if(coverId===m.id)setCoverId(null);}} style={{position:"absolute",top:5,right:5,width:22,height:22,borderRadius:"50%",border:"none",background:"rgba(0,0,0,0.6)",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={12}/></button>
              </div>
            )})}
          </div>
        )}
      </FormSection>

      {/* Make & Model — dependent dropdowns; hidden in automated mode (already selected above) */}
      {(listingMode!=="automated"||form.id)&&<FormSection title="Car Details">
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12}}>
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
            {variantOptions.length>0&&!customVariant?(
              <select value={form.variant||""} onChange={e=>{const v=e.target.value;const sp=VARIANT_SPECS[v]||{};setForm(f=>({...f,variant:v,...(sp.fuel?{fuel:sp.fuel}:{}),...(sp.transmission?{transmission:sp.transmission}:{})}));if(v)fetchAndApplySpecs(form.make,form.model,form.year,v);}}>
                <option value="">Select variant…</option>
                {variantOptions.map(o=><option key={o.variant} value={o.variant}>{o.variant}</option>)}
              </select>
            ):(
              <input value={form.variant||""} onChange={e=>{const v=e.target.value;const sp=VARIANT_SPECS[v]||{};setForm(f=>({...f,variant:v,...(sp.fuel?{fuel:sp.fuel}:{}),...(sp.transmission?{transmission:sp.transmission}:{})}));}} onBlur={e=>{if(e.target.value)fetchAndApplySpecs(form.make,form.model,form.year,e.target.value);}} placeholder="e.g. VX"/>
            )}
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
        {specLoading&&(
          <div style={{marginTop:12,padding:"10px 14px",background:"rgba(96,165,250,0.08)",border:"1px solid rgba(96,165,250,0.2)",borderRadius:9,fontSize:13,color:"#60A5FA",fontWeight:600,display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:12,height:12,border:"2px solid #60A5FA",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
            Fetching specs from database…
          </div>
        )}
        {!specLoading&&form.specs&&(
          <div style={{marginTop:12,background:"rgba(16,185,129,0.07)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:10,padding:"12px 16px"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#10B981",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Specs auto-filled</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"6px 20px"}}>
              {[
                form.specs.engine&&["Engine",form.specs.engine],
                form.specs.maxPower&&["Power",form.specs.maxPower],
                form.specs.maxTorque&&["Torque",form.specs.maxTorque],
                form.specs.mileage&&["Mileage",form.specs.mileage],
                form.specs.topSpeed&&["Top Speed",form.specs.topSpeed+" kmph"],
                form.specs.frontTyres&&["Tyres",form.specs.frontTyres],
                form.specs.airbags&&["Airbags",form.specs.airbags],
                form.specs.ncapRating&&["NCAP",form.specs.ncapRating],
              ].filter(Boolean).map(([k,v])=>(
                <span key={k} style={{fontSize:12}}><span style={{color:"var(--pp-text2)"}}>{k}: </span><span style={{fontWeight:700,color:"var(--pp-text1)"}}>{v}</span></span>
              ))}
            </div>
          </div>
        )}
      </FormSection>}
      <FormSection title="History">
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12,marginBottom:16}}>
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
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",borderRadius:10,border:"1.5px solid var(--pp-border2)",background:"var(--pp-card2)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,minWidth:0}}>
                <FileText size={15} color="#64748B" style={{flexShrink:0}}/>
                <span style={{fontSize:12.5,color:"#CBD5E1",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{serviceDoc.name}</span>
              </div>
              <button onClick={()=>setServiceDoc(null)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--pp-text3)",flexShrink:0}}><X size={14}/></button>
            </div>
          ):(
            <button onClick={()=>serviceFileRef.current?.click()} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:10,border:"1.5px dashed var(--pp-border2)",background:"var(--pp-card2)",color:"var(--pp-text3)",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"Outfit,sans-serif"}}>
              <Upload size={14}/> Upload service history (PDF or Word doc)
            </button>
          )}
          <p style={{color:"var(--pp-text2)",fontSize:11,marginTop:6}}>Shown to buyers as a downloadable file on the listing.</p>
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
                  <span style={{fontSize:10,color:"var(--pp-text2)"}}>%</span>
                </div>
                <span style={{fontSize:9.5,color:"var(--pp-text2)",fontWeight:600}}>{t.label}</span>
              </div>
            ))}
          </div>
          {/* Center: car body */}
          <div style={{position:"relative",width:100,height:210}}>
            <div style={{position:"absolute",left:0,top:0,width:"100%",height:"100%",border:"2px solid rgba(255,255,255,0.12)",borderRadius:38,background:"rgba(255,255,255,0.015)"}}/>
            <div style={{position:"absolute",left:18,top:28,width:64,height:3,borderRadius:2,background:"var(--pp-chip)"}}/>
          </div>
          {/* Right column: FR top, RR bottom */}
          <div style={{display:"flex",flexDirection:"column",gap:60}}>
            {[{key:"fr",label:"FR"},{key:"rr",label:"RR"}].map(t=>(
              <div key={t.key} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{width:28,height:58,borderRadius:7,background:"#0F172A",border:`2px solid ${tyreColor(form.tyreWear?.[t.key]??20)}`}}/>
                <div style={{display:"flex",alignItems:"center",gap:2}}>
                  <input type="number" min="0" max="100" value={form.tyreWear?.[t.key]??20} onChange={e=>setForm(f=>({...f,tyreWear:{...f.tyreWear,[t.key]:Math.max(0,Math.min(100,Number(e.target.value)))}}))} style={{width:44,padding:"4px 5px",fontSize:11.5,textAlign:"center"}}/>
                  <span style={{fontSize:10,color:"var(--pp-text2)"}}>%</span>
                </div>
                <span style={{fontSize:9.5,color:"var(--pp-text2)",fontWeight:600}}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{color:"var(--pp-text2)",fontSize:11,textAlign:"center",margin:"0 0 24px"}}>% wear — <span style={{color:"#10B981"}}>green = good</span> · <span style={{color:"#F59E0B"}}>amber = moderate</span> · <span style={{color:"#EF4444"}}>red = worn</span></p>
        {/* Tyre specs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:12}}>
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
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12}}>
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
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--pp-border)" strokeWidth="10"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke={form.score>0?rc(form.score):"#334155"} strokeWidth="10" strokeDasharray={`${2*Math.PI*40}`} strokeDashoffset={`${2*Math.PI*40*(1-(form.score||0)/100)}`} strokeLinecap="round"/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:form.score>0?rc(form.score):"#334155",fontWeight:900,fontSize:13}}>{form.score>0?form.score:"—"}</span></div>
            </div>
            <div>
              <div style={{color:"var(--pp-text2)",fontSize:12}}>{form.score>0?rl(form.score)+" — "+SCORE_CATS.filter(c=>form.scoreBreakdown?.[c.key]>0).length+"/"+SCORE_CATS.length+" sections rated":"Not rated yet"}</div>
            </div>
          </div>
          <Btn onClick={()=>setScoring(true)}>{form.score>0?<><Edit2 size={12}/> Edit Score</>:<><Award size={12}/> Set Score</>}</Btn>
        </div>
      </FormSection>
      <div style={{marginTop:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <button onClick={()=>setEdit(null)} style={{padding:"12px 20px",borderRadius:11,border:"1.5px solid var(--pp-border2)",background:"transparent",color:"var(--pp-text3)",cursor:"pointer",fontWeight:600,fontSize:14,fontFamily:"Outfit,sans-serif"}}>Cancel</button>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>form.make&&setPreviewing(true)} disabled={!form.make} style={{padding:"12px 22px",borderRadius:11,border:"1.5px solid rgba(255,255,255,0.12)",background:"transparent",color:form.make?"#60A5FA":"#475569",cursor:form.make?"pointer":"not-allowed",fontWeight:600,fontSize:14,fontFamily:"Outfit,sans-serif",display:"flex",alignItems:"center",gap:7}}><Eye size={14}/> Preview</button>
          <button onClick={()=>save("draft")} style={{padding:"12px 22px",borderRadius:11,border:"1.5px solid rgba(255,255,255,0.12)",background:"transparent",color:"var(--pp-text3)",cursor:"pointer",fontWeight:600,fontSize:14,fontFamily:"Outfit,sans-serif"}}>Save as Draft</button>
          <button onClick={()=>save("published")} style={{padding:"12px 26px",borderRadius:11,background:"#9B2B2B",border:"none",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:14,fontFamily:"Outfit,sans-serif"}}>{form.id?"Save Changes":"Create Listing"}</button>
        </div>
      </div>
    </div>
  );

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <span style={{color:"var(--pp-text3)",fontSize:14}}>{cars.length} listings</span>
        <button onClick={()=>setEdit({})} style={{padding:"10px 18px",borderRadius:10,background:"#9B2B2B",border:"none",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:6,fontFamily:"Outfit,sans-serif"}}><Plus size={14}/> Add Listing</button>
      </div>
      <Card>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:"1px solid var(--pp-border)"}}>{["Car","Category","Year","Price","Score","Actions"].map(h=><th key={h} style={{padding:"12px 16px",textAlign:"left",color:"var(--pp-text2)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>{h}</th>)}</tr></thead>
          <tbody>{cars.map(c=><tr key={c.id} style={{borderBottom:"1px solid var(--pp-border)"}}>
            <td style={{padding:"11px 16px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><img src={c.img} alt="" style={{width:52,height:36,objectFit:"cover",borderRadius:8,flexShrink:0}} onError={e=>e.target.style.display="none"}/><div><div style={{fontWeight:600,fontSize:13.5,display:"flex",alignItems:"center",gap:7}}>{c.make} {c.model}{c.status==="draft"&&<span style={{background:"#F59E0B22",color:"#F59E0B",fontSize:9.5,fontWeight:700,padding:"2px 7px",borderRadius:20}}>DRAFT</span>}</div><div style={{color:"var(--pp-text2)",fontSize:11.5}}>{c.fuel} · {c.transmission}</div></div></div></td>
            <td style={{padding:"11px 16px",color:"var(--pp-text3)",fontSize:13}}>{c.category}</td>
            <td style={{padding:"11px 16px",color:"var(--pp-text3)",fontSize:13}}>{c.year}</td>
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
        <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} style={{width:15,height:15,accentColor:"#9B2B2B"}}/><span style={{color:"var(--pp-text3)",fontSize:13}}>Mark as Featured</span></label>
        {form.img&&<img src={form.img} alt="" style={{width:320,height:180,objectFit:"cover",borderRadius:12}} onError={e=>e.target.style.display="none"}/>}
      </Card>
      <div style={{marginTop:14,display:"flex",gap:10}}><button onClick={save} style={{padding:"12px 26px",borderRadius:11,background:"#9B2B2B",border:"none",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:14,fontFamily:"Outfit,sans-serif"}}>{form.id?"Save":"Publish"}</button><button onClick={()=>setEdit(null)} style={{padding:"12px 20px",borderRadius:11,border:"1.5px solid var(--pp-border2)",background:"transparent",color:"var(--pp-text3)",cursor:"pointer",fontWeight:600,fontSize:14,fontFamily:"Outfit,sans-serif"}}>Cancel</button></div>
    </div>
  );
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><span style={{color:"var(--pp-text3)",fontSize:14}}>{blogs.length} posts</span><button onClick={()=>setEdit({})} style={{padding:"10px 18px",borderRadius:10,background:"#9B2B2B",border:"none",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:6,fontFamily:"Outfit,sans-serif"}}><Plus size={14}/> New Post</button></div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {blogs.map(p=><Card key={p.id} style={{padding:"14px 18px",display:"flex",alignItems:"center",gap:14}}>
          <img src={p.img} alt="" style={{width:68,height:48,objectFit:"cover",borderRadius:9,flexShrink:0}} onError={e=>e.target.style.display="none"}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:700,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:4}}>{p.title}</div>
            <div style={{color:"var(--pp-text2)",fontSize:12}}>{p.author} · {p.date} · {p.readTime} {p.featured&&<span style={{marginLeft:6,background:"rgba(245,158,11,0.15)",color:"#F59E0B",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20}}>Featured</span>}</div>
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
        <div style={{color:"var(--pp-text3)",fontSize:14}}>{team.length} admin {team.length===1?"account":"accounts"}</div>
        <Btn full onClick={()=>{setShowAdd(true);}}><Plus size={13}/> Add Admin</Btn>
      </div>

      <Card>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{borderBottom:"1px solid var(--pp-border)"}}>{["Admin","Email","Status","Joined","Actions"].map(h=><th key={h} style={{padding:"12px 16px",textAlign:h==="Actions"?"right":"left",color:"var(--pp-text2)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>{h}</th>)}</tr></thead>
          <tbody>{team.map(u=><tr key={u.id} style={{borderBottom:"1px solid var(--pp-border)"}}>
            <td style={{padding:"13px 16px"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:"#334155",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,color:"var(--pp-text3)",flexShrink:0}}>{(u.name||u.email||"?")[0].toUpperCase()}</div>
                {editingId===u.id?(
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <input value={editName} onChange={e=>setEditName(e.target.value)} style={{padding:"6px 9px",fontSize:13,width:140}}/>
                    <button onClick={()=>saveName(u.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#10B981"}}><CheckCircle size={15}/></button>
                    <button onClick={()=>setEditingId(null)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--pp-text2)"}}><X size={15}/></button>
                  </div>
                ):(
                  <span style={{fontWeight:600,fontSize:14}}>{u.name||"Unnamed"}</span>
                )}
              </div>
            </td>
            <td style={{padding:"13px 16px",color:"var(--pp-text3)",fontSize:13}}>{u.email}</td>
            <td style={{padding:"13px 16px"}}>
              {u.confirmed?
                <span style={{display:"inline-flex",alignItems:"center",gap:5,background:"#10B98122",color:"#10B981",fontWeight:600,fontSize:11,padding:"3px 10px",borderRadius:20}}><CheckCircle size={11}/> Active</span>:
                <span onClick={()=>simulateConfirm(u.id)} title="Click to simulate confirmation (preview only)" style={{display:"inline-flex",alignItems:"center",gap:5,background:"#F59E0B22",color:"#F59E0B",fontWeight:600,fontSize:11,padding:"3px 10px",borderRadius:20,cursor:"pointer"}}><Hourglass size={11}/> Pending</span>}
            </td>
            <td style={{padding:"13px 16px",color:"var(--pp-text3)",fontSize:13}}>{new Date(u.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</td>
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
        {team.length===0&&<div style={{padding:"40px 20px",textAlign:"center",color:"var(--pp-text2)",fontSize:13}}>No admin accounts yet — add one above.</div>}
      </Card>

      {showAdd&&(
        <div style={{position:"fixed",inset:0,zIndex:500,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowAdd(false)}>
          <div className="pp-admin" style={{background:"#1E293B",borderRadius:18,padding:28,width:380,maxWidth:"90vw",border:"1px solid rgba(255,255,255,0.08)"}} onClick={e=>e.stopPropagation()}>
            <h3 style={{fontWeight:800,fontSize:17,marginBottom:6}}>Invite an admin</h3>
            <p style={{color:"var(--pp-text3)",fontSize:12.5,marginBottom:18}}>They'll get an email with a link to confirm and set their password. (Preview mode: no real email is sent — click the Pending badge on their row to simulate them confirming.)</p>
            <Label>Email</Label>
            <input value={addEmail} onChange={e=>setAddEmail(e.target.value)} type="email" placeholder="teammate@example.com" style={{marginBottom:14}}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setShowAdd(false)} style={{flex:1,padding:"11px",borderRadius:10,border:"1px solid var(--pp-border)",background:"transparent",color:"var(--pp-text3)",cursor:"pointer",fontWeight:600,fontFamily:"Outfit,sans-serif"}}>Cancel</button>
              <button onClick={inviteAdmin} disabled={addBusy} style={{flex:1,padding:"11px",borderRadius:10,border:"none",background:"#9B2B2B",color:"#fff",cursor:"pointer",fontWeight:700,fontFamily:"Outfit,sans-serif",opacity:addBusy?0.7:1}}>{addBusy?"Sending…":"Send Invite"}</button>
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
  if(loading)return <div style={{color:"var(--pp-text2)",padding:20}}>Loading enquiries…</div>;
  if(!enquiries.length)return <div style={{color:"var(--pp-text2)",padding:20}}>No enquiries yet.</div>;
  return(
    <Card>
      <div style={{padding:"16px 22px",borderBottom:"1px solid var(--pp-border)",fontWeight:700,fontSize:15}}>All Enquiries</div>
      <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
        <thead><tr style={{borderBottom:"1px solid var(--pp-border)"}}>{["Car","Name","Email","Phone","Date","Listing"].map(h=><th key={h} style={{padding:"11px 16px",textAlign:"left",color:"var(--pp-text2)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
        <tbody>{enquiries.map((e,i)=><tr key={e.id||i} style={{borderBottom:"1px solid var(--pp-border)"}}>
          <td style={{padding:"12px 16px",fontWeight:600,fontSize:13,whiteSpace:"nowrap"}}>{e.car_title||e.car_id}</td>
          <td style={{padding:"12px 16px",fontSize:13}}>{e.name}</td>
          <td style={{padding:"12px 16px",fontSize:13,color:"var(--pp-text3)"}}>{e.email}</td>
          <td style={{padding:"12px 16px",fontSize:13}}>{e.phone}</td>
          <td style={{padding:"12px 16px",fontSize:13,color:"var(--pp-text3)",whiteSpace:"nowrap"}}>{e.created_at?new Date(e.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"-"}</td>
          <td style={{padding:"12px 16px"}}>{e.listing_url?<a href={e.listing_url} target="_blank" rel="noopener noreferrer" style={{color:"#60A5FA",fontSize:12,fontWeight:600,textDecoration:"none"}}>View</a>:"-"}</td>
        </tr>)}</tbody>
      </table>
      </div>
    </Card>
  );
}

// ── TestimonialsAdmin ─────────────────────────────────────────────
function TestimonialsAdmin({testimonials,setTestimonials}){
  const empty={name:"",designation:"",car:"",rating:5,quote:"",avatar:""};
  const [form,setForm]=useState(empty);
  const [editing,setEditing]=useState(null);
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  const startEdit=t=>{setEditing(t.id);setForm({name:t.name,designation:t.designation||"",car:t.car||"",rating:t.rating||5,quote:t.quote,avatar:t.avatar||""});};
  const cancel=()=>{setEditing(null);setForm(empty);};
  const save=()=>{
    if(!form.name||!form.quote)return;
    if(editing){
      setTestimonials(ts=>ts.map(t=>t.id===editing?{...t,...form}:t));
    } else {
      setTestimonials(ts=>[...ts,{...form,id:Date.now()}]);
    }
    cancel();
  };
  const del=id=>setTestimonials(ts=>ts.filter(t=>t.id!==id));
  const inp={width:"100%",padding:"10px 14px",fontSize:14,borderRadius:10,border:"1.5px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.05)",color:"#fff",fontFamily:"Outfit,sans-serif",outline:"none",boxSizing:"border-box"};
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h2 style={{fontWeight:800,fontSize:20,color:"#fff",margin:0}}>Testimonials</h2>
        {!editing&&<button onClick={()=>setEditing("new")} style={{padding:"9px 20px",borderRadius:10,background:"#9B2B2B",color:"#fff",border:"none",cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"Outfit,sans-serif",display:"flex",alignItems:"center",gap:7}}><Plus size={14}/> Add Testimonial</button>}
      </div>
      {(editing==="new"||editing)&&(
        <div style={{background:"#1E293B",borderRadius:16,padding:24,marginBottom:24,border:"1px solid rgba(255,255,255,0.1)"}}>
          <div style={{fontWeight:700,fontSize:15,color:"#fff",marginBottom:16}}>{editing==="new"?"New Testimonial":"Edit Testimonial"}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <div><label style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",display:"block",marginBottom:5,textTransform:"uppercase"}}>Name</label><input value={form.name} onChange={set("name")} placeholder="Customer name" style={inp}/></div>
            <div><label style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",display:"block",marginBottom:5,textTransform:"uppercase"}}>Designation</label><input value={form.designation} onChange={set("designation")} placeholder="e.g. Software Engineer" style={inp}/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <div><label style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",display:"block",marginBottom:5,textTransform:"uppercase"}}>Car</label><input value={form.car} onChange={set("car")} placeholder="e.g. Hyundai Creta 2022" style={inp}/></div>
            <div><label style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",display:"block",marginBottom:5,textTransform:"uppercase"}}>Rating (1–5)</label>
              <div style={{display:"flex",gap:6,paddingTop:8}}>
                {[1,2,3,4,5].map(s=>(
                  <button key={s} type="button" onClick={()=>setForm(f=>({...f,rating:s}))} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:s<=form.rating?"#F59E0B":"rgba(255,255,255,0.2)",padding:0,lineHeight:1}}>★</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{marginBottom:14}}><label style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",display:"block",marginBottom:5,textTransform:"uppercase"}}>Quote</label><textarea value={form.quote} onChange={set("quote")} placeholder="What the customer said…" rows={3} style={{...inp,resize:"vertical",lineHeight:1.6}}/></div>
          <div style={{marginBottom:20}}><label style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",display:"block",marginBottom:5,textTransform:"uppercase"}}>Avatar URL (optional)</label><input value={form.avatar} onChange={set("avatar")} placeholder="https://…" style={inp}/></div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={save} disabled={!form.name||!form.quote} style={{padding:"10px 24px",borderRadius:10,background:(!form.name||!form.quote)?"#334155":"#9B2B2B",color:"#fff",border:"none",cursor:(!form.name||!form.quote)?"not-allowed":"pointer",fontWeight:700,fontSize:14,fontFamily:"Outfit,sans-serif"}}>{editing==="new"?"Add":"Save Changes"}</button>
            <button onClick={cancel} style={{padding:"10px 20px",borderRadius:10,background:"rgba(255,255,255,0.07)",color:"#fff",border:"none",cursor:"pointer",fontWeight:600,fontSize:14,fontFamily:"Outfit,sans-serif"}}>Cancel</button>
          </div>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {testimonials.map(t=>(
          <div key={t.id} style={{background:"#1E293B",borderRadius:14,padding:"18px 20px",border:"1px solid rgba(255,255,255,0.08)",display:"flex",gap:16,alignItems:"flex-start"}}>
            {t.avatar?<img src={t.avatar} alt="" style={{width:44,height:44,borderRadius:"50%",objectFit:"cover",flexShrink:0}}/>:<div style={{width:44,height:44,borderRadius:"50%",background:"#9B2B2B33",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontWeight:800,fontSize:16,color:"#9B2B2B"}}>{t.name?.[0]}</div>}
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontWeight:700,fontSize:14,color:"#fff"}}>{t.name}</span>
                {t.designation&&<span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>· {t.designation}</span>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                {t.car&&<span style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>{t.car}</span>}
                <span style={{fontSize:11,color:"#F59E0B",letterSpacing:1}}>{"★".repeat(t.rating||5)}</span>
              </div>
              <p style={{fontSize:13.5,color:"rgba(255,255,255,0.6)",lineHeight:1.6,margin:0}}>"{t.quote}"</p>
            </div>
            <div style={{display:"flex",gap:8,flexShrink:0}}>
              <button onClick={()=>startEdit(t)} style={{width:32,height:32,borderRadius:8,border:"1px solid rgba(255,255,255,0.12)",background:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Edit2 size={13} color="#94A3B8"/></button>
              <button onClick={()=>del(t.id)} style={{width:32,height:32,borderRadius:8,border:"1px solid rgba(220,38,38,0.2)",background:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Trash2 size={13} color="#EF4444"/></button>
            </div>
          </div>
        ))}
        {testimonials.length===0&&<div style={{textAlign:"center",padding:40,color:"rgba(255,255,255,0.3)",fontSize:14}}>No testimonials yet. Add your first one above.</div>}
      </div>
    </div>
  );
}

// ── AdminConsole ─────────────────────────────────────────────────
function AdminConsole({cars,setCars,blogs,setBlogs,testimonials,setTestimonials,users,onExit}){
  const [tab,setTab]=useState("dashboard");
  const [authed,setAuthed]=useState(false);
  const [loginErr,setLoginErr]=useState("");
  const [loginEmail,setLoginEmail]=useState("");
  const [loginPass,setLoginPass]=useState("");
  const [loginRemember,setLoginRemember]=useState(true);
  const [sidebarOpen,setSidebarOpen]=useState(false);

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
        <button onClick={onExit} style={{position:"absolute",top:20,left:24,display:"flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"var(--pp-text2)",fontSize:12.5,fontWeight:600,fontFamily:"Outfit,sans-serif"}}><ChevronLeft size={13}/> Back to site</button>
        <div style={{width:420,maxWidth:"94vw"}}>
          {/* Logo */}
          <div style={{textAlign:"center",marginBottom:36}}>
            <div style={{width:56,height:56,background:"linear-gradient(135deg,#9B2B2B,#991B1B)",borderRadius:16,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:18,boxShadow:"0 8px 32px rgba(220,38,38,0.35)"}}><Car size={26} color="#fff"/></div>
            <div style={{fontWeight:900,fontSize:26,letterSpacing:"-0.04em"}}>PolePosition</div>
            <div style={{color:"#9B2B2B",fontSize:11,fontWeight:700,letterSpacing:"0.18em",marginTop:4}}>ADMIN CONSOLE</div>
          </div>
          {/* Card */}
          <div style={{background:"#1E293B",borderRadius:22,padding:"32px 36px",border:"1px solid var(--pp-border)",boxShadow:"0 24px 64px rgba(0,0,0,0.5)"}}>
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
                <input type="checkbox" checked={loginRemember} onChange={e=>setLoginRemember(e.target.checked)} style={{width:15,height:15,accentColor:"#9B2B2B"}}/>
                <span style={{color:"var(--pp-text3)",fontSize:13}}>Remember me</span>
              </label>
              <span style={{color:"var(--pp-text2)",fontSize:12.5,cursor:"pointer"}}>Forgot password?</span>
            </div>
            {loginErr&&<div style={{background:"rgba(220,38,38,0.1)",border:"1px solid rgba(220,38,38,0.2)",color:"#F87171",fontSize:12.5,padding:"10px 14px",borderRadius:10,marginBottom:16}}>{loginErr}</div>}
            <button onClick={handleLogin} style={{width:"100%",padding:"14px",borderRadius:12,background:"linear-gradient(135deg,#9B2B2B,#B91C1C)",border:"none",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:15,fontFamily:"Outfit,sans-serif",boxShadow:"0 4px 16px rgba(220,38,38,0.35)"}}>Sign in to Admin</button>
          </div>
        </div>
      </div>
    </>
  );

  const NAV=[{id:"dashboard",label:"Dashboard",icon:BarChart2},{id:"listings",label:"Listings",icon:Car},{id:"users",label:"Admin Team",icon:Shield},{id:"blog",label:"Blog",icon:BookOpen},{id:"testimonials",label:"Testimonials",icon:Star},{id:"enquiries",label:"Enquiries",icon:MessageSquare}];
  const SidebarContent=()=>(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"22px 20px 18px",borderBottom:"1px solid var(--pp-border)",background:"#1E293B"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:32,height:32,background:"#9B2B2B",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}><Car size={16} color="#fff"/></div>
            <div><div style={{fontWeight:800,fontSize:14,letterSpacing:"-0.03em"}}>PolePosition</div><div style={{color:"#9B2B2B",fontSize:9.5,fontWeight:700,letterSpacing:"0.1em"}}>ADMIN</div></div>
          </div>
          <button className="admin-close-btn" onClick={()=>setSidebarOpen(false)} style={{background:"none",border:"none",cursor:"pointer",color:"#94A3B8",padding:4}}><X size={18}/></button>
        </div>
      </div>
      <nav style={{padding:"10px 0",flex:1}}>
        {NAV.map(n=>{const Icon=n.icon;const a=tab===n.id;return(
          <button key={n.id} onClick={()=>{setTab(n.id);setSidebarOpen(false);}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 20px",border:"none",width:"100%",background:a?"rgba(220,38,38,0.1)":"transparent",cursor:"pointer",borderLeft:a?"3px solid #9B2B2B":"3px solid transparent",textAlign:"left",fontFamily:"Outfit,sans-serif"}}>
            <Icon size={16} color={a?"#9B2B2B":"#64748B"}/><span style={{color:a?"#fff":"#94A3B8",fontWeight:a?600:500,fontSize:13.5}}>{n.label}</span>
          </button>
        );})}
      </nav>
      <div style={{padding:"14px 20px",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",gap:10}}>
        <button onClick={onExit} style={{display:"flex",alignItems:"center",gap:8,background:"transparent",border:"none",cursor:"pointer",color:"var(--pp-text3)",fontSize:13,fontWeight:600,fontFamily:"Outfit,sans-serif"}}><ChevronLeft size={13}/> Back to site</button>
        <button onClick={()=>setAuthed(false)} style={{display:"flex",alignItems:"center",gap:8,background:"transparent",border:"none",cursor:"pointer",color:"var(--pp-text2)",fontSize:13,fontWeight:500,fontFamily:"Outfit,sans-serif"}}><LogOut size={13}/> Sign Out</button>
      </div>
    </div>
  );
  return(
    <>
      <style>{G}{`
        .admin-hamburger{display:none;}
        .admin-close-btn{display:none;}
        .admin-sidebar-overlay{display:none;position:fixed;inset:0;z-index:200;}
        .admin-sidebar-drawer{width:220px;background:#1E293B;height:100%;overflow-y:auto;flex-shrink:0;border-right:1px solid rgba(255,255,255,0.06);}
        .admin-sidebar-backdrop{flex:1;background:rgba(0,0,0,0.5);}
        @media(max-width:640px){
          .admin-sidebar-desktop{display:none!important;}
          .admin-hamburger{display:flex!important;}
          .admin-close-btn{display:flex!important;}
          .admin-topbar-pad{padding:12px 16px!important;}
          .admin-content-pad{padding:16px!important;}
        }
      `}</style>
      <div className="pp-admin" style={{height:"100vh",display:"flex",overflow:"hidden"}}>
        {/* Desktop sidebar — hidden on mobile */}
        <div className="admin-sidebar-desktop" style={{width:220,background:"#1E293B",borderRight:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto"}}>
          <SidebarContent/>
        </div>
        {/* Mobile overlay sidebar */}
        {sidebarOpen&&(
          <div className="admin-sidebar-overlay" onClick={e=>{if(e.target.classList.contains("admin-sidebar-backdrop"))setSidebarOpen(false);}}>
            <div className="admin-sidebar-drawer"><SidebarContent/></div>
            <div className="admin-sidebar-backdrop"/>
          </div>
        )}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
          <div className="admin-topbar-pad" style={{padding:"16px 28px",borderBottom:"1px solid var(--pp-border)",background:"#1E293B",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
              {/* Hamburger — shown only on mobile via CSS */}
              <button className="admin-hamburger" onClick={()=>setSidebarOpen(true)} style={{background:"none",border:"none",cursor:"pointer",color:"#94A3B8",padding:4,flexShrink:0}}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect y="3" width="20" height="2" rx="1" fill="currentColor"/><rect y="9" width="20" height="2" rx="1" fill="currentColor"/><rect y="15" width="20" height="2" rx="1" fill="currentColor"/></svg>
              </button>
              <h1 style={{fontWeight:800,fontSize:18,letterSpacing:"-0.03em",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{NAV.find(n=>n.id===tab)?.label}</h1>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
              <div style={{textAlign:"right",display:"flex",flexDirection:"column"}}><div style={{fontSize:12,fontWeight:600,lineHeight:1.2}}>Admin</div><div style={{color:"var(--pp-text2)",fontSize:10,lineHeight:1.2,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>vaseey@gmail.com</div></div>
              <div style={{width:32,height:32,background:"#9B2B2B",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Shield size={15} color="#fff"/></div>
            </div>
          </div>
          <div className="admin-content-pad" style={{padding:"26px 28px",overflowY:"auto",flex:1}}>
            {tab==="dashboard"&&<Dashboard cars={cars} blogs={blogs} users={users}/>}
            {tab==="listings"&&<Listings cars={cars} setCars={setCars}/>}
            {tab==="users"&&<AdminTeam/>}
            {tab==="blog"&&<Blog blogs={blogs} setBlogs={setBlogs}/>}
            {tab==="testimonials"&&<TestimonialsAdmin testimonials={testimonials} setTestimonials={setTestimonials}/>}
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
    <div style={{paddingTop:80,minHeight:"100vh",background:"var(--pp-bg)"}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 24px 70px"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
          <h1 style={{fontFamily:"Outfit,sans-serif",fontWeight:900,fontSize:32,letterSpacing:"-0.03em",color:"var(--pp-text)"}}>My Favourites</h1>
          <span style={{background:"#9B2B2B",color:"#fff",padding:"5px 14px",borderRadius:100,fontWeight:700,fontSize:14}}>{saved.length}</span>
        </div>
        {saved.length===0?(
          <div style={{textAlign:"center",padding:"80px 20px",color:"var(--pp-text3)"}}>
            <Heart size={36} color="var(--pp-text3)" style={{marginBottom:14}}/>
            <p style={{fontSize:15,marginBottom:18}}>You haven't saved any cars yet.</p>
            <button onClick={()=>setPage("browse")} className="btn-red" style={{padding:"11px 24px",borderRadius:100,fontSize:14}}>Browse Cars</button>
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
function PublicSite({cars,blog,threads,testimonials,onGoAdmin}){
  const [page,setPage]=useState("home");
  const [car,setCar]=useState(null);
  const [thread,setThread]=useState(null);
  const [post,setPost]=useState(null);
  const [user,setUser]=useState(null);
  const [userEmail,setUserEmail]=useState(null);
  const [isAdmin,setIsAdmin]=useState(false);
  const [showLogin,setShowLogin]=useState(false);
  const [favs,setFavs]=useState([]);
  const [darkMode,setDarkMode]=useState(true);
  useEffect(()=>{
    if(darkMode) document.documentElement.classList.remove('light');
    else document.documentElement.classList.add('light');
  },[darkMode]);

  // Restore session on load and listen for auth changes
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      if(session?.user){
        const name=session.user.user_metadata?.full_name||session.user.email.split("@")[0];
        setUser(name);setUserEmail(session.user.email);
        supabase.from("profiles").select("is_admin").eq("id",session.user.id).single()
          .then(({data})=>{if(data?.is_admin)setIsAdmin(true);});
      }
    });
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>{
      if(session?.user){
        const name=session.user.user_metadata?.full_name||session.user.email.split("@")[0];
        setUser(name);setUserEmail(session.user.email);
      } else {
        setUser(null);setUserEmail(null);setIsAdmin(false);
      }
    });
    return()=>subscription.unsubscribe();
  },[]);

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
      <Navbar page={page} setPage={p=>navTo(p)} user={user} setUser={setUser} setShowLogin={setShowLogin} isAdmin={isAdmin} onGoAdmin={onGoAdmin} darkMode={darkMode} setDarkMode={setDarkMode}/>
      {showLogin&&<LoginModal onClose={()=>setShowLogin(false)} onLogin={({name,email})=>{
        if(email&&email.toLowerCase()==="vaseey@gmail.com"){setShowLogin(false);onGoAdmin();return;}
        setUser(name);setUserEmail(email);setIsAdmin(false);setShowLogin(false);
      }}/>}
      {page==="home"&&<HomePage setPage={p=>navTo(p)} setSelectedCar={c=>navTo("detail",c)} setSelectedPost={p=>{setPost(p);navTo("post");}} favs={favs} toggleFav={toggleFav} cars={cars} blog={blog} testimonials={testimonials}/>}
      {page==="browse"&&<BrowsePage setPage={p=>navTo(p)} setSelectedCar={c=>navTo("detail",c)} favs={favs} toggleFav={toggleFav} cars={cars}/>}
      {page==="favorites"&&<FavoritesPage setPage={p=>navTo(p)} setSelectedCar={c=>navTo("detail",c)} favs={favs} toggleFav={toggleFav} cars={cars}/>}
      {page==="detail"&&<CarDetailPage car={car} setPage={p=>navTo(p)} isFav={favs.includes(car?.id)} onFav={toggleFav} user={user} setShowLogin={setShowLogin} userEmail={userEmail} darkMode={darkMode} setDarkMode={setDarkMode}/>}
      {page==="quiz"&&<QuizPage setPage={p=>navTo(p)} setSelectedCar={c=>navTo("detail",c)} cars={cars}/>}
      {page==="blog"&&<BlogPage blog={blog} setPost={setPost} setPage={p=>navTo(p)}/>}
      {page==="post"&&<BlogPostPage post={post} setPage={p=>navTo(p)}/>}
      {page==="faq"&&<FaqPage/>}
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
  const [testimonials,setTestimonials]=useState(TESTIMONIALS_SEED);
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
      // Blog content is managed in BLOG_SEED (code) — Supabase table is not yet seeded with new posts
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
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"Outfit,sans-serif",background:"var(--pp-bg)",gap:16,textAlign:"center",padding:24}}>
      <div style={{width:64,height:64,background:"#DCFCE7",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:8}}><CheckCircle size={32} color="#16A34A"/></div>
      <h1 style={{fontWeight:900,fontSize:28,letterSpacing:"-0.03em",color:"var(--pp-text)",margin:0}}>Your account is confirmed.</h1>
      <p style={{fontWeight:600,fontSize:17,color:"var(--pp-text)",margin:0}}>Welcome to Pole Position.</p>
      <p style={{color:"var(--pp-text2)",fontSize:14,margin:0}}>Please wait. Redirecting…</p>
      <div style={{width:36,height:36,border:"3px solid var(--pp-border2)",borderTopColor:"#9B2B2B",borderRadius:"50%",animation:"spin 0.8s linear infinite",marginTop:8}}/>
    </div>
  );

  if(loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"Outfit,sans-serif",fontSize:18,color:"var(--pp-text2)"}}>Loading…</div>;

  if(view==="admin"){
    return <AdminConsole cars={cars} setCars={setCars} blogs={blogs} setBlogs={setBlogs} testimonials={testimonials} setTestimonials={setTestimonials} users={users} onExit={()=>setView("public")}/>;
  }
  return <PublicSite cars={cars.filter(c=>c.status!=="draft")} blog={blogs} threads={threads} testimonials={testimonials} onGoAdmin={()=>setView("admin")}/>;
}
// cache-bust: 1782134876
