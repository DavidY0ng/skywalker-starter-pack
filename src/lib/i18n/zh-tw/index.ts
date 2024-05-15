const lang = 'zh-tw';

export default [
	{
		locale: lang,
		key: 'common',
		loader: async () => (await import('./common.json')).default
	},
// 	{
// 		locale: lang,
// 		key: 'table',
// 		loader: async () => (await import('./table.json')).default
// 	}
];
