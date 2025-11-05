import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">{title}</h2>
      {children}
    </section>
  );
};

export default Section;
