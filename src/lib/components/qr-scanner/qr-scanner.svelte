<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import QrScanner from 'qr-scanner';
	// Resolve worker URL for Vite so the worker is bundled and available in production
	import workerUrl from 'qr-scanner/qr-scanner-worker.min.js?url';
	import { cn } from '$lib/utils.js';
	import type { ScanResult, QrScannerStatus } from './types.js';

	let {
		onResult,
		onError,
		preferredCamera = 'environment',
		maxScansPerSecond = 25,
		class: className,
		ref = $bindable(null),
		children
	}: {
		onResult: (data: string, detail?: ScanResult) => void;
		onError?: (error: Error) => void;
		preferredCamera?: 'environment' | 'user' | string;
		maxScansPerSecond?: number;
		class?: string;
		ref?: HTMLDivElement | null;
		children?: import('svelte').Snippet;
	} = $props();

	let videoEl: HTMLVideoElement;
	let status = $state<QrScannerStatus>('idle');
	let errorMessage = $state<string>('');

	let qrScanner: QrScanner | null = null;

	onMount(() => {
		if (typeof window === 'undefined' || !videoEl) return;

		// Ensure worker is loaded from correct path when bundled (Vite)
		QrScanner.WORKER_PATH = workerUrl;

		status = 'starting';

		const handleDecode = (result: QrScanner.ScanResult) => {
			if (!qrScanner) return;
			qrScanner.stop();
			qrScanner.destroy();
			qrScanner = null;
			status = 'scanned';
			onResult(result.data, result);
		};

		const handleDecodeError = (_error: Error | string) => {
			// Ignore frequent decode failures while scanning; only report real errors if needed
		};

		const opts = {
			returnDetailedScanResult: true as const,
			preferredCamera,
			maxScansPerSecond,
			onDecodeError: handleDecodeError,
			highlightScanRegion: true
		};

		try {
			qrScanner = new QrScanner(
				videoEl,
				handleDecode,
				opts as {
					returnDetailedScanResult: true;
					preferredCamera?: string;
					maxScansPerSecond?: number;
					onDecodeError?: (error: Error | string) => void;
					highlightScanRegion?: boolean;
				}
			);

			qrScanner
				.start()
				.then(() => {
					if (qrScanner) status = 'scanning';
				})
				.catch((err: Error) => {
					status = 'error';
					errorMessage = err.message ?? 'Camera access failed';
					onError?.(err);
				});
		} catch (err) {
			status = 'error';
			errorMessage = err instanceof Error ? err.message : 'Failed to init scanner';
			onError?.(err instanceof Error ? err : new Error(String(err)));
		}
	});

	onDestroy(() => {
		if (qrScanner) {
			qrScanner.stop();
			qrScanner.destroy();
			qrScanner = null;
		}
	});
</script>

<div
	bind:this={ref}
	class={cn('relative overflow-hidden rounded-lg bg-black', className)}
	data-status={status}
>
	<video
		bind:this={videoEl}
		class="h-full w-full [transform:scaleX(-1)] object-cover"
		playsinline
		muted
		aria-label="QR code scanner camera"
	></video>

	{#if children}
		<div class="pointer-events-none absolute inset-0">{@render children()}</div>
	{/if}

	{#if status === 'starting'}
		<div
			class="absolute inset-0 flex items-center justify-center bg-black/60 text-sm text-white"
			aria-live="polite"
		>
			正在启动摄像头…
		</div>
	{:else if status === 'error'}
		<div
			class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 p-4 text-center text-sm text-white"
			aria-live="assertive"
		>
			<p>{errorMessage}</p>
		</div>
	{:else if status === 'scanned'}
		<div
			class="absolute inset-0 flex items-center justify-center bg-black/40 text-sm text-white"
			aria-live="polite"
		>
			已识别
		</div>
	{/if}
</div>
