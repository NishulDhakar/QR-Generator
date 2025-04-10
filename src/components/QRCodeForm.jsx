import React, { useState, useEffect, useRef } from 'react'
import ColorPicker from './ColorPicker'
import { QR_TEMPLATES } from '../utils/qrTemplates'

export default function QRCodeForm({
  text,
  setText,
  size,
  setSize,
  bgColor,
  setBgColor,
  fgColor,
  setFgColor,
  level,
  setLevel,
  includeMargin,
  setIncludeMargin,
  marginSize,
  setMarginSize,
  qrStyle,
  setQrStyle,
  logo,
  setLogo,
  logoSize,
  setLogoSize,
  logoOpacity,
  setLogoOpacity,
  darkMode,
  toggleDarkMode,
  qrTypes,
  currentType,
  setCurrentType,
  wifiFields,
  setWifiFields,
  emailFields,
  setEmailFields,
  addToHistory
}) {
  const [activeTab, setActiveTab] = useState('content')
  const [animating, setAnimating] = useState(false)

  const handleTabChange = (tab) => {
    if (tab === activeTab) return
    setAnimating(true)
    setTimeout(() => {
      setActiveTab(tab)
      setAnimating(false)
    }, 150)
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogo(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogo(null)
  }

  const handleTextChange = (e) => {
    setText(e.target.value)
  }

  const handleBlur = () => {
    if (text || currentType === 'wifi' || currentType === 'email') {
      addToHistory({
        text: currentType === 'wifi' ? `WIFI:${wifiFields.ssid}` : 
             currentType === 'email' ? `EMAIL:${emailFields.address}` : 
             text,
        size,
        bgColor,
        fgColor,
        level,
        includeMargin,
        marginSize,
        qrStyle
      })
    }
  }

  return (
    <div className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold">QR Code Settings</h2>
        <button
          onClick={toggleDarkMode}
          className={`p-3 rounded-full transition-transform hover:scale-110 ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-gray-700'}`}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>

      <div className={`flex border-b border-gray-200 dark:border-gray-700 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <button
          onClick={() => handleTabChange('content')}
          className={`px-6 py-3 font-medium transition-colors flex items-center ${activeTab === 'content' 
            ? `${darkMode ? 'bg-gray-800 text-blue-400 border-blue-400' : 'bg-white text-blue-600 border-blue-600'} border-b-2` 
            : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Content
          </div>
        </button>
        <button
          onClick={() => handleTabChange('appearance')}
          className={`px-6 py-3 font-medium transition-colors flex items-center ${activeTab === 'appearance' 
            ? `${darkMode ? 'bg-gray-800 text-blue-400 border-blue-400' : 'bg-white text-blue-600 border-blue-600'} border-b-2` 
            : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Appearance
          </div>
        </button>
        <button
          onClick={() => handleTabChange('logo')}
          className={`px-6 py-3 font-medium transition-colors flex items-center ${activeTab === 'logo' 
            ? `${darkMode ? 'bg-gray-800 text-blue-400 border-blue-400' : 'bg-white text-blue-600 border-blue-600'} border-b-2` 
            : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Logo
          </div>
        </button>
      </div>

      <div className={`p-6 relative min-h-[400px] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`transition-opacity duration-150 absolute inset-0 p-6 ${activeTab === 'content' ? 'opacity-100 z-10' : 'opacity-0 z-0'} ${animating ? 'pointer-events-none' : ''}`}>
          <div className="space-y-6">
            <div className="animate-fadeIn">
              <label htmlFor="qrType" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                QR Code Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
                {Object.entries(qrTypes).map(([key, value]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCurrentType(key)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors ${
                      currentType === key 
                        ? `bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-300` 
                        : `border-gray-300 dark:border-gray-600 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                    }`}
                  >
                    {key === 'text' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                    )}
                    {key === 'url' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 010-5.656l4-4a4 4 0 015.656 5.656l-1.1 1.1" />
                      </svg>
                    )}
                    {key === 'wifi' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.143 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                    )}
                    {key === 'email' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                    {key === 'phone' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    )}
                    <span className="text-sm">{value.label}</span>
                  </button>
                ))}
              </div>
              
              <select
                id="qrType"
                value={currentType}
                onChange={(e) => setCurrentType(e.target.value)}
                className={`hidden w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
              >
                {Object.entries(qrTypes).map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>
            </div>

            {currentType === 'wifi' ? (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Network Name (SSID)
                  </label>
                  <input
                    type="text"
                    value={wifiFields.ssid}
                    onChange={(e) => setWifiFields({...wifiFields, ssid: e.target.value})}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
                    placeholder="Enter network name"
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Password
                  </label>
                  <input
                    type="text"
                    value={wifiFields.password}
                    onChange={(e) => setWifiFields({...wifiFields, password: e.target.value})}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
                    placeholder="Enter network password"
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Encryption
                  </label>
                  <select
                    value={wifiFields.encryption}
                    onChange={(e) => setWifiFields({...wifiFields, encryption: e.target.value})}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="">None</option>
                  </select>
                </div>
              </div>
            ) : currentType === 'email' ? (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={emailFields.address}
                    onChange={(e) => setEmailFields({...emailFields, address: e.target.value})}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
                    placeholder="recipient@example.com"
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Subject
                  </label>
                  <input
                    type="text"
                    value={emailFields.subject}
                    onChange={(e) => setEmailFields({...emailFields, subject: e.target.value})}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
                    placeholder="Email subject"
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Body
                  </label>
                  <textarea
                    value={emailFields.body}
                    onChange={(e) => setEmailFields({...emailFields, body: e.target.value})}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
                    placeholder="Email content"
                    rows="3"
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="text" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {currentType === 'url' ? 'URL' : currentType === 'phone' ? 'Phone Number' : 'Text'}
                </label>
                <input
                  type={currentType === 'phone' ? 'tel' : 'text'}
                  id="text"
                  value={text}
                  onChange={handleTextChange}
                  onBlur={handleBlur}
                  placeholder={
                    currentType === 'url' ? 'https://example.com' : 
                    currentType === 'phone' ? '+1234567890' : 
                    'Enter your text here'
                  }
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
                />
              </div>
            )}
          </div>
        </div>

        <div className={`transition-opacity duration-150 absolute inset-0 p-6 ${activeTab === 'appearance' ? 'opacity-100 z-10' : 'opacity-0 z-0'} ${animating ? 'pointer-events-none' : ''}`}>
          <div className="space-y-6">
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Templates
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {QR_TEMPLATES.map((template, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setBgColor(template.bgColor);
                      setFgColor(template.fgColor);
                      setQrStyle(template.qrStyle);
                      setIncludeMargin(template.includeMargin);
                      setMarginSize(template.marginSize);
                      setLevel(template.level);
                    }}
                    className={`p-3 border rounded-lg transition-colors flex items-center ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}
                  >
                    <div 
                      className="w-8 h-8 mr-2 rounded-md"
                      style={{ backgroundColor: template.bgColor }}
                    >
                      <div 
                        className="w-5 h-5 m-1.5 rounded-sm"
                        style={{ backgroundColor: template.fgColor }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{template.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="size" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Size (px)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    id="size"
                    min="100"
                    max="1000"
                    value={size}
                    onChange={(e) => setSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="w-16 text-center font-medium">{size}</span>
                </div>
              </div>

              <div>
                <label htmlFor="level" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Error Correction
                </label>
                <select
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fgColor" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  QR Code Color
                </label>
                <ColorPicker
                  color={fgColor}
                  onChange={(color) => setFgColor(color.hex)}
                  darkMode={darkMode}
                />
              </div>

              <div>
                <label htmlFor="bgColor" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Background Color
                </label>
                <ColorPicker
                  color={bgColor}
                  onChange={(color) => setBgColor(color.hex)}
                  darkMode={darkMode}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  QR Style
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setQrStyle('squares')}
                    className={`flex-1 py-2 px-3 rounded-lg border transition-colors ${
                      qrStyle === 'squares' 
                        ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-300' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    Squares
                  </button>
                  <button
                    type="button"
                    onClick={() => setQrStyle('dots')}
                    className={`flex-1 py-2 px-3 rounded-lg border transition-colors ${
                      qrStyle === 'dots' 
                        ? 'bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-300' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    Dots
                  </button>
                </div>
              </div>

              <div>
                <label className={`flex items-center space-x-3 mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  <input
                    type="checkbox"
                    checked={includeMargin}
                    onChange={(e) => setIncludeMargin(e.target.checked)}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium">Include Margin</span>
                </label>

                {includeMargin && (
                  <div className="mt-4">
                    <label htmlFor="marginSize" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Margin Size
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        id="marginSize"
                        min="1"
                        max="10"
                        value={marginSize}
                        onChange={(e) => setMarginSize(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                      <span className="w-8 text-center font-medium">{marginSize}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={`transition-opacity duration-150 absolute inset-0 p-6 ${activeTab === 'logo' ? 'opacity-100 z-10' : 'opacity-0 z-0'} ${animating ? 'pointer-events-none' : ''}`}>
          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {logo ? 'Change Logo' : 'Add Logo'}
              </label>
              <div className="flex items-center space-x-4">
                <label className={`flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'}`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {logo ? (
                      <img src={logo} alt="Logo" className="w-20 h-20 object-contain" />
                    ) : (
                      <>
                        <svg className="w-10 h-10 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Upload logo</p>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleLogoUpload}
                    accept="image/*"
                  />
                </label>
                
                {logo && (
                  <button
                    onClick={removeLogo}
                    className="py-2 px-4 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {logo && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="logoSize" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Logo Size (px)
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      id="logoSize"
                      min="20"
                      max="100"
                      value={logoSize}
                      onChange={(e) => setLogoSize(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <span className="w-12 text-center font-medium">{logoSize}</span>
                  </div>
                </div>
                <div>
                  <label htmlFor="logoOpacity" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Logo Opacity
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      id="logoOpacity"
                      min="10"
                      max="100"
                      value={logoOpacity}
                      onChange={(e) => setLogoOpacity(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <span className="w-12 text-center font-medium">{logoOpacity}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}