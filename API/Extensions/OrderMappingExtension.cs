using API.DTOs;
using Core.Entities;
using Core.Entities.OrderAggregate;

namespace API.Extensions;

public static class OrderMappingExtension
{
    public static OrderDto ToDto(this Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            BuyerEmail = order.BuyerEmail,
            OrderDate = order.OrderDate,
            ShippingAddress = order.ShippingAddress,
            DeliveryMethod = order.DeliveryMethod.Description,
            PaymentSummary = order.PaymentSummary,
            ShippingPrice = order.DeliveryMethod.Price,
            SubTotal = order.SubTotal,
            Total = order.SubTotal+order.DeliveryMethod.Price,
            Status = order.Status.ToString(),
            PaymentTIntentId = order.PaymentTIntentId,
            OrderItems = order.OrderItems.Select(x=>x.ToDto()).ToList()
        };
    }

    private static OrderItemDto ToDto(this OrderItem orderItem)
    {
        return new OrderItemDto
        {
            ProductId = orderItem.ItemOrdered.ProductId,
            ProductName = orderItem.ItemOrdered.ProductName,
            PictureUrl = orderItem.ItemOrdered.PictureUrl,
            Price = orderItem.Price,
            Quantity = orderItem.Quantity,
        };
    }
    
}