using Backend.Models;

namespace Backend.Services;

public interface IWateringService
{
    WateringBreakdown GenerateBreakdown(IList<Ficus> fici);
    WateringBreakdown GenerateBreakdown(IFormFile fici);

}