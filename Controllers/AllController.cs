using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Home_Media.Data;
using Home_Media.Models;
using Home_Media.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

namespace Home_Media.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AllController : ControllerBase
    {
        //# CTOR
        private readonly movieDataContext _context;
        private readonly IFileProvider _fileProvider;
        private readonly IMediaService _mediaService;

        public AllController(
            movieDataContext context,
            IFileProvider fileProvider,
            IMediaService mediaService)
        {
            _context = context;
            _fileProvider = fileProvider;
            _mediaService = mediaService;
        }

        // GET: api/Movies
        [HttpGet]
        public async Task<ActionResult<Media>> Movies()
        {
            var Movies = await _context.Movies.ToListAsync();

            if (Movies == null)
            {
                return NotFound();
            }

            var contents = _fileProvider.GetDirectoryContents("/movies");

            return organize(contents, Movies);
        }

        [HttpGet]
        public async Task<ActionResult<Media>> Live()
        {
            var Live = await _context.Live.ToListAsync();

            if (Live == null)
            {
                return NotFound();
            }

            List<MoviesModel> Movies = new List<MoviesModel>();

            foreach (LiveModel l in Live)
            {
                var conversion = new MoviesModel
                {
                    ID = l.ID,
                    Title = l.Title,
                    FileName = l.FileName,
                    Actors = l.Actors,
                    Director = l.Director,
                    Genre = l.Genre,
                    Plot = l.Plot,
                    PosterArt = l.PosterArt,
                    Rated = l.Rated,
                    Released = l.Released,
                    Runtime = l.Runtime,
                    Year = l.Year,
                    imdbId = l.imdbId,
                    imdbRating = l.imdbRating
                };

                Movies.Add(conversion);
            }

            var contents = _fileProvider.GetDirectoryContents("/live");

            return _mediaService.MatchMediaByType(contents, Movies);
        }

        [HttpGet]
        public async Task<ActionResult<Media>> Filipino()
        {
            var Filipino = await _context.Filipino.ToListAsync();

            if (Filipino == null)
            {
                return NotFound();
            }

            List<MoviesModel> Movies = new List<MoviesModel>();

            foreach (FilipinoModel f in Filipino)
            {
                var conversion = new MoviesModel
                {
                    ID = f.ID,
                    Title = f.Title,
                    FileName = f.FileName,
                    Actors = f.Actors,
                    Director = f.Director,
                    Genre = f.Genre,
                    Plot = f.Plot,
                    PosterArt = f.PosterArt,
                    Rated = f.Rated,
                    Released = f.Released,
                    Runtime = f.Runtime,
                    Year = f.Year,
                    imdbId = f.imdbId,
                    imdbRating = f.imdbRating
                };

                Movies.Add(conversion);
            }

            var contents = _fileProvider.GetDirectoryContents("/filipino");

            return _mediaService.MatchMediaByType(contents, Movies);

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SeriesModel>>> Series()
        {
            var Series = await _context.Series.ToListAsync();

            if (Series == null)
            {
                return NotFound();
            }

            var contents = _fileProvider.GetDirectoryContents("/series");

            List<MatchedModel> matched = new List<MatchedModel>();
            List<MatchedModel> alerts = new List<MatchedModel>();

            foreach (IFileInfo fileInfo in contents)
            {
                var combined = new MatchedModel
                {
                    name = fileInfo.Name,
                    exists = fileInfo.Exists,
                    physicalPath = fileInfo.PhysicalPath,
                    length = fileInfo.Length,
                    lastModified = fileInfo.LastModified,
                    isDirectory = fileInfo.IsDirectory,
                    matched = false
                };

                foreach (SeriesModel m in Series)
                {
                    if (fileInfo.Name == m.FileName)
                    {
                        combined.ID = m.ID;
                        combined.matched = true;
                        combined.Title = m.Title;
                        combined.PosterArt = m.PosterArt;
                    }
                }
                if (combined.matched == true)
                {
                    matched.Add(combined);
                }
                else
                {
                    alerts.Add(combined);
                }

            }

            return Ok(new { matched, alerts, });

        }

        [HttpGet("{title}")]
        public async Task<ActionResult<IEnumerable<SeriesModel>>> Series(string title)
        {
            var Series = from m in _context.Series
                         select m;

            if (!String.IsNullOrEmpty(title))
            {
                Series = Series.Where(s => s.Title.Contains(title));
            }

            var contents = _fileProvider.GetDirectoryContents("/series/" + title);

            List<MatchedModel> matched = new List<MatchedModel>();
            List<MatchedModel> alerts = new List<MatchedModel>();

            string copy = "";

            foreach (IFileInfo fileInfo in contents)
            {
                var combined = new MatchedModel
                {
                    name = fileInfo.Name,
                    exists = fileInfo.Exists,
                    physicalPath = fileInfo.PhysicalPath,
                    length = fileInfo.Length,
                    lastModified = fileInfo.LastModified,
                    isDirectory = fileInfo.IsDirectory,
                    matched = false
                };

                var duplicate = 0;

                var dropExtension = fileInfo.Name.Substring(0, fileInfo.Name.Length - 4);
                var removeSubs = dropExtension.Replace(" subs", "").Replace(" Subs", "");
                var removeMultiparts = removeSubs.Replace(" MP1", "").Replace(" MP2", "");
                var removeCommentary = removeMultiparts.Replace(" commentary", "");
                var removeCopies = removeCommentary.Replace("_1", "").Replace("_2", "");

                if (copy == removeCopies)
                {
                    duplicate++;
                }
                else
                {
                    copy = removeCopies;
                }

                if (duplicate == 0)
                {
                    foreach (SeriesModel m in Series)
                    {
                        if (fileInfo.Name == m.FileName)
                        {
                            combined.ID = m.ID;
                            combined.matched = true;
                            combined.Title = m.Title;
                            combined.PosterArt = m.PosterArt;
                            combined.duplicates = duplicate;
                        }
                    }

                    if (combined.matched == true)
                    {
                        matched.Add(combined);
                    }
                    else
                    {
                        alerts.Add(combined);
                    }
                }

            }

            return Ok(new { matched, alerts, loaded = true });
        }

        // GET: api/All/title
        [HttpGet("{category}")]
        public async Task<ActionResult<IEnumerable<MoviesModel>>> GetMovieTitle(string category)
        {

            var Movies = await _context.Movies.ToListAsync();

            if (Movies == null)
            {
                return NotFound();
            }

            var contents = _fileProvider.GetDirectoryContents("/movies");

            List<MatchedModel> matched = new List<MatchedModel>();
            List<MatchedModel> alerts = new List<MatchedModel>();

            foreach (IFileInfo fileInfo in contents)
            {
                var combined = new MatchedModel
                {
                    name = fileInfo.Name,
                    exists = fileInfo.Exists,
                    physicalPath = fileInfo.PhysicalPath,
                    length = fileInfo.Length,
                    lastModified = fileInfo.LastModified,
                    isDirectory = fileInfo.IsDirectory,
                    matched = false
                };

                foreach (MoviesModel m in Movies)
                {
                    if (fileInfo.Name == m.FileName)
                    {
                        combined.ID = m.ID;
                        combined.matched = true;
                        combined.Title = m.Title;
                        combined.PosterArt = m.PosterArt;
                    }
                }
                if (combined.matched == true)
                {
                    matched.Add(combined);
                }
                else
                {
                    alerts.Add(combined);
                }

            }

            return Ok(new { matched, alerts, });
        }

        // PUT: api/Movies/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMovies(int id, MoviesModel Movies)
        {
            if (id != Movies.ID)
            {
                return BadRequest();
            }

            _context.Entry(Movies).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MoviesExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Movies
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<MoviesModel>> PostMovies([FromBody] MoviesModel Movies)
        {
            _context.Movies.Add(Movies);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMovies", new { id = Movies.ID }, Movies);
        }

        // DELETE: api/Movies/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<MoviesModel>> DeleteMovies(int id)
        {
            var Movies = await _context.Movies.FindAsync(id);
            if (Movies == null)
            {
                return NotFound();
            }

            _context.Movies.Remove(Movies);
            await _context.SaveChangesAsync();

            return Movies;
        }

        private bool MoviesExists(int id)
        {
            return _context.Movies.Any(e => e.ID == id);
        }

        private Media organize(IDirectoryContents contents, List<MoviesModel> media)
        {
            List<MatchedModel> matched = new List<MatchedModel>();
            List<MatchedModel> alerts = new List<MatchedModel>();

            foreach (IFileInfo fileInfo in contents)
            {
                var combined = new MatchedModel
                {
                    name = fileInfo.Name,
                    exists = fileInfo.Exists,
                    physicalPath = fileInfo.PhysicalPath,
                    length = fileInfo.Length,
                    lastModified = fileInfo.LastModified,
                    isDirectory = fileInfo.IsDirectory,
                    matched = false
                };

                foreach (MoviesModel m in media)
                {
                    if (fileInfo.Name == m.FileName)
                    {
                        combined.ID = m.ID;
                        combined.matched = true;
                        combined.Title = m.Title;
                        combined.PosterArt = m.PosterArt;
                    }
                }
                if (combined.matched == true)
                {
                    matched.Add(combined);
                }
                else
                {
                    alerts.Add(combined);
                }

            }

            Media organized = new Media();
            organized.Matched = matched;
            organized.Alerts = alerts;

            return organized;
        }
    }
}
