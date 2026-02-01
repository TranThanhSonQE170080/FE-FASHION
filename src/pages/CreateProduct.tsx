import { useState } from "react";

interface CreateProductProps {
  onProductCreated?: () => void; // ✅ Thêm callback prop
}

export default function CreateProduct({ onProductCreated }: CreateProductProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "",
    size: "",
    color: "",
    stock: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8000/api/v1/entities/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const error = await res.json();
      alert(`Create product failed: ${error.detail || 'Unknown error'}`);
      return;
    }

    const result = await res.json();
    alert("Product created successfully!");
    
    // Reset form
    setForm({
      name: "",
      description: "",
      price: 0,
      image: "",
      category: "",
      size: "",
      color: "",
      stock: 0
    });

    // ✅ Gọi callback để parent refresh data
    if (onProductCreated) {
      onProductCreated();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Create New Product</h2>
      
      <input 
        placeholder="Product Name *" 
        value={form.name}
        onChange={e => setForm({...form, name: e.target.value})} 
        required
        className="w-full p-2 border rounded"
      />
      
      <textarea 
        placeholder="Description *" 
        value={form.description}
        onChange={e => setForm({...form, description: e.target.value})} 
        required
        className="w-full p-2 border rounded"
        rows={3}
      />
      
      <input 
        type="number" 
        placeholder="Price *" 
        value={form.price}
        onChange={e => setForm({...form, price: +e.target.value})} 
        required
        min="0"
        step="0.01"
        className="w-full p-2 border rounded"
      />
      
      <input 
        placeholder="Image URL" 
        value={form.image}
        onChange={e => setForm({...form, image: e.target.value})} 
        className="w-full p-2 border rounded"
      />
      
      <select
        value={form.category}
        onChange={e => setForm({...form, category: e.target.value})}
        className="w-full p-2 border rounded"
      >
        <option value="">Select Category</option>
        <option value="T-Shirts">T-Shirts</option>
        <option value="Jeans">Jeans</option>
        <option value="Jackets">Jackets</option>
        <option value="Dresses">Dresses</option>
        <option value="Hoodies">Hoodies</option>
        <option value="Sweaters">Sweaters</option>
        <option value="Pants">Pants</option>
      </select>
      
      <input 
        placeholder="Size (S, M, L, XL)" 
        value={form.size}
        onChange={e => setForm({...form, size: e.target.value})} 
        className="w-full p-2 border rounded"
      />
      
      <input 
        placeholder="Color" 
        value={form.color}
        onChange={e => setForm({...form, color: e.target.value})} 
        className="w-full p-2 border rounded"
      />
      
      <input 
        type="number" 
        placeholder="Stock quantity" 
        value={form.stock}
        onChange={e => setForm({...form, stock: +e.target.value})} 
        min="0"
        className="w-full p-2 border rounded"
      />

      <button 
        type="submit"
        className="w-full bg-[#FF6B6B] hover:bg-[#FF5252] text-white py-3 rounded-lg font-semibold transition-colors"
      >
        Create Product
      </button>
    </form>
  );
}