export interface FestivalEvent {
  id: string;
  name: string;
  name_tamil: string;
  type: 'festival' | 'school_holiday' | 'pilgrimage' | 'harvest' | 'mass_gathering';
  week_numbers: number[];          // ISO weeks when event occurs
  month: number;                   // primary month
  districts_affected: string[];    // which districts see population surge
  disease_risk_multipliers: {
    dengue?: number;
    gastroenteritis?: number;
    respiratory?: number;
    heat_stroke?: number;
    scrub_typhus?: number;
  };
  population_surge_estimate: number; // extra people in affected areas
  historical_disease_spike_pct: number; // avg % increase in cases post-event
  description: string;
  description_tamil: string;
  precautions: string[];
  precautions_tamil: string[];
}

export const TN_FESTIVAL_CALENDAR: FestivalEvent[] = [
  {
    id: 'PONGAL',
    name: 'Pongal Festival',
    name_tamil: 'பொங்கல் திருவிழா',
    type: 'harvest',
    week_numbers: [2, 3],
    month: 1,
    districts_affected: ['All 38 districts'],
    disease_risk_multipliers: {
      gastroenteritis: 1.45,
      respiratory: 1.20,
    },
    population_surge_estimate: 5000000,
    historical_disease_spike_pct: 28,
    description: 'Tamil harvest festival. Mass outdoor cooking and gatherings. ORS and paracetamol pharmacy sales spike 3 weeks before due to stocking.',
    description_tamil: 'தமிழ் அறுவடை திருவிழா. வெளியிடங்களில் பாரம்பரிய சமையல் மற்றும் கூட்டம். திருவிழாவிற்கு 3 வாரங்கள் முன் மருந்தக விற்பனை அதிகரிக்கும்.',
    precautions: ['Ensure clean water for cooking','Avoid food kept >2 hours outdoor','Check ORS stock 4 weeks ahead'],
    precautions_tamil: ['சமையலுக்கு சுத்தமான தண்ணீர் உறுதி செய்யுங்கள்','2 மணி நேரத்திற்கு மேல் வெளியில் வைத்த உணவை தவிர்க்கவும்','4 வாரங்கள் முன் ORS இருப்பை சரிபாருங்கள்']
  },
  {
    id: 'KARTHIGAI',
    name: 'Karthigai Deepam — Tiruvannamalai',
    name_tamil: 'கார்த்திகை தீபம் — திருவண்ணாமலை',
    type: 'pilgrimage',
    week_numbers: [47, 48],
    month: 11,
    districts_affected: ['Tiruvannamalai','Vellore','Villuppuram','Kanchipuram','Chennai'],
    disease_risk_multipliers: {
      dengue: 1.35,
      respiratory: 1.40,
      gastroenteritis: 1.25,
    },
    population_surge_estimate: 3500000,
    historical_disease_spike_pct: 35,
    description: 'Largest hill beacon festival. 3.5M pilgrims circumambulate Arunachala. Coincides with peak dengue season (Oct-Nov). High respiratory risk from crowd density.',
    description_tamil: 'மிகப்பெரிய மலை விளக்கு திருவிழா. 35 லட்சம் யாத்ரிகர்கள் அண்ணாமலையை வலம் வருவார்கள். டெங்கு உச்ச பருவத்தில் நடக்கிறது.',
    precautions: ['Pre-position dengue kits in Tiruvannamalai 6 weeks ahead','Deploy 20 extra medical teams along circumambulation route','Issue pre-event health advisory in Tamil'],
    precautions_tamil: ['6 வாரங்கள் முன்பே திருவண்ணாமலையில் டெங்கு கொட்டகங்களை நிலைநிறுத்தவும்']
  },
  {
    id: 'PANGUNI_UTTIRAM',
    name: 'Panguni Uttiram — Palani',
    name_tamil: 'பங்குனி உத்திரம் — பழனி',
    type: 'pilgrimage',
    week_numbers: [11, 12],
    month: 3,
    districts_affected: ['Dindigul','Coimbatore','Madurai','Tiruchirappalli'],
    disease_risk_multipliers: {
      heat_stroke: 1.65,
      gastroenteritis: 1.30,
    },
    population_surge_estimate: 2000000,
    historical_disease_spike_pct: 42,
    description: 'Major pilgrimage to Palani Murugan temple. April heat + 2M pilgrims = highest heat stroke risk of the year.',
    description_tamil: 'பழனி முருகன் கோவிலுக்கு முக்கிய யாத்திரை. ஏப்ரல் வெப்பம் + 20 லட்சம் யாத்ரிகர்கள் = ஆண்டின் அதிக வெப்ப அடிப்பு ஆபத்து.',
    precautions: ['Deploy heat stroke units along Palani route','Water kiosks every 500m','Pre-alert Dindigul district hospitals'],
    precautions_tamil: ['பழனி வழியில் வெப்ப அடிப்பு சிகிச்சை மையங்களை நிறுவுங்கள்']
  },
  {
    id: 'DIWALI',
    name: 'Diwali',
    name_tamil: 'தீபாவளி',
    type: 'festival',
    week_numbers: [43, 44],
    month: 10,
    districts_affected: ['All 38 districts'],
    disease_risk_multipliers: {
      respiratory: 1.55,
      dengue: 1.20,
    },
    population_surge_estimate: 0,
    historical_disease_spike_pct: 22,
    description: 'Festival of lights. Fireworks cause respiratory illness spike. Falls during dengue peak season (Oct-Dec). Pharmacy sales spike 2 weeks before.',
    description_tamil: 'வெடிகட்டிகளால் சுவாச நோய் அதிகரிக்கும். டெங்கு உச்ச பருவத்தில் வருகிறது.',
    precautions: ['Stock bronchodilators 3 weeks ahead','Issue advisory for asthma/COPD patients','Deploy extra respiratory care units'],
    precautions_tamil: ['3 வாரங்கள் முன் மூச்சு மருந்துகளை இருப்பு வையுங்கள்']
  },
  {
    id: 'SCHOOL_REOPENING_JUNE',
    name: 'School Reopening — June',
    name_tamil: 'பள்ளி திறப்பு — ஜூன்',
    type: 'school_holiday',
    week_numbers: [23, 24, 25],
    month: 6,
    districts_affected: ['All 38 districts'],
    disease_risk_multipliers: {
      respiratory: 1.45,
      gastroenteritis: 1.35,
    },
    population_surge_estimate: 0,
    historical_disease_spike_pct: 31,
    description: 'School reopening after summer break. Children returning from varied regions triggers respiratory and gastroenteritis clusters. First 3 weeks critical.',
    description_tamil: 'கோடை விடுமுறைக்கு பிறகு பள்ளி திறப்பு. சுவாச மற்றும் வயிற்றுப்போக்கு அதிகரிக்கும்.',
    precautions: ['School health inspection 2 weeks before reopening','Water quality check in all school canteens','Deploy school health nurses'],
    precautions_tamil: ['திறப்பதற்கு 2 வாரங்கள் முன் பள்ளி சுகாதார ஆய்வு']
  },
  {
    id: 'SUMMER_VACATION',
    name: 'Summer School Holidays',
    name_tamil: 'கோடை விடுமுறை',
    type: 'school_holiday',
    week_numbers: [17, 18, 19, 20, 21, 22],
    month: 4,
    districts_affected: ['All 38 districts'],
    disease_risk_multipliers: {
      heat_stroke: 1.55,
      gastroenteritis: 1.25,
    },
    population_surge_estimate: 0,
    historical_disease_spike_pct: 28,
    description: 'Summer holidays April-May. Children outdoors during peak heat. Heat stroke risk highest for under-15 age group.',
    description_tamil: 'ஏப்ரல்-மே கோடை விடுமுறை. குழந்தைகள் வெயிலில் விளையாடுவதால் வெப்ப அடிப்பு ஆபத்து.',
    precautions: ['Distribute heat precaution leaflets in schools before holiday','Activate summer health camps','Alert Anganwadi workers'],
    precautions_tamil: ['விடுமுறைக்கு முன் பள்ளிகளில் வெப்ப எச்சரிக்கை துண்டுப்பிரசுரம் வழங்கவும்']
  },
  {
    id: 'KAVERI_DELTA_HARVEST',
    name: 'Kaveri Delta Harvest Season',
    name_tamil: 'காவேரி டெல்டா அறுவடை பருவம்',
    type: 'harvest',
    week_numbers: [44, 45, 46, 47, 48],
    month: 11,
    districts_affected: ['Thanjavur','Tiruvarur','Nagapattinam','Mayiladuthurai','Tiruchirapalli'],
    disease_risk_multipliers: {
      scrub_typhus: 2.10,
      dengue: 1.25,
    },
    population_surge_estimate: 500000,
    historical_disease_spike_pct: 65,
    description: 'Rice harvest in Kaveri delta. Field workers in dense vegetation = highest scrub typhus risk of the year for delta districts. 2.1× multiplier.',
    description_tamil: 'காவேரி டெல்டாவில் நெல் அறுவடை. வயல் வேலையாட்கள் அடர்ந்த தாவரங்களில் = ஆண்டின் அதிக ஸ்க்ரப் டைபஸ் ஆபத்து.',
    precautions: ['Pre-stock doxycycline in all Kaveri delta PHCs 6 weeks before harvest','Train village health nurses on scrub typhus recognition','Issue advisory to agricultural workers in Tamil'],
    precautions_tamil: ['அறுவடைக்கு 6 வாரங்கள் முன் காவேரி டெல்டா PHC-களில் டாக்சிசைக்ளின் இருப்பு வையுங்கள்']
  },
  {
    id: 'THIRUCHENDUR_PILGRIMAGE',
    name: 'Thiruchendur Skanda Sashti',
    name_tamil: 'திருச்செந்தூர் ஸ்கந்த சஷ்டி',
    type: 'pilgrimage',
    week_numbers: [43, 44],
    month: 10,
    districts_affected: ['Thoothukudi','Tirunelveli','Virudhunagar','Ramanathapuram'],
    disease_risk_multipliers: {
      gastroenteritis: 1.40,
      dengue: 1.30,
    },
    population_surge_estimate: 1500000,
    historical_disease_spike_pct: 33,
    description: 'Skanda Sashti at Thiruchendur. 1.5M pilgrims. Coastal food + October dengue season = combined risk.',
    description_tamil: 'திருச்செந்தூர் ஸ்கந்த சஷ்டி. 15 லட்சம் யாத்ரிகர்கள். கடலோர உணவு + டெங்கு பருவம்.',
    precautions: ['Deploy mobile medical vans at Thiruchendur','Pre-stock dengue kits + ORS in Thoothukudi','Water quality testing at all food stalls'],
    precautions_tamil: ['திருச்செந்தூரில் மொபைல் மருத்துவ வேன்களை நிறுத்தவும்']
  },
  {
    id: 'NORTHEAST_MONSOON_ONSET',
    name: 'Northeast Monsoon Onset',
    name_tamil: 'வடகிழக்கு பருவமழை தொடக்கம்',
    type: 'mass_gathering',
    week_numbers: [40, 41, 42],
    month: 10,
    districts_affected: ['Chennai','Tiruvallur','Kanchipuram','Chengalpattu','Cuddalore','Nagapattinam'],
    disease_risk_multipliers: {
      dengue: 1.85,
      gastroenteritis: 1.60,
      respiratory: 1.30,
    },
    population_surge_estimate: 0,
    historical_disease_spike_pct: 78,
    description: 'Northeast monsoon onset in coastal Tamil Nadu. HIGHEST dengue risk event of the year. Aedes breeding surges 14 days after first heavy rain.',
    description_tamil: 'கடலோர தமிழ்நாட்டில் வடகிழக்கு பருவமழை தொடக்கம். ஆண்டின் அதிக டெங்கு ஆபத்து நிகழ்வு.',
    precautions: ['Pre-position dengue kits 8 weeks before monsoon onset','Activate vector control operations in all coastal districts','Issue flood preparedness advisory'],
    precautions_tamil: ['பருவமழைக்கு 8 வாரங்கள் முன் டெங்கு கொட்டகங்களை நிலைநிறுத்தவும்']
  },
  {
    id: 'PALANI_THAIPUSAM',
    name: 'Thaipusam Kavadi',
    name_tamil: 'தைப்பூசம் கவடி',
    type: 'pilgrimage',
    week_numbers: [4, 5],
    month: 1,
    districts_affected: ['Dindigul','Coimbatore','Madurai','Salem'],
    disease_risk_multipliers: {
      heat_stroke: 1.35,
      respiratory: 1.25,
    },
    population_surge_estimate: 1200000,
    historical_disease_spike_pct: 20,
    description: 'Thaipusam Kavadi processions. January but concentrated gatherings.',
    description_tamil: 'தைப்பூசம் கவடி ஊர்வலங்கள். ஜனவரியில் கூட்டம்.',
    precautions: ['Deploy first aid posts along procession routes','Stock ORS and paracetamol'],
    precautions_tamil: ['ஊர்வல வழியில் முதல் உதவி கேந்திரங்கள் நிறுவுங்கள்']
  },
];
