using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Home_Media.Data;
using Home_Media.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Home_Media.Services;

namespace Home_Media.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        //# CTOR
        private readonly movieDataContext _context;
        private readonly IFileProvider _fileProvider;
        private readonly IMediaService _mediaService;

        public MoviesController(
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
            var Movies = await _context.Movies.ToListAsync();

            if (Movies == null)
            {
                return NotFound();
            }

            var contents = _fileProvider.GetDirectoryContents("/movies");

            return _mediaService.MatchMedia(contents, Movies);
        }

        // GET: api/Movies/title
        [HttpGet("{title}")]
        public IActionResult GetMovieTitle(string title)
        {
            var movies = from m in _context.Movies
                         select m;

            if (!String.IsNullOrEmpty(title))
            {
                movies = movies.Where(s => s.Title.Contains(title));
            }

            return Ok(movies);
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
    }
}
