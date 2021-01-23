using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Home_Media.Models
{
    public partial class SeriesModel
    {
        public int ID { get; set; }
        public string Title { get; set; }
        public string FileName { get; set; }
        public string Actors { get; set; }
        public string Director { get; set; }
        public string Genre { get; set; }
        public string Plot { get; set; }
        public string PosterArt { get; set; }
        public string Rated { get; set; }
        public string Released { get; set; }
        public string Runtime { get; set; }
        public string Year { get; set; }
        public string imdbId { get; set; }
        public string imdbRating { get; set; }
        public string Series { get; set; }
        public int? Season { get; set; }
        public int? Episode { get; set; }
    }
}
