import React from 'react';

type CardAreaProps = {
  children?: React.ReactNode;
};

export function CardArea({ children }: CardAreaProps) {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 md:space-x-4">
      {children}
    </div>
  );
}
