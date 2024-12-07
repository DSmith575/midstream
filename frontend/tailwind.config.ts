import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import { nextui } from '@nextui-org/react';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
	darkMode: ['class'],
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
		'./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			fontFamily: {
				heading: ['var(--font-heading)', ...fontFamily.sans],
					inter: ['Inter', 'sans-serif'],
					lato: ['Lato', 'sans-serif'],
					nunito: ['Nunito', 'sans-serif'],
					openSans: ['"Open Sans"', 'sans-serif'],
			},
			colors: {
				brand: {
					'25': '#F8F9FD',
					'50': '#F0F4FA',
					'100': '#E1E9F6',
					'200': '#C3D3ED',
					'300': '#A5BDE4',
					'400': '#87A7DB',
					'500': '#6991D2',
					'600': '#4B76C9',
					'700': '#3659B1',
					'800': '#284189',
					'900': '#1B2A61',
					'950': '#111A3E',
				},
				'discord-background': '#36393f',
				'discord-brand-color': '#5865f2',
				'discord-gray': '#36393f',
				'discord-text': '#dcddde',
				'discord-timestamp': '#72767d',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
		},
	},
	plugins: [nextui(), tailwindcssAnimate],
};

export default config;
