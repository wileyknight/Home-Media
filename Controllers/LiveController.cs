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
    public class LiveController : ControllerBase
    {
        //# CTOR
        private readonly movieDataContext _context;
        private readonly IFileProvider _fileProvider;
        private readonly IMediaService _mediaService;

        public LiveController(
            movieDataContext context,
            IFileProvider fileProvider,
            IMediaService mediaService)
        {
            _context = context;
            _fileProvider = fileProvider;
            _mediaService = mediaService;
        }

        // GET: api/Live
        [HttpGet]
        public async Task<ActionResult<Media>> Index()
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
            
            return _mediaService.MatchMedia(contents, Movies);
        }

        // GET: api/Live/title
        [HttpGet("{title}")]
        public IActionResult GetMovieTitle(string title)
        {
            var live = from m in _context.Live
                         select m;

            if (!String.IsNullOrEmpty(title))
            {
                live = live.Where(s => s.Title.Contains(title));
            }

            return Ok(live);
        }

        // PUT: api/Movies/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLive(int id, LiveModel Live)
        {
            if (id != Live.ID)
            {
                return BadRequest();
            }

            _context.Entry(Live).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LiveExists(id))
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
        public async Task<ActionResult<LiveModel>> PostLive([FromBody] LiveModel Live)
        {
            _context.Live.Add(Live);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLive", new { id = Live.ID }, Live);
        }

        // DELETE: api/Movies/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<LiveModel>> DeleteLive(int id)
        {
            var Live = await _context.Live.FindAsync(id);
            if (Live == null)
            {
                return NotFound();
            }

            _context.Live.Remove(Live);
            await _context.SaveChangesAsync();

            return Live;
        }

        private bool LiveExists(int id)
        {
            return _context.Live.Any(e => e.ID == id);
        }
    }
}
