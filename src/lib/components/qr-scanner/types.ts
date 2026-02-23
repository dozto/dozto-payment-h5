/** Detailed result from qr-scanner (returnDetailedScanResult: true) */
export interface ScanResult {
	data: string;
	cornerPoints?: Array<{ x: number; y: number }>;
}

/** Camera preference: facing mode or device id from listCameras */
export type PreferredCamera = 'environment' | 'user' | string;

/** Internal status for UI and lifecycle */
export type QrScannerStatus = 'idle' | 'starting' | 'scanning' | 'scanned' | 'error';

/** Props for the QrScanner root component */
export interface QrScannerProps {
	/** Called once when a QR code is successfully decoded. Scanner stops automatically. */
	onResult: (data: string, detail?: ScanResult) => void;
	/** Optional: called on decode or camera errors */
	onError?: (error: Error) => void;
	/** Preferred camera: 'environment' (back) or 'user' (front), or device id */
	preferredCamera?: PreferredCamera;
	/** Max scans per second (throttle). Default 25. */
	maxScansPerSecond?: number;
	/** Root element class name */
	class?: string;
	/** Bind to root element (Svelte 5 bindable ref) */
	ref?: HTMLDivElement | null;
}
