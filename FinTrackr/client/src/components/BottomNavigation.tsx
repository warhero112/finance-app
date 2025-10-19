import { Home, BarChart3, Bot, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

interface BottomNavigationProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
  onQuickAdd: () => void;
}

export default function BottomNavigation({ activeTab, onTabChange, onQuickAdd }: BottomNavigationProps) {
  const { t } = useTranslation();
  
  const tabs = [
    { id: 0, icon: Home, label: t('dashboard') },
    { id: 2, icon: BarChart3, label: t('insights') },
    { id: 3, icon: Bot, label: t('aiAdvisor') },
    { id: 4, icon: Settings, label: t('settings') },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="mx-auto max-w-md flex justify-center items-center py-2 gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            size="sm"
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 py-2 px-3 h-auto ${
              activeTab === tab.id ? "text-primary" : "text-muted-foreground"
            }`}
            data-testid={`button-tab-${tab.label.toLowerCase().replace(' ', '-')}`}
          >
            <tab.icon size={16} />
            <span className="text-xs">{tab.label}</span>
          </Button>
        ))}

        <Button
          onClick={onQuickAdd}
          size="icon"
          className="w-10 h-10 rounded-full shadow-lg ml-2"
          data-testid="button-quick-add"
        >
          <Plus size={20} />
        </Button>
      </div>
    </div>
  );
}