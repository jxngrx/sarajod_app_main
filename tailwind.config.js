/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: [
        './app/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}'
    ],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            boxShadow: {
                torch: '0 0 30px rgba(255, 255, 255, 0.7)', // Glowing effect
                'torch-lg': '0 0 60px rgba(255, 255, 255, 0.9)' // Stronger glow for emphasis
            },
            transform: {
                'scale-110': 'scale(1.1)' // For scaling up the element slightly
            },
            keyframes: {
                smoothPulse: {
                    '0%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                    '100%': { opacity: '1' }
                },
                slideIn: {
                    '0%': { transform: 'translateX(-100%)' }, // start off-screen
                    '100%': { transform: 'translateX(0)' } // slide into view
                },
                slideOut: {
                    '0%': { transform: 'translateX(0)' }, // start in view
                    '100%': { transform: 'translateX(-100%)' } // slide out of view
                }
            },
            animation: {
                smoothPulse: 'smoothPulse 1.5s ease-in-out',
                slideIn: 'slideIn 0.3s ease-in-out',
                slideOut: 'slideOut 0.3s ease-in-out'
            }
        }
    },
    plugins: []
};
