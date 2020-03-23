export const STATIC = window.location.port === '41999' || window.location.host === 'actarian.github.io';
export const DEVELOPMENT = window.location.host.indexOf('localhost') === 0;
export const PRODUCTION = !DEVELOPMENT;
export const ENV = {
	STATIC,
	DEVELOPMENT,
	PRODUCTION
};
