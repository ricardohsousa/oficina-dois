import type { ReactNode } from 'react';

interface TimelineItem {
  id: string;
  label: string;
  title: string;
  description?: string;
  status?: 'completed' | 'current' | 'pending';
  icon?: React.ComponentType<{ className?: string }>;
}

interface TimelineProps {
  items: TimelineItem[];
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

export function Timeline({ items, direction = 'vertical', className = '' }: TimelineProps) {
  if (direction === 'horizontal') {
    return (
      <div className={`flex items-center gap-2 overflow-x-auto pb-2 ${className}`}>
        {items.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2 flex-shrink-0">
            <div className="flex flex-col items-center">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                  item.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : item.status === 'current'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-800'
                }`}
              >
                {item.icon ? <item.icon className="h-5 w-5" /> : index + 1}
              </div>
              <p className="text-xs font-medium text-slate-700 mt-2 text-center whitespace-nowrap">{item.label}</p>
            </div>
            {index < items.length - 1 && (
              <div className="h-1 w-8 bg-slate-200 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Vertical
  return (
    <div className={`space-y-6 ${className}`}>
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                item.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : item.status === 'current'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-slate-100 text-slate-800'
              }`}
            >
              {item.icon ? <item.icon className="h-5 w-5" /> : index + 1}
            </div>
            {index < items.length - 1 && (
              <div className="h-12 w-1 bg-slate-200 mt-2" />
            )}
          </div>
          <div className="pt-2 pb-6">
            <p className="font-semibold text-slate-900">{item.title}</p>
            {item.label && (
              <p className="text-xs text-slate-600 mt-1">{item.label}</p>
            )}
            {item.description && (
              <p className="text-sm text-slate-600 mt-2">{item.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
