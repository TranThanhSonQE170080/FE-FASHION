import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FilterSidebarProps {
    categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: number[];
  onPriceRangeChange: (range: number[]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export default function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
}: FilterSidebarProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Danh Mục</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedCategory} onValueChange={onCategoryChange}>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="cursor-pointer">Tất cả</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="men" id="men" />
              <Label htmlFor="men" className="cursor-pointer">Thời trang Nam</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="women" id="women" />
              <Label htmlFor="women" className="cursor-pointer">Thời trang Nữ</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="accessories" id="accessories" />
              <Label htmlFor="accessories" className="cursor-pointer">Phụ kiện</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Price Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Khoảng Giá</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              min={0}
              max={2000000}
              step={100000}
              value={priceRange}
              onValueChange={onPriceRangeChange}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sort By */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sắp Xếp</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={sortBy} onValueChange={onSortChange}>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="newest" id="newest" />
              <Label htmlFor="newest" className="cursor-pointer">Mới nhất</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="price-asc" id="price-asc" />
              <Label htmlFor="price-asc" className="cursor-pointer">Giá thấp đến cao</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="price-desc" id="price-desc" />
              <Label htmlFor="price-desc" className="cursor-pointer">Giá cao đến thấp</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}