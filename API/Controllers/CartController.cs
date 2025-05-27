using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class CartController(ICartService cartService):BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ShoppingCart>> GetCartById(string id)
    {
        var cart =await cartService.GetCartAsync(id);
        return Ok(cart??new ShoppingCart(){Id=id});
    }

    [HttpPost]
    public async Task<ActionResult<ShoppingCart>> UpdateCart(ShoppingCart cart)
    {
        var updateCart=await cartService.SetCartAsync(cart);
       if(updateCart==null) return BadRequest();
        return Ok(updateCart);
    }

    [HttpDelete]
    public async Task<ActionResult<ShoppingCart>> DeleteCart(string id)
    {
        var result=await cartService.DeleteCartAsync(id);
        if(!result) return BadRequest("Problem in deleting Cart");
        return Ok();
    }
}