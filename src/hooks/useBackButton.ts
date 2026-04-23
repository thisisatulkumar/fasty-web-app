'use client';

import { useEffect, useRef } from 'react';

type Handler = () => void;
const handlerStack: Handler[] = [];
let listenerAttached = false;

function ensureListener() {
	if (listenerAttached) return;
	listenerAttached = true;

	window.addEventListener('popstate', (e: PopStateEvent) => {
		if (e.state?.__backIntercept !== true) return;
		const top = handlerStack[handlerStack.length - 1];
		if (!top) return;
		queueMicrotask(() => top());
	});
}

export function pushSentinel() {
	if (typeof window === 'undefined') return;
	ensureListener();
	window.history.pushState(
		{ __backIntercept: true },
		'',
		window.location.pathname + window.location.search
	);
}

export function removeSentinels(count: number) {
	if (typeof window === 'undefined' || count <= 0) return;
	window.history.go(-count);
}

export function useBackButton(onBack: () => void, active = true) {
	const onBackRef = useRef(onBack);
	onBackRef.current = onBack;

	useEffect(() => {
		if (!active) return;

		const handler: Handler = () => onBackRef.current();
		handlerStack.push(handler);

		return () => {
			const idx = handlerStack.lastIndexOf(handler);
			if (idx !== -1) handlerStack.splice(idx, 1);
		};
	}, [active]);
}
