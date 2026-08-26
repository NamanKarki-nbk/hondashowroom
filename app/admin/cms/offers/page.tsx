import OfferManager from './OfferManager';

export const metadata = {
  title: 'Offers CMS | Admin panel',
};

export default function CmsOffersPage() {
  return (
    <div className="space-y-6">
      <OfferManager />
    </div>
  );
}
