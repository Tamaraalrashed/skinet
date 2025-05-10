using API.DTOs;
using Core.Entities;
using Core.Specifications;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController:BaseApiController
{
    [HttpGet("unauthorized")]
    public IActionResult GetUnauthorized()
    {
        return Unauthorized();
    }  
    
    [HttpGet("badrequest")]
    public IActionResult GetBadRequest()
    {
        return BadRequest("Bad request");
    }
     [HttpGet("notfound")]
    public IActionResult GetNotFound()
    {
        return NotFound();
    }
    
     [HttpGet("internalerror")]
    public IActionResult GetInternalError()
    {
        throw new Exception("Internal error"); 
       
    }  
    [HttpPost("validationerror")]
    public IActionResult GetValidationError(CreateProductDto product )
    {
        return Ok();        
    }
    
}