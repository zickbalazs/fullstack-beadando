using Backend.Models;

namespace Backend.Services;

public class WateringService : IWateringService
{
    public IList<WateringBreakdownCell> GenerateBreakdown(IList<Ficus> fici)
    {
        return makeBreakDown(fici);
    }

    public IList<WateringBreakdownCell> GenerateBreakdown(IFormFile fici)
    {
        
        if (fici.Headers.ContentType.FirstOrDefault((e => e == "text/csv")) == null)
            throw new FormatException("Only .csv files are accepted!");

        IList<Ficus> fileContent = makeFici(fici);

        IList<WateringBreakdownCell> output = makeBreakDown(fileContent);

        return output;
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

    private IList<WateringBreakdownCell> makeBreakDown(IList<Ficus> fici)
    {
        IList<WateringBreakdownCell> list = Enumerable.Range(1, 30).Select(x=>new WateringBreakdownCell()
        {
            Day = x,
            Type = "None",
            TotalConsumption = 0
        }).ToList();

        foreach (WateringBreakdownCell cell in list)
        {
            IEnumerable<Ficus> thisDayFici = fici.Where(x => cell.Day % x.Frequency == 0);
            int amountFici = thisDayFici.Count();
            cell.TotalConsumption = thisDayFici.Sum(x => x.Consumption);
            cell.Type = amountFici == 0 ? "None" : amountFici > 1 ? "Multiple" : "Single";
        }
        
        return list;
    }
}