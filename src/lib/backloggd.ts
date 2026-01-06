export interface AutocompleteResult {
  value: string;
  data: { id: number; slug: string; title: string; year: string };
}

const IMAGE_REGEX = /<img class="lazy card-img height" src="(.*)" alt/;

export const autocomplete = async (
  search: string
): Promise<AutocompleteResult[]> => {
  const url = new URL('https://backloggd.com/autocomplete.json');
  url.searchParams.append('filter_editions', 'true');
  url.searchParams.append('query', search);
  const res = await fetch(url);
  return (await res.json()).suggestions;
};

export const fetchImageUrl = async (slug: string): Promise<string> => {
  const url = new URL(`https://backloggd.com/games/${slug}`);
  const res = await fetch(url);
  const body = await res.text();
  const r = body.match(IMAGE_REGEX);
  return r[1];
};
