/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		cursor: {
  			'grab': 'grab',
  			'grabbing': 'grabbing'
  		}
  	}
  },
  plugins: [
  	require("tailwindcss-animate"),
  	function({ addUtilities }) {
  		addUtilities({
  			'.drag-handle': {
  				cursor: 'grab',
  				userSelect: 'none',
  				'-webkit-user-select': 'none',
  				'-moz-user-select': 'none',
  				'-ms-user-select': 'none',
  			},
  			'.drag-handle:active': {
  				cursor: 'grabbing',
  			},
  			'.dragging': {
  				userSelect: 'none',
  				'-webkit-user-select': 'none',
  				'-moz-user-select': 'none',
  				'-ms-user-select': 'none',
  			},
  			'.dnd-context': {
  				userSelect: 'none',
  				'-webkit-user-select': 'none',
  				'-moz-user-select': 'none',
  				'-ms-user-select': 'none',
  			},
  			'.dnd-context *': {
  				userSelect: 'none',
  				'-webkit-user-select': 'none',
  				'-moz-user-select': 'none',
  				'-ms-user-select': 'none',
  			},
  			'.allow-select': {
  				userSelect: 'text',
  				'-webkit-user-select': 'text',
  				'-moz-user-select': 'text',
  				'-ms-user-select': 'text',
  			},
  			'.allow-select *': {
  				userSelect: 'text',
  				'-webkit-user-select': 'text',
  				'-moz-user-select': 'text',
  				'-ms-user-select': 'text',
  			},
  			'.is-dragging': {
  				zIndex: '999',
  				boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  			},
  			'.drag-overlay': {
  				zIndex: '1000',
  				pointerEvents: 'none',
  			},
  			'.kanban-card': {
  				// No transitions - completely instant
  			},
  			'.kanban-card:hover': {
  				transform: 'translateY(-1px)',
  				boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  			},
  			'.drop-zone-active': {
  				backgroundColor: 'rgba(59, 130, 246, 0.05)',
  				border: '2px dashed rgba(59, 130, 246, 0.3)',
  			},
  		})
  	}
  ],
}

