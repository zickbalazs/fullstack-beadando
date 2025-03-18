using Backend.Models;

namespace Backend.Services;

public interface IWateringService
{
    IList<WateringBreakdownCell> GenerateBreakdown(IList<Ficus> fici);
    IList<WateringBreakdownCell> GenerateBreakdown(IFormFile fici);

}