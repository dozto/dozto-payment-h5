import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function connect(socketUrl: string, orgId: string): Socket | null {
	if (typeof window === 'undefined') return null;
	if (socket?.connected) return socket;
	const url = socketUrl;
	socket = io(url, {
		auth: { orgId }
	});
	return socket;
}

export function disconnect(): void {
	if (socket) {
		socket.disconnect();
		socket = null;
	}
}

export function on(event: string, handler: (...args: unknown[]) => void): () => void {
	socket?.on(event, handler);
	return () => {
		socket?.off(event, handler);
	};
}

export function off(event: string, handler?: (...args: unknown[]) => void): void {
	socket?.off(event, handler);
}

export function getSocket(): Socket | null {
	return socket;
}
