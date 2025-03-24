
export const communicationTemplates = [
  {
    id: 'meeting-announcement',
    name: 'Meeting Announcement',
    subject: 'Association Meeting Announcement',
    message: 'Dear members, we will have our [meeting_type] meeting on [date] at [time] at [location]. The agenda includes [agenda_items]. Your attendance is [importance].',
    description: 'Template for announcing association meetings',
    variables: ['meeting_type', 'date', 'time', 'location', 'agenda_items', 'importance'],
    type: 'sms'
  },
  {
    id: 'price-update',
    name: 'Price Update',
    subject: 'Coffee Price Update',
    message: 'Dear members, we would like to inform you that the coffee prices have [change_direction] by [percentage]%. The new price for [coffee_type] is now [new_price] per kg. This change will be effective from [effective_date].',
    description: 'Template for coffee price updates',
    variables: ['change_direction', 'percentage', 'coffee_type', 'new_price', 'effective_date'],
    type: 'sms'
  },
  {
    id: 'training-notification',
    name: 'Training Notification',
    subject: 'Upcoming Training Session',
    message: 'We are organizing a training workshop on [training_topic] on [date] from [start_time] to [end_time] at [location]. Trainer: [trainer_name]. Please bring [requirements].',
    description: 'Template for upcoming training sessions',
    variables: ['training_topic', 'date', 'start_time', 'end_time', 'location', 'trainer_name', 'requirements'],
    type: 'whatsapp'
  },
  {
    id: 'certification-alert',
    name: 'Certification Alert',
    subject: 'Certification Program',
    message: 'New [certification_type] certification program available. Benefits: [benefits]. Cost: [cost]. Duration: [duration]. Register before [deadline] by contacting [contact_person] at [contact_info].',
    description: 'Template for certification programs',
    variables: ['certification_type', 'benefits', 'cost', 'duration', 'deadline', 'contact_person', 'contact_info'],
    type: 'email'
  },
  {
    id: 'delivery-schedule',
    name: 'Delivery Schedule',
    subject: 'Coffee Delivery Schedule',
    message: 'The next coffee collection will be on [date]. Please prepare your harvest. Required quality: [quality_requirements]. Minimum quantity: [minimum_quantity]. Contact [contact_person] for any questions.',
    description: 'Template for delivery schedules',
    variables: ['date', 'quality_requirements', 'minimum_quantity', 'contact_person'],
    type: 'sms'
  }
];

export const getTemplateById = (id) => {
  return communicationTemplates.find(template => template.id === id);
};

export const fillTemplate = (templateId, variables) => {
  const template = getTemplateById(templateId);
  if (!template) return null;
  
  let message = template.message;
  let subject = template.subject;
  
  Object.keys(variables).forEach(key => {
    const placeholder = `[${key}]`;
    message = message.replace(new RegExp(placeholder, 'g'), variables[key]);
    subject = subject.replace(new RegExp(placeholder, 'g'), variables[key]);
  });
  
  return {
    subject,
    message,
    type: template.type
  };
};
