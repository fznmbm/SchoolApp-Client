// Simple local storage backed templates with sensible defaults

const STORAGE_KEY = 'whatsapp_local_templates';

const defaultTemplates = [
  {
    _id: 'tmpl_shift_reminder',
    name: 'Shift Reminder',
    content: 'Hi <name>,\n\nReminder about your upcoming shift:\n📅 Date: <date>\n⏰ Time: <time>\n📍 Location: <location>\n\nPlease confirm your availability.\n\nThanks!',
  },
  {
    _id: 'tmpl_schedule_change',
    name: 'Schedule Change',
    content: 'Hi <name>,\n\nYour schedule has been updated:\n📅 New Date: <date>\n⏰ New Time: <time>\n📍 Location: <location>\n\nPlease acknowledge this change.',
  },
];

const read = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultTemplates.slice();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultTemplates.slice();
    return parsed;
  } catch {
    return defaultTemplates.slice();
  }
};

const write = (templates) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
};

export const listTemplates = async () => read();

export const saveTemplate = async ({ name, content }) => {
  const templates = read();
  // Prevent duplicate names
  if (templates.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
    throw new Error('A template with this name already exists');
  }
  const item = { _id: `tmpl_${Date.now()}`, name, content };
  templates.unshift(item);
  write(templates);
  return item;
};

export const updateTemplate = async (id, { name, content }) => {
  const templates = read();
  const idx = templates.findIndex((t) => t._id === id);
  if (idx === -1) throw new Error('Template not found');
  templates[idx] = { ...templates[idx], name, content };
  write(templates);
  return templates[idx];
};

export const deleteTemplate = async (id) => {
  const templates = read().filter((t) => t._id !== id);
  write(templates);
  return true;
};


