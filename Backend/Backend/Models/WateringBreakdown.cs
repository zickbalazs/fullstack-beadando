namespace Backend.Models;

public class WateringBreakdown
{
    public IList<WateringBreakdownCell>[] TableRows { get; set; }
    public WateringTotalStatistics[] Breakdown { get; set; }
}