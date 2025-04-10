import React from 'react'
import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { saveAs } from 'file-saver'
import domtoimage from 'dom-to-image'
import QRCodePreview from './QRCodePreview'

export default function QRCodeDisplay({
  text,
  size,
  bgColor,
  fgColor,
  level,
  includeMargin,
  marginSize,
  qrStyle,
  logo,
  logoSize,
  logoOpacity,
  qrRef,
  currentType,
  wifiFields,
  emailFields,
  darkMode,
  addToHistory
}) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)

  const getQRValue = () => {
    switch (currentType) {
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

  const getDisplayText = () => {
    switch (currentType) {
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

  const downloadQRCode = async (format = 'png') => {
    if (!text && currentType !== 'wifi' && currentType !== 'email') return
    
    setIsDownloading(true)
    
    try {
      if (format === 'png') {
        const dataUrl = await domtoimage.toPng(qrRef.current, {
          quality: 1,
          width: size + (includeMargin ? marginSize * 2 : 0),
          height: size + (includeMargin ? marginSize * 2 : 0),
          style: {
            transform: 'none',
            background: bgColor
          }
        })
        saveAs(dataUrl, `qrcode-${text ? text.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '-') : 
          currentType === 'wifi' ? wifiFields.ssid : 
          emailFields.address}.png`)
      } else if (format === 'svg') {
        const svg = qrRef.current
        const svgData = new XMLSerializer().serializeToString(svg)
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'})
        saveAs(svgBlob, `qrcode-${text ? text.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '-') : 
          currentType === 'wifi' ? wifiFields.ssid : 
          emailFields.address}.svg`)
      }
    } catch (error) {
      console.error('Error generating QR code:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleCopy = () => {
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const shareQRCode = async (platform) => {
    if (!text && currentType !== 'wifi' && currentType !== 'email') return
    
    try {
      const dataUrl = await domtoimage.toPng(qrRef.current, {
        quality: 1,
        width: size + (includeMargin ? marginSize * 2 : 0),
        height: size + (includeMargin ? marginSize * 2 : 0),
        style: {
          transform: 'none',
          background: bgColor
        }
      })
      
      // Create a blob from dataUrl
      const blob = await fetch(dataUrl).then(r => r.blob())
      
      if (navigator.share && platform === 'native') {
        try {
          const file = new File([blob], 'qrcode.png', { type: 'image/png' });
          await navigator.share({
            title: 'QR Code',
            text: 'Check out my QR code!',
            files: [file]
          });
        } catch (error) {
          console.error('Error sharing:', error);
          // Fall back to download if sharing fails
          saveAs(dataUrl, `qrcode.png`);
        }
      } else {
        // Just download the file if Web Share API is not supported
        saveAs(dataUrl, `qrcode.png`);
      }
    } catch (error) {
      console.error('Error generating QR code for sharing:', error)
    }
  }

  return (
    <div className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold">QR Code Preview</h2>
      </div>
      
      <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-center mb-6">
          {text || currentType === 'wifi' || currentType === 'email' ? (
            <div className="flex justify-center w-full transform transition-all duration-300 hover:scale-105">
              <QRCodePreview
                value={getQRValue()}
                size={size}
                bgColor={bgColor}
                fgColor={fgColor}
                level={level}
                includeMargin={includeMargin}
                marginSize={marginSize}
                qrStyle={qrStyle}
                logo={logo}
                logoSize={logoSize}
                logoOpacity={logoOpacity}
                darkMode={darkMode}
              />
              <div className="hidden">
                <QRCodeSVG
                  ref={qrRef}
                  value={getQRValue()}
                  size={size}
                  bgColor={bgColor}
                  fgColor={fgColor}
                  ecLevel={level}
                  includeMargin={includeMargin}
                  margin={marginSize}
                  dotsOnly={qrStyle === 'dots'}
                />
              </div>
            </div>
          ) : (
            <div className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl ${darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <p>Add content to generate a QR code</p>
            </div>
          )}
        </div>

        {(text || currentType === 'wifi' || currentType === 'email') && (
          <>
            <div className="mb-6">
              <button 
                onClick={() => setShowOptions(!showOptions)}
                className={`flex items-center justify-between w-full py-3 px-4 rounded-lg transition-colors ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Encoded Data</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transform transition-transform ${showOptions ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showOptions && (
                <div className={`p-4 mt-2 rounded-lg break-all transition-colors ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}>
                  {getDisplayText()}
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => downloadQRCode('png')}
                disabled={(!text && currentType !== 'wifi' && currentType !== 'email') || isDownloading}
                className={`px-4 py-2 rounded-lg text-white font-medium flex items-center transition-colors ${
                  (!text && currentType !== 'wifi' && currentType !== 'email') 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : isDownloading 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                }`}
              >
                {isDownloading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download PNG
                  </>
                )}
              </button>

              <button
                onClick={() => downloadQRCode('svg')}
                disabled={(!text && currentType !== 'wifi' && currentType !== 'email') || isDownloading}
                className={`px-4 py-2 rounded-lg text-white font-medium transition-colors flex items-center ${
                  (!text && currentType !== 'wifi' && currentType !== 'email') 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download SVG
              </button>

              <CopyToClipboard
                text={getDisplayText()}
                onCopy={handleCopy}
              >
                <button className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  {isCopied ? 'Copied!' : 'Copy Text'}
                </button>
              </CopyToClipboard>

              <div className="relative">
                <button
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  disabled={!text && currentType !== 'wifi' && currentType !== 'email'}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                    (!text && currentType !== 'wifi' && currentType !== 'email') 
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                      : darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  Share
                </button>
                
                {showShareOptions && (
                  <div className={`absolute right-0 mt-2 py-2 w-48 rounded-md shadow-lg z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                      onClick={() => {
                        shareQRCode('native');
                        setShowShareOptions(false);
                      }}
                      className={`w-full px-4 py-2 text-left transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                        </svg>
                        Share QR Code
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}