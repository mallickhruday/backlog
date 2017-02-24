using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backlog.Data.Models
{
    public class Feature
    {
        public int Id { get; set; }
        [ForeignKey("FeatureCategory")]
        public int? FeatureCategoryId { get; set; }
        public FeatureCategory FeatureCategory { get; set; }
        public string Name { get; set; }
        public ICollection<BrandFeature> BrandFeatures { get; set; } = new HashSet<BrandFeature>();
        public bool IsDeleted { get; set; }
    }
}