using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Home_Media.Data;
using Home_Media.Models;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Home_Media.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ViewingController : ControllerBase
    {
        private readonly movieDataContext _context;

        public ViewingController(
            movieDataContext context)
        {
            _context = context;
        }

        // GET: api/<ViewingController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ViewingModel>>> Index()
        {
            var Viewing = await _context.Viewing.ToListAsync();

            if (Viewing == null)
            {
                return NotFound();
            }

            return Ok(Viewing);
        }

        // GET api/<ViewingController>/searchstring/id
        [HttpGet("{mediaString}/{id}")]
        public ActionResult<ViewingModel> GetViewing(string mediaString, int id)
        {
            var Viewing = from m in _context.Viewing
                         select m;

            if (!String.IsNullOrEmpty(mediaString))
            {
                Viewing = Viewing.Where(s => s.MediaType.Contains(mediaString));
                Viewing = Viewing.Where(s => s.MediaID.Equals(id));
            }

            if (!Viewing.Any())
            {
                return NotFound();
            }

            return Ok(Viewing);
        }

        // POST api/<ViewingController>
        [HttpPost]
        public async Task<ActionResult<ViewingModel>> PostViewing([FromBody] ViewingModel Viewing)
        {
            _context.Viewing.Add(Viewing);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetViewing", new { id = Viewing.ID }, Viewing);
        }

        // PUT api/<ViewingController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutViewing(int id, [FromBody] ViewingModel Viewing)
        {
            if (id != Viewing.ID)
            {
                return BadRequest();
            }

            _context.Entry(Viewing).State = EntityState.Modified;

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

            return Ok(new { saved = "true" });
        }

        // DELETE api/<ViewingController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }

        private bool MoviesExists(int id)
        {
            return _context.Movies.Any(e => e.ID == id);
        }
    }
}
