using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Home_Media.Models;

namespace Home_Media.Data
{
    public partial class movieDataContext : DbContext
    {
        public movieDataContext()
        {
        }

        public movieDataContext(DbContextOptions<movieDataContext> options)
            : base(options)
        {
        }

        public virtual DbSet<MoviesModel> Movies { get; set; }
        public virtual DbSet<SeriesModel> Series { get; set; }
        public virtual DbSet<LiveModel> Live { get; set; }
        public virtual DbSet<FilipinoModel> Filipino { get; set; }
        public virtual DbSet<ViewingModel> Viewing { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<MoviesModel>(entity =>
            {
                entity.Property(e => e.ID).HasColumnName("ID");

                entity.Property(e => e.Title)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.FileName)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Actors)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Director)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Genre)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Plot)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.PosterArt)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Rated)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Released)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Runtime)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Year)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.imdbId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.imdbRating)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<SeriesModel>(entity =>
            {
                entity.Property(e => e.ID).HasColumnName("ID");

                entity.Property(e => e.Title)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.FileName)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Actors)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Director)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Genre)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Plot)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.PosterArt)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Rated)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Released)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Runtime)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Year)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.imdbId)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.imdbRating)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Series)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Season)
                    .IsUnicode(false);

                entity.Property(e => e.Episode)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<ViewingModel>(entity =>
            {
                entity.Property(e => e.ID).HasColumnName("ID");

                entity.Property(e => e.MediaType)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.MediaID)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ProfileID)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Progress)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.ActiveID)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
