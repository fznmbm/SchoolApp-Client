import api from '@utils/api/axios';

const WhatsAppService = {
  // Send a single message
  sendMessage: async (to, message) => {
    return api.post('/whatsapp/send', { to, message });
  },
  
  // Send bulk messages
  sendBulkMessages: async (recipients, message) => {
    return api.post('/whatsapp/bulk-send', { recipients, message });
  },
  
  // Get all templates
  getTemplates: async () => {
    return api.get('/whatsapp/templates');
  },
  
  // Save a new template
  saveTemplate: async (template) => {
    return api.post('/whatsapp/templates', template);
  },
  
  // Update an existing template
  updateTemplate: async (id, template) => {
    return api.put(`/whatsapp/templates/${id}`, template);
  },
  
  // Delete a template
  deleteTemplate: async (id) => {
    return api.delete(`/whatsapp/templates/${id}`);
  }
};

export default WhatsAppService;