/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#5d03a5",
        secondary: "#56d722",
        darkBg: "#4169E1",
        darkText: "#f8f8f8",
        lightBg: "#FFFFFF",
        lightText: "#4169E1",
      },
      fontFamily: {
        sans: ['monospace','sans-serif'],
        serif: ['monospace','sans-serif'],
        mono: ['monospace','sans-serif'],
      },
    },
  },
  plugins: [    
  ],
  
}

// 主藍色 #4169E1


// •	text-base (預設大小 16px)
// •	sm:text-lg (螢幕 ≥ 640px 時變成 18px )
// •	md:text-xl (螢幕 ≥ 768px 時變成 20px )
// •	lg:text-2xl (螢幕 ≥ 1024px 時變成 24px )
// •	xl:text-3xl (螢幕 ≥ 1280px 時變成 30px )

// iphone 360
// ipad 820
