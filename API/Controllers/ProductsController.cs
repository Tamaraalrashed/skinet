using System;
using API.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;


public class ProductsController(IUnitOfWork unit) : BaseApiController
{

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetProducts([FromQuery] ProductSpecParams specParams)
    {
        var spec=new ProductSpecification(specParams);
       
        return await CreatePageResult(unit.Repository<Product>(),spec,specParams.PageIndex,specParams.PageSize);
    }
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await unit.Repository<Product>().GetByIdAsync(id);
        if (product == null)
            return NotFound();
        return product;
    }
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        unit.Repository<Product>().Add(product);
       if(await unit.Complete())
       {
        return CreatedAtAction("GetProduct", new {id=product.Id, product});
       }
       return BadRequest();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Product>> UpdateProduct(int id, Product product)
    {
        if (product.Id != id || !unit.Repository<Product>().Exists(id))
            return BadRequest("cannot update this product");
        unit.Repository<Product>().Update (product);
      if( await unit.Complete())
        return NoContent();
        return BadRequest("Problem in update product");
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<Product>> DeleteProduct(int id)
    {
        var product = await unit.Repository<Product>().GetByIdAsync(id);
        if (product == null)
            return NotFound();
        unit.Repository<Product>().Delete(product);
        if( await unit.Complete())
            return NoContent();
        return BadRequest("Problem in delete product");
    }

    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetProductsBrands()
    {
        var spec= new BrandListSpecification();
        return Ok( await unit.Repository<Product>().ListAsync(spec));
    }

        [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetProductsTypes()
    {
        var spec = new TypeListSpecification();
        return Ok(await unit.Repository<Product>().ListAsync(spec) );
    }
   
}
