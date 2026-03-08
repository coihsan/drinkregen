import React from 'react';
import type { SVGProps } from 'react';

export function Loading(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="#fefefe" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity={0.5} strokeWidth={0.5} stroke="#fefefe"></path><path fill="#fefefe" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z" strokeWidth={0.5} stroke="#fefefe"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"></animateTransform></path></svg>);
}