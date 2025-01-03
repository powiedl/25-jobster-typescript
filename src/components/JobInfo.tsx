import React from 'react';
export default function JobInfo({
  icon,
  text,
  color = 'black',
}: {
  icon: React.ReactNode;
  text: string;
  color?: string;
}) {
  return (
    <div className={`flex gap-x-2 items-center capitalize text-${color}`}>
      {icon}
      {text}
    </div>
  );
}
