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
    [Route("api/[controller]")]
    [ApiController]
    public class FilipinoController : ControllerBase
    {
        //# CTOR
        private readonly movieDataContext _context;
        private readonly IFileProvider _fileProvider;
        private readonly IMediaService _mediaService;

        public FilipinoController(
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
        public async Task<ActionResult<Media>> Index()
        {
            var Filipino = await _context.Filipino.ToListAsync();

            if (Filipino == null)
            {
                return NotFound();
            }

            var contents = _fileProvider.GetDirectoryContents("/filipino");

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

            return _mediaService.MatchMedia(contents, Movies);

        }

        /*
        // GET: api/Movies/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MoviesModel>> GetMovies(int id)
        {
            var Movies = await _context.Movies.FindAsync(id);

            if (Movies == null)
            {
                return NotFound();
            }

            return Movies;
        }
        */
        // GET: api/Movies/title
        [HttpGet("{title}")]
        public IActionResult GetFilipinoTitle(string title)
        {
            var movies = from m in _context.Filipino
                         select m;

            if (!String.IsNullOrEmpty(title))
            {
                movies = movies.Where(s => s.Title.Contains(title));
            }

            return Ok(movies);
        }

        /*
        [HttpGet("{searchString}/{id}")]
        public IActionResult GetCompany(string searchString, int id)
        {
            var movies = from m in _context.Movies
                         select m;

            if (!String.IsNullOrEmpty(searchString))
            {
                movies = movies.Where(s => s.Company.Contains(searchString));
                movies = movies.Where(s => s.Id.Equals(id));
            }

            return Ok(movies);
        }

        [HttpGet("search/{searchString}")]
        public IActionResult GetCompanyMovies(string searchString)
        {
            var movies = from m in _context.Movies
                         select m;

            if (!String.IsNullOrEmpty(searchString))
            {
                movies = movies.Where(s => s.Company.Contains(searchString));
            }

            return Ok(movies);
        }
        */

        // PUT: api/Movies/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFilipino(int id, FilipinoModel Filipino)
        {
            if (id != Filipino.ID)
            {
                return BadRequest();
            }

            _context.Entry(Filipino).State = EntityState.Modified;

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
        public async Task<ActionResult<FilipinoModel>> PostFilipino([FromBody] FilipinoModel Filipino)
        {
            _context.Filipino.Add(Filipino);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFilipino", new { id = Filipino.ID }, Filipino);
        }

        // DELETE: api/Movies/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<FilipinoModel>> DeleteFilipino(int id)
        {
            var Filipino = await _context.Filipino.FindAsync(id);
            if (Filipino == null)
            {
                return NotFound();
            }

            _context.Filipino.Remove(Filipino);
            await _context.SaveChangesAsync();

            return Filipino;
        }

        private bool MoviesExists(int id)
        {
            return _context.Filipino.Any(e => e.ID == id);
        }
    }
}
