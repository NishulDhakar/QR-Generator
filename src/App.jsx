import React from 'react';
import { useState, useRef, useEffect } from 'react';
import QRCodeForm from './components/QRCodeForm';
import QRCodeDisplay from './components/QRCodeDisplay';
import QRCodeHistory from './components/QRCodeHistory';
import { useQRHistory } from './hooks/useQRHistory';

const QR_TYPES = {
  text: { label: 'Text' },
  url: { label: 'URL' },
  wifi: { label: 'WiFi' },
  email: { label: 'Email' },
  phone: { label: 'Phone' }
};
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has previously set dark mode
    const savedDarkMode = localStorage.getItem('darkMode');
    // Also check system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedDarkMode ? JSON.parse(savedDarkMode) : prefersDark;
  });
  
  const [currentTab, setCurrentTab] = useState('generator')
  const [currentType, setCurrentType] = useState('text')
  const [text, setText] = useState('')
  const [size, setSize] = useState(256)
  const [bgColor, setBgColor] = useState('#ffffff')
  const [fgColor, setFgColor] = useState('#000000')
  const [level, setLevel] = useState('H')
  const [includeMargin, setIncludeMargin] = useState(true)
  const [marginSize, setMarginSize] = useState(4)
  const [qrStyle, setQrStyle] = useState('squares')
  const [logo, setLogo] = useState(null)
  const [logoSize, setLogoSize] = useState(40)
  const [logoOpacity, setLogoOpacity] = useState(100)
  const [wifiFields, setWifiFields] = useState({
    ssid: '',
    password: '',
    encryption: 'WPA'
  })
  const [emailFields, setEmailFields] = useState({
    address: '',
    subject: '',
    body: ''
  })

  const qrRef = useRef(null)
  const { history, addToHistory, clearHistory, deleteHistoryItem } = useQRHistory()

  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update localStorage and HTML class when dark mode changes
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
          <h2 className="text-xl font-semibold">Loading Smart QR Generator...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 pb-1 tracking-tight">
            QR Generator
          </h1>
          <p className="mt-3 text-xl text-gray-400 dark:text-gray-300 max-w-2xl mx-auto">
            Create beautiful, customized QR codes for any purpose
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full shadow-lg p-1 bg-white dark:bg-gray-800">
            <button
              onClick={() => setCurrentTab('generator')}
              className={`px-4 py-2 sm:px-5 sm:py-2 text-sm font-medium rounded-full transition-colors ${
                currentTab === 'generator'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : darkMode 
                    ? 'bg-transparent text-gray-200 hover:bg-gray-700' 
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
              }`}
            >
              Generator
            </button>
            <button
              onClick={() => setCurrentTab('history')}
              className={`px-4 py-2 sm:px-5 sm:py-2 text-sm font-medium rounded-full transition-colors ${
                currentTab === 'history'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : darkMode 
                    ? 'bg-transparent text-gray-200 hover:bg-gray-700' 
                    : 'bg-transparent text-gray-700 hover:bg-gray-100'
              }`}
            >
              History ({history.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            {currentTab === 'generator' ? (
              <QRCodeForm
                text={text}
                setText={setText}
                size={size}
                setSize={setSize}
                bgColor={bgColor}
                setBgColor={setBgColor}
                fgColor={fgColor}
                setFgColor={setFgColor}
                level={level}
                setLevel={setLevel}
                includeMargin={includeMargin}
                setIncludeMargin={setIncludeMargin}
                marginSize={marginSize}
                setMarginSize={setMarginSize}
                qrStyle={qrStyle}
                setQrStyle={setQrStyle}
                logo={logo}
                setLogo={setLogo}
                logoSize={logoSize}
                setLogoSize={setLogoSize}
                logoOpacity={logoOpacity}
                setLogoOpacity={setLogoOpacity}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                qrTypes={QR_TYPES}
                currentType={currentType}
                setCurrentType={setCurrentType}
                wifiFields={wifiFields}
                setWifiFields={setWifiFields}
                emailFields={emailFields}
                setEmailFields={setEmailFields}
                addToHistory={addToHistory}
              />
            ) : (
              <QRCodeHistory
                history={history}
                clearHistory={clearHistory}
                deleteHistoryItem={deleteHistoryItem}
                loadItem={(item) => {
                  setText(item.text)
                  setSize(item.settings.size)
                  setBgColor(item.settings.bgColor)
                  setFgColor(item.settings.fgColor)
                  setLevel(item.settings.level)
                  setIncludeMargin(item.settings.includeMargin)
                  setMarginSize(item.settings.marginSize)
                  setQrStyle(item.settings.qrStyle)
                  setCurrentTab('generator')
                }}
                darkMode={darkMode}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <QRCodeDisplay
              text={text}
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
              qrRef={qrRef}
              currentType={currentType}
              wifiFields={wifiFields}
              emailFields={emailFields}
              darkMode={darkMode}
              addToHistory={addToHistory}
            />
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Smart QR Generator | Create, customize, and share QR codes with ease
          </p>
        </div>
      </div>
    </div>
  )
}

export default App;