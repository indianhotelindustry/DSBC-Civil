import React from 'react';
import { TableCell, TableRow } from './ui/table';

interface SkeletonRowProps {
  columns: number;
}

export const SkeletonRow: React.FC<SkeletonRowProps> = ({ columns }) => {
  return (
    <TableRow className="animate-pulse border-b border-[#e5e7eb]">
      {Array.from({ length: columns }).map((_, i) => (
        <TableCell key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-100 rounded w-full" />
        </TableCell>
      ))}
    </TableRow>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white p-5 rounded-lg border border-[#e5e7eb] shadow-sm animate-pulse">
      <div className="h-3 w-24 bg-gray-100 rounded mb-3" />
      <div className="h-6 w-16 bg-gray-100 rounded" />
    </div>
  );
};
