function baseUrl(extension: string): string {
  return `${import.meta.env.BASE_URL}${extension}`;
}

export { baseUrl };
