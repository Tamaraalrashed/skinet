using System.Linq.Expressions;
using Core.Entities.OrderAggregate;

namespace Core.Specifications;

public class OrderSpecification:BaseSpecification<Order>
{
    public OrderSpecification(string email, List<string>? includes = null,string? orderBy = null) : base(x =>
        x.BuyerEmail == email)
    {
        if(includes != null)
            foreach (var include in includes)
            {
                SetIncludes(include);
            }
        
        if (orderBy != null)
            ApplyOrderByFromString(orderBy);
        
    }

    public OrderSpecification(string email, int id,List<string>? includes = null,string? orderBy=null) : base(x => x.BuyerEmail == email && x.Id == id)
    {
        if(includes != null)
            foreach (var include in includes)
            {
                SetIncludes(include);
            }
        
        if(orderBy != null)
            ApplyOrderByFromString(orderBy);
    }
}