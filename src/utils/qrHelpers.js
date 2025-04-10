export const getQRValue = (type, text, wifiFields, emailFields) => {
    switch (type) {
      case 'wifi':
        return `WIFI:T:${wifiFields.encryption};S:${wifiFields.ssid};P:${wifiFields.password};;`
      case 'email':
        return `mailto:${emailFields.address}?subject=${encodeURIComponent(emailFields.subject)}&body=${encodeURIComponent(emailFields.body)}`
      case 'phone':
        return `tel:${text}`
      case 'url':
        return text.startsWith('http') ? text : `https://${text}`
      default:
        return text
    }
  }
  
  export const getDisplayText = (type, text, wifiFields, emailFields) => {
    switch (type) {
      case 'wifi':
        return `WiFi: ${wifiFields.ssid}`
      case 'email':
        return `Email: ${emailFields.address}`
      case 'phone':
        return `Phone: ${text}`
      case 'url':
        return text.startsWith('http') ? text : `https://${text}`
      default:
        return text
    }
  }