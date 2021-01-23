using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Home_Media.Models
{
    public partial class Media
    {
        public List<MatchedModel> Matched { get; set; }
        public List<MatchedModel> Alerts { get; set; }
        public bool? Loaded { get; set; }
    }
}
