import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORY_DEFINITIONS, type CategoryDefinition, type SubCategory } from '@/lib/categories';

interface Props {
  selectedCategoryId?: string;
  selectedSubCategoryId?: string;
  onSelect: (category: CategoryDefinition, subCategory?: SubCategory) => void;
  type?: 'income' | 'expense';
  recentlyUsedIds?: string[]; // Array of category IDs
}

const CategoryGrid: React.FC<Props> = ({ 
  selectedCategoryId, 
  selectedSubCategoryId, 
  onSelect, 
  type = 'expense',
  recentlyUsedIds = []
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(selectedCategoryId || null);

  const filteredCategories = CATEGORY_DEFINITIONS.filter(c => c.type === type);
  
  // Sort by recently used if provided
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    const aIndex = recentlyUsedIds.indexOf(a.id);
    const bIndex = recentlyUsedIds.indexOf(b.id);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {sortedCategories.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          const isExpanded = expandedId === category.id;

          return (
            <div key={category.id} className="flex flex-col">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (isExpanded) {
                    setExpandedId(null);
                  } else {
                    setExpandedId(category.id);
                  }
                }}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-2 rounded-[24px] border p-4 transition-all duration-300",
                  isSelected 
                    ? "border-primary bg-primary/10 shadow-lg" 
                    : "border-border bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-md"
                )}
                style={{
                  borderColor: isSelected ? category.color : undefined,
                  boxShadow: isSelected ? `0 0 15px ${category.color}33` : undefined
                }}
              >
                <span className="text-3xl">{category.icon}</span>
                <span className="text-xs font-bold tracking-tight text-foreground/80">{category.name}</span>
                
                {isSelected && !selectedSubCategoryId && (
                  <motion.div 
                    layoutId="check"
                    className="absolute top-2 right-2 text-primary"
                  >
                    <Check size={14} style={{ color: category.color }} />
                  </motion.div>
                )}
                
                <div className="absolute bottom-2 right-2 opacity-50">
                  <ChevronRight size={12} className={cn("transition-transform duration-300", isExpanded && "rotate-90")} />
                </div>
              </motion.button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 flex flex-col gap-1 px-1">
                      {category.subCategories.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => onSelect(category, sub)}
                          className={cn(
                            "flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors",
                            selectedSubCategoryId === sub.id
                              ? "bg-primary/20 text-foreground"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          )}
                        >
                          {sub.name}
                          {selectedSubCategoryId === sub.id && <Check size={12} />}
                        </button>
                      ))}
                      {/* One-click selection for the category itself if no subcategory needed */}
                      <button
                        type="button"
                        onClick={() => onSelect(category)}
                        className={cn(
                          "mt-1 flex items-center justify-between rounded-xl border border-dashed border-border px-3 py-2 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        Général
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryGrid;
