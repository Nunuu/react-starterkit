import { fireEvent, render, screen } from '@testing-library/react';

import App from './App';

describe(`${App.name}`, () => {
	const setup = () => render(<App />);

	it('renders Vite and React logos', () => {
		setup();
		const viteLogo = screen.getByAltText(/Vite logo/);
		const reactLogo = screen.getByAltText(/React logo/);
		expect(viteLogo).toBeInTheDocument();
		expect(reactLogo).toBeInTheDocument();
	});

	it('renders page title', () => {
		setup();
		const title = screen.getByText(/Vite \+ React/);
		expect(title).toBeInTheDocument();
	});

	it('increases count on count button click', () => {
		setup();
		const countButton = screen.getByText(/count is 0/);
		fireEvent.click(countButton);
		expect(countButton).toHaveTextContent(/count is 1/);
	});
});
