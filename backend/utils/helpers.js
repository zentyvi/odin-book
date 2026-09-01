export const isCloudinaryUrl = (url) => {
  const cloudinaryPattern =
    /https?:\/\/(?:res\.cloudinary\.com|([a-z0-9]+)\.cloudinary\.com)/i;
  return cloudinaryPattern.test(url);
};
