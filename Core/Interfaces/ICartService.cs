using Core.Entities;

namespace Core.Interfaces;

public interface ICartService
{
    Task <ShoppingCart?> GetCartAsync(string key);
    Task<ShoppingCart?> SetCartAsync(ShoppingCart cartItem);
    Task<bool> DeleteCartAsync(string key);
}