/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'], // обязательно без пробелов между ts и tsx
	theme: {
		extend: {
			zIndex: {
				'9': '9',
			  }
		},
	},
	plugins: [],
};
