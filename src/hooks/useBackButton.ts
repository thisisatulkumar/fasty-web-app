'use client';

import { useEffect, useRef } from 'react';

const useBackButton = (onBack: () => void): void => {
	const onBackRef = useRef(onBack);

	// Keep ref up to date without triggering effect re-runs
	useEffect(() => {
		onBackRef.current = onBack;
	}, [onBack]);

	useEffect(() => {
		window.history.pushState({ intercepted: true }, '');

		const handlePopState = (): void => {
			window.history.pushState({ intercepted: true }, '');
			onBackRef.current(); // always calls latest version
		};

		window.addEventListener('popstate', handlePopState);

		return () => {
			window.removeEventListener('popstate', handlePopState);
			window.history.back();
		};
	}, []);
};

export default useBackButton;
