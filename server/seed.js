const { Client } = require('pg');
const bcrypt = require('bcrypt');

async function seed() {
  // Load .env file if dotenv is available (from @nestjs/config dependency)
  try { require('dotenv').config({ path: require('path').join(__dirname, '.env') }); } catch {}

  const conn = new Client({
    host: process.env.DB_HOST ,
    port: Number(process.env.DB_PORT) ,
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME ,
  });

  await conn.connect();

  console.log('Connected to database.\n');

  // Clear existing data for clean re-run
  await conn.query('DELETE FROM contact');
  await conn.query('DELETE FROM project');
  await conn.query('DELETE FROM announcement');
  await conn.query('DELETE FROM department');
  await conn.query('DELETE FROM news');
  await conn.query('DELETE FROM hero_slide');
  await conn.query('DELETE FROM setting');
  console.log('Cleared existing seed data.\n');

  // ====== 1. Admins ======
  const adminPassword = await bcrypt.hash('admin1234', 10);
  const adminResult = await conn.query(
    `INSERT INTO admins ("fullName", email, password, "isActive") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING ; `,
    ['Sys Admin', 'admin@gmail.com', adminPassword, true],
  );
  const isCreated = adminResult.rowCounts > 0;
  
  console.log(`Admin: ${isCreated ? 'Created' : 'Already exists'}`);

  const admins = await conn.query(`SELECT id FROM admins LIMIT 1`);
  const adminId = admins.rows[0].id;

  // ====== 2. News ======
  const newsData = [
    {
      title: 'Gore Woreda Launches Digital Services Portal',
      titleAm: 'ጎሬ ወረዳ የዲጂታል አገልግሎት ፖርታል አስጀመረ',
      titleOm: 'Gore Woreda Paartala Tajaajila Dijitaalaa Banatte',
      slug: 'gore-digital-portal-launch',
      summary: 'The Gore Woreda administration has officially launched its new digital services portal to streamline administrative processes and improve access to public information.',
      summaryAm: 'የጎሬ ወረዳ አስተዳደር የአስተዳደር ሂደቶችን ለማሳለጥ እና የህዝብ መረጃ ተደራሽነትን ለማሻሻል አዲሱን የዲጂታል አገልግሎት ፖርታል አስጀመረ።',
      summaryOm: 'Bulchiinsi Gore Woreda paartala tajaajila dijitaalaa isaa haaraa adeemsa bulchiinsaa salphisuufi itti fayyadamummaa odeeffannoo hawaasaa fooyyessuuf banate.',
      content: 'The Gore Woreda administration has officially launched a comprehensive digital services portal aimed at modernizing public service delivery across the woreda. The portal provides access to civil registration, business licensing, agricultural extension services, and real-time municipal announcements.\n\nCitizens can now apply for birth and marriage certificates, renew ID cards, register businesses, and access vital statistical information from the comfort of their homes. The initiative aligns with the federal government\'s digital transformation agenda and represents a significant step toward e-governance at the local level.\n\nResidents are encouraged to visit the portal and explore the range of available services. Feedback channels have been established to continuously improve the platform.',
      contentAm: 'የጎሬ ወረዳ አስተዳደር በወረዳው ውስጥ የህዝብ አገልግሎት አሰጣጥን ለማዘመን የተነደፈውን ሁሉን አቀፍ የዲጂታል አገልግሎት ፖርታል በይፋ አስጀመረ። ፖርታሉ የሲቪል ምዝገባ፣ የንግድ ፍቃድ፣ የግብርና ኤክስቴንሽን አገልግሎቶች እና የማዘጋጃ ቤት ማስታወቂያዎችን ያቀርባል።\n\nዜጎች ከቤታቸው ሆነው የልደት እና የጋብቻ ሰርተፍኬት ማመልከት፣ የመታወቂያ ካርድ ማደስ፣ ንግድ ማስመዝገብ እና አስፈላጊ የስታቲስቲክስ መረጃዎችን ማግኘት ይችላሉ።',
      contentOm: 'Bulchiinsi Gore Woredaa paartala tajaajila dijitaalaa guutuu ta e kan karaa woredaa keessatti tajaajila hawaasaa ammayyeessuuf banate. Paartalli galmee hawaasaa, liiseensii daldalaa, tajaajila ekisteenshini qonnaa, fi labsii magaalotaa yeroo dhugaa kenna.\n\nLammoonni amma ragaa dhalootaa fi gaa elaa iyyachuu, kaardii eenyummaa haaromfachuu, daldala galmeessuu, fi odeeffannoo istatistikaa barbaachisaa mana isaanii taa anii argachuu danda u.',
      coverImage: 'https://images.unsplash.com/photo-1577415124269-fc114ee4d84c?w=800',
      published: true,
    },
    {
      title: 'Agricultural Development Initiative Launched in Gore',
      titleAm: 'በጎሬ የግብርና ልማት ተነሳሽነት ተጀመረ',
      titleOm: 'Gore Keessatti Karoorri Misoma Qonnaa Jalqabame',
      slug: 'agricultural-initiative-gore',
      summary: 'A new agricultural development program focusing on coffee, tea, and honey production has been announced to boost local farming communities.',
      summaryAm: 'የቡና፣ ሻይ እና ማር ምርት ላይ ያተኮረ አዲስ የግብርና ልማት ፕሮግራም የአካባቢውን የግብርና ማህበረሰብ ለማሳደግ ታወቀ።',
      summaryOm: 'Sagantaa misoma qonnaa haaraa kan buna, shaayii fi dammana irratti xiyyeeffate hawaasa qonnaa naannoo jajjabeessuuf labsame.',
      content: 'The Gore Woreda Agriculture Department has launched a comprehensive agricultural development initiative targeting the region\'s three primary economic drivers: coffee cultivation, tea production, and apiculture (honey farming).\n\nThe program includes training workshops for local farmers, distribution of modern farming equipment, and the establishment of cooperative marketing channels. Special emphasis has been placed on sustainable farming practices and organic certification.\n\nLocal farmers have responded positively to the initiative, with over 500 households expected to benefit in the first phase. The woreda administration has allocated a budget of 5 million Birr for the first year of implementation.',
      contentAm: 'የጎሬ ወረዳ ግብርና ዲፓርትመንት የክልሉን ሶስት ዋና ዋና የኢኮኖሚ አንቀሳቃሾች ማለትም የቡና ልማት፣ የሻይ ምርት እና የንብ ማነብ ላይ ያነጣጠረ አጠቃላይ የግብርና ልማት ተነሳሽነት ጀመረ።\n\nፕሮግራሙ ለአካባቢው ገበሬዎች የስልጠና አውደ ጥናቶችን፣ የዘመናዊ የግብርና መሳሪያዎች ስርጭትን እና የህብረት ስራ የገበያ ቻናሎችን ያካትታል።',
      contentOm: 'Muummeen Qonnaa Gore Woredaa karoora misoma qonnaa guutuu ta e kan sochoota dinagdee gurguddoo sadi: misooma buna, oomisha shaayii, fi guddina dammanaaf of eeggatan jalqabe.\n\nSagantaan leenjii qonnaa, meeshaalee qonnaa ammayyaa kennuu, fi karaalee gabaa wal gargaaruu dha. Miidhagina qonna itti fufiinsi qabu fi ragaa Oganikii irratti xiyyeeffanna addaa kennameera.',
      coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
      published: true,
    },
    {
      title: 'Infrastructure Upgrade: Rural Roads Project Begins',
      titleAm: 'የመሠረተ ልማት ማሻሻያ፡ የገጠር መንገዶች ፕሮጀክት ተጀመረ',
      titleOm: 'Fooyyessaa Bu uraa: Pirojektiin Karaalee Baadiyyaa Jalqabame',
      slug: 'rural-roads-project',
      summary: 'A major infrastructure project to upgrade rural roads connecting 12 kebeles has commenced, aiming to improve transportation and market access.',
      summaryAm: '12 ቀበሌዎችን የሚያገናኙ የገጠር መንገዶችን ለማሻሻል ዋና የመሠረተ ልማት ፕሮጀክት ተጀምሯል፣ ይህም የትራንስፖርት እና የገበያ ተደራሽነትን ለማሻሻል ያለመ ነው።',
      summaryOm: 'Pirojektiin bu uraa guddaan karaalee baadiyyaa gandoonni 12 walitti hidhan fooyyessuuf jalqabame, geejjibaa fi Gabaaf itti fayyadamummaa fooyyessuuf.',
      content: 'The Gore Woreda Infrastructure Department has commenced a major road upgrade project covering approximately 45 kilometers of rural roads connecting 12 kebeles to the town of Gore.\n\nThe project, funded through a combination of federal and regional budgets, aims to improve market access for agricultural products, reduce transportation costs, and enhance connectivity for rural communities. Construction is expected to be completed within 18 months.\n\nLocal contractors have been engaged, providing employment opportunities for over 200 residents. The project also includes the construction of three small bridges and improved drainage systems.',
      contentAm: 'የጎሬ ወረዳ መሠረተ ልማት ዲፓርትመንት 12 ቀበሌዎችን ከጎሬ ከተማ ጋር የሚያገናኙ በግምት 45 ኪሎ ሜትር የገጠር መንገዶችን የማሻሻል ዋና ፕሮጀክት ጀምሯል።\n\nፕሮጀክቱ በፌዴራል እና በክልል በጀቶች ጥምረት የገንዘብ ድጋፍ የተደረገው ሲሆን የግብርና ምርቶችን የገበያ ተደራሽነት ለማሻሻል፣ የትራንስፖርት ወጪን ለመቀነስ እና ለገጠር ማህበረሰቦች ግንኙነትን ለማጠናከር ያለመ ነው።',
      contentOm: 'Muummeen Bu uraa Gore Woredaa pirojektiin guddaan karaalee baadiyyaa km 45 ol ta an kan gandoota 12 magaalaa Gore waliin walitti hidhan fooyyessuu jalqabe.\n\nPirojektichis baajetii federaalaa fi naannoo walitti makuun kan hirkatu, oomisha qonnaatiif itti fayyadamummaa gabaa fooyyessuu, baasii geejjibaa hir isuu, fi hawaasa baadiyyaatiif walitti hidhamma cimsuuf. Ijarratichi ji atota 18 keessatti xumuramuuf.',
      coverImage: 'https://images.unsplash.com/photo-1541888946425-d81bb66c8f3c?w=800',
      published: true,
    },
    {
      title: 'Gummaro Tea Factory Expansion Announced',
      titleAm: 'የጉማሮ ሻይ ፋብሪካ ማስፋፊያ ታወጀ',
      titleOm: 'Babbal isa Faaktarii Shaayii Gummaroo Labsame',
      slug: 'gummaro-tea-expansion',
      summary: 'The iconic Gummaro tea factory will undergo a major expansion to increase production capacity and create new jobs.',
      summaryAm: 'ታዋቂው የጉማሮ ሻይ ፋብሪካ የምርት አቅምን ለማሳደግ እና አዳዲስ የስራ እድሎችን ለመፍጠር ትልቅ ማስፋፊያ ይካሄዳል።',
      summaryOm: 'Faaktariin shaayii Gummaroo beekamaan babbal isa guddaan dandeettii oomishaa dabaluufi hojii haaraa uumuuf geggeeffama.',
      content: 'The Gummaro Tea Factory, one of the landmark industrial establishments in Gore Woreda, has announced a major expansion plan that will double its production capacity.\n\nThe expansion includes the installation of new processing machinery, construction of additional drying and storage facilities, and the development of a quality control laboratory. The project is expected to create 150 new permanent jobs and benefit over 1,000 smallholder tea farmers in the surrounding areas.\n\nThe factory, which has been in operation since the 1970s, produces the renowned Gummaro brand tea that is distributed across Ethiopia and exported to international markets.',
      contentAm: 'የጉማሮ ሻይ ፋብሪካ፣ በጎሬ ወረዳ ውስጥ ካሉ ዋና ዋና የኢንዱስትሪ ተቋማት አንዱ፣ የምርት አቅሙን በእጥፍ የሚጨምር ዋና የማስፋፊያ እቅድ አስታውቋል።\n\nማስፋፊያው አዲስ የማቀነባበሪያ ማሽኖች መትከል፣ ተጨማሪ የማድረቂያ እና የማከማቻ ተቋማት መገንባት እና የጥራት ቁጥጥር ላቦራቶሪ ማቋቋምን ያካትታል።',
      contentOm: 'Faaktarii Shaayii Gummaroo, kan warra dhaabbilee industirii beekamoo Woreda Gore keessa tokko, karoora babbal isa guddaan dandeettii oomishaa isaa wal dachaasuu labsan.\n\nBabbal isnii makiinawwan adeemsa haaraa fechuu, bakka gogsuu fi kuusaa dabalataa ijaaruu, fi laaboratorii to atoo qulqullinaa ijaaruu of keessatti qabata.',
      coverImage: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800',
      published: true,
    },
    {
      title: 'Gore Town Heritage Preservation Initiative',
      titleAm: 'የጎሬ ከተማ ቅርስ ጥበቃ ተነሳሽነት',
      titleOm: 'Karoorri Eegumsa Qabeenya Aadaa Magaalaa Gore',
      slug: 'gore-heritage-preservation',
      summary: 'A committee has been formed to preserve and restore historical landmarks in Gore town, including sites dating back to the late 19th century.',
      summaryAm: 'በጎሬ ከተማ ውስጥ የ19ኛው ክፍለ ዘመን መገባደጃ ላይ የተመለሱ ቦታዎችን ጨምሮ ታሪካዊ ቦታዎችን ለመጠበቅ እና ወደ ቀድሞ ሁኔታ ለመመለስ ኮሚቴ ተቋቋመ።',
      summaryOm: 'Komeen bakka seenaa magaalaa Gore keessatti qabeenya seenaa fi bakka seenaa qaban eeguufi deebisuu fi 19ffaa dhuma jaarraa irraa eegalan eeguuf hundeeffame.',
      content: 'The Gore Woreda Culture and Tourism Department has established a Heritage Preservation Committee tasked with identifying, documenting, and restoring historical landmarks in Gore town.\n\nGore holds significant historical importance, having been founded in the late 19th century around the Ras Tessema Nadew compound. The town features several architectural landmarks that reflect the rich cultural heritage of the Illubabor region.\n\nThe committee will work with historians, architects, and community elders to develop a comprehensive preservation plan. Priority will be given to structures that are at risk of deterioration.',
      contentAm: 'የጎሬ ወረዳ ባህል እና ቱሪዝም ዲፓርትመንት በጎሬ ከተማ ውስጥ ታሪካዊ ቦታዎችን የመለየት፣ የመመዝገብ እና ወደ ቀድሞ ሁኔታ የመመለስ ኃላፊነት የተሰጠውን የቅርስ ጥበቃ ኮሚቴ አቋቁሟል።\n\nጎሬ በ19ኛው ክፍለ ዘመን መገባደጃ ላይ በራስ ተሰማ ናደው ግቢ ዙሪያ የተመሰረተች ሲሆን ጉልህ የሆነ ታሪካዊ ጠቀሜታ አላት።',
      contentOm: 'Muummeen Aadaa fi Turizimii Gore Woredaa Komee Eegumsa Qabeenya Aadaa kan bakka seenaa magaalaa Gore keessatti adda baasuu, galmeessuu, fi deebisuu itti gaafatame kenne.\n\nGore guddina seenaa qabdi, dhuma jaarraa 19ffaatti gamoo Ras Tessema Nadew naannoo hundeeffamteetti. Magaalattiin mallattoolee gadi fageenya aadaa naannoo Illu Abbaa Booraa argisiisan qabdi.',
      coverImage: 'https://images.unsplash.com/photo-1565106431043-5b9e0f4c7e3f?w=800',
      published: false,
    },
  ];

  for (const article of newsData) {
    await conn.query(
      `INSERT INTO news (title, "titleAm", "titleOm", slug, summary, "summaryAm", "summaryOm", content, "contentAm", "contentOm", "coverImage", published, "createdBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT DO NOTHING`,
      [article.title, article.titleAm, article.titleOm, article.slug, article.summary, article.summaryAm, article.summaryOm, article.content, article.contentAm, article.contentOm, article.coverImage, article.published, adminId],
    );
  }
  console.log(`News: ${newsData.length} multilingual articles inserted`);

  // ====== 3. Announcements ======
  const announcementData = [
    {
      title: 'Public Notice: Municipal Office Hours Update', titleAm: 'የህዝብ ማስታወቂያ፡ የማዘጋጃ ቤት የስራ ሰአት ማሻሻያ', titleOm: 'Beeksisa Hawaasaa: Sa atii Hojii Waajjira Magaalotaa Fooyyessuu',
      description: 'Updated office hours for all municipal departments effective next month.', descriptionAm: 'ለሁሉም የማዘጋጃ ቤት ዲፓርትመንቶች የተሻሻለ የስራ ሰአት ከሚቀጥለው ወር ጀምሮ ተግባራዊ ይሆናል።', descriptionOm: 'Sa atii hojii fooyya e muummee magaalotaa hundaaf ji a dhufu irraa hojii irra oola.',
      content: 'The Gore Woreda Municipal Administration wishes to inform the public that effective July 1, 2026, all municipal offices will operate on revised schedules:\n\nMonday to Thursday: 8:00 AM - 5:00 PM\nFriday: 8:00 AM - 12:00 PM (Half Day)\n\nSaturday and Sunday: Closed\n\nCitizens are advised to plan their visits accordingly. For urgent matters, please contact the respective department heads.',
      contentAm: 'የጎሬ ወረዳ ማዘጋጃ ቤት አስተዳደር ከሐምሌ 1, 2026 ጀምሮ ሁሉም የማዘጋጃ ቤት ቢሮዎች በተሻሻለ መርሃ ጊዜ እንደሚሰሩ ያስታውቃል።\n\nሰኞ እስከ ሐሙስ፡ ከጠዋቱ 8፡00 እስከ ከሰዓት 5፡00\nዓርብ፡ ከጠዋቱ 8፡00 እስከ ከሰዓት 12፡00 (ግማሽ ቀን)\n\nቅዳሜ እና እሁድ፡ ዝግ',
      contentOm: 'Bulchiinsi Magaalotaa Gore Woredaa hawaasatti beeksisuu kan fedha Waxabajjii 1, 2026 irraa eegalee waajjirri magaalotaa hundi karoora fooyya e irratti hojjetu.\n\nWixata hanga Kamisaa: SA 8:00 fi WB 5:00\nJimaata: SA 8:00 fi WB 12:00 (Guyyaa Walakkaa)\n\nSanbata fi Dilbata: Cufame',
      published: true,
    },
    {
      title: 'Community Meeting: Budget Consultation Forum', titleAm: 'የማህበረሰብ ስብሰባ፡ የበጀት ምክክር መድረክ', titleOm: 'Walga ii Hawaasaa: Fooramii Marii Baajetii',
      description: 'The public is invited to participate in the upcoming budget consultation forum.', descriptionAm: 'ህዝቡ በሚመጣው የበጀት ምክክር መድረክ ላይ እንዲሳተፍ ተጋብዟል።', descriptionOm: 'Hawaassni fooramii marii baajetii dhufaa keessatti hirmaachuuf affeerame.',
      content: 'The Gore Woreda Administration will hold a public budget consultation forum on July 15, 2026, at the Municipal Assembly Hall starting at 10:00 AM.\n\nThe forum provides an opportunity for residents, business owners, and community representatives to review and provide input on the proposed budget for the upcoming fiscal year. Topics will include infrastructure development, education, healthcare, and agricultural support programs.\n\nAll interested parties are cordially invited to attend and participate in this important democratic process.',
      contentAm: 'የጎሬ ወረዳ አስተዳደር በሐምሌ 15, 2026 በማዘጋጃ ቤት ስብሰባ አዳራሽ ከጠዋቱ 10፡00 ላይ የህዝብ የበጀት ምክክር መድረክ ያካሂዳል።\n\nመድረኩ ለነዋሪዎች፣ ለንግድ ባለቤቶች እና ለማህበረሰብ ተወካዮች ለሚቀጥለው የበጀት ዓመት የታቀደውን በጀት ለመገምገም እና አስተያየት ለመስጠት እድል ይሰጣል።\n\nሁሉም ፍላጎት ያላቸው ወገኖች በዚህ አስፈላጊ ዲሞክራሲያዊ ሂደት ላይ እንዲገኙ በአክብሮት ተጋብዘዋል።',
      contentOm: 'Bulchiinsi Gore Woredaa fooramii marii baajetii hawaasaa Waxabajjii 15, 2026, Hoola Walga ii Magaalotaa keessatti sa atii 10:00 AA irraa jalqabu.\n\nFooramichis warra jiraatan, abbootii daldalaa, fi bakka bu awaan hawaasaa baajetii bara maallaqaa dhufuuf karoorfame sakatta uu fi yaada kennuuf carraa kenna.\n\nGama hunda kan fedhan adeemsa dimookiraatawaa kana irratti hirmaachuuf kabajaan affeeramu.',
      published: true,
    },
    {
      title: 'New Business Licensing Procedures Effective Immediately', titleAm: 'አዲስ የንግድ ፈቃድ ሂደቶች ወዲያውኑ ተግባራዊ', titleOm: 'Adeemsa Hayyama Daldalaa Haaraa Achumaan Hojii Irra Oole',
      description: 'Important changes to business license application and renewal procedures.', descriptionAm: 'በንግድ ፍቃድ ማመልከቻ እና እድሳት ሂደቶች ላይ አስፈላጊ ለውጦች።', descriptionOm: 'Jijjiirama ijoo adeemsa iyyannaa fi haaromfannaa hayyama daldalaa irratti.',
      content: 'The Gore Woreda Trade and Licensing Department announces the implementation of new streamlined procedures for business license applications and renewals.\n\nKey changes include:\n1. Online application portal now available\n2. Reduced processing time from 14 to 7 working days\n3. Simplified documentation requirements\n4. Digital payment options available\n\nExisting license holders are encouraged to transition to the new system during their next renewal cycle.',
      contentAm: 'የጎሬ ወረዳ ንግድ እና ፍቃድ ዲፓርትመንት ለንግድ ፍቃድ ማመልከቻ እና እድሳት አዲስ የተሳለጡ ሂደቶችን መተግበሩን ያስታውቃል።\n\nዋና ዋና ለውጦች፡-\n1. የመስመር ላይ ማመልከቻ ፖርታል አሁን ይገኛል\n2. የማቀነባበሪያ ጊዜ ከ14 ወደ 7 የስራ ቀናት ተቀንሷል\n3. የሰነድ መስፈርቶች ቀላል ሆነዋል\n4. ዲጂታል የክፍያ አማራጮች ይገኛሉ',
      contentOm: 'Muummeen Daldalaa fi Liiseensii Gore Woredaa iyyannaa hayyama daldalaa fi haaromsuuuf adeemsa haaraa salphifame hojiirra ooluu labse.\n\nJijjiiramoota ijoo: 1. Paartala iyyannaa onlayinii amma jira 2. Yeroo adeemsaa guyyaa hojii 14 irraa 7tti hirate 3. Barbaachiisii waraqaa salphifame 4. Filannoo kaffaltii dijitaalaa jiraatu.',
      published: true,
    },
    {
      title: 'Water Supply Maintenance Scheduled', titleAm: 'የውሃ አቅርቦት ጥገና ቀጠሮ ተይዟል', titleOm: 'Suphaa Dhiyeessii Bishaanii Yeroo Qabame',
      description: 'Planned maintenance work on the municipal water supply system.', descriptionAm: 'በማዘጋጃ ቤት የውሃ አቅርቦት ስርዓት ላይ የታቀደ የጥገና ስራ።', descriptionOm: 'Sirna dhiyeessii bishaanii magaalotaa irratti hojii suphaa karoorfame.',
      content: 'The Gore Woreda Water Supply Department wishes to inform residents that scheduled maintenance work will be conducted on the municipal water supply system on July 20-21, 2026.\n\nDuring this period, water supply may be interrupted in the following areas: Kebele 01, 02, 03, and 05. Residents in these areas are advised to store adequate water for the maintenance period.\n\nWe apologize for any inconvenience and assure the public that every effort will be made to complete the work promptly.',
      contentAm: 'የጎሬ ወረዳ የውሃ አቅርቦት ዲፓርትመንት በሐምሌ 20-21, 2026 በማዘጋጃ ቤት የውሃ አቅርቦት ስርዓት ላይ የታቀደ የጥገና ስራ ይከናወናል።\n\nበዚህ ወቅት በሚከተሉት አካባቢዎች የውሃ አቅርቦት ሊቋረጥ ይችላል፡ ቀበሌ 01፣ 02፣ 03 እና 05።',
      contentOm: 'Muummeen Dhiyeessii Bishaanii Gore Woredaa warra jiraatan beeksisuu kan fedhu suphaan karoorfame sirna dhiyeessii bishaanii magaalotaa irratti Waxabajjii 20-21, 2026 geggeeffama.\n\nYeroo kanatti dhiyeessi bishaanii naannoo armaan gadii keessatti addaan citee: Gandoota 01, 02, 03, fi 05.',
      published: false,
    },
  ];

  for (const ann of announcementData) {
    await conn.query(
      `INSERT INTO announcement (title, "titleAm", "titleOm", description, "descriptionAm", "descriptionOm", content, "contentAm", "contentOm", published, "createdBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT DO NOTHING`,
      [ann.title, ann.titleAm, ann.titleOm, ann.description, ann.descriptionAm, ann.descriptionOm, ann.content, ann.contentAm, ann.contentOm, ann.published, adminId],
    );
  }
  console.log(`Announcements: ${announcementData.length} multilingual inserted`);

  // ====== 4. Departments ======
  const deptData = [
    { name: 'Agriculture & Rural Development', nameAm: 'ግብርና እና ገጠር ልማት', nameOm: 'Qonnaa fi Misoma Baadiyyaa', description: 'Responsible for agricultural extension services, crop production, livestock development, and natural resource conservation across the woreda. Provides training and support to local farmers.', descriptionAm: 'በወረዳው ውስጥ ለግብርና ኤክስቴንሽን አገልግሎቶች፣ ለሰብል ምርት፣ ለእንስሳት ልማት እና ለተፈጥሮ ሀብት ጥበቃ ኃላፊነት አለው።', descriptionOm: 'Tajaajila ekisteenshini qonnaa, oomisha midhaanii, guddina horii, fi eegumsa qabeenya uumamaa woredaa keessatti itti gaafatama. Leenjii fi gargaarsa qonnootti kennama.', head: 'Ato Tesfaye Alemu', phone: '+251 47 111 2233', email: 'agriculture@gore.gov.et', office: 'Block A, Room 201, Municipal Building' },
    { name: 'Trade, Industry & Investment', nameAm: 'ንግድ፣ ኢንዱስትሪ እና ኢንቨስትመንት', nameOm: 'Daldala, Industirii fi Dhaabbata', description: 'Oversees business registration, market-day operations, investment promotion, and consumer protection. Facilitates trade licenses and market vendor allocations.', descriptionAm: 'የንግድ ምዝገባን፣ የገበያ ቀን ስራዎችን፣ የኢንቨስትመንት ማስተዋወቅ እና የሸማቾች ጥበቃን ይቆጣጠራል።', descriptionOm: 'Galmee daldalaa, hojiiwwan guyyaa gabaa, jajjabeessa dhaabbataa, fi eegumsa maamilaatti. Liiseensii daldalaa fi qooda gurguraa gabaa salphisa.', head: 'W/o Hiwot Desta', phone: '+251 47 111 2244', email: 'trade@gore.gov.et', office: 'Block A, Room 105, Municipal Building' },
    { name: 'Civil Registration & Vital Statistics', nameAm: 'ሲቪል ምዝገባ እና ወሳኝ ስታቲስቲክስ', nameOm: 'Galmee Hawaasaa fi Istaastikaa Ijoo', description: 'Manages birth and death registrations, marriage certificates, ID card issuance, and resident certification services for all woreda residents.', descriptionAm: 'የልደት እና የሞት ምዝገባዎችን፣ የጋብቻ ሰርተፍኬቶችን፣ የመታወቂያ ካርድ አሰጣጥ እና የነዋሪነት ማረጋገጫ አገልግሎቶችን ያስተዳድራል።', descriptionOm: 'Galmee dhalootaa fi du aa, ragaa gaa elaa, kaardii eenyummaa kennuu, fi tajaajila ragaa qabeenyaa warra woredaa hundaaf bulcha.', head: 'Ato Samuel Bekele', phone: '+251 47 111 2255', email: 'registry@gore.gov.et', office: 'Block B, Ground Floor, Municipal Building' },
    { name: 'Infrastructure & Urban Development', nameAm: 'መሠረተ ልማት እና የከተማ ልማት', nameOm: 'Bu uraa fi Misoma Magaalaa', description: 'Plans and executes infrastructure projects including roads, bridges, public buildings, and urban planning. Also manages municipal land administration.', descriptionAm: 'መንገዶችን፣ ድልድዮችን፣ የህዝብ ህንፃዎችን እና የከተማ ፕላን ጨምሮ የመሠረተ ልማት ፕሮጀክቶችን ያቅዳል እና ያከናውናል።', descriptionOm: 'Pirojektoota bu uraa kan karaa, riqicha, gamoo hawaasaa, fi karoora magaalaa dabalatee karoorfata fi raawwata. Bulchiinsa lafa magaalotaa keessattis bulcha.', head: 'Eng. Taddese Worku', phone: '+251 47 111 2266', email: 'infrastructure@gore.gov.et', office: 'Block C, Room 302, Municipal Building' },
    { name: 'Finance & Revenue', nameAm: 'ፋይናንስ እና ገቢ', nameOm: 'Maallaqaa fi Galii', description: 'Handles municipal budgeting, tax collection, revenue administration, and financial reporting. Provides fiscal oversight for all woreda departments.', descriptionAm: 'የማዘጋጃ ቤት በጀት፣ የግብር አሰባሰብ፣ የገቢ አስተዳደር እና የፋይናንስ ሪፖርት አቀራረብን ያስተዳድራል።', descriptionOm: 'Baajetii magaalotaa, funaanuu gibiraa, bulchiinsa galii, fi gabaasa maallaqaa bulcha. Muummee woredaa hundaaf tooftaa maallaqaa kenna.', head: 'Ato Mulugeta Tadesse', phone: '+251 47 111 2277', email: 'finance@gore.gov.et', office: 'Block A, Room 301, Municipal Building' },
    { name: 'Education & Sports', nameAm: 'ትምህርት እና ስፖርት', nameOm: 'Barnootaa fi Isport', description: 'Oversees primary and secondary education within the woreda, manages school infrastructure, teacher assignments, and youth sports programs.', descriptionAm: 'በወረዳው ውስጥ የመጀመሪያ እና ሁለተኛ ደረጃ ትምህርትን ይቆጣጠራል፣ የትምህርት ቤት መሠረተ ልማትን፣ የመምህራን ምደባ እና የወጣት ስፖርት ፕሮግራሞችን ያስተዳድራል።', descriptionOm: 'Gosa barumsaa sadarkaa tokkoffaa fi lammataa woredaa keessatti to atti, bu uraa manneen barnootaa, ramaddii barsiisota, fi sagantaa isport dargaggootaa bulcha.', head: 'W/o Tiruwork Assefa', phone: '+251 47 111 2288', email: 'education@gore.gov.et', office: 'Block B, Room 205, Municipal Building' },
    { name: 'Health Services', nameAm: 'የጤና አገልግሎቶች', nameOm: 'Tajaajila Fayyaa', description: 'Coordinates public health services, manages health centers and clinics, implements disease prevention programs, and oversees environmental health.', descriptionAm: 'የህዝብ ጤና አገልግሎቶችን ያስተባብራል፣ የጤና ጣቢያዎችን እና ክሊኒኮችን ያስተዳድራል፣ የበሽታ መከላከል ፕሮግራሞችን ይተገብራል።', descriptionOm: 'Tajaajila fayyaa hawaasaa walitti fidii, bu uraalee fayyaa fi kiliniikota bulcha, sagantaa ittisa dhukkubaa raawwata, fi fayyaa naannoo to atti.', head: 'Dr. Abera Gemeda', phone: '+251 47 111 2299', email: 'health@gore.gov.et', office: 'Block C, Room 101, Municipal Building' },
    { name: 'Culture, Tourism & Heritage', nameAm: 'ባህል፣ ቱሪዝም እና ቅርስ', nameOm: 'Aadaa, Turizimii fi Qabeenya Aadaa', description: 'Promotes local culture and tourism, preserves historical landmarks, organizes cultural festivals, and manages the woreda\'s tourism information center.', descriptionAm: 'የአካባቢ ባህል እና ቱሪዝምን ያስተዋውቃል፣ ታሪካዊ ቦታዎችን ይጠብቃል፣ ባህላዊ ፌስቲቫሎችን ያደራጃል።', descriptionOm: 'Aadaa fi turizimii naannoo jajjabeessa, bakka seenaa qaban eega, ayyaanota aadaa qindeessa, fi bakka odeeffannoo turizimii woredaa keessaa bulcha.', head: 'Ato Girma Fekadu', phone: '+251 47 111 2200', email: 'culture@gore.gov.et', office: 'Block B, Room 108, Municipal Building' },
  ];

  for (const dept of deptData) {
    await conn.query(
      `INSERT INTO department (name, "nameAm", "nameOm", description, "descriptionAm", "descriptionOm", head, phone, email, office) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT DO NOTHING`,
      [dept.name, dept.nameAm, dept.nameOm, dept.description, dept.descriptionAm, dept.descriptionOm, dept.head, dept.phone, dept.email, dept.office],
    );
  }
  console.log(`Departments: ${deptData.length} multilingual inserted`);

  // ====== 5. Projects ======
  const projectData = [
    { name: 'Rural Road Connectivity Project Phase II', nameAm: 'የገጠር መንገድ ትስስር ፕሮጀክት ምዕራፍ II', nameOm: 'Pirojektiin Walitti Hidhamma Karaa Baadiyyaa Sadarkaa II', description: 'Upgrading 45 km of rural roads connecting 12 kebeles to Gore town, including drainage systems and three small bridges.', descriptionAm: '12 ቀበሌዎችን ከጎሬ ከተማ ጋር የሚያገናኙ 45 ኪሜ የገጠር መንገዶችን ማሻሻል፣ የውሃ ፍሳሽ ስርዓቶችን እና ሶስት ትናንሽ ድልድዮችን ጨምሮ።', descriptionOm: 'Karaalee baadiyyaa km 45 kan gandoota 12 magaalaa Gore waliin walitti hidhan, sirna bishaanii fi riqicha sadii xixinnoo fooyyessuu.', budget: 45000000, status: 'ongoing', startDate: '2026-01-15', endDate: '2027-06-30', location: 'Gore Woreda, Illubabor Zone', fundingSource: 'Federal Road Fund / Regional Budget', contractor: 'Ethio-Construction PLC', category: 'Infrastructure' },
    { name: 'Gummaro Tea Factory Expansion', nameAm: 'የጉማሮ ሻይ ፋብሪካ ማስፋፊያ', nameOm: 'Babbal isa Faaktarii Shaayii Gummaroo', description: 'Installation of new processing machinery, additional drying and storage facilities, and quality control laboratory.', descriptionAm: 'አዲስ የማቀነባበሪያ ማሽኖች መትከል፣ ተጨማሪ የማድረቂያ እና የማከማቻ ተቋማት እና የጥራት ቁጥጥር ላቦራቶሪ።', descriptionOm: 'Makiinawwan adeemsa haaraa fechuu, bakka gogsuu fi kuusaa dabalataa, fi laaboratorii to atoo qulqullinaa.', budget: 25000000, status: 'ongoing', startDate: '2026-03-01', endDate: '2027-02-28', location: 'Gummaro, Gore Woreda', fundingSource: 'Oromia Investment Commission', contractor: 'Horizon Industrial Engineering', category: 'Industry' },
    { name: 'Gore Town Water Supply Improvement', nameAm: 'የጎሬ ከተማ የውሃ አቅርቦት ማሻሻያ', nameOm: 'Fooyyessaa Dhiyeessii Bishaanii Magaalaa Gore', description: 'Upgrading water treatment facility, replacing aging pipelines, and expanding coverage to underserved kebeles.', descriptionAm: 'የውሃ ማጣሪያ ተቋም ማሻሻል፣ ያረጁ የቧንቧ መስመሮችን መተካት እና አገልግሎት ወደማያገኙ ቀበሌዎች ማስፋፋት።', descriptionOm: 'Bakka qulqulleessituu bishaanii fooyyessuu, baayina dullooman bakka buusuu, fi tajaajila gandoota milkaa inaa hin arganne babbal isuu.', budget: 18000000, status: 'ongoing', startDate: '2026-04-01', endDate: '2026-12-31', location: 'Gore Town and surrounding kebeles', fundingSource: 'Oromia Water Bureau', contractor: 'WaterTech Solutions', category: 'Infrastructure' },
    { name: 'Farmers Training & Extension Center', nameAm: 'የገበሬዎች ስልጠና እና ኤክስቴንሽን ማዕከል', nameOm: 'Giddugaleessa Leenjii Qonnootii fi Ekisteenshinii', description: 'Construction of a modern agricultural training center with demonstration plots, classroom facilities, and storage.', descriptionAm: 'ዘመናዊ የግብርና ስልጠና ማዕከል ከማሳያ ቦታዎች፣ የክፍል መገልገያዎች እና መጋዘን ጋር መገንባት።', descriptionOm: 'Giddugaleessa leenjii qonnaa ammayyaa lafa agarsiisaa, meeshaa kutaa fi kuusaa waliin ijaaruu.', budget: 8500000, status: 'planned', startDate: '2026-09-01', endDate: '2027-05-31', location: 'Kebele 08, Gore Woreda', fundingSource: 'Ministry of Agriculture', contractor: '', category: 'Agriculture' },
    { name: 'Gore Digital Connectivity Project', nameAm: 'የጎሬ ዲጂታል ትስስር ፕሮጀክት', nameOm: 'Pirojektiin Walitti Hidhamma Dijitaalaa Gore', description: 'Establishing public WiFi hotspots, computer labs in schools, and digitizing municipal records management.', descriptionAm: 'የህዝብ ዋይፋይ ቦታዎችን፣ በትምህርት ቤቶች ውስጥ የኮምፒውተር ላቦራቶሪዎችን ማቋቋም እና የማዘጋጃ ቤት መዝገቦችን ዲጂታል ማድረግ።', descriptionOm: 'Bakka WiFi hawaasaa, laaboratorii kompiitaraa manneen barnootaa keessatti, fi galmee magaalotaa dijitaaleffachuu.', budget: 3200000, status: 'planned', startDate: '2026-10-01', endDate: '2027-03-31', location: 'Gore Town', fundingSource: 'Ethio-Telecom / ICT Ministry', contractor: '', category: 'Technology' },
    { name: 'Municipal Market Construction', nameAm: 'የማዘጋጃ ቤት ገበያ ግንባታ', nameOm: 'Ijarrata Gabaa Magaalotaa', description: 'Construction of a modern market facility with 200 vendor stalls, storage rooms, sanitation facilities, and parking area.', descriptionAm: '200 የሻጭ ቦታዎች፣ የማከማቻ ክፍሎች፣ የንፅህና መገልገያዎች እና የመኪና ማቆሚያ ቦታ ያለው ዘመናዊ የገበያ ተቋም መገንባት።', descriptionOm: 'Bakka gabaa ammayyaa kan bakka gurguraa 200, kutaa kuusaa, meeshaa fi yaa, fi bakka dhabbii konkolaataa waliin ijaaruu.', budget: 15000000, status: 'planned', startDate: '2027-01-01', endDate: '2027-12-31', location: 'Gore Town Center', fundingSource: 'Oromia Urban Development Bureau', contractor: '', category: 'Infrastructure' },
  ];

  for (const proj of projectData) {
    await conn.query(
      `INSERT INTO project (name, "nameAm", "nameOm", description, "descriptionAm", "descriptionOm", budget, status, "startDate", "endDate", location, "fundingSource", contractor, category, "createdBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) ON CONFLICT DO NOTHING`,
      [proj.name, proj.nameAm, proj.nameOm, proj.description, proj.descriptionAm, proj.descriptionOm, proj.budget, proj.status, proj.startDate, proj.endDate, proj.location, proj.fundingSource, proj.contractor, proj.category, adminId],
    );
  }
  console.log(`Projects: ${projectData.length} multilingual inserted`);

  // ====== 6. Contact Messages (sample) ======
  const contactData = [
    { name: 'Almaz Wondimu', email: 'almaz.w@example.com', subject: 'Inquiry About Business License Renewal', message: 'Dear Gore Woreda Administration,\n\nI am writing to inquire about the process for renewing my business license for the upcoming fiscal year. My current license expires at the end of this month.\n\nCould you please provide information on the required documents and the procedure?\n\nThank you,\nAlmaz Wondimu', isRead: true },
    { name: 'Berhanu Tesfaye', email: 'berhanu.t@example.com', subject: 'Request for Birth Certificate', message: 'Dear Sir/Madam,\n\nI would like to request a copy of my birth certificate. I was born in Gore town in 1995. Could you please advise on the process and required documentation?\n\nRegards,\nBerhanu Tesfaye', isRead: true },
    { name: 'Frehiwot Girma', email: 'frehiwot.g@example.com', subject: 'Feedback on Digital Portal', message: 'I recently used the new digital services portal and wanted to provide some feedback. The platform is very user-friendly and I was able to find the information I needed quickly.\n\nHowever, I noticed that the Amharic language option is missing some translations. I hope this can be addressed in future updates.\n\nBest regards,\nFrehiwot Girma', isRead: false },
    { name: 'Kebede Hailu', email: 'kebede.h@example.com', subject: 'Agricultural Training Program Inquiry', message: 'Dear Agriculture Department,\n\nI am a farmer from Kebele 05 and would like to participate in the upcoming agricultural training program. I specialize in honey production and heard there are new initiatives for beekeepers.\n\nPlease let me know how to register and when the next training session will be held.\n\nSincerely,\nKebede Hailu', isRead: false },
  ];

  for (const msg of contactData) {
    await conn.query(
      `INSERT INTO contact (name, email, subject, message, "isRead") VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
      [msg.name, msg.email, msg.subject, msg.message, msg.isRead],
    );
  }
  console.log(`Contact Messages: ${contactData.length} inserted`);

  // ====== 7. Hero Slides ======
  const heroSlideData = [
    {
      imageUrl: 'https://www.connect4climate.org/sites/default/files/2024-11/EthiopiaBanner3.png',
      description: 'Empowering the Gore Woreda community through modern digital administration.',
      sortOrder: 0,
      isActive: true,
    },
    {
      imageUrl: 'https://figures.academia-assets.com/65833206/figure_020.jpg',
      description: 'Promoting local agricultural development and sustainable resources.',
      sortOrder: 1,
      isActive: true,
    },
    {
      imageUrl: 'https://i0.wp.com/qbo-abo-wbo.org/wp-content/uploads/2024/07/IMG-20240714-WA0001.jpg?fit=1080%2C621&ssl=1&w=640',
      description: 'Efficient and transparent civil registry and licensing services for everyone.',
      sortOrder: 2,
      isActive: true,
    },
  ];

  for (const slide of heroSlideData) {
    await conn.query(
      `INSERT INTO hero_slide ("imageUrl", description, "sortOrder", "isActive") VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
      [slide.imageUrl, slide.description, slide.sortOrder, slide.isActive],
    );
  }
  console.log(`Hero Slides: ${heroSlideData.length} inserted`);

  // ====== 8. Site Settings ======
  const settingsData = [
    { settingKey: 'contact_phone_main', settingValue: '+251 47 XXX XXXX' },
    { settingKey: 'contact_phone_pr', settingValue: '+251 47 XXX XXXX' },
    { settingKey: 'contact_email_main', settingValue: 'info@goreworeda.gov.et' },
    { settingKey: 'contact_email_support', settingValue: 'support@goreworeda.gov.et' },
    { settingKey: 'contact_hours_weekday', settingValue: 'Mon–Fri: 8:00 AM – 5:00 PM' },
    { settingKey: 'contact_hours_saturday', settingValue: 'Sat: 8:00 AM – 12:00 PM' },
    { settingKey: 'contact_address', settingValue: 'Main Municipal Building, Gore Woreda, Illubabor Zone, Oromia, Ethiopia' },
    { settingKey: 'footer_tagline1', settingValue: 'Gore Woreda' },
    { settingKey: 'footer_tagline2', settingValue: 'Illubabor Zone' },
    { settingKey: 'footer_tagline3', settingValue: 'Oromia' },
    // --- About Page Content ---
    { settingKey: 'about_mayor_name', settingValue: 'Ato Tessema Abebe' },
    { settingKey: 'about_mayor_bio', settingValue: 'Mayor Tessema Abebe has been leading Gore Woreda with a vision for sustainable development, transparency, and community engagement. With over 15 years of public service experience, he is committed to improving infrastructure, expanding municipal services, and fostering economic growth through agricultural development and investment promotion.' },
    { settingKey: 'about_vice_mayor_name', settingValue: 'W/ro Genet Mekonnen' },
    { settingKey: 'about_vice_mayor_bio', settingValue: 'Vice Mayor Genet Mekonnen oversees municipal operations and community outreach programs. Her leadership focuses on social services, women empowerment initiatives, and strengthening local governance structures across all 22 kebeles.' },
    { settingKey: 'about_council_members', settingValue: 'Ato Birhanu Tesfaye | Council Chairperson | Oversees legislative proceedings and policy direction.\nW/ro Almaz Wondimu | Finance & Budget Committee Head | Manages municipal financial planning and budget oversight.\nAto Desta Hailu | Infrastructure Development Lead | Leads road, water, and public facility development projects.\nW/ro Tirunesh Girma | Social Services Coordinator | Coordinates health, education, and social welfare programs.\nAto Kebede Assefa | Agriculture & Environment Rep | Advises on agricultural policy and environmental conservation.\nW/ro Meseret Tadesse | Women & Youth Affairs | Champions gender equality and youth empowerment initiatives.' },
    { settingKey: 'about_history_desc', settingValue: 'Gore Woreda is a historic administrative district in the Illubabor Zone of Oromia, Ethiopia. Founded in the late 19th century around the Ras Tessema Nadew compound, Gore has grown from a small settlement into a vibrant administrative and commercial center. The woreda is renowned for its premium coffee trade legacy, organic honey cultivation, and local tea manufacturing at the famous Gummaro Tea Plantation. Today, Gore Woreda serves as a model for sustainable rural development and community governance in the region.' },
    { settingKey: 'about_geography_desc', settingValue: 'Covering approximately 650 km² of rich highland forest geography, Gore Woreda is home to over 90,000 residents across urban and rural settlements. The woreda is administratively divided into 22 kebeles, each governed by municipal sectors that ensure effective service delivery and community participation.' },
    { settingKey: 'about_vision_text', settingValue: 'To transform Gore Woreda into a model municipality where sustainable development, transparent governance, and community prosperity go hand in hand, leveraging our rich agricultural heritage and strategic location in the Illubabor Zone.' },
    { settingKey: 'about_mission_text', settingValue: 'To deliver efficient municipal services, promote inclusive economic growth, preserve our cultural and environmental heritage, and ensure every citizen has access to quality public services through innovative and participatory governance.' },
    // --- News Quick Facts ---
    { settingKey: 'news_quickfacts_title', settingValue: 'Gore Quick Facts' },
    { settingKey: 'news_quickfact_1_value', settingValue: 'Gore Town (Capital of Gore Woreda, Illubabor Zone, Oromia)' },
    { settingKey: 'news_quickfact_2_value', settingValue: 'Founded in the late 19th Century around Ras Tessema Nadew compound.' },
    { settingKey: 'news_quickfact_3_value', settingValue: 'Renowned for coffee trade legacy, organic honey cultivation, and local tea manufacturing.' },
    // --- Stats Grid ---
    { settingKey: 'stats_label_1', settingValue: 'Total Population' },
    { settingKey: 'stats_detail_1', settingValue: 'Urban & rural settlements combined' },
    { settingKey: 'stats_label_2', settingValue: 'Total Area Coverage' },
    { settingKey: 'stats_detail_2', settingValue: 'Rich highland forest geography' },
    { settingKey: 'stats_label_3', settingValue: 'Administrative Division' },
    { settingKey: 'stats_detail_3', settingValue: 'Governed municipal sectors' },
    { settingKey: 'stats_label_4', settingValue: 'Primary Economic Engine' },
    { settingKey: 'stats_detail_4', settingValue: 'Premium Tea, Coffee, & Apiculture' },
    { settingKey: 'stats_value_1', settingValue: 'Over 90,000' },
    { settingKey: 'stats_value_2', settingValue: 'Approx. 650 km²' },
    { settingKey: 'stats_value_3', settingValue: '22 Kebeles' },
    { settingKey: 'stats_value_4', settingValue: 'Agriculture' },
  ];

  for (const s of settingsData) {
    await conn.query(
      `INSERT INTO setting ("settingKey", "settingValue") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [s.settingKey, s.settingValue],
    );
  }
  console.log(`Site Settings: ${settingsData.length} inserted`);

  console.log('\n✅ Database seeding complete!');
  await conn.end();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});
