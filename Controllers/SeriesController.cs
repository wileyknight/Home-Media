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
    public class SeriesController : ControllerBase
    {
        //# CTOR
        private readonly movieDataContext _context;
        private readonly IFileProvider _fileProvider;
        private readonly IMediaService _mediaService;

        public SeriesController(
            movieDataContext context,
            IFileProvider fileProvider,
            IMediaService mediaService)
        {
            _context = context;
            _fileProvider = fileProvider;
            _mediaService = mediaService;
        }

        // GET: api/Series
        [HttpGet]
        public async Task<ActionResult<Media>> Index()
        {
            var Series = await _context.Series.ToListAsync();

            if (Series == null)
            {
                return NotFound();
            }

            var contents = _fileProvider.GetDirectoryContents("/series");

            return _mediaService.RemovedDuplicates(contents, Series);
        }

        // GET: api/Series/title
        [HttpGet("{title}")]
        public async Task<ActionResult<Media>> GetSeries(string title)
        {
            var Series = from m in _context.Series
                         select m;

            if (!String.IsNullOrEmpty(title))
            {
                Series = Series.Where(s => s.Title.Contains(title));
            }

            var contents = _fileProvider.GetDirectoryContents("/series/"+title);

            return _mediaService.RemovedExploreDuplicates(contents, Series, title);
        }

        [HttpGet("{path}/{title}")]
        public async Task<ActionResult<Media>> GetSeries(string path, string title)
        {
            var Series = from m in _context.Series
                         select m;

            if (!String.IsNullOrEmpty(title))
            {
                Series = Series.Where(s => s.Title.Contains(title));
            }

            var contents = _fileProvider.GetDirectoryContents("/series/" + path);

            return _mediaService.RemovedExploreDuplicates(contents, Series, title);
        }

        // GET: api/Series/5
        /*
        [HttpGet("{id}")]
        public async Task<ActionResult<SeriesModel>> GetSeriesEpisode(string title, int id)
        {
            var Series = await _context.Series.FindAsync(id);

            if (Series == null)
            {
                return NotFound();
            }

            return Series;
        }
        */

        // PUT: api/Series/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSeries(int id, SeriesModel Series)
        {
            if (id != Series.ID)
            {
                return BadRequest();
            }

            _context.Entry(Series).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeriesExists(id))
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

        // POST: api/Series
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<SeriesModel>> PostSeries([FromBody] SeriesModel Series)
        {
            _context.Series.Add(Series);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSeries", new { id = Series.ID }, Series);
        }

        // DELETE: api/Series/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<SeriesModel>> DeleteSeries(int id)
        {
            var Series = await _context.Series.FindAsync(id);
            if (Series == null)
            {
                return NotFound();
            }

            _context.Series.Remove(Series);
            await _context.SaveChangesAsync();

            return Series;
        }

        private bool SeriesExists(int id)
        {
            return _context.Series.Any(e => e.ID == id);
        }
    }
}
