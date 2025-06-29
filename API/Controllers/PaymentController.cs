using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace API.Controllers;

public class PaymentsController(IPaymentService paymentService,IUnitOfWork unit):BaseApiController
{
    [Authorize]
    [HttpPost("{cartId}")]
    public async Task<ActionResult<ShoppingCart>> CreateOrUpdatePaymentIntent(string cartId)
    {
     var cart=await paymentService.CreateOrUpdatePaymentIntent(cartId);   
     if(cart == null)
         return BadRequest("Problem with your cart");
     return Ok(cart);
    }

    [HttpGet("delivery-method")]
    public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
    {
        return Ok(await unit.Repository<DeliveryMethod>().GetAllAsync());
    }
    
}