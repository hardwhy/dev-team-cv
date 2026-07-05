import { generateStoragePath } from '@dev-team-cv/shared-utils';
import type { ContactLink } from '@dev-team-cv/shared-types';

/** Uploads pending icon files and returns links with resolved iconUrl values. */
export async function resolveContactLinkIcons(
  links: ContactLink[],
  iconFiles: (File | null)[],
  upload: (path: string, file: File) => Promise<string>,
  pathPrefix = 'icons'
): Promise<ContactLink[]> {
  return Promise.all(
    links.map(async (link, index) => {
      const file = iconFiles[index];
      if (!file) return link;

      const slug = link.slug.trim() || `link-${index}`;
      const path = generateStoragePath(`${pathPrefix}/${slug}`, file.name);
      const iconUrl = await upload(path, file);
      return { ...link, iconUrl };
    })
  );
}
