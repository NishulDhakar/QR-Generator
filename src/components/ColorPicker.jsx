import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { ChromePicker } from 'react-color'

// Common colors palette
const PALETTE_COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', 
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#008000', '#800000', '#008080', '#000080', '#808080'
]

export default function ColorPicker({ color, onChange, label, darkMode }) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false)
  const colorPickerRef = useRef(null)

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker)
  }

  const handleClose = () => {
    setDisplayColorPicker(false)
  }

  const handleChange = (color) => {
    onChange(color)
  }

  const handlePaletteColorClick = (colorHex) => {
    onChange({ hex: colorHex })
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setDisplayColorPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative mb-4">
      <div className="flex items-center">
        <div 
          className={`w-12 h-8 rounded cursor-pointer border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
          style={{ backgroundColor: color }}
          onClick={handleClick}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange({ hex: e.target.value })}
          className={`ml-3 p-2 border rounded-lg flex-1 transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
        />
      </div>
      
      <div className="flex flex-wrap gap-1 mt-2">
        {PALETTE_COLORS.slice(0, 8).map((colorHex) => (
          <div
            key={colorHex}
            className="w-6 h-6 rounded-full cursor-pointer border border-gray-300 hover:scale-110 transition-transform"
            style={{ backgroundColor: colorHex }}
            onClick={() => handlePaletteColorClick(colorHex)}
            title={colorHex}
          />
        ))}
      </div>
      
      {displayColorPicker && (
        <div 
          className="absolute z-50 mt-2" 
          ref={colorPickerRef}
        >
          <div 
            className="fixed top-0 right-0 bottom-0 left-0" 
            onClick={handleClose}
          />
          <ChromePicker 
            color={color} 
            onChange={handleChange} 
            disableAlpha={false}
          />
        </div>
      )}
    </div>
  )
} 