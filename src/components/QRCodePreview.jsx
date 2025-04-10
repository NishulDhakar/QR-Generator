import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodePreview = ({ 
  value, 
  size = 256,
  bgColor = '#ffffff',
  fgColor = '#000000',
  level = 'H',
  includeMargin = true,
  marginSize = 4,
  qrStyle = 'squares',
  logo,
  logoSize = 40,
  logoOpacity = 100,
  darkMode = false
}) => {
  if (!value) return null;
  
  return (
    <div className="relative group">
      <div className={`p-6 border rounded-xl shadow-md transition-all duration-300 group-hover:shadow-xl ${darkMode ? 'shadow-gray-900 border-gray-700' : 'shadow-gray-200 border-gray-200'}`} 
        style={{ backgroundColor: bgColor }}>
        <div className="relative">
          <QRCodeSVG
            value={value}
            size={size}
            bgColor={bgColor}
            fgColor={fgColor}
            level={level}
            includeMargin={includeMargin}
            margin={marginSize}
            dotsOnly={qrStyle === 'dots'}
            className="transition-all duration-300"
          />
          {logo && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <img 
                src={logo} 
                alt="QR Code Logo" 
                style={{
                  width: `${logoSize}px`,
                  height: `${logoSize}px`,
                  opacity: logoOpacity / 100
                }}
                className="transition-all duration-300"
              />
            </div>
          )}
        </div>
      </div>
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100/30'}`}>
        <div className={`px-4 py-2 rounded-lg text-white font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ${darkMode ? 'bg-indigo-600 shadow-lg' : 'bg-blue-600 shadow-lg'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          Preview
        </div>
      </div>
    </div>
  );
};

export default QRCodePreview;