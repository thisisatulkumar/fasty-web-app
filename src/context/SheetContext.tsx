'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SheetContextType {
	open: boolean;
	setOpen: (open: boolean) => void;
	openCart: () => void;
	closeCart: () => void;
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export function SheetProvider({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);

	const openCart = () => setOpen(true);
	const closeCart = () => setOpen(false);

	return (
		<SheetContext.Provider value={{ open, setOpen, openCart, closeCart }}>
			{children}
		</SheetContext.Provider>
	);
}

export function useSheet() {
	const context = useContext(SheetContext);
	if (context === undefined) {
		throw new Error('useSheet must be used within a SheetProvider');
	}
	return context;
}
