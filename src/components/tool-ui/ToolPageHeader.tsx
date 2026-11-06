import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PrivacyNotice } from './PrivacyNotice';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { PrivacyMode } from '@/types/tools';

interface ToolPageHeaderProps {
  toolId: string;
  title: string;
  description: string;
  category: string;
  privacyMode: PrivacyMode;
}

export const ToolPageHeader: React.FC<ToolPageHeaderProps> = ({
  toolId,
  title,
  description,
  category,
  privacyMode,
}) => {
  const { isFavorite, toggleFavorite } = useWorkspaceStore();
  const favorited = isFavorite(toolId);

  return (
    <div className="flex flex-col gap-3 pb-5 border-b border-border mb-6">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
        <Link to={`/tools?category=${encodeURIComponent(category)}`} className="hover:text-foreground transition-colors">
          {category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
        <span className="text-foreground">{title}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleFavorite(toolId)}
              className="h-8 w-8 text-muted-foreground hover:text-warning"
              title={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star
                className={`w-4 h-4 transition-colors ${
                  favorited ? 'fill-warning text-warning' : ''
                }`}
              />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>
        </div>

        <div>
          <PrivacyNotice mode={privacyMode} />
        </div>
      </div>
    </div>
  );
};

