using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.FileProviders;
using Home_Media.Models;

namespace Home_Media.Services
{
    public partial interface IMediaService
    {
        Media MatchMediaByType(IDirectoryContents contents, List<MoviesModel> media);

        Media MatchMedia(IDirectoryContents contents, List<MoviesModel> media);

        Media RemovedDuplicates(IDirectoryContents contents, List<SeriesModel> media);
        Media RemovedExploreDuplicates(IDirectoryContents contents, IQueryable<SeriesModel> media, string title);
    }
}
