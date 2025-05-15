import { motion } from 'framer-motion';

export default function NumericKeypad({ onKeyPress, password, theme }) {
  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'backspace']
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-2 mb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < password.length
                ? 'bg-primary'
                : theme === 'dark'
                ? 'bg-white/20'
                : 'bg-black/20'
            }`}
          />
        ))}
      </div>

      {buttons.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center space-x-4">
          {row.map((num) => (
            <motion.button
              key={num}
              whileTap={{ scale: 0.9 }}
              className={`w-14 h-14 rounded-xl text-lg font-medium transition-colors
                ${num === ''
                  ? 'pointer-events-none'
                  : num === 'backspace'
                  ? 'flex items-center justify-center text-primary hover:bg-primary/10'
                  : `hover:bg-primary/10 ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}`}
              onClick={() => onKeyPress(num)}
              disabled={!num}
            >
              {num === 'backspace' ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
                  />
                </svg>
              ) : num || ''}
            </motion.button>
          ))}
        </div>
      ))}
    </div>
  );
}