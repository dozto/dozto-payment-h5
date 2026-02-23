<script lang="ts">
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { initDb } from '$lib/db';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();

	onMount(() => {
		initDb();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<ModeWatcher />
{@render children()}
