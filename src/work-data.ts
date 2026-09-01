import workMetadata from './works.json';

export type GalleryAsset = {
  name: string;
  src: string;
};

export type WorkCategory = '3D' | 'Design' | 'Web';

export type WorkRecord = GalleryAsset & {
  category: WorkCategory;
  status: 'completed' | 'in-progress';
  date: string;
  summary: string;
  tools: string[];
};

const galleryModules = import.meta.glob(
  '/gallary/**/*.{png,jpg,jpeg,webp,gif,avif}',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

const preferredOrder = ['result', 'thumb', 'gyogan', 'rokou', 'ポーズ', 'pose'];

const rawGalleryAssets: GalleryAsset[] = Object.entries(galleryModules)
  .map(([path, src]) => ({
    name: path.split('/').pop()?.replace(/\.[^.]+$/, '') ?? 'work',
    src,
  }))
  .filter((asset) => !asset.name.toLowerCase().includes('support_me_on_kofi'));

const galleryAssets = rawGalleryAssets
  .filter((asset, _, collection) => !collection.some((other) => other !== asset && other.name === asset.name))
  .sort((a, b) => {
    const aIndex = preferredOrder.findIndex((key) => a.name.toLowerCase().includes(key.toLowerCase()));
    const bIndex = preferredOrder.findIndex((key) => b.name.toLowerCase().includes(key.toLowerCase()));
    if (aIndex !== -1 || bIndex !== -1) return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
    return a.name.localeCompare(b.name, 'ja');
  });

const fallbackGallery: GalleryAsset[] = [
  { name: 'result', src: '/gallary/result.png' },
  { name: 'thumb', src: '/gallary/thumb.png' },
  { name: 'gyogan with HUD3', src: '/gallary/gyogan_with_HUD3.png' },
  { name: 'rokou', src: '/gallary/rokou.png' },
  { name: 'ポーズ１改善', src: '/gallary/ポーズ１改善.png' },
];

export const assets = galleryAssets.length ? galleryAssets : fallbackGallery;

type WorkMetadata = Omit<WorkRecord, keyof GalleryAsset> & { asset: string };

const metadataByAsset = new Map((workMetadata as WorkMetadata[]).map((work) => [work.asset, work]));

export const workRecords: WorkRecord[] = assets.map((asset) => {
  const metadata = metadataByAsset.get(asset.name) ?? {
    asset: asset.name,
    category: '3D' as WorkCategory,
    status: 'completed' as const,
    date: '2026-01',
    summary: '制作記録を準備中。',
    tools: ['Blender'],
  };
  return {
    ...asset,
    category: metadata.category,
    status: metadata.status,
    date: metadata.date,
    summary: metadata.summary,
    tools: metadata.tools,
  };
});
