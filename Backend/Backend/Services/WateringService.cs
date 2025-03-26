using Backend.Models;

namespace Backend.Services;

public class WateringService : IWateringService
{
    public IList<WateringBreakdownCell>[] GenerateBreakdown(IList<Ficus> fici)
    {
        return makeBreakDown(fici);
    }

    public IList<WateringBreakdownCell>[] GenerateBreakdown(IFormFile fici)
    {
        
        if (fici.Headers.ContentType.FirstOrDefault((e => e == "text/csv")) == null)
            throw new FormatException("Only .csv files are accepted!");

        IList<Ficus> fileContent = makeFici(fici);

        return makeBreakDown(fileContent);
    }

    private IList<Ficus> makeFici(IFormFile ficusFile)
    {
        IList<Ficus> fici = [];
        using (StreamReader reader = new(ficusFile.OpenReadStream()))
        {
            while (!reader.EndOfStream)
            {
                string[] line = reader.ReadLine().Split(',');
                fici.Add(
                    new()
                    {
                        Name = line[0],
                        Type = line[1],
                        Consumption = Convert.ToDouble(line[2]),
                        Frequency = Convert.ToInt32(line[3]) 
                    });
            }
        }
        return fici;
    }

    private IList<WateringBreakdownCell>[] makeBreakDown(IList<Ficus> fici)
    {
        IList<WateringBreakdownCell>[] breakdown = [[], [], [], [], []];

        for (int i = 0; i < 30; i++)
        {
            WateringBreakdownCell cell = new()
            {
                Day = i + 1,
                Type = "",
                TotalConsumption = 0
            };
            
            IEnumerable<Ficus> actualFici = fici.Where(e => cell.Day % e.Frequency == 0);

            cell.TotalConsumption = actualFici.Sum(x => x.Consumption);
            cell.Type = actualFici.Any() ? actualFici.Count() > 1 ? "Multiple" : "Single" : "None";
            
            breakdown[i/7].Add(cell);
        }
        return breakdown;
    }
}