using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class FicusController(IWateringService service) : ControllerBase
{
    
    [HttpPost("file")]
    public ActionResult<IList<WateringBreakdownCell[]>> MakeWateringBreakdown(IFormFile file)
    {
        try
        {
            return Ok(service.GenerateBreakdown(file));
        }
        catch (Exception e)
        {
            return BadRequest(
                this.Problem(e.Message,
                    null,
                    401,
                    "Bad format error",
                    null).Value);
        }
    }
    [HttpPost]
    public ActionResult<IList<WateringBreakdownCell[]>> MakeWateringBreakdown([FromBody] IList<Ficus> fici)
    {
        return Ok(service.GenerateBreakdown(fici));
    }
    
}