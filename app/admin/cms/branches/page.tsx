import BranchManager from './BranchManager';

export const metadata = {
  title: 'Branches CMS | Admin panel',
};

export default function CmsBranchesPage() {
  return (
    <div className="space-y-6">
      <BranchManager />
    </div>
  );
}
