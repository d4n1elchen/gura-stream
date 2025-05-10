export const config = {
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
  socketIoUrl: import.meta.env.VITE_SOCKET_IO_URL || 'http://localhost:3000',
}
