using API.DTOs;
using API.Extensions;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
[Authorize]
public class OrdersController(ICartService cartService,IUnitOfWork unit):BaseApiController
{
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder( CreateOrderDto orderDto)
    {
        var email = User.GetEmail();
        var cart=await cartService.GetCartAsync(orderDto.CartId);
        if(cart == null) return BadRequest("Cart not found");
        if(cart.PaymentIntentId==null) return BadRequest("No Cart payment intent");
        var items = new List<OrderItem>();
        foreach (var item in cart.Items)
        {
            var productItem= await unit.Repository<Product>().GetByIdAsync(item.ProductId);
            if(productItem == null) return BadRequest("Product not found");
            ProductItemOrdered itemOrdered = new ProductItemOrdered
            {
                ProductId = item.ProductId,
                ProductName = item.ProductName, 
                PictureUrl = item.PictureUrl,
            };
            OrderItem orderItem = new OrderItem
            {
                ItemOrdered = itemOrdered,
                Price = item.Price,
                Quantity = item.Quantity,
            };
            items.Add(orderItem);
        }
        var deliveryMethod = await unit.Repository<DeliveryMethod>().GetByIdAsync(orderDto.DeliveryMethodId);
        if (deliveryMethod == null) return BadRequest("Delivery Method not found");
        var order = new Order
        {
            OrderItems = items,
            DeliveryMethod = deliveryMethod,
            ShippingAddress = orderDto.ShippingAddress,
            SubTotal = items.Sum(x => x.Price * x.Quantity),
            PaymentSummary = orderDto.PaymentSummary,
            PaymentTIntentId = cart?.PaymentIntentId,
            BuyerEmail = email,

        };
        unit.Repository<Order>().Add(order);
        if (await unit.Complete())
        {
            return Ok(order);
        }
        return BadRequest("Unable to create order");
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<OrderDto>>> GetOrdersForUser(string? includes=null,string? orderBy=null)
    {
        includes ??= "OrderItems,DeliveryMethod";
        var include = includes.Split(",").ToList();
        orderBy??= "OrderDate Desc";
        var spec =new OrderSpecification(User.GetEmail(),
            include,orderBy);
       
        var orders=await  unit.Repository<Order>().ListAsync(spec);
        var ordersDto=orders.Select(o=>o.ToDto()).ToList();
        return Ok(ordersDto);
    }
      
    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> GetOrderById(int id,string? includes=null)
    {
        includes ??= "OrderItems,DeliveryMethod";
        var include = includes.Split(",").ToList();
      
        var spec =new OrderSpecification(User.GetEmail(),id,
          include);

        var order=await  unit.Repository<Order>().GetEntityWithSpec(spec);
        if(order == null) return NotFound();
        

        return Ok(order.ToDto());
    }
    
    
}