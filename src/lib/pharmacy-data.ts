export interface Medicine {
  id: string;
  name: string;
  name_tamil: string;
  category: string;
  disease: string;
  description: string;
  description_tamil: string;
  government_free: boolean;
  unit: string;
  price_private_inr: number;
  stock_state: 'ADEQUATE' | 'LOW' | 'CRITICAL';
  stock_pct: number;
  low_stock_districts: string[];
  available_at: string[];
  how_to_get: string;
  how_to_get_tamil: string;
}

export const ESSENTIAL_MEDICINES: Medicine[] = [
  { id:'M001', name:'Dengue NS1 Rapid Test Kit',
    name_tamil:'டெங்கு NS1 விரைவு சோதனை கொட்டகம்',
    category:'Diagnostics', disease:'dengue',
    description:'Rapid antigen test for early dengue detection (Day 1-5)',
    description_tamil:'டெங்கு ஆரம்ப கண்டறிதலுக்கான விரைவு சோதனை',
    government_free: true,
    unit:'kits', price_private_inr: 350,
    stock_state:'ADEQUATE', stock_pct: 78,
    low_stock_districts:['Ariyalur','Perambalur'],
    available_at:['Government Hospital (FREE)','PHC (FREE)','Private Lab (₹350)'],
    how_to_get:'Show Aadhar + symptoms at nearest PHC/Govt Hospital',
    how_to_get_tamil:'ஆதார் மற்றும் அறிகுறிகளுடன் அருகிலுள்ள PHC செல்லுங்கள்' },
  { id:'M002', name:'IV Fluid — Normal Saline 500ml',
    name_tamil:'IV திரவம் — சாதாரண உப்பு 500ml',
    category:'IV Fluids', disease:'dengue',
    description:'Essential for dengue hemorrhagic fever management',
    description_tamil:'டெங்கு காய்ச்சல் சிகிச்சைக்கு அவசியமான IV திரவம்',
    government_free: true,
    unit:'bottles', price_private_inr: 65,
    stock_state:'ADEQUATE', stock_pct: 82,
    low_stock_districts:['Theni'],
    available_at:['Government Hospital (FREE)','PHC (FREE)'],
    how_to_get:'Admitted patients receive automatically at government hospitals',
    how_to_get_tamil:'அரசு மருத்துவமனையில் சேர்க்கப்பட்ட நோயாளிகளுக்கு தானாக வழங்கப்படும்' },
  { id:'M003', name:'Paracetamol 500mg Tablets',
    name_tamil:'பாராசிட்டமால் 500mg மாத்திரைகள்',
    category:'OTC Medicines', disease:'all',
    description:'First-line fever management. Do NOT take with dengue without doctor advice.',
    description_tamil:'காய்ச்சல் மேலாண்மைக்கான முதல் மருந்து. டெங்குவில் மருத்துவர் ஆலோசனை இல்லாமல் எடுக்காதீர்கள்.',
    government_free: true,
    unit:'strip of 10', price_private_inr: 12,
    stock_state:'ADEQUATE', stock_pct: 91,
    low_stock_districts:[],
    available_at:['All Pharmacies (₹12)','PHC (FREE)','Government Hospital (FREE)'],
    how_to_get:'Available over-the-counter at all pharmacies',
    how_to_get_tamil:'அனைத்து மருந்தகங்களிலும் கிடைக்கும்' },
  { id:'M004', name:'ORS Sachets (WHO Formula)',
    name_tamil:'ORS பாக்கெட்கள் (WHO சூத்திரம்)',
    category:'OTC Medicines', disease:'gastroenteritis',
    description:'Oral Rehydration Salts — prevents dehydration in diarrhea',
    description_tamil:'வாய்வழி நீரேற்ற உப்புகள் — வயிற்றுப்போக்கில் நீர்ச்சத்து இழப்பை தடுக்கும்',
    government_free: true,
    unit:'sachet', price_private_inr: 8,
    stock_state:'LOW', stock_pct: 52,
    low_stock_districts:['Cuddalore','Nagapattinam','Tiruvarur'],
    available_at:['All Pharmacies (₹8)','PHC (FREE)','Anganwadi Centers (FREE)'],
    how_to_get:'Available free at all PHCs and Anganwadi centers',
    how_to_get_tamil:'அனைத்து PHC மற்றும் அங்கன்வாடி மையங்களில் இலவசமாக கிடைக்கும்' },
  { id:'M005', name:'Doxycycline 100mg (Scrub Typhus)',
    name_tamil:'டாக்சிசைக்ளின் 100mg (ஸ்க்ரப் டைபஸ்)',
    category:'Antibiotics', disease:'scrub_typhus',
    description:'First-line antibiotic for scrub typhus. Prescription required.',
    description_tamil:'ஸ்க்ரப் டைபஸுக்கான முதல் நிலை நுண்ணுயிர் எதிர்ப்பி. மருத்துவர் சீட்டு தேவை.',
    government_free: true,
    unit:'strip of 10', price_private_inr: 28,
    stock_state:'ADEQUATE', stock_pct: 71,
    low_stock_districts:['Nilgiris','Krishnagiri'],
    available_at:['Government Hospital (FREE)','PHC (FREE)','Private Pharmacy (₹28)'],
    how_to_get:'Requires doctor prescription. Available free at PHCs in forest-fringe districts.',
    how_to_get_tamil:'மருத்துவர் சீட்டு தேவை. காடு அருகாமை மாவட்டங்களில் PHC-ல் இலவசமாக கிடைக்கும்.' },
  { id:'M006', name:'Electrolyte Powder (Heat Stroke)',
    name_tamil:'எலக்ட்ரோலைட் பவுடர் (வெப்ப அடிப்பு)',
    category:'OTC Medicines', disease:'heat_stroke',
    description:'Replenishes electrolytes lost during heat exposure',
    description_tamil:'வெப்பத்தில் இழந்த எலக்ட்ரோலைட்களை நிரப்புகிறது',
    government_free: false,
    unit:'sachet', price_private_inr: 15,
    stock_state:'ADEQUATE', stock_pct: 88,
    low_stock_districts:[],
    available_at:['All Pharmacies (₹15)','Medical Stores'],
    how_to_get:'Available over-the-counter. Drink plenty of water with this.',
    how_to_get_tamil:'அனைத்து மருந்தகங்களிலும் கிடைக்கும். நிறைய தண்ணீர் குடிக்கவும்.' },
  { id:'M007', name:'Azithromycin 500mg (Respiratory)',
    name_tamil:'அஜித்ரோமைசின் 500mg (சுவாச நோய்)',
    category:'Antibiotics', disease:'respiratory',
    description:'For bacterial respiratory infections. Doctor prescription required.',
    description_tamil:'சுவாச தொற்றுகளுக்கு. மருத்துவர் சீட்டு தேவை.',
    government_free: true,
    unit:'strip of 3', price_private_inr: 65,
    stock_state:'ADEQUATE', stock_pct: 79,
    low_stock_districts:[],
    available_at:['Government Hospital (FREE)','PHC (FREE)','Private Pharmacy (₹65)'],
    how_to_get:'Prescription required. Free at government hospitals.',
    how_to_get_tamil:'மருத்துவர் சீட்டு தேவை. அரசு மருத்துவமனைகளில் இலவசம்.' },
  { id:'M008', name:'Mosquito Repellent Cream (Vector Control)',
    name_tamil:'கொசு விரட்டி க்ரீம் (கொசு கட்டுப்பாடு)',
    category:'Preventive', disease:'dengue',
    description:'DEET-based repellent. Prevents Aedes mosquito bites.',
    description_tamil:'DEET அடிப்படையிலான விரட்டி. ஏடிஸ் கொசு கடியை தடுக்கும்.',
    government_free: false,
    unit:'tube 50g', price_private_inr: 85,
    stock_state:'ADEQUATE', stock_pct: 95,
    low_stock_districts:[],
    available_at:['All Pharmacies (₹85)','General Stores','Online'],
    how_to_get:'Apply to exposed skin during morning and evening hours when Aedes is most active.',
    how_to_get_tamil:'ஏடிஸ் கொசு அதிகமாக இருக்கும் காலை மற்றும் மாலை நேரங்களில் தோலில் தடவுங்கள்.' },
  { id:'M009', name:'Antipyretic Syrup (Paediatric)',
    name_tamil:'காய்ச்சல் குறைக்கும் சிரப் (குழந்தைகளுக்கு)',
    category:'OTC Medicines', disease:'all',
    description:'For children under 12 with fever. Paracetamol-based syrup.',
    description_tamil:'காய்ச்சலுடன் கூடிய 12 வயதுக்கு குறைந்த குழந்தைகளுக்கு.',
    government_free: true,
    unit:'bottle 100ml', price_private_inr: 48,
    stock_state:'ADEQUATE', stock_pct: 83,
    low_stock_districts:[],
    available_at:['All Pharmacies (₹48)','PHC (FREE)','Anganwadi (FREE)'],
    how_to_get:'Available free at PHCs for children below 12 with fever.',
    how_to_get_tamil:'12 வயதுக்கு குறைந்த குழந்தைகளுக்கு PHC-ல் இலவசம்.' },
  { id:'M010', name:'Dengue Prevention Kit (Government)',
    name_tamil:'டெங்கு தடுப்பு கொட்டகம் (அரசு)',
    category:'Preventive Kit', disease:'dengue',
    description:'Contains: NS1 test, ORS, Paracetamol, Repellent, Information leaflet',
    description_tamil:'உள்ளடக்கம்: NS1 சோதனை, ORS, பாராசிட்டமால், விரட்டி, தகவல் துண்டுப்பிரசுரம்',
    government_free: true,
    unit:'kit', price_private_inr: 0,
    stock_state:'LOW', stock_pct: 44,
    low_stock_districts:['Tiruvallur','Kanchipuram','Chengalpattu'],
    available_at:['District Health Office (FREE)','Government Hospital (FREE)'],
    how_to_get:'Available at District Health Offices during dengue season (Aug-Dec)',
    how_to_get_tamil:'டெங்கு பருவத்தில் (ஆகஸ்ட்-டிசம்பர்) மாவட்ட சுகாதார அலுவலகத்தில் இலவசமாக கிடைக்கும்.' },
];

export interface Pharmacy {
  id: string;
  name: string;
  name_tamil: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  hours: string;
  type: 'chain' | 'government' | 'local';
  accepts_gov_prescription: boolean;
  brands: string[];
  delivers: boolean;
  delivery_radius_km: number;
  note?: string;
  distance_km?: number;
}

export const TN_PHARMACIES: Pharmacy[] = [
  { id:'PH001', name:'Apollo Pharmacy — Adyar',
    name_tamil:'அப்போலோ மருந்தகம் — அடையாறு',
    district:'Chennai', address:'15 LB Road, Adyar, Chennai - 600020',
    lat:13.0012, lng:80.2565, phone:'1860-500-0101',
    hours:'24 Hours', type:'chain',
    accepts_gov_prescription: true,
    brands:['Apollo'],
    delivers: true, delivery_radius_km: 5 },
  { id:'PH002', name:'MedPlus — Vadapalani',
    name_tamil:'மெட்பிளஸ் — வடபழனி',
    district:'Chennai', address:'Vadapalani Junction, Chennai - 600026',
    lat:13.0523, lng:80.2120, phone:'1800-419-1999',
    hours:'8:00 AM – 11:00 PM', type:'chain',
    accepts_gov_prescription: true,
    brands:['MedPlus'], delivers: true, delivery_radius_km: 3 },
  { id:'PH003', name:'Government Central Pharmacy — Park Town',
    name_tamil:'அரசு மத்திய மருந்தகம் — பார்க் டவுன்',
    district:'Chennai', address:'Park Town, Chennai - 600003',
    lat:13.0817, lng:80.2785, phone:'044-25322345',
    hours:'8:00 AM – 8:00 PM (Mon–Sat)', type:'government',
    accepts_gov_prescription: true,
    brands:['TNMSC Government Medicines'],
    delivers: false, delivery_radius_km: 0,
    note:'All government medicines available FREE with valid prescription' },
  { id:'PH004', name:'Wellness Forever — Anna Nagar',
    name_tamil:'வெல்னெஸ் ஃபாரெவர் — அண்ணா நகர்',
    district:'Chennai', address:'2nd Avenue, Anna Nagar, Chennai - 600040',
    lat:13.0850, lng:80.2101, phone:'044-26220123',
    hours:'8:00 AM – 10:00 PM', type:'chain',
    accepts_gov_prescription: false,
    brands:['Wellness Forever'], delivers: true, delivery_radius_km: 4 },
  { id:'PH005', name:'Nilgiris Pharmacy — T Nagar',
    name_tamil:'நீலகிரி மருந்தகம் — டி நகர்',
    district:'Chennai', address:'Usman Road, T Nagar, Chennai - 600017',
    lat:13.0418, lng:80.2332, phone:'044-28140234',
    hours:'8:00 AM – 10:00 PM', type:'chain',
    accepts_gov_prescription: true,
    brands:['Nilgiris'], delivers: false, delivery_radius_km: 0 },
];
