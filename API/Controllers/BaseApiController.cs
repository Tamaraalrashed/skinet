using API.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
[ApiController]
[Route("api/[controller]")]
public class BaseApiController:ControllerBase
{
    protected async Task<ActionResult> CreatePageResult<T>(IGenericRepository<T> repo,
        ISpecification<T> spec, int pageIndex, int pageSize) where T : BaseEntity
    {
        var count = await repo.CountAsync(spec);
        var items=await repo.ListAsync(spec);
        var pagination=new Pagination<T>(pageIndex, pageSize, count, items);
   
        return Ok(pagination);
    }
}