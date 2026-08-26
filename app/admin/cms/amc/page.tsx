import React from 'react';
import AmcManager from './AmcManager';

export const metadata = {
  title: 'AMC Management | Honda Admin',
};

export default function AmcPage() {
  return (
    <div className="w-full">
      <AmcManager />
    </div>
  );
}
