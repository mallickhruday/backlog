using System;
using System.Collections.Generic;






namespace Backlog.Core.Models
{

    public class SocialMediaAccount: ILoggable
    {
        public int Id { get; set; }        
		
        public int? TenantId { get; set; }        
        public int? ProfileId { get; set; }
        public int? UserId { get; set; }

             
        		   
		public string Name { get; set; }
        public string Title { get; set; }
        public DateTime CreatedOn { get; set; }        
		public DateTime LastModifiedOn { get; set; }        
		public string CreatedBy { get; set; }        
		public string LastModifiedBy { get; set; }        
		public bool IsDeleted { get; set; }
        public virtual Tenant Tenant { get; set; }
        public User User { get; set; }
        public Profile Profile { get; set; }
    }
}