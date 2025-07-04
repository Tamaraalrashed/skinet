using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;
using Product = Core.Entities.Product;

namespace Infrastructure.Services;

public class PaymentService(
    IConfiguration configuration, ICartService cartService,
    IUnitOfWork unit)
    :IPaymentService
{
    public async Task<ShoppingCart?> CreateOrUpdatePaymentIntent(string cartId)
    {
       StripeConfiguration.ApiKey = configuration["StripeSettings:SecretKey"];
       var cart = await cartService.GetCartAsync(cartId);
       if(cart == null) return null;
       decimal shippingPrice = 0m;
       if (cart.DeliveryMethodId.HasValue)
       {
           var deliveryMethod = await unit.Repository<DeliveryMethod>().GetByIdAsync((int)cart.DeliveryMethodId);
           if (deliveryMethod == null) return null;
           shippingPrice = deliveryMethod.Price;
       }

       foreach (var item in cart.Items)
           {
               var productItem = await unit.Repository<Product>().GetByIdAsync(item.ProductId);
               if(productItem == null) return null;
               if (productItem.Price != item.Price)
               {
                   item.Price = productItem.Price;
               }
           }

           var service = new PaymentIntentService();
           PaymentIntent? intent = null;
           if (string.IsNullOrEmpty(cart.PaymentIntentId))
           {
               var options = new PaymentIntentCreateOptions()
               {
                Amount = (long)cart.Items.Sum(x=>x.Quantity*x.Price*100)+
                (long) shippingPrice*100,
                Currency = "usd",
                PaymentMethodTypes = ["card"]
               };
               intent = await service.CreateAsync(options);
               cart.PaymentIntentId = intent.Id;
               cart.ClientSecret=intent.ClientSecret;

           }
           else
           {
               var options = new PaymentIntentUpdateOptions()
               {
                   Amount = (long)cart.Items.Sum(x=>x.Quantity*x.Price*100)+
                            (long) shippingPrice*100,
               
               };
           
           intent = await service.UpdateAsync(cart.PaymentIntentId,options);
           }
       
       
       await cartService.SetCartAsync(cart);
       return cart;
       }
}