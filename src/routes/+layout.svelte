<script lang="ts">
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initDb } from '$lib/db';
	import { GlobalAlertStack } from '$lib/alert';
	import { initSocket } from '$lib/socket';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();

	onMount(() => {
		initDb();
		initSocket();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<GlobalAlertStack />
<ModeWatcher />
{@render children()}
