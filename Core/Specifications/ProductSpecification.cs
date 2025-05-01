
using Core.Entities;
namespace Core.Specifications;

public class ProductSpecification : BaseSpecification<Product>
{
    public ProductSpecification(string? brand, string? type,string?sort) : base(x =>
        (string.IsNullOrEmpty(brand) || x.Brand == brand) &&
        (string.IsNullOrEmpty(type) || x.Type == type))
    {
        switch (sort)
        {
            case "priceAsc":
              SetOrderBy(x=>x.Price);
                break;
                case  "priceDesc":
                    SetOrderByDesc(x=>x.Price);
                    break;
                    default:
                        SetOrderBy(x=>x.Name);
                        break;
        }
    }


}