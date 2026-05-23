'use client';

import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrintButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => window.print()}
      className="w-full gap-2"
    >
      <Printer className="h-4 w-4" />
      Cetak / PDF
    </Button>
  );
}
