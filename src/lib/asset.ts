/** Jalur aset yang selalu diawali BASE_URL, aman untuk deploy di sub-path. */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
