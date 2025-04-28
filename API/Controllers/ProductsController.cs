using System;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(IProductInterface repo) : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetProducts(string? brand, string? type, string? sort)
    {
        return Ok( await repo.GetProductsAsyc(brand,type,sort));
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await repo.GetProductByIdAsync(id);
        if (product == null)
            return NotFound();
        return product;
    }
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
       repo.AddProduct(product);
       if(await repo.SaveChangesAsync())
       {
        return CreatedAtAction("GetProduct", new {id=product.Id, product});
       }
        return BadRequest();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Product>> UpdateProduct(int id, Product product)
    {
        if (product.Id != id || !ProductExists(id))
            return BadRequest("cannot updatethis product");
        repo.UpdateProduct (product);
      if( await repo.SaveChangesAsync())
        return NoContent();
        return BadRequest("Problem in update product");
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Product>> DeleteProduct(int id)
    {
        var product = await repo.GetProductByIdAsync(id);
        if (product == null)
            return NotFound();
            repo.DeleteProduct(product);
      if( await repo.SaveChangesAsync())
        return NoContent();
        return BadRequest("Problem in delete product");
    }

    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetProductsBrands()
    {
        return Ok( await repo.GetProductBrandAsync());
    }

        [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetProductsTypes()
    {
        return Ok( await repo.GetProductTypeAsync());
    }
    private bool ProductExists(int id)
    {
        return repo.ProductExists(id);
    }
}
