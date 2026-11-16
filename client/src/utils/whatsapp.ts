import { Property } from '../data/chennaiProperties';

const normalizeWhatsAppNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '916300409615';
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return `91${digits.slice(1)}`;
  return digits;
};

/** WhatsApp Legal Desk number, configurable through VITE_WHATSAPP_NUMBER. */
export const LEGAL_DESK_WHATSAPP = normalizeWhatsAppNumber(
  import.meta.env.VITE_WHATSAPP_NUMBER || '916300409615'
);

/**
 * Builds the pre-filled WhatsApp message for a property card so the buyer
 * only has to press send in their own WhatsApp app.
 */
export const buildPropertyWhatsAppMessage = (property: Property): string => {
  const landShare = property.landUnits
    ? `${property.landUnits.grounds ?? 0} Ground (${property.landUnits.cents ?? 0} Cents)`
    : '';

  const lines: string[] = [
    'Hello RJ Land Ventures WhatsApp Legal Desk,',
    '',
    'I am interested in this property:',
    `*${property.title}*`,
    `Type: ${property.type === 'plot' ? 'Land / Plot' : 'Flat / Apartment'}`,
    ...(property.bhk ? [`Configuration: ${property.bhk}`] : []),
    `Location: ${property.locality} (${property.zone})`,
    `Address: ${property.address}`,
    `Price: ${property.priceDisplay} · ${property.pricePerUnit}`,
    `Area: ${property.areaSqFt.toLocaleString('en-IN')} sq.ft${landShare ? ` · ${landShare}` : ''}`,
    ...(property.uds ? [`UDS: ${property.uds} sq.ft`] : []),
    `Facing: ${property.facing}`,
    `Approval: ${property.approval}`,
    `Patta Status: ${property.pattaStatus}`,
    ...(property.googleMapsUrl ? [`Google Maps: ${property.googleMapsUrl}`] : []),
    '',
    'Please share the legal documents, approval details and site visit information.',
  ];

  return lines.join('\n');
};

export const getWhatsAppChatUrl = (message: string): string =>
  `https://wa.me/${LEGAL_DESK_WHATSAPP}?text=${encodeURIComponent(message)}`;

export const getPropertyWhatsAppUrl = (property: Property): string =>
  getWhatsAppChatUrl(buildPropertyWhatsAppMessage(property));

export const openPropertyWhatsApp = (property: Property): void => {
  window.open(getPropertyWhatsAppUrl(property), '_blank', 'noopener,noreferrer');
};
