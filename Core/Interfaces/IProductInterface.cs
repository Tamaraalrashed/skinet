using System;
using Core.Entities;

namespace Core.Interfaces;

public interface  IProductInterface
{
Task<IReadOnlyList<Product>> GetProductsAsyc(string? brand, string? type,string? sort);
Task<Product?> GetProductByIdAsync(int id);
Task<IReadOnlyList<string>> GetProductBrandAsync();

Task<IReadOnlyList<string>> GetProductTypeAsync();
void AddProduct(Product product);
void UpdateProduct(Product product);
void DeleteProduct(Product product);
bool ProductExists (int id);
Task<bool> SaveChangesAsync();

}
