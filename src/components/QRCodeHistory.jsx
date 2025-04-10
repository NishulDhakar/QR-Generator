import React, { useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function QRCodeHistory({
  history,
  clearHistory,
  deleteHistoryItem,
  loadItem,
  darkMode
}) {
  const fileInputRef = useRef(null);

  const exportHistory = () => {
    if (history.length === 0) return;
    
    const dataStr = JSON.stringify(history);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'qr-history.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  const importHistory = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importedHistory = JSON.parse(e.target.result);
        
        if (Array.isArray(importedHistory) && importedHistory.length > 0) {
          // Replace current history with imported history
          localStorage.setItem('qrHistory', JSON.stringify(importedHistory));
          // Refresh the page to load the new history
          window.location.reload();
        } else {
          alert('The imported file does not contain valid QR history.');
        }
      } catch (error) {
        console.error('Error importing history:', error);
        alert('Failed to import history. Please check the file format.');
      }
    };
    
    reader.readAsText(file);
  };
  
  const triggerImportDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold">QR Code History</h2>
        <div className="flex space-x-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={importHistory}
            className="hidden"
            accept=".json"
          />
          
          <button
            onClick={triggerImportDialog}
            className={`text-sm font-medium transition-colors flex items-center ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import
          </button>
          
          {history.length > 0 && (
            <>
              <button
                onClick={exportHistory}
                className={`text-sm font-medium transition-colors flex items-center ${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-800'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
              
              <button
                onClick={clearHistory}
                className={`text-sm font-medium transition-colors flex items-center ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All
              </button>
            </>
          )}
        </div>
      </div>

      <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {history.length > 0 ? (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div 
                key={index} 
                className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="flex items-start">
                  <div className="mr-4 p-2 bg-white rounded-lg shadow-sm">
                    <QRCodeSVG
                      value={item.text}
                      size={80}
                      bgColor={item.settings.bgColor}
                      fgColor={item.settings.fgColor}
                      ecLevel={item.settings.level}
                      includeMargin={item.settings.includeMargin}
                      margin={item.settings.marginSize}
                      dotsOnly={item.settings.qrStyle === 'dots'}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => loadItem(item)}
                          className={`p-1 rounded transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                          title="Load QR code"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteHistoryItem(index)}
                          className={`p-1 rounded transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                          title="Delete QR code"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className={`font-medium mt-1 break-all ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {item.text.length > 100 ? `${item.text.substring(0, 100)}...` : item.text}
                    </p>
                    <div className="mt-3">
                      <button
                        onClick={() => loadItem(item)}
                        className={`text-sm font-medium py-1 px-3 rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-blue-900 text-blue-300 hover:bg-blue-800' 
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        Load & Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-12 rounded-lg border-2 border-dashed ${darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg">No history yet</p>
            <p className="mt-1">Generate some QR codes to see them here</p>
          </div>
        )}
      </div>
    </div>
  )
}