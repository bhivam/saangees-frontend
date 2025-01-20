function baseUrl(extension: string): string {
  return `${import.meta.env["VITE_BASE_URL"]}${extension}`;
}

export { baseUrl };
