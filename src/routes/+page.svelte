<script lang="ts">
	import { QrScanner, QrScannerOverlay } from '$lib/components/qr-scanner';

	function onResult(data: string) {
		console.log(data);
	}

	function onError(err: Error) {
		console.error(err);
	}
</script>

<h1>Welcome to SvelteKit</h1>

<QrScanner {onResult} {onError} class="aspect-square max-h-[320px]">
	<QrScannerOverlay />
</QrScanner>
