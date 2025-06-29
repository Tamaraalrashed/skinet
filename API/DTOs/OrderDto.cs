using System.ComponentModel.DataAnnotations;
using Core.Entities;
using Core.Entities.OrderAggregate;

namespace API.DTOs;

public class OrderDto
{
    public int Id { get; set; }
    public DateTime OrderDate { get; set; }
    public required string  BuyerEmail { get; set; }
    public required ShippingAddress ShippingAddress { get; set; }
    public required string DeliveryMethod { get; set; } 
    public required decimal ShippingPrice { get; set; } 
    public required PaymentSummary PaymentSummary { get; set; } = null;
    public decimal SubTotal { get; set; }
    public decimal Total { get; set; }
    public string Status { get; set; }
    public required  string PaymentTIntentId { get; set; }
    public required List<OrderItemDto> OrderItems { get; set; }
}