export async function loadGoogleFont(font: string): Promise<ArrayBuffer | null> {
  if (!font) return null;

  try {
    const url = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@700&display=swap`;
    const css = await fetch(url).then((res) => res.text());

    // Find the font URL in the CSS (capture content inside url(...))
    const resource = css.match(/src: url\(([^)]+)\)/);

    if (resource && resource[1]) {
      const fontUrl = resource[1];
      const res = await fetch(fontUrl);
      return await res.arrayBuffer();
    }
  } catch (e) {
    console.error(`Failed to load font ${font}:`, e);
  }
  return null;
}
