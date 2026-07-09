// Mirrors the website's mobile category strip (`links` in
// standard/src/common/utils/index.js, filtered to `display !== false`) so the
// native bar shows the same sections. Not auto-synced — update both sides by
// hand if the site's category list changes.
export type Category = {
  name: string;
  path: string;
  color: string;
};

export const CATEGORIES: Category[] = [
  { name: 'Naslovna', path: '/', color: '#E9AC00' },
  { name: 'Politika', path: '/politika', color: '#E3342F' },
  { name: 'Tehnologija', path: '/tehnologija', color: '#ED1932' },
  { name: 'Hronika', path: '/hronika', color: '#000000' },
  { name: 'Biznis', path: '/biznis', color: '#23A6A6' },
  { name: 'Društvo', path: '/drustvo', color: '#576DEC' },
  { name: 'Lifestyle', path: '/zivot', color: '#FF8A00' },
  { name: 'Svijet', path: '/svijet', color: '#66BAFF' },
  { name: 'Kultura', path: '/kultura', color: '#E9AC00' },
  { name: 'Gradovi', path: '/gradovi', color: '#000000' },
  { name: 'Sport', path: '/sport', color: '#35AF49' },
  { name: 'Video', path: '/video', color: '#E9AC00' },
];

// The site renders this one as a red "m:tel / tehnologija" promo pill instead
// of a normal category chip.
export const PROMO_CATEGORY_NAME = 'Tehnologija';
export const ACTIVE_CATEGORY_TEXT_COLOR = '#E9AC00';
