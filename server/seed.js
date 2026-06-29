const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function seed() {
  // Load .env file if dotenv is available (from @nestjs/config dependency)
  try { require('dotenv').config({ path: require('path').join(__dirname, '.env') }); } catch {}

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Ddg@36240667',
    database: process.env.DB_NAME || 'gore_db',
  });

  console.log('Connected to database.\n');

  // Clear existing data for clean re-run
  await conn.execute('DELETE FROM contact');
  await conn.execute('DELETE FROM project');
  await conn.execute('DELETE FROM announcement');
  await conn.execute('DELETE FROM department');
  await conn.execute('DELETE FROM news');
  await conn.execute('DELETE FROM hero_slide');
  await conn.execute('DELETE FROM setting');
  console.log('Cleared existing seed data.\n');

  // ====== 1. Admins ======
  const adminPassword = await bcrypt.hash('admin1234', 10);
  const [adminResult] = await conn.execute(
    `INSERT IGNORE INTO admins (fullName, email, password, isActive) VALUES (?, ?, ?, ?)`,
    ['Sys Admin', 'admin@gmail.com', adminPassword, true],
  );
  console.log(`Admin: ${adminResult.affectedRows > 0 ? 'Created' : 'Already exists'}`);

  const [admins] = await conn.query(`SELECT id FROM admins LIMIT 1`);
  const adminId = admins[0].id;

  // ====== 2. News ======
  const newsData = [
    { title: 'Gore Woreda Launches Digital Services Portal', slug: 'gore-digital-portal-launch', summary: 'The Gore Woreda administration has officially launched its new digital services portal to streamline administrative processes and improve access to public information.', content: 'The Gore Woreda administration has officially launched a comprehensive digital services portal aimed at modernizing public service delivery across the woreda. The portal provides access to civil registration, business licensing, agricultural extension services, and real-time municipal announcements.\n\nCitizens can now apply for birth and marriage certificates, renew ID cards, register businesses, and access vital statistical information from the comfort of their homes. The initiative aligns with the federal government\'s digital transformation agenda and represents a significant step toward e-governance at the local level.\n\nResidents are encouraged to visit the portal and explore the range of available services. Feedback channels have been established to continuously improve the platform.', coverImage: 'https://images.unsplash.com/photo-1577415124269-fc114ee4d84c?w=800', published: true },
    { title: 'Agricultural Development Initiative Launched in Gore', slug: 'agricultural-initiative-gore', summary: 'A new agricultural development program focusing on coffee, tea, and honey production has been announced to boost local farming communities.', content: 'The Gore Woreda Agriculture Department has launched a comprehensive agricultural development initiative targeting the region\'s three primary economic drivers: coffee cultivation, tea production, and apiculture (honey farming).\n\nThe program includes training workshops for local farmers, distribution of modern farming equipment, and the establishment of cooperative marketing channels. Special emphasis has been placed on sustainable farming practices and organic certification.\n\nLocal farmers have responded positively to the initiative, with over 500 households expected to benefit in the first phase. The woreda administration has allocated a budget of 5 million Birr for the first year of implementation.', coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800', published: true },
    { title: 'Infrastructure Upgrade: Rural Roads Project Begins', slug: 'rural-roads-project', summary: 'A major infrastructure project to upgrade rural roads connecting 12 kebeles has commenced, aiming to improve transportation and market access.', content: 'The Gore Woreda Infrastructure Department has commenced a major road upgrade project covering approximately 45 kilometers of rural roads connecting 12 kebeles to the town of Gore.\n\nThe project, funded through a combination of federal and regional budgets, aims to improve market access for agricultural products, reduce transportation costs, and enhance connectivity for rural communities. Construction is expected to be completed within 18 months.\n\nLocal contractors have been engaged, providing employment opportunities for over 200 residents. The project also includes the construction of three small bridges and improved drainage systems.', coverImage: 'https://images.unsplash.com/photo-1541888946425-d81bb66c8f3c?w=800', published: true },
    { title: 'Gummaro Tea Factory Expansion Announced', slug: 'gummaro-tea-expansion', summary: 'The iconic Gummaro tea factory will undergo a major expansion to increase production capacity and create new jobs.', content: 'The Gummaro Tea Factory, one of the landmark industrial establishments in Gore Woreda, has announced a major expansion plan that will double its production capacity.\n\nThe expansion includes the installation of new processing machinery, construction of additional drying and storage facilities, and the development of a quality control laboratory. The project is expected to create 150 new permanent jobs and benefit over 1,000 smallholder tea farmers in the surrounding areas.\n\nThe factory, which has been in operation since the 1970s, produces the renowned Gummaro brand tea that is distributed across Ethiopia and exported to international markets.', coverImage: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800', published: true },
    { title: 'Gore Town Heritage Preservation Initiative', slug: 'gore-heritage-preservation', summary: 'A committee has been formed to preserve and restore historical landmarks in Gore town, including sites dating back to the late 19th century.', content: 'The Gore Woreda Culture and Tourism Department has established a Heritage Preservation Committee tasked with identifying, documenting, and restoring historical landmarks in Gore town.\n\nGore holds significant historical importance, having been founded in the late 19th century around the Ras Tessema Nadew compound. The town features several architectural landmarks that reflect the rich cultural heritage of the Illubabor region.\n\nThe committee will work with historians, architects, and community elders to develop a comprehensive preservation plan. Priority will be given to structures that are at risk of deterioration.', coverImage: 'https://images.unsplash.com/photo-1565106431043-5b9e0f4c7e3f?w=800', published: false },
  ];

  for (const article of newsData) {
    await conn.execute(
      `INSERT IGNORE INTO news (title, slug, summary, content, coverImage, published, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [article.title, article.slug, article.summary, article.content, article.coverImage, article.published, adminId],
    );
  }
  console.log(`News: ${newsData.length} articles inserted`);

  // ====== 3. Announcements ======
  const announcementData = [
    { title: 'Public Notice: Municipal Office Hours Update', description: 'Updated office hours for all municipal departments effective next month.', content: 'The Gore Woreda Municipal Administration wishes to inform the public that effective July 1, 2026, all municipal offices will operate on revised schedules:\n\nMonday to Thursday: 8:00 AM - 5:00 PM\nFriday: 8:00 AM - 12:00 PM (Half Day)\n\nSaturday and Sunday: Closed\n\nCitizens are advised to plan their visits accordingly. For urgent matters, please contact the respective department heads.', published: true },
    { title: 'Community Meeting: Budget Consultation Forum', description: 'The public is invited to participate in the upcoming budget consultation forum.', content: 'The Gore Woreda Administration will hold a public budget consultation forum on July 15, 2026, at the Municipal Assembly Hall starting at 10:00 AM.\n\nThe forum provides an opportunity for residents, business owners, and community representatives to review and provide input on the proposed budget for the upcoming fiscal year. Topics will include infrastructure development, education, healthcare, and agricultural support programs.\n\nAll interested parties are cordially invited to attend and participate in this important democratic process.', published: true },
    { title: 'New Business Licensing Procedures Effective Immediately', description: 'Important changes to business license application and renewal procedures.', content: 'The Gore Woreda Trade and Licensing Department announces the implementation of new streamlined procedures for business license applications and renewals.\n\nKey changes include:\n1. Online application portal now available\n2. Reduced processing time from 14 to 7 working days\n3. Simplified documentation requirements\n4. Digital payment options available\n\nExisting license holders are encouraged to transition to the new system during their next renewal cycle.', published: true },
    { title: 'Water Supply Maintenance Scheduled', description: 'Planned maintenance work on the municipal water supply system.', content: 'The Gore Woreda Water Supply Department wishes to inform residents that scheduled maintenance work will be conducted on the municipal water supply system on July 20-21, 2026.\n\nDuring this period, water supply may be interrupted in the following areas: Kebele 01, 02, 03, and 05. Residents in these areas are advised to store adequate water for the maintenance period.\n\nWe apologize for any inconvenience and assure the public that every effort will be made to complete the work promptly.', published: false },
  ];

  for (const ann of announcementData) {
    await conn.execute(
      `INSERT IGNORE INTO announcement (title, description, content, published, createdBy) VALUES (?, ?, ?, ?, ?)`,
      [ann.title, ann.description, ann.content, ann.published, adminId],
    );
  }
  console.log(`Announcements: ${announcementData.length} inserted`);

  // ====== 4. Departments ======
  const deptData = [
    { name: 'Agriculture & Rural Development', description: 'Responsible for agricultural extension services, crop production, livestock development, and natural resource conservation across the woreda. Provides training and support to local farmers.', head: 'Ato Tesfaye Alemu', phone: '+251 47 111 2233', email: 'agriculture@gore.gov.et', office: 'Block A, Room 201, Municipal Building' },
    { name: 'Trade, Industry & Investment', description: 'Oversees business registration, market-day operations, investment promotion, and consumer protection. Facilitates trade licenses and market vendor allocations.', head: 'W/o Hiwot Desta', phone: '+251 47 111 2244', email: 'trade@gore.gov.et', office: 'Block A, Room 105, Municipal Building' },
    { name: 'Civil Registration & Vital Statistics', description: 'Manages birth and death registrations, marriage certificates, ID card issuance, and resident certification services for all woreda residents.', head: 'Ato Samuel Bekele', phone: '+251 47 111 2255', email: 'registry@gore.gov.et', office: 'Block B, Ground Floor, Municipal Building' },
    { name: 'Infrastructure & Urban Development', description: 'Plans and executes infrastructure projects including roads, bridges, public buildings, and urban planning. Also manages municipal land administration.', head: 'Eng. Taddese Worku', phone: '+251 47 111 2266', email: 'infrastructure@gore.gov.et', office: 'Block C, Room 302, Municipal Building' },
    { name: 'Finance & Revenue', description: 'Handles municipal budgeting, tax collection, revenue administration, and financial reporting. Provides fiscal oversight for all woreda departments.', head: 'Ato Mulugeta Tadesse', phone: '+251 47 111 2277', email: 'finance@gore.gov.et', office: 'Block A, Room 301, Municipal Building' },
    { name: 'Education & Sports', description: 'Oversees primary and secondary education within the woreda, manages school infrastructure, teacher assignments, and youth sports programs.', head: 'W/o Tiruwork Assefa', phone: '+251 47 111 2288', email: 'education@gore.gov.et', office: 'Block B, Room 205, Municipal Building' },
    { name: 'Health Services', description: 'Coordinates public health services, manages health centers and clinics, implements disease prevention programs, and oversees environmental health.', head: 'Dr. Abera Gemeda', phone: '+251 47 111 2299', email: 'health@gore.gov.et', office: 'Block C, Room 101, Municipal Building' },
    { name: 'Culture, Tourism & Heritage', description: 'Promotes local culture and tourism, preserves historical landmarks, organizes cultural festivals, and manages the woreda\'s tourism information center.', head: 'Ato Girma Fekadu', phone: '+251 47 111 2200', email: 'culture@gore.gov.et', office: 'Block B, Room 108, Municipal Building' },
  ];

  for (const dept of deptData) {
    await conn.execute(
      `INSERT IGNORE INTO department (name, description, head, phone, email, office) VALUES (?, ?, ?, ?, ?, ?)`,
      [dept.name, dept.description, dept.head, dept.phone, dept.email, dept.office],
    );
  }
  console.log(`Departments: ${deptData.length} inserted`);

  // ====== 5. Projects ======
  const projectData = [
    { name: 'Rural Road Connectivity Project Phase II', description: 'Upgrading 45 km of rural roads connecting 12 kebeles to Gore town, including drainage systems and three small bridges.', budget: 45000000, status: 'ongoing', startDate: '2026-01-15', endDate: '2027-06-30', location: 'Gore Woreda, Illubabor Zone', fundingSource: 'Federal Road Fund / Regional Budget', contractor: 'Ethio-Construction PLC', category: 'Infrastructure' },
    { name: 'Gummaro Tea Factory Expansion', description: 'Installation of new processing machinery, additional drying and storage facilities, and quality control laboratory.', budget: 25000000, status: 'ongoing', startDate: '2026-03-01', endDate: '2027-02-28', location: 'Gummaro, Gore Woreda', fundingSource: 'Oromia Investment Commission', contractor: 'Horizon Industrial Engineering', category: 'Industry' },
    { name: 'Gore Town Water Supply Improvement', description: 'Upgrading water treatment facility, replacing aging pipelines, and expanding coverage to underserved kebeles.', budget: 18000000, status: 'ongoing', startDate: '2026-04-01', endDate: '2026-12-31', location: 'Gore Town and surrounding kebeles', fundingSource: 'Oromia Water Bureau', contractor: 'WaterTech Solutions', category: 'Infrastructure' },
    { name: 'Farmers Training & Extension Center', description: 'Construction of a modern agricultural training center with demonstration plots, classroom facilities, and storage.', budget: 8500000, status: 'planned', startDate: '2026-09-01', endDate: '2027-05-31', location: 'Kebele 08, Gore Woreda', fundingSource: 'Ministry of Agriculture', contractor: '', category: 'Agriculture' },
    { name: 'Gore Digital Connectivity Project', description: 'Establishing public WiFi hotspots, computer labs in schools, and digitizing municipal records management.', budget: 3200000, status: 'planned', startDate: '2026-10-01', endDate: '2027-03-31', location: 'Gore Town', fundingSource: 'Ethio-Telecom / ICT Ministry', contractor: '', category: 'Technology' },
    { name: 'Municipal Market Construction', description: 'Construction of a modern market facility with 200 vendor stalls, storage rooms, sanitation facilities, and parking area.', budget: 15000000, status: 'planned', startDate: '2027-01-01', endDate: '2027-12-31', location: 'Gore Town Center', fundingSource: 'Oromia Urban Development Bureau', contractor: '', category: 'Infrastructure' },
  ];

  for (const proj of projectData) {
    await conn.execute(
      `INSERT IGNORE INTO project (name, description, budget, status, startDate, endDate, location, fundingSource, contractor, category, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [proj.name, proj.description, proj.budget, proj.status, proj.startDate, proj.endDate, proj.location, proj.fundingSource, proj.contractor, proj.category, adminId],
    );
  }
  console.log(`Projects: ${projectData.length} inserted`);

  // ====== 6. Contact Messages (sample) ======
  const contactData = [
    { name: 'Almaz Wondimu', email: 'almaz.w@example.com', subject: 'Inquiry About Business License Renewal', message: 'Dear Gore Woreda Administration,\n\nI am writing to inquire about the process for renewing my business license for the upcoming fiscal year. My current license expires at the end of this month.\n\nCould you please provide information on the required documents and the procedure?\n\nThank you,\nAlmaz Wondimu', isRead: true },
    { name: 'Berhanu Tesfaye', email: 'berhanu.t@example.com', subject: 'Request for Birth Certificate', message: 'Dear Sir/Madam,\n\nI would like to request a copy of my birth certificate. I was born in Gore town in 1995. Could you please advise on the process and required documentation?\n\nRegards,\nBerhanu Tesfaye', isRead: true },
    { name: 'Frehiwot Girma', email: 'frehiwot.g@example.com', subject: 'Feedback on Digital Portal', message: 'I recently used the new digital services portal and wanted to provide some feedback. The platform is very user-friendly and I was able to find the information I needed quickly.\n\nHowever, I noticed that the Amharic language option is missing some translations. I hope this can be addressed in future updates.\n\nBest regards,\nFrehiwot Girma', isRead: false },
    { name: 'Kebede Hailu', email: 'kebede.h@example.com', subject: 'Agricultural Training Program Inquiry', message: 'Dear Agriculture Department,\n\nI am a farmer from Kebele 05 and would like to participate in the upcoming agricultural training program. I specialize in honey production and heard there are new initiatives for beekeepers.\n\nPlease let me know how to register and when the next training session will be held.\n\nSincerely,\nKebede Hailu', isRead: false },
  ];

  for (const msg of contactData) {
    await conn.execute(
      `INSERT INTO contact (name, email, subject, message, isRead) VALUES (?, ?, ?, ?, ?)`,
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
    await conn.execute(
      `INSERT IGNORE INTO hero_slide (imageUrl, description, sortOrder, isActive) VALUES (?, ?, ?, ?)`,
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
    { settingKey: 'about_council_members', settingValue: '[{"name":"Ato Birhanu Tesfaye","role":"Council Chairperson","desc":"Oversees legislative proceedings and policy direction."},{"name":"W/ro Almaz Wondimu","role":"Finance & Budget Committee Head","desc":"Manages municipal financial planning and budget oversight."},{"name":"Ato Desta Hailu","role":"Infrastructure Development Lead","desc":"Leads road, water, and public facility development projects."},{"name":"W/ro Tirunesh Girma","role":"Social Services Coordinator","desc":"Coordinates health, education, and social welfare programs."},{"name":"Ato Kebede Assefa","role":"Agriculture & Environment Rep","desc":"Advises on agricultural policy and environmental conservation."},{"name":"W/ro Meseret Tadesse","role":"Women & Youth Affairs","desc":"Champions gender equality and youth empowerment initiatives."}]' },
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
  ];

  for (const s of settingsData) {
    await conn.execute(
      `INSERT IGNORE INTO setting (settingKey, settingValue) VALUES (?, ?)`,
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
