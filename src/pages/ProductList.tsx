import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string | null;
  category: string | null;
  size: string | null;
  color: string | null;
  stock: number | null;
  created_at: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/v1/entities/products?limit=100");
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setProducts(data.items || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/v1/entities/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      alert("Product deleted successfully");
      // Refresh danh sách
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Loading products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        <h2>❌ {error}</h2>
        <button onClick={fetchProducts}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>🛍️ Products ({products.length})</h1>
        <button 
          onClick={fetchProducts}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          🔄 Refresh
        </button>
      </div>

      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h2>No products found</h2>
          <p>Create your first product to get started!</p>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
          gap: "20px" 
        }}>
          {products.map(product => (
            <div 
              key={product.id} 
              style={{ 
                border: "1px solid #ddd", 
                borderRadius: "8px",
                padding: "20px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
            >
              {product.image && (
                <img 
                  src={product.image} 
                  alt={product.name}
                  style={{ 
                    width: "100%", 
                    height: "200px", 
                    objectFit: "cover",
                    borderRadius: "4px",
                    marginBottom: "15px"
                  }}
                  onError={(e) => {
                    // Fallback nếu ảnh lỗi
                    e.currentTarget.src = "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />
              )}
              
              <h3 style={{ margin: "10px 0" }}>{product.name}</h3>
              <p style={{ color: "#666", fontSize: "14px" }}>{product.description}</p>
              
              <div style={{ marginTop: "15px" }}>
                <p style={{ fontSize: "24px", fontWeight: "bold", color: "#2c3e50" }}>
                  ${product.price.toFixed(2)}
                </p>
                
                {product.category && (
                  <p style={{ fontSize: "12px", color: "#7f8c8d" }}>
                    📁 Category: {product.category}
                  </p>
                )}
                
                {product.size && (
                  <p style={{ fontSize: "12px", color: "#7f8c8d" }}>
                    📏 Size: {product.size}
                  </p>
                )}
                
                {product.color && (
                  <p style={{ fontSize: "12px", color: "#7f8c8d" }}>
                    🎨 Color: {product.color}
                  </p>
                )}
                
                {product.stock !== null && (
                  <p style={{ 
                    fontSize: "12px", 
                    color: product.stock > 0 ? "#27ae60" : "#e74c3c",
                    fontWeight: "bold"
                  }}>
                    📦 Stock: {product.stock}
                  </p>
                )}
              </div>

              <div style={{ 
                marginTop: "15px", 
                display: "flex", 
                gap: "10px" 
              }}>
                <button 
                  onClick={() => alert(`Edit product ID: ${product.id}`)}
                  style={{ 
                    flex: 1,
                    padding: "8px",
                    backgroundColor: "#3498db",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={() => deleteProduct(product.id)}
                  style={{ 
                    flex: 1,
                    padding: "8px",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}