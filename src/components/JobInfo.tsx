import React from 'react';
export default function JobInfo({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className='flex gap-x-2 items-center capitalize'>
      {icon}
      {text}
    </div>
  );
}
