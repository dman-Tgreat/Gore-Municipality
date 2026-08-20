export interface SettingField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'json';
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  pattern?: string;
  patternMessage?: string;
  maxLength?: number;
}

export interface SettingsGroup {
  id: string;
  title: string;
  description?: string;
  fields: SettingField[];
}

// Ethiopian phone: +251911234567, 0911234567, etc.
const ET_PHONE = '^(\\+251|0)?[\\s\\-.]?(9[123468]\\d[\\s\\-.]?\\d{3}[\\s\\-.]?\\d{3}|[1-4]\\d[\\s\\-.]?\\d{3}[\\s\\-.]?\\d{4})$';

export const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    id: 'contact',
    title: 'Contact Information',
    description: 'Phone numbers, email addresses, working hours, and physical address shown on the contact page and footer.',
    fields: [
      { key: 'contact_phone_main', label: 'Main Phone', type: 'tel', placeholder: '+251911234567', required: true, pattern: ET_PHONE, patternMessage: 'Enter a valid Ethiopian phone number (e.g. +251911234567 or 0911234567)' },
      { key: 'contact_phone_pr', label: 'Public Relations Phone', type: 'tel', placeholder: '+251911234567', required: true, pattern: ET_PHONE, patternMessage: 'Enter a valid Ethiopian phone number' },
      { key: 'contact_email_main', label: 'Main Email', type: 'email', placeholder: 'info@goreworeda.gov.et', required: true },
      { key: 'contact_email_support', label: 'Support Email', type: 'email', placeholder: 'support@goreworeda.gov.et', required: true },
      { key: 'contact_hours_weekday', label: 'Weekday Hours', type: 'text', placeholder: 'Mon–Fri: 8:00 AM – 5:00 PM', required: true, maxLength: 100 },
      { key: 'contact_hours_saturday', label: 'Saturday Hours', type: 'text', placeholder: 'Sat: 8:00 AM – 12:00 PM', required: true, maxLength: 100 },
      { key: 'contact_address', label: 'Office Address', type: 'textarea', placeholder: 'Main Municipal Building, Gore Woreda...', required: true, maxLength: 500 },
    ],
  },
  {
    id: 'footer',
    title: 'Footer Taglines',
    description: 'Short location identifiers displayed in the footer copyright bar.',
    fields: [
      { key: 'footer_tagline1', label: 'Tagline 1', type: 'text', placeholder: 'Gore Woreda', required: true, maxLength: 50 },
      { key: 'footer_tagline2', label: 'Tagline 2', type: 'text', placeholder: 'Illubabor Zone', required: true, maxLength: 50 },
      { key: 'footer_tagline3', label: 'Tagline 3', type: 'text', placeholder: 'Oromia', required: true, maxLength: 50 },
    ],
  },
  {
    id: 'about',
    title: 'About Page Content',
    description: 'Leadership profiles, history, geography, vision, and mission text displayed on the About page.',
    fields: [
      { key: 'about_mayor_name', label: 'Mayor Name', type: 'text', placeholder: 'Ato Tessema Abebe', required: true, maxLength: 200 },
      { key: 'about_mayor_bio', label: 'Mayor Biography', type: 'textarea', placeholder: 'Mayor biography text...', required: true, maxLength: 2000 },
      { key: 'about_vice_mayor_name', label: 'Vice Mayor Name', type: 'text', placeholder: 'W/ro Genet Mekonnen', required: true, maxLength: 200 },
      { key: 'about_vice_mayor_bio', label: 'Vice Mayor Biography', type: 'textarea', placeholder: 'Vice Mayor biography text...', required: true, maxLength: 2000 },
      { key: 'about_council_members', label: 'Council Members', type: 'textarea', placeholder: 'Ato Birhanu Tesfaye | Council Chairperson | Oversees...', helpText: 'One member per line. Use pipe (|) to separate name, role, and description.', maxLength: 5000 },
      { key: 'about_history_desc', label: 'History Description', type: 'textarea', placeholder: 'Historical description of Gore Woreda...', required: true, maxLength: 5000 },
      { key: 'about_geography_desc', label: 'Geography Description', type: 'textarea', placeholder: 'Geographic description...', required: true, maxLength: 5000 },
      { key: 'about_vision_text', label: 'Vision Statement', type: 'textarea', placeholder: 'Our vision...', required: true, maxLength: 2000 },
      { key: 'about_mission_text', label: 'Mission Statement', type: 'textarea', placeholder: 'Our mission...', required: true, maxLength: 2000 },
    ],
  },
  {
    id: 'news',
    title: 'News Quick Facts',
    description: 'Quick fact values shown on the News page sidebar.',
    fields: [
      { key: 'news_quickfacts_title', label: 'Quick Facts Title', type: 'text', placeholder: 'Gore Quick Facts', required: true, maxLength: 100 },
      { key: 'news_quickfact_1_value', label: 'Quick Fact 1', type: 'textarea', placeholder: 'Capital city info...', required: true, maxLength: 500 },
      { key: 'news_quickfact_2_value', label: 'Quick Fact 2', type: 'textarea', placeholder: 'Historical roots info...', required: true, maxLength: 500 },
      { key: 'news_quickfact_3_value', label: 'Quick Fact 3', type: 'textarea', placeholder: 'Primary economics info...', required: true, maxLength: 500 },
    ],
  },
  {
    id: 'stats',
    title: 'Homepage Stats Grid',
    description: 'Labels, values, and details for the four woreda indicator stat cards on the homepage (Population, Area, Administration, Economy).',
    fields: [
      { key: 'stats_label_1', label: 'Stat 1 — Label', type: 'text', placeholder: 'Total Population', required: true, maxLength: 100 },
      { key: 'stats_detail_1', label: 'Stat 1 — Detail', type: 'text', placeholder: 'Urban & rural settlements combined', required: true, maxLength: 200 },
      { key: 'stats_label_2', label: 'Stat 2 — Label', type: 'text', placeholder: 'Total Area Coverage', required: true, maxLength: 100 },
      { key: 'stats_detail_2', label: 'Stat 2 — Detail', type: 'text', placeholder: 'Rich highland forest geography', required: true, maxLength: 200 },
      { key: 'stats_label_3', label: 'Stat 3 — Label', type: 'text', placeholder: 'Administrative Division', required: true, maxLength: 100 },
      { key: 'stats_detail_3', label: 'Stat 3 — Detail', type: 'text', placeholder: 'Governed municipal sectors', required: true, maxLength: 200 },
      { key: 'stats_label_4', label: 'Stat 4 — Label', type: 'text', placeholder: 'Primary Economic Engine', required: true, maxLength: 100 },
      { key: 'stats_detail_4', label: 'Stat 4 — Detail', type: 'text', placeholder: 'Premium Tea, Coffee, & Apiculture', required: true, maxLength: 200 },
      { key: 'stats_value_1', label: 'Stat 1 — Value', type: 'text', placeholder: 'Over 90,000', required: true, maxLength: 50 },
      { key: 'stats_value_2', label: 'Stat 2 — Value', type: 'text', placeholder: 'Approx. 650 km²', required: true, maxLength: 50 },
      { key: 'stats_value_3', label: 'Stat 3 — Value', type: 'text', placeholder: '22 Kebeles', required: true, maxLength: 50 },
      { key: 'stats_value_4', label: 'Stat 4 — Value', type: 'text', placeholder: 'Agriculture', required: true, maxLength: 50 },
    ],
  },
];
