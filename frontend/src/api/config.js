const api_version = import.meta.env.API_VERSION || "v1";
const port = import.meta.env.PORT || 3000;

const production = import.meta.env.VITE_API_URL;

const api_url = import.meta.env.DEV
  ? `http://localhost:${port}/api/${api_version}`
  : `${production}/api/${api_version}`;

export { api_url };
