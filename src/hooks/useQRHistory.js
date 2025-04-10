import { useState, useEffect } from 'react';

export function useQRHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('qrHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('qrHistory', JSON.stringify(history));
    } else {
      localStorage.removeItem('qrHistory');
    }
  }, [history]);

  const addToHistory = (item) => {
    if (!item.text) return;
    
    const newItem = {
      text: item.text,
      timestamp: new Date().toISOString(),
      settings: {
        size: item.size,
        bgColor: item.bgColor,
        fgColor: item.fgColor,
        level: item.level,
        includeMargin: item.includeMargin,
        marginSize: item.marginSize,
        qrStyle: item.qrStyle
      }
    };
    
    setHistory(prev => {
      if (!prev.some(i => i.text === newItem.text)) {
        return [newItem, ...prev.slice(0, 9)];
      }
      return prev;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('qrHistory');
  };

  const deleteHistoryItem = (index) => {
    setHistory(prev => {
      const newHistory = [...prev];
      newHistory.splice(index, 1);
      return newHistory;
    });
  };

  return { history, addToHistory, clearHistory, deleteHistoryItem };
}