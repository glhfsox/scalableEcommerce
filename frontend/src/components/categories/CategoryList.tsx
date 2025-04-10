import React from 'react';
import { Category } from '../../types';
import Button from '../ui/Button';

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="space-y-2">
      <Button
        variant={selectedCategory === null ? 'primary' : 'secondary'}
        size="sm"
        className="w-full"
        onClick={() => onSelectCategory(null)}
      >
        All Categories
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? 'primary' : 'secondary'}
          size="sm"
          className="w-full"
          onClick={() => onSelectCategory(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default CategoryList; 