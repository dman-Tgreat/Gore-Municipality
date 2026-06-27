export type LocaleCode = 'en' | 'am' | 'om';

export const locales: { code: LocaleCode; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'am', label: 'Amharic', native: 'አማርኛ' },
  { code: 'om', label: 'Afan Oromo', native: 'Afaan Oromoo' },
];

export type Messages = typeof enMessages;

const enMessages = {
  header: {
    home: 'Home',
    about: 'About',
    services: 'Services',
    news: 'News',
    contact: 'Contact',
  },
  hero: {
    welcome: 'Welcome to the Official Portal of Gore Woreda',
    slides: [
      'Empowering the Gore Woreda community through modern digital administration.',
      'Promoting local agricultural development and sustainable resources.',
      'Efficient and transparent civil registry and licensing services for everyone.',
    ],
    exploreServices: 'Explore Services',
  },
  stats: {
    title: 'Woreda Indicators',
    subtitle: 'Gore At A Glance',
    stats: [
      { label: 'Total Population', value: 'Over 90,000', detail: 'Urban & rural settlements combined' },
      { label: 'Total Area Coverage', value: 'Approx. 650 km²', detail: 'Rich highland forest geography' },
      { label: 'Administrative Division', value: '22 Kebeles', detail: 'Governed municipal sectors' },
      { label: 'Primary Economic Engine', value: 'Agriculture', detail: 'Premium Tea, Coffee, & Apiculture' },
    ],
  },
  services: {
    latestNews: 'Latest News',
    latestNewsDesc: 'Stay updated with the recent public notices and community announcements.',
    noUpdates: 'No recent updates',
    municipalServices: 'Municipal Services',
    municipalServicesDesc: 'Apply for certificates, business licenses, and permit guidelines online.',
    viewAll: 'View all services →',
    aboutGore: 'About Gore',
    aboutGoreDesc: 'Discover the rich history and geographic beauty of our historic woreda.',
    readHistory: 'Read History →',
  },
  news: {
    title: 'News, Notices & Woreda Profile',
    subtitle: 'Stay fully informed on administrative developments, regional announcements, and the rich cultural landscape of Gore.',
    latestPress: 'Latest Press Releases',
    quickFacts: 'Gore Quick Facts',
    capital: 'Administrative Capital',
    capitalValue: 'Gore Town (Capital of Gore Woreda, Illubabor Zone, Oromia)',
    historicalRoots: 'Historical Roots',
    historicalRootsValue: "Founded in the late 19th Century around Ras Tessema Nadew's historical administrative compound.",
    primaryEconomics: 'Primary Economics',
    primaryEconomicsValue: 'Renowned for coffee trade legacy via historical Gambela Baro river channels, organic honey cultivation, and local tea manufacturing.',
    articles: [
      {
        title: 'Gummaro Tea Plantation Modernization Support Initiated',
        date: 'June 2026',
        tag: 'Economy',
        summary: 'The woreda administration launched a joint infrastructure evaluation framework to upgrade rural roads routing to the historic 800-hectare Gummaro Estate—the largest tea plantation in the country—boosting local logistics.',
      },
      {
        title: 'Woreda Administration Announces New Honey Production Quality Incentives',
        date: 'May 2026',
        tag: 'Agriculture',
        summary: 'Known throughout the region for its high-quality highland honey, the municipal administration is rolling out training packages and equipment subsidies for local Oromo apiculture cooperatives.',
      },
      {
        title: 'Preserving Historical Landmark Heritage Sites in Gore Town',
        date: 'April 2026',
        tag: 'Culture',
        summary: "A preservation committee has been assigned to safeguard architectural elements surrounding the early 20th-century palace compound of Ras Tessema Nadew, dating back to Gore's golden era as a premier western trade post.",
      },
    ],
  },
  servicesPage: {
    title: 'Municipal E-Services Portal',
    subtitle: 'Access digital requests, community permits, and transparent administrative operations managed by Gore Woreda.',
    categories: [
      {
        title: 'Civil Registry & Documentation',
        icon: '📋',
        items: ['Birth & Marriage Certificates', 'ID Card Renewals', 'Resident Certifications', 'Vital Statistics Registration'],
      },
      {
        title: 'Agriculture & Development',
        icon: '🌱',
        items: ['Agricultural Extension Services', 'Forestry Conservation & Honey Support', 'Land Use & Title Registration', 'Water Resource Approvals'],
      },
      {
        title: 'Trade & Licensing',
        icon: '🏢',
        items: ['Business Registration Permits', 'Market Day Vendor Allocation', 'Investment Advisory (Tea & Coffee)', 'Tax Clearance Services'],
      },
    ],
    apply: 'Apply',
  },
  contact: {
    title: 'Contact Our Administration',
    subtitle: 'Have questions, feedback, or need official assistance? Reach out to the Gore Woreda municipal offices.',
    getInTouch: 'Get In Touch',
    description: 'Our administrative offices are open Monday through Friday, handling public inquiries, licensing registration, and civic services.',
    officeLocation: 'Office Location',
    officeAddress1: 'Main Municipal Building, Gore Woreda,',
    officeAddress2: 'Illubabor Zone, Oromia, Ethiopia',
    phone: 'Phone Directory',
    mainOffice: 'Main Office: +251 47 XXXXXXX',
    publicRelations: 'Public Relations: +251 47 XXXXXXX',
    email: 'Electronic Mail',
    sendMessage: 'Send Us a Direct Message',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    subject: 'Subject',
    messageContent: 'Message Content',
    submit: 'Submit Form',
    thankYou: 'Thank you',
    messageSent: 'Your message has been submitted successfully!',
  },
  footer: {
    copyright: 'Gore Woreda Administration. All rights reserved.',
  },
  language: {
    label: 'Language',
  },
};

const amMessages: Messages = {
  header: {
    home: 'ቤት',
    about: 'ስለ እኛ',
    services: 'አገልግሎቶች',
    news: 'ዜና',
    contact: 'አግኙን',
  },
  hero: {
    welcome: 'ወደ ጎሬ ወረዳ ይፋዊ ፖርታል እንኳን ደህና መጡ',
    slides: [
      'ጎሬ ወረዳ ማህበረሰብን በዘመናዊ ዲጂታል አስተዳደር ማብቃት።',
      'የአካባቢ የግብርና ልማት እና ዘላቂ ሀብቶችን ማስተዋወቅ።',
      'ለሁሉም ቀልጣፋ እና ግልጽ የሲቪል ምዝገባ እና የፍቃድ አገልግሎቶች።',
    ],
    exploreServices: 'አገልግሎቶችን ያስሱ',
  },
  stats: {
    title: 'የወረዳ አመላካቾች',
    subtitle: 'ጎሬ በጥቅል',
    stats: [
      { label: 'አጠቃላይ ህዝብ ብዛት', value: 'ከ90,000 በላይ', detail: 'የከተማ እና የገጠር ሰፈሮች ተጣምረው' },
      { label: 'አጠቃላይ ስፋት', value: 'በግምት 650 ኪ.ሜ²', detail: 'የበለፀገ የደጋ ደን መልክዓ ምድር' },
      { label: 'አስተዳደራዊ ክፍሎች', value: '22 ቀበሌዎች', detail: 'የሚተዳደሩ የማዘጋጃ ቤት ዘርፎች' },
      { label: 'ዋና ኢኮኖሚያዊ ምንጭ', value: 'ግብርና', detail: 'ከፍተኛ ሻይ፣ ቡና እና ንብ ማነብ' },
    ],
  },
  services: {
    latestNews: 'የቅርብ ጊዜ ዜና',
    latestNewsDesc: 'በቅርብ የህዝብ ማስታወቂያዎች እና የማህበረሰብ አስታወቂያዎች ወቅታዊ መረጃ ያግኙ።',
    noUpdates: 'የቅርብ ዝማኔዎች የሉም',
    municipalServices: 'የማዘጋጃ ቤት አገልግሎቶች',
    municipalServicesDesc: 'ለምስክር ወረቀቶች፣ የንግድ ፍቃዶች እና የፍቃድ መመሪያዎች በመስመር ላይ ያመልክቱ።',
    viewAll: 'ሁሉንም አገልግሎቶች ይመልከቱ →',
    aboutGore: 'ስለ ጎሬ',
    aboutGoreDesc: 'የታሪካዊ ወረዳችንን ሀብታም ታሪክ እና ጂኦግራፊያዊ ውበት ያግኙ።',
    readHistory: 'ታሪክ ያንብቡ →',
  },
  news: {
    title: 'ዜና፣ ማስታወቂያዎች እና የወረዳ መገለጫ',
    subtitle: 'በአስተዳደራዊ እድገቶች፣ የክልል ማስታወቂያዎች እና የጎሬ ሀብታም ባህላዊ መልክዓ ምድር ላይ ሙሉ መረጃ ይኑርዎት።',
    latestPress: 'የቅርብ ጊዜ ጋዜጣዊ መግለጫዎች',
    quickFacts: 'የጎሬ ፈጣን እውነታዎች',
    capital: 'አስተዳደራዊ ዋና ከተማ',
    capitalValue: 'የጎሬ ከተማ (የጎሬ ወረዳ፣ ኢሉባቦር ዞን፣ ኦሮሚያ ዋና ከተማ)',
    historicalRoots: 'ታሪካዊ መነሻ',
    historicalRootsValue: 'በ19ኛው ክፍለ ዘመን መገባደጃ ላይ በራስ ተሰማ ናደው ታሪካዊ የአስተዳደር ቅጥር ግቢ ዙሪያ የተመሰረተ።',
    primaryEconomics: 'ዋና ኢኮኖሚዎች',
    primaryEconomicsValue: 'በታሪካዊ የጋምቤላ ባሮ ወንዝ ቻናሎች፣ ኦርጋኒክ ማር ልማት እና የአካባቢ ሻይ ማምረቻ በኩል በቡና ንግድ ቅርስ የታወቀ።',
    articles: [
      {
        title: 'የጉማሮ ሻይ እርሻ ዘመናዊነት ድጋፍ ተጀመረ',
        date: 'ሰኔ 2026',
        tag: 'ኢኮኖሚ',
        summary: 'የወረዳ አስተዳደር በሀገሪቱ ትልቁ የሻይ እርሻ ወደሆነው ታሪካዊ 800 ሄክታር የጉማሮ እስቴት የሚወስዱትን የገጠር መንገዶች ለማሻሻል የጋራ የመሠረተ ልማት ግምገማ ማዕቀፍ ጀምሯል።',
      },
      {
        title: 'የወረዳ አስተዳደር አዲስ የማር ምርት ጥራት ማበረታቻዎችን አስታወቀ',
        date: 'ግንቦት 2026',
        tag: 'ግብርና',
        summary: 'በክልሉ በከፍተኛ ጥራት የደጋ ማር የሚታወቀው የማዘጋጃ ቤት አስተዳደር ለአካባቢው የኦሮሞ ንብ ማነብ ህብረት ስራ ማህበራት የስልጠና ፓኬጆችን እና የመሳሪያ ድጎማዎችን እያዘጋጀ ነው።',
      },
      {
        title: 'በጎሬ ከተማ የታሪክ ምልክቶችን መጠበቅ',
        date: 'ሚያዝያ 2026',
        tag: 'ባህል',
        summary: 'ጎሬ የዋና ምዕራባዊ የንግድ ማዕከል በነበረችበት ወርቃማ ዘመን የተጀመረውን በራስ ተሰማ ናደው ቅጥር ግቢ ዙሪያ ያሉትን የህንፃ ጥበብ ክፍሎች ለመጠበቅ ኮሚቴ ተሾመ።',
      },
    ],
  },
  servicesPage: {
    title: 'የማዘጋጃ ቤት ኢ-አገልግሎቶች ፖርታል',
    subtitle: 'በጎሬ ወረዳ የሚተዳደሩ ዲጂታል ጥያቄዎችን፣ የማህበረሰብ ፍቃዶችን እና ግልጽ የአስተዳደር ስራዎችን ያግኙ።',
    categories: [
      {
        title: 'የሲቪል ምዝገባ እና ሰነዶች',
        icon: '📋',
        items: ['የልደት እና ጋብቻ ምስክር ወረቀቶች', 'የመታወቂያ ካርድ እድሳት', 'የነዋሪነት ምስክር ወረቀቶች', 'የህዝብ ስታቲስቲክስ ምዝገባ'],
      },
      {
        title: 'ግብርና እና ልማት',
        icon: '🌱',
        items: ['የግብርና ኤክስቴንሽን አገልግሎቶች', 'የደን ጥበቃ እና የማር ድጋፍ', 'የመሬት አጠቃቀም እና የባለቤትነት ምዝገባ', 'የውሃ ሀብት ማረጋገጫዎች'],
      },
      {
        title: 'ንግድ እና ፍቃድ',
        icon: '🏢',
        items: ['የንግድ ምዝገባ ፍቃዶች', 'የገበያ ቀን አቅራቢ ድልድል', 'የኢንቨስትመንት ምክር (ሻይ እና ቡና)', 'የግብር ማጽደቅ አገልግሎቶች'],
      },
    ],
    apply: 'ያመልክቱ',
  },
  contact: {
    title: 'አስተዳደራችንን ያግኙ',
    subtitle: 'ጥያቄዎች፣ አስተያየቶች ወይም ይፋዊ እርዳታ ይፈልጋሉ? ወደ ጎሬ ወረዳ ማዘጋጃ ቤት ቢሮዎች ይግቡ።',
    getInTouch: 'ያገናኙ',
    description: 'የአስተዳደር ቢሮዎቻችን ከሰኞ እስከ አርብ ክፍት ናቸው፣ የህዝብ ጥያቄዎችን፣ የፍቃድ ምዝገባ እና የሲቪክ አገልግሎቶችን ያስተናግዳሉ።',
    officeLocation: 'የቢሮ አድራሻ',
    officeAddress1: 'ዋና የማዘጋጃ ቤት ህንፃ፣ ጎሬ ወረዳ፣',
    officeAddress2: 'ኢሉባቦር ዞን፣ ኦሮሚያ፣ ኢትዮጵያ',
    phone: 'የስልክ ዝርዝር',
    mainOffice: 'ዋና ቢሮ፡ +251 47 XXXXXXX',
    publicRelations: 'ህዝብ ግንኙነት፡ +251 47 XXXXXXX',
    email: 'ኢሜይል',
    sendMessage: 'ቀጥታ መልእክት ይላኩልን',
    fullName: 'ሙሉ ስም',
    emailAddress: 'ኢሜይል አድራሻ',
    subject: 'ርዕሰ ጉዳይ',
    messageContent: 'የመልእክት ይዘት',
    submit: 'ፎርሙን ይላኩ',
    thankYou: 'እናመሰግናለን',
    messageSent: 'መልእክትዎ በተሳካ ሁኔታ ተልኳል!',
  },
  footer: {
    copyright: 'ጎሬ ወረዳ አስተዳደር። ሁሉም መብቶች የተጠበቁ ናቸው።',
  },
  language: {
    label: 'ቋንቋ',
  },
};

const omMessages: Messages = {
  header: {
    home: 'Mana',
    about: 'Waa\'ee',
    services: 'Tajaajila',
    news: 'Oduu',
    contact: 'Quunnamaa',
  },
  hero: {
    welcome: 'Galmee Paartalaa Gore Woreda Officiyaalii duraa baga nagaan dhufte',
    slides: [
      'Haayya Gore Woredaa bulchiinsa dijitaalaa ammayyaadhaan humneessuu.',
      'Misoma qonnaa naannoo fi qabeenya itti fayyadamuu danda\'u jajjabeessuu.',
      'Galmee hawaasaa fi tajaajila liiseensii olaanaa fi iftoomina qabu hundaaf.',
    ],
    exploreServices: 'Tajaajila Sakatta\'i',
  },
  stats: {
    title: 'Mallattoolee Woredaa',
    subtitle: 'Gore Yeroo Tokkoo',
    stats: [
      { label: 'Baay\'ina Ummataa', value: '90,000 ol', detail: 'Baadiyyaa fi magaalaa walitti makame' },
      { label: 'Bal\'inaa', value: 'Km² 650', detail: 'Bosona gaarrisaa soorata qabu' },
      { label: 'Qoodinsa Bulchiinsaa', value: '22 Ganda', detail: 'Sektoraalee bulchiinsa magaalotaa' },
      { label: 'Maddaa Dinagdee', value: 'Qonna', detail: 'Shaayii, Buna, fi Guddina Dammanaa' },
    ],
  },
  services: {
    latestNews: 'Oduu Haaraa',
    latestNewsDesc: 'Odeessa fi labsii hawaasaa ammayyaa wajjiin yeroo qabaa taa\'aa.',
    noUpdates: 'Yeroo ammaa kana odeeffannoo hin jiru',
    municipalServices: 'Tajaajila Magaalotaa',
    municipalServicesDesc: 'Ragaa, liiseensii daldalaa fi qajeelfama hayyamaa onlayiniin iyyadhu.',
    viewAll: 'Tajaajila hunda ilaali →',
    aboutGore: 'Waa\'ee Gore',
    aboutGoreDesc: 'Seenaa fi babbareedummaa lafa woreda keenyaa sadarkaa addunyaa irraa argadhu.',
    readHistory: 'Seenaa dubbisi →',
  },
  news: {
    title: 'Oduu, Labsii fi Golabbii Woredaa',
    subtitle: 'Misooma bulchiinsaa, labsii naannoo fi baraarsa aadaa Gore waliin yeroo hunda beekaa ta\'a.',
    latestPress: 'Oduu Dhiyaataa',
    quickFacts: 'Ibsa Gore',
    capital: 'Magaalaa Bulchiinsaa',
    capitalValue: 'Magaalaa Gore (Woreda Gore, Zone Iluu Abbaa Booraa, Oromiyaa)',
    historicalRoots: 'Hidda Seenaa',
    historicalRootsValue: 'Dhuma jaarraa 19ffaatti gamoo bulchiinsa seenaa Raas Tasammaa Naadew naannootti hundeeffame.',
    primaryEconomics: 'Dinagdee',
    primaryEconomicsValue: 'Daldala bunaatiin kan beekamu, karaalee baroo Gambellaa seenaa qabaniin, misooma dammanaa orgaanikii fi shaayii naannootiin.',
    articles: [
      {
        title: 'Gargaarsa Ammayyeessaa Qonna Shaayii Gummarii geggeessuu jalqabe',
        date: 'Waxabajjii 2026',
        tag: 'Dinagdee',
        summary: 'Bulchiinsi woredaa tooftaa madaallaa misoma bu\'uuraa waliinii karaalee baadiyaa gara Qonna Shaayii Gummarii (dhufaatii shaayii biyyattii keessaa guddoo) fooyyeessuuf jalqabe.',
      },
      {
        title: 'Bulchiinsi Woredaa Injentivii Qulqullina Dammanaa Haaraa Labse',
        date: 'Caamsaa 2026',
        tag: 'Qonna',
        summary: 'Naannoo kana dammana gaarrisaa qulqulluudhaan beekamu, bulchiinsi magaalotaa gamtaalee misooma dammanaa Oromootiif paakeejiiwwan leenjii fi gargaarsa meeshaalee kennuu jalqabe.',
      },
      {
        title: 'Bakka Seenaa Goretti Faayaa Qabeewwan Eeguu',
        date: 'Ebla 2026',
        tag: 'Aadaa',
        summary: 'Komeen tokko gamoo Raas Tasammaa Naadew naannoo jiran eeguuf ramadame. Gore yeroo warqee isheetti bakka daldalaa dhihaa ture.',
      },
    ],
  },
  servicesPage: {
    title: 'Paartalaa Tajaajila E-Magaalotaa',
    subtitle: 'Iyyannoo dijitaalaa, hayyama hawaasaa fi hojiiwwan bulchiinsa iftoomina qaban Gore Woredaan bulaman argadhu.',
    categories: [
      {
        title: 'Galmee Hawaasaa fi Waraqaa',
        icon: '📋',
        items: ['Ragaa Dhalootaa fi Gaa\'elaa', 'Keeyyammii Kaardii Eenyummaa', 'Ragaa Qabeenyaa', 'Galmee Ibsa Jireenyaa'],
      },
      {
        title: 'Qonna fi Misooma',
        icon: '🌱',
        items: ['Tajaajila Ekisteenshini Qonnaa', 'Eegumsa Bosonaa fi Gargaarsa Dammanaa', 'Galmee Fayyadama Lafaa fi Mirkaneessa', 'Hayyama Qabeenya Bishaanii'],
      },
      {
        title: 'Daldala fi Liiseensii',
        icon: '🏢',
        items: ['Hayyama Galmee Daldalaa', 'Qooda Gurguraa Guyyaa Gabaa', 'Gorsa Maallaqa (Shaayii fi Buna)', 'Tajaajila Mirkaneessa Kaffaltii Gibiraa'],
      },
    ],
    apply: 'Iyyadhu',
  },
  contact: {
    title: 'Bulchiinsa Keenya Quunnamaa',
    subtitle: 'Gaaffii qabduu, yaada qabduu, ykn gargaarsa fedhaa? Waajjira magaalotaa Gore Woreda quunnamaa.',
    getInTouch: 'Quunnamaa',
    description: 'Waajjironni keenya Wixata hanga Jimaataa banamu. Gaaffiiwwan hawaasaa, galmee liiseensii fi tajaajila hawaasaa keessatti gargaaru.',
    officeLocation: 'Iddoo Waajjiraa',
    officeAddress1: 'Waajjira Magaalotaa Guddaa, Gore Woreda,',
    officeAddress2: 'Zone Iluu Abbaa Booraa, Oromiyaa, Itoophiyaa',
    phone: 'Tartiiba Bilbilaa',
    mainOffice: 'Waajjira Guddichaa: +251 47 XXXXXXX',
    publicRelations: 'Quunnamtii Hawaasaa: +251 47 XXXXXXX',
    email: 'Imeelii',
    sendMessage: 'Ergaa Kallattii Nuuf Ergi',
    fullName: 'Maqaa Guutuu',
    emailAddress: 'Imeelii',
    subject: 'Mata Duree',
    messageContent: 'Qabiyyee Ergaa',
    submit: 'Ergaa Ergi',
    thankYou: 'Galatoomaa',
    messageSent: 'Ergaa kee milkaa\'inaan ergameera!',
  },
  footer: {
    copyright: 'Bulchiinsa Gore Woredaa. Mirgi hundi tikfameera.',
  },
  language: {
    label: 'Afaan',
  },
};

export const allMessages = {
  en: enMessages,
  am: amMessages,
  om: omMessages,
} as const;
