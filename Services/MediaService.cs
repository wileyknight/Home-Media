using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Home_Media.Data;
using Home_Media.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;


namespace Home_Media.Services
{
    public partial class MediaService : IMediaService
    {
        public MediaService() {}

        public virtual Media MatchMediaByType(IDirectoryContents contents, List<MoviesModel> media)
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
            organized.Loaded = true;

            return organized;
        }

        public virtual Media MatchMedia(IDirectoryContents contents, List<MoviesModel> media)
        {

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
                var removeCopies = dropExtension.Replace("_1", "").Replace("_2", "").Replace("_3", "").Replace("_4", "").Replace("_5", "").Replace("_6", "");
                var removeDeleted = removeCopies.Replace(" Deleted Scenes", "");

                if (copy == removeDeleted)
                {
                    duplicate++;
                }
                else
                {
                    copy = removeCopies;
                }

                if (duplicate == 0)
                {
                    foreach (MoviesModel m in media)
                    {
                        if (fileInfo.Name == m.FileName)
                        {
                            combined.ID = m.ID;
                            combined.matched = true;
                            combined.Title = m.Title;
                            combined.PosterArt = m.PosterArt;
                            combined.Actors = m.Actors;
                            combined.Director = m.Director;
                            combined.Genre = m.Genre;
                            combined.Runtime = m.Runtime;
                            combined.Rated = m.Rated;
                            combined.Released = m.Released;
                            combined.Year = m.Year;
                            combined.Plot = m.Plot;
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

            Media organized = new Media();
            organized.Matched = matched;
            organized.Alerts = alerts;
            organized.Loaded = true;

            return organized;
        }

        public virtual Media RemovedDuplicates(IDirectoryContents contents, List<SeriesModel> media)
        {

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
                    foreach (SeriesModel m in media)
                    {
                        if (fileInfo.Name == m.FileName)
                        {
                            combined.ID = m.ID;
                            combined.matched = true;
                            combined.Title = m.Title;
                            combined.PosterArt = m.PosterArt;
                            combined.duplicates = duplicate;
                            combined.Series = m.Series;
                            combined.Season = m.Season;
                            combined.Episode = m.Episode;
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

            Media organized = new Media();
            organized.Matched = matched;
            organized.Alerts = alerts;
            organized.Loaded = true;

            return organized;
        }

        public virtual Media RemovedExploreDuplicates(IDirectoryContents contents, IQueryable<SeriesModel> media, string title = "")
        {

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
                    foreach (SeriesModel m in media)
                    {
                        if (fileInfo.Name == m.FileName)
                        {
                            combined.ID = m.ID;
                            combined.matched = true;
                            combined.Title = m.Title;
                            combined.PosterArt = m.PosterArt;
                            combined.duplicates = duplicate;
                            combined.Series = m.Series;
                            combined.Season = m.Season;
                            combined.Episode = m.Episode;
                            if (title != "")
                            {
                                combined.FileName = m.FileName;
                            }
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

            Media organized = new Media();
            organized.Matched = matched;
            organized.Alerts = alerts;
            organized.Loaded = true;

            return organized;
        }
    }
}
