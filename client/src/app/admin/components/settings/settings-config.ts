export interface SettingField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'json';
  placeholder?: string;
  helpText?: string;
}

export interface SettingsGroup {
  id: string;
  title: string;
  description?: string;
  fields: SettingField[];
}

export const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    id: 'contact',
    title: 'Contact Information',
    description: 'Phone numbers, email addresses, working hours, and physical address shown on the contact page and footer.',
    fields: [
      { key: 'contact_phone_main', label: 'Main Phone', type: 'tel', placeholder: '+251 47 XXX XXXX' },
      { key: 'contact_phone_pr', label: 'Public Relations Phone', type: 'tel', placeholder: '+251 47 XXX XXXX' },
      { key: 'contact_email_main', label: 'Main Email', type: 'email', placeholder: 'info@goreworeda.gov.et' },
      { key: 'contact_email_support', label: 'Support Email', type: 'email', placeholder: 'support@goreworeda.gov.et' },
      { key: 'contact_hours_weekday', label: 'Weekday Hours', type: 'text', placeholder: 'Mon–Fri: 8:00 AM – 5:00 PM' },
      { key: 'contact_hours_saturday', label: 'Saturday Hours', type: 'text', placeholder: 'Sat: 8:00 AM – 12:00 PM' },
      { key: 'contact_address', label: 'Office Address', type: 'textarea', placeholder: 'Main Municipal Building, Gore Woreda...' },
    ],
  },
  {
    id: 'footer',
    title: 'Footer Taglines',
    description: 'Short location identifiers displayed in the footer copyright bar.',
    fields: [
      { key: 'footer_tagline1', label: 'Tagline 1', type: 'text', placeholder: 'Gore Woreda' },
      { key: 'footer_tagline2', label: 'Tagline 2', type: 'text', placeholder: 'Illubabor Zone' },
      { key: 'footer_tagline3', label: 'Tagline 3', type: 'text', placeholder: 'Oromia' },
    ],
  },
  {
    id: 'about',
    title: 'About Page Content',
    description: 'Leadership profiles, history, geography, vision, and mission text displayed on the About page.',
    fields: [
      { key: 'about_mayor_name', label: 'Mayor Name', type: 'text', placeholder: 'Ato Tessema Abebe' },
      { key: 'about_mayor_bio', label: 'Mayor Biography', type: 'textarea', placeholder: 'Mayor biography text...' },
      { key: 'about_vice_mayor_name', label: 'Vice Mayor Name', type: 'text', placeholder: 'W/ro Genet Mekonnen' },
      { key: 'about_vice_mayor_bio', label: 'Vice Mayor Biography', type: 'textarea', placeholder: 'Vice Mayor biography text...' },
      { key: 'about_council_members', label: 'Council Members', type: 'textarea', placeholder: 'Ato Birhanu Tesfaye | Council Chairperson | Oversees...', helpText: 'One member per line. Use pipe (|) to separate name, role, and description.' },
      { key: 'about_history_desc', label: 'History Description', type: 'textarea', placeholder: 'Historical description of Gore Woreda...' },
      { key: 'about_geography_desc', label: 'Geography Description', type: 'textarea', placeholder: 'Geographic description...' },
      { key: 'about_vision_text', label: 'Vision Statement', type: 'textarea', placeholder: 'Our vision...' },
      { key: 'about_mission_text', label: 'Mission Statement', type: 'textarea', placeholder: 'Our mission...' },
    ],
  },
  {
    id: 'news',
    title: 'News Quick Facts',
    description: 'Quick fact values shown on the News page sidebar.',
    fields: [
      { key: 'news_quickfacts_title', label: 'Quick Facts Title', type: 'text', placeholder: 'Gore Quick Facts' },
      { key: 'news_quickfact_1_value', label: 'Quick Fact 1', type: 'textarea', placeholder: 'Capital city info...' },
      { key: 'news_quickfact_2_value', label: 'Quick Fact 2', type: 'textarea', placeholder: 'Historical roots info...' },
      { key: 'news_quickfact_3_value', label: 'Quick Fact 3', type: 'textarea', placeholder: 'Primary economics info...' },
    ],
  },
  {
    id: 'stats',
    title: 'Homepage Stats Grid',
    description: 'Labels, values, and details for the four woreda indicator stat cards on the homepage (Population, Area, Administration, Economy).',
    fields: [
      { key: 'stats_label_1', label: 'Stat 1 — Label', type: 'text', placeholder: 'Total Population' },
      { key: 'stats_detail_1', label: 'Stat 1 — Detail', type: 'text', placeholder: 'Urban & rural settlements combined' },
      { key: 'stats_label_2', label: 'Stat 2 — Label', type: 'text', placeholder: 'Total Area Coverage' },
      { key: 'stats_detail_2', label: 'Stat 2 — Detail', type: 'text', placeholder: 'Rich highland forest geography' },
      { key: 'stats_label_3', label: 'Stat 3 — Label', type: 'text', placeholder: 'Administrative Division' },
      { key: 'stats_detail_3', label: 'Stat 3 — Detail', type: 'text', placeholder: 'Governed municipal sectors' },
      { key: 'stats_label_4', label: 'Stat 4 — Label', type: 'text', placeholder: 'Primary Economic Engine' },
      { key: 'stats_detail_4', label: 'Stat 4 — Detail', type: 'text', placeholder: 'Premium Tea, Coffee, & Apiculture' },
      { key: 'stats_value_1', label: 'Stat 1 — Value', type: 'text', placeholder: 'Over 90,000' },
      { key: 'stats_value_2', label: 'Stat 2 — Value', type: 'text', placeholder: 'Approx. 650 km²' },
      { key: 'stats_value_3', label: 'Stat 3 — Value', type: 'text', placeholder: '22 Kebeles' },
      { key: 'stats_value_4', label: 'Stat 4 — Value', type: 'text', placeholder: 'Agriculture' },
    ],
  },
];
