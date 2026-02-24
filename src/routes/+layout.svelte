<script lang="ts">
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initDb } from '$db';
	import AlertGlobal from '$lib/components/alert-global.svelte';
	import { initSocket } from '$socket';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();

	onMount(() => {
		initDb();
		initSocket();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<AlertGlobal />
<ModeWatcher />
{@render children()}
