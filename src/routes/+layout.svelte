<script lang="ts">
	import { onMount } from 'svelte';
	import { onDestroy } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { startAppServices, stopAppServices } from '$lib/bootstrap/app-bootstrap.js';
	import AlertGlobal from '$lib/components/alert-global.svelte';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();

	onMount(() => {
		startAppServices();
	});

	onDestroy(() => {
		stopAppServices();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<AlertGlobal />
<ModeWatcher />
{@render children()}
