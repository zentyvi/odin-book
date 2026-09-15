const api_version = import.meta?.env?.VITE_API_VERSION || "v1";
const port = import.meta?.env?.VITE_PORT || 3000;

const dev_server = `http://localhost:${port}`;
const production_server = import.meta?.env?.VITE_SERVER_URL;
const isDev = Boolean(import.meta?.env?.VITE_DEV || 0);

const api_url = isDev
  ? `${dev_server}/api/${api_version}`
  : `${production_server}/api/${api_version}`;

const server_url = isDev ? dev_server : production_server;

export { api_url, server_url };
