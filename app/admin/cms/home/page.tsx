import BannerManager from './BannerManager';

export const metadata = {
  title: 'Home Page CMS | Admin panel',
};

export default function CmsHomePage() {
  return (
    <div className="space-y-6">
      <BannerManager />
    </div>
  );
}
