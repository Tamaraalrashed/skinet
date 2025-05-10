
using Core.Entities;
namespace Core.Specifications;

public class ProductSpecification : BaseSpecification<Product>
{
    public ProductSpecification(ProductSpecParams specParams) : base(x =>
        (specParams.Brands.Count==0 || specParams.Brands.Contains(x.Brand)) &&
        (specParams.Types.Count==0 || specParams.Types.Contains(x.Type))&&
        (string.IsNullOrEmpty(specParams.Search) || x.Name.ToLower().Contains(specParams.Search)))
    {
        SetIsPaginationEnabled(specParams.PageSize*(specParams.PageIndex - 1),specParams.PageSize);
        switch (specParams.Sort)
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