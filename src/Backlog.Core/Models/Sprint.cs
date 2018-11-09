using System.Collections.Generic;



namespace Backlog.Core.Models
{

    public class Sprint
    {
        public int Id { get; set; }
        
        public int? TenantId { get; set; }
        public string Name { get; set; }
        public ICollection<ProductSprint> ProductSprints { get; set; } = new HashSet<ProductSprint>();
        public ICollection<SprintStory> SprintStories { get; set; } = new HashSet<SprintStory>();
        public bool IsDeleted { get; set; }

        public virtual Tenant Tenant { get; set; }
    }
}
