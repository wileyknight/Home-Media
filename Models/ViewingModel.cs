using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Home_Media.Models
{
    public partial class ViewingModel
    {
        public int ID { get; set; }
        public string MediaType { get; set; }
        public int MediaID { get; set; }
        public int ProfileID { get; set; }
        public decimal Progress { get; set; }
        public int ActiveID { get; set; }
    }
}
