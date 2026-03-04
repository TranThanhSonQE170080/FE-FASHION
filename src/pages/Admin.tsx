import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Plus, Pencil, Trash2, RotateCw } from 'lucide-react';

// ✅ Gắn cứng Link API gốc để không bao giờ bị kẹt mạng nữa
const API_URL = 'http://127.0.0.1:8000';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  size: string;
  color: string;
  stock: number;
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  size: string;
  color: string;
  stock: string;
}

export default function Admin() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'men',
    size: 'M',
    color: '',
    stock: '0',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Gọi thẳng đường link gốc
      const res = await fetch(`${API_URL}/api/v1/entities/products?limit=100`);
      
      if (!res.ok) throw new Error('Không thể tải danh sách sản phẩm');
      
      const data = await res.json();
      setProducts(data.items || []);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Lỗi kết nối đến server',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        image: product.image || '',
        category: product.category || 'men',
        size: product.size || 'M',
        color: product.color || '',
        stock: product.stock.toString(),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        category: 'men',
        size: 'M',
        color: '',
        stock: '0',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Tự động làm sạch số tiền (ví dụ nhập 161.850 sẽ chuyển thành 161850)
      const cleanPrice = formData.price.toString().replace(/[.,]/g, '');
      const parsedPrice = parseFloat(cleanPrice);
      
      const cleanStock = formData.stock.toString().replace(/[.,]/g, '');
      const parsedStock = parseInt(cleanStock) || 0;

      if (isNaN(parsedPrice)) {
        throw new Error("Giá sản phẩm không hợp lệ (vui lòng chỉ nhập số).");
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parsedPrice, 
        image: formData.image || 'https://mgx-backend-cdn.metadl.com/generate/images/656699/2026-01-25/4b7dd3e9-1ac1-4cdb-b52b-d076dcd0e93a.png',
        category: formData.category,
        size: formData.size,
        color: formData.color,
        stock: parsedStock,
      };

      const url = editingProduct
        ? `${API_URL}/api/v1/entities/products/${editingProduct.id}`
        : `${API_URL}/api/v1/entities/products`;

      const res = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        let errorMessage = editingProduct ? 'Cập nhật thất bại' : 'Tạo mới thất bại';
        
        if (err.detail) {
          if (Array.isArray(err.detail)) {
            errorMessage = `Sai dữ liệu tại: ${err.detail[0].loc.slice(-1)} (${err.detail[0].msg})`;
          } else if (typeof err.detail === 'string') {
            errorMessage = err.detail;
          }
        }
        throw new Error(errorMessage);
      }

      toast({
        title: 'Thành công',
        description: editingProduct ? 'Cập nhật sản phẩm thành công' : 'Tạo sản phẩm mới thành công',
      });

      setIsDialogOpen(false);
      await fetchProducts(); 
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể lưu sản phẩm',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false); // Chắc chắn sẽ tắt vòng xoay
    }
  };

  const handleDelete = async () => {
    if (!deletingProductId) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/v1/entities/products/${deletingProductId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Xóa thất bại');
      }

      toast({
        title: 'Thành công',
        description: 'Xóa sản phẩm thành công',
      });
      setIsDeleteDialogOpen(false);
      setDeletingProductId(null);
      await fetchProducts(); 
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể xóa sản phẩm',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false); 
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Quản Lý Sản Phẩm</h1>
          <div className="flex gap-3">
            <Button
              onClick={fetchProducts}
              variant="outline"
              className="hover:bg-gray-100"
              disabled={loading}
            >
              <RotateCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-black text-white hover:bg-gray-800"
            >
              <Plus className="w-5 h-5 mr-2" />
              Thêm Sản Phẩm
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hình ảnh</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Tồn kho</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.image || 'https://via.placeholder.com/150'}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      {product.category === 'men'
                        ? 'Nam'
                        : product.category === 'women'
                        ? 'Nữ'
                        : 'Phụ kiện'}
                    </TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenDialog(product)}
                          disabled={isSubmitting}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setDeletingProductId(product.id);
                            setIsDeleteDialogOpen(true);
                          }}
                          disabled={isSubmitting}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
            </DialogTitle>
            <DialogDescription>Điền thông tin sản phẩm vào form bên dưới</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Tên sản phẩm *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <Label htmlFor="description">Mô tả *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Giá (VNĐ) *</Label>
                <Input
                  id="price"
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="VD: 161.850"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="stock">Tồn kho</Label>
                <Input
                  id="stock"
                  type="text"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="VD: 88"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="image">URL Hình ảnh</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://link-hinh-anh.jpg"
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Danh mục</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger disabled={isSubmitting}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men">Nam</SelectItem>
                    <SelectItem value="women">Nữ</SelectItem>
                    <SelectItem value="accessories">Phụ kiện</SelectItem>
                    <SelectItem value="T-Shirts">T-Shirts (Áo thun)</SelectItem>
                    <SelectItem value="Jeans">Jeans (Quần bò)</SelectItem>
                    <SelectItem value="Jackets">Jackets (Áo khoác)</SelectItem>
                    <SelectItem value="Dresses">Dresses (Váy)</SelectItem>
                    <SelectItem value="Hoodies">Hoodies (Áo nỉ có mũ)</SelectItem>
                    <SelectItem value="Sweaters">Sweaters (Áo len)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="color">Màu sắc</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-black text-white hover:bg-gray-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingProduct ? 'Đang cập nhật...' : 'Đang tạo mới...'}
                  </>
                ) : editingProduct ? (
                  'Cập nhật'
                ) : (
                  'Tạo mới'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                'Xóa'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}