require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const Stock    = require("../models/Stock");

const stocks = [
  // ── Technology ─────────────────────────────────────────────────
  { symbol:"AAPL",  companyName:"Apple Inc.",           currentPrice:189.42, previousClose:185.16, openPrice:186.00, highPrice:191.20, lowPrice:185.50, volume:58420000, marketCap:2950000000000, sector:"Technology",    exchange:"NASDAQ", description:"Consumer electronics, software and online services." },
  { symbol:"MSFT",  companyName:"Microsoft Corporation",currentPrice:415.20, previousClose:410.64, openPrice:411.00, highPrice:418.50, lowPrice:409.80, volume:22100000, marketCap:3080000000000, sector:"Technology",    exchange:"NASDAQ", description:"Cloud computing, software and enterprise services." },
  { symbol:"NVDA",  companyName:"NVIDIA Corporation",   currentPrice:127.80, previousClose:121.00, openPrice:122.50, highPrice:129.40, lowPrice:121.80, volume:310000000,marketCap:3140000000000, sector:"Technology",    exchange:"NASDAQ", description:"GPUs, AI chips and data center solutions." },
  { symbol:"GOOGL", companyName:"Alphabet Inc.",        currentPrice:178.92, previousClose:177.35, openPrice:177.80, highPrice:180.20, lowPrice:177.00, volume:24800000, marketCap:2190000000000, sector:"Technology",    exchange:"NASDAQ", description:"Search engine, advertising, cloud and AI." },
  { symbol:"META",  companyName:"Meta Platforms Inc.",  currentPrice:562.30, previousClose:545.12, openPrice:548.00, highPrice:565.80, lowPrice:547.20, volume:18600000, marketCap:1430000000000, sector:"Technology",    exchange:"NASDAQ", description:"Social media, VR and digital advertising." },
  { symbol:"AMZN",  companyName:"Amazon.com Inc.",      currentPrice:198.74, previousClose:199.60, openPrice:199.20, highPrice:201.50, lowPrice:197.80, volume:35200000, marketCap:2100000000000, sector:"Technology",    exchange:"NASDAQ", description:"E-commerce, cloud (AWS) and digital streaming." },
  { symbol:"CRM",   companyName:"Salesforce Inc.",      currentPrice:287.45, previousClose:283.20, openPrice:284.00, highPrice:289.60, lowPrice:283.00, volume:8200000,  marketCap:278000000000,  sector:"Technology",    exchange:"NYSE",   description:"Customer relationship management (CRM) SaaS." },
  { symbol:"ADBE",  companyName:"Adobe Inc.",           currentPrice:462.80, previousClose:458.40, openPrice:459.00, highPrice:465.20, lowPrice:457.80, volume:6100000,  marketCap:203000000000,  sector:"Technology",    exchange:"NASDAQ", description:"Creative software, PDF tools and digital marketing." },
  { symbol:"ORCL",  companyName:"Oracle Corporation",   currentPrice:138.60, previousClose:135.80, openPrice:136.20, highPrice:139.80, lowPrice:135.60, volume:14200000, marketCap:381000000000,  sector:"Technology",    exchange:"NYSE",   description:"Database software, cloud infrastructure and ERP." },
  { symbol:"INTC",  companyName:"Intel Corporation",    currentPrice:29.48,  previousClose:30.12,  openPrice:30.00,  highPrice:30.20,  lowPrice:29.20,  volume:52100000, marketCap:125000000000,  sector:"Technology",    exchange:"NASDAQ", description:"Semiconductor chips and computing solutions." },

  // ── Finance ────────────────────────────────────────────────────
  { symbol:"JPM",   companyName:"JPMorgan Chase & Co.", currentPrice:224.50, previousClose:225.90, openPrice:225.20, highPrice:226.80, lowPrice:223.40, volume:9800000,  marketCap:648000000000,  sector:"Finance",       exchange:"NYSE",   description:"Global investment banking and financial services." },
  { symbol:"BAC",   companyName:"Bank of America Corp.",currentPrice:43.82,  previousClose:43.20,  openPrice:43.30,  highPrice:44.10,  lowPrice:43.00,  volume:38400000, marketCap:342000000000,  sector:"Finance",       exchange:"NYSE",   description:"Retail banking, investment banking and wealth management." },
  { symbol:"GS",    companyName:"Goldman Sachs Group",  currentPrice:498.60, previousClose:492.40, openPrice:493.80, highPrice:501.20, lowPrice:492.00, volume:3200000,  marketCap:165000000000,  sector:"Finance",       exchange:"NYSE",   description:"Investment banking, securities and asset management." },
  { symbol:"V",     companyName:"Visa Inc.",            currentPrice:285.40, previousClose:282.60, openPrice:283.20, highPrice:286.80, lowPrice:282.40, volume:7600000,  marketCap:582000000000,  sector:"Finance",       exchange:"NYSE",   description:"Global payment technology and digital transactions." },
  { symbol:"MA",    companyName:"Mastercard Inc.",      currentPrice:472.80, previousClose:468.20, openPrice:469.40, highPrice:475.60, lowPrice:468.00, volume:4800000,  marketCap:432000000000,  sector:"Finance",       exchange:"NYSE",   description:"Worldwide payment network and financial technology." },

  // ── Healthcare ─────────────────────────────────────────────────
  { symbol:"JNJ",   companyName:"Johnson & Johnson",    currentPrice:158.40, previousClose:157.20, openPrice:157.60, highPrice:159.40, lowPrice:157.00, volume:8200000,  marketCap:381000000000,  sector:"Healthcare",    exchange:"NYSE",   description:"Pharmaceutical, medical devices and consumer health." },
  { symbol:"PFE",   companyName:"Pfizer Inc.",          currentPrice:26.84,  previousClose:27.10,  openPrice:27.00,  highPrice:27.20,  lowPrice:26.60,  volume:42600000, marketCap:152000000000,  sector:"Healthcare",    exchange:"NYSE",   description:"Global biopharmaceutical company." },
  { symbol:"ABBV",  companyName:"AbbVie Inc.",          currentPrice:172.60, previousClose:170.40, openPrice:171.00, highPrice:173.80, lowPrice:170.20, volume:7100000,  marketCap:304000000000,  sector:"Healthcare",    exchange:"NYSE",   description:"Biopharmaceuticals and specialty drugs." },
  { symbol:"UNH",   companyName:"UnitedHealth Group",   currentPrice:524.80, previousClose:520.40, openPrice:521.60, highPrice:527.20, lowPrice:520.00, volume:3800000,  marketCap:482000000000,  sector:"Healthcare",    exchange:"NYSE",   description:"Health insurance and managed care services." },
  { symbol:"MRNA",  companyName:"Moderna Inc.",         currentPrice:72.40,  previousClose:71.20,  openPrice:71.60,  highPrice:73.40,  lowPrice:71.00,  volume:12400000, marketCap:28000000000,   sector:"Healthcare",    exchange:"NASDAQ", description:"mRNA therapeutics and vaccines." },

  // ── Consumer ───────────────────────────────────────────────────
  { symbol:"TSLA",  companyName:"Tesla Inc.",           currentPrice:248.60, previousClose:253.26, openPrice:252.00, highPrice:254.80, lowPrice:247.20, volume:98400000, marketCap:793000000000,  sector:"Consumer",      exchange:"NASDAQ", description:"Electric vehicles, energy storage and solar." },
  { symbol:"NKE",   companyName:"Nike Inc.",            currentPrice:76.20,  previousClose:75.40,  openPrice:75.60,  highPrice:77.00,  lowPrice:75.20,  volume:9200000,  marketCap:114000000000,  sector:"Consumer",      exchange:"NYSE",   description:"Athletic footwear, apparel and equipment." },
  { symbol:"SBUX",  companyName:"Starbucks Corporation",currentPrice:84.60,  previousClose:83.80,  openPrice:84.00,  highPrice:85.40,  lowPrice:83.60,  volume:7800000,  marketCap:96000000000,   sector:"Consumer",      exchange:"NASDAQ", description:"Coffeehouse chain and global beverage brand." },
  { symbol:"MCD",   companyName:"McDonald's Corporation",currentPrice:294.80,previousClose:292.40, openPrice:293.20, highPrice:296.40, lowPrice:292.00, volume:4200000,  marketCap:214000000000,  sector:"Consumer",      exchange:"NYSE",   description:"Global fast food restaurant franchise." },
  { symbol:"COST",  companyName:"Costco Wholesale",     currentPrice:892.40, previousClose:885.60, openPrice:887.20, highPrice:896.80, lowPrice:884.80, volume:3100000,  marketCap:394000000000,  sector:"Consumer",      exchange:"NASDAQ", description:"Membership-based warehouse retail chain." },

  // ── Energy ─────────────────────────────────────────────────────
  { symbol:"XOM",   companyName:"Exxon Mobil Corporation",currentPrice:118.40,previousClose:117.20,openPrice:117.60, highPrice:119.60, lowPrice:117.00, volume:18200000, marketCap:472000000000,  sector:"Energy",        exchange:"NYSE",   description:"Integrated oil, gas and petrochemical company." },
  { symbol:"CVX",   companyName:"Chevron Corporation",  currentPrice:152.80, previousClose:151.40, openPrice:151.80, highPrice:154.00, lowPrice:151.20, volume:10400000, marketCap:278000000000,  sector:"Energy",        exchange:"NYSE",   description:"Integrated energy and chemicals company." },
  { symbol:"NEE",   companyName:"NextEra Energy Inc.",  currentPrice:74.20,  previousClose:73.60,  openPrice:73.80,  highPrice:74.80,  lowPrice:73.40,  volume:12800000, marketCap:151000000000,  sector:"Energy",        exchange:"NYSE",   description:"Renewable energy and electric utilities." },

  // ── Communication ──────────────────────────────────────────────
  { symbol:"NFLX",  companyName:"Netflix Inc.",         currentPrice:682.40, previousClose:675.80, openPrice:677.20, highPrice:686.80, lowPrice:675.00, volume:5800000,  marketCap:294000000000,  sector:"Communication", exchange:"NASDAQ", description:"Streaming entertainment and content production." },
  { symbol:"DIS",   companyName:"Walt Disney Company",  currentPrice:98.60,  previousClose:97.40,  openPrice:97.80,  highPrice:99.40,  lowPrice:97.20,  volume:14200000, marketCap:180000000000,  sector:"Communication", exchange:"NYSE",   description:"Entertainment, theme parks and streaming (Disney+)." },
  { symbol:"T",     companyName:"AT&T Inc.",            currentPrice:22.40,  previousClose:22.10,  openPrice:22.20,  highPrice:22.60,  lowPrice:22.00,  volume:42800000, marketCap:160000000000,  sector:"Communication", exchange:"NYSE",   description:"Telecom, wireless and media services." },

  // ── Industrial ─────────────────────────────────────────────────
  { symbol:"BA",    companyName:"Boeing Company",       currentPrice:172.40, previousClose:170.20, openPrice:171.00, highPrice:174.00, lowPrice:170.00, volume:8600000,  marketCap:131000000000,  sector:"Industrial",    exchange:"NYSE",   description:"Commercial jets, defense and space systems." },
  { symbol:"CAT",   companyName:"Caterpillar Inc.",     currentPrice:368.40, previousClose:364.80, openPrice:365.60, highPrice:370.40, lowPrice:364.40, volume:4200000,  marketCap:182000000000,  sector:"Industrial",    exchange:"NYSE",   description:"Construction and mining machinery." },
  { symbol:"GE",    companyName:"GE Aerospace",         currentPrice:192.80, previousClose:190.40, openPrice:191.20, highPrice:194.40, lowPrice:190.00, volume:6800000,  marketCap:210000000000,  sector:"Industrial",    exchange:"NYSE",   description:"Jet engines, avionics and aerospace systems." },

  // ── Materials & Real Estate ────────────────────────────────────
  { symbol:"AMT",   companyName:"American Tower Corp.", currentPrice:186.40, previousClose:184.60, openPrice:185.20, highPrice:187.60, lowPrice:184.40, volume:3800000,  marketCap:171000000000,  sector:"Real Estate",   exchange:"NYSE",   description:"Global wireless infrastructure and cell towers." },
  { symbol:"PLD",   companyName:"Prologis Inc.",        currentPrice:118.60, previousClose:117.20, openPrice:117.60, highPrice:119.60, lowPrice:117.00, volume:5200000,  marketCap:108000000000,  sector:"Real Estate",   exchange:"NYSE",   description:"Industrial real estate and logistics facilities." },
  { symbol:"LIN",   companyName:"Linde plc",            currentPrice:448.20, previousClose:444.80, openPrice:445.60, highPrice:450.40, lowPrice:444.40, volume:3100000,  marketCap:214000000000,  sector:"Materials",     exchange:"NYSE",   description:"Industrial gases and engineering solutions." },
  { symbol:"BRK.B", companyName:"Berkshire Hathaway",   currentPrice:438.60, previousClose:435.40, openPrice:436.20, highPrice:440.40, lowPrice:435.00, volume:4200000,  marketCap:962000000000,  sector:"Finance",       exchange:"NYSE",   description:"Diversified holding company (Buffett)." },
  { symbol:"WMT",   companyName:"Walmart Inc.",         currentPrice:82.40,  previousClose:81.60,  openPrice:81.80,  highPrice:83.00,  lowPrice:81.40,  volume:18200000, marketCap:662000000000,  sector:"Consumer",      exchange:"NYSE",   description:"Global retail and e-commerce giant." },
  { symbol:"HD",    companyName:"Home Depot Inc.",      currentPrice:364.80, previousClose:361.20, openPrice:362.00, highPrice:366.80, lowPrice:361.00, volume:4800000,  marketCap:362000000000,  sector:"Consumer",      exchange:"NYSE",   description:"Home improvement retail stores." },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected for seeding...");

    await Stock.deleteMany({});
    console.log("🗑️  Cleared existing stocks");

    const inserted = await Stock.insertMany(stocks);
    console.log(`🌱 Seeded ${inserted.length} stocks successfully!`);

    // Log sector breakdown
    const sectors = {};
    stocks.forEach((s) => {
      sectors[s.sector] = (sectors[s.sector] || 0) + 1;
    });
    console.log("\n📊 Sector Breakdown:");
    Object.entries(sectors).forEach(([s, c]) => console.log(`   ${s}: ${c} stocks`));

    mongoose.connection.close();
    console.log("\n✅ Seeding complete. Connection closed.");
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedDB();
