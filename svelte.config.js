import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			$store: 'src/lib/stores',
			$config: 'src/lib/config',
			$service: 'src/lib/services',
			$types: 'src/lib/types',
			$api: 'src/lib/api',
			$db: 'src/lib/db',
			$socket: 'src/lib/socket',
			$utils: 'src/lib/utils'
		}
	}
};

export default config;
